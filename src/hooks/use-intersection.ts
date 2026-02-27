"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface UseIntersectionOptions {
  /** Element that is used as the viewport. Defaults to browser viewport. */
  root?: Element | null;
  /** Margin around the root. e.g. "0px 0px -100px 0px" */
  rootMargin?: string;
  /** Percentage of target visibility to trigger. 0–1. */
  threshold?: number | number[];
  /** Only trigger the first time the element enters the viewport, then disconnect. */
  triggerOnce?: boolean;
  /** Start observing immediately. Set false to delay observation. */
  enabled?: boolean;
}

interface UseIntersectionReturn {
  /** Ref callback — attach to the element you want to observe. */
  ref: (node: Element | null) => void;
  /** Whether the element is currently intersecting. */
  isIntersecting: boolean;
  /** The raw IntersectionObserverEntry, if available. */
  entry: IntersectionObserverEntry | null;
}

export function useIntersection(
  options: UseIntersectionOptions = {}
): UseIntersectionReturn {
  const {
    root = null,
    rootMargin = "0px",
    threshold = 0,
    triggerOnce = false,
    enabled = true,
  } = options;

  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const nodeRef = useRef<Element | null>(null);
  const triggeredRef = useRef(false);

  const cleanup = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
  }, []);

  const observe = useCallback(() => {
    cleanup();

    if (!enabled || !nodeRef.current) return;
    if (triggerOnce && triggeredRef.current) return;

    observerRef.current = new IntersectionObserver(
      ([intersectionEntry]) => {
        setEntry(intersectionEntry);
        setIsIntersecting(intersectionEntry.isIntersecting);

        if (intersectionEntry.isIntersecting && triggerOnce) {
          triggeredRef.current = true;
          cleanup();
        }
      },
      { root, rootMargin, threshold }
    );

    observerRef.current.observe(nodeRef.current);
  }, [enabled, root, rootMargin, threshold, triggerOnce, cleanup]);

  // Ref callback for attaching to a DOM element
  const ref = useCallback(
    (node: Element | null) => {
      nodeRef.current = node;
      observe();
    },
    [observe]
  );

  // Re-observe when options change
  useEffect(() => {
    observe();
    return cleanup;
  }, [observe, cleanup]);

  return { ref, isIntersecting, entry };
}
