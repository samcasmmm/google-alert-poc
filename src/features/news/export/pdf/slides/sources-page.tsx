import { Link, Page, Text, View } from "@react-pdf/renderer";
import { cleanHeadline } from "../../../headline";
import type { DailyNews } from "../../../schema";
import { shortUrl } from "../shared/format";
import { PageFooter } from "./page-footer";
import type { SlideStyles } from "./styles";
import { MARGIN, PAGE_SIZE } from "../shared/theme";

/** Closing page: every story's source with a clickable link. */
export function SourcesPage({ news, company, page, s }: { news: DailyNews; company: string; page: number; s: SlideStyles }) {
  return (
    <Page size={PAGE_SIZE} style={[s.page, { padding: MARGIN, paddingBottom: 56 }]}>
      <View style={s.sourcesHead}>
        <Text style={s.sourcesTitle}>Sources</Text>
        <Text style={s.sourcesNote}>That’s the briefing. Over to standup.</Text>
      </View>

      <View style={[s.list, { paddingTop: 18 }]}>
        {news.items.map((item, i) => (
          <View key={item.url} style={s.sourceRow}>
            <Text style={s.entryNum}>{i + 1}</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.source}>{item.source}</Text>
              <Text style={s.sourceTitle}>{cleanHeadline(item.title)}</Text>
              <Link src={item.url} style={s.sourceUrl}>
                {shortUrl(item.url)}
              </Link>
            </View>
          </View>
        ))}
      </View>

      <PageFooter company={company} pageLabel={`Page ${page} of ${page}`} s={s} />
    </Page>
  );
}
