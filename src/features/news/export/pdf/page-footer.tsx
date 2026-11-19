import { Text, View } from "@react-pdf/renderer";
import type { ComponentProps } from "react";
import { styles } from "./styles";

/** Bottom line of a page: who the briefing is for, and optionally "Page 3 of 8". */
export function PageFooter({ company, pageLabel, style }: {
  company: string;
  pageLabel?: string;
  style?: ComponentProps<typeof View>["style"];
}) {
  return (
    <View style={style ? [styles.footer, ...[style].flat()] : styles.footer}>
      <Text>{company ? `Standup News for ${company}` : "Standup News"}</Text>
      {pageLabel ? <Text>{pageLabel}</Text> : null}
    </View>
  );
}
