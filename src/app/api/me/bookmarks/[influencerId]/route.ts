import { NextRequest, NextResponse } from "next/server";
import { MOCK_CURRENT_USER } from "@/data/mock-users";
import { MOCK_INFLUENCERS, getTier } from "@/data/mock-influencers";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ influencerId: string }> }
) {
  const { influencerId } = await params;
  const user = MOCK_CURRENT_USER;

  const influencer = MOCK_INFLUENCERS.find((inf) => inf.id === influencerId);
  if (!influencer) {
    return NextResponse.json(
      { error: "Influencer not found" },
      { status: 404 }
    );
  }

  const isBookmarked = user.favoriteInfluencerIds.includes(influencerId);

  return NextResponse.json({
    influencerId,
    isBookmarked,
    influencer: {
      name: influencer.name,
      handle: influencer.handle,
      avatarUrl: influencer.avatarUrl,
      accuracyScore: influencer.accuracyScore,
    },
  });
}

export async function PUT(
  _request: NextRequest,
  { params }: { params: Promise<{ influencerId: string }> }
) {
  const { influencerId } = await params;

  const influencer = MOCK_INFLUENCERS.find((inf) => inf.id === influencerId);
  if (!influencer) {
    return NextResponse.json(
      { error: "Influencer not found" },
      { status: 404 }
    );
  }

  const user = MOCK_CURRENT_USER;
  const alreadyBookmarked = user.favoriteInfluencerIds.includes(influencerId);

  if (!alreadyBookmarked) {
    user.favoriteInfluencerIds.push(influencerId);
  }

  const tier = getTier(influencer.accuracyScore);

  return NextResponse.json({
    influencerId,
    isBookmarked: true,
    influencer: {
      name: influencer.name,
      handle: influencer.handle,
      avatarUrl: influencer.avatarUrl,
      accuracyScore: influencer.accuracyScore,
      tier: tier.tier,
    },
    message: alreadyBookmarked
      ? "Already bookmarked"
      : "Influencer bookmarked successfully",
  });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ influencerId: string }> }
) {
  const { influencerId } = await params;

  const influencer = MOCK_INFLUENCERS.find((inf) => inf.id === influencerId);
  if (!influencer) {
    return NextResponse.json(
      { error: "Influencer not found" },
      { status: 404 }
    );
  }

  const user = MOCK_CURRENT_USER;
  const idx = user.favoriteInfluencerIds.indexOf(influencerId);

  if (idx !== -1) {
    user.favoriteInfluencerIds.splice(idx, 1);
  }

  return NextResponse.json({
    influencerId,
    isBookmarked: false,
    message:
      idx !== -1
        ? "Bookmark removed successfully"
        : "Influencer was not bookmarked",
  });
}
