import { Check, Spinner } from "@/components/icons";
import { formatRelative } from "@/lib/date";
import type { FeedStatus as Status } from "../feed-check";

/** One line under a feed: checking, how many stories and how fresh, or what went wrong. */
export function FeedStatus({ status }: { status?: Status }) {
  if (!status) return null;
  if (status.state === "checking") {
    return (
      <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm text-muted">
        <Spinner size={13} /> Checking feed…
      </p>
    );
  }
  if (status.state === "error") {
    return <p className="mt-1.5 text-sm text-accent">{status.error}</p>;
  }
  if (status.itemCount === 0) {
    return <p className="mt-1.5 text-sm text-muted">Feed works but has no stories yet.</p>;
  }
  const fresh = status.newest ? `, newest ${formatRelative(status.newest)}` : "";
  return (
    <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm text-emerald-800">
      <Check size={14} />
      {`${status.itemCount} ${status.itemCount === 1 ? "story" : "stories"}${fresh}`}
    </p>
  );
}
