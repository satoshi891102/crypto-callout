"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, RefreshCw } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { SPRING_TRANSITION } from "@/lib/constants";

interface ErrorBannerProps {
  message: string;
  details?: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  dismissible?: boolean;
  className?: string;
}

export function ErrorBanner({
  message,
  details,
  onRetry,
  onDismiss,
  dismissible = true,
  className,
}: ErrorBannerProps) {
  const [visible, setVisible] = useState(true);

  function handleDismiss() {
    setVisible(false);
    onDismiss?.();
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -8, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -8, height: 0 }}
          transition={SPRING_TRANSITION}
          className={cn(
            "overflow-hidden rounded-lg border border-status-incorrect bg-status-incorrect-bg",
            className
          )}
        >
          <div className="flex items-start gap-3 p-4">
            <AlertTriangle
              size={18}
              className="mt-0.5 shrink-0 text-status-incorrect"
            />

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary">{message}</p>
              {details && (
                <p className="mt-1 text-xs text-text-secondary">{details}</p>
              )}
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium text-status-incorrect hover:bg-status-incorrect/10 transition-colors"
                >
                  <RefreshCw size={12} />
                  Retry
                </button>
              )}

              {dismissible && (
                <button
                  onClick={handleDismiss}
                  className="rounded-md p-1 text-text-muted hover:text-text-secondary transition-colors"
                  aria-label="Dismiss error"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
