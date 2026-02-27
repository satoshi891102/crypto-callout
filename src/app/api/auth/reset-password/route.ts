import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { MOCK_USERS } from "@/data/mock-users";
import { MOCK_RESET_TOKENS } from "@/app/api/auth/forgot-password/route";

/* ── Validation ── */

const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must be 128 characters or less")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/* ── POST /api/auth/reset-password ── */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = resetPasswordSchema.safeParse(body);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      return NextResponse.json(
        { error: "Validation failed", fields: errors },
        { status: 400 }
      );
    }

    const { token } = result.data;

    /* ── Find the reset token ── */
    const resetEntry = MOCK_RESET_TOKENS.find((t) => t.token === token);

    if (!resetEntry) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    if (resetEntry.used) {
      return NextResponse.json(
        { error: "This reset token has already been used" },
        { status: 400 }
      );
    }

    if (new Date(resetEntry.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: "This reset token has expired. Please request a new one." },
        { status: 400 }
      );
    }

    /* ── Verify the user still exists ── */
    const user = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === resetEntry.email.toLowerCase()
    );

    if (!user) {
      return NextResponse.json(
        { error: "Account not found" },
        { status: 404 }
      );
    }

    /* ── Mark token as used (mock) ── */
    resetEntry.used = true;

    return NextResponse.json({
      message: "Password has been reset successfully. You can now sign in.",
      userId: user.id,
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
