"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/client";
import type { RiskLevel } from "@/lib/analyzer";

export function Badge({
  children,
  className,
  variant = "default",
}: {
  children: ReactNode;
  className?: string;
  variant?: "default" | "signal" | "warning" | "danger" | "violet";
}) {
  const variants: Record<string, string> = {
    default: "bg-black/[0.04] text-ink-300 border-black/10",
    signal: "bg-signal/10 text-signal border-signal/25",
    warning: "bg-risk-mid/10 text-risk-mid border-risk-mid/25",
    danger: "bg-risk-critical/10 text-risk-critical border-risk-critical/25",
    violet: "bg-violet-500/10 text-violet-500 border-violet-500/25",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "shimmer-bg rounded-lg bg-black/[0.04]",
        className
      )}
    />
  );
}

export function SkeletonResultBlock() {
  return (
    <div className="glass-card space-y-4 p-6">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-8 w-20" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}

export function StatCard({
  icon: Icon,
  label,
  value,
  suffix = "%",
  accent = "#0D9488",
  delay = 0,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  suffix?: string;
  accent?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      className="glass-card p-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${accent}18` }}
          >
            <Icon size={16} style={{ color: accent }} />
          </div>
          <span className="text-xs font-medium text-ink-500">{label}</span>
        </div>
        <span className="font-display text-lg font-semibold text-ink-100">
          {value}
          <span className="text-xs text-ink-500">{suffix}</span>
        </span>
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-black/[0.07]">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: accent }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
          transition={{ delay: delay + 0.1, duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}

const LEVEL_COLOR: Record<RiskLevel, string> = {
  low: "#0D9488",
  moderate: "#D97706",
  high: "#EA580C",
  critical: "#DC2626",
};

const LEVEL_TEXT: Record<RiskLevel, string> = {
  low: "Low Risk",
  moderate: "Moderate Risk",
  high: "High Risk",
  critical: "Critical Risk",
};

export function RiskGauge({
  score,
  level,
  size = 220,
}: {
  score: number;
  level: RiskLevel;
  size?: number;
}) {
  const stroke = 14;
  const radius = (size - stroke) / 2;
  const circumference = radius * Math.PI * 1.5; // 270 degree arc
  const clamped = Math.max(0, Math.min(100, score));
  const progress = (clamped / 100) * circumference;
  const color = LEVEL_COLOR[level];

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-[225deg]"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(11,13,20,0.10)"
            strokeWidth={stroke}
            strokeDasharray={`${circumference} ${circumference * 10}`}
            strokeLinecap="round"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference * 10}`}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={{ duration: 1.1, ease: "easeOut" }}
            style={{ filter: `drop-shadow(0 0 8px ${color}66)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="font-display text-5xl font-bold text-ink-100"
          >
            {clamped}
          </motion.span>
          <span className="mt-1 text-xs text-ink-500">/ 100</span>
        </div>
      </div>
      <span
        className={cn("mt-3 rounded-full border px-3 py-1 text-sm font-semibold")}
        style={{
          color,
          borderColor: `${color}40`,
          backgroundColor: `${color}14`,
        }}
      >
        {LEVEL_TEXT[level]}
      </span>
    </div>
  );
}
