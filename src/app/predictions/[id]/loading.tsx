export default function PredictionDetailLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        {/* Left column: expanded card skeleton */}
        <div className="space-y-6 lg:col-span-3">
          {/* Back nav */}
          <div className="h-4 w-36 animate-skeleton animate-shimmer rounded-md" />

          {/* Main card */}
          <div className="animate-shimmer overflow-hidden rounded-2xl border border-border">
            {/* Header: avatar + status */}
            <div className="flex items-start justify-between p-6 pb-0">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 animate-skeleton rounded-full" />
                <div className="space-y-2">
                  <div className="h-5 w-36 animate-skeleton rounded-md" />
                  <div className="h-3 w-24 animate-skeleton rounded-md" />
                </div>
              </div>
              <div className="h-7 w-20 animate-skeleton rounded-full" />
            </div>

            {/* Coin + direction */}
            <div className="flex items-center gap-3 px-6 pt-5">
              <div className="h-10 w-10 animate-skeleton rounded-full" />
              <div className="space-y-1.5">
                <div className="h-5 w-20 animate-skeleton rounded-md" />
                <div className="h-3 w-28 animate-skeleton rounded-md" />
              </div>
              <div className="ml-auto h-6 w-20 animate-skeleton rounded-full" />
            </div>

            {/* Source quote */}
            <div className="space-y-2 border-t border-border mx-6 mt-5 py-5">
              <div className="h-4 w-full animate-skeleton rounded-md" />
              <div className="h-4 w-4/5 animate-skeleton rounded-md" />
              <div className="h-3 w-32 animate-skeleton rounded-md" />
            </div>

            {/* Price grid */}
            <div className="grid grid-cols-2 gap-px border-t border-border bg-border sm:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-card p-4">
                  <div className="h-3 w-16 animate-skeleton rounded-md" />
                  <div className="mt-2 h-6 w-24 animate-skeleton rounded-md" />
                </div>
              ))}
            </div>

            {/* Meta row */}
            <div className="flex items-center gap-4 border-t border-border px-6 py-4">
              <div className="h-3 w-20 animate-skeleton rounded-md" />
              <div className="h-3 w-24 animate-skeleton rounded-md" />
              <div className="h-3 w-20 animate-skeleton rounded-md" />
            </div>
          </div>

          {/* Influencer stats card */}
          <div className="animate-shimmer rounded-xl border border-border p-5">
            <div className="flex items-center justify-between">
              <div className="h-4 w-28 animate-skeleton rounded-md" />
              <div className="h-3 w-20 animate-skeleton rounded-md" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i}>
                  <div className="h-3 w-14 animate-skeleton rounded-md" />
                  <div className="mt-2 h-6 w-16 animate-skeleton rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: chart + related */}
        <div className="space-y-8 lg:col-span-2">
          {/* Chart skeleton */}
          <div className="animate-shimmer overflow-hidden rounded-xl border border-border">
            <div className="flex items-center justify-between px-5 pt-5 pb-2">
              <div className="space-y-1.5">
                <div className="h-3 w-24 animate-skeleton rounded-md" />
                <div className="h-7 w-36 animate-skeleton rounded-md" />
              </div>
              <div className="flex gap-1 rounded-lg bg-elevated p-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-6 w-10 animate-skeleton rounded-md"
                  />
                ))}
              </div>
            </div>
            <div className="h-[240px] animate-skeleton mx-2 mb-4 rounded-lg" />
            <div className="flex items-center gap-4 border-t border-border px-5 py-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div className="h-2 w-2 animate-skeleton rounded-full" />
                  <div className="h-2 w-12 animate-skeleton rounded-md" />
                </div>
              ))}
            </div>
          </div>

          {/* Related predictions skeleton */}
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="h-5 w-40 animate-skeleton animate-shimmer rounded-md" />
              <div className="h-3 w-52 animate-skeleton animate-shimmer rounded-md" />
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="animate-shimmer rounded-xl border border-border p-4"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-6 w-6 animate-skeleton rounded-full" />
                  <div className="h-4 w-24 animate-skeleton rounded-md" />
                  <div className="ml-auto h-4 w-12 animate-skeleton rounded-md" />
                </div>
                <div className="h-3 w-full animate-skeleton rounded-md" />
                <div className="mt-1.5 h-3 w-3/4 animate-skeleton rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
