import { SLIDE_LAYOUT_OPTIONS, type SlideLayout } from "../schema";
import { LayoutPreview } from "./layout-preview";

/** Slide layout as radio cards with a schematic preview of each. */
export function LayoutPicker({ value, onChange }: { value: SlideLayout; onChange: (value: SlideLayout) => void }) {
  return (
    <fieldset>
      <legend className="text-sm font-medium">Slide layout</legend>
      <p className="mt-0.5 text-sm text-muted">How stories look on Today. The content is the same in every layout.</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {SLIDE_LAYOUT_OPTIONS.map((option) => (
          <label
            key={option.value}
            className="group cursor-pointer rounded-xl border border-line p-3 transition-colors hover:border-ink/40 has-checked:border-ink has-checked:ring-1 has-checked:ring-ink has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent"
          >
            <input
              type="radio"
              name="slideLayout"
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            <LayoutPreview layout={option.value} />
            <span className="mt-3 flex items-center justify-between text-sm font-semibold">
              {option.label}
              <span
                aria-hidden
                className="size-4 rounded-full border border-line group-has-checked:border-[5px] group-has-checked:border-ink"
              />
            </span>
            <span className="mt-1 block text-xs leading-relaxed text-muted">{option.description}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
