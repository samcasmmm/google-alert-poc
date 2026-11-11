import { z } from "zod";
import { DailyNewsSchema } from "@/features/news/schema";
import { db } from "./db";

const BackupSchema = z.object({
  app: z.literal("standup-news"),
  // v1 backups also contain team/rotation; those tables no longer exist and are ignored.
  version: z.union([z.literal(1), z.literal(2)]),
  exportedAt: z.string(),
  tables: z.object({
    news: z.array(DailyNewsSchema.extend({ savedAt: z.string() })),
    settings: z.array(z.object({ key: z.string(), value: z.unknown() })),
  }),
});

export type Backup = z.infer<typeof BackupSchema>;

export async function exportData(): Promise<Backup> {
  const [news, settings] = await Promise.all([db.news.toArray(), db.settings.toArray()]);
  return {
    app: "standup-news",
    version: 2,
    exportedAt: new Date().toISOString(),
    tables: { news, settings },
  };
}

/** Replaces everything in IndexedDB with the backup. Throws if the file is invalid. */
export async function importData(json: unknown): Promise<Backup["tables"]> {
  const result = BackupSchema.safeParse(json);
  if (!result.success) throw new Error("This file isn't a valid Standup News backup.");
  const { tables } = result.data;

  await db.transaction("rw", [db.news, db.settings], async () => {
    await Promise.all([db.news.clear(), db.settings.clear()]);
    await db.news.bulkPut(tables.news);
    await db.settings.bulkPut(tables.settings);
  });
  return tables;
}
