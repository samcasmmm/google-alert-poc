import type { Metadata } from "next";
import { Suspense } from "react";
import { BlankScreen } from "@/components/blank-screen";
import { StandupView } from "@/features/news/components/standup/standup-view";

export const metadata: Metadata = { title: "Today · Standup News" };

export default function StandupPage() {
  return (
    <Suspense fallback={<BlankScreen />}>
      <StandupView />
    </Suspense>
  );
}
