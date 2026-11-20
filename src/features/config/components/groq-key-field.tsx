"use client";

import { useRef } from "react";
import { secondaryButton } from "@/components/ui";
import type { GroqKeyStatus as Status } from "../groq-check";
import { GroqKeyStatus } from "./groq-key-status";
import { SecretInput } from "./secret-input";

/**
 * The Groq key with Show/Hide, a Check button, and its status underneath.
 * A changed key is checked when the field loses focus.
 */
export function GroqKeyField({
  value,
  status,
  onChange,
  onCheck,
}: {
  value: string;
  status?: Status;
  onChange: (value: string) => void;
  onCheck: (key: string) => void;
}) {
  const key = value.trim();
  const lastBlurred = useRef(key);
  const statusId = "cfg-key-status";

  return (
    <div>
      <label htmlFor="cfg-key" className="text-sm font-medium">
        Groq API key
      </label>
      <p className="mt-0.5 text-sm text-muted">
        Free at{" "}
        <a
          href="https://console.groq.com/keys"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-accent underline-offset-4 hover:underline"
        >
          console.groq.com/keys
        </a>
        . Kept in this browser; sent only when fetching news or checking the key.
      </p>
      <div className="mt-2 flex gap-2">
        <div className="min-w-0 flex-1">
          <SecretInput
            id="cfg-key"
            value={value}
            onChange={onChange}
            placeholder="gsk_…"
            describedBy={statusId}
            onBlur={() => {
              if (key && key !== lastBlurred.current && !status) onCheck(key);
              lastBlurred.current = key;
            }}
          />
        </div>
        <button
          type="button"
          onClick={() => onCheck(key)}
          disabled={!key || status?.state === "checking"}
          className={`${secondaryButton} shrink-0`}
        >
          Check
        </button>
      </div>
      <GroqKeyStatus id={statusId} status={status} hasKey={!!key} />
    </div>
  );
}
