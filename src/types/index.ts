/* ── Prediction Status ── */

export type PredictionStatus = "correct" | "incorrect" | "pending";

export type PredictionDirection = "bullish" | "bearish";

export type PredictionTimeframe =
  | "24h"
  | "1w"
  | "1m"
  | "3m"
  | "6m"
  | "1y"
  | "custom";

/* ── Platform ── */

export type Platform = "twitter" | "youtube" | "tiktok" | "telegram";

/* ── Influencer ── */

export interface Influencer {
  id: string;
  name: string;
  handle: string;
  platform: Platform;
  avatarUrl: string;
  bio: string;
  followerCount: number;
  totalPredictions: number;
  correctPredictions: number;
  accuracyScore: number;
  rank: number;
  streak: number;
  lastActiveAt: string;
  createdAt: string;
}

/* ── Prediction ── */

export interface Prediction {
  id: string;
  influencerId: string;
  influencerName: string;
  influencerHandle: string;
  influencerAvatarUrl: string;
  coin: string;
  coinSymbol: string;
  direction: PredictionDirection;
  targetPrice: number | null;
  priceAtPrediction: number;
  priceAtResolution: number | null;
  status: PredictionStatus;
  sourceUrl: string;
  sourceText: string;
  timeframe: PredictionTimeframe;
  predictedAt: string;
  resolvesAt: string;
  resolvedAt: string | null;
  submittedBy: string | null;
  createdAt: string;
}

/* ── Leaderboard Entry ── */

export interface LeaderboardEntry {
  rank: number;
  influencer: Influencer;
  accuracyScore: number;
  totalPredictions: number;
  correctPredictions: number;
  avgReturn: number;
  streak: number;
  trend: "up" | "down" | "stable";
  sparklineData: number[];
}

/* ── Accuracy History Point (for charts) ── */

export interface AccuracyDataPoint {
  date: string;
  accuracy: number;
  totalPredictions: number;
}

/* ── Price Chart Point ── */

export interface PriceDataPoint {
  date: string;
  price: number;
  predictionMarker?: {
    predictionId: string;
    direction: PredictionDirection;
    status: PredictionStatus;
  };
}

/* ── Hero Stats (home page banner) ── */

export interface HeroStats {
  totalPredictions: number;
  averageAccuracy: number;
  trackedInfluencers: number;
}

/* ── Community Submission ── */

export type SubmissionStatus = "pending_review" | "approved" | "rejected";

export interface CommunitySubmission {
  id: string;
  submittedBy: string;
  influencerHandle: string;
  platform: Platform;
  sourceUrl: string;
  sourceText: string;
  coin: string;
  coinSymbol: string;
  direction: PredictionDirection;
  targetPrice: number | null;
  timeframe: PredictionTimeframe;
  status: SubmissionStatus;
  submittedAt: string;
  reviewedAt: string | null;
}

/* ── Report Card (shareable) ── */

export type ReportPeriod = "30d" | "90d" | "1y" | "all";

export interface ReportCard {
  influencer: Influencer;
  period: ReportPeriod;
  totalPredictions: number;
  correctPredictions: number;
  accuracyScore: number;
  avgReturn: number;
  bestCall: Prediction | null;
  worstCall: Prediction | null;
  topCoins: { coinSymbol: string; count: number; accuracy: number }[];
  accuracyHistory: AccuracyDataPoint[];
  generatedAt: string;
}

/* ── Filter / Sort Options ── */

export type LeaderboardSortField =
  | "accuracy"
  | "totalPredictions"
  | "streak"
  | "avgReturn";

export type PredictionFilterStatus = PredictionStatus | "all";

export type TimeRange = "7d" | "30d" | "90d" | "1y" | "all";

export interface LeaderboardFilters {
  sortBy: LeaderboardSortField;
  timeRange: TimeRange;
  minPredictions: number;
}

export interface PredictionFilters {
  status: PredictionFilterStatus;
  coin: string | null;
  timeRange: TimeRange;
  direction: PredictionDirection | "all";
}

/* ── Scoring ── */

export interface ScoringWeights {
  accuracy: number;
  consistency: number;
  volume: number;
  recency: number;
}

export interface ScoreBreakdown {
  total: number;
  accuracyComponent: number;
  consistencyComponent: number;
  volumeComponent: number;
  recencyComponent: number;
}

/* ── Tier / Badge ── */

export type InfluencerTier = "legendary" | "expert" | "intermediate" | "novice" | "unranked";

export interface TierInfo {
  tier: InfluencerTier;
  label: string;
  minScore: number;
  color: string;
}

/* ── Coin Metadata ── */

export interface CoinInfo {
  symbol: string;
  name: string;
  icon: string;
}

/* ── Navigation ── */

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

/* ── Search ── */

export type SearchCategory = "all" | "influencers" | "coins" | "predictions" | "pages";

export interface SearchResultInfluencer {
  type: "influencer";
  id: string;
  name: string;
  handle: string;
  platform: string;
  accuracyScore: number;
  rank: number;
  followerCount: number;
  href: string;
}

export interface SearchResultPrediction {
  type: "prediction";
  id: string;
  influencerName: string;
  influencerHandle: string;
  coin: string;
  coinSymbol: string;
  direction: PredictionDirection;
  status: PredictionStatus;
  sourceText: string;
  href: string;
}

export interface SearchResultCoin {
  type: "coin";
  symbol: string;
  name: string;
  icon: string;
  price: number | null;
  change24h: number | null;
  href: string;
}

export interface SearchResultPage {
  type: "page";
  label: string;
  href: string;
  icon?: string;
}

export type SearchResult =
  | SearchResultInfluencer
  | SearchResultPrediction
  | SearchResultCoin
  | SearchResultPage;

export interface SearchResponse {
  query: string;
  results: SearchResult[];
  grouped: {
    pages: SearchResultPage[];
    influencers: SearchResultInfluencer[];
    coins: SearchResultCoin[];
    predictions: SearchResultPrediction[];
  };
  totalResults: number;
}
