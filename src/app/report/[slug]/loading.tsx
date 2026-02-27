export default function ReportLoading() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-8 sm:px-6">
      {/* Top navigation */}
      <div className="flex items-center justify-between">
        <div className="h-4 w-28 animate-skeleton animate-shimmer rounded-md" />
        <div className="h-8 w-20 animate-skeleton animate-shimmer rounded-md" />
      </div>

      {/* Report card skeleton */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 animate-skeleton animate-shimmer rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-6 w-40 animate-skeleton animate-shimmer rounded-md" />
            <div className="h-4 w-28 animate-skeleton animate-shimmer rounded-md" />
          </div>
          <div className="h-12 w-20 animate-skeleton animate-shimmer rounded-lg" />
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="space-y-1.5 text-center"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="mx-auto h-3 w-20 animate-skeleton animate-shimmer rounded-md" />
              <div className="mx-auto h-6 w-14 animate-skeleton animate-shimmer rounded-md" />
            </div>
          ))}
        </div>

        {/* Best / worst calls */}
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="h-24 animate-skeleton animate-shimmer rounded-xl border border-border"
              style={{ animationDelay: `${i * 120}ms` }}
            />
          ))}
        </div>

        {/* Top coins */}
        <div className="space-y-2">
          <div className="h-4 w-20 animate-skeleton animate-shimmer rounded-md" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-8 w-20 animate-skeleton animate-shimmer rounded-full"
                style={{ animationDelay: `${i * 60}ms` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="flex justify-center">
        <div className="h-9 w-36 animate-skeleton animate-shimmer rounded-md" />
      </div>
    </div>
  );
}
