"use client";

import { useRef, useState } from "react";
import { Download, Upload } from "@/components/icons";
import { secondaryButton } from "@/components/ui";
import { exportData, importData } from "@/lib/backup";
import { dateKey } from "@/lib/date";

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
    if (!confirm("Importing replaces ALL data in this browser (saved news and settings). Continue?")) return;
    try {
      const tables = await importData(JSON.parse(await file.text()));
      setMessage({
        tone: "ok",
        text: `Imported ${tables.news.length} days of news and your settings.`,
      });
    } catch (error) {
      setMessage({ tone: "error", text: error instanceof Error ? error.message : "Import failed." });
    }
  }

  return (
    <div>
      <p className="text-sm text-muted">
        Everything is stored in this browser only. Export a backup to move it to another machine or keep a copy.
        The backup includes your Groq API key, so keep the file private.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={() => void onExport()} className={`${secondaryButton} gap-2`}>
          <Download size={16} /> Export JSON
        </button>
        <button type="button" onClick={() => fileInput.current?.click()} className={`${secondaryButton} gap-2`}>
          <Upload size={16} /> Import JSON
        </button>
        <input ref={fileInput} type="file" accept="application/json,.json" onChange={onImport} className="hidden" />
      </div>
      {message && (
        <p role="status" className={`mt-3 text-sm ${message.tone === "ok" ? "text-emerald-700" : "text-accent"}`}>
          {message.text}
        </p>
      )}
    </div>
  );
}
