import { cn } from "@/lib/utils";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <div className={cn("animate-[fadeInUp_0.4s_ease-out_both]", className)}>
      {children}
    </div>
  );
}
