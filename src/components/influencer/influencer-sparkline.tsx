"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { SPRING_TRANSITION } from "@/lib/constants";
import { formatChartDate } from "@/lib/format";
import type { AccuracyDataPoint } from "@/types";

/* ── Helpers ── */

function getTrend(data: AccuracyDataPoint[]): "up" | "down" | "stable" {
  if (data.length < 2) return "stable";
  const last = data[data.length - 1].accuracy;
  const prev = data[data.length - 2].accuracy;
  if (last > prev + 1) return "up";
  if (last < prev - 1) return "down";
  return "stable";
}

const TREND_ICONS = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus,
} as const;

const TREND_COLORS = {
  up: "text-status-correct",
  down: "text-status-incorrect",
  stable: "text-text-muted",
} as const;

/* ── InfluencerSparkline ── */

interface InfluencerSparklineProps {
  data: AccuracyDataPoint[];
  className?: string;
}

export function InfluencerSparkline({ data, className }: InfluencerSparklineProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const { min, max, range, trend } = useMemo(() => {
    const values = data.map((d) => d.accuracy);
    const min = Math.min(...values);
    const max = Math.max(...values);
    return {
      min,
      max,
      range: max - min || 1,
      trend: getTrend(data),
    };
  }, [data]);

  if (data.length < 2) return null;

  const width = 480;
  const height = 140;
  const padding = { top: 16, right: 16, bottom: 28, left: 16 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const points = data.map((d, i) => ({
    x: padding.left + (i / (data.length - 1)) * innerWidth,
    y: padding.top + innerHeight - ((d.accuracy - min) / range) * innerHeight,
  }));

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(" ");

  const areaD = `${pathD} L ${points[points.length - 1].x.toFixed(2)} ${height - padding.bottom} L ${points[0].x.toFixed(2)} ${height - padding.bottom} Z`;

  const gradientId = "influencer-sparkline-gradient";
  const lineColor = trend === "up" ? "var(--status-correct)" : trend === "down" ? "var(--status-incorrect)" : "var(--accent-brand)";

  const TrendIcon = TREND_ICONS[trend];

  const hovered = hoveredIndex !== null ? data[hoveredIndex] : null;
  const hoveredPoint = hoveredIndex !== null ? points[hoveredIndex] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...SPRING_TRANSITION, delay: 0.15 }}
      className={cn("rounded-xl border border-border bg-card p-5", className)}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-text-primary">Accuracy History</h3>
          <span className={cn("inline-flex items-center gap-1 text-xs font-medium", TREND_COLORS[trend])}>
            <TrendIcon size={12} />
            {trend === "up" ? "Improving" : trend === "down" ? "Declining" : "Stable"}
          </span>
        </div>

        {/* Hovered tooltip */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 6 }}
              transition={SPRING_TRANSITION}
              className="flex items-center gap-2 text-xs"
            >
              <span className="text-text-muted">{formatChartDate(hovered.date)}</span>
              <span className="font-bold tabular-nums text-text-primary">
                {hovered.accuracy.toFixed(1)}%
              </span>
              <span className="text-text-muted">
                ({hovered.totalPredictions} calls)
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chart */}
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="overflow-visible"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={lineColor} stopOpacity={0.15} />
            <stop offset="100%" stopColor={lineColor} stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* Area fill */}
        <path d={areaD} fill={`url(#${gradientId})`} />

        {/* Line */}
        <motion.path
          d={pathD}
          fill="none"
          stroke={lineColor}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ ...SPRING_TRANSITION, duration: 0.8 }}
        />

        {/* Hovered dot */}
        {hoveredPoint && (
          <motion.circle
            cx={hoveredPoint.x}
            cy={hoveredPoint.y}
            r={4}
            fill={lineColor}
            stroke="var(--card)"
            strokeWidth={2}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={SPRING_TRANSITION}
          />
        )}

        {/* Hovered vertical line */}
        {hoveredPoint && (
          <line
            x1={hoveredPoint.x}
            y1={padding.top}
            x2={hoveredPoint.x}
            y2={height - padding.bottom}
            stroke={lineColor}
            strokeWidth={1}
            strokeDasharray="3 3"
            opacity={0.3}
          />
        )}

        {/* Date labels */}
        {data.map((d, i) => {
          if (i !== 0 && i !== data.length - 1 && i !== Math.floor(data.length / 2)) return null;
          return (
            <text
              key={d.date}
              x={points[i].x}
              y={height - 6}
              textAnchor={i === 0 ? "start" : i === data.length - 1 ? "end" : "middle"}
              className="fill-text-muted text-[10px]"
            >
              {formatChartDate(d.date)}
            </text>
          );
        })}

        {/* Invisible hover targets */}
        {points.map((p, i) => (
          <rect
            key={i}
            x={p.x - innerWidth / data.length / 2}
            y={padding.top}
            width={innerWidth / data.length}
            height={innerHeight}
            fill="transparent"
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          />
        ))}
      </svg>
    </motion.div>
  );
}
