"use client";

import { motion } from "framer-motion";
import { Calendar, Award, FileCheck, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { SPRING_TRANSITION } from "@/lib/constants";
import { formatRelativeDate, formatShortDate } from "@/lib/format";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { UserProfile, UserRole } from "@/data/mock-users";

/* ── Role Config ── */

const ROLE_CONFIG: Record<
  UserRole,
  { label: string; color: string; icon: typeof Shield }
> = {
  admin: { label: "Admin", color: "text-status-incorrect", icon: Shield },
  moderator: { label: "Moderator", color: "text-accent-brand", icon: Shield },
  contributor: { label: "Contributor", color: "text-status-correct", icon: FileCheck },
  viewer: { label: "Viewer", color: "text-text-secondary", icon: Award },
};

/* ── Helpers ── */

function getInitials(name: string) {
  return name.slice(0, 2).toUpperCase();
}

function getApprovalRate(approved: number, total: number): string {
  if (total === 0) return "N/A";
  return `${((approved / total) * 100).toFixed(0)}%`;
}

/* ── Component ── */

interface UserHeaderProps {
  user: UserProfile;
  className?: string;
}

export function UserHeader({ user, className }: UserHeaderProps) {
  const roleConfig = ROLE_CONFIG[user.role];
  const RoleIcon = roleConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={SPRING_TRANSITION}
      className={cn("space-y-6", className)}
    >
      {/* Main header card */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-8">
        {/* Accent glow */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-accent-brand/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={SPRING_TRANSITION}
          >
            <Avatar className="h-20 w-20 border-2 border-accent-brand sm:h-24 sm:w-24">
              <AvatarImage src={user.avatarUrl} alt={user.username} />
              <AvatarFallback className="text-xl">
                {getInitials(user.username)}
              </AvatarFallback>
            </Avatar>
          </motion.div>

          {/* Info */}
          <div className="min-w-0 flex-1 space-y-3">
            {/* Name + role row */}
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
                {user.username}
              </h1>
              <Badge
                variant="secondary"
                className={cn("text-xs font-semibold", roleConfig.color)}
              >
                <RoleIcon size={12} className="mr-1" />
                {roleConfig.label}
              </Badge>
            </div>

            {/* Email */}
            <p className="text-sm text-text-secondary">{user.email}</p>

            {/* Meta badges row */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <span className="inline-flex items-center gap-1.5 text-xs text-text-muted">
                <Calendar size={12} />
                Joined {formatShortDate(user.joinedAt)}
              </span>
              <span className="text-text-muted">·</span>
              <span className="text-xs text-text-muted">
                Last active {formatRelativeDate(user.lastLoginAt)}
              </span>
            </div>
          </div>

          {/* Stats callout */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={SPRING_TRANSITION}
            className="flex gap-6 sm:gap-8"
          >
            {/* Submissions stat */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-3xl font-extrabold tabular-nums text-accent-brand sm:text-4xl">
                {user.submissionCount}
              </span>
              <span className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
                Submitted
              </span>
            </div>

            {/* Approval rate stat */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-3xl font-extrabold tabular-nums text-status-correct sm:text-4xl">
                {getApprovalRate(user.approvedSubmissions, user.submissionCount)}
              </span>
              <span className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
                Approved
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
