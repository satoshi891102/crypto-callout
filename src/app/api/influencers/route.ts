import { NextRequest, NextResponse } from "next/server";
import { MOCK_INFLUENCERS } from "@/data/mock-influencers";
import type { Platform } from "@/types";

const VALID_PLATFORMS: Platform[] = ["twitter", "youtube", "tiktok", "telegram"];
const VALID_SORT_FIELDS = ["accuracy", "rank", "followers", "predictions", "streak"] as const;
type SortField = (typeof VALID_SORT_FIELDS)[number];

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  let results = [...MOCK_INFLUENCERS];

  /* ── Filter by platform ── */
  const platformParam = searchParams.get("platform");
  if (platformParam && VALID_PLATFORMS.includes(platformParam as Platform)) {
    results = results.filter((inf) => inf.platform === platformParam);
  }

  /* ── Search by name or handle ── */
  const search = searchParams.get("search")?.toLowerCase();
  if (search) {
    results = results.filter(
      (inf) =>
        inf.name.toLowerCase().includes(search) ||
        inf.handle.toLowerCase().includes(search)
    );
  }

  /* ── Sort ── */
  const sortParam = searchParams.get("sortBy");
  const sortBy: SortField =
    sortParam && (VALID_SORT_FIELDS as readonly string[]).includes(sortParam)
      ? (sortParam as SortField)
      : "rank";

  const order = searchParams.get("order") === "desc" ? -1 : 1;

  results.sort((a, b) => {
    switch (sortBy) {
      case "accuracy":
        return (a.accuracyScore - b.accuracyScore) * order;
      case "followers":
        return (a.followerCount - b.followerCount) * order;
      case "predictions":
        return (a.totalPredictions - b.totalPredictions) * order;
      case "streak":
        return (a.streak - b.streak) * order;
      case "rank":
      default:
        return (a.rank - b.rank) * order;
    }
  });

  /* ── Pagination ── */
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const pageSize = Math.min(
    Math.max(1, Number(searchParams.get("pageSize")) || 20),
    100
  );

  const totalEntries = results.length;
  const totalPages = Math.ceil(totalEntries / pageSize);
  const startIdx = (page - 1) * pageSize;
  const entries = results.slice(startIdx, startIdx + pageSize);

  return NextResponse.json({
    influencers: entries,
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
