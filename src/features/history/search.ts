import type { NewsItem } from "@/features/news/schema";
import type { StoredNews } from "@/lib/db";

/** Lowercased words of a query; a story matches when it contains every word. */
export function queryTerms(query: string): string[] {
  return query.toLowerCase().split(/\s+/).filter(Boolean);
}

function haystack(item: NewsItem): string {
  return [item.title, item.source, item.summary, item.whyItMatters].join(" ").toLowerCase();
}

export interface DayMatch {
  day: StoredNews;
  /** Indexes into day.items that match (all of them when there is no query). */
  matches: number[];
}

/** Days that have at least one matching story, newest first (input order is kept). */
export function searchDays(days: StoredNews[], terms: string[]): DayMatch[] {
  return days.flatMap((day) => {
    const matches = day.items.flatMap((item, i) => {
      if (terms.length === 0) return [i];
      const text = haystack(item);
      return terms.every((t) => text.includes(t)) ? [i] : [];
    });
    return matches.length ? [{ day, matches }] : [];
  });
}

export interface MonthGroup {
  /** "2026-11" */
  key: string;
  days: DayMatch[];
}

/** Groups consecutive days by calendar month ("YYYY-MM" from the date key). */
export function groupByMonth(days: DayMatch[]): MonthGroup[] {
  const groups: MonthGroup[] = [];
  for (const d of days) {
    const key = d.day.date.slice(0, 7);
    const last = groups.at(-1);
    if (last?.key === key) last.days.push(d);
    else groups.push({ key, days: [d] });
  }
  return groups;
}
