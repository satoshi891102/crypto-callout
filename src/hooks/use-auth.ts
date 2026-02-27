"use client";

import { useState, useCallback, useMemo } from "react";
import {
  MOCK_CURRENT_USER,
  MOCK_USERS,
  type UserProfile,
  type UserRole,
} from "@/data/mock-users";

interface UseAuthReturn {
  /** The currently authenticated user, or null if logged out. */
  user: UserProfile | null;
  /** Whether a user is authenticated. */
  isAuthenticated: boolean;
  /** Whether an auth operation is in progress. */
  isLoading: boolean;
  /** Simulate login with username. Defaults to mock current user. */
  login: (username?: string) => Promise<void>;
  /** Simulate logout. */
  logout: () => void;
  /** Check if the user has a specific role. */
  hasRole: (role: UserRole) => boolean;
  /** Check if the user has at least the given privilege level. */
  hasMinRole: (minRole: UserRole) => boolean;
  /** Toggle a favorite influencer on/off for the current user. */
  toggleFavoriteInfluencer: (influencerId: string) => void;
  /** Toggle a watched coin on/off for the current user. */
  toggleWatchedCoin: (coinSymbol: string) => void;
}

const ROLE_HIERARCHY: UserRole[] = ["viewer", "contributor", "moderator", "admin"];

function getRoleLevel(role: UserRole): number {
  return ROLE_HIERARCHY.indexOf(role);
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<UserProfile | null>(MOCK_CURRENT_USER);
  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = user !== null;

  const login = useCallback(async (username?: string) => {
    setIsLoading(true);
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (username) {
      const found = MOCK_USERS.find((u) => u.username === username);
      setUser(found ?? null);
    } else {
      setUser(MOCK_CURRENT_USER);
    }

    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const hasRole = useCallback(
    (role: UserRole): boolean => {
      if (!user) return false;
      return user.role === role;
    },
    [user]
  );

  const hasMinRole = useCallback(
    (minRole: UserRole): boolean => {
      if (!user) return false;
      return getRoleLevel(user.role) >= getRoleLevel(minRole);
    },
    [user]
  );

  const toggleFavoriteInfluencer = useCallback(
    (influencerId: string) => {
      if (!user) return;
      setUser((prev) => {
        if (!prev) return prev;
        const ids = prev.favoriteInfluencerIds;
        const next = ids.includes(influencerId)
          ? ids.filter((id) => id !== influencerId)
          : [...ids, influencerId];
        return { ...prev, favoriteInfluencerIds: next };
      });
    },
    [user]
  );

  const toggleWatchedCoin = useCallback(
    (coinSymbol: string) => {
      if (!user) return;
      setUser((prev) => {
        if (!prev) return prev;
        const coins = prev.watchedCoins;
        const next = coins.includes(coinSymbol)
          ? coins.filter((s) => s !== coinSymbol)
          : [...coins, coinSymbol];
        return { ...prev, watchedCoins: next };
      });
    },
    [user]
  );

  return useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      login,
      logout,
      hasRole,
      hasMinRole,
      toggleFavoriteInfluencer,
      toggleWatchedCoin,
    }),
    [
      user,
      isAuthenticated,
      isLoading,
      login,
      logout,
      hasRole,
      hasMinRole,
      toggleFavoriteInfluencer,
      toggleWatchedCoin,
    ]
  );
}
