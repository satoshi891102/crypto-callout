export default function LeaderboardLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-48 animate-skeleton animate-shimmer rounded-lg" />
          <div className="h-5 w-20 animate-skeleton animate-shimmer rounded-md" />
        </div>
        <div className="h-4 w-96 max-w-full animate-skeleton animate-shimmer rounded-md" />
      </div>

      {/* Quick stats skeleton */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="animate-shimmer rounded-xl border border-border bg-card p-4 space-y-3"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="h-3 w-24 animate-skeleton rounded-md" />
            <div className="h-6 w-16 animate-skeleton rounded-md" />
          </div>
        ))}
      </div>

      {/* Tabs skeleton */}
      <div className="h-11 w-full max-w-md animate-skeleton animate-shimmer rounded-xl" />

      {/* Filters skeleton */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="h-9 flex-1 animate-skeleton animate-shimmer rounded-md" />
        <div className="flex gap-2">
          <div className="h-9 w-[140px] animate-skeleton animate-shimmer rounded-md" />
          <div className="h-9 w-[120px] animate-skeleton animate-shimmer rounded-md" />
        </div>
      </div>

      {/* Table header skeleton */}
      <div className="hidden md:grid md:grid-cols-[auto_1fr_repeat(4,auto)] items-center gap-3 px-4 py-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-3 w-16 animate-skeleton rounded-md" />
        ))}
      </div>

      {/* Table rows skeleton */}
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-16 animate-skeleton animate-shimmer rounded-xl border border-border"
            style={{ animationDelay: `${i * 60}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
