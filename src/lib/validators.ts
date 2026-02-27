import { z } from "zod";

/* ── Shared Enums ── */

export const platformSchema = z.enum(["twitter", "youtube", "tiktok", "telegram"]);

export const predictionStatusSchema = z.enum(["correct", "incorrect", "pending"]);

export const predictionDirectionSchema = z.enum(["bullish", "bearish"]);

export const predictionTimeframeSchema = z.enum([
  "24h",
  "1w",
  "1m",
  "3m",
  "6m",
  "1y",
  "custom",
]);

export const timeRangeSchema = z.enum(["7d", "30d", "90d", "1y", "all"]);

export const submissionStatusSchema = z.enum(["pending_review", "approved", "rejected"]);

export const reportPeriodSchema = z.enum(["30d", "90d", "1y", "all"]);

export const leaderboardSortFieldSchema = z.enum([
  "accuracy",
  "totalPredictions",
  "streak",
  "avgReturn",
]);

/* ── Community Submission Form ── */

export const communitySubmissionSchema = z.object({
  influencerHandle: z
    .string()
    .min(2, "Handle must be at least 2 characters")
    .max(50, "Handle must be 50 characters or less")
    .refine(
      (val) => /^@?[\w.]+$/.test(val),
      "Handle can only contain letters, numbers, underscores, and dots"
    ),
  platform: platformSchema,
  sourceUrl: z
    .url("Please enter a valid URL")
    .max(500, "URL is too long"),
  sourceText: z
    .string()
    .min(10, "Prediction text must be at least 10 characters")
    .max(1000, "Prediction text must be 1000 characters or less"),
  coin: z
    .string()
    .min(1, "Coin name is required")
    .max(50, "Coin name must be 50 characters or less"),
  coinSymbol: z
    .string()
    .min(1, "Coin symbol is required")
    .max(10, "Coin symbol must be 10 characters or less")
    .transform((val) => val.toUpperCase()),
  direction: predictionDirectionSchema,
  targetPrice: z
    .number()
    .positive("Target price must be positive")
    .nullable(),
  timeframe: predictionTimeframeSchema,
});

export type CommunitySubmissionFormData = z.infer<typeof communitySubmissionSchema>;

/* ── Leaderboard Filters ── */

export const leaderboardFiltersSchema = z.object({
  sortBy: leaderboardSortFieldSchema,
  timeRange: timeRangeSchema,
  minPredictions: z.number().int().min(0).max(100),
});

export type LeaderboardFiltersFormData = z.infer<typeof leaderboardFiltersSchema>;

/* ── Prediction Filters ── */

export const predictionFiltersSchema = z.object({
  status: z.enum(["correct", "incorrect", "pending", "all"]),
  coin: z.string().nullable(),
  timeRange: timeRangeSchema,
  direction: z.enum(["bullish", "bearish", "all"]),
});

export type PredictionFiltersFormData = z.infer<typeof predictionFiltersSchema>;

/* ── Search Query ── */

export const searchQuerySchema = z
  .string()
  .max(100, "Search query is too long")
  .transform((val) => val.trim());

/* ── Report Card Request ── */

export const reportCardRequestSchema = z.object({
  influencerId: z.string().min(1, "Influencer ID is required"),
  period: reportPeriodSchema,
});

export type ReportCardRequestData = z.infer<typeof reportCardRequestSchema>;
