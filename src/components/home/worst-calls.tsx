"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Skull, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { SPRING_TRANSITION, STAGGER_CONTAINER, SCALE_TAP } from "@/lib/constants";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CoinIcon } from "@/components/shared/coin-icon";
import { SectionHeader } from "@/components/shared/section-header";
import { formatRelativeDate } from "@/lib/format";
import { formatCurrency } from "@/lib/utils";
import type { Prediction } from "@/types";
import { MOCK_PREDICTIONS } from "@/data/mock-predictions";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getMissPercent(prediction: Prediction): number | null {
  if (prediction.priceAtResolution == null || prediction.targetPrice == null)
    return null;

  // How far from target the resolution was, as percent of entry price
  const miss =
    Math.abs(prediction.targetPrice - prediction.priceAtResolution) /
    prediction.priceAtPrediction;
  return miss * 100;
}

function getPriceChangePercent(prediction: Prediction): {
  pct: number;
  formatted: string;
} | null {
  if (prediction.priceAtResolution == null) return null;
  const pct =
    ((prediction.priceAtResolution - prediction.priceAtPrediction) /
      prediction.priceAtPrediction) *
    100;
  return {
    pct,
    formatted: `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`,
  };
}

/** Get worst incorrect predictions, sorted by miss magnitude */
function getWorstCalls(allPredictions: Prediction[], limit: number): Prediction[] {
  return allPredictions
    .filter((p) => p.status === "incorrect")
    .sort((a, b) => {
      const missA = getMissPercent(a) ?? 0;
      const missB = getMissPercent(b) ?? 0;
      return missB - missA;
    })
    .slice(0, limit);
}

interface WorstCallRowProps {
  prediction: Prediction;
  index: number;
}

function WorstCallRow({ prediction, index }: WorstCallRowProps) {
  const priceChange = getPriceChangePercent(prediction);
  const DirectionIcon =
    prediction.direction === "bullish" ? TrendingUp : TrendingDown;

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
        className="group flex items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 transition-colors hover:border-status-incorrect/20 hover:bg-status-incorrect-bg"
      >
        {/* Skull icon */}
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-status-incorrect-bg">
          <Skull size={14} className="text-status-incorrect" />
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
            <span className="text-xs text-text-secondary">
              {prediction.coinSymbol}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-text-muted">
            <span className="inline-flex items-center gap-0.5">
              <DirectionIcon size={10} />
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

        {/* Price change */}
        <div className="shrink-0 text-right">
          {priceChange && (
            <span className="text-sm font-semibold tabular-nums text-status-incorrect">
              {priceChange.formatted}
            </span>
          )}
          {prediction.priceAtResolution != null && (
            <p className="text-[11px] tabular-nums text-text-muted">
              Resolved: {formatCurrency(prediction.priceAtResolution)}
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

interface WorstCallsProps {
  predictions?: Prediction[];
  limit?: number;
  className?: string;
}

export function WorstCalls({
  predictions,
  limit = 5,
  className,
}: WorstCallsProps) {
  const data = getWorstCalls(predictions ?? MOCK_PREDICTIONS, limit);

  return (
    <section className={cn("space-y-4", className)}>
      <SectionHeader
        title="Wall of Shame"
        description="The calls that aged like milk"
        action={
          <Link
            href="/predictions?status=incorrect"
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
          <WorstCallRow
            key={prediction.id}
            prediction={prediction}
            index={i}
          />
        ))}
      </motion.div>
    </section>
  );
}
