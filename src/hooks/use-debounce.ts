"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Returns a debounced version of the provided value.
 * Updates only after the specified delay has elapsed since the last change.
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Returns a debounced version of a callback function.
 * The callback will only fire after the specified delay since the last invocation.
 */
export function useDebouncedCallback<T extends (...args: never[]) => void>(
  callback: T,
  delay: number = 300
): { call: (...args: Parameters<T>) => void; cancel: () => void; isPending: boolean } {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef(callback);
  const [isPending, setIsPending] = useState(false);

  // Keep callback ref fresh without re-creating the debounced function
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsPending(false);
  }, []);

  const call = useCallback(
    (...args: Parameters<T>) => {
      cancel();
      setIsPending(true);
      timerRef.current = setTimeout(() => {
        callbackRef.current(...args);
        setIsPending(false);
        timerRef.current = null;
      }, delay);
    },
    [delay, cancel]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return { call, cancel, isPending };
}
