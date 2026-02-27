"use client";

import { useState, useCallback, useMemo } from "react";
import type { Prediction, Influencer } from "@/types";
import { MOCK_PREDICTIONS } from "@/data/mock-predictions";
import { MOCK_INFLUENCERS } from "@/data/mock-influencers";

type BookmarkType = "prediction" | "influencer";

interface Bookmark {
  id: string;
  type: BookmarkType;
  addedAt: string;
}

/** Default seed bookmarks so the UI always starts with demo data. */
const DEFAULT_BOOKMARKS: Bookmark[] = [
  { id: "pred-001", type: "prediction", addedAt: "2026-02-25T10:00:00Z" },
  { id: "pred-003", type: "prediction", addedAt: "2026-02-25T11:30:00Z" },
  { id: "pred-010", type: "prediction", addedAt: "2026-02-26T08:15:00Z" },
  { id: "inf-001", type: "influencer", addedAt: "2026-02-24T09:00:00Z" },
  { id: "inf-005", type: "influencer", addedAt: "2026-02-24T14:20:00Z" },
  { id: "inf-009", type: "influencer", addedAt: "2026-02-26T16:45:00Z" },
];

interface UseBookmarksReturn {
  /** All current bookmarks. */
  bookmarks: Bookmark[];
  /** Bookmarked prediction objects (resolved from mock data). */
  bookmarkedPredictions: Prediction[];
  /** Bookmarked influencer objects (resolved from mock data). */
  bookmarkedInfluencers: Influencer[];
  /** Whether a given item is bookmarked. */
  isBookmarked: (id: string) => boolean;
  /** Add a bookmark. */
  addBookmark: (id: string, type: BookmarkType) => void;
  /** Remove a bookmark. */
  removeBookmark: (id: string) => void;
  /** Toggle a bookmark on/off. */
  toggleBookmark: (id: string, type: BookmarkType) => void;
  /** Remove all bookmarks. */
  clearBookmarks: () => void;
  /** Total bookmark count. */
  count: number;
}

export function useBookmarks(): UseBookmarksReturn {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(DEFAULT_BOOKMARKS);

  const isBookmarked = useCallback(
    (id: string) => bookmarks.some((b) => b.id === id),
    [bookmarks]
  );

  const addBookmark = useCallback((id: string, type: BookmarkType) => {
    setBookmarks((prev) => {
      if (prev.some((b) => b.id === id)) return prev;
      return [...prev, { id, type, addedAt: new Date().toISOString() }];
    });
  }, []);

  const removeBookmark = useCallback((id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const toggleBookmark = useCallback(
    (id: string, type: BookmarkType) => {
      if (isBookmarked(id)) {
        removeBookmark(id);
      } else {
        addBookmark(id, type);
      }
    },
    [isBookmarked, removeBookmark, addBookmark]
  );

  const clearBookmarks = useCallback(() => {
    setBookmarks([]);
  }, []);

  const bookmarkedPredictions = useMemo(() => {
    const predIds = new Set(
      bookmarks.filter((b) => b.type === "prediction").map((b) => b.id)
    );
    return MOCK_PREDICTIONS.filter((p) => predIds.has(p.id));
  }, [bookmarks]);

  const bookmarkedInfluencers = useMemo(() => {
    const infIds = new Set(
      bookmarks.filter((b) => b.type === "influencer").map((b) => b.id)
    );
    return MOCK_INFLUENCERS.filter((inf) => infIds.has(inf.id));
  }, [bookmarks]);

  const count = bookmarks.length;

  return useMemo(
    () => ({
      bookmarks,
      bookmarkedPredictions,
      bookmarkedInfluencers,
      isBookmarked,
      addBookmark,
      removeBookmark,
      toggleBookmark,
      clearBookmarks,
      count,
    }),
    [
      bookmarks,
      bookmarkedPredictions,
      bookmarkedInfluencers,
      isBookmarked,
      addBookmark,
      removeBookmark,
      toggleBookmark,
      clearBookmarks,
      count,
    ]
  );
}
