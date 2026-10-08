// MisinfoGuard analyzer: types, keyword dictionaries, weighted rules and scoring engine.
// Pure TypeScript (no React) so it runs inside the /api/analyze route.

// ---------- Types ----------
export type RiskLevel = "low" | "moderate" | "high" | "critical";

export interface AnalysisFlag {
  id: string;
  label: string;
  category: string;
  weight: number;
  matched: string[];
}

export interface AnalysisRequest {
  message: string;
}

export interface AnalysisResult {
  id: string;
  createdAt: string;
  message: string;
  riskScore: number; // 0-100
  riskLevel: RiskLevel;
  trustScore: number; // 0-100
  classification: string;
  fakeProbability: number;
  spamProbability: number;
  scamProbability: number;
  clickbaitScore: number;
  sentiment: {
    label: "positive" | "neutral" | "negative";
    score: number;
  };
  emotion: {
    label: string;
    score: number;
  };
  urgencyScore: number;
  confidenceScore: number;
  keywords: string[];
  suspiciousPhrases: string[];
  reasons: string[];
  suggestions: string[];
  factCheckRecommended: boolean;
  summary: string;
  flags: AnalysisFlag[];
  categoryBreakdown: { category: string; value: number }[];
}

export type HistoryEntry = AnalysisResult;

// ---------- Keyword dictionaries ----------
// Modular keyword/pattern dictionaries.
// Designed so an LLM-backed provider (Gemini/OpenAI) can later replace or
// augment this dictionary-driven approach without touching the frontend
// contract (see lib/analyzer/engine.ts -> AnalyzerProvider).

export const LOTTERY_FRAUD = [
  "you have won", "you've won", "lucky winner", "claim your prize",
  "lottery winner", "kbc lottery", "whatsapp lottery", "cash prize",
  "winning number", "congratulations you have been selected",
];

export const OTP_SCAM = [
  "share your otp", "send otp", "otp number", "verification code",
  "one time password", "do not share this otp except", "confirm otp",
];

export const UPI_BANKING_FRAUD = [
  "upi pin", "enter your pin", "update your kyc", "kyc expired",
  "account will be blocked", "account suspended", "verify your account",
  "bank account blocked", "click to update bank", "net banking password",
  "debit card details", "cvv number", "aadhar linked", "pan card blocked",
];

export const SUSPICIOUS_LINK_PATTERNS = [
  /bit\.ly\/\S+/i, /tinyurl\.com\/\S+/i, /t\.co\/\S+/i, /rebrand\.ly\/\S+/i,
  /cutt\.ly\/\S+/i, /is\.gd\/\S+/i, /shorturl\.at\/\S+/i,
  /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/, // raw IP links
];

export const MONEY_REQUEST = [
  "send money", "transfer money", "urgent need money", "gpay me",
  "paytm me", "phonepe me", "need rs", "need ₹", "borrow money",
  "pay advance", "processing fee", "registration fee", "pay to claim",
];

export const EMOTIONAL_MANIPULATION = [
  "share before it's deleted", "share with 10 people", "forward to everyone",
  "forward this to all your contacts", "don't ignore this message",
  "this is not fake", "please share maximum", "share to save a life",
  "god will bless you if you share", "bad luck if you don't forward",
];

export const POLITICAL_MANIPULATION = [
  "government is hiding", "media won't show you", "wake up india",
  "vote bank politics", "this party is finished", "banned by government",
  "secret agenda", "deep state",
];

export const MEDICAL_MISINFORMATION = [
  "cures cancer", "cure for covid", "doctors don't want you to know",
  "vaccine is dangerous", "miracle cure", "home remedy cures",
  "drink this to cure", "hospitals hiding this", "ayurveda cures all diseases",
];

export const RELIGIOUS_HATE = [
  "against our religion", "convert or die", "religious war",
  "attack on our faith", "they are destroying our culture",
];

export const VIOLENCE_INCITEMENT = [
  "beat them up", "kill them", "burn down", "attack the", "riot", "revenge attack",
];

export const FEAR_BASED_LANGUAGE = [
  "danger to your family", "your life is at risk", "you will die if",
  "act now or suffer", "final warning", "last chance to save yourself",
];

export const URGENT_LANGUAGE = [
  "act immediately", "urgent action required", "expires today",
  "limited time only", "offer ends tonight", "reply within",
  "immediately", "right now", "hurry up", "don't wait",
];

export const CLICKBAIT_PATTERNS = [
  "you won't believe", "shocking truth", "doctors hate this trick",
  "what happened next will", "number 7 will shock you", "must watch before deleted",
  "this will blow your mind",
];

export const SPAM_PATTERNS = [
  "work from home job", "earn rs", "earn ₹", "per day guaranteed",
  "click the link below to earn", "join our telegram channel to earn",
  "investment doubles", "double your money", "100% guaranteed returns",
  "free recharge", "free mobile", "install this app to earn",
];

export const UNKNOWN_SOURCE_MARKERS = [
  "forwarded as received", "forwarded many times", "source: whatsapp group",
  "my friend told me", "someone sent this to me",
];

export const POSITIVE_WORDS = [
  "good", "great", "happy", "congratulations", "wonderful", "excellent",
  "love", "thank you", "blessed", "beautiful",
];

export const NEGATIVE_WORDS = [
  "bad", "sad", "danger", "warning", "scam", "fraud", "die", "death",
  "kill", "hate", "attack", "fear", "terrible", "worst", "angry",
];

export const EMOTION_LEXICON: Record<string, string[]> = {
  fear: ["danger", "scared", "afraid", "risk", "warning", "threat", "unsafe"],
  anger: ["angry", "furious", "outrage", "hate", "disgust"],
  urgency: ["urgent", "immediately", "now", "hurry", "last chance", "expires"],
  joy: ["happy", "congratulations", "won", "blessed", "great news"],
  sadness: ["sad", "sorry", "loss", "died", "unfortunate"],
};

// ---------- Matching helpers ----------
const isAlnum = (c: string | undefined) => !!c && /[a-z0-9]/i.test(c);

/** Whole-word phrase check, so "riot" does not fire on "patriotic". */
export function hasPhrase(text: string, phrase: string): boolean {
  const first = phrase[0];
  const last = phrase[phrase.length - 1];
  let i = text.indexOf(phrase);
  while (i !== -1) {
    const before = i > 0 ? text[i - 1] : undefined;
    const after = text[i + phrase.length];
    if ((!isAlnum(first) || !isAlnum(before)) && (!isAlnum(last) || !isAlnum(after))) return true;
    i = text.indexOf(phrase, i + 1);
  }
  return false;
}

// ---------- Weighted rules ----------
export interface RuleDefinition {
  id: string;
  label: string;
  category: string;
  weight: number; // contribution to overall risk score (0-100 scale points)
  test: (text: string, original: string) => string[]; // returns matched substrings
}

function matchPhrases(text: string, phrases: string[]): string[] {
  return phrases.filter((p) => hasPhrase(text, p));
}

function matchPatterns(text: string, patterns: RegExp[]): string[] {
  const found: string[] = [];
  for (const re of patterns) {
    const m = text.match(re);
    if (m) found.push(...m);
  }
  return found;
}

export const RULES: RuleDefinition[] = [
  {
    id: "lottery_fraud",
    label: "Lottery / Prize Fraud",
    category: "Scam",
    weight: 14,
    test: (t) => matchPhrases(t, LOTTERY_FRAUD),
  },
  {
    id: "otp_scam",
    label: "OTP Phishing",
    category: "Scam",
    weight: 16,
    test: (t) => matchPhrases(t, OTP_SCAM),
  },
  {
    id: "upi_banking_fraud",
    label: "UPI / Banking Fraud",
    category: "Scam",
    weight: 16,
    test: (t) => matchPhrases(t, UPI_BANKING_FRAUD),
  },
  {
    id: "suspicious_links",
    label: "Suspicious / Shortened Links",
    category: "Technical",
    weight: 10,
    test: (t) => matchPatterns(t, SUSPICIOUS_LINK_PATTERNS),
  },
  {
    id: "money_request",
    label: "Direct Money Request",
    category: "Scam",
    weight: 12,
    test: (t) => matchPhrases(t, MONEY_REQUEST),
  },
  {
    id: "emotional_manipulation",
    label: "Emotional Manipulation / Chain Forward",
    category: "Manipulation",
    weight: 8,
    test: (t) => matchPhrases(t, EMOTIONAL_MANIPULATION),
  },
  {
    id: "political_manipulation",
    label: "Political Manipulation",
    category: "Manipulation",
    weight: 7,
    test: (t) => matchPhrases(t, POLITICAL_MANIPULATION),
  },
  {
    id: "medical_misinformation",
    label: "Medical Misinformation",
    category: "Fake News",
    weight: 12,
    test: (t) => matchPhrases(t, MEDICAL_MISINFORMATION),
  },
  {
    id: "religious_hate",
    label: "Religious Hate Speech",
    category: "Hate",
    weight: 10,
    test: (t) => matchPhrases(t, RELIGIOUS_HATE),
  },
  {
    id: "violence_incitement",
    label: "Violence Incitement",
    category: "Hate",
    weight: 12,
    test: (t) => matchPhrases(t, VIOLENCE_INCITEMENT),
  },
  {
    id: "fear_language",
    label: "Fear-Based Language",
    category: "Manipulation",
    weight: 7,
    test: (t) => matchPhrases(t, FEAR_BASED_LANGUAGE),
  },
  {
    id: "urgent_language",
    label: "Urgency Pressure Tactics",
    category: "Manipulation",
    weight: 6,
    test: (t) => matchPhrases(t, URGENT_LANGUAGE),
  },
  {
    id: "clickbait",
    label: "Clickbait Phrasing",
    category: "Clickbait",
    weight: 6,
    test: (t) => matchPhrases(t, CLICKBAIT_PATTERNS),
  },
  {
    id: "spam_patterns",
    label: "Spam / Get-Rich-Quick Patterns",
    category: "Spam",
    weight: 9,
    test: (t) => matchPhrases(t, SPAM_PATTERNS),
  },
  {
    id: "unknown_source",
    label: "Unverified / Unknown Source",
    category: "Credibility",
    weight: 4,
    test: (t) => matchPhrases(t, UNKNOWN_SOURCE_MARKERS),
  },
  {
    id: "excessive_caps",
    label: "Excessive Capital Letters",
    category: "Style",
    weight: 4,
    test: (_t, original) => {
      const words = original.split(/\s+/).filter((w) => w.length > 2);
      const capsWords = words.filter((w) => w === w.toUpperCase() && /[A-Z]/.test(w));
      return capsWords.length >= 3 ? capsWords.slice(0, 5) : [];
    },
  },
  {
    id: "excessive_emojis",
    label: "Excessive Emoji Usage",
    category: "Style",
    weight: 3,
    test: (_t, original) => {
      const emojiMatches = original.match(
        /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu
      );
      return emojiMatches && emojiMatches.length >= 6 ? emojiMatches : [];
    },
  },
];

export function runRules(normalizedText: string, originalText: string): AnalysisFlag[] {
  const flags: AnalysisFlag[] = [];
  for (const rule of RULES) {
    const matched = rule.test(normalizedText, originalText);
    if (matched.length > 0) {
      flags.push({
        id: rule.id,
        label: rule.label,
        category: rule.category,
        weight: rule.weight,
        matched: Array.from(new Set(matched)).slice(0, 8),
      });
    }
  }
  return flags;
}

// ---------- Scoring engine ----------
/**
 * AnalyzerProvider is the seam for swapping the scoring brain.
 * Today `ruleBasedProvider` below implements it with a weighted
 * keyword/pattern engine. A future `geminiProvider` or `openAiProvider`
 * can implement the same interface and be swapped in `analyzeMessage()`
 * without any change to the API route or the frontend contract.
 */
export interface AnalyzerProvider {
  analyze(message: string): Promise<AnalysisResult> | AnalysisResult;
}

function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n));
}

function riskLevelFromScore(score: number): RiskLevel {
  if (score >= 75) return "critical";
  if (score >= 50) return "high";
  if (score >= 25) return "moderate";
  return "low";
}

function classificationFromFlags(flags: AnalysisFlag[], riskScore: number): string {
  if (flags.length === 0) return "Likely Authentic";
  const categories = flags.map((f) => f.category);
  const has = (c: string) => categories.includes(c);

  if (has("Scam")) return "Likely Scam / Fraud Attempt";
  if (has("Hate")) return "Hate / Incitement Content";
  if (has("Fake News")) return "Likely Medical/Fake News Misinformation";
  if (has("Spam")) return "Spam Content";
  if (has("Clickbait")) return "Clickbait Content";
  if (has("Manipulation")) return "Emotionally Manipulative Forward";
  return riskScore > 40 ? "Suspicious Content" : "Low Risk Content";
}

function analyzeSentiment(normalized: string) {
  let pos = 0;
  let neg = 0;
  for (const w of POSITIVE_WORDS) if (hasPhrase(normalized, w)) pos++;
  for (const w of NEGATIVE_WORDS) if (hasPhrase(normalized, w)) neg++;

  const total = pos + neg;
  if (total === 0) return { label: "neutral" as const, score: 0.5 };

  const ratio = pos / total;
  if (ratio > 0.6) return { label: "positive" as const, score: Number(ratio.toFixed(2)) };
  if (ratio < 0.4) return { label: "negative" as const, score: Number((1 - ratio).toFixed(2)) };
  return { label: "neutral" as const, score: 0.5 };
}

function analyzeEmotion(normalized: string) {
  let bestLabel = "neutral";
  let bestCount = 0;
  for (const [label, words] of Object.entries(EMOTION_LEXICON)) {
    const count = words.filter((w) => hasPhrase(normalized, w)).length;
    if (count > bestCount) {
      bestCount = count;
      bestLabel = label;
    }
  }
  const score = bestCount === 0 ? 0.3 : clamp(0.4 + bestCount * 0.15, 0, 1);
  return { label: bestLabel, score: Number(score.toFixed(2)) };
}

function buildKeywords(flags: AnalysisFlag[]): string[] {
  const all = flags.flatMap((f) => f.matched);
  return Array.from(new Set(all)).slice(0, 12);
}

function buildSuspiciousPhrases(flags: AnalysisFlag[]): string[] {
  return flags
    .filter((f) => ["Scam", "Hate", "Fake News"].includes(f.category))
    .flatMap((f) => f.matched)
    .slice(0, 8);
}

function buildReasons(flags: AnalysisFlag[]): string[] {
  if (flags.length === 0) {
    return ["No known risk patterns, scam markers, or manipulation tactics were detected."];
  }
  return flags.map(
    (f) => `${f.label} detected (${f.matched.length} marker${f.matched.length > 1 ? "s" : ""} matched).`
  );
}

function buildSuggestions(flags: AnalysisFlag[], riskLevel: RiskLevel): string[] {
  const suggestions: string[] = [];
  const categories = new Set(flags.map((f) => f.category));

  if (categories.has("Scam")) {
    suggestions.push("Do not share any OTP, PIN, CVV, or banking credentials mentioned in this message.");
    suggestions.push("Verify directly with your bank or the official source through a known number, not the one in the message.");
  }
  if (categories.has("Technical")) {
    suggestions.push("Avoid clicking shortened or unfamiliar links. Hover or preview the destination before tapping.");
  }
  if (categories.has("Fake News") || categories.has("Manipulation")) {
    suggestions.push("Cross-check this claim on a fact-checking platform (e.g. Alt News, PIB Fact Check, Boom Live) before forwarding.");
  }
  if (categories.has("Hate")) {
    suggestions.push("Do not forward this message. Consider reporting it to WhatsApp for violating community guidelines.");
  }
  if (categories.has("Spam")) {
    suggestions.push("Treat guaranteed-return or 'earn from home' offers with skepticism; legitimate income rarely requires upfront payment.");
  }
  if (suggestions.length === 0) {
    suggestions.push("Message appears low-risk, but always verify unfamiliar claims before acting on them.");
  }
  if (riskLevel === "high" || riskLevel === "critical") {
    suggestions.push("Recommended action: do not forward this message and warn contacts if you already received it from a group.");
  }
  return Array.from(new Set(suggestions));
}

function buildSummary(classification: string, riskLevel: RiskLevel, flags: AnalysisFlag[]): string {
  const topFlags = flags.slice(0, 3).map((f) => f.label.toLowerCase());
  const flagText = topFlags.length > 0 ? ` Primary indicators: ${topFlags.join(", ")}.` : "";
  return `This message was classified as "${classification}" with an overall ${riskLevel} risk level.${flagText}`;
}

function buildCategoryBreakdown(flags: AnalysisFlag[]) {
  const map = new Map<string, number>();
  for (const f of flags) {
    map.set(f.category, (map.get(f.category) ?? 0) + f.weight);
  }
  return Array.from(map.entries()).map(([category, value]) => ({ category, value }));
}

/**
 * Rule-based provider: deterministic, explainable, zero external dependency.
 * Kept intentionally pure so it can run both server-side (API route) and,
 * if ever needed, client-side for instant offline previews.
 */
export const ruleBasedProvider: AnalyzerProvider = {
  analyze(message: string): AnalysisResult {
    const original = message ?? "";
    const normalized = original.toLowerCase().replace(/[\u2018\u2019]/g, "'").trim();

    const flags = runRules(normalized, original);
    const rawWeight = flags.reduce((sum, f) => sum + f.weight, 0);

    const lengthFactor = normalized.length > 0 ? Math.min(normalized.length / 400, 1) * 4 : 0;
    // Floor by category so a confirmed scam / hate / fake-news match never displays as "Low Risk".
    const cats = new Set(flags.map((f) => f.category));
    const floor = cats.has("Scam") || cats.has("Hate") ? 50 : cats.has("Fake News") ? 35 : 0;
    const riskScore = clamp(Math.max(Math.round(rawWeight + lengthFactor), floor));
    const riskLevel = riskLevelFromScore(riskScore);
    const trustScore = clamp(100 - riskScore);

    const scamWeight = flags.filter((f) => f.category === "Scam").reduce((s, f) => s + f.weight, 0);
    const fakeWeight = flags
      .filter((f) => ["Fake News", "Manipulation"].includes(f.category))
      .reduce((s, f) => s + f.weight, 0);
    const spamWeight = flags.filter((f) => f.category === "Spam").reduce((s, f) => s + f.weight, 0);
    const clickbaitWeight = flags.filter((f) => f.category === "Clickbait").reduce((s, f) => s + f.weight, 0);

    const scamProbability = clamp(Math.round((scamWeight / 46) * 100));
    const fakeProbability = clamp(Math.round((fakeWeight / 38) * 100));
    const spamProbability = clamp(Math.round((spamWeight / 25) * 100));
    const clickbaitScore = clamp(Math.round((clickbaitWeight / 12) * 100));

    const urgencyFlag = flags.find((f) => f.id === "urgent_language" || f.id === "fear_language");
    const urgencyScore = clamp(
      (urgencyFlag ? 45 : 10) + flags.filter((f) => f.category === "Manipulation").length * 12
    );

    const confidenceScore = clamp(60 + Math.min(flags.length * 6, 35));

    const classification = classificationFromFlags(flags, riskScore);
    const sentiment = analyzeSentiment(normalized);
    const emotion = analyzeEmotion(normalized);
    const keywords = buildKeywords(flags);
    const suspiciousPhrases = buildSuspiciousPhrases(flags);
    const reasons = buildReasons(flags);
    const suggestions = buildSuggestions(flags, riskLevel);
    const summary = buildSummary(classification, riskLevel, flags);
    const categoryBreakdown = buildCategoryBreakdown(flags);
    const factCheckRecommended = fakeProbability > 25 || scamProbability > 25 || riskLevel !== "low";

    return {
      id: `an_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
      message: original,
      riskScore,
      riskLevel,
      trustScore,
      classification,
      fakeProbability,
      spamProbability,
      scamProbability,
      clickbaitScore,
      sentiment,
      emotion,
      urgencyScore,
      confidenceScore,
      keywords,
      suspiciousPhrases,
      reasons,
      suggestions,
      factCheckRecommended,
      summary,
      flags,
      categoryBreakdown,
    };
  },
};

/**
 * Entry point used by the API route. Swap `ruleBasedProvider` for an
 * LLM-backed provider here (same AnalyzerProvider interface) to upgrade
 * the analyzer without touching the route or the frontend.
 */
export async function analyzeMessage(message: string): Promise<AnalysisResult> {
  const provider: AnalyzerProvider = ruleBasedProvider;
  return provider.analyze(message);
}
