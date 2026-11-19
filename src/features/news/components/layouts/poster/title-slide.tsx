import { RevealText } from "@/components/reveal-text";
import { weekdayName } from "@/lib/date";
import { kicker, monthDay } from "../format";
import type { TitleSlideProps } from "../types";

export function PosterTitleSlide({ date, status }: TitleSlideProps) {
  return (
    <section className="mx-auto w-full max-w-6xl">
      <p className={`text-muted ${kicker}`}>Standup News</p>
      <h1 className="mt-4 text-6xl leading-[0.85] font-black tracking-[-0.05em] uppercase sm:text-[10rem]">
        <RevealText text={weekdayName(date)} />
      </h1>
      <p className="mt-3 text-3xl font-bold tracking-tight text-accent sm:text-5xl">{monthDay(date)}</p>
      <div className="mt-6 text-muted">{status}</div>
    </section>
  );
}
