"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  Trophy,
  Target,
  Users,
  PlusCircle,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SPRING_TRANSITION } from "@/lib/constants";

const ICON_MAP: Record<string, LucideIcon> = {
  home: Home,
  trophy: Trophy,
  target: Target,
  users: Users,
  "plus-circle": PlusCircle,
};

interface NavLinkProps {
  href: string;
  label: string;
  icon?: string;
  onClick?: () => void;
  className?: string;
}

export function NavLink({ href, label, icon, onClick, className }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
  const Icon = icon ? ICON_MAP[icon] : null;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
        isActive
          ? "text-foreground"
          : "text-text-secondary hover:text-foreground",
        className
      )}
    >
      {Icon && <Icon className="h-4 w-4" />}
      <span>{label}</span>
      {isActive && (
        <motion.div
          layoutId="nav-active-indicator"
          className="absolute inset-0 rounded-md bg-secondary"
          style={{ zIndex: -1 }}
          transition={SPRING_TRANSITION}
        />
      )}
    </Link>
  );
}

interface MobileNavLinkProps {
  href: string;
  label: string;
  icon?: string;
  onClick?: () => void;
}

export function MobileNavLink({ href, label, icon, onClick }: MobileNavLinkProps) {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
  const Icon = icon ? ICON_MAP[icon] : null;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 text-xs font-medium transition-colors",
        isActive
          ? "text-primary"
          : "text-text-muted hover:text-text-secondary"
      )}
    >
      {Icon && <Icon className={cn("h-5 w-5", isActive && "text-primary")} />}
      <span>{label}</span>
      {isActive && (
        <motion.div
          layoutId="mobile-nav-dot"
          className="absolute -top-1 h-0.5 w-6 rounded-full bg-primary"
          transition={SPRING_TRANSITION}
        />
      )}
    </Link>
  );
}
