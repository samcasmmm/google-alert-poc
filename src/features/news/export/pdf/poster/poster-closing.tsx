import { Link, Page, Text, View } from "@react-pdf/renderer";
import type { DailyNews } from "../../../schema";
import { shortUrl } from "../shared/format";
import { PAGE_SIZE } from "../shared/theme";
import { posterStyles as s } from "./poster-styles";

/** Closing page: one large line, then every source as a link. */
export function PosterClosing({ news, company, page }: { news: DailyNews; company: string; page: number }) {
  return (
    <Page size={PAGE_SIZE} style={s.page}>
      <View style={s.top}>
        <Text style={s.brand}>Standup News</Text>
        <Text style={s.meta}>{company ? `Prepared for ${company}` : ""}</Text>
      </View>

      <View style={{ flexGrow: 1, justifyContent: "center" }}>
        <Text style={s.closingTitle}>That’s the news.</Text>
        <View style={s.sources}>
          {news.items.map((item, i) => (
            <View key={item.url} style={s.source}>
              <Text style={s.sourceName}>
                <Text style={s.rank}>{`${i + 1}  `}</Text>
                {item.source || shortUrl(item.url)}
              </Text>
              <Link src={item.url} style={s.sourceUrl}>
                {shortUrl(item.url)}
              </Link>
            </View>
          ))}
        </View>
      </View>

      <View style={s.bottom}>
        <Text style={s.meta}>Over to standup.</Text>
        <Text style={s.page_}>{`Page ${page} of ${page}`}</Text>
      </View>
    </Page>
  );
}
