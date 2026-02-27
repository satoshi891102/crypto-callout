"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Flame, Target, ChevronRight } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";
import { SPRING_TRANSITION, FADE_IN, SCALE_TAP } from "@/lib/constants";
import { getTierForScore } from "@/lib/constants";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sparkline } from "@/components/shared/sparkline";
import { TrendArrow } from "@/components/shared/trend-arrow";
import { PlatformIcon } from "@/components/influencer/platform-icons";
import type { Influencer, LeaderboardEntry } from "@/types";

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

/* ── InfluencerCardRow (table/list layout) ── */

interface InfluencerCardRowProps {
  influencer: Influencer;
  rank?: number;
  trend?: LeaderboardEntry["trend"];
  sparklineData?: number[];
  avgReturn?: number;
  className?: string;
}

export function InfluencerCardRow({
  influencer,
  rank,
  trend,
  sparklineData,
  avgReturn,
  className,
}: InfluencerCardRowProps) {
  const tier = getTierForScore(influencer.accuracyScore);

  return (
    <motion.div {...FADE_IN}>
      <Link href={`/influencers/${influencer.id}`} className="block">
        <motion.div
          {...SCALE_TAP}
          className={cn(
            "group flex items-center gap-4 rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:border-accent-brand/40 hover:bg-elevated/50",
            className
          )}
        >
          {/* Rank */}
          {rank != null && (
            <div className="flex w-8 shrink-0 items-center justify-center">
              <span
                className={cn(
                  "text-sm font-bold tabular-nums",
                  rank === 1 && "text-warning",
                  rank === 2 && "text-text-secondary",
                  rank === 3 && "text-[#CD7F32]",
                  rank > 3 && "text-text-muted"
                )}
              >
                {rank}
              </span>
            </div>
          )}

          {/* Avatar */}
          <Avatar className="h-10 w-10 shrink-0 border-2" style={{ borderColor: tier.color }}>
            <AvatarImage src={influencer.avatarUrl} alt={influencer.name} />
            <AvatarFallback className="text-xs">{getInitials(influencer.name)}</AvatarFallback>
          </Avatar>

          {/* Name + handle + platform */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-sm font-semibold text-foreground group-hover:text-accent-brand-hover transition-colors">
                {influencer.name}
              </span>
              <PlatformIcon platform={influencer.platform} size={13} />
              {influencer.streak >= 5 && (
                <Flame size={13} className="shrink-0 text-warning" />
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="truncate text-xs text-text-muted">{influencer.handle}</span>
              <Badge variant="secondary" className="hidden text-[10px] sm:inline-flex" style={{ color: tier.color }}>
                {tier.label}
              </Badge>
            </div>
          </div>

          {/* Sparkline (hidden on mobile) */}
          {sparklineData && sparklineData.length >= 2 && (
            <div className="hidden shrink-0 md:block">
              <Sparkline
                data={sparklineData}
                width={80}
                height={28}
                color={
                  influencer.accuracyScore >= 70
                    ? "var(--status-correct)"
                    : influencer.accuracyScore >= 50
                      ? "var(--status-pending)"
                      : "var(--status-incorrect)"
                }
                strokeWidth={1.5}
              />
            </div>
          )}

          {/* Stats column */}
          <div className="hidden shrink-0 flex-col items-end gap-0.5 sm:flex">
            <span className="text-xs text-text-muted">
              <Target size={11} className="mr-0.5 inline" />
              {influencer.totalPredictions} calls
            </span>
            <span className="text-xs text-text-muted">
              {formatNumber(influencer.followerCount)} followers
            </span>
          </div>

          {/* Avg return (if provided) */}
          {avgReturn != null && (
            <div className="hidden w-16 shrink-0 text-right lg:block">
              <span
                className={cn(
                  "text-xs font-medium tabular-nums",
                  avgReturn >= 0 ? "text-status-correct" : "text-status-incorrect"
                )}
              >
                {avgReturn >= 0 ? "+" : ""}
                {avgReturn.toFixed(1)}%
              </span>
              <p className="text-[10px] text-text-muted">avg return</p>
            </div>
          )}

          {/* Trend */}
          {trend && (
            <div className="hidden shrink-0 sm:block">
              <TrendArrow trend={trend} size={16} />
            </div>
          )}

          {/* Accuracy */}
          <div className="flex shrink-0 flex-col items-end">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={SPRING_TRANSITION}
              className={cn("text-base font-bold tabular-nums", getAccuracyColor(influencer.accuracyScore))}
            >
              {influencer.accuracyScore.toFixed(1)}%
            </motion.span>
            <span className="text-[10px] text-text-muted">accuracy</span>
          </div>

          {/* Chevron */}
          <ChevronRight
            size={16}
            className="shrink-0 text-text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent-brand-hover"
          />
        </motion.div>
      </Link>
    </motion.div>
  );
}
