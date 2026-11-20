"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { Trash } from "@/components/icons";
import { quietButton } from "@/components/ui";
import { ExportMenu } from "@/features/news/components/export-menu";
import type { StoredNews } from "@/lib/db";
import { formatDayLong, formatWeekdayDay } from "@/lib/date";
import { HistoryStory } from "./history-story";

/** Stories shown before "Show N more" when not searching. */
const PREVIEW = 3;

/**
 * One saved day: the date on the left, its headlines on the right, then actions.
 * While searching, only the matching stories are listed.
 */
export function HistoryDay({
  day,
  matches,
  terms,
  company,
  onDelete,
}: {
  day: StoredNews;
  matches: number[];
  terms: string[];
  company: string;
  onDelete: (day: StoredNews) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const titleId = useId();
  const listId = useId();

  const searching = terms.length > 0;
  const visible = searching || expanded ? matches : matches.slice(0, PREVIEW);
  const hidden = matches.length - visible.length;
  const longDate = formatDayLong(day.date);

  return (
    <article aria-labelledby={titleId} className="grid gap-x-10 gap-y-3 py-7 sm:grid-cols-[7.5rem_minmax(0,1fr)]">
      <div className="flex items-baseline gap-3 sm:block">
        <h3 id={titleId} className="text-base font-semibold">
          <time dateTime={day.date}>
            <span aria-hidden>{formatWeekdayDay(day.date)}</span>
            <span className="sr-only">{longDate}</span>
          </time>
        </h3>
        <p className="text-sm text-muted sm:mt-1">
          {day.items.length} {day.items.length === 1 ? "story" : "stories"}
        </p>
        {day.mode === "fallback" && <p className="text-sm text-muted">Feed snippets only</p>}
      </div>

      <div className="min-w-0">
        <ol id={listId} className="space-y-3">
          {visible.map((i) => (
            <HistoryStory key={day.items[i].url} item={day.items[i]} date={day.date} position={i + 1} terms={terms} />
          ))}
        </ol>

        {!searching && matches.length > PREVIEW && (
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            aria-expanded={expanded}
            aria-controls={listId}
            className="mt-3 inline-flex min-h-11 items-center text-sm font-medium text-ink underline decoration-line underline-offset-4 hover:decoration-ink focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {expanded ? "Show fewer stories" : `Show ${hidden} more ${hidden === 1 ? "story" : "stories"}`}
          </button>
        )}

        <div className="-ml-3 mt-3 flex flex-wrap items-center gap-2">
          <Link href={`/standup?date=${day.date}`} className={`${quietButton} font-medium text-ink`}>
            Open slides
          </Link>
          <ExportMenu news={day} company={company} label="Download" align="start" />
          <button
            type="button"
            onClick={() => onDelete(day)}
            className={`${quietButton} gap-1.5 hover:text-accent`}
            aria-label={`Delete ${longDate}`}
          >
            <Trash size={15} />
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
