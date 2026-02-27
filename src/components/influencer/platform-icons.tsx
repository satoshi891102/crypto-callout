"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SPRING_TRANSITION, PLATFORM_LABELS } from "@/lib/constants";
import type { Platform } from "@/types";

/* ── SVG paths for each platform ── */

function TwitterIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function YouTubeIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12z" />
    </svg>
  );
}

function TikTokIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

function TelegramIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

/* ── Platform color mapping ── */

const PLATFORM_COLOR_MAP: Record<Platform, string> = {
  twitter: "text-foreground",
  youtube: "text-[#FF0000]",
  tiktok: "text-foreground",
  telegram: "text-[#26A5E4]",
};

const PLATFORM_HOVER_BG: Record<Platform, string> = {
  twitter: "hover:bg-foreground/10",
  youtube: "hover:bg-[#FF0000]/10",
  tiktok: "hover:bg-foreground/10",
  telegram: "hover:bg-[#26A5E4]/10",
};

const ICON_COMPONENTS: Record<Platform, React.ComponentType<{ size: number }>> = {
  twitter: TwitterIcon,
  youtube: YouTubeIcon,
  tiktok: TikTokIcon,
  telegram: TelegramIcon,
};

/* ── PlatformIcon ── */

interface PlatformIconProps {
  platform: Platform;
  size?: number;
  showLabel?: boolean;
  className?: string;
}

export function PlatformIcon({
  platform,
  size = 16,
  showLabel = false,
  className,
}: PlatformIconProps) {
  const IconComponent = ICON_COMPONENTS[platform];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5",
        PLATFORM_COLOR_MAP[platform],
        className
      )}
      title={PLATFORM_LABELS[platform]}
    >
      <IconComponent size={size} />
      {showLabel && (
        <span className="text-xs font-medium text-text-secondary">
          {PLATFORM_LABELS[platform]}
        </span>
      )}
    </span>
  );
}

/* ── PlatformIconButton (interactive, with hover + tap) ── */

interface PlatformIconButtonProps {
  platform: Platform;
  size?: number;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export function PlatformIconButton({
  platform,
  size = 18,
  href,
  onClick,
  className,
}: PlatformIconButtonProps) {
  const IconComponent = ICON_COMPONENTS[platform];

  const inner = (
    <motion.span
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.93 }}
      transition={SPRING_TRANSITION}
      className={cn(
        "inline-flex items-center justify-center rounded-md p-1.5 transition-colors",
        PLATFORM_COLOR_MAP[platform],
        PLATFORM_HOVER_BG[platform],
        className
      )}
      title={PLATFORM_LABELS[platform]}
    >
      <IconComponent size={size} />
    </motion.span>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex">
        {inner}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className="inline-flex">
      {inner}
    </button>
  );
}

/* ── PlatformBadge (pill with icon + label) ── */

interface PlatformBadgeProps {
  platform: Platform;
  className?: string;
}

export function PlatformBadge({ platform, className }: PlatformBadgeProps) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={SPRING_TRANSITION}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-2.5 py-0.5 text-xs font-medium",
        PLATFORM_COLOR_MAP[platform],
        className
      )}
    >
      {(() => { const Icon = ICON_COMPONENTS[platform]; return <Icon size={12} />; })()}
      <span className="text-text-secondary">{PLATFORM_LABELS[platform]}</span>
    </motion.span>
  );
}
