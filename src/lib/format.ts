import { formatDistanceToNow, format, differenceInDays, parseISO } from "date-fns";
import type {
  PredictionDirection,
  PredictionStatus,
  PredictionTimeframe,
  Platform,
  InfluencerTier,
} from "@/types";
import {
  PLATFORM_LABELS,
  STATUS_LABELS,
  DIRECTION_LABELS,
  TIMEFRAME_LABELS,
  TIME_RANGE_LABELS,
} from "@/lib/constants";

/* ── Numbers ── */

export function formatNumber(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toLocaleString();
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

/* ── Currency ── */

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: value < 1 ? 4 : 2,
    maximumFractionDigits: value < 1 ? 6 : 2,
  }).format(value);
}

export function formatCurrencyCompact(value: number): string {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(1)}K`;
  }
  return formatCurrency(value);
}

/* ── Percentages ── */

export function formatPercentage(value: number): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
}

export function formatAccuracy(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatAccuracyFromRatio(correct: number, total: number): string {
  if (total === 0) return "N/A";
  return formatAccuracy((correct / total) * 100);
}

/* ── Dates ── */

export function formatRelativeDate(dateStr: string): string {
  return formatDistanceToNow(parseISO(dateStr), { addSuffix: true });
}

export function formatShortDate(dateStr: string): string {
  return format(parseISO(dateStr), "MMM d, yyyy");
}

export function formatChartDate(dateStr: string): string {
  return format(parseISO(dateStr), "MMM d");
}

export function formatFullDate(dateStr: string): string {
  return format(parseISO(dateStr), "MMMM d, yyyy 'at' h:mm a");
}

export function daysUntilResolution(resolvesAt: string): number {
  return differenceInDays(parseISO(resolvesAt), new Date());
}

export function formatDaysRemaining(resolvesAt: string): string {
  const days = daysUntilResolution(resolvesAt);
  if (days < 0) return "Overdue";
  if (days === 0) return "Today";
  if (days === 1) return "1 day left";
  return `${days} days left`;
}

/* ── Price Change ── */

export function formatPriceChange(
  priceAtPrediction: number,
  currentPrice: number
): string {
  const change = ((currentPrice - priceAtPrediction) / priceAtPrediction) * 100;
  return formatPercentage(change);
}

export function getPriceChangePercent(
  priceAtPrediction: number,
  currentPrice: number
): number {
  return ((currentPrice - priceAtPrediction) / priceAtPrediction) * 100;
}

/* ── Streak ── */

export function formatStreak(streak: number): string {
  if (streak === 0) return "—";
  if (streak > 0) return `${streak}W`;
  return `${Math.abs(streak)}L`;
}

/* ── Label Lookups ── */

export function getPlatformLabel(platform: Platform): string {
  return PLATFORM_LABELS[platform];
}

export function getStatusLabel(status: PredictionStatus): string {
  return STATUS_LABELS[status];
}

export function getDirectionLabel(direction: PredictionDirection): string {
  return DIRECTION_LABELS[direction];
}

export function getTimeframeLabel(timeframe: PredictionTimeframe): string {
  return TIMEFRAME_LABELS[timeframe] ?? timeframe;
}

export function getTimeRangeLabel(range: string): string {
  return TIME_RANGE_LABELS[range] ?? range;
}

/* ── Tier Label ── */

export function getTierLabel(tier: InfluencerTier): string {
  const labels: Record<InfluencerTier, string> = {
    legendary: "Legendary",
    expert: "Expert",
    intermediate: "Intermediate",
    novice: "Novice",
    unranked: "Unranked",
  };
  return labels[tier];
}

/* ── Rank Display ── */

export function formatRank(rank: number): string {
  if (rank === 1) return "1st";
  if (rank === 2) return "2nd";
  if (rank === 3) return "3rd";
  return `${rank}th`;
}

/* ── Influencer Handle ── */

export function formatHandle(handle: string): string {
  return handle.startsWith("@") ? handle : `@${handle}`;
}
