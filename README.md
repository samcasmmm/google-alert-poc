# Standup News

Shows 6–7 daily product and industry news stories as full-screen slides for a 5-minute standup, each with a "why it matters" line written for your company.

- **News:** your RSS feeds (Google Alerts plus industry blogs). Groq is used only for text: it picks the top stories and writes a 2-line summary and a "why it matters" line for each. All slide layouts and styling are plain code (light theme, Tailwind).
- **Storage:** everything (settings, company brief, past days) is kept in **your browser's IndexedDB**. There is no database, no login, and the app needs no environment variables.

Stack: Next.js 16 (App Router, Cache Components) · TypeScript · Tailwind v4 · rss-parser · groq-sdk · Dexie.js

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:3000/settings and fill in:

| Setting | Notes |
|---|---|
| **Company & product brief** | Company name, what you build, customers & market, competitors, current priorities. All optional, but this is what makes "why it matters" specific to you instead of generic. |
| Presentation layout | **Editorial** (serif, newspaper front page), **Poster** (oversized type, giant story number) or **Briefing** (two-column grid). Every layout shows the same content. |
| **RSS feeds** | One URL per line (see [Google Alerts RSS](#google-alerts-rss) below). Required. |
| **Groq API key** | Free at https://console.groq.com/keys. Optional: without a key you get the latest stories (same per-feed limits) with feed snippets instead of AI summaries. |
| Stories per day | 5–7, default 7. With 2+ feeds, each feed contributes only its top 2–3 most relevant stories (3 each for 2–3 feeds, 2 each for 4+), so no single feed dominates. |
| Groq model | Default `openai/gpt-oss-120b`. Any model your key can use. |
| Time zone | Decides when "today" starts. Empty = this browser's time zone. |

Click **Save settings**. The values are stored in IndexedDB, so you only enter them once per browser.

## Using it

- **`/standup`** (**Today**): a title slide (date and who the briefing is prepared for), one slide per story, then an end slide.
  - `→` / `Space` / clicking the right side goes forward. `←` / clicking the left side goes back.
  - `F` toggles fullscreen.
  - **Fetch again** on the title slide fetches today's news again.
- **`/history`**: every saved day, grouped by month. Search all saved stories (`/` focuses search); click a headline to open that day's slides at that story, download any day as PDF, or delete a day (with Undo).
- **Export (slide deck header, and "Download" on each History day):** four PDF designs, all built in the browser (no print dialog, so paper size and printer settings can't change them), plus PowerPoint:
  - **Slides** (16:9): cover with clickable contents, one page per story with "why it matters" in a vermilion panel, sources page.
  - **Poster** (16:9): every headline stacked large on the cover, then one oversized black headline per page with what happened and why it matters side by side.
  - **Memo** (A4): magazine-style reading copy; rank, source and time in a side column, serif headlines, a ruled "why it matters" note; stories never split across pages.
  - **One-page digest** (A4): every story as a ranked row on a single page, headlines linked to the articles.
  - **PowerPoint**: editable `.pptx` with the summary and link in the speaker notes.
- **`/settings`**: company brief, news sources (named feeds; paste several URLs at once), AI summaries (Groq key and model), briefing options (stories per day, time zone, slide layout) and Backup (download / restore all data as JSON). A save bar appears when there are unsaved changes; `Ctrl/Cmd+S` saves.

### How news is fetched
1. On `/standup` (**Today**), the app looks in IndexedDB for today's news. Nothing is fetched automatically.
2. If it's missing, you see today's date, your company brief and a **Fetch today's news** button. Clicking it POSTs your saved settings to `/api/news`. **Fetch again** on the title slide replaces the day's stories.
3. The server reads the feeds and keeps items from the last 24h (72h on Mondays, to cover the weekend).
4. It removes duplicates by URL and by normalized title, and turns Google Alerts redirect links back into the real URLs.
5. Groq ranks the stories by relevance to your company brief, keeping at most 2–3 per feed (also enforced in code), and writes the summary and "why it matters" lines. The model only returns item ids and text; titles and links come straight from the feeds.
6. The browser saves the result for the day, so each browser fetches at most once a day.
7. If Groq fails, you get the latest items with their feed snippets instead. Click **Fetch again** to retry.

> **Data lives in one browser.** Run standup from the same browser each day, or use **Export / Import** to move data between machines. The export includes your Groq key, so keep the file private.

## Code structure

```
src/
  app/                    Routes only (Next.js App Router). Pages stay thin and import from features/.
    api/news/route.ts     POST /api/news: fetch feeds, rank with Groq, return the day's briefing
  components/             Shared UI with no feature knowledge: site-header, app-nav, page-shell,
                          blank-screen, reveal-text, searchable-select (the app's dropdown),
                          icons (one icon-set module), ui (class strings)
  features/
    config/               Settings: schema.ts (zod), config.ts (IndexedDB load/save), preset.ts,
                          draft.ts (form working copy, dirty check, validation)
      components/         config-form, config-form-body, settings-nav, save-bar, form-section, form-field,
                          brief-section, feeds-section, feed-row, add-feeds-field, ai-section, secret-input,
                          briefing-section, story-count-picker, time-zone-picker, model-picker,
                          layout-picker, layout-preview, data-section
    history/              search.ts (story search + month grouping)
      components/         history-list, history-search, history-month, history-day, history-story,
                          highlight, history-empty, delete-notice
    news/
      schema.ts           NewsItem / DailyNews types shared by server and browser
      headline.ts         Headline cleanup (drops Google Alerts' " - Publisher" suffix)
      use-daily-news.ts   The day's briefing from IndexedDB + fetchNews()
      server/             Server-only: feeds.ts (RSS), rank.ts (Groq + per-feed limits), build-daily-news.ts
      components/
        standup/          The Today page: standup-view, standup-day, today-landing, fetch-progress, empty-day
        deck/             slide-deck, restart-button, deck-context
        layouts/          Slide designs: editorial/, poster/, briefing/ (title-, story-, end-slide each),
                          shared article-link, format, types; index.ts maps Settings choice → layout
        export-menu.tsx   Export button and menu
      export/             File builders (no React UI)
        file-name.ts      File names + download helper
        pdf/              react-pdf. formats.ts (the 4 designs), export-pdf.ts (loads only the chosen one)
          shared/         fonts, theme (page sizes, palette), format helpers
          slides/         slides-document, cover-page, story-page, sources-page, page-footer, styles
          poster/         poster-document, poster-cover, poster-story, poster-closing, poster-styles
          memo/           memo-document, memo-masthead, memo-story, memo-page-furniture, memo-styles
          digest/         digest-document, digest-header, digest-row, digest-styles
        pptx/             export-pptx (pptxgenjs)
  lib/                    Framework-agnostic helpers: db (Dexie), date, time-zones, backup, use-today
public/fonts/             Static Newsreader + Geist TTFs (OFL) embedded in the PDF
```

Conventions:

- **One component per file**, named after the component in kebab-case (`StoryPage` → `story-page.tsx`). `icons.tsx` is the one exception: it is a single icon set.
- `app/` holds routes, metadata and route handlers only; UI and logic live in `features/` (or `components/` when shared by several features).
- Code under `server/` runs only on the server; `export/` runs only in the browser and loads its libraries (react-pdf, pptxgenjs) on demand.
- Imports across features use `@/…`; imports within a feature use relative paths.

## Google Alerts RSS

1. Go to https://www.google.com/alerts and type a topic, e.g. `"your product" OR "competitor name"`.
2. Click **Show options**, then set **Deliver to → RSS feed** (you must be signed in) and **How often → As-it-happens**.
3. Click **Create Alert**.
4. On the alerts page, click the **RSS icon** next to the alert and copy its URL (`https://www.google.com/alerts/feeds/…/…`).
5. Paste it into **Settings → RSS feeds**. Add one alert per topic, plus any industry blog feeds.

## Deploy to Vercel (Hobby, free)

1. Push this folder to a GitHub repo.
2. In Vercel, click **Add New → Project** and import the repo. The framework is detected as Next.js automatically.
3. Click **Deploy**. No environment variables are needed.
4. Open `https://<your-app>.vercel.app/settings` and enter your feeds and key. They're saved in that browser.

Or use the CLI: `npx vercel` and then `npx vercel --prod`.

`/api/news` has no authentication. It only fetches the feed URLs a caller sends (internal and private addresses are refused) and uses the Groq key the caller provides. It stores nothing.
