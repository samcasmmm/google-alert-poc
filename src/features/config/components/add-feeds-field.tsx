"use client";

import { useState } from "react";
import { secondaryButton, inputClass } from "@/components/ui";
import { isHttpUrl } from "../schema";

/** Paste one or several feed URLs (one per line, or separated by spaces/commas) and add them as rows. */
export function AddFeedsField({ existing, onAdd }: { existing: string[]; onAdd: (urls: string[]) => void }) {
  const [text, setText] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  function add() {
    const candidates = text.split(/[\s,]+/).map((s) => s.trim()).filter(Boolean);
    if (candidates.length === 0) return;
    const invalid = candidates.filter((u) => !isHttpUrl(u));
    const fresh = [...new Set(candidates.filter((u) => isHttpUrl(u) && !existing.includes(u)))];
    const duplicates = candidates.length - invalid.length - fresh.length;

    if (fresh.length) onAdd(fresh);
    const notes = [
      invalid.length && `${invalid.length} ${invalid.length === 1 ? "entry isn’t" : "entries aren’t"} a feed URL`,
      duplicates > 0 && `${duplicates} already in the list`,
    ].filter(Boolean);
    setMessage(notes.length ? `Skipped: ${notes.join(", ")}.` : null);
    setText(invalid.join("\n"));
  }

  return (
    <div>
      <label htmlFor="add-feeds" className="text-sm font-medium">
        Add feeds
      </label>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-start">
        <textarea
          id="add-feeds"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              add();
            }
          }}
          rows={1}
          placeholder="Paste one or more feed URLs"
          spellCheck={false}
          aria-describedby={message ? "add-feeds-message" : undefined}
          className={`${inputClass} field-sizing-content min-h-11 resize-none font-mono text-sm`}
        />
        <button type="button" onClick={add} disabled={!text.trim()} className={`${secondaryButton} shrink-0`}>
          Add
        </button>
      </div>
      {message && (
        <p id="add-feeds-message" role="status" className="mt-1.5 text-sm text-accent">
          {message}
        </p>
      )}
    </div>
  );
}
