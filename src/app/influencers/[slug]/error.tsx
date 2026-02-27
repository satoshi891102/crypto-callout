"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SPRING_TRANSITION } from "@/lib/constants";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function InfluencerError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="mx-auto max-w-md text-center"
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ ...SPRING_TRANSITION, delay: 0.1 }}
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10"
        >
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </motion.div>

        <h1 className="text-xl font-bold text-foreground">
          Couldn&apos;t load influencer profile
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          We had trouble loading this profile. The influencer may not exist or
          there was a temporary issue.
        </p>

        {error.digest && (
          <div className="mt-3 rounded-lg bg-elevated px-3 py-1.5 inline-block">
            <code className="font-mono text-xs text-text-muted">
              {error.digest}
            </code>
          </div>
        )}

        <div className="mt-6 flex items-center justify-center gap-3">
          <Button onClick={reset} variant="default" size="sm" className="gap-2">
            <RotateCcw className="h-3.5 w-3.5" />
            Retry
          </Button>
          <Link href="/influencers">
            <Button variant="outline" size="sm" className="gap-2">
              <Users className="h-3.5 w-3.5" />
              All Influencers
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
