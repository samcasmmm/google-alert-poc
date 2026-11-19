"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Expand } from "@/components/icons";
import { SiteHeader } from "@/components/site-header";
import { DeckContext } from "./deck-context";


function isInteractive(target: EventTarget | null): boolean {
  return target instanceof HTMLElement && !!target.closest("a, button, input, textarea, select");
}

const iconButton =
  "inline-flex size-11 items-center justify-center rounded-full border border-line text-ink transition-[background-color,transform] hover:bg-subtle active:scale-95 disabled:pointer-events-none disabled:opacity-35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

/**
 * Full-screen slides. → / Space / click right two-thirds = next, ← / click left third = previous,
 * Home / End = first / last, F = fullscreen.
 */
export function SlideDeck({
  slides,
  actions,
}: {
  slides: ReactNode[];
  /** extra header controls, e.g. export */
  actions?: ReactNode;
}) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const last = slides.length - 1;

  const go = useCallback(
    (target: number | "first" | "last") => {
      const next =
        target === "first" ? 0 : target === "last" ? last : Math.min(last, Math.max(0, index + target));
      if (next === index) return;
      setDirection(next > index ? "next" : "prev");
      setIndex(next);
    },
    [index, last],
  );

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void document.documentElement.requestFullscreen?.();
  }, []);

  const restart = useCallback(() => {
    setDirection("prev");
    setIndex(0);
  }, []);

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
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, toggleFullscreen]);

  function onClick(e: React.MouseEvent<HTMLElement>) {
    if (isInteractive(e.target)) return;
    if (window.getSelection()?.toString()) return; // let people select text
    const { left, width } = e.currentTarget.getBoundingClientRect();
    go(e.clientX - left < width / 3 ? -1 : 1);
  }

  return (
    <DeckContext value={restart}>
      <div className="fixed inset-0 flex flex-col overflow-hidden bg-paper text-ink">
        <SiteHeader
          actions={
            <>
              {actions}
              <button
                type="button"
                onClick={toggleFullscreen}
                className={`${iconButton} hidden border-transparent sm:inline-flex`}
                aria-label="Toggle fullscreen (F)"
                title="Fullscreen (F)"
              >
                <Expand />
              </button>
            </>
          }
        />

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
