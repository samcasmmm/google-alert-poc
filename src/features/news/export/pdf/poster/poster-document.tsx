import { Document, type DocumentProps } from "@react-pdf/renderer";
import type { ReactElement } from "react";
import type { DailyNews } from "../../../schema";
import { registerPdfFonts } from "../shared/fonts";
import { formatDateKey } from "../shared/format";
import { PosterClosing } from "./poster-closing";
import { PosterCover } from "./poster-cover";
import { PosterStory } from "./poster-story";

/** Poster design (16:9): headline index cover, one oversized story per page, sources. */
export function buildPosterDocument(news: DailyNews, company: string): ReactElement<DocumentProps> {
  registerPdfFonts();
  const who = company.trim();
  const total = news.items.length;
  const pages = total + 2;

  return (
    <Document
      title={`Standup News, ${formatDateKey(news.date, { month: "long", day: "numeric", year: "numeric" })}`}
      author={who || "Standup News"}
      subject="Daily news briefing, poster"
      creator="Standup News"
      producer="Standup News"
    >
      <PosterCover news={news} company={who} />
      {news.items.map((item, i) => (
        <PosterStory
          key={item.url}
          item={item}
          position={i + 1}
          total={total}
          page={i + 2}
          pages={pages}
          company={who}
        />
      ))}
      <PosterClosing news={news} company={who} page={pages} />
    </Document>
  );
}
