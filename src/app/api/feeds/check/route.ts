import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { isHttpUrl } from "@/features/config/schema";
import { describeFeedError, inspectFeed } from "@/features/news/server/feeds";

export const maxDuration = 20;

const BodySchema = z.object({ url: z.string().max(2000).refine(isHttpUrl) });

/**
 * POST /api/feeds/check — body: { url }. Reads one feed so Settings can show whether
 * it works, how many stories it has and its title (used to name the feed).
 */
export async function POST(request: NextRequest) {
  const body: unknown = await request.json().catch(() => null);
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Enter a full feed URL starting with https://" }, { status: 400 });
  }
  try {
    const check = await inspectFeed(parsed.data.url);
    return NextResponse.json({ ok: true, ...check }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ ok: false, error: describeFeedError(error) }, { status: 200 });
  }
}
