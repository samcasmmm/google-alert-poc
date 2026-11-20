import { Link, Text, View } from "@react-pdf/renderer";
import { formatTimestamp } from "@/lib/date";
import { cleanHeadline } from "../../../headline";
import type { NewsItem } from "../../../schema";
import { shortUrl } from "../shared/format";
import type { MemoStyles } from "./memo-styles";

/**
 * One story: rank and source in the side column, headline, summary and the
 * "why it matters" note in the reading column. Never split across pages.
 */
export function MemoStory({
  item,
  position,
  company,
  s,
}: {
  item: NewsItem;
  position: number;
  company: string;
  s: MemoStyles;
}) {
  const why = item.whyItMatters.trim();
  const time = formatTimestamp(item.publishedAt);
  return (
    <View style={position === 1 ? [s.story, s.storyFirst] : s.story} wrap={false}>
      <View style={s.rail}>
        <Text style={s.rank}>{position}</Text>
        <Text style={s.railSource}>{item.source || shortUrl(item.url)}</Text>
        {time ? <Text style={s.railTime}>{time}</Text> : null}
      </View>

      <View style={s.main}>
        <Link src={item.url} style={s.headline}>
          {cleanHeadline(item.title)}
        </Link>
        {item.summary ? <Text style={s.summary}>{item.summary}</Text> : null}
        {why ? (
          <View style={s.why}>
            <Text style={s.whyLabel}>{company ? `Why it matters to ${company}` : "Why it matters"}</Text>
            <Text style={s.whyText}>{why}</Text>
          </View>
        ) : null}
        <Link src={item.url} style={s.link}>
          Read the full article
        </Link>
      </View>
    </View>
  );
}
