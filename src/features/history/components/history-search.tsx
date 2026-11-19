"use client";

import { useEffect, useRef } from "react";
import { Search } from "@/components/icons";

/** Search across saved stories. "/" focuses it from anywhere on the page; Escape clears, then leaves. */
export function HistorySearch({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target;
      if (t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement || (t as HTMLElement)?.isContentEditable) return;
      e.preventDefault();
      input.current?.focus();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="relative w-full sm:w-80">
      <label htmlFor="history-search" className="sr-only">
        Search saved stories
      </label>
      <Search size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted" />
      <input
        ref={input}
        id="history-search"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key !== "Escape") return;
          if (value) onChange("");
          else input.current?.blur();
        }}
        placeholder="Search saved stories"
        autoComplete="off"
        spellCheck={false}
        className="min-h-11 w-full rounded-lg border border-line bg-paper py-2 pr-10 pl-9 text-ink transition-colors placeholder:text-muted focus:border-ink focus:outline-none [&::-webkit-search-cancel-button]:hidden"
      />
      {!value && (
        <kbd
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 rounded border border-line px-1.5 font-sans text-xs text-muted sm:block"
        >
          /
        </kbd>
      )}
    </div>
  );
}
