/** Long headlines step down so they stay within ~4 lines. */
export function headlineSize(title: string): number {
  if (title.length <= 55) return 42;
  if (title.length <= 90) return 35;
  return 29;
}

/** "Why it matters" type size by length, so it fills the panel without overflowing. */
export function quoteSize(text: string): number {
  if (text.length <= 110) return 25;
  if (text.length <= 170) return 22;
  return 19;
}

/** Formats a "YYYY-MM-DD" key; noon UTC keeps the day stable in every zone. */
export function formatDateKey(key: string, options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat("en-US", { ...options, timeZone: "UTC" }).format(new Date(`${key}T12:00:00Z`));
}

/** "business-standard.com/article/123" */
export function shortUrl(url: string): string {
  try {
    const u = new URL(url);
    return `${u.hostname.replace(/^www\./, "")}${u.pathname === "/" ? "" : u.pathname}`;
  } catch {
    return url;
  }
}

export function storyCount(n: number): string {
  return `${n} ${n === 1 ? "story" : "stories"}`;
}
