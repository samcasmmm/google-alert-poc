import { formatDayLong, formatTimestamp } from '@/lib/date';
import type { DailyNews, NewsItem } from '../schema';

// Print-only deck used for Export → PDF (and Ctrl/Cmd+P). A dedicated design for a
// fixed 16:9 page (13.333 × 7.5in = 1280 × 720 CSS px), not a copy of the screen
// layouts: colour carries structure (cover, story rail, closing page) and every
// colour is forced to print even when "Background graphics" is off (see globals.css).

const pad = (n: number) => String(n).padStart(2, '0');
const label = 'font-mono text-[11px] tracking-[0.24em] uppercase';

/** Long headlines step down so they stay within 3–4 lines. */
function headlineSize(title: string): string {
  if (title.length <= 55) return 'text-[58px]';
  if (title.length <= 90) return 'text-[48px]';
  return 'text-[40px]';
}

function shortUrl(url: string): string {
  try {
    const u = new URL(url);
    return `${u.hostname.replace(/^www\./, '')}${u.pathname === '/' ? '' : u.pathname}`;
  } catch {
    return url;
  }
}

function Cover({ news, company }: { news: DailyNews; company: string }) {
  const total = news.items.length;
  return (
    <section className='print-slide bg-accent text-white'>
      <div className='flex h-full'>
        <div className='flex flex-1 flex-col justify-between px-18 py-16'>
          <p className={label}>Daily briefing{company && ` · ${company}`}</p>
          <div>
            <h1 className='font-serif text-[128px] leading-[0.88] font-semibold tracking-[-0.02em]'>
              Standup
              <br />
              News
            </h1>
            <p className='mt-8 font-serif text-[36px] leading-tight italic'>{formatDayLong(news.date)}</p>
          </div>
          <p className={label}>
            {total} {total === 1 ? 'story' : 'stories'}
            {news.mode === 'fallback' && ' · feed snippets'}
          </p>
        </div>

        <div className='flex w-125 shrink-0 flex-col justify-center bg-ink/15 px-13'>
          <p className={label}>In this briefing</p>
          <ol className='mt-6 space-y-4'>
            {news.items.map((item, i) => (
              <li key={item.url} className='flex gap-4'>
                <span className='pt-0.75 font-mono text-[13px] tabular-nums'>{pad(i + 1)}</span>
                <span className='line-clamp-2 text-[16px] leading-snug font-medium'>{item.title}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function StoryPage({
  item,
  position,
  total,
  page,
  pages,
  date,
}: {
  item: NewsItem;
  position: number;
  total: number;
  page: number;
  pages: number;
  date: string;
}) {
  const time = formatTimestamp(item.publishedAt);
  return (
    <section className='print-slide bg-paper text-ink'>
      <div className='flex h-full'>
        <aside className='flex w-75 shrink-0 flex-col justify-between bg-accent-soft px-12 pt-16 pb-14'>
          <div>
            <p className={`${label} text-accent`}>Story</p>
            <p className='mt-3 font-serif text-[132px] leading-[0.8] font-medium tracking-[-0.03em] text-accent tabular-nums'>
              {pad(position)}
            </p>
            <p className={`${label} mt-4 text-muted`}>of {pad(total)}</p>
          </div>
          <div>
            <p className='text-[16px] leading-snug font-semibold wrap-break-word'>
              {item.source || shortUrl(item.url)}
            </p>
            {time && <p className='mt-1 text-[13px] text-muted'>{time}</p>}
            <a
              href={item.url}
              className='mt-5 inline-block text-[13px] font-semibold text-accent underline decoration-accent/40 underline-offset-4'
            >
              Read the article ↗
            </a>
          </div>
        </aside>

        <div className='flex min-w-0 flex-1 flex-col justify-center px-18 pt-12 pb-22'>
          <h2
            className={`line-clamp-4 font-serif ${headlineSize(item.title)} leading-[1.04] font-medium tracking-[-0.015em] text-balance`}
          >
            {item.title}
          </h2>
          {item.summary && (
            <p className='mt-7 line-clamp-4 max-w-195 text-[20px] leading-[1.55] text-pretty text-ink/75'>
              {item.summary}
            </p>
          )}
          {item.whyItMatters && (
            <div className='mt-8 max-w-195 border-l-[5px] border-accent pl-6'>
              <p className={`${label} text-accent`}>Why it matters</p>
              <p className='mt-2 line-clamp-3 font-serif text-[23px] leading-snug text-pretty italic'>
                {item.whyItMatters}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className='absolute top-0 right-0 left-0 h-1.5 bg-accent' />
      <footer
        className={`absolute right-18 bottom-7.5 left-93 flex justify-between border-t border-line pt-3 text-muted ${label} text-[10px] tracking-[0.18em]`}
      >
        <span>Standup News · {formatDayLong(date)}</span>
        <span className='tabular-nums'>
          {pad(page)} / {pad(pages)}
        </span>
      </footer>
    </section>
  );
}

function Closing({ news, company }: { news: DailyNews; company: string }) {
  return (
    <section className='print-slide bg-ink text-white'>
      <div className='absolute top-0 right-0 left-0 h-1.5 bg-accent' />
      <div className='flex h-full'>
        <div className='flex flex-1 flex-col justify-center px-18'>
          <p className='font-serif text-[28px] text-white/60'>— 30 —</p>
          <h2 className='mt-5 font-serif text-[96px] leading-[0.92] font-medium tracking-[-0.02em]'>
            Over to
            <br />
            standup.
          </h2>
          <p className='mt-8 text-[16px] text-white/75'>
            {company ? `Prepared for ${company} · ` : ''}
            {formatDayLong(news.date)}
          </p>
        </div>

        <div className='flex w-140 shrink-0 flex-col justify-center border-l border-white/15 px-13'>
          <p className={`${label} text-white/75`}>Sources</p>
          <ol className='mt-6 space-y-3.5'>
            {news.items.map((item, i) => (
              <li key={item.url} className='flex gap-4'>
                <span className='pt-0.5 font-mono text-[12px] text-white/60 tabular-nums'>{pad(i + 1)}</span>
                <a href={item.url} className='min-w-0'>
                  <span className='block text-[14px] font-semibold'>{item.source || 'Source'}</span>
                  <span className='block truncate text-[12px] text-white/65 underline decoration-white/25 underline-offset-2'>
                    {shortUrl(item.url)}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/** Rendered only for print; hidden on screen. */
export function PrintDeck({ news, company }: { news: DailyNews; company: string }) {
  const total = news.items.length;
  const pages = total + 2;
  const who = company.trim();
  return (
    <div className='hidden print:block' aria-hidden>
      {/* Zero page margins: no room for the browser's date / title / URL / page-number lines,
          so they never print. Scoped to this page because PrintDeck only renders here. */}
      <style>{'@page { size: 13.333in 7.5in; margin: 0; }'}</style>
      <Cover news={news} company={who} />
      {news.items.map((item, i) => (
        <StoryPage
          key={item.url}
          item={item}
          position={i + 1}
          total={total}
          page={i + 2}
          pages={pages}
          date={news.date}
        />
      ))}
      <Closing news={news} company={who} />
    </div>
  );
}
