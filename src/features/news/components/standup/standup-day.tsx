"use client";

import Link from "next/link";
import { BlankScreen } from "@/components/blank-screen";
import { Refresh, Spinner } from "@/components/icons";
import { quietButton, secondaryButton } from "@/components/ui";
import type { AppConfig } from "@/features/config/schema";
import { useDailyNews } from "../../use-daily-news";
import { RestartButton } from "../deck/restart-button";
import { SlideDeck } from "../deck/slide-deck";
import { ExportMenu } from "../export-menu";
import { SLIDE_LAYOUTS } from "../layouts";
import { EmptyDay } from "./empty-day";
import { TodayLanding } from "./today-landing";

/** One day: the slides if its briefing is saved, otherwise the fetch screen (today) or an empty state. */
export function StandupDay({ date, isToday, config }: { date: string; isToday: boolean; config: AppConfig }) {
  const daily = useDailyNews(date, config);

  if (!daily.ready) return <BlankScreen />;
  if (!daily.news) {
    return isToday ? (
      <TodayLanding date={date} config={config} daily={daily} />
    ) : (
      <EmptyDay date={date} />
    );
  }

  const { news } = daily;
  const layout = SLIDE_LAYOUTS[config.slideLayout];
  const total = news.items.length;
  const note = daily.error
    ? daily.error
    : news.mode === "fallback"
      ? `Feed snippets only${news.note ? `: ${news.note}` : ""}`
      : null;

  const status = (
    <span className="inline-flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
      <span className="tabular-nums">
        {total} {total === 1 ? "story" : "stories"}
      </span>
      {note && <span className={daily.error ? "text-accent" : ""}>· {note}</span>}
      {isToday && (
        <button
          type="button"
          onClick={() => void daily.fetchNews()}
          disabled={daily.fetching}
          className={`${quietButton} min-h-9 gap-1.5 px-2`}
        >
          {daily.fetching ? <Spinner size={14} /> : <Refresh size={14} />}
          {daily.fetching ? "Fetching…" : "Fetch again"}
        </button>
      )}
    </span>
  );

  const links = (
    <nav aria-label="After standup" className="flex flex-wrap gap-2">
      <RestartButton />
      <Link href="/history" className={secondaryButton}>
        Past briefings
      </Link>
      <Link href="/settings" className={secondaryButton}>
        Settings
      </Link>
    </nav>
  );

  const slides = [
    <layout.Title key="title" date={date} status={status} />,
    ...news.items.map((item, i) => <layout.Story key={item.url} item={item} position={i + 1} total={total} />),
    <layout.End key="end" links={links} />
  ];

  return (
    <SlideDeck slides={slides} actions={<ExportMenu news={news} company={config.brief.company} />} />
  );
}
