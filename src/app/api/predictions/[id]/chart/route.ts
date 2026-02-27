import { NextRequest, NextResponse } from "next/server";
import { MOCK_PREDICTIONS } from "@/data/mock-predictions";
import {
  MOCK_PRICES,
  MOCK_PRICE_HISTORIES,
} from "@/data/mock-coins";
import type { PriceDataPoint } from "@/types";

/** Generate price history for coins without pre-generated data */
function generatePriceHistory(
  symbol: string,
  days: number,
  predictionId: string,
  direction: "bullish" | "bearish",
  status: "correct" | "incorrect" | "pending",
  predictionDayOffset: number
): PriceDataPoint[] {
  const basePrice = MOCK_PRICES[symbol] ?? 100;
  const volatility = symbol === "BTC" ? 0.015 : symbol === "ETH" ? 0.02 : 0.03;
  const points: PriceDataPoint[] = [];
  let price = basePrice * (1 - volatility * days * 0.3);

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i));
    const change = (Math.random() - 0.48) * volatility * price;
    price = Math.max(price + change, price * 0.5);

    const isMarker = i === predictionDayOffset;

    points.push({
      date: date.toISOString().split("T")[0],
      price: Math.round(price * 100) / 100,
      ...(isMarker
        ? {
            predictionMarker: {
              predictionId,
              direction,
              status,
            },
          }
        : {}),
    });
  }

  return points;
}

export async function GET(
  request: NextRequest,
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

  /* ── Parse query params ── */
  const searchParams = request.nextUrl.searchParams;
  const rangeParam = searchParams.get("range") ?? "90d";

  const daysMap: Record<string, number> = {
    "7d": 7,
    "30d": 30,
    "90d": 90,
    "180d": 180,
    "1y": 365,
  };
  const days = daysMap[rangeParam] ?? 90;

  /* ── Get or generate price history ── */
  const existingHistory = MOCK_PRICE_HISTORIES[prediction.coinSymbol];

  let priceHistory: PriceDataPoint[];

  if (existingHistory && existingHistory.length > 0) {
    // Use existing history, sliced to requested range
    priceHistory = existingHistory.slice(-days);
  } else {
    // Generate price history for coins without pre-built data
    const predictionDate = new Date(prediction.predictedAt);
    const now = new Date();
    const daysSincePrediction = Math.floor(
      (now.getTime() - predictionDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const predictionDayOffset = Math.max(0, days - daysSincePrediction);

    priceHistory = generatePriceHistory(
      prediction.coinSymbol,
      days,
      prediction.id,
      prediction.direction,
      prediction.status,
      predictionDayOffset
    );
  }

  /* ── Key price levels for the chart ── */
  const prices = priceHistory.map((p) => p.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const currentPrice = MOCK_PRICES[prediction.coinSymbol] ?? prices[prices.length - 1];

  /* ── Prediction markers on the chart ── */
  const markers = priceHistory
    .filter((p) => p.predictionMarker)
    .map((p) => ({
      date: p.date,
      price: p.price,
      ...p.predictionMarker!,
    }));

  /* ── Build reference lines ── */
  const referenceLines: {
    label: string;
    price: number;
    type: "prediction" | "target" | "current" | "resolution";
  }[] = [
    {
      label: "Price at prediction",
      price: prediction.priceAtPrediction,
      type: "prediction",
    },
    {
      label: "Current price",
      price: currentPrice,
      type: "current",
    },
  ];

  if (prediction.targetPrice !== null) {
    referenceLines.push({
      label: "Target price",
      price: prediction.targetPrice,
      type: "target",
    });
  }

  if (prediction.priceAtResolution !== null) {
    referenceLines.push({
      label: "Price at resolution",
      price: prediction.priceAtResolution,
      type: "resolution",
    });
  }

  /* ── Summary stats ── */
  const priceAtStart = prices[0];
  const priceAtEnd = prices[prices.length - 1];
  const periodChangePercent =
    priceAtStart > 0
      ? Math.round(((priceAtEnd - priceAtStart) / priceAtStart) * 1000) / 10
      : 0;

  const predictionChangePercent =
    prediction.priceAtPrediction > 0
      ? Math.round(
          ((currentPrice - prediction.priceAtPrediction) /
            prediction.priceAtPrediction) *
            1000
        ) / 10
      : 0;

  return NextResponse.json({
    predictionId: prediction.id,
    coinSymbol: prediction.coinSymbol,
    range: rangeParam,
    days,
    priceHistory,
    markers,
    referenceLines,
    stats: {
      minPrice,
      maxPrice,
      currentPrice,
      priceAtPrediction: prediction.priceAtPrediction,
      targetPrice: prediction.targetPrice,
      priceAtResolution: prediction.priceAtResolution,
      periodChangePercent,
      predictionChangePercent,
    },
  });
}
