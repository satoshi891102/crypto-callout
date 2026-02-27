import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { MOCK_USERS, type UserProfile } from "@/data/mock-users";

/* ── Validation ── */

const googleAuthSchema = z.object({
  credential: z.string().min(1, "Google credential is required"),
  clientId: z.string().optional(),
});

/* ── Mock Google profile resolver ── */

interface GoogleProfile {
  sub: string;
  email: string;
  name: string;
  picture: string;
  email_verified: boolean;
}

function resolveGoogleProfile(credential: string): GoogleProfile | null {
  /* In demo mode, derive a profile from any credential that starts with "mock-google-token-" */
  if (!credential.startsWith("mock-google-token-")) return null;

  const handle = credential.replace("mock-google-token-", "");
  const user = MOCK_USERS.find(
    (u) => u.username.toLowerCase() === handle.toLowerCase()
  );

  if (user) {
    return {
      sub: `google-${user.id}`,
      email: user.email,
      name: user.username,
      picture: user.avatarUrl,
      email_verified: true,
    };
  }

  /* Fallback: generate a profile for unknown handles */
  return {
    sub: `google-new-${Date.now()}`,
    email: `${handle}@gmail.com`,
    name: handle.charAt(0).toUpperCase() + handle.slice(1),
    picture: "/avatars/default.jpg",
    email_verified: true,
  };
}

/* ── POST /api/auth/google ── */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = googleAuthSchema.safeParse(body);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      return NextResponse.json(
        { error: "Validation failed", fields: errors },
        { status: 400 }
      );
    }

    const { credential } = result.data;

    /* ── Decode Google credential (mock) ── */
    const profile = resolveGoogleProfile(credential);

    if (!profile) {
      return NextResponse.json(
        { error: "Invalid or expired Google credential" },
        { status: 401 }
      );
    }

    if (!profile.email_verified) {
      return NextResponse.json(
        { error: "Google email is not verified" },
        { status: 403 }
      );
    }

    /* ── Check for existing user by email ── */
    const existingUser: UserProfile | undefined = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === profile.email.toLowerCase()
    );

    const now = new Date().toISOString();

    if (existingUser) {
      /* ── Existing user: sign in ── */
      const token = `cco_${existingUser.id}_g_${Date.now().toString(36)}`;

      return NextResponse.json({
        user: {
          id: existingUser.id,
          username: existingUser.username,
          email: existingUser.email,
          role: existingUser.role,
          avatarUrl: existingUser.avatarUrl,
          joinedAt: existingUser.joinedAt,
        },
        token,
        expiresAt: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
        isNewUser: false,
        message: "Signed in with Google",
      });
    }

    /* ── New user: create account ── */
    const username = profile.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "_")
      .slice(0, 30);

    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      username,
      email: profile.email,
      role: "viewer",
      avatarUrl: profile.picture,
      submissionCount: 0,
      approvedSubmissions: 0,
      joinedAt: now,
      lastLoginAt: now,
      favoriteInfluencerIds: [],
      watchedCoins: [],
    };

    const token = `cco_${newUser.id}_g_${Date.now().toString(36)}`;

    return NextResponse.json(
      {
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
          avatarUrl: newUser.avatarUrl,
          joinedAt: newUser.joinedAt,
        },
        token,
        expiresAt: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
        isNewUser: true,
        message: "Account created with Google",
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
