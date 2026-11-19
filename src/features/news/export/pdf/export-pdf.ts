import { createElement } from "react";
import type { DailyNews } from "../schema";
import { exportFileName } from "./export-pptx";

/** Builds the 16:9 PDF in the browser and downloads it. The renderer loads only on use. */
export async function exportPdf(news: DailyNews, company: string): Promise<void> {
  const [{ pdf }, { BriefingDocument }] = await Promise.all([
    import("@react-pdf/renderer"),
    import("./pdf-document"),
  ]);
  const blob = await pdf(createElement(BriefingDocument, { news, company })).toBlob();

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = exportFileName(news, "pdf");
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
