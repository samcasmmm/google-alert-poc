"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { AppConfigSchema, DEFAULT_CONFIG, DEFAULT_MODEL, RETIRED_MODELS, type AppConfig } from "./schema";

const CONFIG_KEY = "config";

export async function loadConfig(): Promise<AppConfig> {
  const row = await db.settings.get(CONFIG_KEY);
  const raw = (row?.value ?? {}) as Record<string, unknown>;
  const parsed = AppConfigSchema.safeParse(raw);
  if (!parsed.success) return DEFAULT_CONFIG;
  const config = parsed.data;
  if (config.groqModel === DEFAULT_MODEL || RETIRED_MODELS.has(config.groqModel)) config.groqModel = "";
  // The old single "team focus" field becomes the brief's priorities.
  if (typeof raw.focus === "string" && raw.focus.trim() && !config.brief.priorities) {
    config.brief.priorities = raw.focus.trim();
  }
  return config;
}

export async function saveConfig(config: AppConfig): Promise<void> {
  await db.settings.put({ key: CONFIG_KEY, value: AppConfigSchema.parse(config) });
}

/** Live config from IndexedDB; undefined while loading. */
export function useConfig(): AppConfig | undefined {
  return useLiveQuery(loadConfig);
}
