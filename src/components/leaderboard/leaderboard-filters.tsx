"use client";

import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SPRING_TRANSITION, TIME_RANGE_LABELS } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { LeaderboardFilters, TimeRange, LeaderboardSortField } from "@/types";

const SORT_OPTIONS: { value: LeaderboardSortField; label: string }[] = [
  { value: "accuracy", label: "Accuracy" },
  { value: "totalPredictions", label: "Total Predictions" },
  { value: "streak", label: "Win Streak" },
  { value: "avgReturn", label: "Avg Return" },
];

const TIME_RANGE_OPTIONS: { value: TimeRange; label: string }[] = [
  { value: "7d", label: "7 Days" },
  { value: "30d", label: "30 Days" },
  { value: "90d", label: "90 Days" },
  { value: "1y", label: "1 Year" },
  { value: "all", label: "All Time" },
];

const MIN_PREDICTION_OPTIONS = [
  { value: 0, label: "Any" },
  { value: 5, label: "5+" },
  { value: 10, label: "10+" },
  { value: 25, label: "25+" },
  { value: 50, label: "50+" },
];

interface LeaderboardFiltersProps {
  filters: LeaderboardFilters;
  onFiltersChange: (filters: LeaderboardFilters) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  className?: string;
}

export function LeaderboardFiltersBar({
  filters,
  onFiltersChange,
  searchQuery,
  onSearchChange,
  className,
}: LeaderboardFiltersProps) {
  const hasActiveFilters =
    filters.sortBy !== "accuracy" ||
    filters.timeRange !== "all" ||
    filters.minPredictions !== 0 ||
    searchQuery.length > 0;

  function resetFilters() {
    onFiltersChange({
      sortBy: "accuracy",
      timeRange: "all",
      minPredictions: 0,
    });
    onSearchChange("");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...SPRING_TRANSITION, delay: 0.05 }}
      className={cn("space-y-3", className)}
    >
      {/* Search + filter controls row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <Input
            placeholder="Search influencers..."
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

        {/* Filter controls */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={14} className="shrink-0 text-text-muted" />

          {/* Sort by */}
          <Select
            value={filters.sortBy}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, sortBy: value as LeaderboardSortField })
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

          {/* Time range */}
          <Select
            value={filters.timeRange}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, timeRange: value as TimeRange })
            }
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              {TIME_RANGE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Min predictions */}
          <Select
            value={String(filters.minPredictions)}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, minPredictions: Number(value) })
            }
          >
            <SelectTrigger className="hidden w-[100px] lg:flex">
              <SelectValue placeholder="Min calls" />
            </SelectTrigger>
            <SelectContent>
              {MIN_PREDICTION_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={String(opt.value)}>
                  {opt.label} calls
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Reset */}
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
        </div>
      </div>
    </motion.div>
  );
}
