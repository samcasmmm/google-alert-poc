import Parser from "rss-parser";
import { cleanHeadline } from "../headline";

export interface RawItem {
  id: number;
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  snippet: string;
  /** Index of the feed URL this item came from (for per-feed limits). */
  feed: number;
}

/** Upper bound on candidates sent to the LLM (keeps us inside Groq free-tier TPM). */
const MAX_CANDIDATES = 60;
const SNIPPET_CHARS = 200;

const parser = new Parser({
  timeout: 10_000,
  headers: { "User-Agent": "StandupNews/1.0 (RSS reader)" },
});

/** Feed URLs come from the browser, so refuse obvious internal targets. */
function isAllowedFeedUrl(raw: string): boolean {
  try {
    const { protocol, hostname } = new URL(raw);
    if (protocol !== "http:" && protocol !== "https:") return false;
    const host = hostname.toLowerCase().replace(/^\[|\]$/g, "");
    return !(
      host === "localhost" ||
      host.endsWith(".localhost") ||
      host.endsWith(".internal") ||
      host === "::1" ||
      /^(127|10|0)\./.test(host) ||
      /^192\.168\./.test(host) ||
      /^169\.254\./.test(host) ||
      /^172\.(1[6-9]|2\d|3[01])\./.test(host) ||
      (host.includes(":") && /^(fc|fd|fe80)/.test(host))
    );
  } catch {
    return false;
  }
}

const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  "#39": "'",
};

export function cleanText(input: string | undefined): string {
  if (!input) return "";
  return input
    .replace(/<[^>]*>/g, " ")
    .replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (match, code: string) => {
      const lower = code.toLowerCase();
      if (lower.startsWith("#x")) return String.fromCodePoint(parseInt(lower.slice(2), 16));
      if (lower.startsWith("#") && lower !== "#39") return String.fromCodePoint(parseInt(lower.slice(1), 10));
      return ENTITIES[lower] ?? match;
    })
    .replace(/\s+/g, " ")
    .trim();
}

/** Google Alerts links are https://www.google.com/url?...&url=<real link> redirects. */
export function unwrapUrl(raw: string): string {
  try {
    const u = new URL(raw);
    if (/(^|\.)google\.[a-z.]+$/.test(u.hostname) && u.pathname === "/url") {
      return u.searchParams.get("url") ?? u.searchParams.get("q") ?? raw;
    }
    return raw;
  } catch {
    return raw;
  }
}

function normalizeUrl(raw: string): string {
  try {
    const u = new URL(raw);
    u.hash = "";
    for (const key of [...u.searchParams.keys()]) {
      if (/^(utm_|fbclid|gclid|mc_|ref$|ref_)/i.test(key)) u.searchParams.delete(key);
    }
    const host = u.hostname.replace(/^www\./, "").toLowerCase();
    const path = u.pathname.replace(/\/+$/, "");
    return `${host}${path}${u.search}`;
  } catch {
    return raw.toLowerCase();
  }
}

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/\s+[-|–—]\s+[^-|–—]{1,40}$/, "") // drop trailing " - Publisher"
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

async function fetchFeed(feedUrl: string, feedIndex: number): Promise<Omit<RawItem, "id">[]> {
  const feed = await parser.parseURL(feedUrl);
  const feedTitle = cleanText(feed.title);
  const isGoogleAlert = /^google alert/i.test(feedTitle);

  return feed.items.flatMap((item) => {
    const url = unwrapUrl(item.link ?? "");
    const rawTitle = cleanText(item.title);
    const title = isGoogleAlert ? cleanHeadline(rawTitle) : rawTitle;
    const time = Date.parse(item.isoDate ?? item.pubDate ?? "");
    if (!url || !title || Number.isNaN(time)) return [];

    const source = isGoogleAlert ? hostnameOf(url) : feedTitle || hostnameOf(url);
    const snippet = cleanText(item.contentSnippet ?? item.content ?? item.summary).slice(0, SNIPPET_CHARS);
    return [{ title, url, source, publishedAt: new Date(time).toISOString(), snippet, feed: feedIndex }];
  });
}

/**
 * Fetch every feed, keep items newer than `sinceMs` and dedupe across feeds.
 * Candidates are interleaved feed by feed (newest first within each feed), so one
 * busy feed can't crowd the others out of the candidate pool.
 */
export async function fetchRecentItems(feedUrls: string[], sinceMs: number): Promise<RawItem[]> {
  const urls = [...new Set(feedUrls.map((u) => u.trim()))].filter(isAllowedFeedUrl);
  if (urls.length === 0) throw new Error("No valid RSS feed URLs configured");

  const results = await Promise.allSettled(urls.map((url, i) => fetchFeed(url, i)));
  const all: Omit<RawItem, "id">[] = [];
  results.forEach((result, i) => {
    if (result.status === "fulfilled") all.push(...result.value);
    else console.warn(`[news] feed failed: ${urls[i]}`, result.reason);
  });
  if (all.length === 0 && results.every((r) => r.status === "rejected")) {
    throw new Error("All RSS feeds failed to load");
  }

  const seenUrls = new Set<string>();
  const seenTitles = new Set<string>();
  const byFeed = new Map<number, Omit<RawItem, "id">[]>();

  for (const item of all
    .filter((it) => Date.parse(it.publishedAt) >= sinceMs)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))) {
    const urlKey = normalizeUrl(item.url);
    const titleKey = normalizeTitle(item.title);
    if (seenUrls.has(urlKey) || (titleKey && seenTitles.has(titleKey))) continue;
    seenUrls.add(urlKey);
    if (titleKey) seenTitles.add(titleKey);
    const group = byFeed.get(item.feed) ?? [];
    group.push(item);
    byFeed.set(item.feed, group);
  }

  const items: RawItem[] = [];
  const groups = [...byFeed.values()];
  for (let round = 0; items.length < MAX_CANDIDATES; round++) {
    const batch = groups.flatMap((group) => (round < group.length ? [group[round]] : []));
    if (batch.length === 0) break;
    for (const item of batch) {
      if (items.length >= MAX_CANDIDATES) break;
      items.push({ ...item, id: items.length });
    }
  }
  return items;
}
