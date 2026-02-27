"use client";

import { useMemo } from "react";
import { notFound } from "next/navigation";
import { use } from "react";
import { MOCK_INFLUENCERS } from "@/data/mock-influencers";
import { MOCK_ACCURACY_HISTORIES, MOCK_SCORE_BREAKDOWNS } from "@/data/mock-influencers";
import { getPredictionsByInfluencer } from "@/data/mock-predictions";
import { calculateAvgReturn } from "@/lib/scoring";
import { InfluencerHeader } from "@/components/influencer/influencer-header";
import { InfluencerStats } from "@/components/influencer/influencer-stats";
import { InfluencerSparkline } from "@/components/influencer/influencer-sparkline";
import { PredictionFeed } from "@/components/prediction/prediction-feed";
import { PageTransition } from "@/components/shared/page-transition";

/* ── Page ── */

interface InfluencerProfilePageProps {
  params: Promise<{ slug: string }>;
}

export default function InfluencerProfilePage({ params }: InfluencerProfilePageProps) {
  const { slug } = use(params);

  const influencer = MOCK_INFLUENCERS.find((inf) => inf.id === slug);

  if (!influencer) {
    notFound();
  }

  const predictions = useMemo(
    () => getPredictionsByInfluencer(influencer.id),
    [influencer.id]
  );

  const predictionCount = useMemo(() => {
    const counts = { correct: 0, incorrect: 0, pending: 0 };
    for (const p of predictions) {
      counts[p.status]++;
    }
    return counts;
  }, [predictions]);

  const avgReturn = useMemo(
    () => calculateAvgReturn(predictions),
    [predictions]
  );

  const scoreBreakdown = MOCK_SCORE_BREAKDOWNS[influencer.id] ?? {
    total: influencer.accuracyScore,
    accuracyComponent: influencer.accuracyScore * 0.5,
    consistencyComponent: influencer.accuracyScore * 0.2,
    volumeComponent: influencer.accuracyScore * 0.15,
    recencyComponent: influencer.accuracyScore * 0.15,
  };

  const accuracyHistory = MOCK_ACCURACY_HISTORIES[influencer.id] ?? [];

  return (
    <PageTransition>
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <InfluencerHeader influencer={influencer} />

      {/* Content grid: stats + sparkline left, feed right */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left column: stats + chart */}
        <div className="space-y-6 lg:col-span-1">
          <InfluencerStats
            influencer={influencer}
            scoreBreakdown={scoreBreakdown}
            predictionCount={predictionCount}
            avgReturn={avgReturn}
          />

          {accuracyHistory.length >= 2 && (
            <InfluencerSparkline data={accuracyHistory} />
          )}
        </div>

        {/* Right column: prediction feed */}
        <div className="lg:col-span-2">
          <PredictionFeed predictions={predictions} />
        </div>
      </div>
    </div>
    </PageTransition>
  );
}
