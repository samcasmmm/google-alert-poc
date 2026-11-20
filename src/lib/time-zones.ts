export interface TimeZoneOption {
  /** IANA id, e.g. "Asia/Kolkata" */
  id: string;
  /** "Kolkata" */
  city: string;
  /** "Asia" (or "" for ids like "UTC") */
  region: string;
  /** "GMT+5:30" right now (includes daylight saving) */
  offset: string;
  /** Minutes east of UTC, for sorting */
  minutes: number;
  /** Lowercased text matched by search */
  search: string;
}

/** Current UTC offset of a zone, e.g. "GMT+5:30" ("GMT" for UTC itself). */
export function zoneOffset(id: string, at = new Date()): string {
  try {
    const part = new Intl.DateTimeFormat("en-US", { timeZone: id, timeZoneName: "shortOffset" })
      .formatToParts(at)
      .find((p) => p.type === "timeZoneName");
    return part?.value ?? "";
  } catch {
    return "";
  }
}

function offsetMinutes(offset: string): number {
  const m = /GMT([+-])(\d{1,2})(?::(\d{2}))?/.exec(offset);
  if (!m) return 0;
  const value = Number(m[2]) * 60 + Number(m[3] ?? 0);
  return m[1] === "-" ? -value : value;
}

/**
 * Browsers still list some zones under old IANA names (Chrome: "Asia/Calcutta").
 * Show and search the current city name too.
 */
const RENAMED: Record<string, string> = {
  "Asia/Calcutta": "Kolkata",
  "Asia/Saigon": "Ho Chi Minh",
  "Asia/Rangoon": "Yangon",
  "Asia/Katmandu": "Kathmandu",
  "Asia/Dacca": "Dhaka",
  "Asia/Thimbu": "Thimphu",
  "Asia/Ulan_Bator": "Ulaanbaatar",
  "Asia/Macao": "Macau",
  "Asia/Ujung_Pandang": "Makassar",
  "Europe/Kiev": "Kyiv",
  "America/Godthab": "Nuuk",
  "Atlantic/Faeroe": "Faroe",
  "Pacific/Truk": "Chuuk",
  "Pacific/Ponape": "Pohnpei",
};

let cached: TimeZoneOption[] | null = null;

/** Every IANA zone this browser knows, sorted by offset then name. */
export function listTimeZones(): TimeZoneOption[] {
  if (cached) return cached;
  let ids: string[] = [];
  try {
    ids = Intl.supportedValuesOf("timeZone");
  } catch {
    ids = ["UTC"];
  }
  const now = new Date();
  cached = ids
    .map((id) => {
      const slash = id.lastIndexOf("/");
      const listed = (slash >= 0 ? id.slice(slash + 1) : id).replace(/_/g, " ");
      const city = RENAMED[id] ?? listed;
      const region = slash >= 0 ? id.slice(0, slash).replace(/_/g, " ") : "";
      const offset = zoneOffset(id, now);
      return {
        id,
        city,
        region,
        offset,
        minutes: offsetMinutes(offset),
        search: `${id} ${city} ${listed} ${region} ${offset}`.toLowerCase(),
      };
    })
    .sort((a, b) => a.minutes - b.minutes || a.id.localeCompare(b.id));
  return cached;
}
