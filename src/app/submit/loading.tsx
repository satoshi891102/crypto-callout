export default function SubmitLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header skeleton */}
      <div className="space-y-2 mb-8">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-56 animate-skeleton animate-shimmer rounded-lg" />
          <div className="h-5 w-28 animate-skeleton animate-shimmer rounded-md" />
        </div>
        <div className="h-4 w-[480px] max-w-full animate-skeleton animate-shimmer rounded-md" />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main form skeleton */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-6 space-y-6">
            {/* Form header */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 animate-skeleton animate-shimmer rounded-lg" />
              <div className="space-y-1.5">
                <div className="h-4 w-32 animate-skeleton animate-shimmer rounded-md" />
                <div className="h-3 w-56 animate-skeleton animate-shimmer rounded-md" />
              </div>
            </div>

            {/* Form fields */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="h-3.5 w-28 animate-skeleton animate-shimmer rounded-md" />
                <div className="h-10 w-full animate-skeleton animate-shimmer rounded-md" />
              </div>
            ))}

            {/* Submit button */}
            <div className="h-10 w-full animate-skeleton animate-shimmer rounded-md" />
          </div>
        </div>

        {/* Sidebar skeleton */}
        <div className="space-y-6">
          {/* Guidelines */}
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <div className="h-4 w-40 animate-skeleton animate-shimmer rounded-md" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-3" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="h-8 w-8 shrink-0 animate-skeleton animate-shimmer rounded-lg" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 w-32 animate-skeleton animate-shimmer rounded-md" />
                  <div className="h-3 w-full animate-skeleton animate-shimmer rounded-md" />
                </div>
              </div>
            ))}
          </div>

          {/* Recent submissions */}
          <div className="rounded-xl border border-border bg-card p-6 space-y-3">
            <div className="h-4 w-52 animate-skeleton animate-shimmer rounded-md" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-14 animate-skeleton animate-shimmer rounded-lg"
                style={{ animationDelay: `${i * 80}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
