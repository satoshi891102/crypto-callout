"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Home, Trophy, Target, Users, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SPRING_TRANSITION } from "@/lib/constants";

const MOBILE_NAV_ITEMS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/leaderboard", label: "Board", icon: Trophy },
  { href: "/predictions", label: "Calls", icon: Target },
  { href: "/influencers", label: "People", icon: Users },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
      <div className="border-t border-border bg-background/95 backdrop-blur-xl">
        <div className="flex items-center justify-around h-16 pb-[env(safe-area-inset-bottom)]">
          {MOBILE_NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-text-muted hover:text-text-secondary"
                )}
              >
                <div className="relative">
                  <Icon className="h-5 w-5" />
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        layoutId="mobile-nav-indicator"
                        className="absolute -bottom-1 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-primary"
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        exit={{ opacity: 0, scaleX: 0 }}
                        transition={SPRING_TRANSITION}
                      />
                    )}
                  </AnimatePresence>
                </div>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
