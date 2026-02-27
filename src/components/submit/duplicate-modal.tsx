"use client";

import { motion } from "framer-motion";
import { AlertTriangle, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SPRING_TRANSITION } from "@/lib/constants";
import type { Prediction } from "@/types";

interface DuplicateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingPrediction: Prediction | null;
  onSubmitAnyway: () => void;
  onCancel: () => void;
}

export function DuplicateModal({
  open,
  onOpenChange,
  existingPrediction,
  onSubmitAnyway,
  onCancel,
}: DuplicateModalProps) {
  if (!existingPrediction) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={SPRING_TRANSITION}
            className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-status-pending-bg sm:mx-0"
          >
            <AlertTriangle className="h-6 w-6 text-status-pending" />
          </motion.div>
          <DialogTitle>Possible Duplicate</DialogTitle>
          <DialogDescription>
            A similar prediction may already exist in our tracker.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-border bg-elevated p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              {existingPrediction.influencerName}
            </span>
            <Badge
              variant={
                existingPrediction.direction === "bullish"
                  ? "success"
                  : "danger"
              }
            >
              {existingPrediction.direction}
            </Badge>
          </div>
          <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-mono font-medium">
              {existingPrediction.coinSymbol}
            </span>
            <span>·</span>
            <span>
              {existingPrediction.targetPrice
                ? `$${existingPrediction.targetPrice.toLocaleString()}`
                : "No target"}
            </span>
            <span>·</span>
            <span>{existingPrediction.timeframe}</span>
          </div>
          <p className="line-clamp-2 text-xs text-text-secondary">
            &ldquo;{existingPrediction.sourceText}&rdquo;
          </p>
          {existingPrediction.sourceUrl && (
            <a
              href={existingPrediction.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              View source <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="warning" onClick={onSubmitAnyway}>
            Submit Anyway
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
