"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Search, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { SPRING_TRANSITION } from "@/lib/constants";
import { MOCK_INFLUENCERS } from "@/data/mock-influencers";
import { formatFollowerCount } from "@/data/mock-influencers";
import type { Influencer, Platform } from "@/types";

const PLATFORM_ICONS: Record<Platform, string> = {
  twitter: "𝕏",
  youtube: "▶",
  tiktok: "♪",
  telegram: "✈",
};

interface InfluencerAutocompleteProps {
  value: string;
  onChange: (value: string, influencer: Influencer | null) => void;
  error?: string;
}

export function InfluencerAutocomplete({
  value,
  onChange,
  error,
}: InfluencerAutocompleteProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const filtered = React.useMemo(() => {
    if (!query) return MOCK_INFLUENCERS.slice(0, 6);
    const q = query.toLowerCase();
    return MOCK_INFLUENCERS.filter(
      (inf) =>
        inf.name.toLowerCase().includes(q) ||
        inf.handle.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [query]);

  const selectedInfluencer = React.useMemo(
    () => MOCK_INFLUENCERS.find((inf) => inf.id === value) ?? null,
    [value]
  );

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(inf: Influencer) {
    onChange(inf.id, inf);
    setQuery("");
    setOpen(false);
  }

  function handleClear() {
    onChange("", null);
    setQuery("");
    inputRef.current?.focus();
  }

  return (
    <div ref={containerRef} className="relative">
      <div
        className={cn(
          "flex h-9 w-full items-center gap-2 rounded-md border border-border bg-input px-3 text-sm transition-colors focus-within:ring-2 focus-within:ring-ring",
          error && "border-destructive focus-within:ring-destructive"
        )}
      >
        <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        {selectedInfluencer ? (
          <div className="flex flex-1 items-center gap-2">
            <span className="truncate text-foreground">
              {selectedInfluencer.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {selectedInfluencer.handle}
            </span>
            <button
              type="button"
              onClick={handleClear}
              className="ml-auto shrink-0 rounded-sm p-0.5 text-muted-foreground hover:text-foreground"
            >
              ×
            </button>
          </div>
        ) : (
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder="Search influencer by name or handle..."
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        )}
        <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      </div>

      <AnimatePresence>
        {open && !selectedInfluencer && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={SPRING_TRANSITION}
            className="absolute top-full z-50 mt-1 w-full overflow-hidden rounded-md border border-border bg-card shadow-lg"
          >
            {filtered.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No influencer found.
              </div>
            ) : (
              <ul className="max-h-[240px] overflow-y-auto py-1">
                {filtered.map((inf) => (
                  <li key={inf.id}>
                    <button
                      type="button"
                      onClick={() => handleSelect(inf)}
                      className={cn(
                        "flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors hover:bg-secondary",
                        value === inf.id && "bg-secondary"
                      )}
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-elevated text-xs font-medium text-text-secondary">
                        <User className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate font-medium text-foreground">
                            {inf.name}
                          </span>
                          <span className="shrink-0 text-xs text-muted-foreground">
                            {PLATFORM_ICONS[inf.platform]}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{inf.handle}</span>
                          <span>·</span>
                          <span>{formatFollowerCount(inf.followerCount)}</span>
                          <span>·</span>
                          <span>{inf.accuracyScore.toFixed(1)}%</span>
                        </div>
                      </div>
                      {value === inf.id && (
                        <Check className="h-4 w-4 shrink-0 text-primary" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
