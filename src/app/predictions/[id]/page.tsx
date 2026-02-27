"use client";

import { use, useMemo } from "react";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { SPRING_TRANSITION } from "@/lib/constants";
import { MOCK_PREDICTIONS } from "@/data/mock-predictions";
import { MOCK_PRICE_HISTORIES } from "@/data/mock-coins";
import { PredictionCardExpanded } from "@/components/prediction/prediction-card-expanded";
import { PredictionChart } from "@/components/prediction/prediction-chart";
import { PredictionCard } from "@/components/prediction/prediction-card";
import { SectionHeader } from "@/components/shared/section-header";
import { PageTransition } from "@/components/shared/page-transition";

/* ── Page ── */

interface PredictionDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function PredictionDetailPage({ params }: PredictionDetailPageProps) {
  const { id } = use(params);

  const prediction = MOCK_PREDICTIONS.find((p) => p.id === id);

  if (!prediction) {
    notFound();
  }

  const hasPriceHistory = !!MOCK_PRICE_HISTORIES[prediction.coinSymbol];

  const relatedPredictions = useMemo(() => {
    return MOCK_PREDICTIONS.filter(
      (p) =>
        p.id !== prediction.id &&
        (p.influencerId === prediction.influencerId ||
          p.coinSymbol === prediction.coinSymbol)
    )
      .sort(
        (a, b) =>
          new Date(b.predictedAt).getTime() - new Date(a.predictedAt).getTime()
      )
      .slice(0, 4);
  }, [prediction.id, prediction.influencerId, prediction.coinSymbol]);

  return (
    <PageTransition>
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        {/* Left column: expanded card */}
        <div className="lg:col-span-3">
          <PredictionCardExpanded prediction={prediction} />
        </div>

        {/* Right column: chart + related */}
        <div className="space-y-8 lg:col-span-2">
          {/* Price Chart */}
          {hasPriceHistory && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING_TRANSITION, delay: 0.1 }}
            >
              <PredictionChart
                coinSymbol={prediction.coinSymbol}
                prediction={prediction}
              />
            </motion.div>
          )}

          {/* Related Predictions */}
          {relatedPredictions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING_TRANSITION, delay: 0.2 }}
              className="space-y-4"
            >
              <SectionHeader
                title="Related Predictions"
                description={`More from ${prediction.influencerName} & ${prediction.coinSymbol}`}
              />
              <div className="space-y-3">
                {relatedPredictions.map((p, idx) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      ...SPRING_TRANSITION,
                      delay: 0.25 + idx * 0.04,
                    }}
                  >
                    <PredictionCard prediction={p} compact />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
    </PageTransition>
  );
}
