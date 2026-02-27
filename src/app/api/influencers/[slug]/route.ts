import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_INFLUENCERS,
  MOCK_ACCURACY_HISTORIES,
  MOCK_SCORE_BREAKDOWNS,
  getTier,
} from "@/data/mock-influencers";
import { MOCK_PREDICTIONS } from "@/data/mock-predictions";

/** Derive a URL-safe slug from a handle: "@CryptoVault" → "cryptovault" */
function handleToSlug(handle: string): string {
  return handle.replace(/^@/, "").toLowerCase();
}

function findBySlug(slug: string) {
  return MOCK_INFLUENCERS.find(
    (inf) => handleToSlug(inf.handle) === slug.toLowerCase()
  );
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const influencer = findBySlug(slug);

  if (!influencer) {
    return NextResponse.json(
      { error: "Influencer not found" },
      { status: 404 }
    );
  }

  /* ── Aggregate prediction stats ── */
  const predictions = MOCK_PREDICTIONS.filter(
    (p) => p.influencerId === influencer.id
  );
  const correct = predictions.filter((p) => p.status === "correct").length;
  const incorrect = predictions.filter((p) => p.status === "incorrect").length;
  const pending = predictions.filter((p) => p.status === "pending").length;

  /* ── Top coins ── */
  const coinMap = new Map<string, { total: number; correct: number }>();
  for (const p of predictions) {
    const entry = coinMap.get(p.coinSymbol) ?? { total: 0, correct: 0 };
    entry.total++;
    if (p.status === "correct") entry.correct++;
    coinMap.set(p.coinSymbol, entry);
  }
  const topCoins = Array.from(coinMap.entries())
    .map(([coinSymbol, { total, correct: c }]) => ({
      coinSymbol,
      count: total,
      accuracy: total > 0 ? Math.round((c / total) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.count - a.count);

  /* ── Tier info ── */
  const tier = getTier(influencer.accuracyScore);

  /* ── Accuracy history & score breakdown ── */
  const accuracyHistory = MOCK_ACCURACY_HISTORIES[influencer.id] ?? [];
  const scoreBreakdown = MOCK_SCORE_BREAKDOWNS[influencer.id] ?? null;

  return NextResponse.json({
    influencer,
    tier,
    stats: {
      correct,
      incorrect,
      pending,
      total: predictions.length,
    },
    topCoins,
    accuracyHistory,
    scoreBreakdown,
    recentPredictions: predictions
      .sort(
        (a, b) =>
          new Date(b.predictedAt).getTime() - new Date(a.predictedAt).getTime()
      )
      .slice(0, 5),
  });
}
