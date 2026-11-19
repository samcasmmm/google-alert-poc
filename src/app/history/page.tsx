import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { HistoryList } from "@/features/history/components/history-list";

export const metadata: Metadata = { title: "History · Standup News" };

export default function HistoryPage() {
  return (
    <PageShell title="Past standups">
      <HistoryList />
    </PageShell>
  );
}
