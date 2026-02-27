import { NextRequest, NextResponse } from "next/server";
import { MOCK_PREDICTIONS } from "@/data/mock-predictions";
import {
  MOCK_INFLUENCERS,
  MOCK_SCORE_BREAKDOWNS,
  getTier,
} from "@/data/mock-influencers";
import { MOCK_PRICES, MOCK_PRICE_CHANGES_24H, getCoinBySymbol } from "@/data/mock-coins";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const prediction = MOCK_PREDICTIONS.find((p) => p.id === id);

  if (!prediction) {
    return NextResponse.json(
      { error: "Prediction not found" },
      { status: 404 }
    );
  }

  /* ── Influencer context ── */
  const influencer = MOCK_INFLUENCERS.find(
    (inf) => inf.id === prediction.influencerId
  );

  const tier = influencer ? getTier(influencer.accuracyScore) : null;
  const scoreBreakdown = influencer
    ? MOCK_SCORE_BREAKDOWNS[influencer.id] ?? null
    : null;

  /* ── Coin context ── */
  const coin = getCoinBySymbol(prediction.coinSymbol);
  const currentPrice = MOCK_PRICES[prediction.coinSymbol] ?? null;
  const priceChange24h = MOCK_PRICE_CHANGES_24H[prediction.coinSymbol] ?? null;

  /* ── Price movement calculations ── */
  const resolvedOrCurrentPrice =
    prediction.priceAtResolution ?? currentPrice ?? prediction.priceAtPrediction;

  const priceChangePercent =
    ((resolvedOrCurrentPrice - prediction.priceAtPrediction) /
      prediction.priceAtPrediction) *
    100;

  const targetProgress =
    prediction.targetPrice !== null
      ? (() => {
          const targetDelta = prediction.targetPrice - prediction.priceAtPrediction;
          if (targetDelta === 0) return 100;
          const actualDelta = resolvedOrCurrentPrice - prediction.priceAtPrediction;
          return Math.round((actualDelta / targetDelta) * 1000) / 10;
        })()
      : null;

  /* ── Related predictions (same coin, excluding current) ── */
  const relatedPredictions = MOCK_PREDICTIONS.filter(
    (p) => p.coinSymbol === prediction.coinSymbol && p.id !== prediction.id
  )
    .sort(
      (a, b) =>
        new Date(b.predictedAt).getTime() - new Date(a.predictedAt).getTime()
    )
    .slice(0, 5);

  /* ── Influencer's other predictions ── */
  const influencerPredictions = MOCK_PREDICTIONS.filter(
    (p) => p.influencerId === prediction.influencerId && p.id !== prediction.id
  )
    .sort(
      (a, b) =>
        new Date(b.predictedAt).getTime() - new Date(a.predictedAt).getTime()
    )
    .slice(0, 5);

  /* ── Influencer stats for this coin ── */
  const influencerCoinPredictions = MOCK_PREDICTIONS.filter(
    (p) =>
      p.influencerId === prediction.influencerId &&
      p.coinSymbol === prediction.coinSymbol &&
      p.status !== "pending"
  );
  const coinAccuracy =
    influencerCoinPredictions.length > 0
      ? Math.round(
          (influencerCoinPredictions.filter((p) => p.status === "correct").length /
            influencerCoinPredictions.length) *
            1000
        ) / 10
      : null;

  return NextResponse.json({
    prediction,
    influencer: influencer
      ? {
          ...influencer,
          tier,
          scoreBreakdown,
        }
      : null,
    coin: coin
      ? {
          ...coin,
          currentPrice,
          priceChange24h,
        }
      : null,
    analysis: {
      priceChangePercent: Math.round(priceChangePercent * 10) / 10,
      targetProgress,
      resolvedOrCurrentPrice,
      influencerCoinAccuracy: coinAccuracy,
      influencerCoinPredictionCount: influencerCoinPredictions.length,
    },
    relatedPredictions,
    influencerPredictions,
  });
}
