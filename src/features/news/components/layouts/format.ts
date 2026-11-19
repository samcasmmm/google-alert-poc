import { formatDayLong } from "@/lib/date";

export const pad = (n: number) => String(n).padStart(2, "0");

/** Small uppercase label style shared by the slide layouts. */
export const kicker = "font-mono text-xs uppercase tracking-[0.2em]";

/** "November 19" from a date key. */
export function monthDay(date: string): string {
  return formatDayLong(date).split(", ").slice(1).join(", ");
}
