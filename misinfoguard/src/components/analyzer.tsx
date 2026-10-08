"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Sparkles, RotateCcw, ScanLine, ChevronDown, Copy, Download, FileJson, ShieldAlert,
  ShieldCheck, Flame, Gauge, Smile, AlertTriangle, BadgeCheck, Tags, Lightbulb, FileSearch, Quote,
} from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from "recharts";
import { Badge, StatCard, RiskGauge } from "@/components/ui";
import { SAMPLE_MESSAGES } from "@/lib/client";
import type { AnalysisResult } from "@/lib/analyzer";

const MAX_CHARS = 3000;

export function AnalyzerInput({
  onAnalyze,
  onReset,
  isLoading,
}: {
  onAnalyze: (message: string) => void;
  onReset: () => void;
  isLoading: boolean;
}) {
  const [message, setMessage] = useState("");
  const [sampleOpen, setSampleOpen] = useState(false);

  const charCount = message.length;
  const overLimit = charCount > MAX_CHARS;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="label-eyebrow">Step 1</p>
          <h2 className="mt-1 font-display text-lg font-semibold text-ink-100">
            Paste the WhatsApp message
          </h2>
        </div>

        <div className="relative">
          <button
            onClick={() => setSampleOpen((o) => !o)}
            className="btn-secondary text-xs"
            type="button"
          >
            <Sparkles size={14} />
            Try a sample
            <ChevronDown size={14} className={sampleOpen ? "rotate-180 transition-transform" : "transition-transform"} />
          </button>
          {sampleOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 z-20 mt-2 w-64 overflow-hidden rounded-xl border border-black/10 bg-base-800 shadow-glass"
            >
              {SAMPLE_MESSAGES.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => {
                    setMessage(s.text);
                    setSampleOpen(false);
                  }}
                  className="block w-full px-4 py-2.5 text-left text-xs text-ink-300 transition-colors hover:bg-black/[0.04] hover:text-ink-100"
                >
                  {s.label}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Paste or type the forwarded WhatsApp message here to check for scams, fake news, spam, and manipulation..."
        rows={9}
        className="w-full resize-none rounded-xl border border-black/[0.07] bg-base-900/60 p-4 text-sm leading-relaxed text-ink-100 placeholder:text-ink-700 outline-none transition-colors focus:border-signal/40"
      />

      <div className="mt-2 flex items-center justify-between">
        <span className={`text-xs ${overLimit ? "text-risk-critical" : "text-ink-700"}`}>
          {charCount} / {MAX_CHARS} characters
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={isLoading || message.trim().length === 0 || overLimit}
          onClick={() => onAnalyze(message)}
          className="btn-primary"
        >
          <ScanLine size={16} />
          {isLoading ? "Analyzing..." : "Analyze Message"}
        </button>
        <button
          type="button"
          onClick={() => {
            setMessage("");
            onReset();
          }}
          className="btn-secondary"
        >
          <RotateCcw size={15} />
          Reset
        </button>
      </div>
    </motion.div>
  );
}

const PIE_COLORS = ["#EA580C", "#6D5CE0", "#D97706", "#0D9488", "#6E7387"];

export function ResultPanel({ result }: { result: AnalysisResult }) {
  const copyResult = async () => {
    const text = [
      `MisinfoGuard Analysis Report`,
      `Classification: ${result.classification}`,
      `Risk Score: ${result.riskScore}/100 (${result.riskLevel})`,
      `Trust Score: ${result.trustScore}/100`,
      `Summary: ${result.summary}`,
      `Reasons: ${result.reasons.join("; ")}`,
      `Suggestions: ${result.suggestions.join("; ")}`,
    ].join("\n");
    await navigator.clipboard.writeText(text);
    toast.success("Result copied to clipboard");
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `misinfoguard-analysis-${result.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("JSON exported");
  };

  const downloadPDF = async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    let y = 18;
    const line = (text: string, size = 11, gap = 7) => {
      doc.setFontSize(size);
      const split: string[] = doc.splitTextToSize(text, 180);
      for (const l of split) {
        if (y > 280) {
          doc.addPage();
          y = 18;
        }
        doc.text(l, 14, y);
        y += gap;
      }
    };
    doc.setFont("helvetica", "bold");
    line("MisinfoGuard - Misinformation Risk Report", 16, 10);
    doc.setFont("helvetica", "normal");
    line(`Generated: ${new Date(result.createdAt).toLocaleString()}`, 9, 8);
    y += 2;
    line(`Classification: ${result.classification}`);
    line(`Risk Score: ${result.riskScore}/100 (${result.riskLevel.toUpperCase()})`);
    line(`Trust Score: ${result.trustScore}/100`);
    line(`Fake Probability: ${result.fakeProbability}%  |  Spam: ${result.spamProbability}%  |  Scam: ${result.scamProbability}%`);
    y += 2;
    line("Summary:", 12, 7);
    line(result.summary);
    y += 2;
    line("Reasons:", 12, 7);
    result.reasons.forEach((r) => line(`- ${r}`, 10, 6));
    y += 2;
    line("Suggestions:", 12, 7);
    result.suggestions.forEach((s) => line(`- ${s}`, 10, 6));
    y += 2;
    if (result.keywords.length) {
      line("Detected Keywords: " + result.keywords.join(", "), 10, 6);
    }
    doc.save(`misinfoguard-analysis-${result.id}.pdf`);
    toast.success("PDF report downloaded");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="label-eyebrow">Step 2</p>
          <h2 className="mt-1 font-display text-lg font-semibold text-ink-100">Analysis Result</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={copyResult} className="btn-secondary text-xs">
            <Copy size={14} /> Copy Result
          </button>
          <button onClick={downloadPDF} className="btn-secondary text-xs">
            <Download size={14} /> Download PDF
          </button>
          <button onClick={exportJSON} className="btn-secondary text-xs">
            <FileJson size={14} /> Export JSON
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="glass-card flex flex-col items-center justify-center p-8">
          <RiskGauge score={result.riskScore} level={result.riskLevel} />
          <div className="mt-5 text-center">
            <Badge variant={result.riskLevel === "low" ? "signal" : result.riskLevel === "moderate" ? "warning" : "danger"}>
              {result.classification}
            </Badge>
          </div>
        </div>

        <div className="glass-card col-span-2 p-6">
          <p className="label-eyebrow mb-3">AI Summary</p>
          <p className="text-sm leading-relaxed text-ink-300">{result.summary}</p>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <MiniMetric icon={ShieldCheck} label="Trust Score" value={result.trustScore} accent="#0D9488" />
            <MiniMetric icon={Gauge} label="Confidence" value={result.confidenceScore} accent="#6D5CE0" />
            <MiniMetric icon={Flame} label="Urgency" value={result.urgencyScore} accent="#D97706" />
          </div>

          {result.factCheckRecommended && (
            <div className="mt-5 flex items-start gap-2 rounded-xl border border-risk-mid/25 bg-risk-mid/10 p-3">
              <AlertTriangle size={16} className="mt-0.5 shrink-0 text-risk-mid" />
              <p className="text-xs text-ink-300">
                Fact-check recommended before forwarding or acting on this message.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={ShieldAlert} label="Fake News Probability" value={result.fakeProbability} accent="#EA580C" />
        <StatCard icon={Tags} label="Spam Probability" value={result.spamProbability} accent="#D97706" delay={0.05} />
        <StatCard icon={AlertTriangle} label="Scam Probability" value={result.scamProbability} accent="#DC2626" delay={0.1} />
        <StatCard icon={BadgeCheck} label="Clickbait Score" value={result.clickbaitScore} accent="#6D5CE0" delay={0.15} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card p-6">
          <p className="label-eyebrow mb-4">Risk Category Breakdown</p>
          {result.categoryBreakdown.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={result.categoryBreakdown}
                  dataKey="value"
                  nameKey="category"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                >
                  {result.categoryBreakdown.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "#FFFFFF", border: "1px solid rgba(11,13,20,0.10)", borderRadius: 12, fontSize: 12 }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="flex h-[220px] items-center justify-center text-sm text-ink-700">
              No risk categories triggered.
            </p>
          )}
        </div>

        <div className="glass-card p-6">
          <p className="label-eyebrow mb-4">Sentiment &amp; Emotion</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={[
                { name: "Sentiment", value: Math.round(result.sentiment.score * 100) },
                { name: "Emotion", value: Math.round(result.emotion.score * 100) },
                { name: "Urgency", value: result.urgencyScore },
                { name: "Confidence", value: result.confidenceScore },
              ]}
            >
              <CartesianGrid stroke="rgba(11,13,20,0.08)" vertical={false} />
              <XAxis dataKey="name" stroke="#6E7387" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#6E7387" fontSize={11} tickLine={false} axisLine={false} width={28} />
              <Tooltip
                contentStyle={{ background: "#FFFFFF", border: "1px solid rgba(11,13,20,0.10)", borderRadius: 12, fontSize: 12 }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#6D5CE0" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 flex justify-between text-xs text-ink-500">
            <span className="flex items-center gap-1"><Smile size={13}/> {result.sentiment.label}</span>
            <span>Emotion: {result.emotion.label}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <InfoList
          icon={Tags}
          title="Detected Keywords"
          items={result.keywords}
          empty="No notable keywords detected."
          variant="default"
        />
        <InfoList
          icon={Quote}
          title="Suspicious Phrases"
          items={result.suspiciousPhrases}
          empty="No suspicious phrases detected."
          variant="danger"
        />
        <InfoList
          icon={FileSearch}
          title="Reasons"
          items={result.reasons}
          empty="No reasons flagged."
          variant="default"
          numbered
        />
        <InfoList
          icon={Lightbulb}
          title="Suggestions"
          items={result.suggestions}
          empty="No suggestions."
          variant="signal"
          numbered
        />
      </div>
    </motion.div>
  );
}

function MiniMetric({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: any;
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div className="rounded-xl border border-black/[0.06] bg-black/[0.025] p-3">
      <div className="flex items-center gap-1.5">
        <Icon size={13} style={{ color: accent }} />
        <span className="text-[11px] text-ink-500">{label}</span>
      </div>
      <p className="mt-1 font-display text-xl font-semibold text-ink-100">{value}</p>
    </div>
  );
}

function InfoList({
  icon: Icon,
  title,
  items,
  empty,
  variant,
  numbered,
}: {
  icon: any;
  title: string;
  items: string[];
  empty: string;
  variant: "default" | "danger" | "signal";
  numbered?: boolean;
}) {
  return (
    <div className="glass-card p-6">
      <div className="mb-3 flex items-center gap-2">
        <Icon size={15} className="text-ink-500" />
        <p className="label-eyebrow">{title}</p>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-ink-700">{empty}</p>
      ) : numbered ? (
        <ol className="space-y-2">
          {items.map((it, i) => (
            <li key={i} className="flex gap-2 text-sm text-ink-300">
              <span className="text-ink-700">{i + 1}.</span>
              <span>{it}</span>
            </li>
          ))}
        </ol>
      ) : (
        <div className="flex flex-wrap gap-2">
          {items.map((it, i) => (
            <Badge key={i} variant={variant}>
              {it}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
