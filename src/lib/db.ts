import Dexie, { type EntityTable } from "dexie";
import type { DailyNews } from "@/features/news/schema";

export type StoredNews = DailyNews & { savedAt: string };

export interface Setting {
  key: string;
  value: unknown;
}

class StandupDB extends Dexie {
  news!: EntityTable<StoredNews, "date">;
  settings!: EntityTable<Setting, "key">;

  constructor() {
    super("standup-news");
    this.version(1).stores({
      news: "date",
      team: "++id, name, active",
      rotation: "++id, date, memberId",
      settings: "key",
    });
    // v2: team + presenter rotation removed.
    this.version(2).stores({ team: null, rotation: null });
  }
}

export const db = new StandupDB();
