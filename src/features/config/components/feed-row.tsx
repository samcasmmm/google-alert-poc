"use client";

import { useState } from "react";
import { Pencil, Trash } from "@/components/icons";
import { inputClass } from "@/components/ui";
import type { FeedRow as Row } from "../draft";
import { feedKind, nameFromTitle, type FeedStatus as Status } from "../feed-check";
import { FeedStatus } from "./feed-status";

const iconButton =
  "inline-flex size-10 items-center justify-center rounded-lg text-muted transition-colors hover:bg-subtle hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

/**
 * One feed, shown by what it is rather than its long URL: an editable name, the feed
 * type (Google Alert or the site), and whether it works. The link opens for editing on
 * demand, and opens by itself when it isn't valid.
 */
export function FeedRow({
  row,
  position,
  status,
  error,
  onChange,
  onRemove,
  onCheck,
}: {
  row: Row;
  position: number;
  status?: Status;
  error?: string;
  onChange: (row: Row) => void;
  onRemove: () => void;
  onCheck: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const suggested = status?.state === "ok" && status.title ? nameFromTitle(status.title) : "";
  const name = row.label.trim() || suggested || `Feed ${position}`;
  const showLink = editing || !!error || !row.url.trim();
  const linkId = `${row.id}-url`;
  const errorId = `${row.id}-error`;

  return (
    <li className="rounded-xl border border-line px-4 py-3 transition-colors focus-within:border-ink/40">
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <input
            value={row.label}
            onChange={(e) => onChange({ ...row, label: e.target.value })}
            placeholder={suggested || "Name this feed"}
            title={suggested && !row.label.trim() ? `Suggested from the feed’s title: ${suggested}` : undefined}
            aria-label={`Name of feed ${position}`}
            maxLength={40}
            className="-mx-1.5 w-[calc(100%+0.75rem)] rounded-md bg-transparent px-1.5 py-0.5 text-base font-semibold text-ink placeholder:font-semibold placeholder:text-ink/45 hover:bg-subtle focus:bg-subtle focus:outline-none"
          />
          <p className="truncate text-sm text-muted" title={row.url}>
            {feedKind(row.url)}
          </p>
          <FeedStatus status={status} />
        </div>

        <button
          type="button"
          onClick={() => setEditing((e) => !e)}
          aria-expanded={showLink}
          aria-controls={linkId}
          aria-label={`Edit link of ${name}`}
          title="Edit link"
          className={iconButton}
        >
          <Pencil size={16} />
        </button>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${name}`}
          title="Remove feed"
          className={`${iconButton} hover:text-accent`}
        >
          <Trash size={16} />
        </button>
      </div>

      {showLink && (
        <div className="mt-3">
          <label htmlFor={linkId} className="text-sm font-medium">
            Feed link
          </label>
          <div className="mt-1.5 flex flex-col gap-2 sm:flex-row sm:items-start">
            {/* A one-line textarea so long feed URLs wrap and stay fully visible. */}
            <textarea
              id={linkId}
              rows={1}
              value={row.url}
              onChange={(e) => onChange({ ...row, url: e.target.value.replace(/\s+/g, "") })}
              onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
              placeholder="https://www.google.com/alerts/feeds/…"
              aria-invalid={!!error}
              aria-describedby={error ? errorId : undefined}
              spellCheck={false}
              inputMode="url"
              className={`${inputClass} field-sizing-content resize-none font-mono text-sm leading-relaxed break-all ${error ? "border-accent" : ""}`}
            />
            <button
              type="button"
              onClick={onCheck}
              disabled={!!error || !row.url.trim() || status?.state === "checking"}
              className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg border border-line px-4 text-sm font-medium text-ink transition-colors hover:bg-subtle disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Check
            </button>
          </div>
          {error && (
            <p id={errorId} className="mt-1 text-sm text-accent">
              {error}
            </p>
          )}
        </div>
      )}
    </li>
  );
}
