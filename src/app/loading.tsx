export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero skeleton */}
      <div className="mb-8 space-y-4">
        <div className="h-8 w-64 animate-skeleton animate-shimmer rounded-lg" />
        <div className="h-4 w-96 max-w-full animate-skeleton animate-shimmer rounded-md" />
      </div>

      {/* Stats grid skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-10">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-28 animate-skeleton animate-shimmer rounded-xl border border-border"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>

      {/* Two-column layout skeleton */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-8 lg:col-span-2">
          {/* Section header */}
          <div className="flex items-center justify-between">
            <div className="space-y-1.5">
              <div className="h-6 w-40 animate-skeleton animate-shimmer rounded-md" />
              <div className="h-3 w-56 animate-skeleton animate-shimmer rounded-md" />
            </div>
            <div className="h-4 w-16 animate-skeleton rounded-md" />
          </div>

          {/* Prediction rows */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="h-7 w-7 animate-skeleton animate-shimmer rounded-full" />
              <div className="h-7 w-7 animate-skeleton animate-shimmer rounded-full" />
              <div className="flex-1 space-y-1.5">
                <div className="h-4 w-32 animate-skeleton animate-shimmer rounded-md" />
                <div className="h-3 w-48 animate-skeleton animate-shimmer rounded-md" />
              </div>
              <div className="h-4 w-12 animate-skeleton rounded-md" />
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Sidebar section header */}
          <div className="space-y-1.5">
            <div className="h-5 w-28 animate-skeleton animate-shimmer rounded-md" />
            <div className="h-3 w-40 animate-skeleton animate-shimmer rounded-md" />
          </div>

          {/* Sidebar rows */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="h-6 w-6 animate-skeleton animate-shimmer rounded-md" />
              <div className="h-8 w-8 animate-skeleton animate-shimmer rounded-full" />
              <div className="flex-1 space-y-1.5">
                <div className="h-4 w-24 animate-skeleton animate-shimmer rounded-md" />
                <div className="h-3 w-20 animate-skeleton animate-shimmer rounded-md" />
              </div>
              <div className="h-4 w-10 animate-skeleton rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
