import { Font } from "@react-pdf/renderer";

// Static TTFs in /public/fonts (OFL), the same families as the app.
// react-pdf can't use the variable / woff2 files next/font serves.

let registered = false;

export function registerPdfFonts(): void {
  if (registered) return;
  const base = `${window.location.origin}/fonts`;
  Font.register({
    family: "Newsreader",
    fonts: [
      { src: `${base}/Newsreader-Regular.ttf`, fontWeight: 400 },
      { src: `${base}/Newsreader-Medium.ttf`, fontWeight: 500 },
      { src: `${base}/Newsreader-Italic.ttf`, fontWeight: 400, fontStyle: "italic" },
    ],
  });
  Font.register({
    family: "Geist",
    fonts: [
      { src: `${base}/Geist-Regular.ttf`, fontWeight: 400 },
      { src: `${base}/Geist-Medium.ttf`, fontWeight: 500 },
      { src: `${base}/Geist-SemiBold.ttf`, fontWeight: 600 },
    ],
  });
  // Headlines and quotes read better unbroken: never hyphenate.
  Font.registerHyphenationCallback((word) => [word]);
  registered = true;
}
