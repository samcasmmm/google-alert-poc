"use client";

import { useRef, useState } from "react";
import { Download, Upload } from "@/components/icons";
import { secondaryButton } from "@/components/ui";
import { exportData, importData } from "@/lib/backup";
import { dateKey } from "@/lib/date";
import { FormSection } from "./form-section";

/** Download all data as a JSON backup, or restore one (replaces everything in this browser). */
export function DataSection() {
  const fileInput = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);

  async function onExport() {
    const backup = await exportData();
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `standup-news-backup-${dateKey()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage({ tone: "ok", text: "Backup downloaded." });
  }

  async function onImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!confirm("Restoring replaces all saved briefings and settings in this browser. Continue?")) return;
    try {
      const tables = await importData(JSON.parse(await file.text()));
      setMessage({
        tone: "ok",
        text: `Restored ${tables.news.length} saved ${tables.news.length === 1 ? "briefing" : "briefings"} and your settings.`,
      });
    } catch (error) {
      setMessage({ tone: "error", text: error instanceof Error ? error.message : "That file isn’t a Standup News backup." });
    }
  }

  return (
    <FormSection
      id="backup"
      title="Backup"
      description="Everything lives in this browser only. Download a backup to keep a copy or move to another computer. It includes your Groq API key, so keep the file private."
    >
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => void onExport()} className={`${secondaryButton} gap-2`}>
          <Download size={16} /> Download backup
        </button>
        <button type="button" onClick={() => fileInput.current?.click()} className={`${secondaryButton} gap-2`}>
          <Upload size={16} /> Restore from backup
        </button>
        <input ref={fileInput} type="file" accept="application/json,.json" onChange={onImport} className="hidden" />
      </div>
      {message && (
        <p role="status" className={`mt-3 text-sm ${message.tone === "ok" ? "text-emerald-700" : "text-accent"}`}>
          {message.text}
        </p>
      )}
    </FormSection>
  );
}
