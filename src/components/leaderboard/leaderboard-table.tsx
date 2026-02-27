"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { SPRING_TRANSITION, STAGGER_CONTAINER } from "@/lib/constants";
import { LeaderboardRow } from "@/components/leaderboard/leaderboard-row";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadMoreButton } from "@/components/shared/load-more-button";
import {
  MOCK_LEADERBOARD,
  filterLeaderboard,
  getHottestStreaks,
  getBiggestGainers,
} from "@/data/mock-leaderboard";
import type { LeaderboardEntry, LeaderboardFilters } from "@/types";
import type { LeaderboardTab } from "./leaderboard-tabs";

const PAGE_SIZE = 10;

interface LeaderboardTableProps {
  activeTab: LeaderboardTab;
  filters: LeaderboardFilters;
  searchQuery: string;
  className?: string;
}

export function LeaderboardTable({
  activeTab,
  filters,
  searchQuery,
  className,
}: LeaderboardTableProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Get the base dataset for the current tab
  const tabData = useMemo((): LeaderboardEntry[] => {
    switch (activeTab) {
      case "hot-streaks":
        return getHottestStreaks(MOCK_LEADERBOARD.length);
      case "biggest-gains":
        return getBiggestGainers(MOCK_LEADERBOARD.length);
      case "top-accuracy":
      default:
        return MOCK_LEADERBOARD;
    }
  }, [activeTab]);

  // Apply filters
  const filtered = useMemo(() => {
    let entries = filterLeaderboard(tabData, filters);

    // Apply search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      entries = entries.filter(
        (entry) =>
          entry.influencer.name.toLowerCase().includes(q) ||
          entry.influencer.handle.toLowerCase().includes(q)
      );
    }

    return entries;
  }, [tabData, filters, searchQuery]);

  const visibleEntries = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  // Reset visible count when tab or filters change
  useMemo(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeTab, filters, searchQuery]);

  return (
    <div className={cn("space-y-2", className)}>
      {/* Column headers — desktop */}
      <div className="hidden md:grid md:grid-cols-[auto_1fr_repeat(4,auto)] items-center gap-3 px-4 py-2 text-xs font-medium uppercase tracking-wider text-text-muted">
        <span className="w-9 text-center">#</span>
        <span>Influencer</span>
        <span className="text-center">Accuracy</span>
        <span>Predictions</span>
        <span className="text-right">Return / Streak</span>
        <span className="text-center">30d Trend</span>
      </div>

      {/* Separator */}
      <div className="hidden md:block h-px bg-border" />

      {/* Entries */}
      <AnimatePresence mode="wait">
        {visibleEntries.length > 0 ? (
          <motion.div
            key={activeTab + filters.sortBy + filters.timeRange + searchQuery}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={STAGGER_CONTAINER}
            className="space-y-2"
          >
            {visibleEntries.map((entry, index) => (
              <LeaderboardRow key={entry.influencer.id} entry={entry} index={index} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={SPRING_TRANSITION}
          >
            <EmptyState
              icon={Users}
              title="No influencers found"
              description="Try adjusting your filters or search query."
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Load more */}
      {hasMore && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...SPRING_TRANSITION, delay: 0.2 }}
        >
          <LoadMoreButton
            onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
            hasMore
            loadedCount={Math.min(visibleCount, filtered.length)}
            totalCount={filtered.length}
          />
        </motion.div>
      )}
    </div>
  );
}
