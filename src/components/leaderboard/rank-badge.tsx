"use client";

import { motion } from "framer-motion";
import { Trophy, Medal, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { SPRING_TRANSITION } from "@/lib/constants";

/* ── Rank tier config ── */

interface RankTierConfig {
  icon: typeof Trophy;
  bg: string;
  text: string;
  ring: string;
  glow: string;
}

const RANK_TIERS: Record<number, RankTierConfig> = {
  1: {
    icon: Trophy,
    bg: "bg-warning/15",
    text: "text-warning",
    ring: "ring-warning/30",
    glow: "shadow-[0_0_12px_var(--status-pending)]",
  },
  2: {
    icon: Medal,
    bg: "bg-text-secondary/15",
    text: "text-text-secondary",
    ring: "ring-text-secondary/30",
    glow: "shadow-[0_0_8px_var(--text-secondary)]",
  },
  3: {
    icon: Award,
    bg: "bg-[#CD7F32]/15",
    text: "text-[#CD7F32]",
    ring: "ring-[#CD7F32]/30",
    glow: "shadow-[0_0_8px_#CD7F32]",
  },
};

/* ── Props ── */

interface RankBadgeProps {
  rank: number;
  size?: "sm" | "md" | "lg";
  showGlow?: boolean;
  className?: string;
}

const SIZE_MAP = {
  sm: { container: "h-7 w-7", icon: 12, text: "text-xs" },
  md: { container: "h-9 w-9", icon: 16, text: "text-sm" },
  lg: { container: "h-11 w-11", icon: 20, text: "text-base" },
} as const;

export function RankBadge({
  rank,
  size = "md",
  showGlow = true,
  className,
}: RankBadgeProps) {
  const tier = RANK_TIERS[rank];
  const sizeConfig = SIZE_MAP[size];

  // Top 3 get special treatment with icons and colors
  if (tier) {
    const Icon = tier.icon;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.5, rotate: -12 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={SPRING_TRANSITION}
        className={cn(
          "relative inline-flex items-center justify-center rounded-full ring-1",
          sizeConfig.container,
          tier.bg,
          tier.text,
          tier.ring,
          showGlow && tier.glow,
          className
        )}
        title={`Rank #${rank}`}
      >
        <Icon size={sizeConfig.icon} strokeWidth={2.5} />
        {/* Pulse ring for #1 */}
        {rank === 1 && showGlow && (
          <motion.span
            className="absolute inset-0 rounded-full ring-2 ring-warning/40"
            animate={{ scale: [1, 1.3], opacity: [0.6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
          />
        )}
      </motion.div>
    );
  }

  // Ranks 4+ get a numeric badge
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={SPRING_TRANSITION}
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-elevated ring-1 ring-border",
        sizeConfig.container,
        className
      )}
      title={`Rank #${rank}`}
    >
      <span
        className={cn(
          "font-bold tabular-nums text-text-secondary",
          sizeConfig.text
        )}
      >
        {rank}
      </span>
    </motion.div>
  );
}
