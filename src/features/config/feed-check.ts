import { isHttpUrl } from "./schema";

export type FeedStatus =
  | { state: "checking" }
  | { state: "ok"; title: string; itemCount: number; newest: string | null }
  | { state: "error"; error: string };

/** Recent results, so reopening Settings or saving doesn't re-fetch every feed. */
const CACHE_MS = 5 * 60 * 1000;
const cache = new Map<string, { at: number; status: FeedStatus }>();

/**
 * Asks the server to read one feed (see POST /api/feeds/check). Never throws.
 * Reuses a result from the last 5 minutes unless `fresh` is set (the Check buttons).
 */
export async function checkFeed(url: string, { fresh = false } = {}): Promise<FeedStatus> {
  const hit = cache.get(url);
  if (!fresh && hit && Date.now() - hit.at < CACHE_MS) return hit.status;
  const status = await requestCheck(url);
  if (status.state === "ok") cache.set(url, { at: Date.now(), status });
  return status;
}

async function requestCheck(url: string): Promise<FeedStatus> {
  try {
    const res = await fetch("/api/feeds/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    const body = (await res.json()) as
      | { ok: true; title: string; itemCount: number; newest: string | null }
      | { ok: false; error: string };
    return body.ok
      ? { state: "ok", title: body.title, itemCount: body.itemCount, newest: body.newest }
      : { state: "error", error: body.error };
  } catch {
    return { state: "error", error: "Couldn’t reach the server to check this feed." };
  }
}

export function isGoogleAlert(url: string): boolean {
  return /(^|\.)google\.[a-z.]+$/i.test(hostOf(url)) && /\/alerts\/feeds\//.test(url);
}

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

/** "Google Alert" or the feed's site, e.g. "techcrunch.com". */
export function feedKind(url: string): string {
  if (!isHttpUrl(url)) return "Not a valid link yet";
  return isGoogleAlert(url) ? "Google Alert" : hostOf(url);
}

/** A short name from the feed's own title: "Google Alert - CBAM" → "CBAM". */
export function nameFromTitle(title: string): string {
  return title
    .replace(/^google alert\s*[-–—:]\s*/i, "")
    .replace(/^["“](.*)["”]$/, "$1")
    .trim()
    .slice(0, 40);
}
