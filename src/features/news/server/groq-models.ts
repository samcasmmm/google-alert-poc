import Groq from "groq-sdk";

export interface GroqModelInfo {
  id: string;
  owner: string;
  /** Tokens, when Groq reports it */
  contextWindow: number | null;
}

/** Speech, guard and embedding models can't write summaries; keep them out of the picker. */
const NOT_FOR_TEXT = /whisper|tts|guard|orpheus|playai|embed/i;

/** The text models this key can use, alphabetically. Throws Groq SDK errors (see describeGroqError). */
export async function listGroqModels(apiKey: string): Promise<GroqModelInfo[]> {
  const client = new Groq({ apiKey, timeout: 15_000, maxRetries: 0 });
  const { data } = await client.models.list();
  return data
    .flatMap((model) => {
      // The API also returns `active` and `context_window`; the SDK types don't list them.
      const extra = model as unknown as { active?: boolean; context_window?: number };
      if (extra.active === false || NOT_FOR_TEXT.test(model.id)) return [];
      return [{ id: model.id, owner: model.owned_by, contextWindow: extra.context_window ?? null }];
    })
    .sort((a, b) => a.id.localeCompare(b.id));
}

/** A sentence a person can act on for each way the key check can fail. */
export function describeGroqError(error: unknown): string {
  if (error instanceof Groq.AuthenticationError) return "Groq didn’t accept this key. Copy it again from console.groq.com/keys.";
  if (error instanceof Groq.PermissionDeniedError) return "This key isn’t allowed to use the Groq API (403). Check it in the Groq console.";
  if (error instanceof Groq.RateLimitError) return "Groq is rate-limiting this key right now. Try again in a minute.";
  if (error instanceof Groq.APIConnectionError) return "Couldn’t reach Groq. Check the connection and try again.";
  return "Groq returned an unexpected error. Try again in a moment.";
}
