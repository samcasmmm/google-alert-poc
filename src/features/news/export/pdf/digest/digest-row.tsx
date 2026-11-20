import { Link, Text, View } from "@react-pdf/renderer";
import { formatTimestamp } from "@/lib/date";
import { cleanHeadline } from "../../../headline";
import type { NewsItem } from "../../../schema";
import { shortUrl } from "../shared/format";
import { digestStyles as s } from "./digest-styles";

/**
 * One ranked story on the digest page: number, linked headline, then the
 * "why it matters" line (or the summary when there isn't one), source on the right.
 */
export function DigestRow({ item, position }: { item: NewsItem; position: number }) {
  const note = item.whyItMatters.trim() || item.summary;
  const time = formatTimestamp(item.publishedAt);
  return (
    <View style={position === 1 ? [s.row, s.rowFirst] : s.row} wrap={false}>
      <Text style={s.number}>{position}</Text>
      <View style={s.main}>
        <Link src={item.url} style={s.headline}>
          {cleanHeadline(item.title)}
        </Link>
        {note ? <Text style={s.note}>{note}</Text> : null}
      </View>
      <View style={s.side}>
        <Text style={s.source}>{item.source || shortUrl(item.url)}</Text>
        {time ? <Text style={s.time}>{time}</Text> : null}
      </View>
    </View>
  );
}
