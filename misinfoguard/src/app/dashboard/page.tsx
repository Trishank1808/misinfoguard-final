"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ScanSearch,
  ShieldAlert,
  TrendingUp,
  Activity,
  ArrowUpRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { StatCard } from "@/components/ui";
import { useHistory, riskLevelBg, riskLevelColor, truncate, formatDate } from "@/lib/client";

export default function DashboardPage() {
  const { entries, hydrated } = useHistory();

  const totalAnalyzed = entries.length;
  const avgRisk = totalAnalyzed
    ? Math.round(entries.reduce((s, e) => s + e.riskScore, 0) / totalAnalyzed)
    : 0;
  const highRiskCount = entries.filter((e) => e.riskLevel === "high" || e.riskLevel === "critical").length;
  const avgTrust = totalAnalyzed
    ? Math.round(entries.reduce((s, e) => s + e.trustScore, 0) / totalAnalyzed)
    : 100;

  const trendData = [...entries]
    .slice(0, 12)
    .reverse()
    .map((e, i) => ({ name: `#${i + 1}`, risk: e.riskScore, trust: e.trustScore }));

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
      >
        <div>
          <p className="label-eyebrow">Overview</p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-ink-100 sm:text-3xl">
            Welcome back 👋
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            Here&apos;s a snapshot of your misinformation risk analysis activity.
          </p>
        </div>
        <Link href="/dashboard/analyzer" className="btn-primary">
          <ScanSearch size={16} />
          New Analysis
        </Link>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Activity} label="Messages Analyzed" value={totalAnalyzed} suffix="" accent="#6D5CE0" />
        <StatCard icon={ShieldAlert} label="Average Risk Score" value={avgRisk} accent="#EA580C" delay={0.05} />
        <StatCard icon={TrendingUp} label="Average Trust Score" value={avgTrust} accent="#0D9488" delay={0.1} />
        <StatCard icon={ScanSearch} label="High Risk Flags" value={highRiskCount} suffix="" accent="#D97706" delay={0.15} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card col-span-2 p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="label-eyebrow">Risk Trend</p>
              <h3 className="mt-1 font-display text-lg font-semibold text-ink-100">Recent Analyses</h3>
            </div>
          </div>
          {trendData.length > 1 ? (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#EA580C" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#EA580C" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="trustGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0D9488" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#0D9488" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(11,13,20,0.08)" vertical={false} />
                <XAxis dataKey="name" stroke="#6E7387" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#6E7387" fontSize={11} tickLine={false} axisLine={false} width={28} />
                <Tooltip
                  contentStyle={{
                    background: "#FFFFFF",
                    border: "1px solid rgba(11,13,20,0.10)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Area type="monotone" dataKey="risk" stroke="#EA580C" fill="url(#riskGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="trust" stroke="#0D9488" fill="url(#trustGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-56 flex-col items-center justify-center text-center text-ink-700">
              <ScanSearch size={28} className="mb-2 opacity-50" />
              <p className="text-sm">Analyze a few messages to see your risk trend here.</p>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-card p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <p className="label-eyebrow">Latest</p>
            <Link href="/dashboard/history" className="btn-ghost">
              View all <ArrowUpRight size={13} />
            </Link>
          </div>
          <div className="space-y-3">
            {!hydrated ? null : entries.length === 0 ? (
              <p className="py-8 text-center text-sm text-ink-700">No analyses yet.</p>
            ) : (
              entries.slice(0, 4).map((e) => (
                <Link
                  key={e.id}
                  href="/dashboard/history"
                  className={`block rounded-xl border p-3 transition-colors hover:border-black/20 ${riskLevelBg(e.riskLevel)}`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold ${riskLevelColor(e.riskLevel)}`}>
                      {e.riskScore}/100
                    </span>
                    <span className="text-[10px] text-ink-700">{formatDate(e.createdAt)}</span>
                  </div>
                  <p className="mt-1.5 text-xs text-ink-300">{truncate(e.message, 70)}</p>
                </Link>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
