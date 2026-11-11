import { NextResponse, type NextRequest } from "next/server";
import { NewsRequestSchema } from "@/features/config/schema";
import { buildDailyNews } from "@/features/news/server/build-daily-news";

export const maxDuration = 60;

/**
 * POST /api/news — body: { date, feeds, groqApiKey?, groqModel?, focus?, maxItems? }
 * Config lives in the browser (IndexedDB) and is sent with each request; nothing
 * is stored on the server. The browser saves the result per day, so this runs
 * about once a day per browser.
 */
export async function POST(request: NextRequest) {
  const body: unknown = await request.json().catch(() => null);
  const parsed = NewsRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 },
    );
  }

  try {
    const news = await buildDailyNews(parsed.data);
    return NextResponse.json(news, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[api/news]", error);
    const message = error instanceof Error ? error.message : "Failed to load news";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
