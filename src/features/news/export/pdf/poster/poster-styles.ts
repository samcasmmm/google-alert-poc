import { StyleSheet } from "@react-pdf/renderer";
import { COLOR, PAGE } from "../shared/theme";

// Poster: 16:9, "exaggerated minimalism" (ui-ux-pro-max style match): oversized Geist
// headlines in black, wide white space, no serif and no colour fills. Vermilion is used
// for one thing only, the story's rank.

export const POSTER = { margin: 56 } as const;

export const posterStyles = StyleSheet.create({
  page: {
    width: PAGE.width,
    height: PAGE.height,
    padding: POSTER.margin,
    paddingBottom: 46,
    backgroundColor: COLOR.paper,
    color: COLOR.ink,
    fontFamily: "Geist",
    fontSize: 11,
  },
  top: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  brand: { fontWeight: 600, fontSize: 12 },
  meta: { fontSize: 10.5, color: COLOR.muted },
  rank: { fontWeight: 600, fontSize: 12, color: COLOR.accent },

  // Cover: every headline set large, like a poster index
  index: { flexGrow: 1, justifyContent: "center" },
  indexRow: { flexDirection: "row", alignItems: "baseline", marginBottom: 9 },
  indexNum: { width: 26, fontWeight: 600, fontSize: 12, color: COLOR.accent },
  indexTitle: { flex: 1, fontWeight: 600, fontSize: 23, letterSpacing: -0.6, maxLines: 1, textOverflow: "ellipsis" },

  // Story
  headlineBox: { flexGrow: 1, justifyContent: "center", paddingRight: 90 },
  headline: { fontWeight: 600, lineHeight: 1.02, letterSpacing: -1.6, maxLines: 4, textOverflow: "ellipsis" },
  columns: { flexDirection: "row", borderTopWidth: 1.5, borderTopColor: COLOR.ink, paddingTop: 14 },
  column: { flex: 1 },
  columnGap: { width: 40 },
  label: { fontWeight: 500, fontSize: 9.5, color: COLOR.muted, marginBottom: 5 },
  summary: { fontSize: 11, lineHeight: 1.55, color: COLOR.body, maxLines: 5, textOverflow: "ellipsis" },
  why: { fontWeight: 500, fontSize: 13.5, lineHeight: 1.4, maxLines: 5, textOverflow: "ellipsis" },
  bottom: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginTop: 16 },
  link: { fontWeight: 500, fontSize: 10, color: COLOR.ink, textDecoration: "underline" },
  page_: { fontSize: 9, color: COLOR.muted },

  // Closing
  closingTitle: { fontWeight: 600, fontSize: 88, letterSpacing: -3.5, lineHeight: 1 },
  sources: { flexDirection: "row", flexWrap: "wrap", marginTop: 28 },
  source: { width: "33.33%", paddingRight: 18, marginBottom: 10 },
  sourceName: { fontWeight: 600, fontSize: 9.5 },
  sourceUrl: { fontSize: 8.5, color: COLOR.muted, textDecoration: "underline", marginTop: 2, maxLines: 1 },
});

/** Headline size by length: as large as possible while staying within ~4 lines. */
export function posterHeadlineSize(title: string): number {
  if (title.length <= 45) return 62;
  if (title.length <= 75) return 52;
  if (title.length <= 105) return 43;
  return 36;
}
