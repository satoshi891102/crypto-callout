export default function MethodologyLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      {/* Page header */}
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-40 animate-skeleton animate-shimmer rounded-lg" />
            <div className="h-5 w-24 animate-skeleton animate-shimmer rounded-md" />
          </div>
          <div className="h-4 w-[440px] max-w-full animate-skeleton animate-shimmer rounded-md" />
        </div>
        {/* Transparency callout */}
        <div className="h-20 animate-skeleton animate-shimmer rounded-xl border border-border" />
      </div>

      {/* Scoring section */}
      <div className="space-y-5">
        <div className="h-7 w-40 animate-skeleton animate-shimmer rounded-md" />
        <div className="h-4 w-full animate-skeleton animate-shimmer rounded-md" />
        {/* Formula */}
        <div className="h-28 animate-skeleton animate-shimmer rounded-xl border border-border" />
        {/* Factor cards */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-28 animate-skeleton animate-shimmer rounded-xl border border-border"
            style={{ animationDelay: `${i * 100}ms` }}
          />
        ))}
      </div>

      {/* Resolution rules */}
      <div className="space-y-5">
        <div className="h-7 w-56 animate-skeleton animate-shimmer rounded-md" />
        <div className="h-4 w-full animate-skeleton animate-shimmer rounded-md" />
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-48 animate-skeleton animate-shimmer rounded-xl border border-border"
              style={{ animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>
      </div>

      {/* Timeframes */}
      <div className="space-y-5">
        <div className="h-7 w-48 animate-skeleton animate-shimmer rounded-md" />
        <div className="h-64 animate-skeleton animate-shimmer rounded-xl border border-border" />
      </div>

      {/* FAQ */}
      <div className="space-y-5">
        <div className="h-7 w-64 animate-skeleton animate-shimmer rounded-md" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-14 animate-skeleton animate-shimmer rounded-xl border border-border"
            style={{ animationDelay: `${i * 80}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
