import type { ParsedNewsRequest as NewsRequest } from "@/features/config/schema";
import { weekdayOf } from "@/lib/date";
import type { DailyNews } from "../schema";
import { fetchRecentItems } from "./feeds";
import { fallbackItems, rankWithGroq } from "./rank";

const HOUR_MS = 3600 * 1000;

export async function buildDailyNews(req: NewsRequest): Promise<DailyNews> {
  // Monday covers the weekend.
  const lookbackHours = weekdayOf(req.date) === 1 ? 72 : 24;
  const raw = await fetchRecentItems(req.feeds, Date.now() - lookbackHours * HOUR_MS);
  const base = { date: req.date, generatedAt: new Date().toISOString() };

  if (raw.length === 0) return { ...base, mode: "fallback", items: [], note: "No items in the feeds for this period." };

  if (!req.groqApiKey) {
    return { ...base, mode: "fallback", items: fallbackItems(raw), note: "No Groq API key set." };
  }

  try {
    const items = await rankWithGroq(raw, {
      apiKey: req.groqApiKey,
      model: req.groqModel,
      brief: req.brief,
      maxItems: req.maxItems,
    });
    return { ...base, mode: "ai", items };
  } catch (error) {
    console.error("[news] Groq ranking failed, using fallback", error);
    const message = error instanceof Error ? error.message : String(error);
    return { ...base, mode: "fallback", items: fallbackItems(raw), note: `Groq failed: ${message.slice(0, 200)}` };
  }
}
