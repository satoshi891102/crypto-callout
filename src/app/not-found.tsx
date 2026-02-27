"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SPRING_TRANSITION } from "@/lib/constants";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="flex flex-col items-center text-center"
      >
        {/* Animated 404 number */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ ...SPRING_TRANSITION, delay: 0.1 }}
          className="relative mb-6"
        >
          <span className="text-[120px] font-bold leading-none tracking-tighter text-elevated sm:text-[160px]">
            404
          </span>
          {/* Overlay with brand gradient */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ ...SPRING_TRANSITION, delay: 0.3 }}
            className="absolute inset-0 flex items-center justify-center text-[120px] font-bold leading-none tracking-tighter sm:text-[160px]"
            style={{
              background: "linear-gradient(135deg, var(--accent-brand), var(--accent-brand-hover))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            404
          </motion.span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING_TRANSITION, delay: 0.2 }}
          className="text-2xl font-bold text-foreground sm:text-3xl"
        >
          Page not found
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING_TRANSITION, delay: 0.25 }}
          className="mt-3 max-w-md text-text-secondary"
        >
          This prediction didn&apos;t pan out. The page you&apos;re looking
          for doesn&apos;t exist or has been moved.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING_TRANSITION, delay: 0.35 }}
          className="mt-8 flex items-center gap-3"
        >
          <Link href="/">
            <Button variant="default" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <Link href="/leaderboard">
            <Button variant="outline" className="gap-2">
              <Search className="h-4 w-4" />
              Leaderboard
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
