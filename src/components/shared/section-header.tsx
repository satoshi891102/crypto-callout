"use client";

import { cn } from "@/lib/utils";
import { SPRING_TRANSITION } from "@/lib/constants";

interface SectionHeaderProps {
  title: string;
  description?: string;
  badge?: string;
  action?: React.ReactNode;
  as?: "h1" | "h2" | "h3";
  className?: string;
}

export function SectionHeader({
  title,
  description,
  badge,
  action,
  as: Tag = "h2",
  className,
}: SectionHeaderProps) {
  const titleSizes: Record<string, string> = {
    h1: "text-2xl sm:text-3xl",
    h2: "text-xl sm:text-2xl",
    h3: "text-lg",
  };

  return (
    <div
      className={cn("flex items-start justify-between gap-4", className)}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2.5">
          <Tag
            className={cn(
              "font-bold tracking-tight text-text-primary",
              titleSizes[Tag]
            )}
          >
            {title}
          </Tag>

          {badge && (
            <span className="inline-flex items-center rounded-md bg-accent-brand/10 px-2 py-0.5 text-xs font-medium text-accent-brand">
              {badge}
            </span>
          )}
        </div>

        {description && (
          <p className="mt-1 text-sm text-text-secondary">{description}</p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
