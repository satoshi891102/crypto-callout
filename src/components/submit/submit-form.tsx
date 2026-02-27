"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Link as LinkIcon, MessageSquareText, Clock, DollarSign } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { SPRING_TRANSITION, FADE_IN, TIMEFRAME_LABELS } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InfluencerAutocomplete } from "./influencer-autocomplete";
import { CoinAutocomplete } from "./coin-autocomplete";
import { PredictionTypeToggle } from "./prediction-type-toggle";
import { SubmitSuccess } from "./submit-success";
import { DuplicateModal } from "./duplicate-modal";
import { MOCK_PREDICTIONS } from "@/data/mock-predictions";
import { MOCK_INFLUENCERS } from "@/data/mock-influencers";
import { MOCK_COINS } from "@/data/mock-coins";
import type { Prediction, PredictionDirection, PredictionTimeframe, Influencer, CoinInfo } from "@/types";

const submitSchema = z.object({
  influencerId: z.string().min(1, "Please select an influencer"),
  coinSymbol: z.string().min(1, "Please select a coin"),
  direction: z.enum(["bullish", "bearish"]),
  targetPrice: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(Number(val)) && Number(val) > 0),
      "Target price must be a positive number"
    ),
  timeframe: z.enum(["24h", "1w", "1m", "3m", "6m", "1y"] as const, {
    message: "Please select a timeframe",
  }),
  sourceUrl: z
    .string()
    .min(1, "Source URL is required")
    .url("Please enter a valid URL"),
  sourceText: z
    .string()
    .min(10, "Please include at least 10 characters of the original prediction text")
    .max(500, "Source text must be under 500 characters"),
});

type SubmitFormData = z.infer<typeof submitSchema>;

const TIMEFRAME_OPTIONS: { value: PredictionTimeframe; label: string }[] = [
  { value: "24h", label: "24 Hours" },
  { value: "1w", label: "1 Week" },
  { value: "1m", label: "1 Month" },
  { value: "3m", label: "3 Months" },
  { value: "6m", label: "6 Months" },
  { value: "1y", label: "1 Year" },
];

const fieldVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

export function SubmitForm() {
  const [submitted, setSubmitted] = React.useState(false);
  const [submittedData, setSubmittedData] = React.useState<{
    influencerName: string;
    coinSymbol: string;
    direction: PredictionDirection;
  } | null>(null);
  const [duplicateModalOpen, setDuplicateModalOpen] = React.useState(false);
  const [duplicatePrediction, setDuplicatePrediction] =
    React.useState<Prediction | null>(null);
  const [pendingSubmit, setPendingSubmit] = React.useState<SubmitFormData | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<SubmitFormData>({
    resolver: zodResolver(submitSchema),
    defaultValues: {
      influencerId: "",
      coinSymbol: "",
      direction: "bullish",
      targetPrice: "",
      timeframe: "1m",
      sourceUrl: "",
      sourceText: "",
    },
  });

  const watchedInfluencerId = watch("influencerId");
  const watchedCoinSymbol = watch("coinSymbol");

  function checkDuplicate(data: SubmitFormData): Prediction | null {
    return (
      MOCK_PREDICTIONS.find(
        (p) =>
          p.influencerId === data.influencerId &&
          p.coinSymbol === data.coinSymbol &&
          p.direction === data.direction &&
          p.status === "pending"
      ) ?? null
    );
  }

  async function processSubmission(data: SubmitFormData) {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const influencer = MOCK_INFLUENCERS.find(
      (inf) => inf.id === data.influencerId
    );
    const coin = MOCK_COINS.find((c) => c.symbol === data.coinSymbol);

    setSubmittedData({
      influencerName: influencer?.name ?? "Unknown",
      coinSymbol: data.coinSymbol,
      direction: data.direction,
    });
    setSubmitted(true);
    toast.success("Prediction submitted successfully!");
  }

  async function onSubmit(data: SubmitFormData) {
    const dup = checkDuplicate(data);
    if (dup) {
      setDuplicatePrediction(dup);
      setPendingSubmit(data);
      setDuplicateModalOpen(true);
      return;
    }
    await processSubmission(data);
  }

  async function handleSubmitAnyway() {
    setDuplicateModalOpen(false);
    if (pendingSubmit) {
      await processSubmission(pendingSubmit);
    }
    setPendingSubmit(null);
    setDuplicatePrediction(null);
  }

  function handleSubmitAnother() {
    setSubmitted(false);
    setSubmittedData(null);
    reset();
  }

  if (submitted && submittedData) {
    return (
      <SubmitSuccess
        influencerName={submittedData.influencerName}
        coinSymbol={submittedData.coinSymbol}
        direction={submittedData.direction}
        onSubmitAnother={handleSubmitAnother}
      />
    );
  }

  return (
    <>
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
        initial="initial"
        animate="animate"
        transition={{ staggerChildren: 0.06 }}
      >
        {/* Influencer */}
        <motion.div variants={fieldVariants} transition={SPRING_TRANSITION}>
          <label className="mb-1.5 block text-sm font-medium text-text-secondary">
            Influencer
          </label>
          <Controller
            name="influencerId"
            control={control}
            render={({ field }) => (
              <InfluencerAutocomplete
                value={field.value}
                onChange={(val) => field.onChange(val)}
                error={errors.influencerId?.message}
              />
            )}
          />
        </motion.div>

        {/* Coin */}
        <motion.div variants={fieldVariants} transition={SPRING_TRANSITION}>
          <label className="mb-1.5 block text-sm font-medium text-text-secondary">
            Coin
          </label>
          <Controller
            name="coinSymbol"
            control={control}
            render={({ field }) => (
              <CoinAutocomplete
                value={field.value}
                onChange={(val) => field.onChange(val)}
                error={errors.coinSymbol?.message}
              />
            )}
          />
        </motion.div>

        {/* Direction */}
        <motion.div variants={fieldVariants} transition={SPRING_TRANSITION}>
          <label className="mb-1.5 block text-sm font-medium text-text-secondary">
            Direction
          </label>
          <Controller
            name="direction"
            control={control}
            render={({ field }) => (
              <PredictionTypeToggle
                value={field.value}
                onChange={field.onChange}
                error={errors.direction?.message}
              />
            )}
          />
        </motion.div>

        {/* Target Price + Timeframe Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <motion.div variants={fieldVariants} transition={SPRING_TRANSITION}>
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">
              Target Price
              <span className="ml-1 text-xs text-muted-foreground">(optional)</span>
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                {...register("targetPrice")}
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                className={cn(
                  "pl-8 font-mono",
                  errors.targetPrice &&
                    "border-destructive focus-visible:ring-destructive"
                )}
              />
            </div>
            {errors.targetPrice && (
              <p className="mt-1 text-xs text-destructive">
                {errors.targetPrice.message}
              </p>
            )}
          </motion.div>

          <motion.div variants={fieldVariants} transition={SPRING_TRANSITION}>
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">
              Timeframe
            </label>
            <Controller
              name="timeframe"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-3 gap-1.5">
                  {TIMEFRAME_OPTIONS.map((opt) => (
                    <motion.button
                      key={opt.value}
                      type="button"
                      whileTap={{ scale: 0.95 }}
                      transition={SPRING_TRANSITION}
                      onClick={() => field.onChange(opt.value)}
                      className={cn(
                        "rounded-md border px-2 py-1.5 text-xs font-medium transition-colors",
                        field.value === opt.value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-input text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {opt.label}
                    </motion.button>
                  ))}
                </div>
              )}
            />
            {errors.timeframe && (
              <p className="mt-1 text-xs text-destructive">
                {errors.timeframe.message}
              </p>
            )}
          </motion.div>
        </div>

        {/* Source URL */}
        <motion.div variants={fieldVariants} transition={SPRING_TRANSITION}>
          <label className="mb-1.5 block text-sm font-medium text-text-secondary">
            Source URL
          </label>
          <div className="relative">
            <LinkIcon className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              {...register("sourceUrl")}
              type="url"
              placeholder="https://x.com/handle/status/..."
              className={cn(
                "pl-8",
                errors.sourceUrl &&
                  "border-destructive focus-visible:ring-destructive"
              )}
            />
          </div>
          {errors.sourceUrl && (
            <p className="mt-1 text-xs text-destructive">
              {errors.sourceUrl.message}
            </p>
          )}
        </motion.div>

        {/* Source Text */}
        <motion.div variants={fieldVariants} transition={SPRING_TRANSITION}>
          <label className="mb-1.5 block text-sm font-medium text-text-secondary">
            Original Prediction Text
          </label>
          <div className="relative">
            <MessageSquareText className="absolute left-3 top-3 h-3.5 w-3.5 text-muted-foreground" />
            <textarea
              {...register("sourceText")}
              rows={3}
              placeholder="Paste the exact prediction quote from the influencer..."
              className={cn(
                "flex w-full rounded-md border border-border bg-input px-3 py-2 pl-8 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                errors.sourceText &&
                  "border-destructive focus-visible:ring-destructive"
              )}
            />
          </div>
          {errors.sourceText && (
            <p className="mt-1 text-xs text-destructive">
              {errors.sourceText.message}
            </p>
          )}
        </motion.div>

        {/* Submit */}
        <motion.div variants={fieldVariants} transition={SPRING_TRANSITION}>
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Prediction"
            )}
          </Button>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Submissions are reviewed before appearing on the tracker.
          </p>
        </motion.div>
      </motion.form>

      <DuplicateModal
        open={duplicateModalOpen}
        onOpenChange={setDuplicateModalOpen}
        existingPrediction={duplicatePrediction}
        onSubmitAnyway={handleSubmitAnyway}
        onCancel={() => {
          setDuplicateModalOpen(false);
          setPendingSubmit(null);
          setDuplicatePrediction(null);
        }}
      />
    </>
  );
}
