import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { MOCK_USERS, type UserProfile } from "@/data/mock-users";

/* ── Validation ── */

const signupSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be 30 characters or less")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be 128 characters or less")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

/* ── POST /api/auth/signup ── */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = signupSchema.safeParse(body);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      return NextResponse.json(
        { error: "Validation failed", fields: errors },
        { status: 400 }
      );
    }

    const { username, email } = result.data;

    /* ── Check for existing users (mock) ── */
    const existingEmail = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (existingEmail) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const existingUsername = MOCK_USERS.find(
      (u) => u.username.toLowerCase() === username.toLowerCase()
    );
    if (existingUsername) {
      return NextResponse.json(
        { error: "This username is already taken" },
        { status: 409 }
      );
    }

    /* ── Create new user (mock) ── */
    const now = new Date().toISOString();
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      username,
      email,
      role: "viewer",
      avatarUrl: `/avatars/default.jpg`,
      submissionCount: 0,
      approvedSubmissions: 0,
      joinedAt: now,
      lastLoginAt: now,
      favoriteInfluencerIds: [],
      watchedCoins: [],
    };

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
        message: "Account created successfully",
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
