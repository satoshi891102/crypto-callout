import type {
  Influencer,
  Prediction,
  LeaderboardEntry,
  AccuracyDataPoint,
  HeroStats,
  CommunitySubmission,
  LeaderboardFilters,
  PredictionFilters,
  ScoringWeights,
  TierInfo,
  InfluencerTier,
  CoinInfo,
  NavItem,
} from "@/types";

/* ── App Meta ── */

export const APP_NAME = "CryptoCallout" as const;
export const APP_TAGLINE = "AI tracks every public crypto prediction from influencers and scores accuracy." as const;
export const APP_DESCRIPTION =
  "See who actually knows what they're talking about. Track predictions, score accuracy, and hold influencers accountable." as const;

/* ── Animation ── */

export const SPRING_TRANSITION = {
  type: "spring" as const,
  stiffness: 300,
  damping: 24,
};

export const FADE_IN = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: SPRING_TRANSITION,
};

export const STAGGER_CONTAINER = {
  animate: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

export const SCALE_TAP = {
  whileTap: { scale: 0.97 },
  transition: SPRING_TRANSITION,
};

/* Page-level enter animation — used with AnimatePresence wrapper */
export const PAGE_TRANSITION = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

/* Modal / dialog spring (scale 0.95 → 1, y 10 → 0) */
export const MODAL_SPRING = {
  type: "spring" as const,
  stiffness: 300,
  damping: 25,
};

/* Card hover lift */
export const HOVER_LIFT = {
  whileHover: { y: -2 },
  transition: { type: "spring" as const, stiffness: 400, damping: 17 },
};

/* Staggered list item (for use inside STAGGER_CONTAINER variants) */
export const STAGGER_ITEM = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
};

/* Full stagger container with hidden/show variant pair */
export const STAGGER_LIST = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

/* ── Scoring Weights ── */

export const DEFAULT_SCORING_WEIGHTS: ScoringWeights = {
  accuracy: 0.5,
  consistency: 0.2,
  volume: 0.15,
  recency: 0.15,
};

/* ── Tiers ── */

export const TIERS: TierInfo[] = [
  { tier: "legendary", label: "Legendary", minScore: 85, color: "var(--status-correct)" },
  { tier: "expert", label: "Expert", minScore: 70, color: "var(--accent-brand)" },
  { tier: "intermediate", label: "Intermediate", minScore: 50, color: "var(--status-pending)" },
  { tier: "novice", label: "Novice", minScore: 25, color: "var(--text-secondary)" },
  { tier: "unranked", label: "Unranked", minScore: 0, color: "var(--text-muted)" },
];

export function getTierForScore(score: number): TierInfo {
  return TIERS.find((t) => score >= t.minScore) ?? TIERS[TIERS.length - 1];
}

/* ── Filter Defaults ── */

export const DEFAULT_LEADERBOARD_FILTERS: LeaderboardFilters = {
  sortBy: "accuracy",
  timeRange: "30d",
  minPredictions: 5,
};

export const DEFAULT_PREDICTION_FILTERS: PredictionFilters = {
  status: "all",
  coin: null,
  timeRange: "30d",
  direction: "all",
};

/* ── Pagination ── */

export const PAGE_SIZE = 20;
export const LEADERBOARD_PAGE_SIZE = 25;

/* ── Minimum Predictions ── */

export const MIN_PREDICTIONS_FOR_RANKING = 5;
export const MIN_PREDICTIONS_FOR_REPORT_CARD = 3;

/* ── Platform Config ── */

export const PLATFORM_LABELS: Record<Influencer["platform"], string> = {
  twitter: "X / Twitter",
  youtube: "YouTube",
  tiktok: "TikTok",
  telegram: "Telegram",
};

export const PLATFORM_ICONS: Record<Influencer["platform"], string> = {
  twitter: "twitter",
  youtube: "youtube",
  tiktok: "music-2",
  telegram: "send",
};

/* ── Status Config ── */

export const STATUS_LABELS: Record<Prediction["status"], string> = {
  correct: "Correct",
  incorrect: "Incorrect",
  pending: "Pending",
};

export const STATUS_COLORS: Record<Prediction["status"], string> = {
  correct: "text-status-correct",
  incorrect: "text-status-incorrect",
  pending: "text-status-pending",
};

export const STATUS_BG_COLORS: Record<Prediction["status"], string> = {
  correct: "bg-status-correct-bg",
  incorrect: "bg-status-incorrect-bg",
  pending: "bg-status-pending-bg",
};

/* ── Direction Config ── */

export const DIRECTION_LABELS: Record<Prediction["direction"], string> = {
  bullish: "Bullish",
  bearish: "Bearish",
};

export const DIRECTION_ICONS: Record<Prediction["direction"], string> = {
  bullish: "trending-up",
  bearish: "trending-down",
};

/* ── Timeframe Config ── */

export const TIMEFRAME_LABELS: Record<string, string> = {
  "24h": "24 Hours",
  "1w": "1 Week",
  "1m": "1 Month",
  "3m": "3 Months",
  "6m": "6 Months",
  "1y": "1 Year",
  custom: "Custom",
};

export const TIME_RANGE_LABELS: Record<string, string> = {
  "7d": "7 Days",
  "30d": "30 Days",
  "90d": "90 Days",
  "1y": "1 Year",
  all: "All Time",
};

/* ── Top Coins ── */

export const TRACKED_COINS: CoinInfo[] = [
  { symbol: "BTC", name: "Bitcoin", icon: "bitcoin" },
  { symbol: "ETH", name: "Ethereum", icon: "gem" },
  { symbol: "SOL", name: "Solana", icon: "sun" },
  { symbol: "DOGE", name: "Dogecoin", icon: "dog" },
  { symbol: "XRP", name: "Ripple", icon: "waves" },
  { symbol: "ADA", name: "Cardano", icon: "hexagon" },
  { symbol: "AVAX", name: "Avalanche", icon: "mountain" },
  { symbol: "LINK", name: "Chainlink", icon: "link" },
  { symbol: "DOT", name: "Polkadot", icon: "circle-dot" },
  { symbol: "MATIC", name: "Polygon", icon: "pentagon" },
];

/* ── Navigation ── */

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/", icon: "home" },
  { label: "Leaderboard", href: "/leaderboard", icon: "trophy" },
  { label: "Predictions", href: "/predictions", icon: "target" },
  { label: "Influencers", href: "/influencers", icon: "users" },
  { label: "Submit", href: "/submit", icon: "plus-circle" },
];

/* ══════════════════════════════════════════
   SEED / DEMO DATA
   ══════════════════════════════════════════ */

export const SEED_INFLUENCERS: Influencer[] = [
  {
    id: "inf-001",
    name: "CryptoWhale",
    handle: "@cryptowhale",
    platform: "twitter",
    avatarUrl: "/avatars/cryptowhale.png",
    bio: "On-chain analyst. Tracking smart money since 2017.",
    followerCount: 842_000,
    totalPredictions: 134,
    correctPredictions: 97,
    accuracyScore: 72.4,
    rank: 1,
    streak: 8,
    lastActiveAt: "2026-02-25T14:30:00Z",
    createdAt: "2024-03-15T00:00:00Z",
  },
  {
    id: "inf-002",
    name: "AltcoinSherpa",
    handle: "@AltcoinSherpa",
    platform: "twitter",
    avatarUrl: "/avatars/altcoinsherpa.png",
    bio: "Full-time crypto trader. Chart-focused analysis.",
    followerCount: 620_000,
    totalPredictions: 201,
    correctPredictions: 131,
    accuracyScore: 65.2,
    rank: 2,
    streak: 3,
    lastActiveAt: "2026-02-26T09:00:00Z",
    createdAt: "2024-01-10T00:00:00Z",
  },
  {
    id: "inf-003",
    name: "BitBoy Crypto",
    handle: "@BitBoy_Crypto",
    platform: "youtube",
    avatarUrl: "/avatars/bitboy.png",
    bio: "Largest crypto YouTube channel. Daily market updates.",
    followerCount: 1_450_000,
    totalPredictions: 312,
    correctPredictions: 146,
    accuracyScore: 46.8,
    rank: 5,
    streak: -4,
    lastActiveAt: "2026-02-24T18:00:00Z",
    createdAt: "2023-06-01T00:00:00Z",
  },
  {
    id: "inf-004",
    name: "Crypto Banter",
    handle: "@crypto_banter",
    platform: "youtube",
    avatarUrl: "/avatars/cryptobanter.png",
    bio: "Live crypto trading show. Real-time market analysis.",
    followerCount: 980_000,
    totalPredictions: 178,
    correctPredictions: 107,
    accuracyScore: 60.1,
    rank: 3,
    streak: 5,
    lastActiveAt: "2026-02-26T12:00:00Z",
    createdAt: "2024-02-20T00:00:00Z",
  },
  {
    id: "inf-005",
    name: "Lark Davis",
    handle: "@TheCryptoLark",
    platform: "youtube",
    avatarUrl: "/avatars/larkdavis.png",
    bio: "Crypto investor & educator. Altcoin hunter.",
    followerCount: 530_000,
    totalPredictions: 89,
    correctPredictions: 52,
    accuracyScore: 58.4,
    rank: 4,
    streak: 2,
    lastActiveAt: "2026-02-23T10:00:00Z",
    createdAt: "2024-05-12T00:00:00Z",
  },
  {
    id: "inf-006",
    name: "CryptoGems",
    handle: "@CryptoGems555",
    platform: "telegram",
    avatarUrl: "/avatars/cryptogems.png",
    bio: "Early-stage gem finder. Low-cap moonshots.",
    followerCount: 215_000,
    totalPredictions: 67,
    correctPredictions: 28,
    accuracyScore: 41.8,
    rank: 6,
    streak: -2,
    lastActiveAt: "2026-02-20T16:00:00Z",
    createdAt: "2024-08-01T00:00:00Z",
  },
];

export const SEED_PREDICTIONS: Prediction[] = [
  {
    id: "pred-001",
    influencerId: "inf-001",
    influencerName: "CryptoWhale",
    influencerHandle: "@cryptowhale",
    influencerAvatarUrl: "/avatars/cryptowhale.png",
    coin: "Bitcoin",
    coinSymbol: "BTC",
    direction: "bullish",
    targetPrice: 115_000,
    priceAtPrediction: 97_450,
    priceAtResolution: 112_800,
    status: "correct",
    sourceUrl: "https://x.com/cryptowhale/status/123456",
    sourceText: "BTC breaking out of the descending wedge. $115K by end of March. Loading spot here.",
    timeframe: "1m",
    predictedAt: "2026-01-28T10:00:00Z",
    resolvesAt: "2026-02-28T10:00:00Z",
    resolvedAt: "2026-02-22T08:30:00Z",
    submittedBy: null,
    createdAt: "2026-01-28T10:05:00Z",
  },
  {
    id: "pred-002",
    influencerId: "inf-001",
    influencerName: "CryptoWhale",
    influencerHandle: "@cryptowhale",
    influencerAvatarUrl: "/avatars/cryptowhale.png",
    coin: "Ethereum",
    coinSymbol: "ETH",
    direction: "bullish",
    targetPrice: 4_200,
    priceAtPrediction: 3_280,
    priceAtResolution: null,
    status: "pending",
    sourceUrl: "https://x.com/cryptowhale/status/789012",
    sourceText: "ETH/BTC ratio is about to reverse. $4,200 ETH incoming within 3 months.",
    timeframe: "3m",
    predictedAt: "2026-02-15T14:00:00Z",
    resolvesAt: "2026-05-15T14:00:00Z",
    resolvedAt: null,
    submittedBy: null,
    createdAt: "2026-02-15T14:02:00Z",
  },
  {
    id: "pred-003",
    influencerId: "inf-002",
    influencerName: "AltcoinSherpa",
    influencerHandle: "@AltcoinSherpa",
    influencerAvatarUrl: "/avatars/altcoinsherpa.png",
    coin: "Solana",
    coinSymbol: "SOL",
    direction: "bearish",
    targetPrice: 120,
    priceAtPrediction: 175,
    priceAtResolution: 142,
    status: "incorrect",
    sourceUrl: "https://x.com/AltcoinSherpa/status/345678",
    sourceText: "SOL looks like it's topping out here. Expecting a pullback to $120 range before next leg.",
    timeframe: "1m",
    predictedAt: "2026-01-15T08:00:00Z",
    resolvesAt: "2026-02-15T08:00:00Z",
    resolvedAt: "2026-02-15T08:00:00Z",
    submittedBy: null,
    createdAt: "2026-01-15T08:03:00Z",
  },
  {
    id: "pred-004",
    influencerId: "inf-003",
    influencerName: "BitBoy Crypto",
    influencerHandle: "@BitBoy_Crypto",
    influencerAvatarUrl: "/avatars/bitboy.png",
    coin: "Dogecoin",
    coinSymbol: "DOGE",
    direction: "bullish",
    targetPrice: 1.0,
    priceAtPrediction: 0.32,
    priceAtResolution: 0.28,
    status: "incorrect",
    sourceUrl: "https://youtube.com/watch?v=abc123",
    sourceText: "DOGE to $1 is inevitable this cycle. Elon factor is underpriced. Buying aggressively.",
    timeframe: "6m",
    predictedAt: "2025-10-01T12:00:00Z",
    resolvesAt: "2026-04-01T12:00:00Z",
    resolvedAt: "2026-02-20T00:00:00Z",
    submittedBy: "community_user_42",
    createdAt: "2025-10-01T12:10:00Z",
  },
  {
    id: "pred-005",
    influencerId: "inf-004",
    influencerName: "Crypto Banter",
    influencerHandle: "@crypto_banter",
    influencerAvatarUrl: "/avatars/cryptobanter.png",
    coin: "Bitcoin",
    coinSymbol: "BTC",
    direction: "bullish",
    targetPrice: 100_000,
    priceAtPrediction: 87_200,
    priceAtResolution: 103_500,
    status: "correct",
    sourceUrl: "https://youtube.com/watch?v=def456",
    sourceText: "100K Bitcoin is a matter of weeks, not months. Institutional demand is off the charts.",
    timeframe: "1m",
    predictedAt: "2025-12-10T09:00:00Z",
    resolvesAt: "2026-01-10T09:00:00Z",
    resolvedAt: "2026-01-05T16:00:00Z",
    submittedBy: null,
    createdAt: "2025-12-10T09:05:00Z",
  },
  {
    id: "pred-006",
    influencerId: "inf-005",
    influencerName: "Lark Davis",
    influencerHandle: "@TheCryptoLark",
    influencerAvatarUrl: "/avatars/larkdavis.png",
    coin: "Avalanche",
    coinSymbol: "AVAX",
    direction: "bullish",
    targetPrice: 65,
    priceAtPrediction: 38,
    priceAtResolution: null,
    status: "pending",
    sourceUrl: "https://youtube.com/watch?v=ghi789",
    sourceText: "AVAX is massively undervalued. Subnet thesis is playing out. $65 target by Q2.",
    timeframe: "3m",
    predictedAt: "2026-02-01T11:00:00Z",
    resolvesAt: "2026-05-01T11:00:00Z",
    resolvedAt: null,
    submittedBy: null,
    createdAt: "2026-02-01T11:02:00Z",
  },
  {
    id: "pred-007",
    influencerId: "inf-002",
    influencerName: "AltcoinSherpa",
    influencerHandle: "@AltcoinSherpa",
    influencerAvatarUrl: "/avatars/altcoinsherpa.png",
    coin: "Chainlink",
    coinSymbol: "LINK",
    direction: "bullish",
    targetPrice: 28,
    priceAtPrediction: 18.5,
    priceAtResolution: 29.3,
    status: "correct",
    sourceUrl: "https://x.com/AltcoinSherpa/status/901234",
    sourceText: "LINK weekly chart looks beautiful. Staking catalyst coming. $28+ within a few weeks.",
    timeframe: "1m",
    predictedAt: "2026-01-20T07:00:00Z",
    resolvesAt: "2026-02-20T07:00:00Z",
    resolvedAt: "2026-02-12T14:00:00Z",
    submittedBy: null,
    createdAt: "2026-01-20T07:05:00Z",
  },
  {
    id: "pred-008",
    influencerId: "inf-006",
    influencerName: "CryptoGems",
    influencerHandle: "@CryptoGems555",
    influencerAvatarUrl: "/avatars/cryptogems.png",
    coin: "Polkadot",
    coinSymbol: "DOT",
    direction: "bullish",
    targetPrice: 15,
    priceAtPrediction: 7.8,
    priceAtResolution: 8.1,
    status: "incorrect",
    sourceUrl: "https://t.me/CryptoGems555/4567",
    sourceText: "DOT is the most undervalued L1. Easy 2x from here. $15 minimum this quarter.",
    timeframe: "3m",
    predictedAt: "2025-11-01T10:00:00Z",
    resolvesAt: "2026-02-01T10:00:00Z",
    resolvedAt: "2026-02-01T10:00:00Z",
    submittedBy: "community_user_17",
    createdAt: "2025-11-01T10:08:00Z",
  },
];

/* ── Seed Leaderboard ── */

export const SEED_LEADERBOARD: LeaderboardEntry[] = SEED_INFLUENCERS
  .sort((a, b) => a.rank - b.rank)
  .map((inf) => ({
    rank: inf.rank,
    influencer: inf,
    accuracyScore: inf.accuracyScore,
    totalPredictions: inf.totalPredictions,
    correctPredictions: inf.correctPredictions,
    avgReturn: [18.2, 12.5, 4.1, 14.8, 9.3, -2.7][inf.rank - 1],
    streak: inf.streak,
    trend: (inf.streak > 0 ? "up" : inf.streak < 0 ? "down" : "stable") as LeaderboardEntry["trend"],
    sparklineData: [
      [62, 65, 68, 70, 72, 71, 74, 72],
      [58, 60, 63, 61, 64, 66, 65, 65],
      [52, 48, 50, 47, 45, 48, 46, 47],
      [55, 57, 59, 58, 61, 60, 62, 60],
      [50, 53, 55, 56, 57, 58, 59, 58],
      [48, 45, 43, 44, 42, 40, 41, 42],
    ][inf.rank - 1],
  }));

/* ── Seed Accuracy History ── */

export const SEED_ACCURACY_HISTORY: AccuracyDataPoint[] = [
  { date: "2025-09-01", accuracy: 58, totalPredictions: 420 },
  { date: "2025-10-01", accuracy: 60, totalPredictions: 510 },
  { date: "2025-11-01", accuracy: 57, totalPredictions: 620 },
  { date: "2025-12-01", accuracy: 62, totalPredictions: 740 },
  { date: "2026-01-01", accuracy: 64, totalPredictions: 870 },
  { date: "2026-02-01", accuracy: 61, totalPredictions: 981 },
];

/* ── Seed Community Submissions ── */

export const SEED_SUBMISSIONS: CommunitySubmission[] = [
  {
    id: "sub-001",
    submittedBy: "anon_trader_88",
    influencerHandle: "@cryptowhale",
    platform: "twitter",
    sourceUrl: "https://x.com/cryptowhale/status/555111",
    sourceText: "XRP breakout confirmed. $3 incoming within 2 weeks.",
    coin: "Ripple",
    coinSymbol: "XRP",
    direction: "bullish",
    targetPrice: 3.0,
    timeframe: "1w",
    status: "pending_review",
    submittedAt: "2026-02-26T20:00:00Z",
    reviewedAt: null,
  },
  {
    id: "sub-002",
    submittedBy: "whale_watcher_99",
    influencerHandle: "@AltcoinSherpa",
    platform: "twitter",
    sourceUrl: "https://x.com/AltcoinSherpa/status/555222",
    sourceText: "BTC looking weak at resistance. Could see 90K before 120K.",
    coin: "Bitcoin",
    coinSymbol: "BTC",
    direction: "bearish",
    targetPrice: 90_000,
    timeframe: "1m",
    status: "approved",
    submittedAt: "2026-02-24T15:00:00Z",
    reviewedAt: "2026-02-25T10:00:00Z",
  },
];

/* ── Seed Hero Stats ── */

export const SEED_HERO_STATS: HeroStats = {
  totalPredictions: 981,
  averageAccuracy: 61,
  trackedInfluencers: 47,
};
