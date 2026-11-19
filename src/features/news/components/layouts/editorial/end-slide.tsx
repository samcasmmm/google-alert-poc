import type { EndSlideProps } from "../types";

export function EditorialEndSlide({ links }: EndSlideProps) {
  return (
    <section className="mx-auto w-full max-w-5xl text-center">
      <p className="font-serif text-3xl text-muted" aria-hidden>
        — 30 —
      </p>
      <h2 className="mt-6 font-serif text-5xl font-medium tracking-tight sm:text-7xl">Over to standup.</h2>
      <div className="mt-12 flex justify-center">{links}</div>
    </section>
  );
}
