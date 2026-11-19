"use client";

import { useLiveQuery } from "dexie-react-hooks";
import Link from "next/link";
import { ArrowRight, Newspaper, Trash } from "@/components/icons";
import { primaryButton, quietButton } from "@/components/ui";
import { db } from "@/lib/db";
import { formatDayShort } from "@/lib/date";

export function HistoryList() {
  const days = useLiveQuery(async () => {
    const news = await db.news.orderBy("date").reverse().toArray();
    return news.map((n) => ({
      date: n.date,
      count: n.items.length,
      mode: n.mode,
      lead: n.items[0]?.title,
    }));
  });

  if (!days) return <p className="text-muted">Loading…</p>;
  if (days.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line px-6 py-12 text-center">
        <Newspaper size={28} className="mx-auto text-muted" />
        <p className="mt-4 font-medium">No briefings yet</p>
        <p className="mt-1 text-sm text-muted">Each day you fetch news is saved here so you can replay it.</p>
        <Link href="/standup" className={`${primaryButton} mt-6`}>
          Go to today
        </Link>
      </div>
    );
  }

  async function remove(date: string) {
    if (confirm(`Delete the saved news for ${formatDayShort(date)}?`)) await db.news.delete(date);
  }

  return (
    <ul className="divide-y divide-line border-y border-line">
      {days.map((day) => (
        <li key={day.date} className="flex items-center gap-2">
          <Link
            href={`/standup?date=${day.date}`}
            className="group flex flex-1 flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-4"
          >
            <span className="inline-flex items-center gap-2 font-serif text-xl group-hover:text-accent">
              {formatDayShort(day.date)}
              <ArrowRight size={16} className="opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />
            </span>
            <span className="text-sm text-muted tabular-nums">
              {day.count} stories
              {day.mode === "fallback" && " · feed snippets"}
            </span>
            {day.lead && <span className="w-full truncate text-sm text-muted">Lead: {day.lead}</span>}
          </Link>
          <button
            type="button"
            onClick={() => void remove(day.date)}
            className={`${quietButton} gap-1.5 hover:text-accent`}
            aria-label={`Delete ${formatDayShort(day.date)}`}
          >
            <Trash size={16} />
            <span className="hidden sm:inline">Delete</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
