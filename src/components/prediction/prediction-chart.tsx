"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceDot,
  CartesianGrid,
} from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SPRING_TRANSITION, FADE_IN } from "@/lib/constants";
import { formatCurrency } from "@/lib/format";
import { MOCK_PRICE_HISTORIES } from "@/data/mock-coins";
import type { PriceDataPoint, Prediction } from "@/types";

/* ── Types ── */

type TimeRange = "7d" | "30d" | "90d";

interface PredictionChartProps {
  coinSymbol: string;
  prediction: Prediction;
  className?: string;
}

/* ── Custom Tooltip ── */

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: PriceDataPoint }>;
}) {
  if (!active || !payload?.[0]) return null;
  const point = payload[0].payload;

  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
      <p className="text-[11px] text-text-muted">{point.date}</p>
      <p className="font-mono text-sm font-semibold tabular-nums text-foreground">
        {formatCurrency(point.price)}
      </p>
      {point.predictionMarker && (
        <div className="mt-1 flex items-center gap-1">
          {point.predictionMarker.direction === "bullish" ? (
            <TrendingUp size={10} className="text-status-correct" />
          ) : (
            <TrendingDown size={10} className="text-status-incorrect" />
          )}
          <span
            className={cn(
              "text-[10px] font-semibold",
              point.predictionMarker.status === "correct"
                ? "text-status-correct"
                : point.predictionMarker.status === "incorrect"
                  ? "text-status-incorrect"
                  : "text-status-pending"
            )}
          >
            {point.predictionMarker.status.charAt(0).toUpperCase() +
              point.predictionMarker.status.slice(1)}
          </span>
        </div>
      )}
    </div>
  );
}

/* ── Prediction Marker Dot ── */

function PredictionDot({
  cx,
  cy,
  status,
}: {
  cx: number;
  cy: number;
  status: string;
}) {
  const fill =
    status === "correct"
      ? "var(--status-correct)"
      : status === "incorrect"
        ? "var(--status-incorrect)"
        : "var(--status-pending)";

  return (
    <g>
      <circle cx={cx} cy={cy} r={8} fill={fill} opacity={0.2} />
      <circle cx={cx} cy={cy} r={4} fill={fill} />
      <circle cx={cx} cy={cy} r={2} fill="var(--background)" />
    </g>
  );
}

/* ── Range Toggle ── */

const RANGES: { label: string; value: TimeRange }[] = [
  { label: "7D", value: "7d" },
  { label: "30D", value: "30d" },
  { label: "90D", value: "90d" },
];

/* ── PredictionChart ── */

export function PredictionChart({
  coinSymbol,
  prediction,
  className,
}: PredictionChartProps) {
  const [range, setRange] = useState<TimeRange>("90d");

  const priceHistory = MOCK_PRICE_HISTORIES[coinSymbol];

  const chartData = useMemo(() => {
    if (!priceHistory) return [];
    const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
    return priceHistory.slice(-days);
  }, [priceHistory, range]);

  const { min, max } = useMemo(() => {
    if (chartData.length === 0) return { min: 0, max: 0 };
    const prices = chartData.map((d) => d.price);
    const lo = Math.min(...prices);
    const hi = Math.max(...prices);
    const padding = (hi - lo) * 0.05;
    return { min: lo - padding, max: hi + padding };
  }, [chartData]);

  const predictionMarkers = useMemo(() => {
    return chartData.filter((d) => d.predictionMarker);
  }, [chartData]);

  const priceChange = useMemo(() => {
    if (chartData.length < 2) return 0;
    const first = chartData[0].price;
    const last = chartData[chartData.length - 1].price;
    return ((last - first) / first) * 100;
  }, [chartData]);

  const isPositive = priceChange >= 0;
  const strokeColor = isPositive
    ? "var(--status-correct)"
    : "var(--status-incorrect)";
  const gradientId = `chart-gradient-${coinSymbol}`;

  if (!priceHistory) {
    return (
      <div
        className={cn(
          "flex h-[300px] items-center justify-center rounded-xl border border-border bg-card",
          className
        )}
      >
        <p className="text-sm text-text-muted">
          No price data available for {coinSymbol}
        </p>
      </div>
    );
  }

  return (
    <motion.div
      {...FADE_IN}
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-2">
        <div>
          <p className="text-sm text-text-secondary">
            {prediction.coin} Price
          </p>
          <div className="mt-0.5 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold tabular-nums text-foreground">
              {formatCurrency(chartData[chartData.length - 1]?.price ?? 0)}
            </span>
            <span
              className={cn(
                "font-mono text-sm font-semibold tabular-nums",
                isPositive ? "text-status-correct" : "text-status-incorrect"
              )}
            >
              {isPositive ? "+" : ""}
              {priceChange.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Range Selector */}
        <div className="flex gap-1 rounded-lg bg-elevated p-1">
          {RANGES.map((r) => (
            <button
              key={r.value}
              onClick={() => setRange(r.value)}
              className={cn(
                "relative rounded-md px-3 py-1 text-xs font-medium transition-colors",
                range === r.value
                  ? "text-foreground"
                  : "text-text-muted hover:text-text-secondary"
              )}
            >
              {range === r.value && (
                <motion.span
                  layoutId="chart-range"
                  className="absolute inset-0 rounded-md bg-card shadow-sm"
                  transition={SPRING_TRANSITION}
                />
              )}
              <span className="relative z-10">{r.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Target Price Reference */}
      {prediction.targetPrice != null && (
        <div className="flex items-center gap-2 px-5 pb-2">
          <span className="text-[11px] text-text-muted">Target:</span>
          <span className="font-mono text-xs font-semibold tabular-nums text-accent-brand">
            {formatCurrency(prediction.targetPrice)}
          </span>
          <span className="text-[11px] text-text-muted">Entry:</span>
          <span className="font-mono text-xs font-medium tabular-nums text-text-secondary">
            {formatCurrency(prediction.priceAtPrediction)}
          </span>
        </div>
      )}

      {/* Chart */}
      <div className="h-[240px] w-full px-2 pb-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={strokeColor}
                  stopOpacity={0.15}
                />
                <stop
                  offset="100%"
                  stopColor={strokeColor}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              opacity={0.4}
              vertical={false}
            />

            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "var(--text-muted)" }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              tickFormatter={(d: string) => {
                const date = new Date(d);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />

            <YAxis
              domain={[min, max]}
              tick={{ fontSize: 10, fill: "var(--text-muted)" }}
              tickLine={false}
              axisLine={false}
              width={60}
              tickFormatter={(v: number) =>
                v >= 1000 ? `$${(v / 1000).toFixed(1)}K` : `$${v.toFixed(2)}`
              }
            />

            <Tooltip content={<ChartTooltip />} />

            <Area
              type="monotone"
              dataKey="price"
              stroke={strokeColor}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              animationDuration={800}
              animationEasing="ease-out"
            />

            {/* Prediction Markers */}
            {predictionMarkers.map((point) => (
              <ReferenceDot
                key={point.date}
                x={point.date}
                y={point.price}
                shape={(props: Record<string, number>) => (
                  <PredictionDot
                    cx={props.cx}
                    cy={props.cy}
                    status={point.predictionMarker!.status}
                  />
                )}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 border-t border-border px-5 py-3">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-status-correct" />
          <span className="text-[10px] text-text-muted">Correct</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-status-incorrect" />
          <span className="text-[10px] text-text-muted">Incorrect</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-status-pending" />
          <span className="text-[10px] text-text-muted">Pending</span>
        </div>
      </div>
    </motion.div>
  );
}
