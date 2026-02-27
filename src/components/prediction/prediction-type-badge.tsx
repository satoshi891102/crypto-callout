"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SPRING_TRANSITION, DIRECTION_LABELS } from "@/lib/constants";
import type { PredictionDirection } from "@/types";

const DIRECTION_CONFIG: Record<
  PredictionDirection,
  { icon: typeof TrendingUp; color: string; bg: string }
> = {
  bullish: {
    icon: TrendingUp,
    color: "text-status-correct",
    bg: "bg-status-correct-bg",
  },
  bearish: {
    icon: TrendingDown,
    color: "text-status-incorrect",
    bg: "bg-status-incorrect-bg",
  },
};

type PredictionTypeBadgeSize = "sm" | "md" | "lg";

const SIZE_CLASSES: Record<
  PredictionTypeBadgeSize,
  { container: string; icon: number; text: string }
> = {
  sm: { container: "px-1.5 py-0.5 gap-1", icon: 10, text: "text-[10px]" },
  md: { container: "px-2 py-0.5 gap-1.5", icon: 12, text: "text-xs" },
  lg: { container: "px-2.5 py-1 gap-1.5", icon: 14, text: "text-sm" },
};

interface PredictionTypeBadgeProps {
  direction: PredictionDirection;
  size?: PredictionTypeBadgeSize;
  showIcon?: boolean;
  animated?: boolean;
  className?: string;
}

export function PredictionTypeBadge({
  direction,
  size = "md",
  showIcon = true,
  animated = true,
  className,
}: PredictionTypeBadgeProps) {
  const config = DIRECTION_CONFIG[direction];
  const sizeConfig = SIZE_CLASSES[size];
  const Icon = config.icon;

  const content = (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-semibold",
        config.bg,
        config.color,
        sizeConfig.container,
        sizeConfig.text,
        className
      )}
    >
      {showIcon && <Icon size={sizeConfig.icon} />}
      {DIRECTION_LABELS[direction]}
    </span>
  );

  if (!animated) return content;

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={SPRING_TRANSITION}
      className="inline-flex"
    >
      {content}
    </motion.span>
  );
}
