export default function AuthLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Logo / branding */}
        <div className="flex flex-col items-center space-y-2">
          <div className="h-10 w-10 animate-skeleton animate-shimmer rounded-xl" />
          <div className="h-6 w-32 animate-skeleton animate-shimmer rounded-md" />
          <div className="h-4 w-56 animate-skeleton animate-shimmer rounded-md" />
        </div>

        {/* Form card */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          {/* Social login button */}
          <div className="h-10 w-full animate-skeleton animate-shimmer rounded-md" />

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <div className="h-3 w-8 animate-skeleton rounded-md" />
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Email field */}
          <div className="space-y-2">
            <div className="h-3.5 w-12 animate-skeleton animate-shimmer rounded-md" />
            <div className="h-10 w-full animate-skeleton animate-shimmer rounded-md" />
          </div>

          {/* Password field */}
          <div className="space-y-2">
            <div className="h-3.5 w-16 animate-skeleton animate-shimmer rounded-md" />
            <div className="h-10 w-full animate-skeleton animate-shimmer rounded-md" />
          </div>

          {/* Submit button */}
          <div className="h-10 w-full animate-skeleton animate-shimmer rounded-md" />
        </div>

        {/* Footer link */}
        <div className="flex justify-center">
          <div className="h-3.5 w-48 animate-skeleton animate-shimmer rounded-md" />
        </div>
      </div>
    </div>
  );
}
