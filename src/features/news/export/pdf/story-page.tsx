import { Link, Page, Text, View } from "@react-pdf/renderer";
import { formatTimestamp } from "@/lib/date";
import { cleanHeadline } from "../../headline";
import type { NewsItem } from "../../schema";
import { headlineSize, quoteSize, shortUrl } from "./format";
import { PageFooter } from "./page-footer";
import { styles } from "./styles";
import { PAGE_SIZE } from "./theme";

interface StoryPageProps {
  item: NewsItem;
  position: number;
  total: number;
  page: number;
  pages: number;
  company: string;
}

/**
 * Headline and summary on white; "why it matters" in the vermilion panel.
 * Without a "why it matters" line (feed-snippet mode) the story uses the full width.
 */
export function StoryPage({ item, position, total, page, pages, company }: StoryPageProps) {
  const title = cleanHeadline(item.title);
  const why = item.whyItMatters.trim();
  const time = formatTimestamp(item.publishedAt);
  const pageLabel = `Page ${page} of ${pages}`;

  return (
    <Page size={PAGE_SIZE} style={styles.page} id={`story-${position}`}>
      <View style={why ? styles.storyColumn : styles.storyColumnWide}>
        <Text style={styles.rank}>{`Story ${position} of ${total}`}</Text>

        <View style={styles.storyBody}>
          <Text style={[styles.headline, { fontSize: headlineSize(title) }]}>{title}</Text>
          {item.summary ? <Text style={styles.summary}>{item.summary}</Text> : null}
        </View>

        <View style={styles.meta}>
          <Text style={styles.source}>{item.source || shortUrl(item.url)}</Text>
          {time ? <Text style={styles.time}>{time}</Text> : null}
          <Link src={item.url} style={styles.articleLink}>
            Read the full article
          </Link>
        </View>

        <PageFooter company={company} pageLabel={why ? undefined : pageLabel} style={{ right: 44 }} />
      </View>

      {why ? (
        <View style={styles.panel}>
          <Text style={styles.panelLabel}>{company ? `Why it matters to ${company}` : "Why it matters"}</Text>
          <Text style={[styles.quote, { fontSize: quoteSize(why) }]}>{why}</Text>
          <Text style={styles.panelPage}>{pageLabel}</Text>
        </View>
      ) : null}
    </Page>
  );
}
