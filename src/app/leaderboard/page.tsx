"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Users, Target, TrendingUp } from "lucide-react";
import { SPRING_TRANSITION } from "@/lib/constants";
import { SectionHeader } from "@/components/shared/section-header";
import { PageTransition } from "@/components/shared/page-transition";
import { LeaderboardTabs, type LeaderboardTab } from "@/components/leaderboard/leaderboard-tabs";
import { LeaderboardFiltersBar } from "@/components/leaderboard/leaderboard-filters";
import { LeaderboardTable } from "@/components/leaderboard/leaderboard-table";
import { MOCK_LEADERBOARD } from "@/data/mock-leaderboard";
import type { LeaderboardFilters } from "@/types";

/* ── Quick stat cards at the top ── */

function QuickStats() {
  const topAccuracy = MOCK_LEADERBOARD[0];
  const totalTracked = MOCK_LEADERBOARD.length;
  const avgAccuracy =
    MOCK_LEADERBOARD.reduce((sum, e) => sum + e.accuracyScore, 0) / totalTracked;
  const totalPredictions = MOCK_LEADERBOARD.reduce(
    (sum, e) => sum + e.totalPredictions,
    0
  );

  const stats = [
    {
      label: "Tracked Influencers",
      value: totalTracked,
      icon: Users,
      color: "text-accent-brand",
    },
    {
      label: "Total Predictions",
      value: totalPredictions.toLocaleString(),
      icon: Target,
      color: "text-status-pending",
    },
    {
      label: "Avg Accuracy",
      value: `${avgAccuracy.toFixed(1)}%`,
      icon: TrendingUp,
      color: "text-status-correct",
    },
    {
      label: "#1 Accuracy",
      value: `${topAccuracy.accuracyScore.toFixed(1)}%`,
      sublabel: topAccuracy.influencer.name,
      icon: Trophy,
      color: "text-warning",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_TRANSITION, delay: i * 0.06 }}
            className="group rounded-xl border border-border bg-card p-4 transition-colors hover:border-accent-brand/30"
          >
            <div className="flex items-center gap-2 text-text-muted">
              <Icon size={14} className={stat.color} />
              <span className="text-xs font-medium">{stat.label}</span>
            </div>
            <p className="mt-1.5 text-xl font-bold tabular-nums text-text-primary">
              {stat.value}
            </p>
            {"sublabel" in stat && stat.sublabel && (
              <p className="text-xs text-text-muted truncate">{stat.sublabel}</p>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

/* ── Page ── */

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<LeaderboardTab>("top-accuracy");
  const [filters, setFilters] = useState<LeaderboardFilters>({
    sortBy: "accuracy",
    timeRange: "all",
    minPredictions: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Page header */}
        <SectionHeader
          as="h1"
          title="Leaderboard"
          description="See who actually knows what they're talking about. Ranked by prediction accuracy."
          badge={`${MOCK_LEADERBOARD.length} tracked`}
        />

        {/* Quick stats */}
        <QuickStats />

        {/* Tabs */}
        <LeaderboardTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Filters */}
        <LeaderboardFiltersBar
          filters={filters}
          onFiltersChange={setFilters}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Table */}
        <LeaderboardTable
          activeTab={activeTab}
          filters={filters}
          searchQuery={searchQuery}
        />
      </div>
    </PageTransition>
  );
}
