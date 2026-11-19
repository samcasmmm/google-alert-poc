import { newFeedRow, type FeedRow as Row } from "../draft";
import { AddFeedsField } from "./add-feeds-field";
import { FeedRow } from "./feed-row";
import { FormSection } from "./form-section";

/** The RSS feeds the briefing is built from, as named rows. */
export function FeedsSection({
  rows,
  errors,
  onChange,
}: {
  rows: Row[];
  errors: Record<string, string>;
  onChange: (rows: Row[]) => void;
}) {
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
      {rows.length > 0 ? (
        <ol className="space-y-3" aria-label="Feeds">
          {rows.map((row, i) => (
            <FeedRow
              key={row.id}
              row={row}
              position={i + 1}
              error={errors[row.id]}
              onChange={(next) => onChange(rows.map((r) => (r.id === row.id ? next : r)))}
              onRemove={() => onChange(rows.filter((r) => r.id !== row.id))}
            />
          ))}
        </ol>
      ) : (
        <p className="rounded-lg bg-subtle px-4 py-3 text-sm text-muted">
          No feeds yet. Add at least one to fetch a briefing.
        </p>
      )}

      <div className="mt-6">
        <AddFeedsField
          existing={rows.map((r) => r.url.trim())}
          onAdd={(urls) => onChange([...rows, ...urls.map((u) => newFeedRow(u))])}
        />
      </div>
    </FormSection>
  );
}
