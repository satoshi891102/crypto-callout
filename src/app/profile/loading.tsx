export default function ProfileLoading() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* User header skeleton */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 shrink-0 animate-skeleton animate-shimmer rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-6 w-40 animate-skeleton animate-shimmer rounded-md" />
            <div className="h-4 w-56 animate-skeleton animate-shimmer rounded-md" />
          </div>
        </div>
        <div className="flex gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-1" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="h-3 w-20 animate-skeleton animate-shimmer rounded-md" />
              <div className="h-5 w-12 animate-skeleton animate-shimmer rounded-md" />
            </div>
          ))}
        </div>
      </div>

      {/* Tabs skeleton */}
      <div className="space-y-6">
        <div className="h-10 w-full max-w-xs animate-skeleton animate-shimmer rounded-lg" />

        {/* Tab content skeleton — watchlist cards */}
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-4"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="h-10 w-10 animate-skeleton animate-shimmer rounded-full" />
              <div className="flex-1 space-y-1.5">
                <div className="h-4 w-32 animate-skeleton animate-shimmer rounded-md" />
                <div className="h-3 w-24 animate-skeleton animate-shimmer rounded-md" />
              </div>
              <div className="h-5 w-14 animate-skeleton animate-shimmer rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
