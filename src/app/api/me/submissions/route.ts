import { NextRequest, NextResponse } from "next/server";
import { MOCK_CURRENT_USER } from "@/data/mock-users";
import {
  MOCK_COMMUNITY_SUBMISSIONS,
  MOCK_PREDICTIONS,
} from "@/data/mock-predictions";
import type { SubmissionStatus, CommunitySubmission } from "@/types";

const VALID_STATUSES: SubmissionStatus[] = [
  "pending_review",
  "approved",
  "rejected",
];

export async function GET(request: NextRequest) {
  const user = MOCK_CURRENT_USER;
  const { searchParams } = request.nextUrl;

  /* ── Filter user's submissions ── */
  let submissions: CommunitySubmission[] =
    MOCK_COMMUNITY_SUBMISSIONS.filter((s) => s.submittedBy === user.id);

  /* ── Filter by status ── */
  const statusParam = searchParams.get("status");
  if (
    statusParam &&
    VALID_STATUSES.includes(statusParam as SubmissionStatus)
  ) {
    submissions = submissions.filter((s) => s.status === statusParam);
  }

  /* ── Sort ── */
  const sortBy = searchParams.get("sortBy") ?? "submittedAt";
  const order = searchParams.get("order") === "asc" ? 1 : -1;

  submissions.sort((a, b) => {
    switch (sortBy) {
      case "status":
        return a.status.localeCompare(b.status) * order;
      case "submittedAt":
      default:
        return (
          (new Date(b.submittedAt).getTime() -
            new Date(a.submittedAt).getTime()) *
          order
        );
    }
  });

  /* ── Pagination ── */
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const pageSize = Math.min(
    Math.max(1, Number(searchParams.get("pageSize")) || 20),
    100
  );

  const totalEntries = submissions.length;
  const totalPages = Math.ceil(totalEntries / pageSize);
  const startIdx = (page - 1) * pageSize;
  const entries = submissions.slice(startIdx, startIdx + pageSize);

  /* ── Enrich with linked prediction (if approved) ── */
  const enriched = entries.map((sub) => {
    const linkedPrediction =
      sub.status === "approved"
        ? MOCK_PREDICTIONS.find(
            (p) =>
              p.submittedBy === user.id &&
              p.sourceUrl === sub.sourceUrl
          ) ?? null
        : null;

    return {
      ...sub,
      linkedPrediction: linkedPrediction
        ? {
            id: linkedPrediction.id,
            status: linkedPrediction.status,
            coin: linkedPrediction.coin,
            coinSymbol: linkedPrediction.coinSymbol,
            direction: linkedPrediction.direction,
          }
        : null,
    };
  });

  /* ── Aggregate stats ── */
  const allUserSubmissions = MOCK_COMMUNITY_SUBMISSIONS.filter(
    (s) => s.submittedBy === user.id
  );
  const stats = {
    total: allUserSubmissions.length,
    approved: allUserSubmissions.filter((s) => s.status === "approved").length,
    pending: allUserSubmissions.filter((s) => s.status === "pending_review")
      .length,
    rejected: allUserSubmissions.filter((s) => s.status === "rejected").length,
    approvalRate:
      allUserSubmissions.length > 0
        ? Math.round(
            (allUserSubmissions.filter((s) => s.status === "approved").length /
              allUserSubmissions.length) *
              1000
          ) / 10
        : 0,
  };

  return NextResponse.json({
    submissions: enriched,
    stats,
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

export async function POST(request: NextRequest) {
  const user = MOCK_CURRENT_USER;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  /* ── Validate required fields ── */
  const required = [
    "influencerHandle",
    "platform",
    "sourceUrl",
    "sourceText",
    "coin",
    "coinSymbol",
    "direction",
    "timeframe",
  ] as const;

  for (const field of required) {
    if (!body[field]) {
      return NextResponse.json(
        { error: `Missing required field: ${field}` },
        { status: 400 }
      );
    }
  }

  const newSubmission: CommunitySubmission = {
    id: `sub-${Date.now()}`,
    submittedBy: user.id,
    influencerHandle: body.influencerHandle as string,
    platform: body.platform as CommunitySubmission["platform"],
    sourceUrl: body.sourceUrl as string,
    sourceText: body.sourceText as string,
    coin: body.coin as string,
    coinSymbol: body.coinSymbol as string,
    direction: body.direction as CommunitySubmission["direction"],
    targetPrice:
      typeof body.targetPrice === "number" ? body.targetPrice : null,
    timeframe: body.timeframe as CommunitySubmission["timeframe"],
    status: "pending_review",
    submittedAt: new Date().toISOString(),
    reviewedAt: null,
  };

  return NextResponse.json(
    {
      submission: newSubmission,
      message: "Submission created successfully and is pending review",
    },
    { status: 201 }
  );
}
