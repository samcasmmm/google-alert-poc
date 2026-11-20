import { Text, View } from "@react-pdf/renderer";
import type { DailyNews } from "../../../schema";
import { formatDateKey, storyCount } from "../shared/format";
import type { MemoStyles } from "./memo-styles";

/** Page-one header: title, date, who it is for, and a one-line summary of the briefing. */
export function MemoMasthead({ news, company, s }: { news: DailyNews; company: string; s: MemoStyles }) {
  const ranking =
    news.mode === "fallback" ? "taken from the feeds’ own snippets" : `ranked by relevance${company ? ` to ${company}` : ""}`;
  return (
    <View>
      <View style={s.mastRow}>
        <Text style={s.masthead}>Standup News</Text>
        <View style={s.mastMeta}>
          <Text style={s.mastDate}>
            {formatDateKey(news.date, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          </Text>
          {company ? <Text style={s.mastFor}>{`Prepared for ${company}`}</Text> : null}
        </View>
      </View>
      <View style={s.mastRule} />
      <Text style={s.intro}>{`${storyCount(news.items.length)}, ${ranking}.`}</Text>
    </View>
  );
}
