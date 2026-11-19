import { MAX_ITEMS, MIN_ITEMS } from "../schema";

const OPTIONS = Array.from({ length: MAX_ITEMS - MIN_ITEMS + 1 }, (_, i) => MIN_ITEMS + i);

/** Stories per briefing as a small segmented radio group (only a few valid values). */
export function StoryCountPicker({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <fieldset>
      <legend className="text-sm font-medium">Stories per briefing</legend>
      <p className="mt-0.5 text-sm text-muted">A 5-minute standup fits 6 or 7.</p>
      <div className="mt-2 inline-flex rounded-lg border border-line p-1">
        {OPTIONS.map((n) => (
          <label
            key={n}
            className="relative inline-flex min-h-10 min-w-12 cursor-pointer items-center justify-center rounded-md px-3 text-sm font-medium text-muted transition-colors hover:text-ink has-checked:bg-ink has-checked:text-paper has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent"
          >
            <input
              type="radio"
              name="story-count"
              value={n}
              checked={value === n}
              onChange={() => onChange(n)}
              className="sr-only"
            />
            {n}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
