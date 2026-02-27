"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Filter,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SPRING_TRANSITION, STAGGER_CONTAINER } from "@/lib/constants";
import { formatRelativeDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CoinIcon } from "@/components/shared/coin-icon";
import {
  MOCK_COMMUNITY_SUBMISSIONS,
} from "@/data/mock-predictions";
import type { CommunitySubmission, SubmissionStatus, Platform } from "@/types";
import type { UserProfile } from "@/data/mock-users";

/* ── Status Config ── */

const SUBMISSION_STATUS_CONFIG: Record<
  SubmissionStatus,
  { label: string; icon: typeof Clock; color: string; bg: string; badgeVariant: "success" | "warning" | "danger" }
> = {
  pending_review: {
    label: "Pending Review",
    icon: Clock,
    color: "text-status-pending",
    bg: "bg-status-pending-bg",
    badgeVariant: "warning",
  },
  approved: {
    label: "Approved",
    icon: CheckCircle2,
    color: "text-status-correct",
    bg: "bg-status-correct-bg",
    badgeVariant: "success",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    color: "text-status-incorrect",
    bg: "bg-status-incorrect-bg",
    badgeVariant: "danger",
  },
};

const PLATFORM_LABELS: Record<Platform, string> = {
  twitter: "X / Twitter",
  youtube: "YouTube",
  tiktok: "TikTok",
  telegram: "Telegram",
};

/* ── Sub-components ── */

function SubmissionCard({ submission }: { submission: CommunitySubmission }) {
  const config = SUBMISSION_STATUS_CONFIG[submission.status];
  const StatusIcon = config.icon;
  const isBullish = submission.direction === "bullish";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={SPRING_TRANSITION}
      layout
      className="rounded-xl border border-border bg-card p-5 space-y-4"
    >
      {/* Top row: coin + status */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <CoinIcon symbol={submission.coinSymbol} size="sm" animated={false} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">
                {submission.coinSymbol}
              </span>
              <span className="text-xs text-text-muted">{submission.coin}</span>
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                  isBullish
                    ? "bg-status-correct-bg text-status-correct"
                    : "bg-status-incorrect-bg text-status-incorrect"
                )}
              >
                {isBullish ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {isBullish ? "Bullish" : "Bearish"}
              </span>
            </div>
            <p className="text-xs text-text-muted">
              {submission.influencerHandle} · {PLATFORM_LABELS[submission.platform]}
            </p>
          </div>
        </div>

        <Badge variant={config.badgeVariant}>
          <StatusIcon size={11} className="mr-1" />
          {config.label}
        </Badge>
      </div>

      {/* Source text */}
      <p className="line-clamp-2 text-sm leading-relaxed text-text-secondary">
        &ldquo;{submission.sourceText}&rdquo;
      </p>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-text-muted">
        {submission.targetPrice != null && (
          <span>
            Target:{" "}
            <span className="font-medium text-foreground tabular-nums">
              ${submission.targetPrice.toLocaleString()}
            </span>
          </span>
        )}

        <span>Submitted {formatRelativeDate(submission.submittedAt)}</span>

        {submission.reviewedAt && (
          <span>Reviewed {formatRelativeDate(submission.reviewedAt)}</span>
        )}

        <a
          href={submission.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto inline-flex items-center gap-1 text-text-muted hover:text-accent-brand-hover transition-colors"
        >
          <ExternalLink size={11} />
          Source
        </a>
      </div>
    </motion.div>
  );
}

/* ── Filter Types ── */

type SubmissionFilter = "all" | SubmissionStatus;

/* ── Main Component ── */

interface SubmissionsTabProps {
  user: UserProfile;
  className?: string;
}

export function SubmissionsTab({ user, className }: SubmissionsTabProps) {
  const [filter, setFilter] = useState<SubmissionFilter>("all");

  const userSubmissions = MOCK_COMMUNITY_SUBMISSIONS.filter(
    (s) => s.submittedBy === user.id
  );

  const filteredSubmissions =
    filter === "all"
      ? userSubmissions
      : userSubmissions.filter((s) => s.status === filter);

  const counts: Record<string, number> = {
    all: userSubmissions.length,
    pending_review: userSubmissions.filter((s) => s.status === "pending_review").length,
    approved: userSubmissions.filter((s) => s.status === "approved").length,
    rejected: userSubmissions.filter((s) => s.status === "rejected").length,
  };

  const FILTER_OPTIONS: { value: SubmissionFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "pending_review", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={SPRING_TRANSITION}
      className={cn("space-y-6", className)}
    >
      {/* Filter row */}
      <div className="flex flex-wrap items-center gap-2">
        <Filter size={14} className="text-text-muted" />
        {FILTER_OPTIONS.map((opt) => (
          <Button
            key={opt.value}
            variant={filter === opt.value ? "default" : "secondary"}
            size="sm"
            onClick={() => setFilter(opt.value)}
          >
            {opt.label}
            <span className="ml-1 rounded-full bg-background/20 px-1.5 py-0.5 text-[10px] tabular-nums">
              {counts[opt.value]}
            </span>
          </Button>
        ))}
      </div>

      {/* Submissions list */}
      <AnimatePresence mode="popLayout">
        {filteredSubmissions.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={SPRING_TRANSITION}
            className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-12 text-center"
          >
            <CheckCircle2 size={32} className="text-text-muted" />
            <p className="text-sm text-text-secondary">
              {filter === "all"
                ? "No submissions yet. Start tracking influencer predictions!"
                : `No ${FILTER_OPTIONS.find((o) => o.value === filter)?.label.toLowerCase()} submissions.`}
            </p>
          </motion.div>
        ) : (
          <motion.div {...STAGGER_CONTAINER} className="space-y-3">
            {filteredSubmissions.map((sub) => (
              <SubmissionCard key={sub.id} submission={sub} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
