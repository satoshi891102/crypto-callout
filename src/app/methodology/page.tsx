"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  TrendingUp,
  Clock,
  BarChart3,
  Scale,
  ShieldCheck,
  ChevronDown,
  CheckCircle2,
  XCircle,
  Timer,
  Layers,
  Zap,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  SPRING_TRANSITION,
  DEFAULT_SCORING_WEIGHTS,
  TIERS,
  MIN_PREDICTIONS_FOR_RANKING,
  MIN_PREDICTIONS_FOR_REPORT_CARD,
  TIMEFRAME_LABELS,
} from "@/lib/constants";
import { SectionHeader } from "@/components/shared/section-header";
import { PageTransition } from "@/components/shared/page-transition";
import type { ScoringWeights, TierInfo } from "@/types";

/* ── Types ── */

interface ScoringFactor {
  id: string;
  label: string;
  weight: number;
  icon: React.ReactNode;
  color: string;
  description: string;
  details: string[];
}

interface ResolutionRule {
  status: "correct" | "incorrect" | "pending";
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  rules: string[];
}

interface FaqItem {
  question: string;
  answer: string;
}

/* ── Demo Data ── */

const SCORING_FACTORS: ScoringFactor[] = [
  {
    id: "accuracy",
    label: "Accuracy",
    weight: DEFAULT_SCORING_WEIGHTS.accuracy,
    icon: <Target size={20} />,
    color: "text-status-correct",
    description:
      "The ratio of correct predictions to total resolved predictions. The most heavily weighted factor.",
    details: [
      "Correct predictions / total resolved predictions",
      "Only resolved (non-pending) predictions count",
      "Directional accuracy: did the price move in the predicted direction?",
      "Target price bonus: extra credit if the target price was hit",
    ],
  },
  {
    id: "consistency",
    label: "Consistency",
    weight: DEFAULT_SCORING_WEIGHTS.consistency,
    icon: <TrendingUp size={20} />,
    color: "text-accent-brand",
    description:
      "Measures how stable accuracy is over time. Penalizes wild swings between correct and incorrect streaks.",
    details: [
      "Rolling 30-day accuracy standard deviation",
      "Lower variance = higher consistency score",
      "Rewards predictors who maintain steady performance",
      "Streak bonuses for consecutive correct predictions",
    ],
  },
  {
    id: "volume",
    label: "Volume",
    weight: DEFAULT_SCORING_WEIGHTS.volume,
    icon: <BarChart3 size={20} />,
    color: "text-status-pending",
    description:
      "More predictions give us more data to score. A minimum threshold ensures statistical significance.",
    details: [
      `Minimum ${MIN_PREDICTIONS_FOR_RANKING} predictions required for ranking`,
      `Minimum ${MIN_PREDICTIONS_FOR_REPORT_CARD} predictions required for report card`,
      "Logarithmic scaling — diminishing returns after 50+ predictions",
      "Prevents low-volume gaming (one lucky prediction ≠ expert)",
    ],
  },
  {
    id: "recency",
    label: "Recency",
    weight: DEFAULT_SCORING_WEIGHTS.recency,
    icon: <Clock size={20} />,
    color: "text-accent-brand-hover",
    description:
      "Recent predictions carry more weight. Ensures scores reflect current performance, not just historical accuracy.",
    details: [
      "Exponential decay: predictions older than 6 months carry less weight",
      "Last 30 days weighted 2x compared to 6+ month old predictions",
      "Encourages active participation and current market relevance",
      "Inactive influencers see scores gradually decay",
    ],
  },
];

const RESOLUTION_RULES: ResolutionRule[] = [
  {
    status: "correct",
    label: "Correct",
    icon: <CheckCircle2 size={18} />,
    color: "text-status-correct",
    bgColor: "bg-status-correct-bg",
    rules: [
      "Bullish prediction: price moved up from entry price by resolution date",
      "Bearish prediction: price moved down from entry price by resolution date",
      "If a target price was specified, the price must have reached or exceeded it",
      "For timeframe-based predictions, price is checked at the resolution timestamp",
    ],
  },
  {
    status: "incorrect",
    label: "Incorrect",
    icon: <XCircle size={18} />,
    color: "text-status-incorrect",
    bgColor: "bg-status-incorrect-bg",
    rules: [
      "Price moved in the opposite direction of the prediction by resolution date",
      "Target price was not reached within the specified timeframe",
      "Bearish call on a coin that went up (or vice versa)",
      "Resolution is final — no retroactive changes after resolution date",
    ],
  },
  {
    status: "pending",
    label: "Pending",
    icon: <Timer size={18} />,
    color: "text-status-pending",
    bgColor: "bg-status-pending-bg",
    rules: [
      "Prediction timeframe has not yet expired",
      "Pending predictions do NOT count toward accuracy score",
      "Automatically resolved when the timeframe expires",
      "Can be early-resolved if the target price is hit before the deadline",
    ],
  },
];

const TIMEFRAME_DETAILS = [
  { key: "24h", label: TIMEFRAME_LABELS["24h"], window: "Price checked at T+24 hours" },
  { key: "1w", label: TIMEFRAME_LABELS["1w"], window: "Price checked at T+7 days" },
  { key: "1m", label: TIMEFRAME_LABELS["1m"], window: "Price checked at T+30 days" },
  { key: "3m", label: TIMEFRAME_LABELS["3m"], window: "Price checked at T+90 days" },
  { key: "6m", label: TIMEFRAME_LABELS["6m"], window: "Price checked at T+180 days" },
  { key: "1y", label: TIMEFRAME_LABELS["1y"], window: "Price checked at T+365 days" },
];

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "How are prediction sources verified?",
    answer:
      "Every prediction is linked to a verifiable public source — a tweet, YouTube video, TikTok, or Telegram post. Our AI scrapes and archives the original content at the time of submission. Community submissions go through a review process before being approved.",
  },
  {
    question: "Can influencers delete predictions that turned out wrong?",
    answer:
      "No. Once a prediction is tracked, it cannot be removed. Even if the original social media post is deleted, we archive the content at submission time. This ensures full accountability.",
  },
  {
    question: "What price data do you use for resolution?",
    answer:
      "We use aggregated spot price data from major exchanges (Binance, Coinbase, Kraken). Prices are captured at the exact resolution timestamp using hourly candle close prices to avoid manipulation via wicks.",
  },
  {
    question: "How do you handle vague predictions?",
    answer:
      'Predictions must have a clear directional call (bullish or bearish) and either a target price or timeframe. Vague statements like "BTC will do well" are not tracked. Our AI extracts the most specific claim from the source text.',
  },
  {
    question: "Why is there a minimum prediction count for ranking?",
    answer: `A minimum of ${MIN_PREDICTIONS_FOR_RANKING} resolved predictions is required for leaderboard ranking. This prevents someone from making one lucky call and sitting at #1. Statistical significance matters — more data = more reliable scores.`,
  },
  {
    question: "Can anyone submit a prediction to track?",
    answer:
      "Yes! Community members can submit predictions they find on social media. Submissions are reviewed to verify the source, extract the prediction details, and ensure it meets our tracking criteria. Approved submissions are attributed to the submitter.",
  },
];

/* ── Scoring Factor Card ── */

function ScoringFactorCard({ factor, index }: { factor: ScoringFactor; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const percentage = Math.round(factor.weight * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...SPRING_TRANSITION, delay: index * 0.08 }}
      className="group relative overflow-hidden rounded-xl border border-border bg-card"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-5 text-left"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-elevated",
                factor.color
              )}
            >
              {factor.icon}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-text-primary">{factor.label}</h3>
                <span className="rounded-md bg-accent-brand/10 px-2 py-0.5 text-xs font-bold tabular-nums text-accent-brand">
                  {percentage}%
                </span>
              </div>
              <p className="mt-1 text-sm text-text-secondary">{factor.description}</p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={SPRING_TRANSITION}
            className="shrink-0 text-text-muted"
          >
            <ChevronDown size={18} />
          </motion.div>
        </div>

        {/* Weight bar */}
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-elevated">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ ...SPRING_TRANSITION, delay: index * 0.08 + 0.2 }}
            className={cn("h-full rounded-full", {
              "bg-status-correct": factor.id === "accuracy",
              "bg-accent-brand": factor.id === "consistency",
              "bg-status-pending": factor.id === "volume",
              "bg-accent-brand-hover": factor.id === "recency",
            })}
          />
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={SPRING_TRANSITION}
            className="overflow-hidden"
          >
            <div className="border-t border-border px-5 pb-5 pt-4">
              <ul className="space-y-2">
                {factor.details.map((detail) => (
                  <li key={detail} className="flex items-start gap-2 text-sm text-text-secondary">
                    <ArrowRight size={14} className={cn("mt-0.5 shrink-0", factor.color)} />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Resolution Rule Card ── */

function ResolutionRuleCard({ rule, index }: { rule: ResolutionRule; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...SPRING_TRANSITION, delay: index * 0.08 }}
      className={cn(
        "rounded-xl border border-border bg-card p-5",
        rule.bgColor
      )}
    >
      <div className="flex items-center gap-2.5">
        <span className={rule.color}>{rule.icon}</span>
        <h3 className={cn("font-semibold", rule.color)}>{rule.label}</h3>
      </div>
      <ul className="mt-3 space-y-2">
        {rule.rules.map((text) => (
          <li key={text} className="flex items-start gap-2 text-sm text-text-secondary">
            <span className={cn("mt-1 block h-1.5 w-1.5 shrink-0 rounded-full", {
              "bg-status-correct": rule.status === "correct",
              "bg-status-incorrect": rule.status === "incorrect",
              "bg-status-pending": rule.status === "pending",
            })} />
            <span>{text}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

/* ── Tier Badge ── */

function TierCard({ tier, index }: { tier: TierInfo; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ ...SPRING_TRANSITION, delay: index * 0.06 }}
      className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3"
    >
      <div
        className="h-3 w-3 rounded-full"
        style={{ backgroundColor: tier.color }}
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-text-primary">{tier.label}</p>
        <p className="text-xs text-text-muted">
          {tier.minScore > 0 ? `${tier.minScore}+ score` : "Below 25 score"}
        </p>
      </div>
    </motion.div>
  );
}

/* ── FAQ Accordion ── */

function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <motion.div
          key={item.question}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING_TRANSITION, delay: i * 0.05 }}
          className="rounded-xl border border-border bg-card overflow-hidden"
        >
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="flex w-full items-center justify-between gap-3 p-5 text-left"
          >
            <span className="text-sm font-medium text-text-primary">{item.question}</span>
            <motion.div
              animate={{ rotate: openIndex === i ? 180 : 0 }}
              transition={SPRING_TRANSITION}
              className="shrink-0 text-text-muted"
            >
              <ChevronDown size={16} />
            </motion.div>
          </button>

          <AnimatePresence>
            {openIndex === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={SPRING_TRANSITION}
                className="overflow-hidden"
              >
                <div className="border-t border-border px-5 pb-5 pt-4">
                  <p className="text-sm leading-relaxed text-text-secondary">{item.answer}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}

/* ── Formula Display ── */

function FormulaDisplay({ weights }: { weights: ScoringWeights }) {
  const terms = [
    { label: "Accuracy", weight: weights.accuracy, color: "text-status-correct" },
    { label: "Consistency", weight: weights.consistency, color: "text-accent-brand" },
    { label: "Volume", weight: weights.volume, color: "text-status-pending" },
    { label: "Recency", weight: weights.recency, color: "text-accent-brand-hover" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={SPRING_TRANSITION}
      className="rounded-xl border border-accent-brand/20 bg-accent-brand/5 p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <Zap size={16} className="text-accent-brand" />
        <h3 className="text-sm font-semibold text-text-primary">Composite Score Formula</h3>
      </div>

      <div className="font-mono text-sm">
        <span className="text-text-muted">score = </span>
        {terms.map((term, i) => (
          <span key={term.label}>
            {i > 0 && <span className="text-text-muted"> + </span>}
            <span className={term.color}>{term.weight}</span>
            <span className="text-text-muted">×</span>
            <span className="text-text-primary">{term.label.toLowerCase()}</span>
          </span>
        ))}
      </div>

      <p className="mt-3 text-xs text-text-muted">
        Each component is normalized to a 0–100 scale before weighting. The final score ranges from 0 to 100.
      </p>
    </motion.div>
  );
}

/* ── Page ── */

export default function MethodologyPage() {
  return (
    <PageTransition>
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-12">
        {/* Page Header */}
        <div className="space-y-4">
          <SectionHeader
            as="h1"
            title="Methodology"
            description="How CryptoCallout tracks, scores, and ranks crypto influencer predictions."
            badge="Transparent"
          />

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_TRANSITION, delay: 0.1 }}
            className="flex items-start gap-3 rounded-xl border border-accent-brand/20 bg-accent-brand/5 p-4"
          >
            <ShieldCheck size={20} className="mt-0.5 shrink-0 text-accent-brand" />
            <p className="text-sm leading-relaxed text-text-secondary">
              We believe in full transparency. Every prediction is tied to a public source,
              every score is calculated using the same formula, and every influencer is held
              to the same standard. No pay-to-play, no hidden adjustments.
            </p>
          </motion.div>
        </div>

        {/* Section: How We Score */}
        <section className="space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={SPRING_TRANSITION}
            className="flex items-center gap-2.5"
          >
            <Scale size={20} className="text-accent-brand" />
            <h2 className="text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
              Scoring System
            </h2>
          </motion.div>

          <p className="text-sm text-text-secondary leading-relaxed">
            Every influencer&apos;s composite score is built from four weighted factors.
            The formula ensures that consistent, high-volume predictors with recent activity
            are rewarded over one-hit wonders.
          </p>

          <FormulaDisplay weights={DEFAULT_SCORING_WEIGHTS} />

          <div className="space-y-3">
            {SCORING_FACTORS.map((factor, i) => (
              <ScoringFactorCard key={factor.id} factor={factor} index={i} />
            ))}
          </div>
        </section>

        {/* Section: Resolution Rules */}
        <section className="space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={SPRING_TRANSITION}
            className="flex items-center gap-2.5"
          >
            <Target size={20} className="text-status-correct" />
            <h2 className="text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
              How Predictions Are Resolved
            </h2>
          </motion.div>

          <p className="text-sm text-text-secondary leading-relaxed">
            Each prediction is resolved at the end of its timeframe. The resolution is deterministic
            — based on price data at the exact resolution timestamp. No subjective judgement involved.
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            {RESOLUTION_RULES.map((rule, i) => (
              <ResolutionRuleCard key={rule.status} rule={rule} index={i} />
            ))}
          </div>
        </section>

        {/* Section: Timeframes */}
        <section className="space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={SPRING_TRANSITION}
            className="flex items-center gap-2.5"
          >
            <Clock size={20} className="text-status-pending" />
            <h2 className="text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
              Prediction Timeframes
            </h2>
          </motion.div>

          <p className="text-sm text-text-secondary leading-relaxed">
            Predictions are tracked across six standard timeframes. The resolution window is calculated
            from the moment the prediction was first publicly made.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_TRANSITION, delay: 0.1 }}
            className="overflow-hidden rounded-xl border border-border"
          >
            <div className="bg-card">
              {TIMEFRAME_DETAILS.map((tf, i) => (
                <div
                  key={tf.key}
                  className={cn(
                    "flex items-center justify-between px-5 py-3.5",
                    i < TIMEFRAME_DETAILS.length - 1 && "border-b border-border"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="rounded-md bg-elevated px-2 py-1 font-mono text-xs font-bold text-text-primary">
                      {tf.key}
                    </span>
                    <span className="text-sm text-text-primary">{tf.label}</span>
                  </div>
                  <span className="text-xs text-text-muted">{tf.window}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Section: Tiers */}
        <section className="space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={SPRING_TRANSITION}
            className="flex items-center gap-2.5"
          >
            <Layers size={20} className="text-accent-brand" />
            <h2 className="text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
              Influencer Tiers
            </h2>
          </motion.div>

          <p className="text-sm text-text-secondary leading-relaxed">
            Influencers are assigned a tier based on their composite score. Tiers provide
            a quick visual indicator of an influencer&apos;s historical prediction quality.
          </p>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {TIERS.map((tier, i) => (
              <TierCard key={tier.tier} tier={tier} index={i} />
            ))}
          </div>
        </section>

        {/* Section: FAQ */}
        <section className="space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={SPRING_TRANSITION}
            className="flex items-center gap-2.5"
          >
            <BookOpen size={20} className="text-accent-brand" />
            <h2 className="text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <FaqAccordion items={FAQ_ITEMS} />
        </section>
      </div>
    </div>
    </PageTransition>
  );
}
