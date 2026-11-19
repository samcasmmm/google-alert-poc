import { Document, Font, Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { formatTimestamp } from "@/lib/date";
import { cleanHeadline } from "../headline";
import type { DailyNews, NewsItem } from "../schema";

// The PDF briefing: a real 16:9 document generated in the browser (no print dialog),
// so it looks the same on every machine and paper setting.
//
// Design: quiet white pages set in Newsreader + Geist, with one bold element, a
// full-height vermilion panel carrying "why it matters". That line is the
// company-specific part of the briefing, so it gets the colour.

const W = 960;
const H = 540;
const M = 48;
const PANEL_W = 344;

const C = {
  paper: "#FFFFFF",
  ink: "#111111",
  body: "#45403C",
  muted: "#6B6560",
  line: "#E7E3DF",
  accent: "#C2361C",
  onAccent: "#FFFFFF",
  onAccentSoft: "#F6D9D2",
};

let fontsReady = false;
function registerFonts() {
  if (fontsReady) return;
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
  // Headlines and quotes read better unbroken; never hyphenate.
  Font.registerHyphenationCallback((word) => [word]);
  fontsReady = true;
}

const s = StyleSheet.create({
  page: { width: W, height: H, backgroundColor: C.paper, color: C.ink, fontFamily: "Geist", fontSize: 11 },
  footer: {
    position: "absolute",
    left: M,
    bottom: 26,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8.5,
    color: C.muted,
  },
  // Cover
  coverTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  masthead: { fontFamily: "Newsreader", fontWeight: 500, fontSize: 17 },
  preparedFor: { fontSize: 10, color: C.muted },
  weekday: { fontFamily: "Newsreader", fontStyle: "italic", fontSize: 30, color: C.muted },
  bigDate: { fontFamily: "Newsreader", fontWeight: 500, fontSize: 92, lineHeight: 1, letterSpacing: -2.5 },
  contents: { flexDirection: "row", flexWrap: "wrap", borderTopWidth: 1, borderTopColor: C.ink, paddingTop: 14 },
  entry: { width: "50%", flexDirection: "row", paddingRight: 28, marginBottom: 12 },
  entryNum: { width: 20, fontFamily: "Newsreader", fontWeight: 500, fontSize: 13, color: C.accent },
  entryTitle: { fontWeight: 500, fontSize: 11, lineHeight: 1.35, maxLines: 2, textOverflow: "ellipsis" },
  entrySource: { fontSize: 9, color: C.muted, marginTop: 2 },
  // Story
  storyMain: { position: "absolute", top: 0, left: 0, bottom: 0, width: W - PANEL_W },
  storyMainWide: { position: "absolute", top: 0, left: 0, bottom: 0, right: 0 },
  storyBody: { flexGrow: 1, justifyContent: "center", paddingLeft: M, paddingRight: 44, paddingBottom: 30 },
  rank: { fontWeight: 500, fontSize: 10, color: C.accent, position: "absolute", top: M, left: M },
  summary: { fontSize: 13.5, lineHeight: 1.55, color: C.body, marginTop: 18, maxLines: 6, textOverflow: "ellipsis" },
  meta: { position: "absolute", left: M, bottom: 58, right: 44 },
  source: { fontWeight: 600, fontSize: 11 },
  time: { fontSize: 9.5, color: C.muted, marginTop: 2 },
  articleLink: {
    fontWeight: 500,
    fontSize: 10,
    color: C.accent,
    textDecoration: "underline",
    marginTop: 8,
  },
  panel: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: PANEL_W,
    backgroundColor: C.accent,
    color: C.onAccent,
    paddingHorizontal: 40,
    justifyContent: "center",
  },
  panelLabel: { fontWeight: 500, fontSize: 10.5, color: C.onAccentSoft },
  panelPage: { position: "absolute", right: 40, bottom: 26, fontSize: 8.5, color: C.onAccentSoft },
  // Sources
  sourcesTitle: { fontFamily: "Newsreader", fontWeight: 500, fontSize: 40, letterSpacing: -0.8 },
  sourcesNote: { fontFamily: "Newsreader", fontStyle: "italic", fontSize: 15, color: C.muted, marginTop: 6 },
  sourceRow: { width: "50%", flexDirection: "row", paddingRight: 28, marginBottom: 14 },
  sourceTitle: { fontSize: 10, lineHeight: 1.35, color: C.body, marginTop: 2, maxLines: 2, textOverflow: "ellipsis" },
  sourceUrl: { fontSize: 8.5, color: C.muted, textDecoration: "underline", marginTop: 3, maxLines: 1 },
});

function headlineSize(title: string): number {
  if (title.length <= 55) return 42;
  if (title.length <= 90) return 35;
  return 29;
}

function quoteSize(text: string): number {
  if (text.length <= 110) return 25;
  if (text.length <= 170) return 22;
  return 19;
}

function longDate(key: string, options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat("en-US", { ...options, timeZone: "UTC" }).format(new Date(`${key}T12:00:00Z`));
}

function shortUrl(url: string): string {
  try {
    const u = new URL(url);
    const path = u.pathname === "/" ? "" : u.pathname;
    return `${u.hostname.replace(/^www\./, "")}${path}`;
  } catch {
    return url;
  }
}

function Footer({ company, page, pages }: { company: string; page?: number; pages?: number }) {
  return (
    <View style={[s.footer, { right: M }]}>
      <Text>{company ? `Standup News for ${company}` : "Standup News"}</Text>
      {page && pages ? <Text>{`Page ${page} of ${pages}`}</Text> : null}
    </View>
  );
}

function Cover({ news, company }: { news: DailyNews; company: string }) {
  return (
    <Page size={[W, H]} style={[s.page, { padding: M, paddingBottom: 40 }]}>
      <View style={s.coverTop}>
        <Text style={s.masthead}>Standup News</Text>
        {company ? <Text style={s.preparedFor}>{`Prepared for ${company}`}</Text> : null}
      </View>

      <View style={{ flexGrow: 1, justifyContent: "center" }}>
        <Text style={s.weekday}>{longDate(news.date, { weekday: "long" })}</Text>
        <Text style={s.bigDate}>{longDate(news.date, { month: "long", day: "numeric" })}</Text>
        <Text style={[s.preparedFor, { marginTop: 10 }]}>
          {`${longDate(news.date, { year: "numeric" })}, ${news.items.length} ${news.items.length === 1 ? "story" : "stories"}${news.mode === "fallback" ? " from feed snippets" : ""}`}
        </Text>
      </View>

      <View style={s.contents}>
        {news.items.map((item, i) => (
          <Link key={item.url} src={`#story-${i + 1}`} style={{ ...s.entry, textDecoration: "none", color: C.ink }}>
            <Text style={s.entryNum}>{i + 1}</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.entryTitle}>{cleanHeadline(item.title)}</Text>
              <Text style={s.entrySource}>{item.source}</Text>
            </View>
          </Link>
        ))}
      </View>
    </Page>
  );
}

function Story({
  item,
  position,
  total,
  page,
  pages,
  company,
}: {
  item: NewsItem;
  position: number;
  total: number;
  page: number;
  pages: number;
  company: string;
}) {
  const title = cleanHeadline(item.title);
  const hasWhy = !!item.whyItMatters.trim();
  const time = formatTimestamp(item.publishedAt);

  return (
    <Page size={[W, H]} style={s.page} id={`story-${position}`}>
      <View style={hasWhy ? s.storyMain : s.storyMainWide}>
        <Text style={s.rank}>{`Story ${position} of ${total}`}</Text>
        <View style={s.storyBody}>
          <Text
            style={{
              fontFamily: "Newsreader",
              fontWeight: 500,
              fontSize: headlineSize(title),
              lineHeight: 1.1,
              letterSpacing: -0.6,
              maxLines: 4,
              textOverflow: "ellipsis",
            }}
          >
            {title}
          </Text>
          {item.summary ? <Text style={s.summary}>{item.summary}</Text> : null}
        </View>
        <View style={s.meta}>
          <Text style={s.source}>{item.source || shortUrl(item.url)}</Text>
          {time ? <Text style={s.time}>{time}</Text> : null}
          <Link src={item.url} style={s.articleLink}>
            Read the full article
          </Link>
        </View>
        <View style={[s.footer, { right: 44 }]}>
          <Text>{company ? `Standup News for ${company}` : "Standup News"}</Text>
          {hasWhy ? null : <Text>{`Page ${page} of ${pages}`}</Text>}
        </View>
      </View>

      {hasWhy ? (
        <View style={s.panel}>
          <Text style={s.panelLabel}>{company ? `Why it matters to ${company}` : "Why it matters"}</Text>
          <Text
            style={{
              fontFamily: "Newsreader",
              fontStyle: "italic",
              fontSize: quoteSize(item.whyItMatters),
              lineHeight: 1.28,
              marginTop: 14,
              maxLines: 9,
              textOverflow: "ellipsis",
            }}
          >
            {item.whyItMatters}
          </Text>
          <Text style={s.panelPage}>{`Page ${page} of ${pages}`}</Text>
        </View>
      ) : null}
    </Page>
  );
}

function Sources({ news, company, page }: { news: DailyNews; company: string; page: number }) {
  return (
    <Page size={[W, H]} style={[s.page, { padding: M, paddingBottom: 56 }]}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 26 }}>
        <Text style={s.sourcesTitle}>Sources</Text>
        <Text style={s.sourcesNote}>That’s the briefing. Over to standup.</Text>
      </View>
      <View style={[s.contents, { paddingTop: 18 }]}>
        {news.items.map((item, i) => (
          <View key={item.url} style={s.sourceRow}>
            <Text style={s.entryNum}>{i + 1}</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.source}>{item.source}</Text>
              <Text style={s.sourceTitle}>{cleanHeadline(item.title)}</Text>
              <Link src={item.url} style={s.sourceUrl}>
                {shortUrl(item.url)}
              </Link>
            </View>
          </View>
        ))}
      </View>
      <Footer company={company} page={page} pages={page} />
    </Page>
  );
}

export function BriefingDocument({ news, company }: { news: DailyNews; company: string }) {
  registerFonts();
  const who = company.trim();
  const total = news.items.length;
  const pages = total + 2;
  return (
    <Document
      title={`Standup News, ${longDate(news.date, { month: "long", day: "numeric", year: "numeric" })}`}
      author={who || "Standup News"}
      subject="Daily news briefing"
      creator="Standup News"
      producer="Standup News"
    >
      <Cover news={news} company={who} />
      {news.items.map((item, i) => (
        <Story
          key={item.url}
          item={item}
          position={i + 1}
          total={total}
          page={i + 2}
          pages={pages}
          company={who}
        />
      ))}
      <Sources news={news} company={who} page={pages} />
    </Document>
  );
}
