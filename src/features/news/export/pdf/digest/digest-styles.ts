import { StyleSheet } from "@react-pdf/renderer";
import { A4, COLOR } from "../shared/theme";

// Digest: every story on one A4 page, Swiss-style (ui-ux-pro-max's pick for news/media:
// minimal, grid-led, high contrast). Geist throughout; the date is the one serif element.
// Line clamps keep 7 stories inside a single page.

export const DIGEST = { margin: 44, numberWidth: 26, sourceWidth: 104 } as const;

export const digestStyles = StyleSheet.create({
  page: {
    width: A4.width,
    height: A4.height,
    padding: DIGEST.margin,
    paddingBottom: 60,
    backgroundColor: COLOR.paper,
    color: COLOR.ink,
    fontFamily: "Geist",
    fontSize: 9.5,
  },
  top: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  brand: { fontWeight: 600, fontSize: 10 },
  for: { fontSize: 9, color: COLOR.muted },
  title: { fontFamily: "Newsreader", fontWeight: 500, fontSize: 34, letterSpacing: -0.8, marginTop: 22 },
  subtitle: { fontSize: 9.5, color: COLOR.muted, marginTop: 4, marginBottom: 18 },

  row: { flexDirection: "row", paddingVertical: 11, borderTopWidth: 0.75, borderTopColor: COLOR.line },
  rowFirst: { borderTopWidth: 1.25, borderTopColor: COLOR.ink },
  number: { width: DIGEST.numberWidth, fontWeight: 600, fontSize: 11, color: COLOR.accent },
  main: { flex: 1, paddingRight: 14 },
  headline: {
    fontWeight: 600,
    fontSize: 11.5,
    lineHeight: 1.3,
    color: COLOR.ink,
    textDecoration: "none",
    maxLines: 2,
    textOverflow: "ellipsis",
  },
  note: { fontSize: 9.5, lineHeight: 1.45, color: COLOR.body, marginTop: 3, maxLines: 2, textOverflow: "ellipsis" },
  side: { width: DIGEST.sourceWidth, alignItems: "flex-end" },
  source: { fontWeight: 500, fontSize: 8.5, textAlign: "right" },
  time: { fontSize: 8, color: COLOR.muted, marginTop: 2, textAlign: "right" },

  footer: {
    position: "absolute",
    left: DIGEST.margin,
    right: DIGEST.margin,
    bottom: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: COLOR.muted,
  },
});
