import { after, RevealText } from "@/components/reveal-text";
import { formatTimestamp } from "@/lib/date";
import { ArticleLink } from "../article-link";
import { kicker, pad } from "../format";
import type { StorySlideProps } from "../types";

export function PosterStorySlide({ item, position, total }: StorySlideProps) {
  return (
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
  );
}
