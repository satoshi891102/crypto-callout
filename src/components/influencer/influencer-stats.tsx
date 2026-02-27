"use client";

import { motion } from "framer-motion";
import {
  Target,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  BarChart3,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SPRING_TRANSITION, STAGGER_CONTAINER } from "@/lib/constants";
import { formatAccuracy } from "@/lib/format";
import { CountUp } from "@/components/shared/count-up";
import type { Influencer, ScoreBreakdown } from "@/types";

/* ── Stat card ── */

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  iconColor: string;
  detail?: string;
  index: number;
}

function StatCard({ label, value, icon: Icon, iconColor, detail, index }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...SPRING_TRANSITION, delay: index * 0.06 }}
      className="relative overflow-hidden rounded-xl border border-border bg-card p-4"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
            {label}
          </p>
          <p className="text-2xl font-bold tabular-nums text-text-primary">
            {value}
          </p>
          {detail && (
            <p className="text-[11px] text-text-muted">{detail}</p>
          )}
        </div>
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg",
            iconColor
          )}
        >
          <Icon size={18} />
        </div>
      </div>
    </motion.div>
  );
}

/* ── Score breakdown bar ── */

interface ScoreBarProps {
  label: string;
  value: number;
  maxValue: number;
  color: string;
  delay: number;
}

function ScoreBar({ label, value, maxValue, color, delay }: ScoreBarProps) {
  const pct = maxValue > 0 ? (value / maxValue) * 100 : 0;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-text-secondary">{label}</span>
        <span className="font-mono font-medium text-text-primary tabular-nums">
          {value.toFixed(1)}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-elevated">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ ...SPRING_TRANSITION, delay }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
    </div>
  );
}

/* ── InfluencerStats ── */

interface InfluencerStatsProps {
  influencer: Influencer;
  scoreBreakdown: ScoreBreakdown;
  predictionCount: { correct: number; incorrect: number; pending: number };
  avgReturn: number;
  className?: string;
}

export function InfluencerStats({
  influencer,
  scoreBreakdown,
  predictionCount,
  avgReturn,
  className,
}: InfluencerStatsProps) {
  const total = predictionCount.correct + predictionCount.incorrect + predictionCount.pending;
  const resolved = predictionCount.correct + predictionCount.incorrect;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Top stat cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Total Calls"
          value={influencer.totalPredictions}
          icon={Target}
          iconColor="bg-accent-brand/10 text-accent-brand"
          detail={`${resolved} resolved`}
          index={0}
        />
        <StatCard
          label="Correct"
          value={predictionCount.correct}
          icon={CheckCircle2}
          iconColor="bg-status-correct-bg text-status-correct"
          detail={resolved > 0 ? `${((predictionCount.correct / resolved) * 100).toFixed(1)}% hit rate` : undefined}
          index={1}
        />
        <StatCard
          label="Avg Return"
          value={`${avgReturn >= 0 ? "+" : ""}${avgReturn.toFixed(1)}%`}
          icon={TrendingUp}
          iconColor={avgReturn >= 0 ? "bg-status-correct-bg text-status-correct" : "bg-status-incorrect-bg text-status-incorrect"}
          index={2}
        />
        <StatCard
          label="Pending"
          value={predictionCount.pending}
          icon={Clock}
          iconColor="bg-status-pending-bg text-status-pending"
          detail={predictionCount.pending > 0 ? "awaiting resolution" : undefined}
          index={3}
        />
      </div>

      {/* Score breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING_TRANSITION, delay: 0.2 }}
        className="rounded-xl border border-border bg-card p-5"
      >
        <div className="mb-4 flex items-center gap-2">
          <BarChart3 size={16} className="text-accent-brand" />
          <h3 className="text-sm font-semibold text-text-primary">Score Breakdown</h3>
          <span className="ml-auto text-lg font-bold tabular-nums text-text-primary">
            {scoreBreakdown.total.toFixed(1)}
          </span>
        </div>

        <div className="space-y-3">
          <ScoreBar
            label="Accuracy (50%)"
            value={scoreBreakdown.accuracyComponent}
            maxValue={50}
            color="var(--status-correct)"
            delay={0.3}
          />
          <ScoreBar
            label="Consistency (20%)"
            value={scoreBreakdown.consistencyComponent}
            maxValue={20}
            color="var(--accent-brand)"
            delay={0.36}
          />
          <ScoreBar
            label="Volume (15%)"
            value={scoreBreakdown.volumeComponent}
            maxValue={15}
            color="var(--status-pending)"
            delay={0.42}
          />
          <ScoreBar
            label="Recency (15%)"
            value={scoreBreakdown.recencyComponent}
            maxValue={15}
            color="var(--accent-brand-hover)"
            delay={0.48}
          />
        </div>
      </motion.div>
    </div>
  );
}
