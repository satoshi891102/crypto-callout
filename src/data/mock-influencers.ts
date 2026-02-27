import type { Influencer, AccuracyDataPoint, TierInfo, InfluencerTier, ScoreBreakdown } from "@/types";

/* ── Tier Definitions ── */

export const TIERS: TierInfo[] = [
  { tier: "legendary", label: "Legendary", minScore: 85, color: "var(--color-warning)" },
  { tier: "expert", label: "Expert", minScore: 70, color: "var(--color-primary)" },
  { tier: "intermediate", label: "Intermediate", minScore: 50, color: "var(--color-status-correct)" },
  { tier: "novice", label: "Novice", minScore: 25, color: "var(--color-text-secondary)" },
  { tier: "unranked", label: "Unranked", minScore: 0, color: "var(--color-text-muted)" },
];

export function getTier(score: number): TierInfo {
  return TIERS.find((t) => score >= t.minScore) ?? TIERS[TIERS.length - 1];
}

/* ── Mock Influencers ── */

export const MOCK_INFLUENCERS: Influencer[] = [
  {
    id: "inf-001",
    name: "CryptoVault",
    handle: "@CryptoVault",
    platform: "twitter",
    avatarUrl: "/avatars/cryptovault.jpg",
    bio: "On-chain analyst. Tracking macro cycles since 2017. NFA.",
    followerCount: 842_000,
    totalPredictions: 312,
    correctPredictions: 267,
    accuracyScore: 85.6,
    rank: 1,
    streak: 14,
    lastActiveAt: "2026-02-26T18:30:00Z",
    createdAt: "2024-03-15T00:00:00Z",
  },
  {
    id: "inf-002",
    name: "AltSeason Alpha",
    handle: "@AltSeasonAlpha",
    platform: "twitter",
    avatarUrl: "/avatars/altseason.jpg",
    bio: "Alt rotations & momentum plays. 3x cycles. DMs open for collabs.",
    followerCount: 456_000,
    totalPredictions: 198,
    correctPredictions: 155,
    accuracyScore: 78.3,
    rank: 2,
    streak: 7,
    lastActiveAt: "2026-02-27T09:15:00Z",
    createdAt: "2024-06-20T00:00:00Z",
  },
  {
    id: "inf-003",
    name: "DeFi Degen",
    handle: "@DeFiDegen_",
    platform: "twitter",
    avatarUrl: "/avatars/defidegen.jpg",
    bio: "Yield farming & token launches. High risk, higher reward.",
    followerCount: 221_000,
    totalPredictions: 445,
    correctPredictions: 311,
    accuracyScore: 69.9,
    rank: 3,
    streak: 3,
    lastActiveAt: "2026-02-27T11:45:00Z",
    createdAt: "2024-01-10T00:00:00Z",
  },
  {
    id: "inf-004",
    name: "Satoshi Signals",
    handle: "@SatoshiSignals",
    platform: "youtube",
    avatarUrl: "/avatars/satoshi-signals.jpg",
    bio: "Daily TA videos. 200K subs. Fibonacci & Elliott Wave.",
    followerCount: 203_000,
    totalPredictions: 523,
    correctPredictions: 376,
    accuracyScore: 71.9,
    rank: 4,
    streak: 5,
    lastActiveAt: "2026-02-26T22:00:00Z",
    createdAt: "2023-11-01T00:00:00Z",
  },
  {
    id: "inf-005",
    name: "Moon Macro",
    handle: "@MoonMacro",
    platform: "twitter",
    avatarUrl: "/avatars/moonmacro.jpg",
    bio: "Global macro + crypto thesis. Former TradFi. Long-term bias.",
    followerCount: 1_230_000,
    totalPredictions: 87,
    correctPredictions: 71,
    accuracyScore: 81.6,
    rank: 5,
    streak: 11,
    lastActiveAt: "2026-02-25T14:00:00Z",
    createdAt: "2024-05-08T00:00:00Z",
  },
  {
    id: "inf-006",
    name: "TokenWhiz",
    handle: "@TokenWhiz",
    platform: "tiktok",
    avatarUrl: "/avatars/tokenwhiz.jpg",
    bio: "60-second alpha. Making crypto simple for normies.",
    followerCount: 1_870_000,
    totalPredictions: 256,
    correctPredictions: 143,
    accuracyScore: 55.9,
    rank: 6,
    streak: 2,
    lastActiveAt: "2026-02-27T08:30:00Z",
    createdAt: "2025-01-15T00:00:00Z",
  },
  {
    id: "inf-007",
    name: "Whale Watch",
    handle: "@WhaleWatchCrypto",
    platform: "telegram",
    avatarUrl: "/avatars/whalewatch.jpg",
    bio: "Tracking whale wallets & exchange flows. On-chain intelligence.",
    followerCount: 98_000,
    totalPredictions: 178,
    correctPredictions: 134,
    accuracyScore: 75.3,
    rank: 7,
    streak: 8,
    lastActiveAt: "2026-02-27T06:00:00Z",
    createdAt: "2024-08-22T00:00:00Z",
  },
  {
    id: "inf-008",
    name: "Bearish Baron",
    handle: "@BearishBaron",
    platform: "twitter",
    avatarUrl: "/avatars/bearishbaron.jpg",
    bio: "Professional contrarian. Someone has to say it. Mostly shorts.",
    followerCount: 167_000,
    totalPredictions: 289,
    correctPredictions: 127,
    accuracyScore: 43.9,
    rank: 8,
    streak: 0,
    lastActiveAt: "2026-02-26T20:15:00Z",
    createdAt: "2024-02-28T00:00:00Z",
  },
  {
    id: "inf-009",
    name: "SolanaMaxi",
    handle: "@SolanaMaxiAlpha",
    platform: "twitter",
    avatarUrl: "/avatars/solanamxi.jpg",
    bio: "All-in SOL ecosystem. Validator operator. Memecoins are culture.",
    followerCount: 334_000,
    totalPredictions: 201,
    correctPredictions: 162,
    accuracyScore: 80.6,
    rank: 9,
    streak: 9,
    lastActiveAt: "2026-02-27T10:30:00Z",
    createdAt: "2024-04-01T00:00:00Z",
  },
  {
    id: "inf-010",
    name: "ChartMaster Pro",
    handle: "@ChartMasterPro",
    platform: "youtube",
    avatarUrl: "/avatars/chartmaster.jpg",
    bio: "Pure technical analysis. No hype. Indicators don't lie.",
    followerCount: 512_000,
    totalPredictions: 634,
    correctPredictions: 412,
    accuracyScore: 65.0,
    rank: 10,
    streak: 1,
    lastActiveAt: "2026-02-26T16:45:00Z",
    createdAt: "2023-09-14T00:00:00Z",
  },
  {
    id: "inf-011",
    name: "Crypto Cleo",
    handle: "@CryptoCleo",
    platform: "twitter",
    avatarUrl: "/avatars/cryptocleo.jpg",
    bio: "Narrative trading & sector rotations. AI + DePIN focused.",
    followerCount: 278_000,
    totalPredictions: 145,
    correctPredictions: 108,
    accuracyScore: 74.5,
    rank: 11,
    streak: 6,
    lastActiveAt: "2026-02-27T07:00:00Z",
    createdAt: "2024-07-12T00:00:00Z",
  },
  {
    id: "inf-012",
    name: "PumpNoBrakes",
    handle: "@PumpNoBrakes",
    platform: "tiktok",
    avatarUrl: "/avatars/pumpnobrakes.jpg",
    bio: "TO THE MOON 🚀 100x calls daily. Not financial advice lol.",
    followerCount: 2_100_000,
    totalPredictions: 892,
    correctPredictions: 241,
    accuracyScore: 27.0,
    rank: 12,
    streak: 0,
    lastActiveAt: "2026-02-27T12:00:00Z",
    createdAt: "2025-03-01T00:00:00Z",
  },
];

/* ── Helper: Generate accuracy history ── */

function generateAccuracyHistory(
  baseAccuracy: number,
  months: number
): AccuracyDataPoint[] {
  const points: AccuracyDataPoint[] = [];
  let accuracy = baseAccuracy - 10 + Math.random() * 5;

  for (let i = 0; i < months; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - (months - i));
    const drift = (Math.random() - 0.45) * 4;
    accuracy = Math.min(98, Math.max(20, accuracy + drift));
    const totalPredictions = Math.floor(15 + Math.random() * 40);

    points.push({
      date: date.toISOString().split("T")[0],
      accuracy: Math.round(accuracy * 10) / 10,
      totalPredictions,
    });
  }

  return points;
}

/* ── Pre-generated Accuracy Histories ── */

export const MOCK_ACCURACY_HISTORIES: Record<string, AccuracyDataPoint[]> = {
  "inf-001": generateAccuracyHistory(85.6, 12),
  "inf-002": generateAccuracyHistory(78.3, 12),
  "inf-003": generateAccuracyHistory(69.9, 12),
  "inf-004": generateAccuracyHistory(71.9, 12),
  "inf-005": generateAccuracyHistory(81.6, 12),
  "inf-006": generateAccuracyHistory(55.9, 12),
  "inf-007": generateAccuracyHistory(75.3, 12),
  "inf-008": generateAccuracyHistory(43.9, 12),
  "inf-009": generateAccuracyHistory(80.6, 12),
  "inf-010": generateAccuracyHistory(65.0, 12),
  "inf-011": generateAccuracyHistory(74.5, 12),
  "inf-012": generateAccuracyHistory(27.0, 12),
};

/* ── Score Breakdowns ── */

export const MOCK_SCORE_BREAKDOWNS: Record<string, ScoreBreakdown> = {
  "inf-001": { total: 85.6, accuracyComponent: 42.8, consistencyComponent: 22.1, volumeComponent: 12.4, recencyComponent: 8.3 },
  "inf-002": { total: 78.3, accuracyComponent: 39.2, consistencyComponent: 18.5, volumeComponent: 10.8, recencyComponent: 9.8 },
  "inf-003": { total: 69.9, accuracyComponent: 35.0, consistencyComponent: 14.2, volumeComponent: 14.7, recencyComponent: 6.0 },
  "inf-004": { total: 71.9, accuracyComponent: 36.0, consistencyComponent: 16.8, volumeComponent: 13.1, recencyComponent: 6.0 },
  "inf-005": { total: 81.6, accuracyComponent: 40.8, consistencyComponent: 24.5, volumeComponent: 6.3, recencyComponent: 10.0 },
  "inf-006": { total: 55.9, accuracyComponent: 28.0, consistencyComponent: 10.3, volumeComponent: 11.2, recencyComponent: 6.4 },
  "inf-007": { total: 75.3, accuracyComponent: 37.7, consistencyComponent: 19.6, volumeComponent: 9.8, recencyComponent: 8.2 },
  "inf-008": { total: 43.9, accuracyComponent: 22.0, consistencyComponent: 8.1, volumeComponent: 11.4, recencyComponent: 2.4 },
  "inf-009": { total: 80.6, accuracyComponent: 40.3, consistencyComponent: 21.0, volumeComponent: 10.5, recencyComponent: 8.8 },
  "inf-010": { total: 65.0, accuracyComponent: 32.5, consistencyComponent: 12.8, volumeComponent: 15.2, recencyComponent: 4.5 },
  "inf-011": { total: 74.5, accuracyComponent: 37.3, consistencyComponent: 18.0, volumeComponent: 9.2, recencyComponent: 10.0 },
  "inf-012": { total: 27.0, accuracyComponent: 13.5, consistencyComponent: 3.2, volumeComponent: 8.9, recencyComponent: 1.4 },
};

/* ── Helpers ── */

export function getInfluencerById(id: string): Influencer | undefined {
  return MOCK_INFLUENCERS.find((inf) => inf.id === id);
}

export function getInfluencersByPlatform(platform: Influencer["platform"]): Influencer[] {
  return MOCK_INFLUENCERS.filter((inf) => inf.platform === platform);
}

export function getInfluencerTier(id: string): InfluencerTier {
  const inf = getInfluencerById(id);
  if (!inf) return "unranked";
  return getTier(inf.accuracyScore).tier;
}

export function formatFollowerCount(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(0)}K`;
  return count.toString();
}
