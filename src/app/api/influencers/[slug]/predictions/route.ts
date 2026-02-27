import { NextRequest, NextResponse } from "next/server";
import { MOCK_INFLUENCERS } from "@/data/mock-influencers";
import { MOCK_PREDICTIONS } from "@/data/mock-predictions";
import type { PredictionDirection, PredictionStatus, TimeRange } from "@/types";

/** Derive a URL-safe slug from a handle: "@CryptoVault" → "cryptovault" */
function handleToSlug(handle: string): string {
  return handle.replace(/^@/, "").toLowerCase();
}

function findBySlug(slug: string) {
  return MOCK_INFLUENCERS.find(
    (inf) => handleToSlug(inf.handle) === slug.toLowerCase()
  );
}

const VALID_STATUSES: PredictionStatus[] = ["correct", "incorrect", "pending"];
const VALID_DIRECTIONS: PredictionDirection[] = ["bullish", "bearish"];
const VALID_TIME_RANGES: TimeRange[] = ["7d", "30d", "90d", "1y", "all"];

function getTimeRangeCutoff(range: TimeRange): Date | null {
  if (range === "all") return null;
  const now = new Date();
  const days: Record<Exclude<TimeRange, "all">, number> = {
    "7d": 7,
    "30d": 30,
    "90d": 90,
    "1y": 365,
  };
  now.setDate(now.getDate() - days[range]);
  return now;
}

export async function GET(
  request: NextRequest,
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

  let predictions = MOCK_PREDICTIONS.filter(
    (p) => p.influencerId === influencer.id
  );

  const { searchParams } = request.nextUrl;

  /* ── Filter by status ── */
  const statusParam = searchParams.get("status");
  if (statusParam && VALID_STATUSES.includes(statusParam as PredictionStatus)) {
    predictions = predictions.filter((p) => p.status === statusParam);
  }

  /* ── Filter by direction ── */
  const directionParam = searchParams.get("direction");
  if (
    directionParam &&
    VALID_DIRECTIONS.includes(directionParam as PredictionDirection)
  ) {
    predictions = predictions.filter((p) => p.direction === directionParam);
  }

  /* ── Filter by coin ── */
  const coinParam = searchParams.get("coin");
  if (coinParam) {
    predictions = predictions.filter(
      (p) => p.coinSymbol.toLowerCase() === coinParam.toLowerCase()
    );
  }

  /* ── Filter by time range ── */
  const timeRangeParam = searchParams.get("timeRange");
  const timeRange: TimeRange =
    timeRangeParam && VALID_TIME_RANGES.includes(timeRangeParam as TimeRange)
      ? (timeRangeParam as TimeRange)
      : "all";

  const cutoff = getTimeRangeCutoff(timeRange);
  if (cutoff) {
    predictions = predictions.filter(
      (p) => new Date(p.predictedAt) >= cutoff
    );
  }

  /* ── Sort (newest first by default) ── */
  const sortBy = searchParams.get("sortBy") === "oldest" ? "oldest" : "newest";
  predictions.sort((a, b) => {
    const diff =
      new Date(b.predictedAt).getTime() - new Date(a.predictedAt).getTime();
    return sortBy === "oldest" ? -diff : diff;
  });

  /* ── Pagination ── */
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const pageSize = Math.min(
    Math.max(1, Number(searchParams.get("pageSize")) || 20),
    100
  );

  const totalEntries = predictions.length;
  const totalPages = Math.ceil(totalEntries / pageSize);
  const startIdx = (page - 1) * pageSize;
  const entries = predictions.slice(startIdx, startIdx + pageSize);

  return NextResponse.json({
    influencerId: influencer.id,
    influencerName: influencer.name,
    predictions: entries,
    filters: {
      status: statusParam ?? "all",
      direction: directionParam ?? "all",
      coin: coinParam ?? null,
      timeRange,
    },
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
