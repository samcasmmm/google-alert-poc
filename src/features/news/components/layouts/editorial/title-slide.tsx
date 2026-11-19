import { RevealText } from "@/components/reveal-text";
import { formatDayLong } from "@/lib/date";
import { kicker } from "../format";
import type { TitleSlideProps } from "../types";

export function EditorialTitleSlide({ date, status }: TitleSlideProps) {
  return (
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
  );
}
