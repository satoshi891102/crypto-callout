"use client";

import Link from "next/link";
import { TrendingUp, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SPRING_TRANSITION } from "@/lib/constants";
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
      <div
        className={cn("h-full rounded-full", color)}
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
    <div
    >
      <div
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
      </div>
    </div>
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
        title="Most Called"
        description="Where the hype is pointing"
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

      <div
        className="space-y-1"
      >
        {coins.map((coin, i) => (
          <TrendingRow key={coin.symbol} coin={coin} index={i} />
        ))}
      </div>
    </section>
  );
}
