# MisinfoGuard — AI-Based Misinformation Risk Analyzer for WhatsApp Messages

Paste a forwarded WhatsApp message and get an explainable risk report: risk score, trust score,
scam / fake-news / spam / clickbait probabilities, sentiment, emotion, matched phrases, reasons
and suggested actions. Reports can be copied, downloaded as PDF or exported as JSON.

## Run it

Requires Node.js 18.17+ (tested on Node 22).

```bash
npm install
npm run dev          # http://localhost:3000
```

Production mode:

```bash
npm run build
npm start            # http://localhost:3000
```

Pages: `/` landing · `/dashboard` overview · `/dashboard/analyzer` · `/dashboard/history` ·
`/dashboard/about` · `/dashboard/settings`.

Quick API check (while the server is running):

```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"message":"You have won a cash prize! Claim your prize, send your UPI PIN and OTP now"}'
```

## Project structure

```
src/
├── app/
│   ├── layout.tsx              root layout, fonts, toast container
│   ├── globals.css             theme + shared button/card classes
│   ├── page.tsx                landing page
│   ├── api/analyze/route.ts    POST /api/analyze  (backend)
│   └── dashboard/
│       ├── layout.tsx          sidebar + top bar + mobile menu
│       ├── page.tsx            overview, stats, trend chart
│       ├── analyzer/page.tsx   message analyzer
│       ├── history/page.tsx    past analyses (search, view, delete)
│       ├── about/page.tsx      project description
│       └── settings/page.tsx   preferences, clear local data
├── components/
│   ├── landing.tsx             nav, hero, stats, features, FAQ, footer
│   ├── analyzer.tsx            input box + full result panel (charts, PDF/JSON export)
│   └── ui.tsx                  Badge, Skeleton, StatCard, RiskGauge
└── lib/
    ├── analyzer.ts             types, keyword lists, weighted rules, scoring engine
    └── client.ts               helpers, localStorage history, hooks, sample messages
```

## How it works

1. The message is lowercased and run through 17 weighted rules in 9 categories (Scam, Fake News,
   Manipulation, Hate, Spam, Clickbait, Technical, Credibility, Style). Phrases are matched as
   whole words, so "riot" does not trigger on "patriotic".
2. Matched rule weights are summed into a 0–100 risk score. Messages with a Scam or Hate match
   score at least 50 (High); Fake News matches score at least 35 (Moderate).
3. Sentiment and emotion come from small word lists; every result lists the exact phrases
   that triggered it, so nothing is a black box.
4. `analyzeMessage()` in `src/lib/analyzer.ts` is the single place to plug in an LLM-based
   analyzer later without touching the UI.

## API

`POST /api/analyze` with `{ "message": "..." }` returns `200` and the analysis object
(`riskScore`, `riskLevel`, `trustScore`, `classification`, `fakeProbability`, `spamProbability`,
`scamProbability`, `clickbaitScore`, `sentiment`, `emotion`, `urgencyScore`, `confidenceScore`,
`keywords`, `suspiciousPhrases`, `reasons`, `suggestions`, `factCheckRecommended`, `summary`,
`flags`, `categoryBreakdown`). Errors: `400` empty/invalid body, `413` over 5000 characters.

## Tech stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion · Recharts · Lucide icons ·
Sonner toasts · jsPDF. History is stored in the browser's localStorage; nothing leaves your machine.

## Limitations

English keywords only; the engine is rule-based (no ML model), so it can miss new scam wording.
Fonts load from Google Fonts when online and fall back to system fonts offline.
