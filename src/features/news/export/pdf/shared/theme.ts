// Page geometry and colours shared by every PDF format. Points (1pt = 1/72in).

/** Slides: 13.333 × 7.5in, the same 16:9 shape as the on-screen deck and the PowerPoint. */
export const PAGE = { width: 960, height: 540 } as const;
export const PAGE_SIZE: [number, number] = [PAGE.width, PAGE.height];
export const MARGIN = 48;
/** Width of the vermilion "why it matters" panel on slide story pages. */
export const PANEL_WIDTH = 344;

/** A4 portrait, for the reading designs (Memo, Digest). */
export const A4 = { width: 595.28, height: 841.89 } as const;

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

