import type { ReactNode } from "react";
import { ArrowUpRight } from "@/components/icons";
import { after, RevealText } from "@/components/reveal-text";
import type { SlideLayout } from "@/features/config/schema";
import { formatDayLong, formatTimestamp, weekdayOf } from "@/lib/date";
import type { NewsItem } from "../schema";

// Presentation is pure layout code: Groq only supplies the summary text.

export interface TitleSlideProps {
  date: string;
  /** story count, status, refresh control */
  status: ReactNode;
}
export interface StorySlideProps {
  item: NewsItem;
  position: number;
  total: number;
}
export interface EndSlideProps {
  links: ReactNode;
}

interface LayoutSet {
  Title: (props: TitleSlideProps) => ReactNode;
  Story: (props: StorySlideProps) => ReactNode;
  End: (props: EndSlideProps) => ReactNode;
}

const pad = (n: number) => String(n).padStart(2, "0");
const kicker = "font-mono text-xs uppercase tracking-[0.2em]";
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function monthDay(date: string): string {
  return formatDayLong(date).split(", ").slice(1).join(", ");
}

function ArticleLink({ item }: { item: NewsItem }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex min-h-11 items-center text-sm text-muted underline decoration-line underline-offset-4 transition-colors hover:text-ink hover:decoration-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      Read at {item.source || "source"}
      <ArrowUpRight size={14} className="ml-1" />
    </a>
  );
}

/* ───────────────────────── Editorial ───────────────────────── */

const editorial: LayoutSet = {
  Title: ({ date, status }) => (
    <section className="mx-auto w-full max-w-5xl">
      <div className="border-y-[3px] border-double border-ink py-5 text-center sm:py-8">
        <h1 className="font-serif text-5xl font-semibold tracking-tight sm:text-8xl">
          <RevealText text="Standup News" stagger={90} />
        </h1>
      </div>
      <div className={`flex flex-wrap items-center justify-between gap-2 border-b border-ink py-2 text-muted ${kicker}`}>
        <span className="text-ink">{formatDayLong(date)}</span>
        <span className="normal-case tracking-normal">{status}</span>
      </div>
    </section>
  ),

  Story: ({ item, position, total }) => (
    <article className="mx-auto w-full max-w-5xl">
      <header className={`flex flex-wrap items-baseline justify-between gap-2 border-b border-ink pb-3 text-muted ${kicker}`}>
        <span>
          <span className="text-accent">No. {pad(position)}</span> of {pad(total)}
        </span>
        <span>{[item.source, formatTimestamp(item.publishedAt)].filter(Boolean).join(" · ")}</span>
      </header>
      <h2 className="mt-8 font-serif text-4xl leading-[1.05] font-medium tracking-tight text-balance sm:text-6xl">
        <RevealText text={item.title} delay={100} />
      </h2>
      {item.summary && (
        <p style={after(380)} className="motion-safe:animate-rise mt-6 max-w-3xl text-lg leading-relaxed text-pretty text-ink/75 sm:text-2xl">{item.summary}</p>
      )}
      {item.whyItMatters && (
        <div style={after(520)} className="motion-safe:animate-rise mt-8 max-w-3xl border-l-4 border-accent pl-5">
          <p className={`text-accent ${kicker}`}>Why it matters</p>
          <p className="mt-2 font-serif text-xl leading-snug italic text-pretty sm:text-2xl">{item.whyItMatters}</p>
        </div>
      )}
      <div className="mt-8">
        <ArticleLink item={item} />
      </div>
    </article>
  ),

  End: ({ links }) => (
    <section className="mx-auto w-full max-w-5xl text-center">
      <p className="font-serif text-3xl text-muted" aria-hidden>
        — 30 —
      </p>
      <h2 className="mt-6 font-serif text-5xl font-medium tracking-tight sm:text-7xl">Over to standup.</h2>
      <div className="mt-12 flex justify-center">{links}</div>
    </section>
  ),
};

/* ───────────────────────── Poster ───────────────────────── */

const poster: LayoutSet = {
  Title: ({ date, status }) => (
    <section className="mx-auto w-full max-w-6xl">
      <p className={`text-muted ${kicker}`}>Standup News</p>
      <h1 className="mt-4 text-6xl leading-[0.85] font-black tracking-[-0.05em] uppercase sm:text-[10rem]">
        <RevealText text={WEEKDAYS[weekdayOf(date)]} />
      </h1>
      <p className="mt-3 text-3xl font-bold tracking-tight text-accent sm:text-5xl">{monthDay(date)}</p>
      <div className="mt-6 text-muted">{status}</div>
    </section>
  ),

  Story: ({ item, position, total }) => (
    <article className="relative mx-auto w-full max-w-6xl">
      <span
        aria-hidden
        className="pointer-events-none absolute -top-10 right-0 font-black leading-none tracking-[-0.06em] text-subtle select-none text-[8rem] sm:-top-20 sm:text-[18rem]"
      >
        {pad(position)}
      </span>
      <div className="relative">
        <p className={`text-muted ${kicker}`}>
          <span className="text-ink">
            {pad(position)}/{pad(total)}
          </span>{" "}
          · {[item.source, formatTimestamp(item.publishedAt)].filter(Boolean).join(" · ")}
        </p>
        <h2 className="mt-6 max-w-5xl text-4xl leading-[0.95] font-bold tracking-[-0.035em] text-balance sm:text-7xl">
          <RevealText text={item.title} delay={100} />
        </h2>
        {item.summary && (
          <p style={after(380)} className="motion-safe:animate-rise mt-8 max-w-2xl text-lg leading-relaxed text-pretty text-ink/70 sm:text-xl">{item.summary}</p>
        )}
        {item.whyItMatters && (
          <p style={after(520)} className="motion-safe:animate-rise mt-8 max-w-3xl bg-accent px-5 py-4 text-lg leading-snug font-semibold text-pretty text-white sm:text-xl">
            {item.whyItMatters}
          </p>
        )}
        <div className="mt-6">
          <ArticleLink item={item} />
        </div>
      </div>
    </article>
  ),

  End: ({ links }) => (
    <section className="mx-auto w-full max-w-6xl">
      <h2 className="text-6xl leading-[0.85] font-black tracking-[-0.05em] uppercase sm:text-[9rem]">
        That&apos;s
        <br />
        <span className="text-accent">the news.</span>
      </h2>
      <div className="mt-12">{links}</div>
    </section>
  ),
};

/* ───────────────────────── Briefing ───────────────────────── */

const briefing: LayoutSet = {
  Title: ({ date, status }) => (
    <section className="mx-auto w-full max-w-6xl">
      <div>
        <p className={`text-accent ${kicker}`}>Daily briefing</p>
        <h1 className="mt-4 text-5xl leading-[1.02] font-semibold tracking-tight text-balance sm:text-7xl">
          <RevealText text={formatDayLong(date)} stagger={60} />
        </h1>
        <div className="mt-6 text-muted">{status}</div>
      </div>
    </section>
  ),

  Story: ({ item, position, total }) => (
    <article className="mx-auto grid w-full max-w-6xl gap-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] sm:gap-12">
      <aside className="flex items-baseline gap-4 border-b border-line pb-4 sm:flex-col sm:gap-1 sm:border-r sm:border-b-0 sm:pr-8 sm:pb-0">
        <span className="font-mono text-5xl font-medium tabular-nums text-accent sm:text-7xl">{pad(position)}</span>
        <span className="text-sm text-muted">of {pad(total)}</span>
        <span className="text-sm font-medium sm:mt-6">{item.source}</span>
        <span className="text-sm text-muted">{formatTimestamp(item.publishedAt)}</span>
      </aside>
      <div>
        <h2 className="text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl"><RevealText text={item.title} delay={100} /></h2>
        {item.summary && (
          <p style={after(380)} className="motion-safe:animate-rise mt-6 text-lg leading-relaxed text-pretty text-ink/75 sm:text-xl">{item.summary}</p>
        )}
        {item.whyItMatters && (
          <div style={after(520)} className="motion-safe:animate-rise mt-8 rounded-2xl bg-accent-soft p-5 sm:p-6">
            <p className={`text-accent ${kicker}`}>Why it matters</p>
            <p className="mt-2 text-lg leading-snug text-pretty sm:text-xl">{item.whyItMatters}</p>
          </div>
        )}
        <div className="mt-6">
          <ArticleLink item={item} />
        </div>
      </div>
    </article>
  ),

  End: ({ links }) => (
    <section className="mx-auto w-full max-w-6xl">
      <div>
        <p className={`text-accent ${kicker}`}>End of briefing</p>
        <h2 className="mt-4 text-5xl leading-[1.02] font-semibold tracking-tight sm:text-7xl">Over to standup.</h2>
        <div className="mt-10">{links}</div>
      </div>
    </section>
  ),
};

export const SLIDE_LAYOUTS: Record<SlideLayout, LayoutSet> = { editorial, poster, briefing };
