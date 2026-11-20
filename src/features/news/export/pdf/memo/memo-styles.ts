import { StyleSheet } from "@react-pdf/renderer";
import { A4, type Palette } from "../shared/theme";

// Memo: an A4 reading copy laid out like a magazine page. A narrow side column carries
// rank, source and time; the reading column keeps body lines near 70 characters
// (ui-ux-pro-max: 65–75 chars, 1.5–1.75 line height).

export const MEMO = {
  marginX: 54,
  marginTop: 54,
  marginBottom: 72,
  railWidth: 92,
  gutter: 20,
} as const;

export function createMemoStyles(p: Palette) {
  return StyleSheet.create({
    page: {
      width: A4.width,
      height: A4.height,
      paddingTop: MEMO.marginTop,
      paddingBottom: MEMO.marginBottom,
      paddingHorizontal: MEMO.marginX,
      backgroundColor: p.paper,
      color: p.ink,
      fontFamily: "Geist",
      fontSize: 9.5,
    },

    // Masthead (page 1)
    mastRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
    masthead: { fontFamily: "Newsreader", fontWeight: 500, fontSize: 27, letterSpacing: -0.5 },
    mastMeta: { alignItems: "flex-end" },
    mastDate: { fontWeight: 500, fontSize: 9.5 },
    mastFor: { fontSize: 8.5, color: p.muted, marginTop: 2 },
    mastRule: { borderBottomWidth: 1.5, borderBottomColor: p.accent, marginTop: 12 },
    intro: { fontFamily: "Newsreader", fontStyle: "italic", fontSize: 12, color: p.muted, marginTop: 12, marginBottom: 6 },

    // Story
    story: { flexDirection: "row", paddingVertical: 16, borderTopWidth: 0.75, borderTopColor: p.line },
    storyFirst: { borderTopWidth: 0 },
    rail: { width: MEMO.railWidth, paddingRight: 8 },
    rank: { fontFamily: "Newsreader", fontWeight: 500, fontSize: 22, lineHeight: 1, color: p.accent },
    railSource: { fontWeight: 600, fontSize: 8.5, marginTop: 8, lineHeight: 1.3 },
    railTime: { fontSize: 8, color: p.muted, marginTop: 2 },
    main: { flex: 1, marginLeft: MEMO.gutter },
    headline: { fontFamily: "Newsreader", fontWeight: 500, fontSize: 16, lineHeight: 1.22, color: p.ink, textDecoration: "none" },
    summary: { fontSize: 9.5, lineHeight: 1.6, color: p.body, marginTop: 6 },
    why: {
      marginTop: 10,
      paddingVertical: 6,
      paddingLeft: 10,
      paddingRight: 8,
      borderLeftWidth: 2,
      borderLeftColor: p.accent,
      backgroundColor: p.tint,
    },
    whyLabel: { fontWeight: 500, fontSize: 8, color: p.accent },
    whyText: { fontFamily: "Newsreader", fontStyle: "italic", fontSize: 11, lineHeight: 1.4, marginTop: 2 },
    link: { fontWeight: 500, fontSize: 8.5, color: p.accent, textDecoration: "underline", marginTop: 9 },

    // Page furniture
    runningHead: {
      position: "absolute",
      top: 26,
      left: MEMO.marginX,
      right: MEMO.marginX,
      fontSize: 8,
      color: p.muted,
    },
    footer: {
      position: "absolute",
      left: MEMO.marginX,
      right: MEMO.marginX,
      bottom: 32,
      flexDirection: "row",
      justifyContent: "space-between",
      borderTopWidth: 0.5,
      borderTopColor: p.line,
      paddingTop: 6,
      fontSize: 8,
      color: p.muted,
    },
  });
}

export type MemoStyles = ReturnType<typeof createMemoStyles>;
