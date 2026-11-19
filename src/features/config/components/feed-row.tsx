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
    <li className="grid gap-2 sm:grid-cols-[10rem_minmax(0,1fr)_auto] sm:items-start">
      <input
        value={row.label}
        onChange={(e) => onChange({ ...row, label: e.target.value })}
        placeholder="Name"
        aria-label={`Name for feed ${position}`}
        maxLength={40}
        className={`${inputClass} font-medium`}
      />
      <div className="min-w-0">
        <input
          value={row.url}
          onChange={(e) => onChange({ ...row, url: e.target.value })}
          placeholder="https://www.google.com/alerts/feeds/…"
          aria-label={`URL of ${name}`}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          spellCheck={false}
          inputMode="url"
          className={`${inputClass} font-mono text-sm ${error ? "border-accent" : ""}`}
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
        className="inline-flex size-11 items-center justify-center justify-self-end rounded-lg text-muted transition-colors hover:bg-subtle hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <Trash size={17} />
      </button>
    </li>
  );
}
