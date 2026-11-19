import { after, RevealText } from "@/components/reveal-text";
import { formatTimestamp } from "@/lib/date";
import { ArticleLink } from "../article-link";
import { kicker, pad } from "../format";
import type { StorySlideProps } from "../types";

export function BriefingStorySlide({ item, position, total }: StorySlideProps) {
  return (
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
  );
}
