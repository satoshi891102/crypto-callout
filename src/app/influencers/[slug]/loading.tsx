export default function InfluencerProfileLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back nav skeleton */}
      <div className="mb-6 h-4 w-28 animate-skeleton animate-shimmer rounded-md" />

      {/* Header card skeleton */}
      <div className="mb-8 animate-shimmer rounded-2xl border border-border p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
          {/* Avatar */}
          <div className="h-20 w-20 shrink-0 animate-skeleton rounded-full sm:h-24 sm:w-24" />

          {/* Info */}
          <div className="flex-1 space-y-3">
            <div className="h-8 w-52 animate-skeleton rounded-md" />
            <div className="h-4 w-40 animate-skeleton rounded-md" />
            <div className="h-4 w-72 animate-skeleton rounded-md" />
            <div className="flex gap-2 pt-1">
              <div className="h-5 w-20 animate-skeleton rounded-full" />
              <div className="h-5 w-24 animate-skeleton rounded-full" />
            </div>
          </div>

          {/* Accuracy */}
          <div className="flex flex-col items-end gap-1">
            <div className="h-12 w-28 animate-skeleton rounded-md" />
            <div className="h-3 w-16 animate-skeleton rounded-md" />
          </div>
        </div>
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left: stats + chart */}
        <div className="space-y-6 lg:col-span-1">
          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-24 animate-skeleton animate-shimmer rounded-xl border border-border"
                style={{ animationDelay: `${i * 80}ms` }}
              />
            ))}
          </div>

          {/* Score breakdown */}
          <div className="h-52 animate-skeleton animate-shimmer rounded-xl border border-border" />

          {/* Sparkline chart */}
          <div className="h-48 animate-skeleton animate-shimmer rounded-xl border border-border" />
        </div>

        {/* Right: prediction feed */}
        <div className="space-y-4 lg:col-span-2">
          {/* Filter bar */}
          <div className="flex items-center justify-between">
            <div className="h-5 w-36 animate-skeleton animate-shimmer rounded-md" />
            <div className="h-8 w-48 animate-skeleton animate-shimmer rounded-lg" />
          </div>

          {/* Prediction cards */}
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="animate-shimmer rounded-xl border border-border p-5"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="h-8 w-8 animate-skeleton rounded-full" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 w-28 animate-skeleton rounded-md" />
                  <div className="h-3 w-20 animate-skeleton rounded-md" />
                </div>
                <div className="h-5 w-16 animate-skeleton rounded-full" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-full animate-skeleton rounded-md" />
                <div className="h-3 w-4/5 animate-skeleton rounded-md" />
              </div>
              <div className="mt-3 flex gap-4">
                <div className="h-3 w-20 animate-skeleton rounded-md" />
                <div className="h-3 w-16 animate-skeleton rounded-md" />
                <div className="h-3 w-24 animate-skeleton rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
