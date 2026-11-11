import type { Metadata } from "next";
import { Suspense } from "react";
import { BlankScreen, StandupView } from "./standup-view";

export const metadata: Metadata = { title: "Today · Standup News" };

export default function StandupPage() {
  return (
    <Suspense fallback={<BlankScreen />}>
      <StandupView />
    </Suspense>
  );
}
