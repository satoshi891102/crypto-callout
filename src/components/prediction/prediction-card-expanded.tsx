"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ExternalLink,
  Calendar,
  Target,
  Users,
  Clock,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Share2,
  Copy,
  Check,
} from "lucide-react";
import { useState } from "react";
import { cn, formatCurrency } from "@/lib/utils";
import {
  SPRING_TRANSITION,
  FADE_IN,
  STAGGER_CONTAINER,
  TIMEFRAME_LABELS,
} from "@/lib/constants";
import {
  formatShortDate,
  formatFullDate,
  formatRelativeDate,
  formatDaysRemaining,
  formatPercentage,
  getPriceChangePercent,
  formatNumber,
} from "@/lib/format";
import { formatFollowerCount } from "@/data/mock-influencers";
import { formatPrice } from "@/data/mock-coins";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CoinIcon } from "@/components/shared/coin-icon";
import { CountUp } from "@/components/shared/count-up";
import { PredictionStatusBadge } from "@/components/prediction/prediction-status-badge";
import { PredictionTypeBadge } from "@/components/prediction/prediction-type-badge";
import type { Prediction } from "@/types";
import { MOCK_PREDICTIONS } from "@/data/mock-predictions";
import { MOCK_PRICES, MOCK_PRICE_CHANGES_24H } from "@/data/mock-coins";
import { getInfluencerById } from "@/data/mock-influencers";

/* ── Helpers ── */

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getPriceChange(prediction: Prediction) {
  const resolvedPrice = prediction.priceAtResolution;
  if (resolvedPrice == null) return null;

  const pct =
    ((resolvedPrice - prediction.priceAtPrediction) /
      prediction.priceAtPrediction) *
    100;

  return {
    pct,
    formatted: `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`,
    isPositive: pct >= 0,
  };
}

function getProgressToTarget(prediction: Prediction): number | null {
  if (prediction.targetPrice == null) return null;
  const currentPrice =
    prediction.priceAtResolution ??
    MOCK_PRICES[prediction.coinSymbol] ??
    prediction.priceAtPrediction;

  const totalMove = prediction.targetPrice - prediction.priceAtPrediction;
  if (totalMove === 0) return 100;
  const currentMove = currentPrice - prediction.priceAtPrediction;
  return Math.min(100, Math.max(0, (currentMove / totalMove) * 100));
}

/* ── Status border styles ── */

const STATUS_BORDER: Record<Prediction["status"], string> = {
  correct: "border-status-correct/40",
  incorrect: "border-status-incorrect/40",
  pending: "border-border",
};

const STATUS_GLOW: Record<Prediction["status"], string> = {
  correct: "shadow-[0_0_24px_-8px_var(--status-correct)]",
  incorrect: "shadow-[0_0_24px_-8px_var(--status-incorrect)]",
  pending: "",
};

/* ── PredictionCardExpanded ── */

interface PredictionCardExpandedProps {
  prediction?: Prediction;
  className?: string;
}

export function PredictionCardExpanded({
  prediction = MOCK_PREDICTIONS[0],
  className,
}: PredictionCardExpandedProps) {
  const [copied, setCopied] = useState(false);
  const priceChange = getPriceChange(prediction);
  const progressToTarget = getProgressToTarget(prediction);
  const timeframeLabel =
    TIMEFRAME_LABELS[prediction.timeframe] ?? prediction.timeframe;
  const influencer = getInfluencerById(prediction.influencerId);
  const currentPrice =
    MOCK_PRICES[prediction.coinSymbol] ?? prediction.priceAtPrediction;
  const change24h = MOCK_PRICE_CHANGES_24H[prediction.coinSymbol] ?? 0;

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      {...FADE_IN}
      className={cn("space-y-6", className)}
    >
      {/* ── Back Navigation ── */}
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={SPRING_TRANSITION}
      >
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-secondary transition-colors"
        >
          <ArrowLeft size={14} />
          Back to predictions
        </Link>
      </motion.div>

      {/* ── Main Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING_TRANSITION, delay: 0.05 }}
        className={cn(
          "overflow-hidden rounded-2xl border bg-card",
          STATUS_BORDER[prediction.status],
          STATUS_GLOW[prediction.status]
        )}
      >
        {/* Card Header */}
        <div className="p-6 pb-0">
          <div className="flex items-start justify-between gap-4">
            {/* Influencer info */}
            <Link
              href={`/influencers/${prediction.influencerId}`}
              className="group flex items-center gap-3"
            >
              <Avatar className="h-12 w-12 border border-border">
                <AvatarImage
                  src={prediction.influencerAvatarUrl}
                  alt={prediction.influencerName}
                />
                <AvatarFallback className="text-sm">
                  {getInitials(prediction.influencerName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-base font-semibold text-foreground group-hover:text-accent-brand-hover transition-colors">
                  {prediction.influencerName}
                </p>
                <p className="text-sm text-text-muted">
                  {prediction.influencerHandle}
                </p>
              </div>
            </Link>

            {/* Status + actions */}
            <div className="flex items-center gap-2">
              <PredictionStatusBadge status={prediction.status} size="lg" />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-text-muted hover:text-foreground"
                onClick={handleCopy}
              >
                {copied ? <Check size={14} /> : <Share2 size={14} />}
              </Button>
            </div>
          </div>

          {/* Coin + Direction */}
          <div className="mt-5 flex items-center gap-3">
            <CoinIcon symbol={prediction.coinSymbol} size="lg" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-foreground">
                  {prediction.coinSymbol}
                </span>
                <span className="text-sm text-text-muted">
                  {prediction.coin}
                </span>
              </div>
              <div className="mt-0.5 flex items-center gap-2">
                <span className="font-mono text-sm tabular-nums text-text-secondary">
                  {formatPrice(currentPrice)}
                </span>
                <span
                  className={cn(
                    "font-mono text-xs font-semibold tabular-nums",
                    change24h >= 0
                      ? "text-status-correct"
                      : "text-status-incorrect"
                  )}
                >
                  {change24h >= 0 ? "+" : ""}
                  {change24h.toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="ml-auto">
              <PredictionTypeBadge direction={prediction.direction} size="lg" />
            </div>
          </div>
        </div>

        <Separator className="mt-5" />

        {/* Source Quote */}
        <div className="px-6 py-5">
          <p className="text-base leading-relaxed text-text-secondary italic">
            &ldquo;{prediction.sourceText}&rdquo;
          </p>
          <a
            href={prediction.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-xs text-text-muted hover:text-accent-brand-hover transition-colors"
          >
            <ExternalLink size={11} />
            View original source
          </a>
        </div>

        <Separator />

        {/* ── Price Grid ── */}
        <motion.div
          variants={STAGGER_CONTAINER}
          initial="initial"
          animate="animate"
          className="grid grid-cols-2 gap-px bg-border sm:grid-cols-4"
        >
          {/* Entry Price */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_TRANSITION, delay: 0.1 }}
            className="bg-card p-4"
          >
            <p className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
              Entry Price
            </p>
            <p className="mt-1 font-mono text-lg font-bold tabular-nums text-foreground">
              {formatCurrency(prediction.priceAtPrediction)}
            </p>
          </motion.div>

          {/* Target Price */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_TRANSITION, delay: 0.15 }}
            className="bg-card p-4"
          >
            <p className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
              Target Price
            </p>
            <p className="mt-1 font-mono text-lg font-bold tabular-nums text-accent-brand">
              {prediction.targetPrice != null
                ? formatCurrency(prediction.targetPrice)
                : "—"}
            </p>
          </motion.div>

          {/* Resolution / Current Price */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_TRANSITION, delay: 0.2 }}
            className="bg-card p-4"
          >
            <p className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
              {prediction.priceAtResolution != null
                ? "Exit Price"
                : "Current Price"}
            </p>
            <p className="mt-1 font-mono text-lg font-bold tabular-nums text-foreground">
              {formatCurrency(prediction.priceAtResolution ?? currentPrice)}
            </p>
          </motion.div>

          {/* Return / Progress */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_TRANSITION, delay: 0.25 }}
            className="bg-card p-4"
          >
            <p className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
              {priceChange ? "Return" : "Unrealized"}
            </p>
            {priceChange ? (
              <p
                className={cn(
                  "mt-1 font-mono text-lg font-bold tabular-nums",
                  priceChange.isPositive
                    ? "text-status-correct"
                    : "text-status-incorrect"
                )}
              >
                {priceChange.formatted}
              </p>
            ) : (
              <p
                className={cn(
                  "mt-1 font-mono text-lg font-bold tabular-nums",
                  currentPrice >= prediction.priceAtPrediction
                    ? "text-status-correct"
                    : "text-status-incorrect"
                )}
              >
                {formatPercentage(
                  getPriceChangePercent(
                    prediction.priceAtPrediction,
                    currentPrice
                  )
                )}
              </p>
            )}
          </motion.div>
        </motion.div>

        {/* Progress to Target */}
        {progressToTarget != null && prediction.status === "pending" && (
          <>
            <Separator />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ...SPRING_TRANSITION, delay: 0.3 }}
              className="px-6 py-4"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-muted">Progress to target</span>
                <span className="font-mono font-semibold tabular-nums text-text-secondary">
                  {progressToTarget.toFixed(0)}%
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-elevated">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressToTarget}%` }}
                  transition={{ ...SPRING_TRANSITION, delay: 0.4 }}
                  className="h-full rounded-full bg-accent-brand"
                />
              </div>
            </motion.div>
          </>
        )}

        <Separator />

        {/* ── Meta Row ── */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-6 py-4">
          <span className="inline-flex items-center gap-1.5 text-xs text-text-muted">
            <Calendar size={12} />
            <span className="text-text-secondary">{timeframeLabel}</span>
          </span>

          <span className="inline-flex items-center gap-1.5 text-xs text-text-muted">
            <Clock size={12} />
            <span className="text-text-secondary">
              {formatShortDate(prediction.predictedAt)}
            </span>
          </span>

          {prediction.status === "pending" && (
            <span className="inline-flex items-center gap-1.5 text-xs">
              <Target size={12} className="text-status-pending" />
              <span className="font-medium text-status-pending">
                {formatDaysRemaining(prediction.resolvesAt)}
              </span>
            </span>
          )}

          {prediction.resolvedAt && (
            <span className="inline-flex items-center gap-1.5 text-xs text-text-muted">
              Resolved {formatRelativeDate(prediction.resolvedAt)}
            </span>
          )}

          {prediction.submittedBy && (
            <Badge
              variant="outline"
              className="gap-1 border-border text-text-muted"
            >
              <Users size={10} />
              Community submitted
            </Badge>
          )}
        </div>
      </motion.div>

      {/* ── Influencer Quick Stats ── */}
      {influencer && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING_TRANSITION, delay: 0.15 }}
        >
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-text-secondary">
                  Influencer Stats
                </p>
                <Link
                  href={`/influencers/${prediction.influencerId}`}
                  className="text-xs text-accent-brand hover:text-accent-brand-hover transition-colors"
                >
                  View profile
                </Link>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                  <p className="text-[11px] text-text-muted">Accuracy</p>
                  <p className="mt-0.5 font-mono text-lg font-bold tabular-nums text-foreground">
                    <CountUp
                      value={influencer.accuracyScore}
                      decimals={1}
                      suffix="%"
                    />
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-text-muted">Predictions</p>
                  <p className="mt-0.5 font-mono text-lg font-bold tabular-nums text-foreground">
                    <CountUp value={influencer.totalPredictions} />
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-text-muted">Streak</p>
                  <p
                    className={cn(
                      "mt-0.5 font-mono text-lg font-bold tabular-nums",
                      influencer.streak > 0
                        ? "text-status-correct"
                        : influencer.streak < 0
                          ? "text-status-incorrect"
                          : "text-text-muted"
                    )}
                  >
                    {influencer.streak > 0
                      ? `${influencer.streak}W`
                      : influencer.streak < 0
                        ? `${Math.abs(influencer.streak)}L`
                        : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-text-muted">Followers</p>
                  <p className="mt-0.5 font-mono text-lg font-bold tabular-nums text-foreground">
                    {formatFollowerCount(influencer.followerCount)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
