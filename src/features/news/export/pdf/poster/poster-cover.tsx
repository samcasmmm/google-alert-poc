import { Link, Page, Text, View } from "@react-pdf/renderer";
import { cleanHeadline } from "../../../headline";
import type { DailyNews } from "../../../schema";
import { formatDateKey, storyCount } from "../shared/format";
import { PAGE_SIZE } from "../shared/theme";
import { posterStyles as s } from "./poster-styles";

/** Cover: the day's headlines set large and stacked, each linking to its page. */
export function PosterCover({ news, company }: { news: DailyNews; company: string }) {
  return (
    <Page size={PAGE_SIZE} style={s.page}>
      <View style={s.top}>
        <Text style={s.brand}>Standup News</Text>
        <Text style={s.meta}>{formatDateKey(news.date, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</Text>
      </View>

      <View style={s.index}>
        {news.items.map((item, i) => (
          <Link key={item.url} src={`#poster-${i + 1}`} style={{ textDecoration: "none", color: s.page.color }}>
            <View style={s.indexRow}>
              <Text style={s.indexNum}>{i + 1}</Text>
              <Text style={s.indexTitle}>{cleanHeadline(item.title)}</Text>
            </View>
          </Link>
        ))}
      </View>

      <Text style={s.meta}>
        {`${storyCount(news.items.length)}${company ? ` for ${company}` : ""}${news.mode === "fallback" ? ", from feed snippets" : ""}`}
      </Text>
    </Page>
  );
}
