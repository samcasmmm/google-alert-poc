import { Spinner } from "@/components/icons";
import { primaryButton, secondaryButton } from "@/components/ui";

/** Sticks to the bottom of the form: says whether there are unsaved changes, with Discard and Save. */
export function SaveBar({
  dirty,
  saving,
  errorCount,
  savedAt,
  onDiscard,
}: {
  dirty: boolean;
  saving: boolean;
  errorCount: number;
  /** When this browser last saved, for the "Saved at" note */
  savedAt: Date | null;
  onDiscard: () => void;
}) {
  const status =
    errorCount > 0
      ? `Fix ${errorCount === 1 ? "the highlighted field" : `${errorCount} highlighted fields`} before saving.`
      : dirty
        ? "You have unsaved changes."
        : savedAt
          ? `Saved at ${savedAt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}.`
          : "All changes are saved in this browser.";

  return (
    <div className="sticky bottom-0 z-20 -mx-4 mt-14 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur-sm sm:-mx-8 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p role="status" className={`text-sm ${errorCount ? "text-accent" : dirty ? "text-ink" : "text-muted"}`}>
          {status}
        </p>
        <div className="flex gap-2">
          {dirty && (
            <button type="button" onClick={onDiscard} disabled={saving} className={secondaryButton}>
              Discard
            </button>
          )}
          <button type="submit" disabled={!dirty || saving} className={`${primaryButton} gap-2`} title="Save (Ctrl+S)">
            {saving && <Spinner size={16} />}
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
