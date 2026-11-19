import { Document, type DocumentProps } from "@react-pdf/renderer";
import type { ReactElement } from "react";
import type { DailyNews } from "../../schema";
import { CoverPage } from "./cover-page";
import { registerPdfFonts } from "./fonts";
import { formatDateKey } from "./format";
import { SourcesPage } from "./sources-page";
import { StoryPage } from "./story-page";

/**
 * The whole briefing as a react-pdf <Document>: cover, one page per story, sources.
 * Returns the element itself because react-pdf's `pdf()` needs a <Document> at the root.
 */
export function buildBriefingDocument(news: DailyNews, company: string): ReactElement<DocumentProps> {
  registerPdfFonts();
  const who = company.trim();
  const total = news.items.length;
  const pages = total + 2;

  return (
    <Document
      title={`Standup News, ${formatDateKey(news.date, { month: "long", day: "numeric", year: "numeric" })}`}
      author={who || "Standup News"}
      subject="Daily news briefing"
      creator="Standup News"
      producer="Standup News"
    >
      <CoverPage news={news} company={who} />
      {news.items.map((item, i) => (
        <StoryPage
          key={item.url}
          item={item}
          position={i + 1}
          total={total}
          page={i + 2}
          pages={pages}
          company={who}
        />
      ))}
      <SourcesPage news={news} company={who} page={pages} />
    </Document>
  );
}
