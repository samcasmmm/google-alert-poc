import { z } from "zod";

// Shared by the API route (server) and IndexedDB / import validation (client).

export const NewsItemSchema = z.object({
  title: z.string(),
  summary: z.string(),
  whyItMatters: z.string(),
  source: z.string(),
  url: z.string(),
  publishedAt: z.string(),
});

export const DailyNewsSchema = z.object({
  date: z.string(),
  generatedAt: z.string(),
  /** "ai" = ranked + summarized by Groq, "fallback" = latest items with RSS snippets */
  mode: z.enum(["ai", "fallback"]),
  /** Why the fallback was used, if it was */
  note: z.string().optional(),
  items: z.array(NewsItemSchema),
});

export type NewsItem = z.infer<typeof NewsItemSchema>;
export type DailyNews = z.infer<typeof DailyNewsSchema>;
