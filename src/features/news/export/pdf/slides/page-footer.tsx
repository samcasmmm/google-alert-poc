import { Text, View } from "@react-pdf/renderer";
import type { ComponentProps } from "react";
import type { SlideStyles } from "./styles";

/** Bottom line of a page: who the briefing is for, and optionally "Page 3 of 8". */
export function PageFooter({ company, pageLabel, style, s }: {
  company: string;
  pageLabel?: string;
  s: SlideStyles;
  style?: ComponentProps<typeof View>["style"];
}) {
  return (
    <View style={style ? [s.footer, ...[style].flat()] : s.footer}>
      <Text>{company ? `Standup News for ${company}` : "Standup News"}</Text>
      {pageLabel ? <Text>{pageLabel}</Text> : null}
    </View>
  );
}
