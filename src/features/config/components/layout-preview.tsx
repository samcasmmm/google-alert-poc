import type { SlideLayout } from "../schema";

/** Schematic thumbnails of each layout (interface graphics, not illustrations). */
export function LayoutPreview({ layout }: { layout: SlideLayout }) {
  const bar = "rounded-sm bg-ink";
  const soft = "rounded-sm bg-line";
  return (
    <span aria-hidden className="block aspect-video overflow-hidden rounded-lg border border-line bg-paper p-3">
      {layout === "editorial" && (
        <span className="flex h-full flex-col gap-1.5">
          <span className="flex justify-between border-b border-ink pb-1">
            <span className="h-1 w-6 rounded-sm bg-accent" />
            <span className={`h-1 w-8 ${soft}`} />
          </span>
          <span className={`mt-1 h-2.5 w-11/12 ${bar}`} style={{ borderRadius: 1 }} />
          <span className={`h-2.5 w-2/3 ${bar}`} style={{ borderRadius: 1 }} />
          <span className={`mt-1 h-1 w-full ${soft}`} />
          <span className={`h-1 w-4/5 ${soft}`} />
          <span className="mt-auto flex gap-1.5">
            <span className="w-0.5 bg-accent" />
            <span className="flex flex-1 flex-col gap-1">
              <span className={`h-1 w-3/4 ${soft}`} />
              <span className={`h-1 w-1/2 ${soft}`} />
            </span>
          </span>
        </span>
      )}
      {layout === "poster" && (
        <span className="relative flex h-full flex-col gap-1.5">
          <span className="absolute -top-2 right-0 text-3xl leading-none font-black text-subtle">03</span>
          <span className={`relative mt-2 h-4 w-11/12 ${bar}`} style={{ borderRadius: 1 }} />
          <span className={`relative h-4 w-3/5 ${bar}`} style={{ borderRadius: 1 }} />
          <span className={`h-1 w-2/3 ${soft}`} />
          <span className="mt-auto h-3 w-3/4 bg-accent" />
        </span>
      )}
      {layout === "briefing" && (
        <span className="grid h-full grid-cols-[1fr_3fr] gap-2">
          <span className="flex flex-col gap-1 border-r border-line pr-2">
            <span className="h-3 w-5 rounded-sm bg-accent" />
            <span className={`h-1 w-full ${soft}`} />
            <span className={`h-1 w-3/4 ${soft}`} />
          </span>
          <span className="flex flex-col gap-1.5">
            <span className={`h-2.5 w-full ${bar}`} />
            <span className={`h-2.5 w-3/4 ${bar}`} />
            <span className={`h-1 w-full ${soft}`} />
            <span className="mt-auto h-4 w-full rounded bg-accent-soft" />
          </span>
        </span>
      )}
    </span>
  );
}
