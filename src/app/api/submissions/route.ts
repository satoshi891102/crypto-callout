import { NextRequest, NextResponse } from "next/server";
import { MOCK_CURRENT_USER } from "@/data/mock-users";
import {
  MOCK_COMMUNITY_SUBMISSIONS,
  MOCK_PREDICTIONS,
} from "@/data/mock-predictions";
import { MOCK_INFLUENCERS } from "@/data/mock-influencers";
import { MOCK_COINS } from "@/data/mock-coins";
import type {
  Platform,
  PredictionDirection,
  PredictionTimeframe,
  SubmissionStatus,
  CommunitySubmission,
} from "@/types";

/* ── Validation constants ── */

const VALID_PLATFORMS: Platform[] = ["twitter", "youtube", "tiktok", "telegram"];

const VALID_DIRECTIONS: PredictionDirection[] = ["bullish", "bearish"];

const VALID_TIMEFRAMES: PredictionTimeframe[] = [
  "24h",
  "1w",
  "1m",
  "3m",
  "6m",
  "1y",
  "custom",
];

const VALID_STATUSES: SubmissionStatus[] = [
  "pending_review",
  "approved",
  "rejected",
];

const URL_REGEX = /^https?:\/\/.+/;

/* ── GET /api/submissions — Browse all community submissions ── */

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  let submissions: CommunitySubmission[] = [...MOCK_COMMUNITY_SUBMISSIONS];

  /* ── Filter by status ── */
  const statusParam = searchParams.get("status");
  if (
    statusParam &&
    VALID_STATUSES.includes(statusParam as SubmissionStatus)
  ) {
    submissions = submissions.filter((s) => s.status === statusParam);
  }

  /* ── Filter by platform ── */
  const platformParam = searchParams.get("platform");
  if (
    platformParam &&
    VALID_PLATFORMS.includes(platformParam as Platform)
  ) {
    submissions = submissions.filter((s) => s.platform === platformParam);
  }

  /* ── Filter by coin symbol ── */
  const coinParam = searchParams.get("coin");
  if (coinParam) {
    submissions = submissions.filter(
      (s) => s.coinSymbol.toLowerCase() === coinParam.toLowerCase()
    );
  }

  /* ── Filter by direction ── */
  const directionParam = searchParams.get("direction");
  if (
    directionParam &&
    VALID_DIRECTIONS.includes(directionParam as PredictionDirection)
  ) {
    submissions = submissions.filter((s) => s.direction === directionParam);
  }

  /* ── Search by influencer handle ── */
  const handleParam = searchParams.get("handle");
  if (handleParam) {
    const normalised = handleParam.toLowerCase().replace(/^@/, "");
    submissions = submissions.filter((s) =>
      s.influencerHandle.toLowerCase().replace(/^@/, "").includes(normalised)
    );
  }

  /* ── Sort ── */
  const sortBy = searchParams.get("sortBy") ?? "submittedAt";
  const order = searchParams.get("order") === "asc" ? 1 : -1;

  submissions.sort((a, b) => {
    switch (sortBy) {
      case "status":
        return a.status.localeCompare(b.status) * order;
      case "coin":
        return a.coinSymbol.localeCompare(b.coinSymbol) * order;
      case "platform":
        return a.platform.localeCompare(b.platform) * order;
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

  /* ── Enrich each submission with linked prediction + influencer match ── */
  const enriched = entries.map((sub) => {
    const linkedPrediction =
      sub.status === "approved"
        ? MOCK_PREDICTIONS.find((p) => p.sourceUrl === sub.sourceUrl) ?? null
        : null;

    const matchedInfluencer = MOCK_INFLUENCERS.find(
      (inf) =>
        inf.handle.toLowerCase() === sub.influencerHandle.toLowerCase()
    );

    return {
      ...sub,
      linkedPrediction: linkedPrediction
        ? {
            id: linkedPrediction.id,
            status: linkedPrediction.status,
            coin: linkedPrediction.coin,
            coinSymbol: linkedPrediction.coinSymbol,
            direction: linkedPrediction.direction,
            priceAtPrediction: linkedPrediction.priceAtPrediction,
            targetPrice: linkedPrediction.targetPrice,
          }
        : null,
      influencer: matchedInfluencer
        ? {
            id: matchedInfluencer.id,
            name: matchedInfluencer.name,
            avatarUrl: matchedInfluencer.avatarUrl,
            accuracyScore: matchedInfluencer.accuracyScore,
            rank: matchedInfluencer.rank,
          }
        : null,
    };
  });

  /* ── Aggregate stats ── */
  const allSubmissions = MOCK_COMMUNITY_SUBMISSIONS;
  const stats = {
    total: allSubmissions.length,
    approved: allSubmissions.filter((s) => s.status === "approved").length,
    pending: allSubmissions.filter((s) => s.status === "pending_review").length,
    rejected: allSubmissions.filter((s) => s.status === "rejected").length,
    uniqueContributors: new Set(allSubmissions.map((s) => s.submittedBy)).size,
    topCoins: Object.entries(
      allSubmissions.reduce<Record<string, number>>((acc, s) => {
        acc[s.coinSymbol] = (acc[s.coinSymbol] ?? 0) + 1;
        return acc;
      }, {})
    )
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([symbol, count]) => ({ symbol, count })),
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

/* ── POST /api/submissions — Submit a new community prediction ── */

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
  const requiredFields = [
    "influencerHandle",
    "platform",
    "sourceUrl",
    "sourceText",
    "coin",
    "coinSymbol",
    "direction",
    "timeframe",
  ] as const;

  const errors: string[] = [];

  for (const field of requiredFields) {
    if (!body[field] || typeof body[field] !== "string") {
      errors.push(`Missing or invalid required field: ${field}`);
    }
  }

  if (errors.length > 0) {
    return NextResponse.json(
      { error: "Validation failed", details: errors },
      { status: 400 }
    );
  }

  /* ── Field-specific validation ── */
  const platform = body.platform as string;
  if (!VALID_PLATFORMS.includes(platform as Platform)) {
    errors.push(
      `Invalid platform: ${platform}. Must be one of: ${VALID_PLATFORMS.join(", ")}`
    );
  }

  const direction = body.direction as string;
  if (!VALID_DIRECTIONS.includes(direction as PredictionDirection)) {
    errors.push(
      `Invalid direction: ${direction}. Must be one of: ${VALID_DIRECTIONS.join(", ")}`
    );
  }

  const timeframe = body.timeframe as string;
  if (!VALID_TIMEFRAMES.includes(timeframe as PredictionTimeframe)) {
    errors.push(
      `Invalid timeframe: ${timeframe}. Must be one of: ${VALID_TIMEFRAMES.join(", ")}`
    );
  }

  const sourceUrl = body.sourceUrl as string;
  if (!URL_REGEX.test(sourceUrl)) {
    errors.push("sourceUrl must be a valid URL starting with http:// or https://");
  }

  const coinSymbol = body.coinSymbol as string;
  const validCoin = MOCK_COINS.find(
    (c) => c.symbol.toLowerCase() === coinSymbol.toLowerCase()
  );
  if (!validCoin) {
    errors.push(
      `Unknown coin symbol: ${coinSymbol}. Supported: ${MOCK_COINS.map((c) => c.symbol).join(", ")}`
    );
  }

  if (
    body.targetPrice !== undefined &&
    body.targetPrice !== null &&
    (typeof body.targetPrice !== "number" || body.targetPrice <= 0)
  ) {
    errors.push("targetPrice must be a positive number if provided");
  }

  const sourceText = body.sourceText as string;
  if (sourceText && sourceText.length < 10) {
    errors.push("sourceText must be at least 10 characters");
  }

  if (sourceText && sourceText.length > 1000) {
    errors.push("sourceText must not exceed 1000 characters");
  }

  if (errors.length > 0) {
    return NextResponse.json(
      { error: "Validation failed", details: errors },
      { status: 400 }
    );
  }

  /* ── Check for duplicate submissions ── */
  const duplicate = MOCK_COMMUNITY_SUBMISSIONS.find(
    (s) => s.sourceUrl === sourceUrl && s.status !== "rejected"
  );

  if (duplicate) {
    return NextResponse.json(
      {
        error: "Duplicate submission",
        message: "A submission with this source URL already exists",
        existingSubmission: {
          id: duplicate.id,
          status: duplicate.status,
          submittedAt: duplicate.submittedAt,
        },
      },
      { status: 409 }
    );
  }

  /* ── Build the new submission ── */
  const newSubmission: CommunitySubmission = {
    id: `sub-${Date.now()}`,
    submittedBy: user.id,
    influencerHandle: body.influencerHandle as string,
    platform: platform as Platform,
    sourceUrl,
    sourceText,
    coin: validCoin ? validCoin.name : (body.coin as string),
    coinSymbol: validCoin ? validCoin.symbol : coinSymbol,
    direction: direction as PredictionDirection,
    targetPrice:
      typeof body.targetPrice === "number" ? body.targetPrice : null,
    timeframe: timeframe as PredictionTimeframe,
    status: "pending_review",
    submittedAt: new Date().toISOString(),
    reviewedAt: null,
  };

  /* ── Check for matching influencer ── */
  const handle = newSubmission.influencerHandle;
  const matchedInfluencer = MOCK_INFLUENCERS.find(
    (inf) => inf.handle.toLowerCase() === handle.toLowerCase()
  );

  return NextResponse.json(
    {
      submission: newSubmission,
      message: "Prediction submitted successfully and is pending review",
      influencer: matchedInfluencer
        ? {
            id: matchedInfluencer.id,
            name: matchedInfluencer.name,
            accuracyScore: matchedInfluencer.accuracyScore,
            isTracked: true,
          }
        : {
            isTracked: false,
            note: "This influencer is not yet tracked. They will be added upon approval.",
          },
    },
    { status: 201 }
  );
}
