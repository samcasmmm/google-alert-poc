import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { describeGroqError, listGroqModels } from "@/features/news/server/groq-models";

export const maxDuration = 20;

const BodySchema = z.object({ apiKey: z.string().trim().min(1).max(200) });

/**
 * POST /api/groq/check — body: { apiKey }. Confirms the key works and returns the
 * text models it can use, for Settings. The key is used for this one call and not stored.
 */
export async function POST(request: NextRequest) {
  const body: unknown = await request.json().catch(() => null);
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Paste a Groq API key first." }, { status: 400 });
  }
  try {
    const models = await listGroqModels(parsed.data.apiKey);
    return NextResponse.json({ ok: true, models }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ ok: false, error: describeGroqError(error) }, { headers: { "Cache-Control": "no-store" } });
  }
}
