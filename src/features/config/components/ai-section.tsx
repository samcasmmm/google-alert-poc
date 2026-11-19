import { inputClass } from "@/components/ui";
import { DEFAULT_MODEL, SUGGESTED_MODELS } from "../schema";
import { FormField } from "./form-field";
import { FormSection } from "./form-section";
import { SecretInput } from "./secret-input";

/** Groq key and model: what writes the summaries and "why it matters" lines. */
export function AiSection({
  apiKey,
  model,
  onChange,
}: {
  apiKey: string;
  model: string;
  onChange: (patch: { groqApiKey?: string; groqModel?: string }) => void;
}) {
  return (
    <FormSection
      id="ai"
      title="AI summaries"
      description="Groq ranks the stories and writes the summaries. Without a key, slides show the feeds’ own snippets."
    >
      <div className="space-y-7">
        <FormField
          label="Groq API key"
          htmlFor="cfg-key"
          hint={
            <>
              Free at{" "}
              <a
                href="https://console.groq.com/keys"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-accent underline-offset-4 hover:underline"
              >
                console.groq.com/keys
              </a>
              . Stored only in this browser and sent only when fetching news.
            </>
          }
        >
          <SecretInput id="cfg-key" value={apiKey} onChange={(v) => onChange({ groqApiKey: v })} placeholder="gsk_…" />
        </FormField>

        <FormField label="Model" hint={`Leave empty to use ${DEFAULT_MODEL}.`} htmlFor="cfg-model">
          <input
            id="cfg-model"
            value={model}
            onChange={(e) => onChange({ groqModel: e.target.value })}
            placeholder={DEFAULT_MODEL}
            list="groq-models"
            spellCheck={false}
            className={`${inputClass} font-mono text-sm sm:max-w-sm`}
          />
          <datalist id="groq-models">
            {SUGGESTED_MODELS.map((m) => (
              <option key={m} value={m} />
            ))}
          </datalist>
        </FormField>
      </div>
    </FormSection>
  );
}
