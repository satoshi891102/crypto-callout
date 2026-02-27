"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Flame, Target } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";
import { formatPercentage, formatStreak } from "@/lib/format";
import { SPRING_TRANSITION, FADE_IN, SCALE_TAP, getTierForScore } from "@/lib/constants";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sparkline } from "@/components/shared/sparkline";
import { TrendArrow } from "@/components/shared/trend-arrow";
import { RankBadge } from "@/components/leaderboard/rank-badge";
import { PlatformIcon } from "@/components/influencer/platform-icons";
import { MOCK_LEADERBOARD } from "@/data/mock-leaderboard";
import type { LeaderboardEntry } from "@/types";

/* ── Helpers ── */

function getAccuracyColor(score: number) {
  if (score >= 70) return "text-status-correct";
  if (score >= 50) return "text-status-pending";
  return "text-status-incorrect";
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getReturnVariant(avgReturn: number) {
  if (avgReturn > 0) return "success" as const;
  if (avgReturn < 0) return "danger" as const;
  return "secondary" as const;
}

/* ── LeaderboardRow ── */

interface LeaderboardRowProps {
  entry?: LeaderboardEntry;
  index?: number;
  className?: string;
}

export function LeaderboardRow({
  entry: entryProp,
  index = 0,
  className,
}: LeaderboardRowProps) {
  const entry = entryProp ?? MOCK_LEADERBOARD[0];
  const { influencer, rank, accuracyScore, totalPredictions, correctPredictions, avgReturn, streak, trend, sparklineData } = entry;
  const tier = getTierForScore(accuracyScore);

  const sparklineColor =
    trend === "up"
      ? "var(--status-correct)"
      : trend === "down"
        ? "var(--status-incorrect)"
        : "var(--accent-brand)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...SPRING_TRANSITION, delay: index * 0.04 }}
    >
      <Link href={`/influencers/${influencer.id}`} className="block">
        <motion.div
          {...SCALE_TAP}
          className={cn(
            "group grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-colors hover:border-accent-brand/40 hover:bg-elevated/50",
            "md:grid-cols-[auto_1fr_repeat(4,auto)]",
            className
          )}
        >
          {/* Rank badge */}
          <RankBadge rank={rank} size="sm" showGlow={rank <= 3} />

          {/* Influencer info */}
          <div className="flex items-center gap-3 min-w-0">
            <Avatar
              className="h-10 w-10 shrink-0 border-2"
              style={{ borderColor: tier.color }}
            >
              <AvatarImage src={influencer.avatarUrl} alt={influencer.name} />
              <AvatarFallback>{getInitials(influencer.name)}</AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="truncate text-sm font-semibold text-foreground group-hover:text-accent-brand-hover transition-colors">
                  {influencer.name}
                </span>
                <PlatformIcon platform={influencer.platform} size={14} />
                {streak >= 5 && (
                  <motion.span
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  >
                    <Flame size={14} className="text-warning" />
                  </motion.span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <span className="truncate">{influencer.handle}</span>
                <Badge
                  variant="secondary"
                  className="hidden text-[10px] sm:inline-flex"
                  style={{ color: tier.color }}
                >
                  {tier.label}
                </Badge>
              </div>
            </div>
          </div>

          {/* Accuracy score — always visible */}
          <div className="text-right md:text-center">
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={SPRING_TRANSITION}
              className={cn(
                "text-lg font-bold tabular-nums",
                getAccuracyColor(accuracyScore)
              )}
            >
              {accuracyScore.toFixed(1)}%
            </motion.span>
            <p className="text-[10px] text-text-muted md:hidden">accuracy</p>
          </div>

          {/* Predictions — hidden on mobile */}
          <div className="hidden items-center gap-1.5 md:flex">
            <Target size={14} className="text-text-muted" />
            <span className="text-sm tabular-nums text-text-secondary">
              {correctPredictions}/{totalPredictions}
            </span>
          </div>

          {/* Avg return + streak — hidden on mobile */}
          <div className="hidden flex-col items-end gap-0.5 md:flex">
            <Badge variant={getReturnVariant(avgReturn)} className="text-xs tabular-nums">
              {formatPercentage(avgReturn)} avg
            </Badge>
            <div className="flex items-center gap-1">
              <TrendArrow trend={trend} size={12} />
              <span className="text-xs tabular-nums text-text-muted">
                {formatStreak(streak)}
              </span>
            </div>
          </div>

          {/* Sparkline — hidden on mobile */}
          <div className="hidden md:block">
            <Sparkline
              data={sparklineData}
              width={100}
              height={28}
              color={sparklineColor}
              strokeWidth={1.5}
              showGradient
            />
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
