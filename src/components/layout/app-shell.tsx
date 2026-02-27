"use client";

import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SubmitFab } from "@/components/layout/submit-fab";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="relative min-h-screen">
      <Header />
      <main className="pb-20 md:pb-0">{children}</main>
      <MobileNav />
      <SubmitFab />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "var(--card)",
            border: "1px solid var(--border)",
            color: "var(--foreground)",
          },
        }}
      />
    </div>
  );
}
