/** A text model the key can use (mirrors the server's /api/groq/check response). */
export interface GroqModel {
  id: string;
  owner: string;
  contextWindow: number | null;
}

export type GroqKeyStatus =
  | { state: "checking" }
  | { state: "ok"; models: GroqModel[] }
  | { state: "error"; error: string };

/** Recent results per key, so reopening Settings or saving doesn't call Groq again. */
const CACHE_MS = 5 * 60 * 1000;
const cache = new Map<string, { at: number; status: GroqKeyStatus }>();

/** Asks the server to verify the key with Groq. Never throws; reuses a result from the last 5 minutes unless `fresh`. */
export async function checkGroqKey(apiKey: string, { fresh = false } = {}): Promise<GroqKeyStatus> {
  const hit = cache.get(apiKey);
  if (!fresh && hit && Date.now() - hit.at < CACHE_MS) return hit.status;
  let status: GroqKeyStatus;
  try {
    const res = await fetch("/api/groq/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apiKey }),
    });
    const body = (await res.json()) as { ok: true; models: GroqModel[] } | { ok: false; error: string };
    status = body.ok ? { state: "ok", models: body.models } : { state: "error", error: body.error };
  } catch {
    status = { state: "error", error: "Couldn’t reach the server to check the key." };
  }
  if (status.state === "ok") cache.set(apiKey, { at: Date.now(), status });
  return status;
}

/** "128K" from 131072 tokens. */
export function formatContext(tokens: number | null): string {
  return tokens ? `${Math.round(tokens / 1024)}K` : "";
}
