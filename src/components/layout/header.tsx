"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/layout/nav-link";
import { SearchDialog } from "@/components/layout/search-dialog";
import { NAV_ITEMS, APP_NAME, SPRING_TRANSITION, FADE_IN } from "@/lib/constants";

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <motion.header
        initial={FADE_IN.initial}
        animate={FADE_IN.animate}
        transition={FADE_IN.transition}
        className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/90 backdrop-blur-xl"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            {/* Logo — text-only, bold */}
            <Link href="/" className="flex items-center gap-2 shrink-0 group">
              <span className="text-lg font-black tracking-tight text-foreground">
                Crypto<span className="text-status-incorrect">Callout</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.filter((item) => item.label !== "Submit").map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                />
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
                className="text-text-secondary hover:text-foreground h-8 w-8"
              >
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>

              <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border bg-secondary px-1.5 text-[10px] font-medium text-text-muted">
                <span className="text-xs">&apos;/&apos;</span>
              </kbd>

              <Link href="/submit" className="hidden md:inline-flex">
                <Button size="sm" className="gap-1.5 bg-status-incorrect hover:bg-status-incorrect/90 text-white font-semibold text-xs rounded-md h-8">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                  </svg>
                  Call Out
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.header>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
