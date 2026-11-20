import { Link, Page, Text, View } from "@react-pdf/renderer";
import { formatTimestamp } from "@/lib/date";
import { cleanHeadline } from "../../../headline";
import type { NewsItem } from "../../../schema";
import { shortUrl } from "../shared/format";
import { PAGE_SIZE } from "../shared/theme";
import { posterHeadlineSize, posterStyles as s } from "./poster-styles";

/**
 * One story: an oversized headline fills the page; under a heavy rule, what happened
 * and why it matters sit side by side.
 */
export function PosterStory({
  item,
  position,
  total,
  page,
  pages,
  company,
}: {
  item: NewsItem;
  position: number;
  total: number;
  page: number;
  pages: number;
  company: string;
}) {
  const title = cleanHeadline(item.title);
  const why = item.whyItMatters.trim();
  const time = formatTimestamp(item.publishedAt);

  return (
    <Page size={PAGE_SIZE} style={s.page} id={`poster-${position}`}>
      <View style={s.top}>
        <Text style={s.rank}>{`${position} of ${total}`}</Text>
        <Text style={s.meta}>{[item.source || shortUrl(item.url), time].filter(Boolean).join(", ")}</Text>
      </View>

      <View style={s.headlineBox}>
        <Text style={[s.headline, { fontSize: posterHeadlineSize(title) }]}>{title}</Text>
      </View>

      <View style={s.columns}>
        <View style={why ? s.column : s.columnWide}>
          <Text style={s.label}>What happened</Text>
          <Text style={s.summary}>{item.summary || "No summary in the feed."}</Text>
        </View>
        {why ? (
          <>
            <View style={s.columnGap} />
            <View style={s.column}>
              <Text style={s.label}>{company ? `Why it matters to ${company}` : "Why it matters"}</Text>
              <Text style={s.why}>{why}</Text>
            </View>
          </>
        ) : null}
      </View>

      <View style={s.bottom}>
        <Link src={item.url} style={s.link}>
          Read the full article
        </Link>
        <Text style={s.pageLabel}>{`Page ${page} of ${pages}`}</Text>
      </View>
    </Page>
  );
}
