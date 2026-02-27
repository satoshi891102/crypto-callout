"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { SPRING_TRANSITION } from "@/lib/constants";

interface CountUpProps {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  formatter?: (value: number) => string;
}

export function CountUp({
  value,
  duration = 1.2,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
  formatter,
}: CountUpProps) {
  const spring = useSpring(0, {
    stiffness: SPRING_TRANSITION.stiffness,
    damping: SPRING_TRANSITION.damping,
  });

  const display = useTransform(spring, (current) => {
    if (formatter) return `${prefix}${formatter(current)}${suffix}`;
    return `${prefix}${current.toFixed(decimals)}${suffix}`;
  });

  const [displayValue, setDisplayValue] = useState(
    formatter
      ? `${prefix}${formatter(0)}${suffix}`
      : `${prefix}${(0).toFixed(decimals)}${suffix}`
  );

  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  useEffect(() => {
    const unsubscribe = display.on("change", (v) => {
      setDisplayValue(v);
    });
    return unsubscribe;
  }, [display]);

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={SPRING_TRANSITION}
    >
      {displayValue}
    </motion.span>
  );
}
