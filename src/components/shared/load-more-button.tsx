"use client";

import { motion } from "framer-motion";
import { Loader2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SPRING_TRANSITION, SCALE_TAP } from "@/lib/constants";
import { PAGE_SIZE } from "@/lib/constants";

interface LoadMoreButtonProps {
  onClick: () => void;
  loading?: boolean;
  hasMore?: boolean;
  loadedCount?: number;
  totalCount?: number;
  className?: string;
}

export function LoadMoreButton({
  onClick,
  loading = false,
  hasMore = true,
  loadedCount,
  totalCount,
  className,
}: LoadMoreButtonProps) {
  if (!hasMore) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={SPRING_TRANSITION}
      className={cn("flex flex-col items-center gap-2 pt-4", className)}
    >
      <motion.button
        onClick={onClick}
        disabled={loading}
        {...SCALE_TAP}
        className={cn(
          "inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-5 py-2.5",
          "text-sm font-medium text-text-secondary",
          "hover:bg-elevated hover:text-text-primary hover:border-accent-brand/30",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "transition-colors"
        )}
      >
        {loading ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            Loading...
          </>
        ) : (
          <>
            <ChevronDown size={14} />
            Load more
          </>
        )}
      </motion.button>

      {loadedCount != null && totalCount != null && totalCount > 0 && (
        <span className="text-xs text-text-muted">
          Showing {loadedCount} of {totalCount}
        </span>
      )}
    </motion.div>
  );
}
