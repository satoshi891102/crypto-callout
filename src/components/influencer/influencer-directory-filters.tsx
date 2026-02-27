"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X, LayoutGrid, List, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { SPRING_TRANSITION, PLATFORM_LABELS } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Platform, InfluencerTier } from "@/types";

/* ── Types ── */

export type SortField = "accuracy" | "followers" | "predictions" | "streak" | "name";
export type ViewMode = "grid" | "list";

export interface InfluencerDirectoryFilters {
  sortBy: SortField;
  platform: Platform | "all";
  tier: InfluencerTier | "all";
}

/* ── Config ── */

const SORT_OPTIONS: { value: SortField; label: string }[] = [
  { value: "accuracy", label: "Accuracy" },
  { value: "followers", label: "Followers" },
  { value: "predictions", label: "Predictions" },
  { value: "streak", label: "Win Streak" },
  { value: "name", label: "Name" },
];

const PLATFORM_OPTIONS: { value: Platform | "all"; label: string }[] = [
  { value: "all", label: "All Platforms" },
  { value: "twitter", label: PLATFORM_LABELS.twitter },
  { value: "youtube", label: PLATFORM_LABELS.youtube },
  { value: "tiktok", label: PLATFORM_LABELS.tiktok },
  { value: "telegram", label: PLATFORM_LABELS.telegram },
];

const TIER_OPTIONS: { value: InfluencerTier | "all"; label: string }[] = [
  { value: "all", label: "All Tiers" },
  { value: "legendary", label: "Legendary" },
  { value: "expert", label: "Expert" },
  { value: "intermediate", label: "Intermediate" },
  { value: "novice", label: "Novice" },
  { value: "unranked", label: "Unranked" },
];

/* ── Component ── */

interface InfluencerDirectoryFiltersBarProps {
  filters: InfluencerDirectoryFilters;
  onFiltersChange: (filters: InfluencerDirectoryFilters) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  resultCount: number;
  className?: string;
}

export function InfluencerDirectoryFiltersBar({
  filters,
  onFiltersChange,
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  resultCount,
  className,
}: InfluencerDirectoryFiltersBarProps) {
  const hasActiveFilters =
    filters.sortBy !== "accuracy" ||
    filters.platform !== "all" ||
    filters.tier !== "all" ||
    searchQuery.length > 0;

  function resetFilters() {
    onFiltersChange({ sortBy: "accuracy", platform: "all", tier: "all" });
    onSearchChange("");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...SPRING_TRANSITION, delay: 0.05 }}
      className={cn("space-y-3", className)}
    >
      {/* Search row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search input */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <Input
            placeholder="Search by name or handle..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 pr-8"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-foreground transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* View mode toggle + result count */}
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs text-text-muted whitespace-nowrap">
            <Users size={13} />
            {resultCount} influencer{resultCount !== 1 ? "s" : ""}
          </span>

          <div className="flex items-center rounded-md border border-border bg-input p-0.5">
            <button
              onClick={() => onViewModeChange("grid")}
              className={cn(
                "rounded p-1.5 transition-colors",
                viewMode === "grid"
                  ? "bg-elevated text-foreground"
                  : "text-text-muted hover:text-foreground"
              )}
              aria-label="Grid view"
            >
              <LayoutGrid size={14} />
            </button>
            <button
              onClick={() => onViewModeChange("list")}
              className={cn(
                "rounded p-1.5 transition-colors",
                viewMode === "list"
                  ? "bg-elevated text-foreground"
                  : "text-text-muted hover:text-foreground"
              )}
              aria-label="List view"
            >
              <List size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Filter controls row */}
      <div className="flex flex-wrap items-center gap-2">
        <SlidersHorizontal size={14} className="shrink-0 text-text-muted" />

        {/* Sort by */}
        <Select
          value={filters.sortBy}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, sortBy: value as SortField })
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Platform */}
        <Select
          value={filters.platform}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, platform: value as Platform | "all" })
          }
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent>
            {PLATFORM_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Tier */}
        <Select
          value={filters.tier}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, tier: value as InfluencerTier | "all" })
          }
        >
          <SelectTrigger className="hidden w-[140px] sm:flex">
            <SelectValue placeholder="Tier" />
          </SelectTrigger>
          <SelectContent>
            {TIER_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Reset */}
        <AnimatePresence>
          {hasActiveFilters && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={SPRING_TRANSITION}
              onClick={resetFilters}
              className="flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium text-text-muted hover:text-foreground hover:bg-elevated transition-colors"
            >
              <X size={12} />
              Reset
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
