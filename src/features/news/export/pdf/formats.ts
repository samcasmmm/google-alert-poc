/** The PDF designs the briefing can be exported as: same content, different look and use. */
export type PdfFormat = "slides" | "poster" | "memo" | "digest";

export interface PdfFormatOption {
  id: PdfFormat;
  label: string;
  /** One line in the export menu: what it looks like and when to use it */
  hint: string;
}

export const PDF_FORMATS: PdfFormatOption[] = [
  { id: "slides", label: "Slides", hint: "16:9, colour panel for why it matters" },
  { id: "poster", label: "Poster", hint: "16:9, oversized type, black and white" },
  { id: "memo", label: "Memo", hint: "A4 magazine-style reading copy" },
  { id: "digest", label: "One-page digest", hint: "Every story on a single A4 page" },
];
