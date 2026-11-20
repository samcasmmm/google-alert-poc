"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { checkGroqKey, type GroqKeyStatus } from "./groq-check";

/**
 * Key check state for the Groq key field. A saved key is checked on mount; `check`
 * re-checks on demand. The status belongs to one key, so editing the key clears it.
 */
export function useGroqKeyCheck(apiKey: string) {
  const key = apiKey.trim();
  const [initialKey] = useState(key);
  const [result, setResult] = useState<{ key: string; status: GroqKeyStatus } | null>(() =>
    initialKey ? { key: initialKey, status: { state: "checking" } } : null,
  );
  const latest = useRef(0);

  const run = useCallback(async (k: string, fresh: boolean) => {
    const ticket = ++latest.current;
    const status = await checkGroqKey(k, { fresh });
    if (latest.current === ticket) setResult({ key: k, status });
  }, []);

  useEffect(() => {
    if (initialKey) void run(initialKey, false);
  }, [initialKey, run]);

  const check = useCallback(
    (k: string, { fresh = true } = {}) => {
      if (!k) return;
      setResult({ key: k, status: { state: "checking" } });
      void run(k, fresh);
    },
    [run],
  );

  const status = result && result.key === key ? result.status : undefined;
  return { status, check };
}
