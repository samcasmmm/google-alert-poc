import { isValidTimeZone } from "@/lib/date";
import { DEFAULT_MODEL, isHttpUrl, type AppConfig } from "./schema";

/** One editable feed row in Settings. `id` is only a stable React key. */
export interface FeedRow {
  id: string;
  url: string;
  label: string;
}

/** The settings form's working copy: the saved config, with feeds as editable rows. */
export type Draft = Omit<AppConfig, "feeds" | "feedLabels"> & { feedRows: FeedRow[] };

let nextId = 0;
export function newFeedRow(url = "", label = ""): FeedRow {
  nextId += 1;
  return { id: `feed-${nextId}`, url, label };
}

export function toDraft(config: AppConfig): Draft {
  const { feeds, feedLabels, ...rest } = config;
  return { ...rest, feedRows: feeds.map((url) => newFeedRow(url, feedLabels[url] ?? "")) };
}

/** Back to the stored shape: trimmed, empty rows dropped, duplicate URLs merged. */
export function fromDraft(draft: Draft): AppConfig {
  const { feedRows, ...rest } = draft;
  const feeds: string[] = [];
  const feedLabels: Record<string, string> = {};
  for (const row of feedRows) {
    const url = row.url.trim();
    if (!url || feeds.includes(url)) continue;
    feeds.push(url);
    if (row.label.trim()) feedLabels[url] = row.label.trim();
  }
  return {
    ...rest,
    groqApiKey: rest.groqApiKey.trim(),
    groqModel: rest.groqModel.trim() === DEFAULT_MODEL ? "" : rest.groqModel.trim(),
    timeZone: rest.timeZone.trim(),
    brief: Object.fromEntries(Object.entries(rest.brief).map(([k, v]) => [k, v.trim()])) as AppConfig["brief"],
    feeds,
    feedLabels,
  };
}

/** True when saving the draft would change what is stored. */
export function isDirty(draft: Draft, saved: AppConfig): boolean {
  return JSON.stringify(fromDraft(draft)) !== JSON.stringify(fromDraft(toDraft(saved)));
}

export interface DraftErrors {
  /** Row id → message */
  feeds: Record<string, string>;
  timeZone?: string;
}

export function validateDraft(draft: Draft): DraftErrors {
  const feeds: Record<string, string> = {};
  for (const row of draft.feedRows) {
    const url = row.url.trim();
    if (url && !isHttpUrl(url)) feeds[row.id] = "Enter a full feed URL starting with https://";
  }
  const zone = draft.timeZone.trim();
  return {
    feeds,
    timeZone: zone && !isValidTimeZone(zone) ? "Unknown time zone. Use a name like Asia/Kolkata." : undefined,
  };
}

export function hasErrors(errors: DraftErrors): boolean {
  return Object.keys(errors.feeds).length > 0 || !!errors.timeZone;
}
