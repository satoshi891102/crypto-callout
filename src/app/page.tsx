import { HeroStats } from "@/components/home/hero-stats";
import { TrendingPredictions } from "@/components/home/trending-predictions";
import { TopCallersPreview } from "@/components/home/top-callers-preview";
import { RecentlyVerified } from "@/components/home/recently-verified";
import { WorstCalls } from "@/components/home/worst-calls";
import { PageTransition } from "@/components/shared/page-transition";

export default function HomePage() {
  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl space-y-12 px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero banner with key stats */}
        <HeroStats />

        {/* Two-column layout: left = main content, right = sidebar */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Main column */}
          <div className="space-y-12 lg:col-span-2">
            <RecentlyVerified />
            <WorstCalls />
          </div>

          {/* Sidebar */}
          <div className="space-y-12">
            <TopCallersPreview />
            <TrendingPredictions />
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
