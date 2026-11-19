import { after, RevealText } from "@/components/reveal-text";
import { formatTimestamp } from "@/lib/date";
import { ArticleLink } from "../article-link";
import { kicker, pad } from "../format";
import type { StorySlideProps } from "../types";

export function EditorialStorySlide({ item, position, total }: StorySlideProps) {
  return (
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
  );
}
