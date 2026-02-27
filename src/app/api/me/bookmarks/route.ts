import { NextRequest, NextResponse } from "next/server";
import { MOCK_CURRENT_USER } from "@/data/mock-users";
import { MOCK_INFLUENCERS, getTier } from "@/data/mock-influencers";
import { MOCK_PREDICTIONS } from "@/data/mock-predictions";

export async function GET(request: NextRequest) {
  const user = MOCK_CURRENT_USER;
  const { searchParams } = request.nextUrl;

  /* ── Resolve bookmarked influencers ── */
  let bookmarked = MOCK_INFLUENCERS.filter((inf) =>
    user.favoriteInfluencerIds.includes(inf.id)
  );

  /* ── Optional search filter ── */
  const search = searchParams.get("search")?.toLowerCase();
  if (search) {
    bookmarked = bookmarked.filter(
      (inf) =>
        inf.name.toLowerCase().includes(search) ||
        inf.handle.toLowerCase().includes(search)
    );
  }

  /* ── Sort ── */
  const sortBy = searchParams.get("sortBy") ?? "rank";
  bookmarked.sort((a, b) => {
    switch (sortBy) {
      case "accuracy":
        return b.accuracyScore - a.accuracyScore;
      case "name":
        return a.name.localeCompare(b.name);
      case "rank":
      default:
        return a.rank - b.rank;
    }
  });

  /* ── Enrich with tier + recent prediction count ── */
  const enriched = bookmarked.map((inf) => {
    const predictions = MOCK_PREDICTIONS.filter(
      (p) => p.influencerId === inf.id
    );
    const pendingCount = predictions.filter(
      (p) => p.status === "pending"
    ).length;
    const tier = getTier(inf.accuracyScore);

    return {
      id: inf.id,
      name: inf.name,
      handle: inf.handle,
      platform: inf.platform,
      avatarUrl: inf.avatarUrl,
      bio: inf.bio,
      followerCount: inf.followerCount,
      accuracyScore: inf.accuracyScore,
      rank: inf.rank,
      streak: inf.streak,
      lastActiveAt: inf.lastActiveAt,
      tier: tier.tier,
      tierLabel: tier.label,
      tierColor: tier.color,
      totalPredictions: inf.totalPredictions,
      pendingPredictions: pendingCount,
    };
  });

  return NextResponse.json({
    bookmarks: enriched,
    total: enriched.length,
  });
}
