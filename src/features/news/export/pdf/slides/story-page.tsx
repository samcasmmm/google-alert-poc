import { Link, Page, Text, View } from "@react-pdf/renderer";
import { formatTimestamp } from "@/lib/date";
import { cleanHeadline } from "../../../headline";
import type { NewsItem } from "../../../schema";
import { headlineSize, quoteSize, shortUrl } from "../shared/format";
import { PageFooter } from "./page-footer";
import type { SlideStyles } from "./styles";
import { PAGE_SIZE } from "../shared/theme";

interface StoryPageProps {
  item: NewsItem;
  position: number;
  total: number;
  page: number;
  pages: number;
  company: string;
  s: SlideStyles;
}

/**
 * Headline and summary on white; "why it matters" in the panel, in the day's colour.
 * Without a "why it matters" line (feed-snippet mode) the story uses the full width.
 */
export function StoryPage({ item, position, total, page, pages, company, s }: StoryPageProps) {
  const title = cleanHeadline(item.title);
  const why = item.whyItMatters.trim();
  const time = formatTimestamp(item.publishedAt);
  const pageLabel = `Page ${page} of ${pages}`;

  return (
    <Page size={PAGE_SIZE} style={s.page} id={`story-${position}`}>
      <View style={why ? s.storyColumn : s.storyColumnWide}>
        <Text style={s.rank}>{`Story ${position} of ${total}`}</Text>

        <View style={s.storyBody}>
          <Text style={[s.headline, { fontSize: headlineSize(title) }]}>{title}</Text>
          {item.summary ? <Text style={s.summary}>{item.summary}</Text> : null}
        </View>

        <View style={s.meta}>
          <Text style={s.source}>{item.source || shortUrl(item.url)}</Text>
          {time ? <Text style={s.time}>{time}</Text> : null}
          <Link src={item.url} style={s.articleLink}>
            Read the full article
          </Link>
        </View>

        <PageFooter company={company} pageLabel={why ? undefined : pageLabel} style={{ right: 44 }} s={s} />
      </View>

      {why ? (
        <View style={s.panel}>
          <Text style={s.panelLabel}>{company ? `Why it matters to ${company}` : "Why it matters"}</Text>
          <Text style={[s.quote, { fontSize: quoteSize(why) }]}>{why}</Text>
          <Text style={s.panelPage}>{pageLabel}</Text>
        </View>
      ) : null}
    </Page>
  );
}
