"use client";

import { useEffect } from "react";
import { formatDayShort } from "@/lib/date";

const VISIBLE_MS = 8000;

/** "Deleted … Undo" bar shown after removing a day; dismisses itself after a few seconds. */
export function DeleteNotice({
  date,
  onUndo,
  onDismiss,
}: {
  date: string;
  onUndo: () => void;
  onDismiss: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onDismiss, VISIBLE_MS);
    return () => clearTimeout(t);
  }, [date, onDismiss]);

  return (
    <div
      role="status"
      className="fixed inset-x-4 bottom-6 z-40 mx-auto flex max-w-md items-center justify-between gap-4 rounded-xl bg-ink py-2 pr-2 pl-5 text-sm text-paper shadow-[0_12px_32px_-12px_rgb(17_17_17/0.45)] motion-safe:animate-pop"
    >
      <span>Deleted the briefing for {formatDayShort(date)}.</span>
      <button
        type="button"
        data-testid="undo-delete"
        onClick={onUndo}
        className="inline-flex min-h-10 items-center rounded-lg px-4 font-semibold text-paper underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
      >
        Undo
      </button>
    </div>
  );
}
