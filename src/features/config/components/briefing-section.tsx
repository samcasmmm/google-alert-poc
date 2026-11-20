import type { SlideLayout } from "../schema";
import { FormField } from "./form-field";
import { FormSection } from "./form-section";
import { LayoutPicker } from "./layout-picker";
import { StoryCountPicker } from "./story-count-picker";
import { TimeZonePicker } from "./time-zone-picker";

/** How the daily briefing is shaped: length, which day "today" is, and the slide design. */
export function BriefingSection({
  maxItems,
  timeZone,
  slideLayout,
  timeZoneError,
  onChange,
}: {
  maxItems: number;
  timeZone: string;
  slideLayout: SlideLayout;
  timeZoneError?: string;
  onChange: (patch: { maxItems?: number; timeZone?: string; slideLayout?: SlideLayout }) => void;
}) {
  return (
    <FormSection id="briefing" title="Briefing">
      <div className="space-y-8">
        <StoryCountPicker value={maxItems} onChange={(n) => onChange({ maxItems: n })} />

        <FormField
          label="Time zone"
          hint="Decides when a new day starts, so the briefing rolls over at your midnight."
          htmlFor="cfg-tz"
          error={timeZoneError}
          errorId="cfg-tz-error"
        >
          <TimeZonePicker
            id="cfg-tz"
            value={timeZone}
            onChange={(tz) => onChange({ timeZone: tz })}
            invalid={!!timeZoneError}
            describedBy={timeZoneError ? "cfg-tz-error" : undefined}
          />
        </FormField>

        <LayoutPicker value={slideLayout} onChange={(v) => onChange({ slideLayout: v })} />
      </div>
    </FormSection>
  );
}
