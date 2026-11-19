"use client";

import { useConfig } from "../config";
import { ConfigFormBody } from "./config-form-body";

/** Loads saved config, then renders the form (keyed so it re-initializes after an import). */
export function ConfigForm() {
  const config = useConfig();
  if (!config) return <p className="text-muted">Loading…</p>;
  return <ConfigFormBody key={JSON.stringify(config)} initial={config} />;
}
