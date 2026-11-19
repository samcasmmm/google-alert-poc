import Link from "next/link";
import { primaryButton } from "@/components/ui";

/** Nothing saved yet: say what fills this page and where to start. */
export function HistoryEmpty() {
  return (
    <div className="max-w-md py-10">
      <p className="font-serif text-2xl font-medium tracking-tight">No saved briefings yet</p>
      <p className="mt-2 text-muted">
        Every day you fetch the news is saved here in this browser, so you can search old stories and replay their
        slides.
      </p>
      <Link href="/standup" className={`${primaryButton} mt-6`}>
        Fetch today’s news
      </Link>
    </div>
  );
}
