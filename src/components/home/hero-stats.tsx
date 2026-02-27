"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SPRING_TRANSITION } from "@/lib/constants";
import { CountUp } from "@/components/shared/count-up";
import type { HeroStats as HeroStatsType } from "@/types";
import { MOCK_HERO_STATS } from "@/data/mock-home";

interface HeroStatsProps {
  stats?: HeroStatsType;
  className?: string;
}

export function HeroStats({
  stats = MOCK_HERO_STATS,
  className,
}: HeroStatsProps) {
  return (
    <section className={cn("relative overflow-hidden", className)}>
      {/* Background accent */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-status-incorrect/[0.04] blur-[120px]" />
        <div className="absolute right-0 top-1/3 h-[300px] w-[400px] rounded-full bg-accent-brand/[0.03] blur-[100px]" />
      </div>

      <div className="space-y-10 py-12 sm:py-16 lg:py-20">
        {/* Provocative headline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING_TRANSITION, delay: 0.1 }}
          className="max-w-3xl space-y-5"
        >
          <div className="flex items-center gap-2.5">
            <div className="h-px flex-1 max-w-[40px] bg-status-incorrect/60" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-status-incorrect">
              Accountability Platform
            </span>
          </div>
          
          <h1 className="text-4xl font-black tracking-tight text-text-primary sm:text-5xl lg:text-6xl xl:text-7xl !leading-[0.95]">
            We tracked{" "}
            <span className="relative">
              <CountUp
                value={stats.totalPredictions}
                className="tabular-nums text-transparent bg-clip-text bg-gradient-to-r from-status-incorrect to-status-pending"
                formatter={(v) => v.toLocaleString("en-US", { maximumFractionDigits: 0 })}
              />
              <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-status-incorrect/80 to-transparent rounded-full" />
            </span>{" "}
            crypto predictions.
          </h1>

          <p className="text-lg text-text-secondary sm:text-xl lg:text-2xl font-light max-w-2xl">
            Most influencers are{" "}
            <span className="font-semibold text-status-incorrect">worse than a coin flip</span>.
            {" "}See the receipts.
          </p>
        </motion.div>

        {/* Stats strip — horizontal, minimal, not cards */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING_TRANSITION, delay: 0.3 }}
          className="flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-border/50 pt-6"
        >
          <div className="flex items-baseline gap-2">
            <CountUp
              value={stats.averageAccuracy}
              decimals={1}
              suffix="%"
              className="text-3xl font-black tabular-nums text-status-pending sm:text-4xl"
            />
            <span className="text-sm text-text-muted">avg accuracy</span>
          </div>
          
          <div className="hidden sm:block h-8 w-px bg-border/50" />
          
          <div className="flex items-baseline gap-2">
            <CountUp
              value={stats.trackedInfluencers}
              className="text-3xl font-black tabular-nums text-text-primary sm:text-4xl"
              formatter={(v) => Math.round(v).toLocaleString("en-US")}
            />
            <span className="text-sm text-text-muted">influencers tracked</span>
          </div>

          <div className="hidden sm:block h-8 w-px bg-border/50" />

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black tabular-nums text-status-correct sm:text-4xl">
              50%
            </span>
            <span className="text-sm text-text-muted">would beat most</span>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING_TRANSITION, delay: 0.45 }}
          className="flex flex-wrap items-center gap-3"
        >
          <a
            href="/leaderboard"
            className="inline-flex items-center gap-2 rounded-lg bg-text-primary px-5 py-2.5 text-sm font-semibold text-background transition-all hover:bg-text-primary/90 hover:scale-[1.02] active:scale-[0.98]"
          >
            See who&apos;s actually good
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
          <a
            href="/predictions"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-text-secondary transition-all hover:border-text-muted hover:text-text-primary"
          >
            Browse predictions
          </a>
        </motion.div>
      </div>
    </section>
  );
}
