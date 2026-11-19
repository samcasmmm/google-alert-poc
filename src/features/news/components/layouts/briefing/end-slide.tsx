import { kicker } from "../format";
import type { EndSlideProps } from "../types";

export function BriefingEndSlide({ links }: EndSlideProps) {
  return (
    <section className="mx-auto w-full max-w-6xl">
      <div>
        <p className={`text-accent ${kicker}`}>End of briefing</p>
        <h2 className="mt-4 text-5xl leading-[1.02] font-semibold tracking-tight sm:text-7xl">Over to standup.</h2>
        <div className="mt-10">{links}</div>
      </div>
    </section>
  );
}
