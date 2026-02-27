"use client";

import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/use-debounce";
import type { SearchResponse, SearchCategory } from "@/types";

const EMPTY_RESPONSE: SearchResponse = {
  query: "",
  results: [],
  grouped: { pages: [], influencers: [], coins: [], predictions: [] },
  totalResults: 0,
};

async function fetchSearchResults(
  query: string,
  limit: number,
  category?: SearchCategory
): Promise<SearchResponse> {
  const params = new URLSearchParams({ q: query, limit: String(limit) });
  if (category && category !== "all") {
    params.set("category", category);
  }
  const res = await fetch(`/api/search?${params.toString()}`);
  if (!res.ok) throw new Error("Search request failed");
  return res.json();
}

interface UseSearchOptions {
  debounceMs?: number;
  limit?: number;
  category?: SearchCategory;
  enabled?: boolean;
}

export function useSearch(query: string, options: UseSearchOptions = {}) {
  const {
    debounceMs = 200,
    limit = 20,
    category,
    enabled = true,
  } = options;

  const debouncedQuery = useDebounce(query, debounceMs);
  const isActive = enabled && debouncedQuery.length >= 2;

  const { data, isLoading, isFetching, error } = useQuery<SearchResponse>({
    queryKey: ["search", debouncedQuery, limit, category],
    queryFn: () => fetchSearchResults(debouncedQuery, limit, category),
    enabled: isActive,
    staleTime: 30 * 1000,
    placeholderData: (prev) => prev,
  });

  return {
    results: isActive ? (data ?? null) : null,
    isLoading: isActive && isLoading,
    isFetching: isActive && isFetching,
    isSearching: query.length >= 2,
    debouncedQuery,
    error,
  };
}
