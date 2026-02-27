"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, Loader2 } from "lucide-react";

import { useAuthStore } from "@/stores/auth-store";
import { SPRING_TRANSITION } from "@/lib/constants";
import type { UserRole } from "@/data/mock-users";

interface AuthGuardProps {
  children: React.ReactNode;
  /** Minimum role required. Defaults to any authenticated user. */
  minRole?: UserRole;
  /** Custom redirect path when unauthenticated. Defaults to /auth/signin */
  redirectTo?: string;
  /** Shown while checking auth state */
  fallback?: React.ReactNode;
}

export function AuthGuard({
  children,
  minRole,
  redirectTo = "/auth/signin",
  fallback,
}: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, hasMinRole } = useAuthStore();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace(redirectTo);
      return;
    }

    if (minRole && !hasMinRole(minRole)) {
      router.replace("/");
    }
  }, [isAuthenticated, isLoading, minRole, hasMinRole, router, redirectTo]);

  if (isLoading) {
    return (
      fallback ?? (
        <div className="flex min-h-[60vh] items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={SPRING_TRANSITION}
            className="flex flex-col items-center gap-3"
          >
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-sm text-text-secondary">Checking authentication...</p>
          </motion.div>
        </div>
      )
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (minRole && !hasMinRole(minRole)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={SPRING_TRANSITION}
          className="flex flex-col items-center gap-4 text-center"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
            <Shield className="h-6 w-6 text-destructive" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Access denied</h2>
            <p className="mt-1 text-sm text-text-secondary">
              You don&apos;t have permission to view this page.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
