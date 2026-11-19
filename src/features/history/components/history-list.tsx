"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { useCallback, useDeferredValue, useMemo, useState } from "react";
import { useConfig } from "@/features/config/config";
import { db, type StoredNews } from "@/lib/db";
import { groupByMonth, queryTerms, searchDays } from "../search";
import { DeleteNotice } from "./delete-notice";
import { HistoryEmpty } from "./history-empty";
import { HistoryMonth } from "./history-month";
import { HistorySearch } from "./history-search";

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/** Every saved briefing, newest first, grouped by month and searchable. */
export function HistoryList() {
  const days = useLiveQuery(() => db.news.orderBy("date").reverse().toArray());
  const config = useConfig();
  const [query, setQuery] = useState("");
  const [deleted, setDeleted] = useState<StoredNews | null>(null);

  const deferredQuery = useDeferredValue(query);
  const terms = useMemo(() => queryTerms(deferredQuery), [deferredQuery]);
  const results = useMemo(() => searchDays(days ?? [], terms), [days, terms]);
  const months = useMemo(() => groupByMonth(results), [results]);

  const remove = useCallback(async (day: StoredNews) => {
    await db.news.delete(day.date);
    setDeleted(day);
  }, []);
  const undo = useCallback(async () => {
    if (!deleted) return;
    await db.news.put(deleted);
    setDeleted(null);
  }, [deleted]);
  const dismiss = useCallback(() => setDeleted(null), []);

  if (!days) return <div className="min-h-64" aria-busy="true" />;

  const notice = deleted && <DeleteNotice date={deleted.date} onUndo={() => void undo()} onDismiss={dismiss} />;
  if (days.length === 0) {
    return (
      <>
        <HistoryEmpty />
        {notice}
      </>
    );
  }

  const storyTotal = days.reduce((n, d) => n + d.items.length, 0);
  const matchTotal = results.reduce((n, d) => n + d.matches.length, 0);
  const status = terms.length
    ? matchTotal
      ? `${plural(matchTotal, "story", "stories")} on ${plural(results.length, "day", "days")} match “${query.trim()}”.`
      : `No saved stories mention “${query.trim()}”.`
    : `${plural(days.length, "briefing", "briefings")} and ${plural(storyTotal, "story", "stories")} saved in this browser.`;

  return (
    <>
      <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p data-testid="search-status" aria-live="polite" className="text-muted">
          {status}
        </p>
        <HistorySearch value={query} onChange={setQuery} />
      </div>

      <div className="mt-12">
        {months.length > 0 ? (
          months.map((group) => (
            <HistoryMonth
              key={group.key}
              group={group}
              terms={terms}
              company={config?.brief.company ?? ""}
              onDelete={(day) => void remove(day)}
            />
          ))
        ) : (
          <div className="max-w-md">
            <p className="text-muted">
              Search looks through headlines, sources, summaries and “why it matters”. Try a company, regulation or
              place name.
            </p>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mt-4 inline-flex min-h-11 items-center text-sm font-medium underline decoration-line underline-offset-4 hover:decoration-ink focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Clear search
            </button>
          </div>
        )}
      </div>

      {notice}
    </>
  );
}
