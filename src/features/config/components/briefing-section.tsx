"use client";

import { useMemo } from "react";
import { inputClass } from "@/components/ui";
import { browserTimeZone } from "@/lib/date";
import type { SlideLayout } from "../schema";
import { FormField } from "./form-field";
import { FormSection } from "./form-section";
import { LayoutPicker } from "./layout-picker";
import { StoryCountPicker } from "./story-count-picker";

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
  const zones = useMemo(() => {
    try {
      return Intl.supportedValuesOf("timeZone");
    } catch {
      return [];
    }
  }, []);

  return (
    <FormSection id="briefing" title="Briefing">
      <div className="space-y-8">
        <StoryCountPicker value={maxItems} onChange={(n) => onChange({ maxItems: n })} />

        <FormField
          label="Time zone"
          hint={`Decides when a new day starts. Leave empty to use this browser’s zone (${browserTimeZone()}).`}
          htmlFor="cfg-tz"
          error={timeZoneError}
          errorId="cfg-tz-error"
        >
          <input
            id="cfg-tz"
            value={timeZone}
            onChange={(e) => onChange({ timeZone: e.target.value })}
            placeholder={browserTimeZone()}
            list="time-zones"
            spellCheck={false}
            aria-invalid={!!timeZoneError}
            aria-describedby={timeZoneError ? "cfg-tz-error" : undefined}
            className={`${inputClass} sm:max-w-sm ${timeZoneError ? "border-accent" : ""}`}
          />
          <datalist id="time-zones">
            {zones.map((z) => (
              <option key={z} value={z} />
            ))}
          </datalist>
        </FormField>

        <LayoutPicker value={slideLayout} onChange={(v) => onChange({ slideLayout: v })} />
      </div>
    </FormSection>
  );
}
