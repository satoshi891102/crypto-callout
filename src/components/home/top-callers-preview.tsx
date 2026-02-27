"use client";

import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { SPRING_TRANSITION } from "@/lib/constants";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { RankBadge } from "@/components/leaderboard/rank-badge";
import { Sparkline } from "@/components/shared/sparkline";
import { TrendArrow } from "@/components/shared/trend-arrow";
import { SectionHeader } from "@/components/shared/section-header";
import { formatAccuracy } from "@/lib/format";
import type { LeaderboardEntry } from "@/types";
import { getTopPerformers } from "@/data/mock-leaderboard";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

interface CallerRowProps {
  entry: LeaderboardEntry;
  index: number;
}

function CallerRow({ entry, index }: CallerRowProps) {
  const { influencer, accuracyScore, streak, trend, sparklineData, avgReturn } =
    entry;

  const sparkColor =
    trend === "up"
      ? "var(--status-correct)"
      : trend === "down"
        ? "var(--status-incorrect)"
        : "var(--accent-brand)";

  return (
    <div
    >
      <Link href={`/influencers/${influencer.id}`}>
        <div
          className="group flex items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 transition-colors hover:border-border hover:bg-elevated/50"
        >
          {/* Rank */}
          <RankBadge rank={entry.rank} size="sm" showGlow={false} />

          {/* Avatar */}
          <Avatar className="h-8 w-8 shrink-0 border border-border">
            <AvatarImage src={influencer.avatarUrl} alt={influencer.name} />
            <AvatarFallback className="text-[10px]">
              {getInitials(influencer.name)}
            </AvatarFallback>
          </Avatar>

          {/* Name + handle */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-text-primary group-hover:text-accent-brand-hover transition-colors">
              {influencer.name}
            </p>
            <div className="flex items-center gap-2 text-[11px] text-text-muted">
              <span className="truncate">{influencer.handle}</span>
              {streak > 0 && (
                <span className="inline-flex shrink-0 items-center gap-0.5 text-status-correct">
                  <Flame size={10} />
                  {streak}
                </span>
              )}
            </div>
          </div>

          {/* Sparkline */}
          <Sparkline
            data={sparklineData}
            width={64}
            height={24}
            color={sparkColor}
            strokeWidth={1.5}
            showGradient={false}
            animated={false}
            className="hidden shrink-0 sm:block"
          />

          {/* Accuracy + trend */}
          <div className="shrink-0 text-right">
            <p className="text-sm font-semibold tabular-nums text-text-primary">
              {formatAccuracy(accuracyScore)}
            </p>
            <div className="flex items-center justify-end gap-1">
              <TrendArrow trend={trend} size={12} />
              <span
                className={cn(
                  "text-[11px] tabular-nums",
                  avgReturn >= 0 ? "text-status-correct" : "text-status-incorrect"
                )}
              >
                {avgReturn >= 0 ? "+" : ""}
                {avgReturn.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

interface TopCallersPreviewProps {
  entries?: LeaderboardEntry[];
  limit?: number;
  className?: string;
}

export function TopCallersPreview({
  entries,
  limit = 5,
  className,
}: TopCallersPreviewProps) {
  const data = entries ?? getTopPerformers(limit);

  return (
    <section className={cn("space-y-4", className)}>
      <SectionHeader
        title="Who's Actually Good"
        description="The rare few who beat the odds"
        action={
          <Link
            href="/leaderboard"
            className="inline-flex items-center gap-1 text-xs font-medium text-accent-brand hover:text-accent-brand-hover transition-colors"
          >
            Full leaderboard
            <ArrowRight size={12} />
          </Link>
        }
      />

      <div
        className="space-y-0.5"
      >
        {data.map((entry, i) => (
          <CallerRow key={entry.influencer.id} entry={entry} index={i} />
        ))}
      </div>
    </section>
  );
}
