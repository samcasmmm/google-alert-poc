/**
 * Google Alerts titles end with the publisher ("… exports - Business Standard").
 * The source is shown separately, so drop that suffix. Keeps the original when
 * stripping would leave too little to be a headline.
 */
export function cleanHeadline(title: string): string {
  const stripped = title.replace(/\s+[-|–—]\s+[^-|–—]{2,40}$/, "").trim();
  return stripped.length >= 20 ? stripped : title;
}
