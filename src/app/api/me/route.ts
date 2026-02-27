import { NextResponse } from "next/server";
import {
  MOCK_CURRENT_USER,
  DEFAULT_NOTIFICATION_PREFS,
} from "@/data/mock-users";
import { MOCK_INFLUENCERS } from "@/data/mock-influencers";
import {
  MOCK_PREDICTIONS,
  MOCK_COMMUNITY_SUBMISSIONS,
} from "@/data/mock-predictions";

export async function GET() {
  const user = MOCK_CURRENT_USER;

  /* ── Bookmarked influencers (summary) ── */
  const bookmarkedInfluencers = MOCK_INFLUENCERS.filter((inf) =>
    user.favoriteInfluencerIds.includes(inf.id)
  ).map((inf) => ({
    id: inf.id,
    name: inf.name,
    handle: inf.handle,
    platform: inf.platform,
    avatarUrl: inf.avatarUrl,
    accuracyScore: inf.accuracyScore,
    rank: inf.rank,
  }));

  /* ── Submission stats ── */
  const submissions = MOCK_COMMUNITY_SUBMISSIONS.filter(
    (s) => s.submittedBy === user.id
  );
  const submissionStats = {
    total: submissions.length,
    approved: submissions.filter((s) => s.status === "approved").length,
    pending: submissions.filter((s) => s.status === "pending_review").length,
    rejected: submissions.filter((s) => s.status === "rejected").length,
  };

  /* ── Predictions the user submitted ── */
  const submittedPredictions = MOCK_PREDICTIONS.filter(
    (p) => p.submittedBy === user.id
  );

  return NextResponse.json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      joinedAt: user.joinedAt,
      lastLoginAt: user.lastLoginAt,
      watchedCoins: user.watchedCoins,
    },
    bookmarkedInfluencers,
    submissionStats,
    submittedPredictionsCount: submittedPredictions.length,
    notifications: DEFAULT_NOTIFICATION_PREFS,
  });
}
