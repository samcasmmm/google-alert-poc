import type { StoredNews } from "@/lib/db";
import { formatMonth } from "@/lib/date";
import type { MonthGroup } from "../search";
import { HistoryDay } from "./history-day";

/** A month heading with that month's saved days beneath it. */
export function HistoryMonth({
  group,
  terms,
  company,
  onDelete,
}: {
  group: MonthGroup;
  terms: string[];
  company: string;
  onDelete: (day: StoredNews) => void;
}) {
  const headingId = `month-${group.key}`;
  return (
    <section aria-labelledby={headingId} className="mt-14 first:mt-0">
      <h2
        id={headingId}
        className="border-b border-line pb-3 font-serif text-4xl font-medium tracking-tight sm:text-5xl"
      >
        {formatMonth(group.key)}
      </h2>
      <div className="divide-y divide-line/70">
        {group.days.map(({ day, matches }) => (
          <HistoryDay
            key={day.date}
            day={day}
            matches={matches}
            terms={terms}
            company={company}
            onDelete={onDelete}
          />
        ))}
      </div>
    </section>
  );
}
