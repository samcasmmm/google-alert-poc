"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { OLD_PRESET_PRIORITIES, PRESET_BRIEF, withPreset } from "./preset";
import { AppConfigSchema, DEFAULT_CONFIG, DEFAULT_MODEL, RETIRED_MODELS, type AppConfig } from "./schema";

const CONFIG_KEY = "config";
/** Set on the first save; until then empty feeds/brief are prefilled from the preset. */
const PRESET_DONE_KEY = "presetApplied";

export async function loadConfig(): Promise<AppConfig> {
  const row = await db.settings.get(CONFIG_KEY);
  const raw = (row?.value ?? {}) as Record<string, unknown>;
  const parsed = AppConfigSchema.safeParse(raw);
  const presetDone = !!(await db.settings.get(PRESET_DONE_KEY))?.value;
  if (!parsed.success) return presetDone ? DEFAULT_CONFIG : withPreset(DEFAULT_CONFIG);
  const config = presetDone ? parsed.data : withPreset(parsed.data);
  if (config.groqModel === DEFAULT_MODEL || RETIRED_MODELS.has(config.groqModel)) config.groqModel = "";
  // Saved before the priorities became the five Google Alert topics, and never edited.
  if (config.brief.priorities === OLD_PRESET_PRIORITIES) config.brief.priorities = PRESET_BRIEF.priorities;
  // The old single "team focus" field becomes the brief's priorities.
  if (typeof raw.focus === "string" && raw.focus.trim() && !config.brief.priorities) {
    config.brief.priorities = raw.focus.trim();
  }
  return config;
}

export async function saveConfig(config: AppConfig): Promise<void> {
  await db.settings.bulkPut([
    { key: CONFIG_KEY, value: AppConfigSchema.parse(config) },
    { key: PRESET_DONE_KEY, value: true },
  ]);
}

/** Live config from IndexedDB; undefined while loading. */
export function useConfig(): AppConfig | undefined {
  return useLiveQuery(loadConfig);
}
