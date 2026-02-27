import type {
  Prediction,
  Influencer,
  ScoreBreakdown,
  ScoringWeights,
  LeaderboardEntry,
  AccuracyDataPoint,
  InfluencerTier,
} from "@/types";
import { DEFAULT_SCORING_WEIGHTS, getTierForScore } from "@/lib/constants";

/* ── Basic Accuracy ── */

export function calculateAccuracy(correct: number, total: number): number {
  if (total === 0) return 0;
  return (correct / total) * 100;
}

/* ── Weighted Score Breakdown ── */

export function calculateScoreBreakdown(
  predictions: Prediction[],
  weights: ScoringWeights = DEFAULT_SCORING_WEIGHTS
): ScoreBreakdown {
  const total = predictions.length;
  if (total === 0) {
    return {
      total: 0,
      accuracyComponent: 0,
      consistencyComponent: 0,
      volumeComponent: 0,
      recencyComponent: 0,
    };
  }

  const correct = predictions.filter((p) => p.status === "correct").length;
  const accuracyRaw = (correct / total) * 100;

  // Consistency: low variance in rolling accuracy
  const consistencyRaw = calculateConsistency(predictions);

  // Volume: logarithmic scale, max contribution at ~200 predictions
  const volumeRaw = Math.min((Math.log10(total + 1) / Math.log10(201)) * 100, 100);

  // Recency: weight recent predictions more heavily
  const recencyRaw = calculateRecencyScore(predictions);

  const accuracyComponent = accuracyRaw * weights.accuracy;
  const consistencyComponent = consistencyRaw * weights.consistency;
  const volumeComponent = volumeRaw * weights.volume;
  const recencyComponent = recencyRaw * weights.recency;

  return {
    total: accuracyComponent + consistencyComponent + volumeComponent + recencyComponent,
    accuracyComponent,
    consistencyComponent,
    volumeComponent,
    recencyComponent,
  };
}

/* ── Consistency Score ── */

function calculateConsistency(predictions: Prediction[]): number {
  const resolved = predictions.filter((p) => p.status !== "pending");
  if (resolved.length < 5) return 50; // neutral score for small sample

  // Sort by predicted date
  const sorted = [...resolved].sort(
    (a, b) => new Date(a.predictedAt).getTime() - new Date(b.predictedAt).getTime()
  );

  // Calculate rolling accuracy in windows of 5
  const windowSize = 5;
  const windowAccuracies: number[] = [];
  for (let i = 0; i <= sorted.length - windowSize; i++) {
    const window = sorted.slice(i, i + windowSize);
    const windowCorrect = window.filter((p) => p.status === "correct").length;
    windowAccuracies.push(windowCorrect / windowSize);
  }

  if (windowAccuracies.length < 2) return 50;

  // Lower variance = higher consistency
  const mean = windowAccuracies.reduce((a, b) => a + b, 0) / windowAccuracies.length;
  const variance =
    windowAccuracies.reduce((sum, v) => sum + (v - mean) ** 2, 0) / windowAccuracies.length;
  const stdDev = Math.sqrt(variance);

  // Convert to 0-100 score (stdDev of 0 = 100, stdDev of 0.5 = 0)
  return Math.max(0, Math.min(100, (1 - stdDev * 2) * 100));
}

/* ── Recency Score ── */

function calculateRecencyScore(predictions: Prediction[]): number {
  const resolved = predictions.filter((p) => p.status !== "pending");
  if (resolved.length === 0) return 0;

  const now = Date.now();
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

  // Get predictions from the last 30 days
  const recent = resolved.filter(
    (p) => now - new Date(p.resolvedAt ?? p.predictedAt).getTime() < thirtyDaysMs
  );

  if (recent.length === 0) return 20; // penalty for inactivity

  const recentCorrect = recent.filter((p) => p.status === "correct").length;
  return (recentCorrect / recent.length) * 100;
}

/* ── Streak Calculation ── */

export function calculateStreak(predictions: Prediction[]): number {
  const resolved = predictions
    .filter((p) => p.status !== "pending")
    .sort((a, b) => new Date(b.resolvedAt ?? b.predictedAt).getTime() - new Date(a.resolvedAt ?? a.predictedAt).getTime());

  if (resolved.length === 0) return 0;

  const firstStatus = resolved[0].status;
  let streak = 0;

  for (const pred of resolved) {
    if (pred.status === firstStatus) {
      streak++;
    } else {
      break;
    }
  }

  return firstStatus === "correct" ? streak : -streak;
}

/* ── Average Return ── */

export function calculateAvgReturn(predictions: Prediction[]): number {
  const resolved = predictions.filter(
    (p) => p.status !== "pending" && p.priceAtResolution !== null
  );

  if (resolved.length === 0) return 0;

  const returns = resolved.map((p) => {
    const priceAtResolution = p.priceAtResolution!;
    const rawReturn =
      ((priceAtResolution - p.priceAtPrediction) / p.priceAtPrediction) * 100;

    // For bearish predictions, invert the return
    return p.direction === "bearish" ? -rawReturn : rawReturn;
  });

  return returns.reduce((a, b) => a + b, 0) / returns.length;
}

/* ── Build Leaderboard Entry from Influencer + Predictions ── */

export function buildLeaderboardEntry(
  influencer: Influencer,
  predictions: Prediction[]
): LeaderboardEntry {
  const influencerPreds = predictions.filter(
    (p) => p.influencerId === influencer.id
  );

  const resolved = influencerPreds.filter((p) => p.status !== "pending");
  const correct = resolved.filter((p) => p.status === "correct").length;
  const score = calculateScoreBreakdown(influencerPreds);
  const streak = calculateStreak(influencerPreds);

  return {
    rank: influencer.rank,
    influencer,
    accuracyScore: score.total,
    totalPredictions: resolved.length,
    correctPredictions: correct,
    avgReturn: calculateAvgReturn(influencerPreds),
    streak,
    trend: streak > 0 ? "up" : streak < 0 ? "down" : "stable",
    sparklineData: buildSparkline(influencerPreds),
  };
}

/* ── Sparkline Data ── */

function buildSparkline(predictions: Prediction[]): number[] {
  const resolved = predictions
    .filter((p) => p.status !== "pending")
    .sort((a, b) => new Date(a.predictedAt).getTime() - new Date(b.predictedAt).getTime());

  if (resolved.length < 3) return [50, 50, 50, 50, 50, 50, 50, 50];

  // Build 8-point sparkline from rolling accuracy
  const points = 8;
  const chunkSize = Math.max(1, Math.floor(resolved.length / points));
  const sparkline: number[] = [];

  for (let i = 0; i < points; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, resolved.length);
    const chunk = resolved.slice(start, end);

    if (chunk.length === 0) {
      sparkline.push(sparkline[sparkline.length - 1] ?? 50);
    } else {
      const chunkCorrect = chunk.filter((p) => p.status === "correct").length;
      sparkline.push(Math.round((chunkCorrect / chunk.length) * 100));
    }
  }

  return sparkline;
}

/* ── Accuracy History Builder ── */

export function buildAccuracyHistory(
  predictions: Prediction[],
  months: number = 6
): AccuracyDataPoint[] {
  const resolved = predictions.filter((p) => p.status !== "pending");
  if (resolved.length === 0) return [];

  const now = new Date();
  const points: AccuracyDataPoint[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const dateStr = date.toISOString().slice(0, 10);

    const predsBeforeDate = resolved.filter(
      (p) => new Date(p.resolvedAt ?? p.predictedAt) <= new Date(date.getFullYear(), date.getMonth() + 1, 0)
    );

    const correct = predsBeforeDate.filter((p) => p.status === "correct").length;

    points.push({
      date: dateStr,
      accuracy: predsBeforeDate.length > 0 ? Math.round((correct / predsBeforeDate.length) * 100) : 0,
      totalPredictions: predsBeforeDate.length,
    });
  }

  return points;
}

/* ── Tier Assignment ── */

export function getInfluencerTier(score: number): InfluencerTier {
  return getTierForScore(score).tier;
}

/* ── Rank Influencers ── */

export function rankInfluencers(
  influencers: Influencer[],
  predictions: Prediction[]
): LeaderboardEntry[] {
  const entries = influencers.map((inf) =>
    buildLeaderboardEntry(inf, predictions)
  );

  return entries
    .sort((a, b) => b.accuracyScore - a.accuracyScore)
    .map((entry, idx) => ({ ...entry, rank: idx + 1 }));
}

/* ── Top Coins for Report Card ── */

export function getTopCoins(
  predictions: Prediction[],
  limit: number = 5
): { coinSymbol: string; count: number; accuracy: number }[] {
  const coinMap = new Map<string, { correct: number; total: number }>();

  for (const pred of predictions) {
    if (pred.status === "pending") continue;
    const entry = coinMap.get(pred.coinSymbol) ?? { correct: 0, total: 0 };
    entry.total++;
    if (pred.status === "correct") entry.correct++;
    coinMap.set(pred.coinSymbol, entry);
  }

  return Array.from(coinMap.entries())
    .map(([coinSymbol, { correct, total }]) => ({
      coinSymbol,
      count: total,
      accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}
