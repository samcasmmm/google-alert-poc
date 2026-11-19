// Page geometry and colours for the PDF briefing. Points (1pt = 1/72in).

/** 13.333 × 7.5in, the same 16:9 shape as the slides and the PowerPoint. */
export const PAGE = { width: 960, height: 540 } as const;
export const PAGE_SIZE: [number, number] = [PAGE.width, PAGE.height];

export const MARGIN = 48;
/** Width of the vermilion "why it matters" panel on story pages. */
export const PANEL_WIDTH = 344;

export const COLOR = {
  paper: "#FFFFFF",
  ink: "#111111",
  body: "#45403C",
  muted: "#6B6560",
  line: "#E7E3DF",
  accent: "#C2361C",
  onAccent: "#FFFFFF",
  onAccentSoft: "#F6D9D2",
} as const;
