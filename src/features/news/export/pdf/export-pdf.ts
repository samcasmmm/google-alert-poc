import type { DailyNews } from "../../schema";
import { downloadBlob, exportFileName } from "../file-name";

/**
 * Builds the 16:9 PDF in the browser and downloads it: no print dialog, so paper
 * size, margins and "background graphics" settings can't change how it looks.
 * The renderer (~0.5MB) loads only when someone exports.
 */
export async function exportPdf(news: DailyNews, company: string): Promise<void> {
  const [{ pdf }, { buildBriefingDocument }] = await Promise.all([
    import("@react-pdf/renderer"),
    import("./briefing-document"),
  ]);
  const blob = await pdf(buildBriefingDocument(news, company)).toBlob();
  downloadBlob(blob, exportFileName(news, "pdf"));
}
