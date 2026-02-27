"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { SPRING_TRANSITION, STAGGER_CONTAINER, SCALE_TAP } from "@/lib/constants";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CoinIcon } from "@/components/shared/coin-icon";
import { SectionHeader } from "@/components/shared/section-header";
import { formatRelativeDate } from "@/lib/format";
import { formatCurrency } from "@/lib/utils";
import type { Prediction, PredictionStatus } from "@/types";
import { getRecentPredictions } from "@/data/mock-predictions";

const STATUS_CONFIG: Record<
  PredictionStatus,
  { icon: typeof CheckCircle2; label: string; color: string; bg: string }
> = {
  correct: {
    icon: CheckCircle2,
    label: "Correct",
    color: "text-status-correct",
    bg: "bg-status-correct-bg",
  },
  incorrect: {
    icon: XCircle,
    label: "Incorrect",
    color: "text-status-incorrect",
    bg: "bg-status-incorrect-bg",
  },
  pending: {
    icon: Clock,
    label: "Pending",
    color: "text-status-pending",
    bg: "bg-status-pending-bg",
  },
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getPriceChangeData(prediction: Prediction) {
  if (prediction.priceAtResolution == null) return null;
  const pct =
    ((prediction.priceAtResolution - prediction.priceAtPrediction) /
      prediction.priceAtPrediction) *
    100;
  return {
    pct,
    formatted: `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`,
    isPositive: pct >= 0,
  };
}

interface PredictionRowProps {
  prediction: Prediction;
  index: number;
}

function PredictionRow({ prediction, index }: PredictionRowProps) {
  const statusConfig = STATUS_CONFIG[prediction.status];
  const StatusIcon = statusConfig.icon;
  const priceChange = getPriceChangeData(prediction);

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 8 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ ...SPRING_TRANSITION, delay: index * 0.06 }}
    >
      <motion.div
        {...SCALE_TAP}
        className="group flex items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 transition-colors hover:border-border hover:bg-elevated/50"
      >
        {/* Status indicator */}
        <div
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
            statusConfig.bg
          )}
        >
          <StatusIcon size={14} className={statusConfig.color} />
        </div>

        {/* Avatar */}
        <Avatar className="h-7 w-7 shrink-0 border border-border">
          <AvatarImage
            src={prediction.influencerAvatarUrl}
            alt={prediction.influencerName}
          />
          <AvatarFallback className="text-[9px]">
            {getInitials(prediction.influencerName)}
          </AvatarFallback>
        </Avatar>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-sm font-medium text-text-primary">
              {prediction.influencerName}
            </span>
            <CoinIcon
              symbol={prediction.coinSymbol}
              size="sm"
              animated={false}
            />
            <span className="text-xs font-medium text-text-secondary">
              {prediction.coinSymbol}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-text-muted">
            <span
              className={cn(
                "font-medium",
                prediction.direction === "bullish"
                  ? "text-status-correct"
                  : "text-status-incorrect"
              )}
            >
              {prediction.direction === "bullish" ? "Bullish" : "Bearish"}
            </span>
            {prediction.targetPrice != null && (
              <span className="tabular-nums">
                Target: {formatCurrency(prediction.targetPrice)}
              </span>
            )}
            <span>{formatRelativeDate(prediction.predictedAt)}</span>
          </div>
        </div>

        {/* Price change / status */}
        <div className="shrink-0 text-right">
          {priceChange ? (
            <span
              className={cn(
                "text-sm font-semibold tabular-nums",
                priceChange.isPositive
                  ? "text-status-correct"
                  : "text-status-incorrect"
              )}
            >
              {priceChange.formatted}
            </span>
          ) : (
            <span
              className={cn("text-xs font-medium", statusConfig.color)}
            >
              {statusConfig.label}
            </span>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

interface RecentlyVerifiedProps {
  predictions?: Prediction[];
  limit?: number;
  className?: string;
}

export function RecentlyVerified({
  predictions,
  limit = 6,
  className,
}: RecentlyVerifiedProps) {
  const data = predictions ?? getRecentPredictions(limit);

  return (
    <section className={cn("space-y-4", className)}>
      <SectionHeader
        title="Recent Predictions"
        description="Latest tracked calls and resolutions"
        action={
          <Link
            href="/predictions"
            className="inline-flex items-center gap-1 text-xs font-medium text-accent-brand hover:text-accent-brand-hover transition-colors"
          >
            View all
            <ArrowRight size={12} />
          </Link>
        }
      />

      <motion.div
        variants={STAGGER_CONTAINER}
        initial="hidden"
        animate="animate"
        className="space-y-0.5"
      >
        {data.map((prediction, i) => (
          <PredictionRow
            key={prediction.id}
            prediction={prediction}
            index={i}
          />
        ))}
      </motion.div>
    </section>
  );
}
