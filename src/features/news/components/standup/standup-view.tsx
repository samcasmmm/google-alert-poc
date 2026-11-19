"use client";

import { useSearchParams } from "next/navigation";
import { BlankScreen } from "@/components/blank-screen";
import { useConfig } from "@/features/config/config";
import { isDateKey } from "@/lib/date";
import { useToday } from "@/lib/use-today";
import { StandupDay } from "./standup-day";

/** /standup: picks the day (?date= or today) once config and the clock are known. */
export function StandupView() {
  const config = useConfig();
  const today = useToday(config?.timeZone);
  const params = useSearchParams();
  const param = params.get("date");
  // ?story=3 opens the slides at that story (links from History).
  const story = Number(params.get("story")) || 0;
  if (!today || !config) return <BlankScreen />;
  const date = isDateKey(param) ? param : today;
  return <StandupDay key={date} date={date} isToday={date === today} config={config} startAt={story} />;
}
