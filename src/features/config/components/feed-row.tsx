import { Trash } from "@/components/icons";
import { inputClass } from "@/components/ui";
import type { FeedRow as Row } from "../draft";

/** One feed: an optional name, its URL, and a remove button. */
export function FeedRow({
  row,
  position,
  error,
  onChange,
  onRemove,
}: {
  row: Row;
  position: number;
  error?: string;
  onChange: (row: Row) => void;
  onRemove: () => void;
}) {
  const name = row.label.trim() || `feed ${position}`;
  const errorId = `${row.id}-error`;
  return (
    <li className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 sm:grid-cols-[15rem_minmax(0,1fr)_auto] sm:items-start">
      <input
        value={row.label}
        onChange={(e) => onChange({ ...row, label: e.target.value })}
        placeholder="Name"
        aria-label={`Name for feed ${position}`}
        maxLength={40}
        className={`${inputClass} font-medium`}
      />
      <div className="col-span-2 row-start-2 min-w-0 sm:col-span-1 sm:col-start-2 sm:row-start-1">
        {/* A one-line textarea so long feed URLs wrap and their distinguishing end stays visible. */}
        <textarea
          rows={1}
          value={row.url}
          onChange={(e) => onChange({ ...row, url: e.target.value.replace(/\s+/g, "") })}
          onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
          placeholder="https://www.google.com/alerts/feeds/…"
          aria-label={`URL of ${name}`}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          spellCheck={false}
          inputMode="url"
          className={`${inputClass} field-sizing-content resize-none font-mono text-sm leading-relaxed break-all ${error ? "border-accent" : ""}`}
        />
        {error && (
          <p id={errorId} className="mt-1 text-sm text-accent">
            {error}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${name}`}
        title="Remove feed"
        className="col-start-2 row-start-1 inline-flex size-11 items-center justify-center justify-self-end rounded-lg text-muted transition-colors hover:bg-subtle hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:col-start-3 sm:row-start-1"
      >
        <Trash size={17} />
      </button>
    </li>
  );
}
