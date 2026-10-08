"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Trash2, X, History as HistoryIcon } from "lucide-react";
import { ResultPanel } from "@/components/analyzer";
import { Badge } from "@/components/ui";
import { useHistory, formatDate, truncate } from "@/lib/client";
import { toast } from "sonner";
import type { HistoryEntry } from "@/lib/analyzer";

export default function HistoryPage() {
  const { entries, hydrated, remove, clear } = useHistory();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<HistoryEntry | null>(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return entries;
    const q = query.toLowerCase();
    return entries.filter(
      (e) =>
        e.message.toLowerCase().includes(q) ||
        e.classification.toLowerCase().includes(q) ||
        e.keywords.some((k) => k.toLowerCase().includes(q))
    );
  }, [entries, query]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="label-eyebrow">Analysis History</p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-ink-100 sm:text-3xl">
            Past Analyses
          </h1>
        </div>
        {entries.length > 0 && (
          <button
            onClick={() => {
              clear();
              toast.success("History cleared");
            }}
            className="btn-secondary text-xs"
          >
            <Trash2 size={14} /> Clear all
          </button>
        )}
      </div>

      <div className="relative max-w-md">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-700" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by content, classification, or keyword..."
          className="w-full rounded-xl border border-black/[0.07] bg-black/[0.02] py-2.5 pl-9 pr-3 text-sm text-ink-100 placeholder:text-ink-700 outline-none focus:border-signal/40"
        />
      </div>

      {!hydrated ? null : filtered.length === 0 ? (
        <div className="glass-card flex flex-col items-center justify-center gap-3 p-16 text-center">
          <HistoryIcon size={32} className="text-ink-700" />
          <p className="text-sm text-ink-500">
            {entries.length === 0 ? "No analyses yet. Run one from the Message Analyzer." : "No results match your search."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((e, i) => (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.3) }}
              className="glass-card flex flex-col p-5"
            >
              <div className="flex items-start justify-between gap-2">
                <Badge variant={e.riskLevel === "low" ? "signal" : e.riskLevel === "moderate" ? "warning" : "danger"}>
                  {e.riskLevel.toUpperCase()} · {e.riskScore}
                </Badge>
                <button
                  onClick={() => {
                    remove(e.id);
                    toast.success("Entry deleted");
                  }}
                  className="rounded-lg p-1.5 text-ink-700 transition-colors hover:bg-black/[0.05] hover:text-risk-critical"
                  aria-label="Delete entry"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <p className="mt-3 flex-1 text-sm text-ink-300">{truncate(e.message, 120)}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[11px] text-ink-700">{formatDate(e.createdAt)}</span>
                <button onClick={() => setSelected(e)} className="btn-ghost text-xs">
                  View details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 !m-0 flex items-start justify-center overflow-y-auto bg-black/70 p-4 py-10 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl rounded-3xl border border-black/10 bg-base-900 p-6 shadow-glass"
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute right-4 top-4 z-10 rounded-lg p-2 text-ink-500 hover:bg-black/[0.05] hover:text-ink-100"
              >
                <X size={18} />
              </button>
              <ResultPanel result={selected} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
