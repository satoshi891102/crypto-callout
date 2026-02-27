"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Calendar,
  Flame,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SPRING_TRANSITION, FADE_IN, SCALE_TAP } from "@/lib/constants";
import { getTierForScore, PLATFORM_LABELS } from "@/lib/constants";
import { formatRelativeDate } from "@/lib/format";
import { formatFollowerCount } from "@/data/mock-influencers";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PlatformIcon, PlatformBadge } from "@/components/influencer/platform-icons";
import type { Influencer } from "@/types";

/* ── Helpers ── */

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getAccuracyColor(score: number) {
  if (score >= 70) return "text-status-correct";
  if (score >= 50) return "text-status-pending";
  return "text-status-incorrect";
}

function getStreakDisplay(streak: number) {
  if (streak === 0) return null;
  const isWin = streak > 0;
  return {
    label: `${Math.abs(streak)}${isWin ? "W" : "L"} streak`,
    icon: isWin ? TrendingUp : TrendingDown,
    color: isWin ? "text-status-correct" : "text-status-incorrect",
    hot: streak >= 5,
  };
}

/* ── Component ── */

interface InfluencerHeaderProps {
  influencer: Influencer;
  className?: string;
}

export function InfluencerHeader({ influencer, className }: InfluencerHeaderProps) {
  const tier = getTierForScore(influencer.accuracyScore);
  const streak = getStreakDisplay(influencer.streak);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={SPRING_TRANSITION}
      className={cn("space-y-6", className)}
    >
      {/* Back nav */}
      <Link
        href="/influencers"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-accent-brand-hover transition-colors"
      >
        <ArrowLeft size={14} />
        All Influencers
      </Link>

      {/* Main header card */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-8">
        {/* Accent glow */}
        <div
          className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full opacity-10 blur-3xl"
          style={{ background: tier.color }}
        />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={SPRING_TRANSITION}
          >
            <Avatar className="h-20 w-20 border-2 sm:h-24 sm:w-24" style={{ borderColor: tier.color }}>
              <AvatarImage src={influencer.avatarUrl} alt={influencer.name} />
              <AvatarFallback className="text-xl">{getInitials(influencer.name)}</AvatarFallback>
            </Avatar>
          </motion.div>

          {/* Info */}
          <div className="min-w-0 flex-1 space-y-3">
            {/* Name + platform row */}
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
                {influencer.name}
              </h1>
              <PlatformBadge platform={influencer.platform} />
            </div>

            {/* Handle + followers */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
              <span className="font-mono text-text-muted">{influencer.handle}</span>
              <span className="text-text-muted">·</span>
              <span>{formatFollowerCount(influencer.followerCount)} followers</span>
            </div>

            {/* Bio */}
            <p className="max-w-xl text-sm leading-relaxed text-text-secondary">
              {influencer.bio}
            </p>

            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {/* Tier badge */}
              <Badge
                variant="secondary"
                className="text-xs font-semibold"
                style={{ color: tier.color, borderColor: `color-mix(in oklch, ${tier.color} 30%, transparent)` }}
              >
                {tier.label}
              </Badge>

              {/* Rank badge */}
              {influencer.rank <= 10 && (
                <Badge variant="secondary" className="text-xs font-semibold text-accent-brand">
                  #{influencer.rank} Ranked
                </Badge>
              )}

              {/* Streak */}
              {streak && (
                <motion.span
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={SPRING_TRANSITION}
                  className={cn("inline-flex items-center gap-1 text-xs font-medium", streak.color)}
                >
                  <streak.icon size={12} />
                  {streak.label}
                  {streak.hot && <Flame size={12} className="text-warning" />}
                </motion.span>
              )}

              {/* Last active */}
              <span className="inline-flex items-center gap-1 text-xs text-text-muted">
                <Calendar size={11} />
                Active {formatRelativeDate(influencer.lastActiveAt)}
              </span>
            </div>
          </div>

          {/* Large accuracy callout */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={SPRING_TRANSITION}
            className="flex flex-col items-center gap-1 sm:items-end"
          >
            <span
              className={cn(
                "text-4xl font-extrabold tabular-nums sm:text-5xl",
                getAccuracyColor(influencer.accuracyScore)
              )}
            >
              {influencer.accuracyScore.toFixed(1)}%
            </span>
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
              Accuracy
            </span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
