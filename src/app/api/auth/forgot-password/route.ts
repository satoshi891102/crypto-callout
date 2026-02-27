import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { MOCK_USERS } from "@/data/mock-users";

/* ── Validation ── */

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

/* ── Mock reset tokens store ── */

export interface PasswordResetToken {
  token: string;
  email: string;
  expiresAt: string;
  used: boolean;
}

export const MOCK_RESET_TOKENS: PasswordResetToken[] = [];

/* ── POST /api/auth/forgot-password ── */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = forgotPasswordSchema.safeParse(body);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      return NextResponse.json(
        { error: "Validation failed", fields: errors },
        { status: 400 }
      );
    }

    const { email } = result.data;

    /*
     * Always return 200 to prevent email enumeration.
     * Only generate a token if the user actually exists.
     */
    const user = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (user) {
      const resetToken: PasswordResetToken = {
        token: `rst_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`,
        email: user.email,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour
        used: false,
      };

      MOCK_RESET_TOKENS.push(resetToken);
    }

    return NextResponse.json({
      message:
        "If an account with that email exists, we've sent a password reset link.",
      /* In dev/demo mode, expose the token so the flow can be tested */
      ...(process.env.NODE_ENV === "development" && user
        ? {
            _dev: {
              resetToken: MOCK_RESET_TOKENS[MOCK_RESET_TOKENS.length - 1].token,
              expiresAt: MOCK_RESET_TOKENS[MOCK_RESET_TOKENS.length - 1].expiresAt,
            },
          }
        : {}),
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
