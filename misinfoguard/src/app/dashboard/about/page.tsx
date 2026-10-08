"use client";

import { motion } from "framer-motion";
import {
  Target,
  ListChecks,
  Workflow,
  Layers,
  Rocket,
  Users,
  GraduationCap,
  Building2,
} from "lucide-react";

const SECTIONS = [
  {
    icon: Target,
    title: "Problem Statement",
    body:
      "WhatsApp is one of the largest vectors for the spread of fake news, financial scams, and coordinated misinformation in India and globally. Forwarded messages carry no built-in indicator of trustworthiness, and recipients are left to manually judge credibility — often under emotional or social pressure to forward the message onward. This project builds an explainable, on-device-first risk analyzer that scores a message's likelihood of being a scam, fake news, spam, or manipulative content before it is trusted or forwarded.",
  },
  {
    icon: ListChecks,
    title: "Objectives",
    body:
      "Detect common misinformation and scam patterns using a transparent, weighted rule engine. Produce a multi-dimensional risk profile (trust score, fake/spam/scam probability, sentiment, emotion, urgency) rather than a single opaque label. Present results in a clear, actionable dashboard with keyword highlighting, reasons, and next-step suggestions. Keep the architecture modular so a future LLM-based provider (Gemini/OpenAI) can extend the same interface without frontend changes.",
  },
  {
    icon: Workflow,
    title: "Methodology",
    body:
      "The message is normalized (lowercased, trimmed) and passed through a rule engine composed of independent, weighted detectors — lexical dictionaries for scam/fraud phrasing, regex patterns for suspicious links, and structural heuristics like excessive capitalization or emoji density. Each triggered rule contributes a weight toward the overall risk score, and the aggregate is mapped to a risk level (low/moderate/high/critical). Sentiment and emotion are derived independently through lexicon-based scoring.",
  },
  {
    icon: Layers,
    title: "Technology Stack",
    body:
      "Next.js 14 (App Router) with TypeScript powers both the frontend UI and the backend API route (/api/analyze), Tailwind CSS drives the design system, Framer Motion handles animation, and Recharts renders the gauge, pie, and trend visualizations. History persists locally via the browser's storage layer so the app works fully offline with no database dependency.",
  },
  {
    icon: Rocket,
    title: "Future Scope",
    body:
      "Swap the rule-based provider for an LLM-backed analyzer (Gemini/OpenAI) behind the existing AnalyzerProvider interface for deeper contextual understanding. Add multilingual support for regional Indian languages, a browser extension for real-time WhatsApp Web scanning, crowdsourced fact-check database integration, and a feedback loop where users confirm or dispute a verdict to improve rule weights over time.",
  },
];

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="label-eyebrow">About</p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-ink-100 sm:text-3xl">
          About This Project
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-ink-500">
          An AI-based misinformation risk analyzer for WhatsApp messages, built as a final year
          engineering project.
        </p>
      </motion.div>

      <div className="grid gap-5">
        {SECTIONS.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-signal/10">
                <s.icon size={17} className="text-signal" />
              </div>
              <h3 className="font-display text-base font-semibold text-ink-100">{s.title}</h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-300">{s.body}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <PlaceholderCard icon={Users} title="Team Members" items={["Student Name 1", "Student Name 2", "Student Name 3"]} />
        <PlaceholderCard icon={GraduationCap} title="Project Guide" items={["Guide Name", "Designation, Department"]} />
        <PlaceholderCard icon={Building2} title="College" items={["College / Institution Name", "Department of Computer Science"]} />
      </div>
    </div>
  );
}

function PlaceholderCard({
  icon: Icon,
  title,
  items,
}: {
  icon: any;
  title: string;
  items: string[];
}) {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2">
        <Icon size={16} className="text-violet-500" />
        <p className="label-eyebrow">{title}</p>
      </div>
      <div className="mt-3 space-y-1.5">
        {items.map((it) => (
          <p key={it} className="text-sm text-ink-300">{it}</p>
        ))}
      </div>
    </div>
  );
}
