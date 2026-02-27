"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Star, TrendingUp, TrendingDown, Eye, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SPRING_TRANSITION, STAGGER_CONTAINER } from "@/lib/constants";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CoinIcon } from "@/components/shared/coin-icon";
import { MOCK_INFLUENCERS, formatFollowerCount } from "@/data/mock-influencers";
import { MOCK_COINS, MOCK_PRICES, MOCK_PRICE_CHANGES_24H } from "@/data/mock-coins";
import type { Influencer } from "@/types";
import type { UserProfile } from "@/data/mock-users";

/* ── Helpers ── */

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

function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: value >= 1 ? 2 : 4,
    maximumFractionDigits: value >= 1 ? 2 : 4,
  }).format(value);
}

/* ── Sub-components ── */

function InfluencerRow({ influencer }: { influencer: Influencer }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={SPRING_TRANSITION}
      layout
    >
      <Link
        href={`/influencers/${influencer.id}`}
        className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-accent-brand/40"
      >
        <Avatar className="h-10 w-10 border border-border">
          <AvatarImage src={influencer.avatarUrl} alt={influencer.name} />
          <AvatarFallback className="text-xs">{getInitials(influencer.name)}</AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground group-hover:text-accent-brand-hover transition-colors">
            {influencer.name}
          </p>
          <p className="truncate text-xs text-text-muted">
            {influencer.handle} · {formatFollowerCount(influencer.followerCount)} followers
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className={cn("text-sm font-bold tabular-nums", getAccuracyColor(influencer.accuracyScore))}>
              {influencer.accuracyScore.toFixed(1)}%
            </p>
            <p className="text-[10px] text-text-muted">{influencer.totalPredictions} calls</p>
          </div>

          {influencer.streak > 0 && (
            <Badge variant="success" className="text-[10px]">
              {influencer.streak}W
            </Badge>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

function CoinRow({ symbol }: { symbol: string }) {
  const coin = MOCK_COINS.find((c) => c.symbol === symbol);
  const price = MOCK_PRICES[symbol];
  const change = MOCK_PRICE_CHANGES_24H[symbol];

  if (!coin || price == null) return null;

  const isPositive = (change ?? 0) >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={SPRING_TRANSITION}
      layout
      className="flex items-center gap-4 rounded-xl border border-border bg-card p-4"
    >
      <CoinIcon symbol={symbol} size="md" animated={false} />

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">{coin.name}</p>
        <p className="text-xs text-text-muted">{coin.symbol}</p>
      </div>

      <div className="text-right">
        <p className="text-sm font-semibold tabular-nums text-foreground">
          {formatPrice(price)}
        </p>
        {change != null && (
          <p
            className={cn(
              "inline-flex items-center gap-0.5 text-xs font-medium tabular-nums",
              isPositive ? "text-status-correct" : "text-status-incorrect"
            )}
          >
            {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {isPositive ? "+" : ""}{change.toFixed(2)}%
          </p>
        )}
      </div>
    </motion.div>
  );
}

/* ── Main Component ── */

interface WatchlistTabProps {
  user: UserProfile;
  className?: string;
}

export function WatchlistTab({ user, className }: WatchlistTabProps) {
  const [activeSection, setActiveSection] = useState<"influencers" | "coins">("influencers");

  const favoriteInfluencers = user.favoriteInfluencerIds
    .map((id) => MOCK_INFLUENCERS.find((inf) => inf.id === id))
    .filter((inf): inf is Influencer => inf != null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={SPRING_TRANSITION}
      className={cn("space-y-6", className)}
    >
      {/* Section toggle */}
      <div className="flex items-center gap-2">
        <Button
          variant={activeSection === "influencers" ? "default" : "secondary"}
          size="sm"
          onClick={() => setActiveSection("influencers")}
        >
          <Star size={14} />
          Influencers ({favoriteInfluencers.length})
        </Button>
        <Button
          variant={activeSection === "coins" ? "default" : "secondary"}
          size="sm"
          onClick={() => setActiveSection("coins")}
        >
          <Eye size={14} />
          Coins ({user.watchedCoins.length})
        </Button>
      </div>

      {/* Influencers list */}
      <AnimatePresence mode="wait">
        {activeSection === "influencers" && (
          <motion.div
            key="influencers"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={SPRING_TRANSITION}
            className="space-y-3"
          >
            {favoriteInfluencers.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-12 text-center">
                <Star size={32} className="text-text-muted" />
                <p className="text-sm text-text-secondary">No favorite influencers yet.</p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/influencers">Browse Influencers</Link>
                </Button>
              </div>
            ) : (
              <motion.div {...STAGGER_CONTAINER} className="space-y-3">
                {favoriteInfluencers.map((inf) => (
                  <InfluencerRow key={inf.id} influencer={inf} />
                ))}
              </motion.div>
            )}
          </motion.div>
        )}

        {activeSection === "coins" && (
          <motion.div
            key="coins"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={SPRING_TRANSITION}
            className="space-y-3"
          >
            {user.watchedCoins.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-12 text-center">
                <Eye size={32} className="text-text-muted" />
                <p className="text-sm text-text-secondary">No watched coins yet.</p>
              </div>
            ) : (
              <motion.div {...STAGGER_CONTAINER} className="space-y-3">
                {user.watchedCoins.map((symbol) => (
                  <CoinRow key={symbol} symbol={symbol} />
                ))}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
