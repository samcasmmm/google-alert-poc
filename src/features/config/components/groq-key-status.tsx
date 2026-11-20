import { Check, Spinner } from "@/components/icons";
import type { GroqKeyStatus as Status } from "../groq-check";

/** One line under the key: checking, works (with how many models), or why it failed. */
export function GroqKeyStatus({ id, status, hasKey }: { id: string; status?: Status; hasKey: boolean }) {
  if (!hasKey) {
    return (
      <p id={id} className="mt-1.5 text-sm text-muted">
        No key yet. Briefings still work, using the feeds’ own snippets.
      </p>
    );
  }
  if (!status) {
    return (
      <p id={id} className="mt-1.5 text-sm text-muted">
        Not checked yet. It’s checked when you leave the field, or press Check.
      </p>
    );
  }
  if (status.state === "checking") {
    return (
      <p id={id} className="mt-1.5 inline-flex items-center gap-1.5 text-sm text-muted">
        <Spinner size={13} /> Checking the key with Groq…
      </p>
    );
  }
  if (status.state === "error") {
    return (
      <p id={id} role="alert" className="mt-1.5 text-sm text-accent">
        {status.error}
      </p>
    );
  }
  const n = status.models.length;
  return (
    <p id={id} className="mt-1.5 inline-flex items-center gap-1.5 text-sm text-emerald-800">
      <Check size={14} />
      Key works. {n} text {n === 1 ? "model" : "models"} available.
    </p>
  );
}
