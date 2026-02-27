import { HeroStats } from "@/components/home/hero-stats";
import { TrendingPredictions } from "@/components/home/trending-predictions";
import { TopCallersPreview } from "@/components/home/top-callers-preview";
import { RecentlyVerified } from "@/components/home/recently-verified";
import { WorstCalls } from "@/components/home/worst-calls";
import { PageTransition } from "@/components/shared/page-transition";

export default function HomePage() {
  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Full-width provocative hero */}
        <HeroStats />

        {/* Featured: Worst Calls — the drama section comes first */}
        <section className="border-t border-border/30 py-12">
          <WorstCalls />
        </section>

        {/* Two-column: Predictions + Sidebar */}
        <div className="grid grid-cols-1 gap-12 border-t border-border/30 py-12 lg:grid-cols-5">
          {/* Main column — wider */}
          <div className="space-y-12 lg:col-span-3">
            <RecentlyVerified />
          </div>

          {/* Sidebar — narrower */}
          <div className="space-y-12 lg:col-span-2">
            <TopCallersPreview />
            <TrendingPredictions />
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
