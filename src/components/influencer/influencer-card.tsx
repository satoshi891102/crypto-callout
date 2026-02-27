"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Flame, Target, TrendingUp, TrendingDown } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";
import { SPRING_TRANSITION, FADE_IN, SCALE_TAP } from "@/lib/constants";
import { getTierForScore } from "@/lib/constants";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PlatformIcon } from "@/components/influencer/platform-icons";
import type { Influencer } from "@/types";

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

/* ── InfluencerCard (grid layout) ── */

interface InfluencerCardProps {
  influencer: Influencer;
  rank?: number;
  className?: string;
}

export function InfluencerCard({ influencer, rank, className }: InfluencerCardProps) {
  const tier = getTierForScore(influencer.accuracyScore);

  return (
    <motion.div {...FADE_IN}>
      <Link href={`/influencers/${influencer.id}`} className="block">
        <motion.div
          {...SCALE_TAP}
          className={cn(
            "group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-colors hover:border-accent-brand/40 hover:bg-elevated/50",
            className
          )}
        >
          {/* Rank badge */}
          {rank != null && rank <= 3 && (
            <div className="absolute right-3 top-3">
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold",
                  rank === 1 && "bg-warning/20 text-warning",
                  rank === 2 && "bg-text-secondary/20 text-text-secondary",
                  rank === 3 && "bg-[#CD7F32]/20 text-[#CD7F32]"
                )}
              >
                {rank}
              </span>
            </div>
          )}

          {/* Header: avatar + name + platform */}
          <div className="flex items-start gap-3">
            <Avatar className="h-12 w-12 border-2" style={{ borderColor: tier.color }}>
              <AvatarImage src={influencer.avatarUrl} alt={influencer.name} />
              <AvatarFallback>{getInitials(influencer.name)}</AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h3 className="truncate text-sm font-semibold text-foreground group-hover:text-accent-brand-hover transition-colors">
                  {influencer.name}
                </h3>
                <PlatformIcon platform={influencer.platform} size={14} />
              </div>
              <p className="truncate text-xs text-text-muted">{influencer.handle}</p>
            </div>
          </div>

          {/* Accuracy score */}
          <div className="mt-4 flex items-baseline gap-1.5">
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={SPRING_TRANSITION}
              className={cn("text-2xl font-bold tabular-nums", getAccuracyColor(influencer.accuracyScore))}
            >
              {influencer.accuracyScore.toFixed(1)}%
            </motion.span>
            <span className="text-xs text-text-muted">accuracy</span>
          </div>

          {/* Stats row */}
          <div className="mt-3 flex items-center gap-3 text-xs text-text-secondary">
            <span className="inline-flex items-center gap-1">
              <Target size={12} className="text-text-muted" />
              {influencer.totalPredictions} calls
            </span>
            <span className="inline-flex items-center gap-1">
              {influencer.streak > 0 ? (
                <TrendingUp size={12} className="text-status-correct" />
              ) : influencer.streak < 0 ? (
                <TrendingDown size={12} className="text-status-incorrect" />
              ) : null}
              {influencer.streak !== 0 && (
                <span>
                  {Math.abs(influencer.streak)} streak
                </span>
              )}
            </span>
            {influencer.streak >= 5 && (
              <Flame size={12} className="text-warning" />
            )}
          </div>

          {/* Tier + followers */}
          <div className="mt-3 flex items-center justify-between">
            <Badge variant="secondary" className="text-[10px]" style={{ color: tier.color }}>
              {tier.label}
            </Badge>
            <span className="text-[11px] text-text-muted">
              {formatNumber(influencer.followerCount)} followers
            </span>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
