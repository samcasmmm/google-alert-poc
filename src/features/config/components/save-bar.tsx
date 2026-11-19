"use client";

import { useEffect, useState } from "react";
import { Check, Spinner } from "@/components/icons";
import { primaryButton, secondaryButton } from "@/components/ui";

/** How long "Saved" stays on screen after a save. */
const SAVED_MS = 4000;

/**
 * Appears at the bottom of the screen only when there is something to act on:
 * unsaved changes (Discard / Save), fields to fix, or briefly to confirm a save.
 */
export function SaveBar({
  dirty,
  saving,
  errorCount,
  savedAt,
  onDiscard,
}: {
  dirty: boolean;
  saving: boolean;
  errorCount: number;
  /** When this browser last saved, to confirm it briefly */
  savedAt: Date | null;
  onDiscard: () => void;
}) {
  // The form remounts after each save, so "just saved" is decided once on mount, then hidden by a timer.
  const [showSaved, setShowSaved] = useState(() => !!savedAt && Date.now() - savedAt.getTime() < SAVED_MS);
  useEffect(() => {
    if (!showSaved) return;
    const t = setTimeout(() => setShowSaved(false), SAVED_MS);
    return () => clearTimeout(t);
  }, [showSaved]);

  const active = dirty || saving || errorCount > 0;
  if (!active && !showSaved) return null;

  const status =
    errorCount > 0
      ? `Fix ${errorCount === 1 ? "the highlighted field" : `${errorCount} highlighted fields`} to save.`
      : dirty || saving
        ? "Unsaved changes"
        : "Saved";

  return (
    <div className="sticky bottom-0 z-20 -mx-4 mt-10 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur-sm motion-safe:animate-pop sm:-mx-8 sm:px-8">
      <div className="flex items-center justify-between gap-3">
        <p
          role="status"
          className={`inline-flex items-center gap-1.5 text-sm ${errorCount ? "text-accent" : active ? "font-medium text-ink" : "text-muted"}`}
        >
          {!active && <Check size={16} />}
          {status}
        </p>
        {active && (
          <div className="flex shrink-0 gap-2">
            <button type="button" onClick={onDiscard} disabled={saving} className={secondaryButton}>
              Discard
            </button>
            <button type="submit" disabled={saving} className={`${primaryButton} gap-2`} title="Save (Ctrl+S)">
              {saving && <Spinner size={16} />}
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
