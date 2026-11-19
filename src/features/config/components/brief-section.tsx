import { inputClass } from "@/components/ui";
import { BRIEF_FIELDS, briefFilledCount, type Brief } from "../schema";
import { FormField } from "./form-field";
import { FormSection } from "./form-section";

/** What the company does, so Groq can pick relevant stories and explain why each matters. */
export function BriefSection({ brief, onChange }: { brief: Brief; onChange: (brief: Brief) => void }) {
  const filled = briefFilledCount(brief);
  return (
    <FormSection
      id="brief"
      title="Company brief"
      description={
        <>
          Groq reads this to choose stories that matter to you and to write a specific “why it matters” for each one.
          Every field is optional; the more you fill in, the sharper the briefing.{" "}
          <span className="text-ink">
            {filled} of {BRIEF_FIELDS.length} filled.
          </span>
        </>
      }
    >
      <div className="space-y-7">
        {BRIEF_FIELDS.map((field) => {
          const id = `brief-${field.key}`;
          const value = brief[field.key];
          const set = (v: string) => onChange({ ...brief, [field.key]: v });
          const nearLimit = value.length > field.maxLength * 0.8;
          return (
            <FormField key={field.key} label={field.label} hint={field.hint} htmlFor={id}>
              {field.rows > 1 ? (
                <textarea
                  id={id}
                  value={value}
                  onChange={(e) => set(e.target.value)}
                  maxLength={field.maxLength}
                  placeholder={field.placeholder}
                  className={`${inputClass} field-sizing-content min-h-24 resize-none leading-relaxed`}
                />
              ) : (
                <input
                  id={id}
                  value={value}
                  onChange={(e) => set(e.target.value)}
                  maxLength={field.maxLength}
                  placeholder={field.placeholder}
                  autoComplete={field.key === "company" ? "organization" : "off"}
                  className={inputClass}
                />
              )}
              {nearLimit && (
                <p className="mt-1 text-right text-xs text-muted tabular-nums">
                  {value.length} of {field.maxLength} characters
                </p>
              )}
            </FormField>
          );
        })}
      </div>
    </FormSection>
  );
}
