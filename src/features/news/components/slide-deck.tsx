"use client";

import { createContext, use, useCallback, useEffect, useState, type ReactNode } from "react";
import { AppNav } from "@/components/app-nav";
import { ArrowLeft, ArrowRight, Expand, Restart } from "@/components/icons";
import { primaryButton } from "@/components/ui";
import { Countdown } from "./countdown";

const DeckContext = createContext<(() => void) | null>(null);

/** "Start over" for the end slide: jumps to the first slide and resets the timer. */
export function RestartButton() {
  const restart = use(DeckContext);
  if (!restart) return null;
  return (
    <button type="button" onClick={restart} className={`${primaryButton} gap-2`}>
      <Restart size={16} />
      Start over
    </button>
  );
}

const STANDUP_SECONDS = 5 * 60;

function isInteractive(target: EventTarget | null): boolean {
  return target instanceof HTMLElement && !!target.closest("a, button, input, textarea, select");
}

const iconButton =
  "inline-flex size-11 items-center justify-center rounded-full border border-line text-ink transition-[background-color,transform] hover:bg-subtle active:scale-95 disabled:pointer-events-none disabled:opacity-35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

/**
 * Full-screen slides. → / Space / click right two-thirds = next, ← / click left third = previous,
 * F = fullscreen, P = pause timer, R = reset timer. The timer starts on the first advance.
 */
export function SlideDeck({ slides }: { slides: ReactNode[] }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const last = slides.length - 1;

  const go = useCallback(
    (target: number | "first" | "last") => {
      const next =
        target === "first" ? 0 : target === "last" ? last : Math.min(last, Math.max(0, index + target));
      if (next === index) return;
      setDirection(next > index ? "next" : "prev");
      setIndex(next);
      if (!timerStarted && next > index) {
        setTimerStarted(true);
        setTimerRunning(true);
      }
    },
    [index, last, timerStarted],
  );

  const toggleTimer = useCallback(() => {
    setTimerStarted(true);
    setTimerRunning((r) => !r);
  }, []);

  const resetTimer = useCallback(() => {
    setTimerKey((k) => k + 1);
    setTimerRunning(false);
    setTimerStarted(false);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void document.documentElement.requestFullscreen?.();
  }, []);

  /** Back to the title slide with a fresh timer (it starts again on the next advance). */
  const restart = useCallback(() => {
    setDirection("prev");
    setIndex(0);
    resetTimer();
  }, [resetTimer]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if ((e.key === " " || e.key === "Enter") && isInteractive(e.target)) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
        case "PageDown":
        case " ":
          e.preventDefault();
          go(1);
          break;
        case "ArrowLeft":
        case "ArrowUp":
        case "PageUp":
          e.preventDefault();
          go(-1);
          break;
        case "Home":
          go("first");
          break;
        case "End":
          go("last");
          break;
        case "f":
        case "F":
          toggleFullscreen();
          break;
        case "p":
        case "P":
          toggleTimer();
          break;
        case "r":
        case "R":
          resetTimer();
          break;
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, resetTimer, toggleFullscreen, toggleTimer]);

  function onClick(e: React.MouseEvent<HTMLElement>) {
    if (isInteractive(e.target)) return;
    if (window.getSelection()?.toString()) return; // let people select text
    const { left, width } = e.currentTarget.getBoundingClientRect();
    go(e.clientX - left < width / 3 ? -1 : 1);
  }

  return (
    <DeckContext value={restart}>
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-paper text-ink">
      <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-1 sm:px-8">
        <AppNav />
        <div className="flex items-center gap-2">
          <Countdown key={timerKey} seconds={STANDUP_SECONDS} running={timerRunning} onToggle={toggleTimer} />
          <button
            type="button"
            onClick={toggleFullscreen}
            className={`${iconButton} hidden border-transparent sm:inline-flex`}
            aria-label="Toggle fullscreen (F)"
            title="Fullscreen (F)"
          >
            <Expand />
          </button>
        </div>
      </header>

      <main
        id="main"
        onClick={onClick}
        className="relative flex-1 cursor-pointer overflow-x-hidden overflow-y-auto overscroll-contain"
        aria-roledescription="carousel"
        aria-label="Today's briefing"
      >
        <div
          key={index}
          role="group"
          aria-roledescription="slide"
          aria-label={`${index + 1} of ${slides.length}`}
          className={`flex min-h-full w-full flex-col justify-center px-4 py-10 sm:px-12 lg:px-20 ${
            direction === "next" ? "motion-safe:animate-slide-next" : "motion-safe:animate-slide-prev"
          }`}
        >
          {slides[index]}
        </div>
      </main>

      <footer className="flex items-center gap-3 px-4 pt-2 pb-4 sm:gap-4 sm:px-8 sm:pb-6">
        <button type="button" onClick={() => go(-1)} disabled={index === 0} className={iconButton} aria-label="Previous slide">
          <ArrowLeft />
        </button>
        <div
          className="h-0.5 flex-1 overflow-hidden rounded-full bg-line"
          role="progressbar"
          aria-label="Briefing progress"
          aria-valuemin={1}
          aria-valuemax={slides.length}
          aria-valuenow={index + 1}
        >
          <div
            className="h-full origin-left rounded-full bg-accent transition-transform duration-500 ease-arrive"
            style={{ transform: `scaleX(${slides.length > 1 ? index / last : 1})` }}
          />
        </div>
        <span className="min-w-12 text-right font-mono text-xs text-muted tabular-nums" aria-live="polite">
          {index + 1}/{slides.length}
        </span>
        <button type="button" onClick={() => go(1)} disabled={index === last} className={iconButton} aria-label="Next slide">
          <ArrowRight />
        </button>
      </footer>
    </div>
    </DeckContext>
  );
}
