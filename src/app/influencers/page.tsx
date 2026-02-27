"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users } from "lucide-react";
import { SPRING_TRANSITION, STAGGER_CONTAINER, getTierForScore } from "@/lib/constants";
import { MOCK_INFLUENCERS } from "@/data/mock-influencers";
import { SectionHeader } from "@/components/shared/section-header";
import { PageTransition } from "@/components/shared/page-transition";
import { EmptyState } from "@/components/shared/empty-state";
import { InfluencerCard } from "@/components/influencer/influencer-card";
import { InfluencerCardRow } from "@/components/influencer/influencer-card-row";
import {
  InfluencerDirectoryFiltersBar,
  type InfluencerDirectoryFilters,
  type ViewMode,
} from "@/components/influencer/influencer-directory-filters";
import type { Influencer } from "@/types";

/* ── Sorting ── */

function sortInfluencers(
  influencers: Influencer[],
  sortBy: InfluencerDirectoryFilters["sortBy"]
): Influencer[] {
  const sorted = [...influencers];

  switch (sortBy) {
    case "accuracy":
      return sorted.sort((a, b) => b.accuracyScore - a.accuracyScore);
    case "followers":
      return sorted.sort((a, b) => b.followerCount - a.followerCount);
    case "predictions":
      return sorted.sort((a, b) => b.totalPredictions - a.totalPredictions);
    case "streak":
      return sorted.sort((a, b) => b.streak - a.streak);
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return sorted;
  }
}

/* ── Page ── */

export default function InfluencersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filters, setFilters] = useState<InfluencerDirectoryFilters>({
    sortBy: "accuracy",
    platform: "all",
    tier: "all",
  });

  const filteredInfluencers = useMemo(() => {
    let results = MOCK_INFLUENCERS;

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (inf) =>
          inf.name.toLowerCase().includes(q) ||
          inf.handle.toLowerCase().includes(q)
      );
    }

    // Platform filter
    if (filters.platform !== "all") {
      results = results.filter((inf) => inf.platform === filters.platform);
    }

    // Tier filter
    if (filters.tier !== "all") {
      results = results.filter(
        (inf) => getTierForScore(inf.accuracyScore).tier === filters.tier
      );
    }

    // Sort
    results = sortInfluencers(results, filters.sortBy);

    return results;
  }, [searchQuery, filters]);

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* Page header */}
        <SectionHeader
          as="h1"
          title="Influencers"
          description="Browse and discover crypto influencers tracked by CryptoCallout. Filter by platform, accuracy tier, and more."
          badge={`${MOCK_INFLUENCERS.length} tracked`}
        />

        {/* Filters */}
        <InfluencerDirectoryFiltersBar
          filters={filters}
          onFiltersChange={setFilters}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          resultCount={filteredInfluencers.length}
        />

        {/* Results */}
        <AnimatePresence mode="wait">
          {filteredInfluencers.length === 0 ? (
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
                description="Try adjusting your search or filters to find what you're looking for."
              />
            </motion.div>
          ) : viewMode === "grid" ? (
            <motion.div
              key="grid"
              {...STAGGER_CONTAINER}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {filteredInfluencers.map((influencer, idx) => (
                <motion.div
                  key={influencer.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...SPRING_TRANSITION, delay: idx * 0.04 }}
                >
                  <InfluencerCard
                    influencer={influencer}
                    rank={filters.sortBy === "accuracy" ? idx + 1 : undefined}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              {...STAGGER_CONTAINER}
              initial="initial"
              animate="animate"
              className="space-y-2"
            >
              {filteredInfluencers.map((influencer, idx) => (
                <motion.div
                  key={influencer.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...SPRING_TRANSITION, delay: idx * 0.03 }}
                >
                  <InfluencerCardRow
                    influencer={influencer}
                    rank={filters.sortBy === "accuracy" ? idx + 1 : undefined}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
