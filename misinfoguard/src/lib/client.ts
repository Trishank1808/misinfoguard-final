"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";
import type { AnalysisResult, HistoryEntry, RiskLevel } from "@/lib/analyzer";

// ---------- Helpers ----------
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function riskLevelColor(level: RiskLevel): string {
  switch (level) {
    case "low":
      return "text-risk-low";
    case "moderate":
      return "text-risk-mid";
    case "high":
      return "text-risk-high";
    case "critical":
      return "text-risk-critical";
  }
}

export function riskLevelBg(level: RiskLevel): string {
  switch (level) {
    case "low":
      return "bg-risk-low/15 border-risk-low/30";
    case "moderate":
      return "bg-risk-mid/15 border-risk-mid/30";
    case "high":
      return "bg-risk-high/15 border-risk-high/30";
    case "critical":
      return "bg-risk-critical/15 border-risk-critical/30";
  }
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function truncate(text: string, max = 90): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trim() + "...";
}

// ---------- Local history (localStorage) ----------
const STORAGE_KEY = "misinfo_analyzer_history_v1";
const MAX_ENTRIES = 100;

export function getHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as HistoryEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveToHistory(entry: HistoryEntry): HistoryEntry[] {
  const existing = getHistory();
  const updated = [entry, ...existing].slice(0, MAX_ENTRIES);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
  return updated;
}

export function deleteFromHistory(id: string): HistoryEntry[] {
  const existing = getHistory().filter((e) => e.id !== id);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  }
  return existing;
}

export function clearHistory(): void {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

// ---------- Hooks ----------
export function useHistory() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setEntries(getHistory());
    setHydrated(true);
  }, []);

  const add = useCallback((entry: AnalysisResult) => {
    setEntries(saveToHistory(entry));
  }, []);

  const remove = useCallback((id: string) => {
    setEntries(deleteFromHistory(id));
  }, []);

  const clear = useCallback(() => {
    clearHistory();
    setEntries([]);
  }, []);

  return { entries, hydrated, add, remove, clear };
}

interface UseAnalysisState {
  result: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
}

export function useAnalysis() {
  const [state, setState] = useState<UseAnalysisState>({
    result: null,
    isLoading: false,
    error: null,
  });
  // Lets reset() (or a newer request) cancel the effect of an in-flight request.
  const requestId = useRef(0);

  const analyze = useCallback(async (message: string) => {
    const id = ++requestId.current;
    setState({ result: null, isLoading: true, error: null });
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error ?? "Analysis failed.");
      if (id !== requestId.current) return null; // reset or superseded while waiting
      setState({ result: data as AnalysisResult, isLoading: false, error: null });
      return data as AnalysisResult;
    } catch (err) {
      if (id !== requestId.current) return null;
      const msg =
        err instanceof Error && !(err instanceof TypeError)
          ? err.message
          : "Something went wrong while analyzing this message.";
      setState({ result: null, isLoading: false, error: msg });
      toast.error(msg);
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    requestId.current++;
    setState({ result: null, isLoading: false, error: null });
  }, []);

  return { ...state, analyze, reset };
}

// ---------- Constants ----------
export const SAMPLE_MESSAGES: { label: string; text: string }[] = [
  {
    label: "Lottery Scam",
    text:
      "CONGRATULATIONS!!! You have won Rs 25,00,000 in the KBC Lottery Winner 2026 draw. " +
      "This is not fake. To claim your prize send your bank account number, UPI PIN and OTP " +
      "immediately to this number. Offer expires today, act immediately! Share with 10 people to activate your claim.",
  },
  {
    label: "Bank / KYC Scam",
    text:
      "Dear customer, your bank account will be blocked within 24 hours because your KYC has expired. " +
      "Click here bit.ly/updatekyc-now to update your KYC and avoid account suspension. Enter your debit card details, CVV number and net banking password to verify.",
  },
  {
    label: "Medical Misinformation",
    text:
      "Doctors don't want you to know this home remedy cures cancer in 7 days! Drink this every morning. " +
      "Hospitals hiding this miracle cure from you. Forward this to all your contacts before it gets deleted, share to save a life!",
  },
  {
    label: "Genuine Message",
    text:
      "Hi, just checking if we are still meeting for lunch tomorrow at 1pm near the office. Let me know if that time works for you, thanks!",
  },
];

export const SIDEBAR_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Message Analyzer", href: "/dashboard/analyzer", icon: "ScanSearch" },
  { label: "Analysis History", href: "/dashboard/history", icon: "History" },
  { label: "About Project", href: "/dashboard/about", icon: "Info" },
  { label: "Settings", href: "/dashboard/settings", icon: "Settings" },
] as const;
