import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { primaryButton, secondaryButton } from "@/components/ui";
import { formatDayLong } from "@/lib/date";

/** A past day with no saved briefing. */
export function EmptyDay({ date }: { date: string }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main id="main" className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-4 py-16">
        <p className="font-mono text-xs tracking-[0.2em] text-muted uppercase">{formatDayLong(date)}</p>
        <h1 className="mt-3 font-serif text-4xl font-medium tracking-tight">No briefing saved for this day.</h1>
        <p className="mt-3 text-muted">Only days you fetched in this browser are kept.</p>
        <div className="mt-8 flex flex-wrap gap-2">
          <Link href="/standup" className={primaryButton}>
            Go to today
          </Link>
          <Link href="/history" className={secondaryButton}>
            Past briefings
          </Link>
        </div>
      </main>
    </div>
  );
}
