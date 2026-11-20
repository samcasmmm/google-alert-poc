"use client";

import { useState } from "react";
import { inputClass, secondaryButton } from "@/components/ui";

/** Password-style input with a Show / Hide toggle (for the Groq API key). */
export function SecretInput({
  id,
  value,
  onChange,
  placeholder,
  onBlur,
  describedBy,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onBlur?: () => void;
  describedBy?: string;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="flex gap-2">
      <input
        id={id}
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-describedby={describedBy}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck={false}
        className={`${inputClass} font-mono text-sm`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-pressed={visible}
        aria-controls={id}
        className={`${secondaryButton} w-20 shrink-0`}
      >
        {visible ? "Hide" : "Show"}
      </button>
    </div>
  );
}
