import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { ConfigForm } from "@/features/config/components/config-form";
import { DataSection } from "@/features/config/components/data-section";

export const metadata: Metadata = { title: "Settings · Standup News" };

export default function SettingsPage() {
  return (
    <PageShell title="Settings" intro="Saved in this browser only. Nothing is stored on the server.">
      <ConfigForm />
      <section aria-labelledby="data-title" className="mt-16 border-t border-line pt-10">
        <h2 id="data-title" className="font-mono text-xs tracking-[0.2em] text-accent uppercase">
          Data
        </h2>
        <div className="mt-3">
          <DataSection />
        </div>
      </section>
    </PageShell>
  );
}
