"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SPRING_TRANSITION } from "@/lib/constants";
import type { PredictionStatus } from "@/types";

const STATUS_BORDER_COLORS: Record<PredictionStatus, string> = {
  correct: "border-status-correct",
  incorrect: "border-status-incorrect",
  pending: "border-status-pending",
};

const STATUS_GLOW_COLORS: Record<PredictionStatus, string> = {
  correct: "shadow-[0_0_8px_var(--status-correct-bg)]",
  incorrect: "shadow-[0_0_8px_var(--status-incorrect-bg)]",
  pending: "shadow-[0_0_8px_var(--status-pending-bg)]",
};

interface StatusBorderProps {
  status: PredictionStatus;
  children: React.ReactNode;
  glow?: boolean;
  borderWidth?: "default" | "thick";
  rounded?: string;
  className?: string;
}

export function StatusBorder({
  status,
  children,
  glow = false,
  borderWidth = "default",
  rounded = "rounded-lg",
  className,
}: StatusBorderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={SPRING_TRANSITION}
      className={cn(
        "border",
        borderWidth === "thick" ? "border-2" : "border",
        STATUS_BORDER_COLORS[status],
        glow && STATUS_GLOW_COLORS[status],
        rounded,
        className
      )}
    >
      {children}
    </motion.div>
  );
}
