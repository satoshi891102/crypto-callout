"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { SPRING_TRANSITION } from "@/lib/constants";

export function SubmitFab() {
  const pathname = usePathname();
  const isSubmitPage = pathname === "/submit";

  return (
    <AnimatePresence>
      {!isSubmitPage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={SPRING_TRANSITION}
          className="fixed bottom-20 right-4 z-50 md:hidden"
        >
          <Link href="/submit">
            <motion.div
              whileTap={{ scale: 0.9 }}
              transition={SPRING_TRANSITION}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25"
            >
              <Plus className="h-6 w-6" />
              <span className="sr-only">Submit prediction</span>
            </motion.div>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
