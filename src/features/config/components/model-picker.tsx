"use client";

import { useCallback, useMemo } from "react";
import { SearchableSelect, type SelectOption } from "@/components/searchable-select";
import { formatContext, type GroqModel } from "../groq-check";
import { DEFAULT_MODEL, SUGGESTED_MODELS } from "../schema";

/** Stored value meaning "use the app's default model". */
const DEFAULT = "";

function toOption(id: string, owner?: string, contextWindow?: number | null): SelectOption {
  const slash = id.indexOf("/");
  const label = slash > 0 ? id.slice(slash + 1) : id;
  const secondary = slash > 0 ? id.slice(0, slash) : owner;
  return { value: id, label, secondary, trailing: contextWindow ? `${formatContext(contextWindow)} context` : undefined, keywords: `${id} ${owner ?? ""}` };
}

/**
 * Groq model dropdown: the default first, then the models the key can use (live from
 * Groq once the key is checked; a short suggested list before that). Any typed id can
 * be used too ("Use “…”").
 */
export function ModelPicker({
  id,
  value,
  onChange,
  available,
  describedBy,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  /** Models from the key check; undefined until the key is checked */
  available?: GroqModel[];
  describedBy?: string;
}) {
  const options = useMemo<SelectOption[]>(() => {
    const list = available
      ? available.filter((m) => m.id !== DEFAULT_MODEL).map((m) => toOption(m.id, m.owner, m.contextWindow))
      : SUGGESTED_MODELS.filter((m) => m !== DEFAULT_MODEL).map((m) => toOption(m));
    if (value && !list.some((o) => o.value === value)) list.push(toOption(value));
    const defaultInfo = available?.find((m) => m.id === DEFAULT_MODEL);
    return [
      {
        value: DEFAULT,
        label: "Default",
        secondary: DEFAULT_MODEL,
        trailing: defaultInfo?.contextWindow ? `${formatContext(defaultInfo.contextWindow)} context` : undefined,
        keywords: DEFAULT_MODEL,
        divider: true,
      },
      ...list,
    ];
  }, [available, value]);

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
      describedBy={describedBy}
    />
  );
}
