"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SPRING_TRANSITION } from "@/lib/constants";
import type { PredictionDirection } from "@/types";

interface PredictionTypeToggleProps {
  value: PredictionDirection;
  onChange: (direction: PredictionDirection) => void;
  error?: string;
}

export function PredictionTypeToggle({
  value,
  onChange,
  error,
}: PredictionTypeToggleProps) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          transition={SPRING_TRANSITION}
          onClick={() => onChange("bullish")}
          className={cn(
            "relative flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-colors",
            value === "bullish"
              ? "border-status-correct bg-status-correct-bg text-status-correct"
              : "border-border bg-input text-muted-foreground hover:border-status-correct/40 hover:text-foreground"
          )}
        >
          {value === "bullish" && (
            <motion.div
              layoutId="prediction-type-indicator"
              className="absolute inset-0 rounded-lg border-2 border-status-correct"
              transition={SPRING_TRANSITION}
            />
          )}
          <TrendingUp className="h-4 w-4" />
          Bullish
        </motion.button>

        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          transition={SPRING_TRANSITION}
          onClick={() => onChange("bearish")}
          className={cn(
            "relative flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-colors",
            value === "bearish"
              ? "border-status-incorrect bg-status-incorrect-bg text-status-incorrect"
              : "border-border bg-input text-muted-foreground hover:border-status-incorrect/40 hover:text-foreground"
          )}
        >
          {value === "bearish" && (
            <motion.div
              layoutId="prediction-type-indicator"
              className="absolute inset-0 rounded-lg border-2 border-status-incorrect"
              transition={SPRING_TRANSITION}
            />
          )}
          <TrendingDown className="h-4 w-4" />
          Bearish
        </motion.button>
      </div>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
