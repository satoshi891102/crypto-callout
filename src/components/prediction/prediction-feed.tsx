"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, ListFilter } from "lucide-react";
import { cn } from "@/lib/utils";
import { SPRING_TRANSITION, STAGGER_CONTAINER } from "@/lib/constants";
import { PredictionCard } from "@/components/prediction/prediction-card";
import { EmptyState } from "@/components/shared/empty-state";
import type { Prediction, PredictionStatus, PredictionDirection } from "@/types";

/* ── Filter Tabs ── */

type FeedFilter = "all" | PredictionStatus;

const FILTER_OPTIONS: { value: FeedFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "correct", label: "Correct" },
  { value: "incorrect", label: "Incorrect" },
  { value: "pending", label: "Pending" },
];

/* ── PredictionFeed ── */

interface PredictionFeedProps {
  predictions: Prediction[];
  className?: string;
}

export function PredictionFeed({ predictions, className }: PredictionFeedProps) {
  const [activeFilter, setActiveFilter] = useState<FeedFilter>("all");

  const filtered = useMemo(() => {
    const sorted = [...predictions].sort(
      (a, b) => new Date(b.predictedAt).getTime() - new Date(a.predictedAt).getTime()
    );
    if (activeFilter === "all") return sorted;
    return sorted.filter((p) => p.status === activeFilter);
  }, [predictions, activeFilter]);

  const counts = useMemo(() => {
    const c = { all: predictions.length, correct: 0, incorrect: 0, pending: 0 };
    for (const p of predictions) {
      c[p.status]++;
    }
    return c;
  }, [predictions]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...SPRING_TRANSITION, delay: 0.25 }}
      className={cn("space-y-4", className)}
    >
      {/* Header + filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <ListFilter size={16} className="text-accent-brand" />
          <h3 className="text-sm font-semibold text-text-primary">Prediction History</h3>
          <span className="text-xs text-text-muted">({predictions.length})</span>
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-1 rounded-lg border border-border bg-secondary p-0.5">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setActiveFilter(opt.value)}
              className={cn(
                "relative rounded-md px-3 py-1 text-xs font-medium transition-colors",
                activeFilter === opt.value
                  ? "text-text-primary"
                  : "text-text-muted hover:text-text-secondary"
              )}
            >
              {activeFilter === opt.value && (
                <motion.span
                  layoutId="feed-filter-pill"
                  className="absolute inset-0 rounded-md bg-elevated"
                  transition={SPRING_TRANSITION}
                />
              )}
              <span className="relative z-10">
                {opt.label}
                <span className="ml-1 tabular-nums text-text-muted">
                  {counts[opt.value]}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Feed list */}
      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={SPRING_TRANSITION}
          >
            <EmptyState
              icon={Filter}
              title="No predictions"
              description={
                activeFilter === "all"
                  ? "This influencer hasn't made any tracked predictions yet."
                  : `No ${activeFilter} predictions found.`
              }
            />
          </motion.div>
        ) : (
          <motion.div
            key={activeFilter}
            {...STAGGER_CONTAINER}
            initial="initial"
            animate="animate"
            className="space-y-3"
          >
            {filtered.map((prediction, idx) => (
              <motion.div
                key={prediction.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...SPRING_TRANSITION, delay: idx * 0.04 }}
              >
                <PredictionCard prediction={prediction} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
