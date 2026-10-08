"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck, Menu, X, Radar, ArrowRight, ShieldAlert, Link2, Brain, Gauge, FileDown, History,
  ClipboardPaste, ScanLine, FileBarChart, Quote, ChevronDown,
} from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "AI Analyzer", href: "/dashboard/analyzer" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "History", href: "/dashboard/history" },
  { label: "About", href: "/dashboard/about" },
];

export function LandingNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.06] bg-base-950/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 sm:px-10 lg:px-16">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-signal/15">
            <ShieldCheck size={16} className="text-signal" />
          </div>
          <span className="font-display text-sm font-semibold text-ink-100">MisinfoGuard</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="text-sm text-ink-500 transition-colors hover:text-ink-100"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link href="/dashboard/analyzer" className="btn-primary text-sm">
            Try Analyzer
          </Link>
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          className="rounded-lg p-2 text-ink-300 hover:bg-black/[0.05] md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-black/[0.06] md:hidden"
          >
            <nav className="flex flex-col gap-1 px-6 py-4">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm text-ink-300 hover:bg-black/[0.04]"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href="/dashboard/analyzer"
                onClick={() => setOpen(false)}
                className="btn-primary mt-2 text-sm"
              >
                Try Analyzer
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-24 pt-28 sm:px-10 lg:px-16">
      <div className="pointer-events-none absolute inset-0 bg-aurora-1" />
      <div className="pointer-events-none absolute inset-0 bg-aurora-2" />
      <div className="pointer-events-none absolute inset-0 bg-grid-fade bg-grid opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />

      <motion.div
        className="pointer-events-none absolute -right-10 top-24 h-64 w-64 rounded-full bg-signal/10 blur-3xl animate-float"
        aria-hidden
      />
      <motion.div
        className="pointer-events-none absolute -left-16 top-56 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl animate-float"
        style={{ animationDelay: "1.5s" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.02] px-4 py-1.5 text-xs text-ink-300"
        >
          <Radar size={13} className="text-signal" />
          Explainable AI risk engine · MisinfoGuard
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6 font-display text-4xl font-bold leading-[1.08] text-ink-100 sm:text-5xl lg:text-6xl"
        >
          Know if a forward is
          <br />
          <span className="bg-gradient-to-r from-signal via-signal-glow to-violet-500 bg-clip-text text-transparent">
            trustworthy — before you send it.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-ink-500"
        >
          MisinfoGuard scans WhatsApp messages for scams, fake news, spam, and manipulation tactics
          in seconds, and explains exactly why — with a transparent risk score, not a black box.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-4"
        >
          <Link href="/dashboard/analyzer" className="btn-primary">
            Analyze a Message <ArrowRight size={16} />
          </Link>
          <Link href="/dashboard" className="btn-secondary">
            <ShieldCheck size={16} />
            View Dashboard
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-2.5"
        >
          <span className="rounded-full border border-risk-critical/25 bg-risk-critical/10 px-3 py-1 text-xs font-medium text-risk-critical">
            High Risk Detected
          </span>
          <span className="rounded-full border border-risk-mid/25 bg-risk-mid/10 px-3 py-1 text-xs font-medium text-risk-mid">
            Moderate Risk
          </span>
          <span className="rounded-full border border-signal/25 bg-signal/10 px-3 py-1 text-xs font-medium text-signal">
            Low Risk · Looks Safe
          </span>
        </motion.div>
      </div>
    </section>
  );
}

const STATS = [
  { value: "17", label: "Detection Rules" },
  { value: "9", label: "Risk Categories" },
  { value: "<1s", label: "Average Analysis Time" },
  { value: "100%", label: "Data Stays Local" },
];

export function StatsSection() {
  return (
    <section className="relative px-6 py-16 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="glass-panel grid grid-cols-2 gap-8 p-8 sm:grid-cols-4 sm:p-10">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="text-center"
            >
              <p className="font-display text-3xl font-bold text-ink-100 sm:text-4xl">{s.value}</p>
              <p className="mt-1.5 text-xs text-ink-500">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const FEATURES = [
  {
    icon: ShieldAlert,
    title: "Scam & Fraud Detection",
    desc: "Flags OTP phishing, UPI/banking fraud, and lottery scams using weighted pattern matching.",
  },
  {
    icon: Brain,
    title: "Sentiment & Emotion Engine",
    desc: "Reads urgency, fear, and manipulation cues that pressure people into forwarding blindly.",
  },
  {
    icon: Link2,
    title: "Suspicious Link Analysis",
    desc: "Detects shortened URLs and raw IP links commonly used to mask malicious destinations.",
  },
  {
    icon: Gauge,
    title: "Transparent Risk Scoring",
    desc: "Every score comes with the exact reasons and matched phrases behind it — nothing hidden.",
  },
  {
    icon: FileDown,
    title: "Exportable Reports",
    desc: "Copy, download as PDF, or export raw JSON for documentation and case study reference.",
  },
  {
    icon: History,
    title: "Local Analysis History",
    desc: "Every check is saved privately on your device so you can revisit past verdicts anytime.",
  },
];

export function FeatureCards() {
  return (
    <section className="relative px-6 py-20 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-xl text-center">
          <p className="label-eyebrow">Capabilities</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-ink-100">
            Built to catch what forwards hide
          </h2>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: (i % 3) * 0.08, duration: 0.4 }}
              className="glass-card p-6"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-signal/10">
                <f.icon size={18} className="text-signal" />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold text-ink-100">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  {
    icon: ClipboardPaste,
    title: "Paste Message",
    desc: "Copy any WhatsApp message and paste it into the analyzer interface.",
  },
  {
    icon: ScanLine,
    title: "Engine Scans It",
    desc: "The rule engine scans for scam, fake-news, spam, and manipulation indicators.",
  },
  {
    icon: FileBarChart,
    title: "Get Your Report",
    desc: "Receive a full breakdown: risk level, explanation, and recommendations.",
  },
  {
    icon: ShieldCheck,
    title: "Take Action",
    desc: "Make an informed decision about sharing, and stay protected from misinformation.",
  },
];

export function HowItWorks() {
  return (
    <section className="relative px-6 py-20 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-xl text-center">
          <p className="label-eyebrow">How It Works</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-ink-100">
            Simple, fast, and explainable
          </h2>
          <p className="mt-3 text-sm text-ink-500">
            Four steps between a suspicious forward and a confident decision.
          </p>
        </div>

        <div className="relative mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="pointer-events-none absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-black/10 to-transparent lg:block" />
          {STEPS.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="relative flex flex-col items-center text-center"
            >
              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-signal/25 bg-signal/10">
                <s.icon size={20} className="text-signal" />
                <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-violet-500 text-[10px] font-bold text-white">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-4 font-display text-sm font-semibold text-ink-100">{s.title}</h3>
              <p className="mt-1.5 max-w-[220px] text-xs leading-relaxed text-ink-500">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Testimonial() {
  return (
    <section className="relative px-6 py-16 sm:px-10 lg:px-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-panel mx-auto max-w-3xl p-10 text-center sm:p-14"
      >
        <Quote size={28} className="mx-auto text-signal/60" />
        <p className="mt-5 font-display text-xl font-medium leading-relaxed text-ink-100 sm:text-2xl">
          Misinformation spreads on WhatsApp faster than any fact-checker can keep up with it —
          the fix has to start at the moment someone is about to hit forward.
        </p>
        <p className="mt-5 text-xs uppercase tracking-[0.14em] text-ink-500">
          Motivation behind this project
        </p>
      </motion.div>
    </section>
  );
}

const FAQS = [
  {
    q: "How does MisinfoGuard decide a message's risk score?",
    a: "It runs the message through a weighted engine of 17 detection rules across 9 categories — scam and fraud phrasing, suspicious/shortened links, emotional manipulation, clickbait, and more. Each matched pattern contributes weighted points, and the total maps to a 0–100 risk score and a low/moderate/high/critical level.",
  },
  {
    q: "Does this use a large language model like GPT or Gemini?",
    a: "Not yet. The current engine is a deterministic, fully explainable rule-based system — every score comes with the exact phrases that triggered it, with no black-box behavior. The codebase is structured behind a swappable AnalyzerProvider interface so an LLM-backed provider can be added later without changing the API or the frontend.",
  },
  {
    q: "Is any of my data uploaded or stored on a server?",
    a: "No. Analysis happens on the local development server you run, and your history is saved only in your browser's local storage. Nothing is sent to a third party.",
  },
  {
    q: "Can this analyze messages in Hindi or other regional languages?",
    a: "The current keyword dictionaries are English-focused. Multilingual support for regional Indian languages is listed as future scope for the project.",
  },
  {
    q: "What happens if a message is flagged as high risk?",
    a: "You'll see the specific reasons it was flagged, suggested next steps (e.g. don't share OTP/PIN, verify through an official channel), and a recommendation on whether to fact-check before forwarding.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative px-6 py-20 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="label-eyebrow">FAQ</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-ink-100">
            Frequently asked questions
          </h2>
        </div>

        <div className="mt-10 space-y-3">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={item.q}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.05 }}
                className="glass-card overflow-hidden"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-sm font-medium text-ink-100">{item.q}</span>
                  <ChevronDown
                    size={16}
                    className={`shrink-0 text-ink-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-4 text-sm leading-relaxed text-ink-500">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="relative px-6 py-20 sm:px-10 lg:px-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-panel mx-auto max-w-4xl overflow-hidden p-10 text-center sm:p-14"
      >
        <div className="pointer-events-none absolute inset-0 bg-aurora-1" />
        <div className="relative">
          <h2 className="font-display text-2xl font-semibold text-ink-100 sm:text-3xl">
            Run your first risk check in seconds
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-ink-500">
            No signup, no data upload. Everything runs locally in your session.
          </p>
          <Link href="/dashboard/analyzer" className="btn-primary mt-7 inline-flex">
            Start Analyzing <ArrowRight size={16} />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="relative border-t border-black/[0.06] px-6 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-signal/15">
            <ShieldCheck size={14} className="text-signal" />
          </div>
          <span className="font-display text-sm font-semibold text-ink-100">MisinfoGuard</span>
        </div>
        <p className="text-center text-xs text-ink-700">
          Final year engineering project · Built for educational purposes · Not affiliated with WhatsApp Inc.
        </p>
        <div className="flex gap-5 text-xs text-ink-500">
          <Link href="/dashboard/about" className="hover:text-ink-100">About</Link>
          <Link href="/dashboard" className="hover:text-ink-100">Dashboard</Link>
        </div>
      </div>
    </footer>
  );
}
