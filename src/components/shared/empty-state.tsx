"use client";

import { motion } from "framer-motion";
import { Inbox, Search, Target, BarChart3, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { SPRING_TRANSITION } from "@/lib/constants";

const PRESET_ICONS: Record<string, LucideIcon> = {
  predictions: Target,
  search: Search,
  leaderboard: BarChart3,
  default: Inbox,
};

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon | keyof typeof PRESET_ICONS;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon = "default",
  action,
  className,
}: EmptyStateProps) {
  const Icon =
    typeof icon === "string" ? (PRESET_ICONS[icon] ?? Inbox) : icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={SPRING_TRANSITION}
      className={cn(
        "flex flex-col items-center justify-center py-16 px-6 text-center",
        className
      )}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ ...SPRING_TRANSITION, delay: 0.1 }}
        className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-elevated"
      >
        <Icon size={28} className="text-text-muted" />
      </motion.div>

      <h3 className="text-lg font-semibold text-text-primary">{title}</h3>

      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-text-secondary">
          {description}
        </p>
      )}

      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  );
}
