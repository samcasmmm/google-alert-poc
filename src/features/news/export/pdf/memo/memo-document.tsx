import { Document, Page, type DocumentProps } from "@react-pdf/renderer";
import type { ReactElement } from "react";
import type { DailyNews } from "../../../schema";
import { registerPdfFonts } from "../shared/fonts";
import { formatDateKey } from "../shared/format";
import { COLOR } from "../shared/theme";
import { MemoMasthead } from "./memo-masthead";
import { MemoPageFurniture } from "./memo-page-furniture";
import { MemoStory } from "./memo-story";
import { createMemoStyles } from "./memo-styles";

/** Memo design (A4 portrait, flows over ~3 pages): a magazine-style reading copy. */
export function buildMemoDocument(news: DailyNews, company: string): ReactElement<DocumentProps> {
  registerPdfFonts();
  const who = company.trim();
  const s = createMemoStyles(COLOR);
  const day = formatDateKey(news.date, { month: "long", day: "numeric", year: "numeric" });

  return (
    <Document
      title={`Standup News, ${day}`}
      author={who || "Standup News"}
      subject="Daily news briefing"
      creator="Standup News"
      producer="Standup News"
    >
      <Page size="A4" style={s.page}>
        <MemoPageFurniture title={`Standup News, ${day}`} company={who} s={s} />
        <MemoMasthead news={news} company={who} s={s} />
        {news.items.map((item, i) => (
          <MemoStory key={item.url} item={item} position={i + 1} company={who} s={s} />
        ))}
      </Page>
    </Document>
  );
}
