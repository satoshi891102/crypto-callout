"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { SPRING_TRANSITION } from "@/lib/constants";
import type { LeaderboardEntry } from "@/types";

type Trend = LeaderboardEntry["trend"];

const TREND_CONFIG: Record<
  Trend,
  { icon: typeof TrendingUp; color: string; rotation: number }
> = {
  up: { icon: TrendingUp, color: "text-status-correct", rotation: 0 },
  down: { icon: TrendingDown, color: "text-status-incorrect", rotation: 0 },
  stable: { icon: Minus, color: "text-text-muted", rotation: 0 },
};

interface TrendArrowProps {
  trend: Trend;
  size?: number;
  showLabel?: boolean;
  className?: string;
}

export function TrendArrow({
  trend,
  size = 16,
  showLabel = false,
  className,
}: TrendArrowProps) {
  const config = TREND_CONFIG[trend];
  const Icon = config.icon;

  const labels: Record<Trend, string> = {
    up: "Trending up",
    down: "Trending down",
    stable: "Stable",
  };

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={SPRING_TRANSITION}
      className={cn("inline-flex items-center gap-1", config.color, className)}
      title={labels[trend]}
    >
      <Icon size={size} />
      {showLabel && (
        <span className="text-xs font-medium">{labels[trend]}</span>
      )}
    </motion.span>
  );
}
