"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Check, ChevronDown, Search } from "./icons";

export interface SelectOption {
  value: string;
  /** Main text, e.g. "Kolkata" */
  label: string;
  /** Muted text after the label, e.g. "Asia" */
  secondary?: string;
  /** Right-aligned detail, e.g. "GMT+5:30" */
  trailing?: string;
  /** Extra words search should match (aliases, ids) */
  keywords?: string;
  /** Draw a rule under this option (separates a pinned default from the list) */
  divider?: boolean;
}

/**
 * The app's dropdown: a button showing the current choice, and a popup with a search
 * box and a listbox. Keyboard: ↑/↓ (opens it), Home/End, PageUp/PageDown, Enter to
 * choose, Escape to close; clicking outside closes. `customOption` can offer the typed
 * text itself as a choice (for free-form values like model ids).
 */
export function SearchableSelect({
  id,
  value,
  options,
  onChange,
  display,
  placeholder,
  searchLabel,
  searchPlaceholder,
  customOption,
  invalid,
  describedBy,
}: {
  id: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  /** Text on the button for the current value */
  display: string;
  /** Show the button text muted (e.g. while following a default) */
  placeholder?: boolean;
  searchLabel: string;
  searchPlaceholder?: string;
  customOption?: (query: string) => SelectOption | null;
  invalid?: boolean;
  describedBy?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const listId = useId();

  const visible = useMemo(() => {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    const all = terms.length
      ? options.filter((o) => {
          const text = `${o.label} ${o.secondary ?? ""} ${o.trailing ?? ""} ${o.value} ${o.keywords ?? ""}`.toLowerCase();
          return terms.every((t) => text.includes(t));
        })
      : options;
    // Options whose main label matches come first ("20b" → gpt-oss-20b before "Default … gpt-oss-120b").
    const labelHit = (o: SelectOption) => terms.every((t) => o.label.toLowerCase().includes(t));
    const matches = terms.length ? [...all.filter(labelHit), ...all.filter((o) => !labelHit(o))] : all;
    const custom = customOption?.(query.trim());
    const exact = custom && options.some((o) => o.value === custom.value);
    return custom && !exact ? [...matches, custom] : matches;
  }, [options, query, customOption]);

  // Close on outside pointer down.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  // Keep the active option in view.
  useEffect(() => {
    if (open) list.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  function openList() {
    setQuery("");
    setActive(Math.max(0, options.findIndex((o) => o.value === value)));
    setOpen(true);
    requestAnimationFrame(() => search.current?.focus());
  }

  function choose(option: SelectOption) {
    onChange(option.value);
    setOpen(false);
    trigger.current?.focus();
  }

  function onSearchKey(e: KeyboardEvent<HTMLInputElement>) {
    const last = visible.length - 1;
    const keys: Record<string, () => void> = {
      ArrowDown: () => setActive((i) => Math.min(last, i + 1)),
      ArrowUp: () => setActive((i) => Math.max(0, i - 1)),
      Home: () => setActive(0),
      End: () => setActive(last),
      PageDown: () => setActive((i) => Math.min(last, i + 8)),
      PageUp: () => setActive((i) => Math.max(0, i - 8)),
      Enter: () => visible[active] && choose(visible[active]),
      Escape: () => {
        setOpen(false);
        trigger.current?.focus();
      },
    };
    if (e.key === "Tab") return setOpen(false);
    const run = keys[e.key];
    if (!run) return;
    e.preventDefault();
    run();
  }

  const optionId = (i: number) => `${listId}-${i}`;

  return (
    <div ref={root} className="relative sm:max-w-md">
      <button
        ref={trigger}
        id={id}
        type="button"
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={(e) => {
          if ((e.key === "ArrowDown" || e.key === "ArrowUp") && !open) {
            e.preventDefault();
            openList();
          }
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-describedby={describedBy}
        className={`flex min-h-11 w-full items-center justify-between gap-3 rounded-lg border bg-paper px-3 py-2 text-left text-ink transition-colors hover:border-ink/40 focus-visible:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
          invalid ? "border-accent" : open ? "border-ink" : "border-line"
        }`}
      >
        <span className={`truncate ${placeholder ? "text-muted" : ""}`}>{display}</span>
        <ChevronDown size={16} className={`shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full right-0 left-0 z-30 mt-2 overflow-hidden rounded-xl border border-line bg-paper shadow-[0_12px_32px_-12px_rgb(17_17_17/0.25)] motion-safe:animate-pop">
          <div className="relative border-b border-line">
            <Search size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted" />
            <input
              ref={search}
              type="text"
              role="combobox"
              aria-label={searchLabel}
              aria-expanded="true"
              aria-controls={listId}
              aria-activedescendant={visible.length ? optionId(active) : undefined}
              aria-autocomplete="list"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={onSearchKey}
              placeholder={searchPlaceholder ?? "Search"}
              autoComplete="off"
              spellCheck={false}
              className="min-h-11 w-full bg-transparent py-2 pr-3 pl-9 text-sm text-ink placeholder:text-muted focus:outline-none"
            />
          </div>

          <ul ref={list} id={listId} role="listbox" aria-label={searchLabel} className="max-h-72 overflow-y-auto overscroll-contain p-1">
            {visible.length === 0 && <li className="px-3 py-3 text-sm text-muted">Nothing matches “{query}”.</li>}
            {visible.map((option, i) => {
              const selected = option.value === value;
              return (
                <li
                  key={`${option.value}-${i}`}
                  id={optionId(i)}
                  data-index={i}
                  role="option"
                  aria-selected={selected}
                  onPointerMove={() => setActive(i)}
                  onClick={() => choose(option)}
                  className={`flex min-h-10 cursor-pointer items-center gap-3 rounded-lg px-3 py-1.5 text-sm ${
                    i === active ? "bg-subtle" : ""
                  } ${option.divider ? "mb-1 border-b border-line pb-2" : ""}`}
                >
                  <Check size={15} className={`shrink-0 ${selected ? "text-accent" : "invisible"}`} />
                  <span className="min-w-0 flex-1 truncate">
                    <span className="font-medium text-ink">{option.label}</span>
                    {option.secondary && <span className="text-muted"> {option.secondary}</span>}
                  </span>
                  {option.trailing && <span className="shrink-0 text-xs text-muted tabular-nums">{option.trailing}</span>}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
