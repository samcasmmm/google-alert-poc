import { StyleSheet } from "@react-pdf/renderer";
import { MARGIN, PAGE, PANEL_WIDTH, type Palette } from "../shared/theme";

// Design: quiet white pages in Newsreader + Geist, with one bold element, the
// full-height "why it matters" panel. That line is the company-specific part of the
// briefing, so it is the one place colour is spent. The colour follows the day of the
// week (see dayPalette), so Monday's briefing doesn't look like Tuesday's.

export function createSlideStyles(p: Palette) {
  return StyleSheet.create({
    page: {
      width: PAGE.width,
      height: PAGE.height,
      backgroundColor: p.paper,
      color: p.ink,
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
      color: p.muted,
    },

    // Cover
    coverTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
    masthead: { fontFamily: "Newsreader", fontWeight: 500, fontSize: 17 },
    small: { fontSize: 10, color: p.muted },
    weekday: { fontFamily: "Newsreader", fontStyle: "italic", fontSize: 30, color: p.accent },
    bigDate: { fontFamily: "Newsreader", fontWeight: 500, fontSize: 92, lineHeight: 1, letterSpacing: -2.5 },
    list: { flexDirection: "row", flexWrap: "wrap", borderTopWidth: 1, borderTopColor: p.ink, paddingTop: 14 },
    entry: { width: "50%", flexDirection: "row", paddingRight: 28, marginBottom: 12 },
    entryNum: { width: 20, fontFamily: "Newsreader", fontWeight: 500, fontSize: 13, color: p.accent },
    entryTitle: { fontWeight: 500, fontSize: 11, lineHeight: 1.35, maxLines: 2, textOverflow: "ellipsis" },
    entrySource: { fontSize: 9, color: p.muted, marginTop: 2 },

    // Story
    storyColumn: { position: "absolute", top: 0, left: 0, bottom: 0, width: PAGE.width - PANEL_WIDTH },
    storyColumnWide: { position: "absolute", top: 0, left: 0, bottom: 0, right: 0 },
    storyBody: { flexGrow: 1, justifyContent: "center", paddingLeft: MARGIN, paddingRight: 44, paddingBottom: 30 },
    rank: { position: "absolute", top: MARGIN, left: MARGIN, fontWeight: 500, fontSize: 10, color: p.accent },
    headline: { fontFamily: "Newsreader", fontWeight: 500, lineHeight: 1.1, letterSpacing: -0.6, maxLines: 4, textOverflow: "ellipsis" },
    summary: { fontSize: 13.5, lineHeight: 1.55, color: p.body, marginTop: 18, maxLines: 6, textOverflow: "ellipsis" },
    meta: { position: "absolute", left: MARGIN, right: 44, bottom: 58 },
    source: { fontWeight: 600, fontSize: 11 },
    time: { fontSize: 9.5, color: p.muted, marginTop: 2 },
    articleLink: { fontWeight: 500, fontSize: 10, color: p.accent, textDecoration: "underline", marginTop: 8 },
    panel: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      width: PANEL_WIDTH,
      paddingHorizontal: 40,
      justifyContent: "center",
      backgroundColor: p.accent,
      color: p.onAccent,
    },
    panelLabel: { fontWeight: 500, fontSize: 10.5, color: p.onAccentSoft },
    quote: { fontFamily: "Newsreader", fontStyle: "italic", lineHeight: 1.28, marginTop: 14, maxLines: 9, textOverflow: "ellipsis" },
    panelPage: { position: "absolute", right: 40, bottom: 26, fontSize: 8.5, color: p.onAccentSoft },

    // Sources
    sourcesHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 26 },
    sourcesTitle: { fontFamily: "Newsreader", fontWeight: 500, fontSize: 40, letterSpacing: -0.8 },
    sourcesNote: { fontFamily: "Newsreader", fontStyle: "italic", fontSize: 15, color: p.muted },
    sourceRow: { width: "50%", flexDirection: "row", paddingRight: 28, marginBottom: 14 },
    sourceTitle: { fontSize: 10, lineHeight: 1.35, color: p.body, marginTop: 2, maxLines: 2, textOverflow: "ellipsis" },
    sourceUrl: { fontSize: 8.5, color: p.muted, textDecoration: "underline", marginTop: 3, maxLines: 1 },
  });
}

export type SlideStyles = ReturnType<typeof createSlideStyles>;
