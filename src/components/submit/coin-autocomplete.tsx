"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { SPRING_TRANSITION } from "@/lib/constants";
import { MOCK_COINS, MOCK_PRICES, formatPrice } from "@/data/mock-coins";
import type { CoinInfo } from "@/types";

interface CoinAutocompleteProps {
  value: string;
  onChange: (symbol: string, coin: CoinInfo | null) => void;
  error?: string;
}

export function CoinAutocomplete({
  value,
  onChange,
  error,
}: CoinAutocompleteProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const filtered = React.useMemo(() => {
    if (!query) return MOCK_COINS;
    const q = query.toLowerCase();
    return MOCK_COINS.filter(
      (coin) =>
        coin.name.toLowerCase().includes(q) ||
        coin.symbol.toLowerCase().includes(q)
    );
  }, [query]);

  const selectedCoin = React.useMemo(
    () => MOCK_COINS.find((c) => c.symbol === value) ?? null,
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

  function handleSelect(coin: CoinInfo) {
    onChange(coin.symbol, coin);
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
        {selectedCoin ? (
          <div className="flex flex-1 items-center gap-2">
            <span className="text-base">{selectedCoin.icon}</span>
            <span className="font-medium text-foreground">
              {selectedCoin.name}
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              {selectedCoin.symbol}
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
            placeholder="Search coin by name or symbol..."
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        )}
        <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      </div>

      <AnimatePresence>
        {open && !selectedCoin && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={SPRING_TRANSITION}
            className="absolute top-full z-50 mt-1 w-full overflow-hidden rounded-md border border-border bg-card shadow-lg"
          >
            {filtered.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No coin found.
              </div>
            ) : (
              <ul className="max-h-[240px] overflow-y-auto py-1">
                {filtered.map((coin) => (
                  <li key={coin.symbol}>
                    <button
                      type="button"
                      onClick={() => handleSelect(coin)}
                      className={cn(
                        "flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors hover:bg-secondary",
                        value === coin.symbol && "bg-secondary"
                      )}
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-elevated text-sm">
                        {coin.icon}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium text-foreground">
                            {coin.name}
                          </span>
                          <span className="font-mono text-xs text-muted-foreground">
                            {coin.symbol}
                          </span>
                        </div>
                      </div>
                      <span className="shrink-0 font-mono text-xs text-muted-foreground">
                        {MOCK_PRICES[coin.symbol]
                          ? formatPrice(MOCK_PRICES[coin.symbol])
                          : "—"}
                      </span>
                      {value === coin.symbol && (
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
