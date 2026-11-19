import { Link, Page, Text, View } from "@react-pdf/renderer";
import { cleanHeadline } from "../../headline";
import type { DailyNews } from "../../schema";
import { formatDateKey, storyCount } from "./format";
import { styles } from "./styles";
import { COLOR, MARGIN, PAGE_SIZE } from "./theme";

/** Masthead, the date as the hero, and a contents list that links to each story page. */
export function CoverPage({ news, company }: { news: DailyNews; company: string }) {
  const year = formatDateKey(news.date, { year: "numeric" });
  const snippets = news.mode === "fallback" ? " from feed snippets" : "";

  return (
    <Page size={PAGE_SIZE} style={[styles.page, { padding: MARGIN, paddingBottom: 40 }]}>
      <View style={styles.coverTop}>
        <Text style={styles.masthead}>Standup News</Text>
        {company ? <Text style={styles.small}>{`Prepared for ${company}`}</Text> : null}
      </View>

      <View style={{ flexGrow: 1, justifyContent: "center" }}>
        <Text style={styles.weekday}>{formatDateKey(news.date, { weekday: "long" })}</Text>
        <Text style={styles.bigDate}>{formatDateKey(news.date, { month: "long", day: "numeric" })}</Text>
        <Text style={[styles.small, { marginTop: 10 }]}>{`${year}, ${storyCount(news.items.length)}${snippets}`}</Text>
      </View>

      <View style={styles.list}>
        {news.items.map((item, i) => (
          <Link
            key={item.url}
            src={`#story-${i + 1}`}
            style={[styles.entry, { textDecoration: "none", color: COLOR.ink }]}
          >
            <Text style={styles.entryNum}>{i + 1}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.entryTitle}>{cleanHeadline(item.title)}</Text>
              <Text style={styles.entrySource}>{item.source}</Text>
            </View>
          </Link>
        ))}
      </View>
    </Page>
  );
}
