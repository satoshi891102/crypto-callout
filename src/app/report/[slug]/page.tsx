"use client";

import { useMemo } from "react";
import { notFound } from "next/navigation";
import { use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { MOCK_INFLUENCERS, MOCK_ACCURACY_HISTORIES } from "@/data/mock-influencers";
import { getPredictionsByInfluencer } from "@/data/mock-predictions";
import { calculateAvgReturn, getTopCoins } from "@/lib/scoring";
import { SPRING_TRANSITION } from "@/lib/constants";
import { ReportCardPreview } from "@/components/report/report-card-preview";
import { ShareButton } from "@/components/report/share-button";
import { PageTransition } from "@/components/shared/page-transition";
import { Button } from "@/components/ui/button";
import type { ReportCard, Prediction } from "@/types";

function buildReportCard(influencerId: string): ReportCard | null {
  const influencer = MOCK_INFLUENCERS.find((inf) => inf.id === influencerId);
  if (!influencer) return null;

  const predictions = getPredictionsByInfluencer(influencerId);
  const resolved = predictions.filter((p) => p.status !== "pending");
  const correct = resolved.filter((p) => p.status === "correct");

  const bestCall = findBestCall(predictions);
  const worstCall = findWorstCall(predictions);

  return {
    influencer,
    period: "all",
    totalPredictions: resolved.length,
    correctPredictions: correct.length,
    accuracyScore: influencer.accuracyScore,
    avgReturn: calculateAvgReturn(predictions),
    bestCall,
    worstCall,
    topCoins: getTopCoins(predictions),
    accuracyHistory: MOCK_ACCURACY_HISTORIES[influencerId] ?? [],
    generatedAt: new Date().toISOString(),
  };
}

function findBestCall(predictions: Prediction[]): Prediction | null {
  const correct = predictions.filter(
    (p) => p.status === "correct" && p.priceAtResolution !== null
  );
  if (correct.length === 0) return null;

  return correct.reduce((best, p) => {
    const pReturn = Math.abs(
      ((p.priceAtResolution! - p.priceAtPrediction) / p.priceAtPrediction) * 100
    );
    const bestReturn = Math.abs(
      ((best.priceAtResolution! - best.priceAtPrediction) / best.priceAtPrediction) * 100
    );
    return pReturn > bestReturn ? p : best;
  });
}

function findWorstCall(predictions: Prediction[]): Prediction | null {
  const incorrect = predictions.filter(
    (p) => p.status === "incorrect" && p.priceAtResolution !== null
  );
  if (incorrect.length === 0) return null;

  return incorrect.reduce((worst, p) => {
    const pReturn = Math.abs(
      ((p.priceAtResolution! - p.priceAtPrediction) / p.priceAtPrediction) * 100
    );
    const worstReturn = Math.abs(
      ((worst.priceAtResolution! - worst.priceAtPrediction) / worst.priceAtPrediction) * 100
    );
    return pReturn > worstReturn ? p : worst;
  });
}

interface ReportPageProps {
  params: Promise<{ slug: string }>;
}

export default function ReportPage({ params }: ReportPageProps) {
  const { slug } = use(params);

  const report = useMemo(() => buildReportCard(slug), [slug]);

  if (!report) {
    notFound();
  }

  return (
    <PageTransition>
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-8 sm:px-6">
      {/* Top navigation */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={SPRING_TRANSITION}
        className="flex items-center justify-between"
      >
        <Link
          href={`/influencers/${slug}`}
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-accent-brand-hover transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Profile
        </Link>

        <ShareButton
          slug={slug}
          influencerName={report.influencer.name}
          accuracyScore={report.accuracyScore}
        />
      </motion.div>

      {/* Report Card Preview */}
      <ReportCardPreview report={report} />

      {/* CTA: View full profile */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...SPRING_TRANSITION, delay: 0.4 }}
        className="flex justify-center"
      >
        <Button asChild variant="outline" size="sm" className="gap-2">
          <Link href={`/influencers/${slug}`}>
            <ExternalLink size={14} />
            View Full Profile
          </Link>
        </Button>
      </motion.div>
    </div>
    </PageTransition>
  );
}
