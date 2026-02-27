import type { LeaderboardEntry, LeaderboardFilters } from "@/types";
import { MOCK_INFLUENCERS } from "./mock-influencers";

/* ── Sparkline data: 30 data points representing daily accuracy over last month ── */

const SPARKLINE_DATA: Record<string, number[]> = {
  "inf-001": [78, 80, 82, 85, 83, 86, 88, 85, 87, 90, 88, 86, 89, 91, 87, 85, 88, 90, 92, 89, 87, 90, 88, 86, 89, 91, 88, 85, 87, 86],
  "inf-002": [70, 72, 68, 74, 76, 73, 78, 80, 77, 75, 79, 81, 78, 76, 80, 82, 79, 77, 81, 78, 76, 80, 78, 75, 79, 77, 80, 78, 76, 78],
  "inf-003": [65, 62, 68, 71, 67, 63, 70, 72, 68, 65, 71, 73, 69, 66, 72, 70, 67, 71, 68, 65, 72, 70, 67, 71, 69, 66, 73, 70, 68, 70],
  "inf-004": [68, 70, 72, 74, 71, 69, 73, 75, 72, 70, 74, 72, 69, 73, 71, 74, 76, 73, 71, 75, 72, 70, 74, 71, 69, 73, 75, 72, 70, 72],
  "inf-005": [80, 82, 84, 81, 83, 85, 82, 80, 84, 86, 83, 81, 85, 82, 80, 84, 86, 83, 81, 85, 83, 80, 84, 82, 80, 84, 82, 80, 83, 82],
  "inf-006": [50, 53, 48, 55, 52, 49, 56, 53, 50, 57, 54, 51, 58, 55, 52, 56, 53, 50, 57, 54, 51, 55, 58, 52, 56, 53, 50, 57, 54, 56],
  "inf-007": [72, 74, 76, 73, 75, 78, 75, 73, 77, 79, 76, 74, 78, 75, 73, 77, 79, 76, 74, 78, 76, 73, 77, 75, 73, 77, 75, 73, 76, 75],
  "inf-008": [45, 42, 48, 40, 43, 38, 45, 42, 39, 46, 43, 40, 47, 44, 41, 45, 42, 39, 46, 43, 40, 44, 47, 41, 45, 42, 39, 44, 46, 44],
  "inf-009": [78, 80, 82, 79, 81, 84, 81, 79, 83, 85, 82, 80, 84, 81, 79, 83, 85, 82, 80, 84, 82, 79, 83, 81, 79, 83, 81, 79, 82, 81],
  "inf-010": [60, 63, 66, 62, 65, 68, 64, 61, 67, 70, 66, 63, 69, 65, 62, 68, 64, 61, 67, 63, 60, 66, 69, 63, 67, 64, 61, 66, 68, 65],
  "inf-011": [70, 73, 76, 72, 75, 78, 74, 71, 77, 80, 76, 73, 79, 75, 72, 78, 74, 71, 77, 73, 70, 76, 79, 73, 77, 74, 71, 76, 78, 75],
  "inf-012": [25, 28, 22, 30, 27, 24, 31, 28, 25, 32, 29, 26, 23, 30, 27, 24, 31, 28, 25, 29, 32, 26, 23, 30, 27, 24, 28, 31, 25, 27],
};

/* ── Average Return by Influencer ── */

const AVG_RETURNS: Record<string, number> = {
  "inf-001": 34.2,
  "inf-002": 22.8,
  "inf-003": 18.4,
  "inf-004": 15.7,
  "inf-005": 28.9,
  "inf-006": 8.3,
  "inf-007": 21.5,
  "inf-008": -12.6,
  "inf-009": 31.1,
  "inf-010": 11.2,
  "inf-011": 19.6,
  "inf-012": -8.4,
};

/* ── Build Leaderboard Entries ── */

export const MOCK_LEADERBOARD: LeaderboardEntry[] = MOCK_INFLUENCERS
  .sort((a, b) => a.rank - b.rank)
  .map((influencer) => ({
    rank: influencer.rank,
    influencer,
    accuracyScore: influencer.accuracyScore,
    totalPredictions: influencer.totalPredictions,
    correctPredictions: influencer.correctPredictions,
    avgReturn: AVG_RETURNS[influencer.id] ?? 0,
    streak: influencer.streak,
    trend: influencer.streak >= 5 ? "up" as const : influencer.streak === 0 ? "down" as const : "stable" as const,
    sparklineData: SPARKLINE_DATA[influencer.id] ?? [],
  }));

/* ── Default Filters ── */

export const DEFAULT_LEADERBOARD_FILTERS: LeaderboardFilters = {
  sortBy: "accuracy",
  timeRange: "all",
  minPredictions: 10,
};

/* ── Filter & Sort Helpers ── */

export function filterLeaderboard(
  entries: LeaderboardEntry[],
  filters: LeaderboardFilters
): LeaderboardEntry[] {
  let filtered = entries.filter(
    (entry) => entry.totalPredictions >= filters.minPredictions
  );

  filtered = [...filtered].sort((a, b) => {
    switch (filters.sortBy) {
      case "accuracy":
        return b.accuracyScore - a.accuracyScore;
      case "totalPredictions":
        return b.totalPredictions - a.totalPredictions;
      case "streak":
        return b.streak - a.streak;
      case "avgReturn":
        return b.avgReturn - a.avgReturn;
      default:
        return 0;
    }
  });

  return filtered.map((entry, idx) => ({ ...entry, rank: idx + 1 }));
}

/* ── Top Performers (quick access) ── */

export function getTopPerformers(limit: number = 5): LeaderboardEntry[] {
  return MOCK_LEADERBOARD.slice(0, limit);
}

export function getHottestStreaks(limit: number = 5): LeaderboardEntry[] {
  return [...MOCK_LEADERBOARD]
    .sort((a, b) => b.streak - a.streak)
    .slice(0, limit);
}

export function getBiggestGainers(limit: number = 5): LeaderboardEntry[] {
  return [...MOCK_LEADERBOARD]
    .sort((a, b) => b.avgReturn - a.avgReturn)
    .slice(0, limit);
}
