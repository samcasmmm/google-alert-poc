"use client";

import { useEffect, useState } from "react";
import { Pause, Play } from "@/components/icons";

function format(ms: number): string {
  const total = Math.ceil(Math.abs(ms) / 1000);
  const m = Math.floor(total / 60);
  const s = String(total % 60).padStart(2, "0");
  return `${ms < 0 ? "+" : ""}${m}:${s}`;
}

/** Counts down while `running`; pauses while the tab is hidden; shows overtime as +m:ss. */
export function Countdown({
  seconds,
  running,
  onToggle,
}: {
  seconds: number;
  running: boolean;
  onToggle: () => void;
}) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!running) return;
    let last = performance.now();
    const timer = setInterval(() => {
      const now = performance.now();
      if (!document.hidden) setElapsed((e) => e + (now - last));
      last = now;
    }, 250);
    return () => clearInterval(timer);
  }, [running]);

  const remaining = seconds * 1000 - elapsed;
  const overtime = remaining < 0;
  const tone = overtime ? "border-accent text-accent" : remaining < 60_000 ? "text-amber-800" : "text-ink";
  const started = elapsed > 0;

  return (
    <button
      type="button"
      onClick={onToggle}
      title={running ? "Pause timer (P) · Reset (R)" : "Start timer (P) · Reset (R)"}
      aria-label={`Timer ${format(remaining)}${overtime ? " over time" : ""}, ${running ? "running. Pause" : "paused. Start"}`}
      className={`inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-3.5 font-mono text-base tabular-nums transition-colors hover:bg-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${tone}`}
    >
      {running ? <Pause size={14} /> : <Play size={14} />}
      {format(remaining)}
      {!running && started && <span className="font-sans text-xs text-muted">Paused</span>}
    </button>
  );
}
