"use client";

import { useLiveQuery } from "dexie-react-hooks";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Refresh, Spinner } from "@/components/icons";
import { after, RevealText } from "@/components/reveal-text";
import { SiteHeader } from "@/components/site-header";
import { primaryButton, quietButton, secondaryButton } from "@/components/ui";
import { useConfig } from "@/features/config/config";
import type { AppConfig } from "@/features/config/schema";
import { ExportMenu } from "@/features/news/components/export-menu";
import { RestartButton, SlideDeck } from "@/features/news/components/slide-deck";
import { SLIDE_LAYOUTS } from "@/features/news/components/slide-layouts";
import { useDailyNews } from "@/features/news/use-daily-news";
import { db } from "@/lib/db";
import { formatDayLong, formatDayShort, isDateKey, weekdayOf } from "@/lib/date";
import { useToday } from "@/lib/use-today";

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function StandupView() {
  const config = useConfig();
  const today = useToday(config?.timeZone);
  const param = useSearchParams().get("date");
  if (!today || !config) return <BlankScreen />;
  const date = isDateKey(param) ? param : today;
  return <Standup key={date} date={date} isToday={date === today} config={config} />;
}

function Standup({ date, isToday, config }: { date: string; isToday: boolean; config: AppConfig }) {
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

/* ───────────── Today, before fetching: the one primary action ───────────── */

function TodayLanding({
  date,
  config,
  daily,
}: {
  date: string;
  config: AppConfig;
  daily: ReturnType<typeof useDailyNews>;
}) {
  const latest = useLiveQuery(() => db.news.orderBy("date").reverse().first());
  const hasFeeds = config.feeds.length > 0;
  const weekday = weekdayOf(date);
  const windowLabel = weekday === 1 ? "since Friday" : "from the last 24 hours";
  const [monthDay] = formatDayLong(date).split(", ").slice(1);

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <main
        id="main"
        className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 py-12 sm:px-8 sm:py-20"
      >
        <section aria-labelledby="today-heading">
          <p className="font-mono text-xs tracking-[0.2em] text-accent uppercase motion-safe:animate-rise">
            {WEEKDAYS[weekday]} edition
          </p>
          <h1
            id="today-heading"
            className="mt-4 font-serif text-6xl leading-[0.95] font-medium tracking-tight text-balance sm:text-8xl lg:text-9xl"
          >
            <RevealText text={monthDay ?? formatDayLong(date)} delay={80} stagger={70} />
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted motion-safe:animate-rise" style={after(250)}>
            {hasFeeds ? (
              <>
                Pull stories {windowLabel} from {config.feeds.length} {config.feeds.length === 1 ? "feed" : "feeds"}.{" "}
                {config.groqApiKey
                  ? `Groq picks the top ${config.maxItems}${config.brief.company.trim() ? ` for ${config.brief.company.trim()}` : ""} and explains why each one matters.`
                  : "No Groq key yet, so you'll get feed snippets instead of summaries."}
              </>
            ) : (
              "Add a few RSS feeds (Google Alerts or industry blogs) and the morning briefing is one click away."
            )}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3 motion-safe:animate-rise" style={after(350)}>
            {hasFeeds ? (
              <>
                <button
                  type="button"
                  onClick={() => void daily.fetchNews()}
                  disabled={daily.fetching}
                  className={`${primaryButton} min-h-12 gap-2 px-6 text-base`}
                >
                  {daily.fetching ? <Spinner /> : <Refresh />}
                  {daily.fetching ? "Fetching news…" : daily.error ? "Try again" : "Fetch today’s news"}
                </button>
                <Link href="/settings" className={secondaryButton}>
                  Edit feeds
                </Link>
              </>
            ) : (
              <Link href="/settings" className={`${primaryButton} min-h-12 gap-2 px-6 text-base`}>
                Set up feeds <ArrowRight />
              </Link>
            )}
          </div>

          <div className="mt-6 min-h-16" aria-live="polite">
            {daily.fetching && <FetchProgress />}
            {daily.error && !daily.fetching && (
              <div role="alert" className="max-w-xl border-l-2 border-accent pl-4 text-sm">
                <p className="font-medium text-accent">Couldn’t fetch the news.</p>
                <p className="mt-1 text-muted">{daily.error}</p>
              </div>
            )}
          </div>

          {latest && (
            <Link
              href={`/standup?date=${latest.date}`}
              className="group mt-6 inline-flex min-h-11 items-center gap-2 text-sm text-muted transition-colors hover:text-ink motion-safe:animate-rise"
              style={after(450)}
            >
              Last briefing · {formatDayShort(latest.date)}
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
        </section>
      </main>
    </div>
  );
}

/** Indeterminate progress for the 5–15s fetch, with elapsed time so the wait is explained. */
function FetchProgress() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="max-w-xl">
      <div className="h-0.5 overflow-hidden rounded-full bg-line">
        <div className="h-full w-2/5 rounded-full bg-accent motion-safe:animate-progress" />
      </div>
      <p className="mt-2 text-sm text-muted">
        {seconds < 4 ? "Reading your feeds…" : "Summarizing with Groq…"}{" "}
        <span className="font-mono tabular-nums">{seconds}s</span>
      </p>
    </div>
  );
}

function EmptyDay({ date }: { date: string }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main id="main" className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-4 py-16">
        <p className="font-mono text-xs tracking-[0.2em] text-muted uppercase">{formatDayLong(date)}</p>
        <h1 className="mt-3 font-serif text-4xl font-medium tracking-tight">No briefing saved for this day.</h1>
        <p className="mt-3 text-muted">Only days you fetched in this browser are kept.</p>
        <div className="mt-8 flex flex-wrap gap-2">
          <Link href="/standup" className={primaryButton}>
            Go to today
          </Link>
          <Link href="/history" className={secondaryButton}>
            Past briefings
          </Link>
        </div>
      </main>
    </div>
  );
}

function BlankScreen() {
  return <div className="min-h-dvh bg-paper" aria-busy="true" />;
}

export { BlankScreen };
