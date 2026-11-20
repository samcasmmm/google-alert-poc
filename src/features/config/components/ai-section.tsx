"use client";

import { DEFAULT_MODEL } from "../schema";
import { useGroqKeyCheck } from "../use-groq-key-check";
import { AiStatusNote } from "./ai-status-note";
import { FormField } from "./form-field";
import { FormSection } from "./form-section";
import { GroqKeyField } from "./groq-key-field";
import { ModelPicker } from "./model-picker";

/**
 * Groq key and model: what ranks the stories and writes the summaries. The key is
 * checked with Groq, and the model list comes from what that key can actually use.
 */
export function AiSection({
  apiKey,
  model,
  onChange,
}: {
  apiKey: string;
  model: string;
  onChange: (patch: { groqApiKey?: string; groqModel?: string }) => void;
}) {
  const { status, check } = useGroqKeyCheck(apiKey);
  const hasKey = !!apiKey.trim();
  const available = status?.state === "ok" ? status.models : undefined;
  const effective = model.trim() || DEFAULT_MODEL;
  const unavailable = available && !available.some((m) => m.id === effective);

  const modelHint = unavailable
    ? model.trim()
      ? `This key can’t use “${model.trim()}”. Briefings will fall back to the default model; pick one from the list.`
      : `This key can’t use the default model (${DEFAULT_MODEL}). Pick one from the list.`
    : available
      ? "The list shows the text models your key can use."
      : "Check the key to list the models it can use. You can also type any model id.";

  return (
    <FormSection
      id="ai"
      title="AI summaries"
      description={<AiStatusNote hasKey={hasKey} status={status} model={effective} modelUnavailable={!!unavailable} />}
    >
      <div className="space-y-7">
        <GroqKeyField
          value={apiKey}
          status={status}
          onChange={(v) => onChange({ groqApiKey: v })}
          onCheck={(key) => check(key)}
        />

        <FormField label="Model" htmlFor="cfg-model">
          <ModelPicker
            id="cfg-model"
            value={model}
            onChange={(v) => onChange({ groqModel: v })}
            available={available}
            describedBy="cfg-model-hint"
          />
          <p id="cfg-model-hint" className={`mt-1.5 text-sm ${unavailable ? "text-accent" : "text-muted"}`}>
            {modelHint}
          </p>
        </FormField>
      </div>
    </FormSection>
  );
}
