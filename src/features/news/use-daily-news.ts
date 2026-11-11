"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { useCallback, useState } from "react";
import type { AppConfig, NewsRequest } from "@/features/config/schema";
import { db, type StoredNews } from "@/lib/db";
import { DailyNewsSchema } from "./schema";

async function fetchAndSave(date: string, config: AppConfig): Promise<void> {
  const payload: NewsRequest = {
    date,
    feeds: config.feeds,
    groqApiKey: config.groqApiKey || undefined,
    groqModel: config.groqModel || undefined,
    brief: config.brief,
    maxItems: config.maxItems,
  };
  const res = await fetch("/api/news", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body: unknown = await res.json().catch(() => null);
  if (!res.ok) {
    const message = (body as { error?: string } | null)?.error;
    throw new Error(message ?? `Request failed (${res.status}). Try again.`);
  }
  const news = DailyNewsSchema.parse(body);
  if (news.items.length === 0) {
    throw new Error(news.note ?? "Your feeds had no stories in this period. Add more feeds in Settings.");
  }
  await db.news.put({ ...news, savedAt: new Date().toISOString() });
}

/**
 * The day's news from IndexedDB. Nothing is fetched automatically:
 * call `fetchNews()` from an explicit user action.
 */
export function useDailyNews(date: string, config: AppConfig) {
  const result = useLiveQuery(async () => ({ news: await db.news.get(date) }), [date]);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = useCallback(async () => {
    if (config.feeds.length === 0) return;
    setFetching(true);
    setError(null);
    try {
      await fetchAndSave(date, config);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't fetch news. Try again.");
    } finally {
      setFetching(false);
    }
  }, [date, config]);

  return {
    news: result?.news as StoredNews | undefined,
    /** IndexedDB has answered */
    ready: result !== undefined,
    fetching,
    error,
    fetchNews,
  };
}
