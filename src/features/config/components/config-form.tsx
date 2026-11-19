"use client";

import { useState } from "react";
import { useConfig } from "../config";
import { ConfigFormBody } from "./config-form-body";

/**
 * Loads saved config, then renders the form. Keyed by the stored config so it
 * re-initialises after a save or a backup restore; `savedAt` survives that remount.
 */
export function ConfigForm() {
  const config = useConfig();
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  if (!config) return <div className="min-h-96" aria-busy="true" />;
  return (
    <ConfigFormBody
      key={JSON.stringify(config)}
      initial={config}
      savedAt={savedAt}
      onSaved={() => setSavedAt(new Date())}
    />
  );
}
