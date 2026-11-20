import { Document, Page, Text, View, type DocumentProps } from "@react-pdf/renderer";
import type { ReactElement } from "react";
import type { DailyNews } from "../../../schema";
import { registerPdfFonts } from "../shared/fonts";
import { formatDateKey } from "../shared/format";
import { DigestHeader } from "./digest-header";
import { DigestRow } from "./digest-row";
import { digestStyles as s } from "./digest-styles";

/** One-page digest format (A4 portrait): every story as a ranked row on a single page. */
export function buildDigestDocument(news: DailyNews, company: string): ReactElement<DocumentProps> {
  registerPdfFonts();
  const who = company.trim();
  const year = formatDateKey(news.date, { year: "numeric" });

  return (
    <Document
      title={`Standup News digest, ${formatDateKey(news.date, { month: "long", day: "numeric", year: "numeric" })}`}
      author={who || "Standup News"}
      subject="Daily news briefing, one-page digest"
      creator="Standup News"
      producer="Standup News"
    >
      <Page size="A4" style={s.page} wrap={false}>
        <DigestHeader news={news} company={who} />
        {news.items.map((item, i) => (
          <DigestRow key={item.url} item={item} position={i + 1} />
        ))}
        <View style={s.footer}>
          <Text>{who ? `Standup News for ${who}` : "Standup News"}</Text>
          <Text>{year}</Text>
        </View>
      </Page>
    </Document>
  );
}
