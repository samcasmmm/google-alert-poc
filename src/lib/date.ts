// "YYYY-MM-DD" date keys. The browser computes "today" in the configured time
// zone and sends it to the server, so both agree on which day it is.

export function browserTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
}

export function isValidTimeZone(tz: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

export function dateKey(date: Date = new Date(), timeZone?: string): string {
  const tz = timeZone && isValidTimeZone(timeZone) ? timeZone : undefined;
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function isDateKey(value: string | null | undefined): value is string {
  return !!value && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

// Noon UTC avoids the key shifting a day when formatted.
function keyToDate(key: string): Date {
  return new Date(`${key}T12:00:00Z`);
}

/** 0 = Sunday … 6 = Saturday */
export function weekdayOf(key: string): number {
  return keyToDate(key).getUTCDay();
}

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** "Thursday" */
export function weekdayName(key: string): string {
  return WEEKDAYS[weekdayOf(key)];
}

export function formatDayLong(key: string): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(keyToDate(key));
}

export function formatDayShort(key: string): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(keyToDate(key));
}

/** "Thu 19" */
export function formatWeekdayDay(key: string): string {
  return `${weekdayName(key).slice(0, 3)} ${Number(key.slice(8, 10))}`;
}

/** "November 2026" from a "YYYY-MM" or "YYYY-MM-DD" key. */
export function formatMonth(key: string): string {
  return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${key.slice(0, 7)}-15T12:00:00Z`),
  );
}

/** "3 hours ago", "yesterday", "in 2 days" relative to now. */
export function formatRelative(iso: string, now = Date.now()): string {
  const then = Date.parse(iso);
  if (Number.isNaN(then)) return "";
  const seconds = Math.round((then - now) / 1000);
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size) return rtf.format(Math.round(seconds / size), unit);
  }
  return "just now";
}

/** Article timestamp in the viewer's local time. */
export function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}
