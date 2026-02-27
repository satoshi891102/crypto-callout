import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { MOCK_USERS, type UserProfile } from "@/data/mock-users";

/* ── Validation ── */

const signinSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

/* ── Demo credentials: accept any non-empty password for known demo users ── */

const DEMO_EMAILS = new Set(
  MOCK_USERS.map((u) => u.email.toLowerCase())
);

/* ── POST /api/auth/signin ── */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = signinSchema.safeParse(body);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      return NextResponse.json(
        { error: "Validation failed", fields: errors },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    /* ── Find user by email (mock) ── */
    const user: UserProfile | undefined = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    /* ── Verify password (mock — accept any non-empty password for demo users) ── */
    if (!DEMO_EMAILS.has(user.email.toLowerCase())) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    /* ── Generate mock session token ── */
    const token = `cco_${user.id}_${Date.now().toString(36)}`;

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        joinedAt: user.joinedAt,
      },
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      message: "Signed in successfully",
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
