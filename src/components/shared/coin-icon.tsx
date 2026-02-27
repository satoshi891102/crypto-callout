"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SPRING_TRANSITION } from "@/lib/constants";
import { MOCK_COINS } from "@/data/mock-coins";

const COIN_COLORS: Record<string, string> = {
  BTC: "bg-[#F7931A]/15 text-[#F7931A]",
  ETH: "bg-[#627EEA]/15 text-[#627EEA]",
  SOL: "bg-[#9945FF]/15 text-[#9945FF]",
  DOGE: "bg-[#C2A633]/15 text-[#C2A633]",
  ADA: "bg-[#0033AD]/15 text-[#3468D1]",
  XRP: "bg-[#23292F]/15 text-[#AAB8C1]",
  AVAX: "bg-[#E84142]/15 text-[#E84142]",
  DOT: "bg-[#E6007A]/15 text-[#E6007A]",
  MATIC: "bg-[#8247E5]/15 text-[#8247E5]",
  LINK: "bg-[#2A5ADA]/15 text-[#2A5ADA]",
  UNI: "bg-[#FF007A]/15 text-[#FF007A]",
  ARB: "bg-[#28A0F0]/15 text-[#28A0F0]",
};

const FALLBACK_COLOR = "bg-elevated text-text-secondary";

type CoinIconSize = "sm" | "md" | "lg";

const SIZE_CLASSES: Record<CoinIconSize, { container: string; text: string }> = {
  sm: { container: "h-6 w-6", text: "text-xs" },
  md: { container: "h-8 w-8", text: "text-sm" },
  lg: { container: "h-10 w-10", text: "text-base" },
};

interface CoinIconProps {
  symbol: string;
  size?: CoinIconSize;
  animated?: boolean;
  className?: string;
}

export function CoinIcon({
  symbol,
  size = "md",
  animated = true,
  className,
}: CoinIconProps) {
  const coin = MOCK_COINS.find((c) => c.symbol === symbol);
  const iconChar = coin?.icon ?? symbol.charAt(0);
  const colorClass = COIN_COLORS[symbol] ?? FALLBACK_COLOR;
  const sizeConfig = SIZE_CLASSES[size];

  const content = (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-bold",
        sizeConfig.container,
        sizeConfig.text,
        colorClass,
        className
      )}
      title={coin?.name ?? symbol}
    >
      {iconChar}
    </span>
  );

  if (!animated) return content;

  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={SPRING_TRANSITION}
      className="inline-flex"
    >
      {content}
    </motion.span>
  );
}
