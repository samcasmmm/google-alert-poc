"use client";

import { useCallback, useMemo } from "react";
import { SearchableSelect, type SelectOption } from "@/components/searchable-select";
import { DEFAULT_MODEL, SUGGESTED_MODELS } from "../schema";

/** Stored value meaning "use the app's default model". */
const DEFAULT = "";

/**
 * Groq model dropdown: the default first, then suggested models. Groq adds models
 * often, so any typed id can be used too ("Use “…”").
 */
export function ModelPicker({ id, value, onChange }: { id: string; value: string; onChange: (value: string) => void }) {
  const options = useMemo<SelectOption[]>(() => {
    const ids = [...new Set([...SUGGESTED_MODELS.filter((m) => m !== DEFAULT_MODEL), ...(value ? [value] : [])])];
    return [
      { value: DEFAULT, label: "Default", secondary: DEFAULT_MODEL, keywords: DEFAULT_MODEL, divider: true },
      ...ids.map((m) => {
        const slash = m.indexOf("/");
        return slash > 0
          ? { value: m, label: m.slice(slash + 1), secondary: m.slice(0, slash), keywords: m }
          : { value: m, label: m, keywords: m };
      }),
    ];
  }, [value]);

  const customOption = useCallback(
    (query: string): SelectOption | null =>
      query && /^[\w./:-]+$/.test(query) && query !== DEFAULT_MODEL
        ? { value: query, label: `Use “${query}”`, secondary: "model id from console.groq.com" }
        : null,
    [],
  );

  return (
    <SearchableSelect
      id={id}
      value={value === DEFAULT_MODEL ? DEFAULT : value}
      options={options}
      onChange={onChange}
      display={value ? value : `Default: ${DEFAULT_MODEL}`}
      placeholder={!value}
      searchLabel="Search or type a Groq model id"
      searchPlaceholder="Search or type a model id"
      customOption={customOption}
    />
  );
}
