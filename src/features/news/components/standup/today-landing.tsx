"use client";

import { useLiveQuery } from "dexie-react-hooks";
import Link from "next/link";
import { ArrowRight, Refresh, Spinner } from "@/components/icons";
import { after, RevealText } from "@/components/reveal-text";
import { SiteHeader } from "@/components/site-header";
import { primaryButton, secondaryButton } from "@/components/ui";
import type { AppConfig } from "@/features/config/schema";
import { db } from "@/lib/db";
import { formatDayLong, formatDayShort, weekdayName, weekdayOf } from "@/lib/date";
import type { useDailyNews } from "../../use-daily-news";
import { FetchProgress } from "./fetch-progress";

/** Today, before fetching: the one primary action. */
export function TodayLanding({
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
            {weekdayName(date)} edition
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
