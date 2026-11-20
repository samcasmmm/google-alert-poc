"use client";

import { Refresh } from "@/components/icons";
import { quietButton } from "@/components/ui";
import { newFeedRow, type FeedRow as Row } from "../draft";
import { nameFromTitle } from "../feed-check";
import { isHttpUrl } from "../schema";
import { useFeedChecks } from "../use-feed-checks";
import { AddFeedsField } from "./add-feeds-field";
import { FeedRow } from "./feed-row";
import { FormSection } from "./form-section";

type Update = (update: (rows: Row[]) => Row[]) => void;

/**
 * The RSS feeds the briefing is built from. Every feed is checked when Settings opens,
 * so each row shows whether it works; newly added feeds are named from their own title.
 */
export function FeedsSection({ rows, errors, onChange }: { rows: Row[]; errors: Record<string, string>; onChange: Update }) {
  const { statuses, check } = useFeedChecks(rows.map((r) => r.url.trim()));
  const checkable = rows.map((r) => r.url.trim()).filter(isHttpUrl);
  const checking = checkable.some((u) => statuses[u]?.state === "checking");
  /** Unnamed feeds whose check found a title to name them by. */
  const suggestions = rows.flatMap((r) => {
    const s = statuses[r.url.trim()];
    return !r.label.trim() && s?.state === "ok" && s.title ? [[r.id, nameFromTitle(s.title)] as const] : [];
  });

  function updateRow(id: string, change: (row: Row) => Row) {
    onChange((all) => all.map((r) => (r.id === id ? change(r) : r)));
  }

  /** Adds rows, checks each feed, and names it from the feed's title unless named meanwhile. */
  function addFeeds(urls: string[]) {
    const added = urls.map((u) => newFeedRow(u));
    onChange((all) => [...all, ...added]);
    for (const row of added) {
      void check(row.url).then((result) => {
        if (result.state !== "ok" || !result.title) return;
        updateRow(row.id, (r) => (r.label.trim() ? r : { ...r, label: nameFromTitle(result.title) }));
      });
    }
  }

  return (
    <FormSection
      id="sources"
      title="News sources"
      description={
        <>
          RSS feeds from Google Alerts or industry blogs. Each briefing takes the 2–3 most relevant stories from each
          feed. In Google Alerts, set <span className="text-ink">Deliver to: RSS feed</span>, then copy the feed link.
        </>
      }
    >
      {rows.length > 0 && (
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-sm text-muted">
            {rows.length} {rows.length === 1 ? "feed" : "feeds"}
          </p>
          <div className="-mr-3 flex flex-wrap justify-end">
            {suggestions.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  const names = new Map(suggestions);
                  onChange((all) =>
                    all.map((r) => {
                      const name = names.get(r.id);
                      return !r.label.trim() && name ? { ...r, label: name } : r;
                    }),
                  );
                }}
                className={`${quietButton} font-medium text-ink`}
              >
                Name from feed titles ({suggestions.length})
              </button>
            )}
            <button
              type="button"
              onClick={() => checkable.forEach((u) => void check(u))}
              disabled={checking || checkable.length === 0}
              className={`${quietButton} gap-1.5 disabled:opacity-50`}
            >
              <Refresh size={15} className={checking ? "motion-safe:animate-spin" : ""} />
              {checking ? "Checking feeds…" : "Check feeds"}
            </button>
          </div>
        </div>
      )}

      {rows.length > 0 ? (
        <ol className="space-y-3" aria-label="Feeds">
          {rows.map((row, i) => (
            <FeedRow
              key={row.id}
              row={row}
              position={i + 1}
              status={statuses[row.url.trim()]}
              error={errors[row.id]}
              onChange={(next) => updateRow(row.id, () => next)}
              onRemove={() => onChange((all) => all.filter((r) => r.id !== row.id))}
              onCheck={() => void check(row.url.trim())}
            />
          ))}
        </ol>
      ) : (
        <p className="rounded-xl bg-subtle px-4 py-3 text-sm text-muted">
          No feeds yet. Add at least one to fetch a briefing.
        </p>
      )}

      <div className="mt-6">
        <AddFeedsField existing={rows.map((r) => r.url.trim())} onAdd={addFeeds} />
      </div>
    </FormSection>
  );
}
