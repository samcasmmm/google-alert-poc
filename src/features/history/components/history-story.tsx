import Link from "next/link";
import type { NewsItem } from "@/features/news/schema";
import { Highlight } from "./highlight";

/**
 * One saved story: the headline opens that day's slides at this story,
 * the source opens the original article.
 */
export function HistoryStory({
  item,
  date,
  position,
  terms,
}: {
  item: NewsItem;
  date: string;
  /** 1-based position in the day's briefing */
  position: number;
  terms: string[];
}) {
  const showWhy = terms.length > 0 && item.whyItMatters;
  return (
    <li className="grid gap-x-6 gap-y-0.5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline">
      <Link
        href={`/standup?date=${date}&story=${position}`}
        className="font-serif text-lg leading-snug text-pretty decoration-accent decoration-2 underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <Highlight text={item.title} terms={terms} />
      </Link>
      <a
        href={item.url}
        target="_blank"
        rel="noreferrer"
        aria-label={`Read “${item.title}” on ${item.source || "the source site"} (opens in a new tab)`}
        className="text-sm whitespace-nowrap text-muted hover:text-ink hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <Highlight text={item.source} terms={terms} />
      </a>
      {showWhy && (
        <p className="text-sm leading-relaxed text-muted sm:col-span-2">
          <Highlight text={item.whyItMatters} terms={terms} />
        </p>
      )}
    </li>
  );
}
