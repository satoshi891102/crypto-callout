"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink, Calendar, Target, Users } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import {
  SPRING_TRANSITION,
  FADE_IN,
  SCALE_TAP,
  TIMEFRAME_LABELS,
} from "@/lib/constants";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CoinIcon } from "@/components/shared/coin-icon";
import { PredictionStatusBadge } from "@/components/prediction/prediction-status-badge";
import { PredictionTypeBadge } from "@/components/prediction/prediction-type-badge";
import type { Prediction } from "@/types";
import { MOCK_PREDICTIONS } from "@/data/mock-predictions";

/* ── Helpers ── */

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
  return `${Math.floor(diffDays / 365)}y ago`;
}

function getPriceChange(prediction: Prediction): {
  pct: number;
  formatted: string;
  isPositive: boolean;
} | null {
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

/* ── Status border color map ── */

const STATUS_BORDER: Record<Prediction["status"], string> = {
  correct: "border-status-correct/30 hover:border-status-correct/50",
  incorrect: "border-status-incorrect/30 hover:border-status-incorrect/50",
  pending: "border-border hover:border-accent-brand/40",
};

/* ── PredictionCard ── */

interface PredictionCardProps {
  prediction?: Prediction;
  compact?: boolean;
  className?: string;
}

export function PredictionCard({
  prediction = MOCK_PREDICTIONS[0],
  compact = false,
  className,
}: PredictionCardProps) {
  const priceChange = getPriceChange(prediction);
  const timeframeLabel =
    TIMEFRAME_LABELS[prediction.timeframe] ?? prediction.timeframe;

  return (
    <motion.div {...FADE_IN}>
      <motion.div
        {...SCALE_TAP}
        className={cn(
          "group relative overflow-hidden rounded-xl border bg-card transition-colors",
          STATUS_BORDER[prediction.status],
          compact ? "p-4" : "p-5",
          className
        )}
      >
        {/* Top row: influencer + status */}
        <div className="flex items-start justify-between gap-3">
          <Link
            href={`/influencers/${prediction.influencerId}`}
            className="flex min-w-0 items-center gap-2.5"
          >
            <Avatar className="h-8 w-8 shrink-0 border border-border">
              <AvatarImage
                src={prediction.influencerAvatarUrl}
                alt={prediction.influencerName}
              />
              <AvatarFallback className="text-[10px]">
                {getInitials(prediction.influencerName)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground group-hover:text-accent-brand-hover transition-colors">
                {prediction.influencerName}
              </p>
              <p className="truncate text-[11px] text-text-muted">
                {prediction.influencerHandle}
              </p>
            </div>
          </Link>
          <PredictionStatusBadge status={prediction.status} size="sm" />
        </div>

        {/* Coin + direction row */}
        <div className="mt-3 flex items-center gap-2">
          <CoinIcon symbol={prediction.coinSymbol} size="sm" animated={false} />
          <span className="text-sm font-semibold text-foreground">
            {prediction.coinSymbol}
          </span>
          <span className="text-xs text-text-muted">{prediction.coin}</span>
          <PredictionTypeBadge
            direction={prediction.direction}
            size="sm"
            animated={false}
          />
        </div>

        {/* Source text */}
        {!compact && (
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-text-secondary">
            &ldquo;{prediction.sourceText}&rdquo;
          </p>
        )}

        {/* Price data */}
        <div
          className={cn(
            "flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-secondary",
            compact ? "mt-3" : "mt-4"
          )}
        >
          {/* Entry price */}
          <span className="inline-flex items-center gap-1">
            <span className="text-text-muted">Entry:</span>
            <span className="font-medium text-foreground tabular-nums">
              {formatCurrency(prediction.priceAtPrediction)}
            </span>
          </span>

          {/* Target price */}
          {prediction.targetPrice != null && (
            <span className="inline-flex items-center gap-1">
              <Target size={11} className="text-text-muted" />
              <span className="font-medium text-foreground tabular-nums">
                {formatCurrency(prediction.targetPrice)}
              </span>
            </span>
          )}

          {/* Resolution price + change */}
          {prediction.priceAtResolution != null && priceChange && (
            <span className="inline-flex items-center gap-1">
              <span className="text-text-muted">Exit:</span>
              <span className="font-medium text-foreground tabular-nums">
                {formatCurrency(prediction.priceAtResolution)}
              </span>
              <motion.span
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={SPRING_TRANSITION}
                className={cn(
                  "font-semibold tabular-nums",
                  priceChange.isPositive
                    ? "text-status-correct"
                    : "text-status-incorrect"
                )}
              >
                {priceChange.formatted}
              </motion.span>
            </span>
          )}
        </div>

        {/* Footer: timeframe, date, source, community */}
        <div
          className={cn(
            "flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-text-muted",
            compact ? "mt-3" : "mt-4"
          )}
        >
          <span className="inline-flex items-center gap-1">
            <Calendar size={11} />
            {timeframeLabel}
          </span>

          <span>{getRelativeTime(prediction.predictedAt)}</span>

          {prediction.submittedBy && (
            <span className="inline-flex items-center gap-1">
              <Users size={11} />
              Community
            </span>
          )}

          <a
            href={prediction.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto inline-flex items-center gap-1 text-text-muted hover:text-accent-brand-hover transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink size={11} />
            Source
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}
