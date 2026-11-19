import { RevealText } from "@/components/reveal-text";
import { formatDayLong } from "@/lib/date";
import { kicker } from "../format";
import type { TitleSlideProps } from "../types";

export function BriefingTitleSlide({ date, status }: TitleSlideProps) {
  return (
    <section className="mx-auto w-full max-w-6xl">
      <div>
        <p className={`text-accent ${kicker}`}>Daily briefing</p>
        <h1 className="mt-4 text-5xl leading-[1.02] font-semibold tracking-tight text-balance sm:text-7xl">
          <RevealText text={formatDayLong(date)} stagger={60} />
        </h1>
        <div className="mt-6 text-muted">{status}</div>
      </div>
    </section>
  );
}
