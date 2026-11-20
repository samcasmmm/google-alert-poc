import type { GroqKeyStatus } from "../groq-check";

/**
 * Whether AI summaries are on, in one sentence under the section title. The marker's
 * shape changes with its colour (filled when on), so the state doesn't rely on colour.
 */
export function AiStatusNote({
  hasKey,
  status,
  model,
  modelUnavailable,
}: {
  hasKey: boolean;
  status?: GroqKeyStatus;
  model: string;
  /** The key works but can't use this model */
  modelUnavailable?: boolean;
}) {
  const on = hasKey && status?.state === "ok" && !modelUnavailable;
  const text = !hasKey
    ? "Off. Add a key and Groq will rank the stories and write a summary and “why it matters” for each."
    : status?.state === "error"
      ? "Off until the key works. Briefings use the feeds’ own snippets meanwhile."
      : status?.state === "ok" && modelUnavailable
        ? `Not yet. The key works, but it can’t use ${model}. Pick a model below.`
        : on
          ? `On. Groq ranks the stories and writes the summaries with ${model}.`
          : "Checking whether summaries can run…";
  return (
    <p className="flex items-start gap-2.5 text-sm">
      <span
        aria-hidden
        className={`mt-1.5 size-2.5 shrink-0 rounded-full border-2 ${on ? "border-emerald-700 bg-emerald-700" : "border-muted bg-transparent"}`}
      />
      <span className={on ? "text-ink" : "text-muted"}>{text}</span>
    </p>
  );
}
