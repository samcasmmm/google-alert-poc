// Page geometry and colours shared by every PDF format. Points (1pt = 1/72in).

/** Slides: 13.333 × 7.5in, the same 16:9 shape as the on-screen deck and the PowerPoint. */
export const PAGE = { width: 960, height: 540 } as const;
export const PAGE_SIZE: [number, number] = [PAGE.width, PAGE.height];
export const MARGIN = 48;
/** Width of the coloured "why it matters" panel on slide story pages. */
export const PANEL_WIDTH = 344;

export interface Palette {
  paper: string;
  ink: string;
  body: string;
  muted: string;
  line: string;
  accent: string;
  /** Tinted background behind highlighted notes */
  tint: string;
  onAccent: string;
  onAccentSoft: string;
}

/** The app's colours: white paper, near-black ink, one vermilion accent. */
export const COLOR: Palette = {
  paper: "#FFFFFF",
  ink: "#111111",
  body: "#45403C",
  muted: "#6B6560",
  line: "#E7E3DF",
  accent: "#C2361C",
  tint: "#FBEFEC",
  onAccent: "#FFFFFF",
  onAccentSoft: "#F6D9D2",
};


/**
 * Slides change colour with the day of the week, so each day's briefing is easy to tell
 * apart at a glance. Only the accent changes (panel, numbers, links); white text on every
 * accent is 4.5:1 or better. Wednesday keeps the app's own vermilion.
 */
const DAY_ACCENTS: { accent: string; soft: string }[] = [
  { accent: "#36424F", soft: "#DCE1E7" }, // Sunday, slate
  { accent: "#1F4E8C", soft: "#D6E2F3" }, // Monday, blue
  { accent: "#11696A", soft: "#CDE8E6" }, // Tuesday, teal
  { accent: COLOR.accent, soft: COLOR.onAccentSoft }, // Wednesday, vermilion
  { accent: "#6A2D6C", soft: "#EBD7EC" }, // Thursday, plum
  { accent: "#2B6A3E", soft: "#D3E9D9" }, // Friday, green
  { accent: "#9A5208", soft: "#F5E0C6" }, // Saturday, amber
];

/** The palette for a briefing's date ("YYYY-MM-DD"); noon UTC keeps the weekday stable. */
export function dayPalette(dateKey: string): Palette {
  const day = new Date(`${dateKey}T12:00:00Z`).getUTCDay();
  const { accent, soft } = DAY_ACCENTS[Number.isNaN(day) ? 3 : day];
  return { ...COLOR, accent, onAccentSoft: soft };
}
