import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_COINS,
  MOCK_PRICES,
  MOCK_PRICE_CHANGES_24H,
  MOCK_PRICE_HISTORIES,
  getCoinBySymbol,
} from "@/data/mock-coins";
import { MOCK_PREDICTIONS } from "@/data/mock-predictions";

/* ── Types ── */

interface CoinWithStats {
  symbol: string;
  name: string;
  icon: string;
  price: number;
  change24h: number;
  totalPredictions: number;
  correctPredictions: number;
  pendingPredictions: number;
  bullishPercent: number;
  hasPriceHistory: boolean;
}

const VALID_SORT_FIELDS = [
  "name",
  "price",
  "change24h",
  "predictions",
] as const;
type SortField = (typeof VALID_SORT_FIELDS)[number];

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  /* ── Single coin lookup ── */
  const symbol = searchParams.get("symbol")?.toUpperCase();
  if (symbol) {
    const coin = getCoinBySymbol(symbol);
    if (!coin) {
      return NextResponse.json({ error: "Coin not found" }, { status: 404 });
    }

    const predictions = MOCK_PREDICTIONS.filter(
      (p) => p.coinSymbol === symbol
    );
    const correct = predictions.filter((p) => p.status === "correct").length;
    const pending = predictions.filter((p) => p.status === "pending").length;
    const bullish = predictions.filter(
      (p) => p.direction === "bullish"
    ).length;

    return NextResponse.json({
      coin: {
        ...coin,
        price: MOCK_PRICES[symbol] ?? 0,
        change24h: MOCK_PRICE_CHANGES_24H[symbol] ?? 0,
        totalPredictions: predictions.length,
        correctPredictions: correct,
        pendingPredictions: pending,
        bullishPercent:
          predictions.length > 0
            ? Math.round((bullish / predictions.length) * 100)
            : 0,
        hasPriceHistory: symbol in MOCK_PRICE_HISTORIES,
      },
      predictions: predictions
        .sort(
          (a, b) =>
            new Date(b.predictedAt).getTime() -
            new Date(a.predictedAt).getTime()
        )
        .slice(0, 20),
      priceHistory: MOCK_PRICE_HISTORIES[symbol] ?? null,
    });
  }

  /* ── List all coins ── */
  const search = searchParams.get("search")?.toLowerCase();

  let coins: CoinWithStats[] = MOCK_COINS.map((coin) => {
    const predictions = MOCK_PREDICTIONS.filter(
      (p) => p.coinSymbol === coin.symbol
    );
    const correct = predictions.filter((p) => p.status === "correct").length;
    const pending = predictions.filter((p) => p.status === "pending").length;
    const bullish = predictions.filter(
      (p) => p.direction === "bullish"
    ).length;

    return {
      symbol: coin.symbol,
      name: coin.name,
      icon: coin.icon,
      price: MOCK_PRICES[coin.symbol] ?? 0,
      change24h: MOCK_PRICE_CHANGES_24H[coin.symbol] ?? 0,
      totalPredictions: predictions.length,
      correctPredictions: correct,
      pendingPredictions: pending,
      bullishPercent:
        predictions.length > 0
          ? Math.round((bullish / predictions.length) * 100)
          : 0,
      hasPriceHistory: coin.symbol in MOCK_PRICE_HISTORIES,
    };
  });

  /* ── Filter by search ── */
  if (search) {
    coins = coins.filter(
      (c) =>
        c.name.toLowerCase().includes(search) ||
        c.symbol.toLowerCase().includes(search)
    );
  }

  /* ── Sort ── */
  const sortParam = searchParams.get("sortBy");
  const sortBy: SortField =
    sortParam && (VALID_SORT_FIELDS as readonly string[]).includes(sortParam)
      ? (sortParam as SortField)
      : "predictions";

  const order = searchParams.get("order") === "asc" ? 1 : -1;

  coins.sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name) * order;
      case "price":
        return (a.price - b.price) * order;
      case "change24h":
        return (a.change24h - b.change24h) * order;
      case "predictions":
      default:
        return (a.totalPredictions - b.totalPredictions) * order;
    }
  });

  /* ── Pagination ── */
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const pageSize = Math.min(
    Math.max(1, Number(searchParams.get("pageSize")) || 20),
    100
  );

  const totalEntries = coins.length;
  const totalPages = Math.ceil(totalEntries / pageSize);
  const startIdx = (page - 1) * pageSize;
  const entries = coins.slice(startIdx, startIdx + pageSize);

  return NextResponse.json({
    coins: entries,
    pagination: {
      page,
      pageSize,
      totalEntries,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  });
}
