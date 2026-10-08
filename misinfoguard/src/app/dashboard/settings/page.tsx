"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Trash2, Bell, Shield, Palette } from "lucide-react";
import { useHistory } from "@/lib/client";

export default function SettingsPage() {
  const { clear, entries } = useHistory();
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [strictMode, setStrictMode] = useState(false);

  return (
    <div className="max-w-2xl space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="label-eyebrow">Settings</p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-ink-100 sm:text-3xl">
          Preferences
        </h1>
      </motion.div>

      <div className="glass-card divide-y divide-black/[0.06]">
        <ToggleRow
          icon={Bell}
          title="Notifications"
          description="Show in-app toasts for analysis events and reminders."
          checked={notifications}
          onChange={setNotifications}
        />
        <ToggleRow
          icon={Shield}
          title="Auto-save analyses to history"
          description="Automatically store every analyzed message locally on this device."
          checked={autoSave}
          onChange={setAutoSave}
        />
        <ToggleRow
          icon={Palette}
          title="Strict scoring mode"
          description="Increase weight sensitivity for borderline scam and urgency patterns."
          checked={strictMode}
          onChange={setStrictMode}
        />
      </div>

      <div className="glass-card p-6">
        <p className="label-eyebrow">Data</p>
        <h3 className="mt-1 font-display text-base font-semibold text-ink-100">Local Storage</h3>
        <p className="mt-2 text-sm text-ink-500">
          You currently have {entries.length} saved {entries.length === 1 ? "analysis" : "analyses"} stored
          locally in your browser. This data never leaves your device.
        </p>
        <button
          onClick={() => {
            clear();
            toast.success("All local history cleared");
          }}
          className="btn-secondary mt-4 text-xs"
        >
          <Trash2 size={14} /> Clear all history
        </button>
      </div>
    </div>
  );
}

function ToggleRow({
  icon: Icon,
  title,
  description,
  checked,
  onChange,
}: {
  icon: any;
  title: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 p-6">
      <div className="flex gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/[0.04]">
          <Icon size={16} className="text-ink-500" />
        </div>
        <div>
          <p className="text-sm font-medium text-ink-100">{title}</p>
          <p className="mt-1 text-xs text-ink-500">{description}</p>
        </div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-signal" : "bg-black/10"
        }`}
        aria-pressed={checked}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}
