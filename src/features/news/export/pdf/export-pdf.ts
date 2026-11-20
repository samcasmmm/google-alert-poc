import type { DocumentProps } from "@react-pdf/renderer";
import type { ReactElement } from "react";
import type { DailyNews } from "../../schema";
import { downloadBlob, exportFileName } from "../file-name";
import type { PdfFormat } from "./formats";

/** Loads only the chosen format's code, then builds its <Document>. */
async function buildDocument(format: PdfFormat, news: DailyNews, company: string): Promise<ReactElement<DocumentProps>> {
  switch (format) {
    case "slides":
      return (await import("./slides/slides-document")).buildSlidesDocument(news, company);
  }
}

/**
 * Builds the PDF in the browser and downloads it: no print dialog, so paper size,
 * margins and "background graphics" settings can't change how it looks.
 * The renderer (~0.5MB) loads only when someone exports.
 */
export async function exportPdf(news: DailyNews, company: string, format: PdfFormat = "slides"): Promise<void> {
  const [{ pdf }, doc] = await Promise.all([import("@react-pdf/renderer"), buildDocument(format, news, company)]);
  const blob = await pdf(doc).toBlob();
  downloadBlob(blob, exportFileName(news, "pdf", format));
}
