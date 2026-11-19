import { Link, Page, Text, View } from "@react-pdf/renderer";
import { cleanHeadline } from "../../headline";
import type { DailyNews } from "../../schema";
import { shortUrl } from "./format";
import { PageFooter } from "./page-footer";
import { styles } from "./styles";
import { MARGIN, PAGE_SIZE } from "./theme";

/** Closing page: every story's source with a clickable link. */
export function SourcesPage({ news, company, page }: { news: DailyNews; company: string; page: number }) {
  return (
    <Page size={PAGE_SIZE} style={[styles.page, { padding: MARGIN, paddingBottom: 56 }]}>
      <View style={styles.sourcesHead}>
        <Text style={styles.sourcesTitle}>Sources</Text>
        <Text style={styles.sourcesNote}>That’s the briefing. Over to standup.</Text>
      </View>

      <View style={[styles.list, { paddingTop: 18 }]}>
        {news.items.map((item, i) => (
          <View key={item.url} style={styles.sourceRow}>
            <Text style={styles.entryNum}>{i + 1}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.source}>{item.source}</Text>
              <Text style={styles.sourceTitle}>{cleanHeadline(item.title)}</Text>
              <Link src={item.url} style={styles.sourceUrl}>
                {shortUrl(item.url)}
              </Link>
            </View>
          </View>
        ))}
      </View>

      <PageFooter company={company} pageLabel={`Page ${page} of ${page}`} />
    </Page>
  );
}
