import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_LEADERBOARD,
  DEFAULT_LEADERBOARD_FILTERS,
  filterLeaderboard,
  getTopPerformers,
  getHottestStreaks,
  getBiggestGainers,
} from "@/data/mock-leaderboard";
import type { LeaderboardSortField, TimeRange } from "@/types";

const VALID_SORT_FIELDS: LeaderboardSortField[] = [
  "accuracy",
  "totalPredictions",
  "streak",
  "avgReturn",
];

const VALID_TIME_RANGES: TimeRange[] = ["7d", "30d", "90d", "1y", "all"];

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  /* ── Special view shortcuts ── */
  const view = searchParams.get("view");

  if (view === "top") {
    const limit = Math.min(Number(searchParams.get("limit")) || 5, 50);
    return NextResponse.json({ entries: getTopPerformers(limit) });
  }

  if (view === "streaks") {
    const limit = Math.min(Number(searchParams.get("limit")) || 5, 50);
    return NextResponse.json({ entries: getHottestStreaks(limit) });
  }

  if (view === "gainers") {
    const limit = Math.min(Number(searchParams.get("limit")) || 5, 50);
    return NextResponse.json({ entries: getBiggestGainers(limit) });
  }

  /* ── Parse filter params with defaults ── */
  const sortByParam = searchParams.get("sortBy");
  const sortBy: LeaderboardSortField =
    sortByParam && VALID_SORT_FIELDS.includes(sortByParam as LeaderboardSortField)
      ? (sortByParam as LeaderboardSortField)
      : DEFAULT_LEADERBOARD_FILTERS.sortBy;

  const timeRangeParam = searchParams.get("timeRange");
  const timeRange: TimeRange =
    timeRangeParam && VALID_TIME_RANGES.includes(timeRangeParam as TimeRange)
      ? (timeRangeParam as TimeRange)
      : DEFAULT_LEADERBOARD_FILTERS.timeRange;

  const minPredictionsParam = searchParams.get("minPredictions");
  const minPredictions =
    minPredictionsParam !== null
      ? Math.max(0, Number(minPredictionsParam))
      : DEFAULT_LEADERBOARD_FILTERS.minPredictions;

  /* ── Pagination ── */
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const pageSize = Math.min(Math.max(1, Number(searchParams.get("pageSize")) || 20), 100);

  /* ── Apply filters ── */
  const filtered = filterLeaderboard(MOCK_LEADERBOARD, {
    sortBy,
    timeRange,
    minPredictions,
  });

  /* ── Paginate ── */
  const totalEntries = filtered.length;
  const totalPages = Math.ceil(totalEntries / pageSize);
  const startIdx = (page - 1) * pageSize;
  const entries = filtered.slice(startIdx, startIdx + pageSize);

  return NextResponse.json({
    entries,
    filters: { sortBy, timeRange, minPredictions },
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
