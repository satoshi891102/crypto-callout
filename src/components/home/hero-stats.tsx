"use client";

import { motion } from "framer-motion";
import { BarChart3, Target, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  SPRING_TRANSITION,
  STAGGER_CONTAINER,
  APP_NAME,
  APP_TAGLINE,
} from "@/lib/constants";
import { CountUp } from "@/components/shared/count-up";
import type { HeroStats as HeroStatsType } from "@/types";
import { MOCK_HERO_STATS } from "@/data/mock-home";

interface StatCardProps {
  label: string;
  value: number;
  suffix?: string;
  decimals?: number;
  icon: React.ReactNode;
  color: string;
  formatter?: (value: number) => string;
}

function StatCard({
  label,
  value,
  suffix,
  decimals = 0,
  icon,
  color,
  formatter,
}: StatCardProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0 },
      }}
      initial="hidden"
      animate="visible"
      transition={SPRING_TRANSITION}
      className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-colors hover:border-accent-brand/40"
    >
      {/* Subtle glow overlay */}
      <div
        className={cn(
          "absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-[0.07] blur-2xl transition-opacity group-hover:opacity-[0.12]",
          color
        )}
      />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
            {label}
          </p>
          <div className="mt-2 flex items-baseline gap-1">
            <CountUp
              value={value}
              decimals={decimals}
              suffix={suffix}
              formatter={formatter}
              className="text-2xl font-bold tabular-nums text-text-primary sm:text-3xl"
            />
          </div>
        </div>
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg opacity-80",
            color.replace("bg-", "bg-") + "/10"
          )}
        >
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

interface HeroStatsProps {
  stats?: HeroStatsType;
  className?: string;
}

export function HeroStats({
  stats = MOCK_HERO_STATS,
  className,
}: HeroStatsProps) {
  return (
    <section className={cn("space-y-8", className)}>
      {/* Hero headline */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={SPRING_TRANSITION}
        className="space-y-3"
      >
        <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
          {APP_NAME}
        </h1>
        <p className="max-w-2xl text-base text-text-secondary sm:text-lg">
          {APP_TAGLINE}
        </p>
      </motion.div>

      {/* Stat cards */}
      <motion.div
        variants={STAGGER_CONTAINER}
        initial="hidden"
        animate="animate"
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
      >
        <StatCard
          label="Predictions Tracked"
          value={stats.totalPredictions}
          icon={<BarChart3 size={20} className="text-accent-brand" />}
          color="bg-accent-brand"
          formatter={(v) => v.toLocaleString("en-US", { maximumFractionDigits: 0 })}
        />
        <StatCard
          label="Average Accuracy"
          value={stats.averageAccuracy}
          suffix="%"
          decimals={1}
          icon={<Target size={20} className="text-status-correct" />}
          color="bg-status-correct"
        />
        <StatCard
          label="Influencers Tracked"
          value={stats.trackedInfluencers}
          icon={<Users size={20} className="text-status-pending" />}
          color="bg-status-pending"
          formatter={(v) => Math.round(v).toLocaleString("en-US")}
        />
      </motion.div>
    </section>
  );
}
