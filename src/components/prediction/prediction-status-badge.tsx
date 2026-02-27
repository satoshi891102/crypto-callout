"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { SPRING_TRANSITION, STATUS_LABELS } from "@/lib/constants";
import type { PredictionStatus } from "@/types";

const STATUS_CONFIG: Record<
  PredictionStatus,
  { icon: typeof CheckCircle2; color: string; bg: string; dotColor: string }
> = {
  correct: {
    icon: CheckCircle2,
    color: "text-status-correct",
    bg: "bg-status-correct-bg",
    dotColor: "bg-status-correct",
  },
  incorrect: {
    icon: XCircle,
    color: "text-status-incorrect",
    bg: "bg-status-incorrect-bg",
    dotColor: "bg-status-incorrect",
  },
  pending: {
    icon: Clock,
    color: "text-status-pending",
    bg: "bg-status-pending-bg",
    dotColor: "bg-status-pending",
  },
};

type PredictionStatusBadgeSize = "sm" | "md" | "lg";

const SIZE_CLASSES: Record<
  PredictionStatusBadgeSize,
  { container: string; icon: number; text: string; dot: string }
> = {
  sm: { container: "px-1.5 py-0.5 gap-1", icon: 10, text: "text-[10px]", dot: "h-1.5 w-1.5" },
  md: { container: "px-2 py-0.5 gap-1.5", icon: 12, text: "text-xs", dot: "h-2 w-2" },
  lg: { container: "px-2.5 py-1 gap-1.5", icon: 14, text: "text-sm", dot: "h-2 w-2" },
};

interface PredictionStatusBadgeProps {
  status: PredictionStatus;
  size?: PredictionStatusBadgeSize;
  showIcon?: boolean;
  animated?: boolean;
  className?: string;
}

export function PredictionStatusBadge({
  status,
  size = "md",
  showIcon = true,
  animated = true,
  className,
}: PredictionStatusBadgeProps) {
  const config = STATUS_CONFIG[status];
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
      {!showIcon && (
        <span className={cn("shrink-0 rounded-full", config.dotColor, sizeConfig.dot)} />
      )}
      {STATUS_LABELS[status]}
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
