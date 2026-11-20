import { Text, View } from "@react-pdf/renderer";
import type { MemoStyles } from "./memo-styles";

/**
 * Repeats on every page: a short running head from page 2 on (page 1 has the
 * masthead), and a footer with who the briefing is for and "Page 2 of 3".
 */
export function MemoPageFurniture({ title, company, s }: { title: string; company: string; s: MemoStyles }) {
  return (
    <>
      <Text style={s.runningHead} fixed render={({ pageNumber }) => (pageNumber > 1 ? title : "")} />
      <View style={s.footer} fixed>
        <Text>{company ? `Standup News for ${company}` : "Standup News"}</Text>
        <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
      </View>
    </>
  );
}
