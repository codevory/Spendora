import { useCallback, useEffect, useRef } from "react";

interface RateLimiterProps<T extends (...args: any[]) => any> {
  func: T;
  delay: number;
}

export function useRateLimiter<T extends (...args: any[]) => any>({
  func,
  delay,
}: RateLimiterProps<T>) {
  const lockedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const funcRef = useRef(func);

  useEffect(() => {
    funcRef.current = func;
  }, [func]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = null;
      lockedRef.current = false;
    };
  }, [delay]);

  return useCallback(
    (...args: Parameters<T>) => {
      if (lockedRef.current) {
        return;
      }

      funcRef.current(...args);
      lockedRef.current = true;

      timerRef.current = setTimeout(() => {
        lockedRef.current = false;
        timerRef.current = null;
      }, delay);
    },
    [delay],
  );
}
