import type { ScoringWeights } from "@/types";

/* ── User Role ── */

export type UserRole = "viewer" | "contributor" | "moderator" | "admin";

/* ── User Profile ── */

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  submissionCount: number;
  approvedSubmissions: number;
  joinedAt: string;
  lastLoginAt: string;
  favoriteInfluencerIds: string[];
  watchedCoins: string[];
}

/* ── Mock Users ── */

export const MOCK_USERS: UserProfile[] = [
  {
    id: "user-001",
    username: "alpha_hunter",
    email: "alpha@example.com",
    role: "contributor",
    avatarUrl: "/avatars/user-alpha.jpg",
    submissionCount: 14,
    approvedSubmissions: 11,
    joinedAt: "2025-06-15T00:00:00Z",
    lastLoginAt: "2026-02-27T08:00:00Z",
    favoriteInfluencerIds: ["inf-001", "inf-005", "inf-009"],
    watchedCoins: ["BTC", "ETH", "SOL"],
  },
  {
    id: "user-002",
    username: "degen_dave",
    email: "dave@example.com",
    role: "contributor",
    avatarUrl: "/avatars/user-dave.jpg",
    submissionCount: 8,
    approvedSubmissions: 5,
    joinedAt: "2025-09-22T00:00:00Z",
    lastLoginAt: "2026-02-26T19:30:00Z",
    favoriteInfluencerIds: ["inf-003", "inf-006", "inf-012"],
    watchedCoins: ["SOL", "DOGE", "ARB"],
  },
  {
    id: "user-003",
    username: "chain_analyst",
    email: "analyst@example.com",
    role: "moderator",
    avatarUrl: "/avatars/user-analyst.jpg",
    submissionCount: 32,
    approvedSubmissions: 28,
    joinedAt: "2025-04-01T00:00:00Z",
    lastLoginAt: "2026-02-27T10:15:00Z",
    favoriteInfluencerIds: ["inf-001", "inf-007", "inf-011"],
    watchedCoins: ["BTC", "ETH", "LINK", "DOT"],
  },
  {
    id: "user-004",
    username: "newbie_nate",
    email: "nate@example.com",
    role: "viewer",
    avatarUrl: "/avatars/user-nate.jpg",
    submissionCount: 2,
    approvedSubmissions: 0,
    joinedAt: "2026-02-10T00:00:00Z",
    lastLoginAt: "2026-02-27T07:45:00Z",
    favoriteInfluencerIds: ["inf-005"],
    watchedCoins: ["BTC"],
  },
  {
    id: "user-005",
    username: "crypto_admin",
    email: "admin@cryptocallout.com",
    role: "admin",
    avatarUrl: "/avatars/user-admin.jpg",
    submissionCount: 0,
    approvedSubmissions: 0,
    joinedAt: "2024-01-01T00:00:00Z",
    lastLoginAt: "2026-02-27T11:00:00Z",
    favoriteInfluencerIds: [],
    watchedCoins: ["BTC", "ETH", "SOL", "XRP", "AVAX"],
  },
];

/* ── Default scoring weights ── */

export const DEFAULT_SCORING_WEIGHTS: ScoringWeights = {
  accuracy: 0.50,
  consistency: 0.25,
  volume: 0.15,
  recency: 0.10,
};

/* ── User Notification Preferences ── */

export interface NotificationPreferences {
  newPredictions: boolean;
  resolutions: boolean;
  streakAlerts: boolean;
  weeklyDigest: boolean;
}

export const DEFAULT_NOTIFICATION_PREFS: NotificationPreferences = {
  newPredictions: true,
  resolutions: true,
  streakAlerts: true,
  weeklyDigest: true,
};

/* ── Helpers ── */

export function getUserById(id: string): UserProfile | undefined {
  return MOCK_USERS.find((u) => u.id === id);
}

export function getUserByUsername(username: string): UserProfile | undefined {
  return MOCK_USERS.find((u) => u.username === username);
}

export function getContributors(): UserProfile[] {
  return MOCK_USERS.filter((u) => u.role === "contributor" || u.role === "moderator");
}

export function getTopContributors(limit: number = 5): UserProfile[] {
  return [...MOCK_USERS]
    .sort((a, b) => b.approvedSubmissions - a.approvedSubmissions)
    .slice(0, limit);
}

/* ── Current user (for dev/demo) ── */

export const MOCK_CURRENT_USER: UserProfile = MOCK_USERS[0];
