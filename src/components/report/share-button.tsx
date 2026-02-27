"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Copy, Check, Twitter, LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { SPRING_TRANSITION } from "@/lib/constants";
import { Button } from "@/components/ui/button";

interface ShareButtonProps {
  slug: string;
  influencerName: string;
  accuracyScore: number;
  className?: string;
}

export function ShareButton({
  slug,
  influencerName,
  accuracyScore,
  className,
}: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/report/${slug}`
      : `/report/${slug}`;

  const shareText = `${influencerName}'s crypto prediction accuracy: ${accuracyScore.toFixed(1)}% — tracked by CryptoCallout`;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = shareUrl;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [shareUrl]);

  const handleShareTwitter = useCallback(() => {
    const url = `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setOpen(false);
  }, [shareText, shareUrl]);

  const handleNativeShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${influencerName} — Report Card`,
          text: shareText,
          url: shareUrl,
        });
        setOpen(false);
      } catch {
        // User cancelled or API unavailable
      }
    }
  }, [influencerName, shareText, shareUrl]);

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          if (typeof navigator !== "undefined" && "share" in navigator) {
            handleNativeShare();
          } else {
            setOpen((prev) => !prev);
          }
        }}
        className="gap-2"
      >
        <Share2 size={14} />
        Share
      </Button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={SPRING_TRANSITION}
              className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border border-border bg-card p-1.5 shadow-lg"
            >
              {/* Copy link */}
              <button
                onClick={handleCopy}
                className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-text-secondary hover:bg-secondary hover:text-text-primary transition-colors"
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.span
                      key="check"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={SPRING_TRANSITION}
                    >
                      <Check size={14} className="text-status-correct" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="copy"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={SPRING_TRANSITION}
                    >
                      <Copy size={14} />
                    </motion.span>
                  )}
                </AnimatePresence>
                {copied ? "Copied!" : "Copy Link"}
              </button>

              {/* Share on X / Twitter */}
              <button
                onClick={handleShareTwitter}
                className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-text-secondary hover:bg-secondary hover:text-text-primary transition-colors"
              >
                <Twitter size={14} />
                Share on X
              </button>

              {/* Open link */}
              <button
                onClick={() => {
                  window.open(shareUrl, "_blank");
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-text-secondary hover:bg-secondary hover:text-text-primary transition-colors"
              >
                <LinkIcon size={14} />
                Open Link
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
