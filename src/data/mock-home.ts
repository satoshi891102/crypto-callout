import type { HeroStats, ReportCard, NavItem, ReportPeriod } from "@/types";
import { MOCK_INFLUENCERS } from "./mock-influencers";
import { MOCK_PREDICTIONS, getRecentPredictions } from "./mock-predictions";
import { getTopPerformers, getHottestStreaks } from "./mock-leaderboard";
import { MOCK_ACCURACY_HISTORIES } from "./mock-influencers";

/* ── Hero Stats ── */

export const MOCK_HERO_STATS: HeroStats = {
  totalPredictions: 4_187,
  averageAccuracy: 67.4,
  trackedInfluencers: 312,
};

/* ── Trending Coins (for home page widget) ── */

export interface TrendingCoin {
  symbol: string;
  name: string;
  predictionCount: number;
  bullishPercent: number;
  avgAccuracy: number;
}

export const MOCK_TRENDING_COINS: TrendingCoin[] = [
  { symbol: "BTC", name: "Bitcoin", predictionCount: 1_247, bullishPercent: 78, avgAccuracy: 71.2 },
  { symbol: "ETH", name: "Ethereum", predictionCount: 892, bullishPercent: 72, avgAccuracy: 68.5 },
  { symbol: "SOL", name: "Solana", predictionCount: 634, bullishPercent: 85, avgAccuracy: 64.8 },
  { symbol: "XRP", name: "Ripple", predictionCount: 412, bullishPercent: 67, avgAccuracy: 59.3 },
  { symbol: "DOGE", name: "Dogecoin", predictionCount: 387, bullishPercent: 91, avgAccuracy: 38.1 },
  { symbol: "ARB", name: "Arbitrum", predictionCount: 256, bullishPercent: 80, avgAccuracy: 62.4 },
];

/* ── Activity Feed Items (for home page) ── */

export interface ActivityFeedItem {
  id: string;
  type: "new_prediction" | "resolved_correct" | "resolved_incorrect" | "streak_milestone";
  predictionId?: string;
  influencerName: string;
  influencerHandle: string;
  influencerAvatarUrl: string;
  coinSymbol?: string;
  direction?: "bullish" | "bearish";
  streak?: number;
  timestamp: string;
  description: string;
}

export const MOCK_ACTIVITY_FEED: ActivityFeedItem[] = [
  {
    id: "act-001",
    type: "new_prediction",
    predictionId: "pred-020",
    influencerName: "Whale Watch",
    influencerHandle: "@WhaleWatchCrypto",
    influencerAvatarUrl: "/avatars/whalewatch.jpg",
    coinSymbol: "BTC",
    direction: "bullish",
    timestamp: "2026-02-27T06:05:00Z",
    description: "New BTC prediction: bullish $100K target",
  },
  {
    id: "act-002",
    type: "resolved_correct",
    predictionId: "pred-019",
    influencerName: "SolanaMaxi",
    influencerHandle: "@SolanaMaxiAlpha",
    influencerAvatarUrl: "/avatars/solanamxi.jpg",
    coinSymbol: "SOL",
    direction: "bullish",
    timestamp: "2026-02-25T07:00:00Z",
    description: "SOL bullish call resolved correct — hit $198.73",
  },
  {
    id: "act-003",
    type: "streak_milestone",
    influencerName: "CryptoVault",
    influencerHandle: "@CryptoVault",
    influencerAvatarUrl: "/avatars/cryptovault.jpg",
    streak: 14,
    timestamp: "2026-02-26T18:30:00Z",
    description: "14-prediction winning streak!",
  },
  {
    id: "act-004",
    type: "resolved_incorrect",
    predictionId: "pred-013",
    influencerName: "ChartMaster Pro",
    influencerHandle: "@ChartMasterPro",
    influencerAvatarUrl: "/avatars/chartmaster.jpg",
    coinSymbol: "ETH",
    direction: "bearish",
    timestamp: "2026-02-22T15:00:00Z",
    description: "ETH bearish call missed — price went up instead",
  },
  {
    id: "act-005",
    type: "new_prediction",
    predictionId: "pred-018",
    influencerName: "Bearish Baron",
    influencerHandle: "@BearishBaron",
    influencerAvatarUrl: "/avatars/bearishbaron.jpg",
    coinSymbol: "SOL",
    direction: "bearish",
    timestamp: "2026-02-20T10:05:00Z",
    description: "New SOL prediction: bearish $120 target",
  },
  {
    id: "act-006",
    type: "resolved_correct",
    predictionId: "pred-010",
    influencerName: "Whale Watch",
    influencerHandle: "@WhaleWatchCrypto",
    influencerAvatarUrl: "/avatars/whalewatch.jpg",
    coinSymbol: "LINK",
    direction: "bullish",
    timestamp: "2026-02-25T06:00:00Z",
    description: "LINK bullish call nailed — up 30% from entry",
  },
  {
    id: "act-007",
    type: "resolved_incorrect",
    predictionId: "pred-008",
    influencerName: "TokenWhiz",
    influencerHandle: "@TokenWhiz",
    influencerAvatarUrl: "/avatars/tokenwhiz.jpg",
    coinSymbol: "DOGE",
    direction: "bullish",
    timestamp: "2026-02-15T18:00:00Z",
    description: "DOGE $0.50 call missed — dropped to $0.18",
  },
  {
    id: "act-008",
    type: "streak_milestone",
    influencerName: "Moon Macro",
    influencerHandle: "@MoonMacro",
    influencerAvatarUrl: "/avatars/moonmacro.jpg",
    streak: 11,
    timestamp: "2026-02-25T14:00:00Z",
    description: "11-prediction winning streak!",
  },
];

/* ── Report Card Samples (shareable) ── */

export function generateReportCard(
  influencerId: string,
  period: ReportPeriod
): ReportCard | null {
  const influencer = MOCK_INFLUENCERS.find((inf) => inf.id === influencerId);
  if (!influencer) return null;

  const allPreds = MOCK_PREDICTIONS.filter((p) => p.influencerId === influencerId);
  const correctPreds = allPreds.filter((p) => p.status === "correct");
  const incorrectPreds = allPreds.filter((p) => p.status === "incorrect");

  const topCoinsMap = new Map<string, { count: number; correct: number }>();
  for (const pred of allPreds) {
    const existing = topCoinsMap.get(pred.coinSymbol) ?? { count: 0, correct: 0 };
    existing.count++;
    if (pred.status === "correct") existing.correct++;
    topCoinsMap.set(pred.coinSymbol, existing);
  }

  const topCoins = [...topCoinsMap.entries()]
    .map(([coinSymbol, data]) => ({
      coinSymbol,
      count: data.count,
      accuracy: data.count > 0 ? Math.round((data.correct / data.count) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const bestCall = correctPreds.length > 0
    ? correctPreds.reduce((best, p) => {
        const bestReturn = best.priceAtResolution && best.priceAtPrediction
          ? Math.abs(best.priceAtResolution - best.priceAtPrediction) / best.priceAtPrediction
          : 0;
        const pReturn = p.priceAtResolution && p.priceAtPrediction
          ? Math.abs(p.priceAtResolution - p.priceAtPrediction) / p.priceAtPrediction
          : 0;
        return pReturn > bestReturn ? p : best;
      })
    : null;

  const worstCall = incorrectPreds.length > 0
    ? incorrectPreds.reduce((worst, p) => {
        const worstReturn = worst.priceAtResolution && worst.priceAtPrediction
          ? Math.abs(worst.priceAtResolution - worst.priceAtPrediction) / worst.priceAtPrediction
          : 0;
        const pReturn = p.priceAtResolution && p.priceAtPrediction
          ? Math.abs(p.priceAtResolution - p.priceAtPrediction) / p.priceAtPrediction
          : 0;
        return pReturn > worstReturn ? p : worst;
      })
    : null;

  return {
    influencer,
    period,
    totalPredictions: allPreds.length,
    correctPredictions: correctPreds.length,
    accuracyScore: influencer.accuracyScore,
    avgReturn: allPreds.length > 0 ? 24.3 : 0,
    bestCall,
    worstCall,
    topCoins,
    accuracyHistory: MOCK_ACCURACY_HISTORIES[influencerId] ?? [],
    generatedAt: new Date().toISOString(),
  };
}

/* ── Navigation ── */

export const MOCK_NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/", icon: "Home" },
  { label: "Leaderboard", href: "/leaderboard", icon: "Trophy" },
  { label: "Predictions", href: "/predictions", icon: "TrendingUp" },
  { label: "Influencers", href: "/influencers", icon: "Users" },
  { label: "Submit", href: "/submit", icon: "PlusCircle" },
];

/* ── Quick-access exports for home page components ── */

export const homePageData = {
  heroStats: MOCK_HERO_STATS,
  recentPredictions: getRecentPredictions(5),
  topPerformers: getTopPerformers(5),
  hottestStreaks: getHottestStreaks(5),
  trendingCoins: MOCK_TRENDING_COINS,
  activityFeed: MOCK_ACTIVITY_FEED,
};
