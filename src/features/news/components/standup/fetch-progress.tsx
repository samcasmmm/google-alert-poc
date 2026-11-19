"use client";

import { useEffect, useState } from "react";

/** Indeterminate progress for the 5–15s fetch, with elapsed time so the wait is explained. */
export function FetchProgress() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="max-w-xl">
      <div className="h-0.5 overflow-hidden rounded-full bg-line">
        <div className="h-full w-2/5 rounded-full bg-accent motion-safe:animate-progress" />
      </div>
      <p className="mt-2 text-sm text-muted">
        {seconds < 4 ? "Reading your feeds…" : "Summarizing with Groq…"}{" "}
        <span className="font-mono tabular-nums">{seconds}s</span>
      </p>
    </div>
  );
}
