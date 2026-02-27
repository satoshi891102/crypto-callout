"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Target,
  Users,
  Home,
  TrendingUp,
  TrendingDown,
  PlusCircle,
  Loader2,
  Search,
  ArrowRight,
} from "lucide-react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { useSearch } from "@/hooks/use-search";
import { MOCK_INFLUENCERS } from "@/data/mock-influencers";
import { NAV_ITEMS, TRACKED_COINS, SPRING_TRANSITION } from "@/lib/constants";
import { formatCurrency } from "@/lib/format";
import type {
  SearchResultInfluencer,
  SearchResultPrediction,
  SearchResultCoin,
  SearchResultPage,
} from "@/types";

/* ── Props ── */

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/* ── Icon Maps ── */

const PAGE_ICONS: Record<string, React.ReactNode> = {
  home: <Home className="h-4 w-4" />,
  trophy: <Trophy className="h-4 w-4" />,
  target: <Target className="h-4 w-4" />,
  users: <Users className="h-4 w-4" />,
  "plus-circle": <PlusCircle className="h-4 w-4" />,
};

const STATUS_STYLES: Record<string, string> = {
  correct: "bg-status-correct-bg text-status-correct",
  incorrect: "bg-status-incorrect-bg text-status-incorrect",
  pending: "bg-status-pending-bg text-status-pending",
};

/* ── Animation Variants ── */

const fadeItem = {
  initial: { opacity: 0, y: 4 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { type: "spring" as const, stiffness: 300, damping: 24 },
};

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const { results, isLoading, isSearching } = useSearch(query, {
    debounceMs: 200,
    limit: 20,
    enabled: open,
  });

  // Global Cmd+K listener
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  // Reset on close
  useEffect(() => {
    if (!open) {
      setQuery("");
    }
  }, [open]);

  const navigate = useCallback(
    (href: string) => {
      onOpenChange(false);
      router.push(href);
    },
    [router, onOpenChange]
  );

  const hasResults = results !== null && results.totalResults > 0;

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search influencers, coins, predictions..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList className="max-h-[420px]">
        {/* ── Loading Indicator ── */}
        {isLoading && (
          <div className="flex items-center justify-center gap-2 py-6 text-text-muted">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="h-4 w-4" />
            </motion.div>
            <span className="text-sm">Searching...</span>
          </div>
        )}

        {/* ── Empty State (searching but no results) ── */}
        {!isLoading && isSearching && !hasResults && (
          <CommandEmpty>
            <motion.div {...fadeItem} className="flex flex-col items-center gap-1.5">
              <Search className="h-8 w-8 text-text-muted" />
              <span className="text-text-secondary">
                No results for &ldquo;{query}&rdquo;
              </span>
              <span className="text-xs text-text-muted">
                Try a different search term
              </span>
            </motion.div>
          </CommandEmpty>
        )}

        {/* ── API Results (when searching) ── */}
        <AnimatePresence mode="wait">
          {!isLoading && isSearching && hasResults && results && (
            <motion.div
              key="api-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={SPRING_TRANSITION}
            >
              {/* Pages */}
              {results.grouped.pages.length > 0 && (
                <CommandGroup heading="Pages">
                  {results.grouped.pages.map((page: SearchResultPage) => (
                    <CommandItem
                      key={page.href}
                      value={`page:${page.label}`}
                      onSelect={() => navigate(page.href)}
                    >
                      {page.icon && PAGE_ICONS[page.icon]}
                      <span>{page.label}</span>
                      <ArrowRight className="ml-auto h-3 w-3 text-text-muted" />
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {results.grouped.pages.length > 0 &&
                (results.grouped.influencers.length > 0 ||
                  results.grouped.coins.length > 0 ||
                  results.grouped.predictions.length > 0) && (
                  <CommandSeparator />
                )}

              {/* Influencers */}
              {results.grouped.influencers.length > 0 && (
                <CommandGroup heading="Influencers">
                  {results.grouped.influencers.map((inf: SearchResultInfluencer) => (
                    <CommandItem
                      key={inf.id}
                      value={`influencer:${inf.name} ${inf.handle}`}
                      onSelect={() => navigate(inf.href)}
                    >
                      <Users className="h-4 w-4 text-text-secondary" />
                      <div className="flex flex-col">
                        <span className="text-sm">{inf.name}</span>
                        <span className="text-xs text-text-muted">
                          {inf.handle} · #{inf.rank}
                        </span>
                      </div>
                      <Badge
                        variant="secondary"
                        className="ml-auto font-mono text-[10px]"
                      >
                        {inf.accuracyScore}%
                      </Badge>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {results.grouped.influencers.length > 0 &&
                (results.grouped.coins.length > 0 ||
                  results.grouped.predictions.length > 0) && (
                  <CommandSeparator />
                )}

              {/* Coins */}
              {results.grouped.coins.length > 0 && (
                <CommandGroup heading="Coins">
                  {results.grouped.coins.map((coin: SearchResultCoin) => (
                    <CommandItem
                      key={coin.symbol}
                      value={`coin:${coin.name} ${coin.symbol}`}
                      onSelect={() => navigate(coin.href)}
                    >
                      <span className="flex h-5 w-5 items-center justify-center text-sm">
                        {coin.icon}
                      </span>
                      <div className="flex flex-col">
                        <span className="text-sm">{coin.name}</span>
                        <span className="text-xs text-text-muted font-mono">
                          {coin.symbol}
                          {coin.price != null && ` · ${formatCurrency(coin.price)}`}
                        </span>
                      </div>
                      {coin.change24h != null && (
                        <span
                          className={`ml-auto text-xs font-mono ${
                            coin.change24h >= 0
                              ? "text-status-correct"
                              : "text-status-incorrect"
                          }`}
                        >
                          {coin.change24h >= 0 ? "+" : ""}
                          {coin.change24h.toFixed(1)}%
                        </span>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {results.grouped.coins.length > 0 &&
                results.grouped.predictions.length > 0 && (
                  <CommandSeparator />
                )}

              {/* Predictions */}
              {results.grouped.predictions.length > 0 && (
                <CommandGroup heading="Predictions">
                  {results.grouped.predictions.slice(0, 5).map((pred: SearchResultPrediction) => (
                    <CommandItem
                      key={pred.id}
                      value={`prediction:${pred.influencerName} ${pred.coinSymbol} ${pred.sourceText}`}
                      onSelect={() => navigate(pred.href)}
                    >
                      {pred.direction === "bullish" ? (
                        <TrendingUp className="h-4 w-4 text-status-correct" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-status-incorrect" />
                      )}
                      <div className="flex flex-col min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-medium truncate">
                            {pred.influencerName}
                          </span>
                          <span className="text-xs text-text-muted font-mono">
                            {pred.coinSymbol}
                          </span>
                        </div>
                        <span className="text-xs text-text-muted truncate">
                          {pred.sourceText}
                        </span>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`shrink-0 text-[10px] ${STATUS_STYLES[pred.status] ?? ""}`}
                      >
                        {pred.status}
                      </Badge>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {/* Result count */}
              <div className="px-3 py-2 text-[11px] text-text-muted text-center border-t border-border">
                {results.totalResults} result
                {results.totalResults !== 1 ? "s" : ""} found
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Default view (not searching) ── */}
        {!isSearching && !isLoading && (
          <>
            <CommandGroup heading="Pages">
              {NAV_ITEMS.map((item) => (
                <CommandItem
                  key={item.href}
                  value={`page:${item.label}`}
                  onSelect={() => navigate(item.href)}
                >
                  {item.icon && PAGE_ICONS[item.icon]}
                  <span>{item.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Top Influencers">
              {MOCK_INFLUENCERS.slice(0, 6).map((inf) => (
                <CommandItem
                  key={inf.id}
                  value={`influencer:${inf.name} ${inf.handle}`}
                  onSelect={() => navigate(`/influencers/${inf.id}`)}
                >
                  <Users className="h-4 w-4 text-text-secondary" />
                  <span>{inf.name}</span>
                  <span className="ml-auto text-xs text-text-muted font-mono">
                    {inf.accuracyScore}%
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Tracked Coins">
              {TRACKED_COINS.slice(0, 6).map((coin) => (
                <CommandItem
                  key={coin.symbol}
                  value={`coin:${coin.name} ${coin.symbol}`}
                  onSelect={() =>
                    navigate(`/predictions?coin=${coin.symbol}`)
                  }
                >
                  <TrendingUp className="h-4 w-4 text-text-secondary" />
                  <span>{coin.name}</span>
                  <span className="ml-auto text-xs text-text-muted font-mono">
                    {coin.symbol}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
