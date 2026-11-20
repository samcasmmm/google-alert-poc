/** The PDF designs the briefing can be exported as. */
export type PdfFormat = "slides";

export interface PdfFormatOption {
  id: PdfFormat;
  label: string;
  /** One line in the export menu: what it looks like and when to use it */
  hint: string;
}

export const PDF_FORMATS: PdfFormatOption[] = [
  { id: "slides", label: "Slides", hint: "16:9, coloured by the day of the week" },
];
