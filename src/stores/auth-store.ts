import { useSyncExternalStore, useCallback } from "react";
import {
  MOCK_CURRENT_USER,
  MOCK_USERS,
  type UserProfile,
  type UserRole,
  type NotificationPreferences,
  DEFAULT_NOTIFICATION_PREFS,
} from "@/data/mock-users";

/* ── Role hierarchy for privilege checks ── */

const ROLE_HIERARCHY: UserRole[] = ["viewer", "contributor", "moderator", "admin"];

function getRoleLevel(role: UserRole): number {
  return ROLE_HIERARCHY.indexOf(role);
}

/* ── Store shape ── */

interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  notifications: NotificationPreferences;
}

type Listener = () => void;

/* ── External store (singleton, shared across components) ── */

let state: AuthState = {
  user: MOCK_CURRENT_USER,
  isLoading: false,
  notifications: DEFAULT_NOTIFICATION_PREFS,
};

const listeners = new Set<Listener>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): AuthState {
  return state;
}

function getServerSnapshot(): AuthState {
  return {
    user: null,
    isLoading: false,
    notifications: DEFAULT_NOTIFICATION_PREFS,
  };
}

function setState(partial: Partial<AuthState>) {
  state = { ...state, ...partial };
  emitChange();
}

/* ── Actions ── */

async function login(username?: string): Promise<void> {
  setState({ isLoading: true });

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (username) {
    const found = MOCK_USERS.find((u) => u.username === username);
    setState({ user: found ?? null, isLoading: false });
  } else {
    setState({ user: MOCK_CURRENT_USER, isLoading: false });
  }
}

function logout(): void {
  setState({ user: null });
}

function toggleFavoriteInfluencer(influencerId: string): void {
  const { user } = state;
  if (!user) return;

  const ids = user.favoriteInfluencerIds;
  const next = ids.includes(influencerId)
    ? ids.filter((id) => id !== influencerId)
    : [...ids, influencerId];

  setState({ user: { ...user, favoriteInfluencerIds: next } });
}

function toggleWatchedCoin(coinSymbol: string): void {
  const { user } = state;
  if (!user) return;

  const coins = user.watchedCoins;
  const next = coins.includes(coinSymbol)
    ? coins.filter((s) => s !== coinSymbol)
    : [...coins, coinSymbol];

  setState({ user: { ...user, watchedCoins: next } });
}

function updateNotifications(prefs: Partial<NotificationPreferences>): void {
  setState({ notifications: { ...state.notifications, ...prefs } });
}

function switchUser(userId: string): void {
  const found = MOCK_USERS.find((u) => u.id === userId);
  if (found) {
    setState({ user: found });
  }
}

/* ── Hook ── */

export interface UseAuthStoreReturn {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  notifications: NotificationPreferences;
  login: (username?: string) => Promise<void>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
  hasMinRole: (minRole: UserRole) => boolean;
  toggleFavoriteInfluencer: (influencerId: string) => void;
  toggleWatchedCoin: (coinSymbol: string) => void;
  updateNotifications: (prefs: Partial<NotificationPreferences>) => void;
  switchUser: (userId: string) => void;
  isFavoriteInfluencer: (influencerId: string) => boolean;
  isWatchedCoin: (coinSymbol: string) => boolean;
}

export function useAuthStore(): UseAuthStoreReturn {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const { user, isLoading, notifications } = snapshot;
  const isAuthenticated = user !== null;

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

  const isFavoriteInfluencer = useCallback(
    (influencerId: string): boolean => {
      if (!user) return false;
      return user.favoriteInfluencerIds.includes(influencerId);
    },
    [user]
  );

  const isWatchedCoin = useCallback(
    (coinSymbol: string): boolean => {
      if (!user) return false;
      return user.watchedCoins.includes(coinSymbol);
    },
    [user]
  );

  return {
    user,
    isAuthenticated,
    isLoading,
    notifications,
    login,
    logout,
    hasRole,
    hasMinRole,
    toggleFavoriteInfluencer,
    toggleWatchedCoin,
    updateNotifications,
    switchUser,
    isFavoriteInfluencer,
    isWatchedCoin,
  };
}
