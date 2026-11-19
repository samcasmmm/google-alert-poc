import type PptxGenJS from "pptxgenjs";
import { formatDayLong, formatTimestamp } from "@/lib/date";
import type { DailyNews, NewsItem } from "../../schema";
import { exportFileName } from "../file-name";

// Editable PowerPoint version of the briefing, built in the browser. Mirrors the
// "Editorial" slide layout with fonts every PowerPoint / Keynote / Slides has.

const C = {
  ink: "111111",
  body: "4A4542",
  muted: "6B6560",
  line: "E7E3DF",
  accent: "C2361C",
  accentSoft: "FBEFEC",
  paper: "FFFFFF",
};
const SERIF = "Georgia";
const SANS = "Arial";
const MONO = "Consolas";

// LAYOUT_WIDE = 13.333 × 7.5 in (16:9)
const W = 13.333;
const H = 7.5;
const X = 0.8;
const CONTENT_W = W - X * 2;

const pad = (n: number) => String(n).padStart(2, "0");

/** Long headlines step down so they stay within ~3 lines. */
function titleSize(title: string): number {
  if (title.length <= 60) return 40;
  if (title.length <= 100) return 34;
  return 28;
}

/**
 * Rough height of wrapped text, so blocks can flow under each other instead of
 * sitting at fixed positions. `charWidth` is the average glyph width in ems.
 */
function textHeight(text: string, fontSize: number, width: number, lineHeight: number, charWidth = 0.5): number {
  const charsPerLine = Math.max(1, Math.floor(width / ((fontSize * charWidth) / 72)));
  const lines = Math.max(1, Math.ceil(text.length / charsPerLine));
  return (lines * fontSize * lineHeight) / 72;
}

function footer(slide: PptxGenJS.Slide, date: string, page: number, pages: number) {
  slide.addShape("line", { x: X, y: H - 0.6, w: CONTENT_W, h: 0, line: { color: C.line, width: 0.75 } });
  slide.addText(`STANDUP NEWS · ${formatDayLong(date).toUpperCase()}`, {
    x: X, y: H - 0.55, w: CONTENT_W / 2, h: 0.35,
    fontFace: MONO, fontSize: 9, color: C.muted, charSpacing: 1.5, margin: 0,
  });
  slide.addText(`${pad(page)} / ${pad(pages)}`, {
    x: X + CONTENT_W / 2, y: H - 0.55, w: CONTENT_W / 2, h: 0.35,
    fontFace: MONO, fontSize: 9, color: C.muted, align: "right", margin: 0,
  });
}

function titleSlide(pptx: PptxGenJS, news: DailyNews, company: string) {
  const slide = pptx.addSlide();
  const total = news.items.length;

  slide.addText(company ? `DAILY BRIEFING · ${company.toUpperCase()}` : "DAILY BRIEFING", {
    x: X, y: 1.55, w: CONTENT_W, h: 0.4,
    fontFace: MONO, fontSize: 12, color: C.accent, charSpacing: 3, align: "center", margin: 0,
  });

  // Double rule above and below the masthead, like the on-screen Editorial layout.
  for (const y of [2.15, 2.22, 4.0, 4.07]) {
    slide.addShape("line", { x: X, y, w: CONTENT_W, h: 0, line: { color: C.ink, width: 1.25 } });
  }
  slide.addText("Standup News", {
    x: X, y: 2.3, w: CONTENT_W, h: 1.62,
    fontFace: SERIF, fontSize: 80, bold: true, color: C.ink, align: "center", valign: "middle", margin: 0,
  });

  slide.addText(formatDayLong(news.date), {
    x: X, y: 4.2, w: CONTENT_W / 2, h: 0.45,
    fontFace: MONO, fontSize: 13, color: C.ink, charSpacing: 1.5, margin: 0,
  });
  const meta = [`${total} ${total === 1 ? "story" : "stories"}`];
  if (news.mode === "fallback") meta.push("feed snippets only");
  slide.addText(meta.join(" · "), {
    x: X + CONTENT_W / 2, y: 4.2, w: CONTENT_W / 2, h: 0.45,
    fontFace: SANS, fontSize: 13, color: C.muted, align: "right", margin: 0,
  });
}

function storySlide(pptx: PptxGenJS, news: DailyNews, item: NewsItem, position: number, page: number, pages: number) {
  const slide = pptx.addSlide();
  const total = news.items.length;

  // Kicker row
  slide.addText(
    [
      { text: `NO. ${pad(position)}`, options: { color: C.accent } },
      { text: ` OF ${pad(total)}`, options: { color: C.muted } },
    ],
    { x: X, y: 0.5, w: CONTENT_W / 2, h: 0.35, fontFace: MONO, fontSize: 11, charSpacing: 2, margin: 0 },
  );
  const meta = [item.source, formatTimestamp(item.publishedAt)].filter(Boolean).join(" · ");
  slide.addText(meta.toUpperCase(), {
    x: X + CONTENT_W / 2, y: 0.5, w: CONTENT_W / 2, h: 0.35,
    fontFace: MONO, fontSize: 11, color: C.muted, charSpacing: 1.5, align: "right", margin: 0,
  });
  slide.addShape("line", { x: X, y: 0.95, w: CONTENT_W, h: 0, line: { color: C.ink, width: 1 } });

  // Headline, then summary and callout flowing underneath it.
  const size = titleSize(item.title);
  const titleH = Math.min(2.4, textHeight(item.title, size, CONTENT_W, 1.15, 0.48) + 0.1);
  slide.addText(item.title, {
    x: X, y: 1.25, w: CONTENT_W, h: titleH,
    fontFace: SERIF, fontSize: size, color: C.ink, valign: "top",
    lineSpacingMultiple: 0.95, margin: 0, fit: "shrink",
  });

  let y = 1.25 + titleH + 0.35;
  if (item.summary) {
    const w = CONTENT_W * 0.85;
    const h = Math.min(1.6, textHeight(item.summary, 18, w, 1.35) + 0.05);
    slide.addText(item.summary, {
      x: X, y, w, h,
      fontFace: SANS, fontSize: 18, color: C.body, valign: "top", lineSpacingMultiple: 1.2, margin: 0, fit: "shrink",
    });
    y += h + 0.4;
  }

  if (item.whyItMatters) {
    const w = CONTENT_W * 0.8;
    const textH = Math.min(1.2, textHeight(item.whyItMatters, 19, w, 1.35) + 0.05);
    const barH = 0.35 + textH;
    slide.addShape("rect", { x: X, y, w: 0.07, h: barH, fill: { color: C.accent }, line: { color: C.accent, width: 0 } });
    slide.addText("WHY IT MATTERS", {
      x: X + 0.3, y, w: 6, h: 0.3,
      fontFace: MONO, fontSize: 10, color: C.accent, charSpacing: 2.5, margin: 0,
    });
    slide.addText(item.whyItMatters, {
      x: X + 0.3, y: y + 0.35, w, h: textH,
      fontFace: SERIF, fontSize: 19, italic: true, color: C.ink, valign: "top", lineSpacingMultiple: 1.1,
      margin: 0, fit: "shrink",
    });
  }

  slide.addText(`Read at ${item.source || "source"} ↗`, {
    x: X, y: H - 1.1, w: 6, h: 0.35,
    fontFace: SANS, fontSize: 12, color: C.muted, underline: { style: "sng", color: C.line },
    hyperlink: { url: item.url, tooltip: item.url }, margin: 0,
  });

  footer(slide, news.date, page, pages);
  slide.addNotes(
    [item.title, item.summary, item.whyItMatters && `Why it matters: ${item.whyItMatters}`, item.url]
      .filter(Boolean)
      .join("\n\n"),
  );
}

function endSlide(pptx: PptxGenJS, news: DailyNews, page: number, pages: number) {
  const slide = pptx.addSlide();
  slide.addText("— 30 —", {
    x: X, y: 2.35, w: CONTENT_W, h: 0.6,
    fontFace: SERIF, fontSize: 28, color: C.muted, align: "center", margin: 0,
  });
  slide.addText("Over to standup.", {
    x: X, y: 3.05, w: CONTENT_W, h: 1.2,
    fontFace: SERIF, fontSize: 60, color: C.ink, align: "center", valign: "middle", margin: 0,
  });
  footer(slide, news.date, page, pages);
}

/** Builds the deck and triggers a download. */
export async function exportPptx(news: DailyNews, company: string): Promise<void> {
  const { default: PptxGen } = await import("pptxgenjs");
  const pptx = new PptxGen();
  pptx.layout = "LAYOUT_WIDE";
  pptx.title = `Standup News · ${formatDayLong(news.date)}`;
  pptx.subject = "Daily news briefing";
  if (company) pptx.company = company;
  pptx.theme = { headFontFace: SERIF, bodyFontFace: SANS };

  const pages = news.items.length + 2;
  titleSlide(pptx, news, company.trim());
  news.items.forEach((item, i) => storySlide(pptx, news, item, i + 1, i + 2, pages));
  endSlide(pptx, news, pages, pages);

  await pptx.writeFile({ fileName: exportFileName(news, "pptx") });
}
