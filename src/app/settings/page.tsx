import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { ConfigForm } from "@/features/config/components/config-form";
import { DataSection } from "@/features/config/components/data-section";
import { SettingsNav } from "@/features/config/components/settings-nav";

export const metadata: Metadata = { title: "Settings · Standup News" };

export default function SettingsPage() {
  return (
    <PageShell title="Settings" intro="Saved in this browser only. Nothing is stored on the server." wide>
      <div className="lg:grid lg:grid-cols-[11rem_minmax(0,1fr)] lg:gap-16">
        <SettingsNav />
        <div className="min-w-0 max-w-2xl">
          <ConfigForm />
          <div className="mt-16 border-t border-line pt-10">
            <DataSection />
          </div>
        </div>
      </div>
    </PageShell>
  );
}
