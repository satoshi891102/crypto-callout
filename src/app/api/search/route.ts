import { NextRequest, NextResponse } from "next/server";
import { MOCK_INFLUENCERS } from "@/data/mock-influencers";
import { MOCK_PREDICTIONS } from "@/data/mock-predictions";
import { MOCK_COINS, MOCK_PRICES, MOCK_PRICE_CHANGES_24H } from "@/data/mock-coins";
import { NAV_ITEMS } from "@/lib/constants";
import type {
  SearchResultInfluencer,
  SearchResultPrediction,
  SearchResultCoin,
  SearchResultPage,
  SearchResult,
  SearchResponse,
} from "@/types";

/* ── Helpers ── */

function matchScore(text: string, query: string): number {
  const lower = text.toLowerCase();
  const q = query.toLowerCase();

  if (lower === q) return 100;
  if (lower.startsWith(q)) return 80;
  if (lower.includes(q)) return 60;

  // Check each word
  const words = lower.split(/\s+/);
  for (const word of words) {
    if (word.startsWith(q)) return 70;
  }

  return 0;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const rawQuery = searchParams.get("q")?.trim() ?? "";
  const limit = Math.min(Math.max(1, Number(searchParams.get("limit")) || 20), 50);
  const category = searchParams.get("category"); // "all" | "influencers" | "coins" | "predictions" | "pages"

  if (!rawQuery || rawQuery.length > 100) {
    return NextResponse.json({
      query: rawQuery,
      results: [],
      grouped: { pages: [], influencers: [], coins: [], predictions: [] },
      totalResults: 0,
    } satisfies SearchResponse);
  }

  const query = rawQuery.toLowerCase();

  /* ── Search Pages ── */
  const pageResults: SearchResultPage[] = [];
  if (!category || category === "all" || category === "pages") {
    for (const item of NAV_ITEMS) {
      const score = matchScore(item.label, query);
      if (score > 0) {
        pageResults.push({
          type: "page",
          label: item.label,
          href: item.href,
          icon: item.icon,
        });
      }
    }
  }

  /* ── Search Influencers ── */
  const influencerResults: SearchResultInfluencer[] = [];
  if (!category || category === "all" || category === "influencers") {
    const scored = MOCK_INFLUENCERS.map((inf) => {
      const nameScore = matchScore(inf.name, query);
      const handleScore = matchScore(inf.handle.replace("@", ""), query);
      const bioScore = matchScore(inf.bio, query) * 0.3;
      return {
        inf,
        score: Math.max(nameScore, handleScore, bioScore),
      };
    })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score || a.inf.rank - b.inf.rank);

    for (const { inf } of scored.slice(0, limit)) {
      influencerResults.push({
        type: "influencer",
        id: inf.id,
        name: inf.name,
        handle: inf.handle,
        platform: inf.platform,
        accuracyScore: inf.accuracyScore,
        rank: inf.rank,
        followerCount: inf.followerCount,
        href: `/influencers/${inf.id}`,
      });
    }
  }

  /* ── Search Coins ── */
  const coinResults: SearchResultCoin[] = [];
  if (!category || category === "all" || category === "coins") {
    const scored = MOCK_COINS.map((coin) => {
      const nameScore = matchScore(coin.name, query);
      const symbolScore = matchScore(coin.symbol, query);
      return {
        coin,
        score: Math.max(nameScore, symbolScore),
      };
    })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score);

    for (const { coin } of scored.slice(0, limit)) {
      coinResults.push({
        type: "coin",
        symbol: coin.symbol,
        name: coin.name,
        icon: coin.icon,
        price: MOCK_PRICES[coin.symbol] ?? null,
        change24h: MOCK_PRICE_CHANGES_24H[coin.symbol] ?? null,
        href: `/predictions?coin=${coin.symbol}`,
      });
    }
  }

  /* ── Search Predictions ── */
  const predictionResults: SearchResultPrediction[] = [];
  if (!category || category === "all" || category === "predictions") {
    const scored = MOCK_PREDICTIONS.map((pred) => {
      const coinScore = matchScore(pred.coin, query);
      const symbolScore = matchScore(pred.coinSymbol, query);
      const nameScore = matchScore(pred.influencerName, query);
      const handleScore = matchScore(
        pred.influencerHandle.replace("@", ""),
        query
      );
      const textScore = matchScore(pred.sourceText, query) * 0.4;
      return {
        pred,
        score: Math.max(coinScore, symbolScore, nameScore, handleScore, textScore),
      };
    })
      .filter((entry) => entry.score > 0)
      .sort(
        (a, b) =>
          b.score - a.score ||
          new Date(b.pred.predictedAt).getTime() -
            new Date(a.pred.predictedAt).getTime()
      );

    for (const { pred } of scored.slice(0, limit)) {
      predictionResults.push({
        type: "prediction",
        id: pred.id,
        influencerName: pred.influencerName,
        influencerHandle: pred.influencerHandle,
        coin: pred.coin,
        coinSymbol: pred.coinSymbol,
        direction: pred.direction,
        status: pred.status,
        sourceText:
          pred.sourceText.length > 120
            ? pred.sourceText.slice(0, 120) + "..."
            : pred.sourceText,
        href: `/predictions/${pred.id}`,
      });
    }
  }

  /* ── Combine ── */
  const allResults: SearchResult[] = [
    ...pageResults,
    ...influencerResults,
    ...coinResults,
    ...predictionResults,
  ].slice(0, limit);

  const response: SearchResponse = {
    query: rawQuery,
    results: allResults,
    grouped: {
      pages: pageResults,
      influencers: influencerResults,
      coins: coinResults,
      predictions: predictionResults,
    },
    totalResults:
      pageResults.length +
      influencerResults.length +
      coinResults.length +
      predictionResults.length,
  };

  return NextResponse.json(response);
}
