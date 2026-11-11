"use client";

import { useCallback, useSyncExternalStore } from "react";
import { dateKey } from "./date";

function subscribe(onChange: () => void) {
  const timer = setInterval(onChange, 60_000);
  return () => clearInterval(timer);
}

/** Today's date key in `timeZone` (browser zone if empty); null during server render. */
export function useToday(timeZone?: string): string | null {
  const getSnapshot = useCallback(() => dateKey(new Date(), timeZone || undefined), [timeZone]);
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}
