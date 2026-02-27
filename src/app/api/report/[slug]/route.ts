import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_INFLUENCERS,
  getTier,
} from "@/data/mock-influencers";
import { generateReportCard } from "@/data/mock-home";
import { reportPeriodSchema } from "@/lib/validators";
import { APP_NAME } from "@/lib/constants";
import type { ReportPeriod } from "@/types";

/** Derive a URL-safe slug from a handle: "@CryptoVault" → "cryptovault" */
function handleToSlug(handle: string): string {
  return handle.replace(/^@/, "").toLowerCase();
}

function findBySlug(slug: string) {
  return MOCK_INFLUENCERS.find(
    (inf) => handleToSlug(inf.handle) === slug.toLowerCase()
  );
}

const PERIOD_LABELS: Record<ReportPeriod, string> = {
  "30d": "30 Days",
  "90d": "90 Days",
  "1y": "1 Year",
  all: "All Time",
};

/* ────────────────────────────────────────────────
   GET /api/report/[slug]?period=30d&format=og
   ──────────────────────────────────────────────── */

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const influencer = findBySlug(slug);

  if (!influencer) {
    return NextResponse.json(
      { error: "Influencer not found" },
      { status: 404 }
    );
  }

  const searchParams = request.nextUrl.searchParams;

  /* ── Parse period ── */
  const periodRaw = searchParams.get("period") ?? "all";
  const periodResult = reportPeriodSchema.safeParse(periodRaw);
  const period: ReportPeriod = periodResult.success ? periodResult.data : "all";

  /* ── Generate report card ── */
  const reportCard = generateReportCard(influencer.id, period);

  if (!reportCard) {
    return NextResponse.json(
      { error: "Could not generate report card" },
      { status: 500 }
    );
  }

  /* ── OG Image format ── */
  const format = searchParams.get("format");

  if (format === "og") {
    const tier = getTier(reportCard.accuracyScore);
    return generateOGImage({
      name: reportCard.influencer.name,
      handle: reportCard.influencer.handle,
      accuracyScore: reportCard.accuracyScore,
      totalPredictions: reportCard.totalPredictions,
      correctPredictions: reportCard.correctPredictions,
      streak: reportCard.influencer.streak,
      tierLabel: tier.label,
      tierTier: tier.tier,
      period,
      avgReturn: reportCard.avgReturn,
      topCoins: reportCard.topCoins.slice(0, 3),
    });
  }

  /* ── JSON response ── */
  const tier = getTier(influencer.accuracyScore);

  return NextResponse.json({
    reportCard,
    tier,
    meta: {
      ogImageUrl: `/api/report/${slug}?period=${period}&format=og`,
      shareUrl: `/influencers/${slug}?period=${period}`,
    },
  });
}

/* ════════════════════════════════════════════════
   OG Image Generation (1200×630) — SVG-based
   ════════════════════════════════════════════════ */

interface OGData {
  name: string;
  handle: string;
  accuracyScore: number;
  totalPredictions: number;
  correctPredictions: number;
  streak: number;
  tierLabel: string;
  tierTier: string;
  period: ReportPeriod;
  avgReturn: number;
  topCoins: { coinSymbol: string; count: number; accuracy: number }[];
}

function getScoreColor(score: number): string {
  if (score >= 85) return "#10B981";
  if (score >= 70) return "#6366F1";
  if (score >= 50) return "#F59E0B";
  return "#EF4444";
}

function getTierBadgeColors(tier: string): { bg: string; text: string; border: string } {
  switch (tier) {
    case "legendary":
      return { bg: "#422006", text: "#F59E0B", border: "#F59E0B44" };
    case "expert":
      return { bg: "#1e1b4b", text: "#818CF8", border: "#818CF844" };
    case "intermediate":
      return { bg: "#052e16", text: "#10B981", border: "#10B98144" };
    case "novice":
      return { bg: "#1e293b", text: "#94A3B8", border: "#94A3B844" };
    default:
      return { bg: "#1e293b", text: "#64748B", border: "#64748B44" };
  }
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function generateOGImage(data: OGData): Response {
  const accuracyPct = data.accuracyScore.toFixed(1);
  const scoreColor = getScoreColor(data.accuracyScore);
  const tierColors = getTierBadgeColors(data.tierTier);
  const streakText =
    data.streak > 0
      ? `${data.streak}W streak`
      : data.streak < 0
        ? `${Math.abs(data.streak)}L streak`
        : "No streak";
  const returnSign = data.avgReturn >= 0 ? "+" : "";
  const returnColor = data.avgReturn >= 0 ? "#10B981" : "#EF4444";
  const dateStr = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const profileUrl = `cryptocallout.com/${data.handle.replace("@", "").toLowerCase()}`;

  /* ── Build top coins SVG blocks ── */
  const coinBlocks = data.topCoins
    .map((coin, i) => {
      const x = 340 + i * 160;
      return `
        <rect x="${x}" y="420" width="145" height="60" rx="10" fill="#1E293B" fill-opacity="0.6" stroke="#1E293B" stroke-opacity="0.8"/>
        <text x="${x + 14}" y="446" fill="#F1F5F9" font-size="16" font-weight="700" font-family="system-ui, -apple-system, sans-serif">${escapeXml(coin.coinSymbol)}</text>
        <text x="${x + 14}" y="466" fill="#94A3B8" font-size="12" font-family="system-ui, -apple-system, sans-serif">${coin.count} calls · ${coin.accuracy.toFixed(0)}% acc</text>
      `;
    })
    .join("");

  /* ── Build grid lines for background ── */
  let gridLines = "";
  for (let x = 0; x <= 1200; x += 40) {
    gridLines += `<line x1="${x}" y1="0" x2="${x}" y2="630" stroke="#6366F1" stroke-opacity="0.04" stroke-width="1"/>`;
  }
  for (let y = 0; y <= 630; y += 40) {
    gridLines += `<line x1="0" y1="${y}" x2="1200" y2="${y}" stroke="#6366F1" stroke-opacity="0.04" stroke-width="1"/>`;
  }

  const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0A0E17"/>
        <stop offset="50%" stop-color="#111827"/>
        <stop offset="100%" stop-color="#0A0E17"/>
      </linearGradient>
      <linearGradient id="divider" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#1E293B" stop-opacity="0"/>
        <stop offset="30%" stop-color="#1E293B"/>
        <stop offset="50%" stop-color="#6366F1"/>
        <stop offset="70%" stop-color="#1E293B"/>
        <stop offset="100%" stop-color="#1E293B" stop-opacity="0"/>
      </linearGradient>
      <radialGradient id="glow" cx="85%" cy="10%" r="30%">
        <stop offset="0%" stop-color="#6366F1" stop-opacity="0.15"/>
        <stop offset="100%" stop-color="#6366F1" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="brandGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#6366F1"/>
        <stop offset="100%" stop-color="#818CF8"/>
      </linearGradient>
    </defs>

    <!-- Background -->
    <rect width="1200" height="630" fill="url(#bg)"/>
    ${gridLines}
    <rect width="1200" height="630" fill="url(#glow)"/>

    <!-- Header: Name + Tier Badge -->
    <text x="56" y="80" fill="#F1F5F9" font-size="38" font-weight="800" font-family="system-ui, -apple-system, sans-serif" letter-spacing="-0.5">${escapeXml(data.name)}</text>

    <!-- Tier Badge -->
    <rect x="${60 + data.name.length * 22}" y="54" width="${data.tierLabel.length * 11 + 24}" height="32" rx="16" fill="${tierColors.bg}" stroke="${tierColors.border}"/>
    <text x="${72 + data.name.length * 22}" y="76" fill="${tierColors.text}" font-size="15" font-weight="600" font-family="system-ui, -apple-system, sans-serif">${escapeXml(data.tierLabel)}</text>

    <!-- Handle + Period -->
    <text x="56" y="108" fill="#94A3B8" font-size="18" font-family="system-ui, -apple-system, sans-serif">${escapeXml(data.handle)} · ${escapeXml(PERIOD_LABELS[data.period])} Report</text>

    <!-- App Branding (top right) -->
    <rect x="1024" y="46" width="32" height="32" rx="7" fill="url(#brandGrad)"/>
    <text x="1033" y="70" fill="white" font-size="18" font-weight="800" font-family="system-ui, -apple-system, sans-serif">C</text>
    <text x="1066" y="70" fill="#94A3B8" font-size="18" font-weight="700" font-family="system-ui, -apple-system, sans-serif">${escapeXml(APP_NAME)}</text>

    <!-- Divider -->
    <rect x="0" y="128" width="1200" height="1" fill="url(#divider)"/>

    <!-- Big Accuracy Score -->
    <text x="160" y="300" fill="${scoreColor}" font-size="96" font-weight="800" font-family="system-ui, -apple-system, sans-serif" letter-spacing="-2" text-anchor="middle">${accuracyPct}</text>
    <text x="160" y="335" fill="#64748B" font-size="16" font-weight="600" font-family="system-ui, -apple-system, sans-serif" letter-spacing="2" text-anchor="middle">ACCURACY %</text>

    <!-- Stats Row -->
    <!-- Total Calls -->
    <rect x="340" y="168" width="145" height="72" rx="10" fill="#1E293B" fill-opacity="0.6" stroke="#1E293B" stroke-opacity="0.8"/>
    <text x="354" y="207" fill="#F1F5F9" font-size="24" font-weight="700" font-family="system-ui, -apple-system, sans-serif">${data.totalPredictions}</text>
    <text x="354" y="228" fill="#64748B" font-size="11" font-weight="500" font-family="system-ui, -apple-system, sans-serif" letter-spacing="1">TOTAL CALLS</text>

    <!-- Correct -->
    <rect x="500" y="168" width="145" height="72" rx="10" fill="#1E293B" fill-opacity="0.6" stroke="#1E293B" stroke-opacity="0.8"/>
    <text x="514" y="207" fill="#10B981" font-size="24" font-weight="700" font-family="system-ui, -apple-system, sans-serif">${data.correctPredictions}</text>
    <text x="514" y="228" fill="#64748B" font-size="11" font-weight="500" font-family="system-ui, -apple-system, sans-serif" letter-spacing="1">CORRECT</text>

    <!-- Avg Return -->
    <rect x="660" y="168" width="145" height="72" rx="10" fill="#1E293B" fill-opacity="0.6" stroke="#1E293B" stroke-opacity="0.8"/>
    <text x="674" y="207" fill="${returnColor}" font-size="24" font-weight="700" font-family="system-ui, -apple-system, sans-serif">${returnSign}${data.avgReturn.toFixed(1)}%</text>
    <text x="674" y="228" fill="#64748B" font-size="11" font-weight="500" font-family="system-ui, -apple-system, sans-serif" letter-spacing="1">AVG RETURN</text>

    <!-- Streak -->
    <rect x="820" y="168" width="145" height="72" rx="10" fill="#1E293B" fill-opacity="0.6" stroke="#1E293B" stroke-opacity="0.8"/>
    <text x="834" y="207" fill="#F59E0B" font-size="24" font-weight="700" font-family="system-ui, -apple-system, sans-serif">${escapeXml(streakText)}</text>
    <text x="834" y="228" fill="#64748B" font-size="11" font-weight="500" font-family="system-ui, -apple-system, sans-serif" letter-spacing="1">STREAK</text>

    <!-- Performance bar -->
    <rect x="340" y="268" width="625" height="8" rx="4" fill="#1E293B"/>
    <rect x="340" y="268" width="${Math.round((data.accuracyScore / 100) * 625)}" height="8" rx="4" fill="${scoreColor}"/>
    <text x="340" y="298" fill="#64748B" font-size="12" font-family="system-ui, -apple-system, sans-serif">0%</text>
    <text x="937" y="298" fill="#64748B" font-size="12" font-family="system-ui, -apple-system, sans-serif">100%</text>

    <!-- Win/Loss Breakdown Bar -->
    <rect x="340" y="320" width="625" height="32" rx="6" fill="#1E293B" fill-opacity="0.4"/>
    <rect x="340" y="320" width="${data.totalPredictions > 0 ? Math.round((data.correctPredictions / data.totalPredictions) * 625) : 0}" height="32" rx="6" fill="#10B981" fill-opacity="0.25"/>
    <text x="354" y="341" fill="#10B981" font-size="13" font-weight="600" font-family="system-ui, -apple-system, sans-serif">${data.correctPredictions} correct</text>
    <text x="${340 + 625 - 10}" y="341" fill="#EF4444" font-size="13" font-weight="600" font-family="system-ui, -apple-system, sans-serif" text-anchor="end">${data.totalPredictions - data.correctPredictions} missed</text>

    <!-- Section Label: Top Coins -->
    ${data.topCoins.length > 0 ? `<text x="340" y="400" fill="#64748B" font-size="12" font-weight="600" font-family="system-ui, -apple-system, sans-serif" letter-spacing="1.5">TOP COINS</text>` : ""}

    <!-- Top Coins -->
    ${coinBlocks}

    <!-- Footer -->
    <text x="56" y="600" fill="#64748B" font-size="14" font-family="system-ui, -apple-system, sans-serif">Generated ${escapeXml(dateStr)}</text>
    <text x="1144" y="600" fill="#64748B" font-size="14" font-family="system-ui, -apple-system, sans-serif" text-anchor="end">${escapeXml(profileUrl)}</text>
  </svg>`;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
