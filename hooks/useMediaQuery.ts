"use client";

import { useSyncExternalStore } from "react";

/**
 * Subscribes to a CSS media query. Renders as `false` on the server and during
 * hydration, then updates, so server and client markup always agree.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
