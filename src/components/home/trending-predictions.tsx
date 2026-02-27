"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TrendingUp, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SPRING_TRANSITION, STAGGER_CONTAINER, SCALE_TAP } from "@/lib/constants";
import { CoinIcon } from "@/components/shared/coin-icon";
import { SectionHeader } from "@/components/shared/section-header";
import { MOCK_TRENDING_COINS, type TrendingCoin } from "@/data/mock-home";

function AccuracyBar({ value }: { value: number }) {
  const color =
    value >= 70
      ? "bg-status-correct"
      : value >= 50
        ? "bg-status-pending"
        : "bg-status-incorrect";

  return (
    <div className="h-1.5 w-full rounded-full bg-elevated">
      <motion.div
        className={cn("h-full rounded-full", color)}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ ...SPRING_TRANSITION, delay: 0.2 }}
      />
    </div>
  );
}

interface TrendingRowProps {
  coin: TrendingCoin;
  index: number;
}

function TrendingRow({ coin, index }: TrendingRowProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, x: -8 },
        visible: { opacity: 1, x: 0 },
      }}
      transition={{ ...SPRING_TRANSITION, delay: index * 0.06 }}
    >
      <motion.div
        {...SCALE_TAP}
        className="group flex items-center gap-3 rounded-lg border border-transparent px-3 py-3 transition-colors hover:border-border hover:bg-elevated/50"
      >
        <CoinIcon symbol={coin.symbol} size="md" animated={false} />

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <span className="text-sm font-semibold text-text-primary">
                {coin.symbol}
              </span>
              <span className="ml-1.5 text-xs text-text-muted">{coin.name}</span>
            </div>
            <span className="shrink-0 text-xs tabular-nums text-text-secondary">
              {coin.predictionCount.toLocaleString()} calls
            </span>
          </div>

          <div className="mt-1.5 flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <AccuracyBar value={coin.avgAccuracy} />
            </div>
            <span className="shrink-0 text-xs tabular-nums text-text-muted">
              {coin.avgAccuracy.toFixed(1)}%
            </span>
          </div>

          <div className="mt-1 flex items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-0.5 text-[11px] font-medium",
                coin.bullishPercent >= 70
                  ? "text-status-correct"
                  : coin.bullishPercent >= 40
                    ? "text-status-pending"
                    : "text-status-incorrect"
              )}
            >
              <TrendingUp size={10} />
              {coin.bullishPercent}% bullish
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

interface TrendingPredictionsProps {
  coins?: TrendingCoin[];
  className?: string;
}

export function TrendingPredictions({
  coins = MOCK_TRENDING_COINS,
  className,
}: TrendingPredictionsProps) {
  return (
    <section className={cn("space-y-4", className)}>
      <SectionHeader
        title="Trending"
        description="Most predicted coins right now"
        badge="Live"
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
        className="space-y-1"
      >
        {coins.map((coin, i) => (
          <TrendingRow key={coin.symbol} coin={coin} index={i} />
        ))}
      </motion.div>
    </section>
  );
}
