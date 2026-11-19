import type { DailyNews } from "../schema";

/** "standup-news-2026-11-19.pdf" */
export function exportFileName(news: DailyNews, ext: "pdf" | "pptx"): string {
  return `standup-news-${news.date}.${ext}`;
}

/** Saves a generated file through a temporary download link. */
export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
