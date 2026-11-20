import { StyleSheet } from "@react-pdf/renderer";
import { COLOR, MARGIN, PAGE, PANEL_WIDTH } from "../shared/theme";

// Design: quiet white pages in Newsreader + Geist, with one bold element, the
// full-height vermilion "why it matters" panel. That line is the company-specific
// part of the briefing, so it is the one place colour is spent.

export const styles = StyleSheet.create({
  page: {
    width: PAGE.width,
    height: PAGE.height,
    backgroundColor: COLOR.paper,
    color: COLOR.ink,
    fontFamily: "Geist",
    fontSize: 11,
  },
  footer: {
    position: "absolute",
    left: MARGIN,
    right: MARGIN,
    bottom: 26,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8.5,
    color: COLOR.muted,
  },

  // Cover
  coverTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  masthead: { fontFamily: "Newsreader", fontWeight: 500, fontSize: 17 },
  small: { fontSize: 10, color: COLOR.muted },
  weekday: { fontFamily: "Newsreader", fontStyle: "italic", fontSize: 30, color: COLOR.muted },
  bigDate: { fontFamily: "Newsreader", fontWeight: 500, fontSize: 92, lineHeight: 1, letterSpacing: -2.5 },
  list: { flexDirection: "row", flexWrap: "wrap", borderTopWidth: 1, borderTopColor: COLOR.ink, paddingTop: 14 },
  entry: { width: "50%", flexDirection: "row", paddingRight: 28, marginBottom: 12 },
  entryNum: { width: 20, fontFamily: "Newsreader", fontWeight: 500, fontSize: 13, color: COLOR.accent },
  entryTitle: { fontWeight: 500, fontSize: 11, lineHeight: 1.35, maxLines: 2, textOverflow: "ellipsis" },
  entrySource: { fontSize: 9, color: COLOR.muted, marginTop: 2 },

  // Story
  storyColumn: { position: "absolute", top: 0, left: 0, bottom: 0, width: PAGE.width - PANEL_WIDTH },
  storyColumnWide: { position: "absolute", top: 0, left: 0, bottom: 0, right: 0 },
  storyBody: { flexGrow: 1, justifyContent: "center", paddingLeft: MARGIN, paddingRight: 44, paddingBottom: 30 },
  rank: { position: "absolute", top: MARGIN, left: MARGIN, fontWeight: 500, fontSize: 10, color: COLOR.accent },
  headline: { fontFamily: "Newsreader", fontWeight: 500, lineHeight: 1.1, letterSpacing: -0.6, maxLines: 4, textOverflow: "ellipsis" },
  summary: { fontSize: 13.5, lineHeight: 1.55, color: COLOR.body, marginTop: 18, maxLines: 6, textOverflow: "ellipsis" },
  meta: { position: "absolute", left: MARGIN, right: 44, bottom: 58 },
  source: { fontWeight: 600, fontSize: 11 },
  time: { fontSize: 9.5, color: COLOR.muted, marginTop: 2 },
  articleLink: { fontWeight: 500, fontSize: 10, color: COLOR.accent, textDecoration: "underline", marginTop: 8 },
  panel: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: PANEL_WIDTH,
    paddingHorizontal: 40,
    justifyContent: "center",
    backgroundColor: COLOR.accent,
    color: COLOR.onAccent,
  },
  panelLabel: { fontWeight: 500, fontSize: 10.5, color: COLOR.onAccentSoft },
  quote: { fontFamily: "Newsreader", fontStyle: "italic", lineHeight: 1.28, marginTop: 14, maxLines: 9, textOverflow: "ellipsis" },
  panelPage: { position: "absolute", right: 40, bottom: 26, fontSize: 8.5, color: COLOR.onAccentSoft },

  // Sources
  sourcesHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 26 },
  sourcesTitle: { fontFamily: "Newsreader", fontWeight: 500, fontSize: 40, letterSpacing: -0.8 },
  sourcesNote: { fontFamily: "Newsreader", fontStyle: "italic", fontSize: 15, color: COLOR.muted },
  sourceRow: { width: "50%", flexDirection: "row", paddingRight: 28, marginBottom: 14 },
  sourceTitle: { fontSize: 10, lineHeight: 1.35, color: COLOR.body, marginTop: 2, maxLines: 2, textOverflow: "ellipsis" },
  sourceUrl: { fontSize: 8.5, color: COLOR.muted, textDecoration: "underline", marginTop: 3, maxLines: 1 },
});
