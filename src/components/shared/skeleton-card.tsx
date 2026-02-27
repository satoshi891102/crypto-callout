import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  lines?: number;
  showAvatar?: boolean;
  className?: string;
}

export function SkeletonCard({
  lines = 3,
  showAvatar = false,
  className,
}: SkeletonCardProps) {
  return (
    <div
      className={cn(
        "animate-shimmer rounded-xl border border-border bg-card p-5",
        className
      )}
    >
      {showAvatar && (
        <div className="mb-4 flex items-center gap-3">
          <div className="h-10 w-10 animate-skeleton rounded-full" />
          <div className="space-y-1.5 flex-1">
            <div className="h-4 w-28 animate-skeleton rounded-md" />
            <div className="h-3 w-20 animate-skeleton rounded-md" />
          </div>
        </div>
      )}

      <div className="space-y-2.5">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-3 animate-skeleton rounded-md"
            style={{ width: `${90 - i * 15}%` }}
          />
        ))}
      </div>
    </div>
  );
}
