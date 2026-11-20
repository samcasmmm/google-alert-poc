"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { checkFeed, type FeedStatus } from "./feed-check";
import { isHttpUrl } from "./schema";

/**
 * Check status per feed URL. The feeds present on mount are checked straight away
 * (they start as "checking", recent results are reused); `check` always re-fetches.
 */
export function useFeedChecks(initialUrls: string[]) {
  const [initial] = useState(() => [...new Set(initialUrls.filter(isHttpUrl))]);
  const [statuses, setStatuses] = useState<Record<string, FeedStatus>>(() =>
    Object.fromEntries(initial.map((url) => [url, { state: "checking" } as FeedStatus])),
  );
  const latest = useRef<Record<string, number>>({});

  const run = useCallback(async (url: string, fresh: boolean): Promise<FeedStatus> => {
    const ticket = (latest.current[url] ?? 0) + 1;
    latest.current[url] = ticket;
    const result = await checkFeed(url, { fresh });
    // Ignore an older answer if the same URL was re-checked meanwhile.
    if (latest.current[url] === ticket) setStatuses((s) => ({ ...s, [url]: result }));
    return result;
  }, []);

  useEffect(() => {
    for (const url of initial) void run(url, false);
  }, [initial, run]);

  const check = useCallback(
    (url: string): Promise<FeedStatus> => {
      setStatuses((s) => ({ ...s, [url]: { state: "checking" } }));
      return run(url, true);
    },
    [run],
  );

  return { statuses, check };
}
