import { Link, Page, Text, View } from "@react-pdf/renderer";
import { cleanHeadline } from "../../../headline";
import type { DailyNews } from "../../../schema";
import { formatDateKey, storyCount } from "../shared/format";
import type { SlideStyles } from "./styles";
import { COLOR, MARGIN, PAGE_SIZE } from "../shared/theme";

/** Masthead, the date as the hero, and a contents list that links to each story page. */
export function CoverPage({ news, company, s }: { news: DailyNews; company: string; s: SlideStyles }) {
  const year = formatDateKey(news.date, { year: "numeric" });
  const ranking =
    news.mode === "fallback"
      ? "from feed snippets"
      : `ranked by relevance${company ? ` to ${company}` : ""}`;

  return (
    <Page size={PAGE_SIZE} style={[s.page, { padding: MARGIN, paddingBottom: 40 }]}>
      <View style={s.coverTop}>
        <Text style={s.masthead}>Standup News</Text>
        {company ? <Text style={s.small}>{`Prepared for ${company}`}</Text> : null}
      </View>

      <View style={{ flexGrow: 1, justifyContent: "center" }}>
        <Text style={s.weekday}>{formatDateKey(news.date, { weekday: "long" })}</Text>
        <Text style={s.bigDate}>{formatDateKey(news.date, { month: "long", day: "numeric" })}</Text>
        <Text style={[s.small, { marginTop: 10 }]}>{`${year} edition. ${storyCount(news.items.length)} ${ranking}.`}</Text>
      </View>

      <View style={s.list}>
        {news.items.map((item, i) => (
          <Link
            key={item.url}
            src={`#story-${i + 1}`}
            style={[s.entry, { textDecoration: "none", color: COLOR.ink }]}
          >
            <Text style={s.entryNum}>{i + 1}</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.entryTitle}>{cleanHeadline(item.title)}</Text>
              <Text style={s.entrySource}>{item.source}</Text>
            </View>
          </Link>
        ))}
      </View>
    </Page>
  );
}
