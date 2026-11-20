"use client";

import { useMemo } from "react";
import { SearchableSelect, type SelectOption } from "@/components/searchable-select";
import { browserTimeZone } from "@/lib/date";
import { listTimeZones } from "@/lib/time-zones";

/** Stored value meaning "follow this browser's zone". */
const BROWSER = "";

/** Time zone dropdown: "use this browser's zone" first, then every IANA zone with its UTC offset. */
export function TimeZonePicker({
  id,
  value,
  onChange,
  invalid,
  describedBy,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
  describedBy?: string;
}) {
  const zones = useMemo(() => listTimeZones(), []);
  const browser = browserTimeZone();
  const browserZone = zones.find((z) => z.id === browser);

  const options = useMemo<SelectOption[]>(
    () => [
      {
        value: BROWSER,
        label: "Use this browser’s zone",
        secondary: browserZone?.city ?? browser,
        trailing: browserZone?.offset,
        keywords: `browser default ${browser}`,
        divider: true,
      },
      ...zones.map((z) => ({ value: z.id, label: z.city, secondary: z.region, trailing: z.offset, keywords: z.search })),
    ],
    [zones, browser, browserZone],
  );

  const current = zones.find((z) => z.id === value);
  const display = value
    ? current
      ? `${current.city}${current.region ? `, ${current.region}` : ""} (${current.offset})`
      : value
    : `This browser’s zone: ${browserZone?.city ?? browser}${browserZone ? ` (${browserZone.offset})` : ""}`;

  return (
    <SearchableSelect
      id={id}
      value={value}
      options={options}
      onChange={onChange}
      display={display}
      placeholder={!value}
      searchLabel="Search time zones"
      searchPlaceholder="Search city, region or GMT+5:30"
      invalid={invalid}
      describedBy={describedBy}
    />
  );
}
