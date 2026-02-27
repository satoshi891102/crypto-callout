"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Flame, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { SPRING_TRANSITION } from "@/lib/constants";

export type LeaderboardTab = "top-accuracy" | "hot-streaks" | "biggest-gains";

interface TabConfig {
  id: LeaderboardTab;
  label: string;
  icon: typeof Trophy;
  description: string;
}

const TABS: TabConfig[] = [
  {
    id: "top-accuracy",
    label: "Top Accuracy",
    icon: Trophy,
    description: "Highest prediction accuracy",
  },
  {
    id: "hot-streaks",
    label: "Hot Streaks",
    icon: Flame,
    description: "Longest winning streaks",
  },
  {
    id: "biggest-gains",
    label: "Biggest Gains",
    icon: TrendingUp,
    description: "Best average returns",
  },
];

interface LeaderboardTabsProps {
  activeTab: LeaderboardTab;
  onTabChange: (tab: LeaderboardTab) => void;
  className?: string;
}

export function LeaderboardTabs({
  activeTab,
  onTabChange,
  className,
}: LeaderboardTabsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={SPRING_TRANSITION}
      className={cn("flex gap-1 rounded-xl bg-secondary p-1", className)}
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "relative flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isActive
                ? "text-foreground"
                : "text-text-muted hover:text-text-secondary"
            )}
            title={tab.description}
          >
            {isActive && (
              <motion.div
                layoutId="leaderboard-tab-bg"
                className="absolute inset-0 rounded-lg bg-card shadow-sm"
                transition={SPRING_TRANSITION}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <Icon size={16} />
              <span className="hidden sm:inline">{tab.label}</span>
            </span>
          </button>
        );
      })}
    </motion.div>
  );
}
