import { Text, View } from "@react-pdf/renderer";
import type { DailyNews } from "../../../schema";
import { formatDateKey, storyCount } from "../shared/format";
import { digestStyles as s } from "./digest-styles";

/** Brand line, the date as the title, and what the list is. */
export function DigestHeader({ news, company }: { news: DailyNews; company: string }) {
  const rankedFor = company ? ` to ${company}` : "";
  const subtitle =
    news.mode === "fallback"
      ? `${storyCount(news.items.length)} from your feeds. Headlines link to the articles.`
      : `${storyCount(news.items.length)} ranked by relevance${rankedFor}, each with why it matters. Headlines link to the articles.`;
  return (
    <View>
      <View style={s.top}>
        <Text style={s.brand}>Standup News</Text>
        {company ? <Text style={s.for}>{`Prepared for ${company}`}</Text> : null}
      </View>
      <Text style={s.title}>{formatDateKey(news.date, { weekday: "long", month: "long", day: "numeric" })}</Text>
      <Text style={s.subtitle}>{subtitle}</Text>
    </View>
  );
}
