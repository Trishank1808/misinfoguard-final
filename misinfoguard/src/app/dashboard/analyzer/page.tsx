"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AnalyzerInput, ResultPanel } from "@/components/analyzer";
import { SkeletonResultBlock } from "@/components/ui";
import { useAnalysis, useHistory } from "@/lib/client";

export default function AnalyzerPage() {
  const { result, isLoading, analyze, reset } = useAnalysis();
  const { add } = useHistory();

  const handleAnalyze = async (message: string) => {
    const data = await analyze(message);
    if (data) add(data);
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="label-eyebrow">Message Analyzer</p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-ink-100 sm:text-3xl">
          Check a WhatsApp message
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-ink-500">
          Paste a forwarded message below to scan for fake news, scams, spam, clickbait, and
          emotional manipulation patterns using the explainable rule-based risk engine.
        </p>
      </motion.div>

      <AnalyzerInput onAnalyze={handleAnalyze} onReset={reset} isLoading={isLoading} />

      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid gap-6 lg:grid-cols-3"
          >
            <SkeletonResultBlock />
            <div className="lg:col-span-2">
              <SkeletonResultBlock />
            </div>
          </motion.div>
        )}
        {!isLoading && result && (
          <motion.div key="result">
            <ResultPanel result={result} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
