"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SPRING_TRANSITION } from "@/lib/constants";

interface SubmitSuccessProps {
  influencerName: string;
  coinSymbol: string;
  direction: "bullish" | "bearish";
  onSubmitAnother: () => void;
}

export function SubmitSuccess({
  influencerName,
  coinSymbol,
  direction,
  onSubmitAnother,
}: SubmitSuccessProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={SPRING_TRANSITION}
      className="flex flex-col items-center gap-6 rounded-xl border border-border bg-card p-8 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ ...SPRING_TRANSITION, delay: 0.1 }}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-status-correct-bg">
          <CheckCircle2 className="h-8 w-8 text-status-correct" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING_TRANSITION, delay: 0.15 }}
        className="space-y-2"
      >
        <h3 className="text-xl font-semibold text-foreground">
          Prediction Submitted!
        </h3>
        <p className="text-sm text-muted-foreground">
          Your submission for{" "}
          <span className="font-medium text-foreground">{influencerName}</span>
          &apos;s{" "}
          <span
            className={
              direction === "bullish"
                ? "text-status-correct"
                : "text-status-incorrect"
            }
          >
            {direction}
          </span>{" "}
          call on{" "}
          <span className="font-mono font-medium text-foreground">
            {coinSymbol}
          </span>{" "}
          has been submitted for review.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING_TRANSITION, delay: 0.2 }}
        className="rounded-lg bg-elevated px-4 py-3"
      >
        <p className="text-xs text-muted-foreground">
          Our team will verify the source and add it to the tracker.
          Typically takes less than 24 hours.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING_TRANSITION, delay: 0.25 }}
        className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center"
      >
        <Button onClick={onSubmitAnother} variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          Submit Another
        </Button>
        <Button asChild>
          <Link href="/predictions" className="gap-2">
            View Predictions
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </motion.div>
    </motion.div>
  );
}
