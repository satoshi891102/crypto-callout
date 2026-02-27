"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Trophy,
  Flame,
  BarChart3,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SPRING_TRANSITION, STAGGER_CONTAINER, getTierForScore } from "@/lib/constants";
import { formatAccuracy, formatPercentage, formatNumber, formatShortDate } from "@/lib/format";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { ReportCard } from "@/types";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getAccuracyColor(score: number) {
  if (score >= 70) return "text-status-correct";
  if (score >= 50) return "text-status-pending";
  return "text-status-incorrect";
}

function getAccuracyRingColor(score: number) {
  if (score >= 70) return "var(--status-correct)";
  if (score >= 50) return "var(--status-pending)";
  return "var(--status-incorrect)";
}

interface AccuracyRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

function AccuracyRing({ score, size = 100, strokeWidth = 6 }: AccuracyRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const color = getAccuracyRingColor(score);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ ...SPRING_TRANSITION, duration: 1 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("text-2xl font-extrabold tabular-nums", getAccuracyColor(score))}>
          {score.toFixed(1)}%
        </span>
      </div>
    </div>
  );
}

interface MiniSparklineProps {
  data: { accuracy: number }[];
  width?: number;
  height?: number;
}

function MiniSparkline({ data, width = 200, height = 40 }: MiniSparklineProps) {
  if (data.length < 2) return null;

  const values = data.map((d) => d.accuracy);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const padding = 2;

  const points = values.map((v, i) => ({
    x: padding + (i / (values.length - 1)) * (width - padding * 2),
    y: padding + (height - padding * 2) - ((v - min) / range) * (height - padding * 2),
  }));

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const endTrend = values[values.length - 1] >= values[0];
  const color = endTrend ? "var(--status-correct)" : "var(--status-incorrect)";

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
      <defs>
        <linearGradient id="report-sparkline-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.15} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path
        d={`${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`}
        fill="url(#report-sparkline-grad)"
      />
      <motion.path
        d={pathD}
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ ...SPRING_TRANSITION, duration: 0.8 }}
      />
    </svg>
  );
}

interface StatBoxProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  color?: string;
}

function StatBox({ label, value, icon, color }: StatBoxProps) {
  return (
    <motion.div
      variants={{ initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 } }}
      className="flex items-center gap-3 rounded-lg border border-border bg-background/50 px-3 py-2.5"
    >
      <div className={cn("shrink-0", color ?? "text-text-muted")}>{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-text-muted">{label}</p>
        <p className="text-sm font-semibold text-text-primary tabular-nums">{value}</p>
      </div>
    </motion.div>
  );
}

/* ── Period labels ── */

const PERIOD_LABELS: Record<string, string> = {
  "30d": "Last 30 Days",
  "90d": "Last 90 Days",
  "1y": "Last Year",
  all: "All Time",
};

/* ── Main Component ── */

interface ReportCardPreviewProps {
  report: ReportCard;
  className?: string;
}

export function ReportCardPreview({ report, className }: ReportCardPreviewProps) {
  const { influencer } = report;
  const tier = getTierForScore(report.accuracyScore);
  const periodLabel = PERIOD_LABELS[report.period] ?? report.period;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={SPRING_TRANSITION}
      className={className}
    >
      <Card className="relative overflow-hidden">
        {/* Tier accent glow */}
        <div
          className="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full opacity-[0.08] blur-3xl"
          style={{ background: tier.color }}
        />

        <CardContent className="space-y-6 p-6 sm:p-8">
          {/* Header: avatar + name + accuracy ring */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={SPRING_TRANSITION}
              >
                <Avatar className="h-14 w-14 border-2" style={{ borderColor: tier.color }}>
                  <AvatarImage src={influencer.avatarUrl} alt={influencer.name} />
                  <AvatarFallback className="text-base">{getInitials(influencer.name)}</AvatarFallback>
                </Avatar>
              </motion.div>
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-text-primary">{influencer.name}</h2>
                <p className="text-sm font-mono text-text-muted">{influencer.handle}</p>
                <div className="mt-1 flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="text-[10px] font-semibold"
                    style={{ color: tier.color }}
                  >
                    {tier.label}
                  </Badge>
                  <span className="text-[10px] text-text-muted">{periodLabel}</span>
                </div>
              </div>
            </div>

            <AccuracyRing score={report.accuracyScore} />
          </div>

          {/* Stat grid */}
          <motion.div
            variants={STAGGER_CONTAINER}
            initial="initial"
            animate="animate"
            className="grid grid-cols-2 gap-2 sm:grid-cols-4"
          >
            <StatBox
              label="Predictions"
              value={formatNumber(report.totalPredictions)}
              icon={<Target size={16} />}
              color="text-accent-brand"
            />
            <StatBox
              label="Correct"
              value={`${report.correctPredictions}/${report.totalPredictions}`}
              icon={<CheckCircle2 size={16} />}
              color="text-status-correct"
            />
            <StatBox
              label="Avg Return"
              value={formatPercentage(report.avgReturn)}
              icon={report.avgReturn >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              color={report.avgReturn >= 0 ? "text-status-correct" : "text-status-incorrect"}
            />
            <StatBox
              label="Streak"
              value={`${influencer.streak > 0 ? influencer.streak + "W" : influencer.streak === 0 ? "—" : Math.abs(influencer.streak) + "L"}`}
              icon={<Flame size={16} />}
              color={influencer.streak >= 5 ? "text-warning" : "text-text-muted"}
            />
          </motion.div>

          {/* Accuracy trend sparkline */}
          {report.accuracyHistory.length >= 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ...SPRING_TRANSITION, delay: 0.2 }}
              className="space-y-2"
            >
              <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
                Accuracy Trend
              </p>
              <div className="rounded-lg border border-border bg-background/50 p-3">
                <MiniSparkline data={report.accuracyHistory} width={320} height={48} />
              </div>
            </motion.div>
          )}

          {/* Top coins */}
          {report.topCoins.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING_TRANSITION, delay: 0.25 }}
              className="space-y-2"
            >
              <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
                Top Coins
              </p>
              <div className="flex flex-wrap gap-2">
                {report.topCoins.map((coin) => (
                  <div
                    key={coin.coinSymbol}
                    className="flex items-center gap-1.5 rounded-md border border-border bg-background/50 px-2.5 py-1.5"
                  >
                    <span className="text-xs font-semibold text-text-primary font-mono">
                      {coin.coinSymbol}
                    </span>
                    <span className="text-[10px] text-text-muted">{coin.count} calls</span>
                    <span
                      className={cn(
                        "text-[10px] font-semibold tabular-nums",
                        coin.accuracy >= 70
                          ? "text-status-correct"
                          : coin.accuracy >= 50
                            ? "text-status-pending"
                            : "text-status-incorrect"
                      )}
                    >
                      {coin.accuracy.toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Best / Worst calls */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_TRANSITION, delay: 0.3 }}
            className="grid grid-cols-1 gap-3 sm:grid-cols-2"
          >
            {report.bestCall && (
              <div className="rounded-lg border border-status-correct-bg bg-status-correct-bg/30 p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-status-correct">
                  <Trophy size={12} />
                  Best Call
                </div>
                <p className="text-sm font-semibold text-text-primary">
                  {report.bestCall.coinSymbol}{" "}
                  <span className="text-text-muted font-normal">
                    {report.bestCall.direction === "bullish" ? "Long" : "Short"}
                  </span>
                </p>
                <p className="text-xs text-text-secondary line-clamp-2">
                  {report.bestCall.sourceText}
                </p>
              </div>
            )}
            {report.worstCall && (
              <div className="rounded-lg border border-status-incorrect-bg bg-status-incorrect-bg/30 p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-status-incorrect">
                  <XCircle size={12} />
                  Worst Call
                </div>
                <p className="text-sm font-semibold text-text-primary">
                  {report.worstCall.coinSymbol}{" "}
                  <span className="text-text-muted font-normal">
                    {report.worstCall.direction === "bullish" ? "Long" : "Short"}
                  </span>
                </p>
                <p className="text-xs text-text-secondary line-clamp-2">
                  {report.worstCall.sourceText}
                </p>
              </div>
            )}
          </motion.div>

          {/* Branding footer */}
          <div className="flex items-center justify-between border-t border-border pt-4">
            <div className="flex items-center gap-2">
              <BarChart3 size={14} className="text-accent-brand" />
              <span className="text-xs font-semibold text-text-secondary">CryptoCallout</span>
            </div>
            <span className="text-[10px] text-text-muted">
              Generated {formatShortDate(report.generatedAt)}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
