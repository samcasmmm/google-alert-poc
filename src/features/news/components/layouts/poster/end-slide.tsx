import type { EndSlideProps } from "../types";

export function PosterEndSlide({ links }: EndSlideProps) {
  return (
    <section className="mx-auto w-full max-w-6xl">
      <h2 className="text-6xl leading-[0.85] font-black tracking-[-0.05em] uppercase sm:text-[9rem]">
        That&apos;s
        <br />
        <span className="text-accent">the news.</span>
      </h2>
      <div className="mt-12">{links}</div>
    </section>
  );
}
