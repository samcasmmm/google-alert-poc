"use client";

import { useEffect, useId, useRef, useState, type ComponentType, type KeyboardEvent } from "react";
import { ChevronDown, Download, FileText, Presentation, Spinner } from "@/components/icons";
import { exportPdf } from "../export/pdf/export-pdf";
import { PDF_FORMATS, type PdfFormat } from "../export/pdf/formats";
import { exportPptx } from "../export/pptx/export-pptx";
import type { DailyNews } from "../schema";

type Choice = PdfFormat | "pptx";

interface Option {
  id: Choice;
  label: string;
  hint: string;
  Icon: ComponentType<{ size?: number }>;
}

const PDF_OPTIONS: Option[] = PDF_FORMATS.map((f) => ({
  ...f,
  Icon: f.id === "slides" ? Presentation : FileText,
}));
const PPTX_OPTION: Option = {
  id: "pptx",
  label: "PowerPoint",
  hint: "Editable .pptx with speaker notes",
  Icon: Presentation,
};
const ALL_OPTIONS = [...PDF_OPTIONS, PPTX_OPTION];

function describe(choice: Choice): string {
  return choice === "pptx" ? "PowerPoint" : `${PDF_FORMATS.find((f) => f.id === choice)?.label ?? "PDF"} PDF`;
}

/**
 * Export button + menu: four PDF formats and PowerPoint. Used on the slide deck
 * (label "Export") and on each History day (label "Download").
 */
export function ExportMenu({
  news,
  company,
  label = "Export",
  align = "end",
}: {
  news: DailyNews;
  company: string;
  label?: string;
  /** Which edge of the button the menu lines up with */
  align?: "start" | "end";
}) {
  const edge = align === "start" ? "left-0 origin-top-left" : "right-0 origin-top-right";
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<Choice | null>(null);
  const [error, setError] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const menuId = useId();

  // Close on outside pointer down.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Focus the first item when the menu opens.
  useEffect(() => {
    if (open) itemsRef.current[0]?.focus();
  }, [open]);

  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(null), 6000);
    return () => clearTimeout(t);
  }, [error]);

  function close(returnFocus = true) {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  }

  async function run(choice: Choice) {
    close();
    setError(null);
    setBusy(choice);
    try {
      await (choice === "pptx" ? exportPptx(news, company) : exportPdf(news, company, choice));
    } catch (e) {
      console.error("[export]", e);
      setError(`Couldn’t create the ${describe(choice)}. Try again.`);
    } finally {
      setBusy(null);
    }
  }

  // Keys inside the menu must not reach the deck's slide navigation.
  function onMenuKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const items = itemsRef.current.filter(Boolean) as HTMLButtonElement[];
    const current = items.indexOf(document.activeElement as HTMLButtonElement);
    const focusAt = (i: number) => items[(i + items.length) % items.length]?.focus();
    switch (e.key) {
      case "ArrowDown":
        focusAt(current + 1);
        break;
      case "ArrowUp":
        focusAt(current - 1);
        break;
      case "Home":
        focusAt(0);
        break;
      case "End":
        focusAt(items.length - 1);
        break;
      case "Escape":
        close();
        break;
      case "Tab":
        close(false);
        return;
      default:
        e.stopPropagation();
        return;
    }
    e.preventDefault();
    e.stopPropagation();
  }

  function item(option: Option) {
    const index = ALL_OPTIONS.indexOf(option);
    const { Icon } = option;
    return (
      <button
        key={option.id}
        ref={(el) => {
          itemsRef.current[index] = el;
        }}
        type="button"
        role="menuitem"
        tabIndex={-1}
        onClick={() => void run(option.id)}
        className="flex min-h-13 w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors outline-none hover:bg-subtle focus-visible:bg-subtle focus-visible:ring-2 focus-visible:ring-accent/40"
      >
        <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
          <Icon size={16} />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-medium text-ink">{option.label}</span>
          <span className="block text-xs leading-snug text-muted">{option.hint}</span>
        </span>
      </button>
    );
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" && !open) {
            e.preventDefault();
            e.stopPropagation();
            setOpen(true);
          }
        }}
        disabled={busy !== null}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={busy ? `Creating ${describe(busy)}` : `${label} briefing`}
        className="inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-full border border-line px-3 text-sm font-medium text-ink transition-[background-color,transform] hover:bg-subtle active:scale-95 disabled:cursor-progress disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:px-4"
      >
        {busy ? <Spinner size={16} /> : <Download size={16} />}
        <span className="hidden sm:inline">{busy ? "Creating…" : label}</span>
        <ChevronDown
          size={14}
          className={`hidden text-muted transition-transform duration-200 sm:block ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label={`${label} format`}
          onKeyDown={onMenuKeyDown}
          className={`absolute top-full ${edge} z-30 mt-2 w-76 max-w-[calc(100vw-2rem)] rounded-xl border border-line bg-paper p-1.5 shadow-[0_12px_32px_-12px_rgb(17_17_17/0.25)] motion-safe:animate-pop`}
        >
          <div role="group" aria-labelledby={`${menuId}-pdf`}>
            <p id={`${menuId}-pdf`} className="px-3 pt-2 pb-1 text-xs font-medium text-muted">
              PDF
            </p>
            {PDF_OPTIONS.map(item)}
          </div>
          <div role="separator" className="mx-3 my-1.5 border-t border-line" />
          <div role="group" aria-labelledby={`${menuId}-pptx`}>
            <p id={`${menuId}-pptx`} className="sr-only">
              PowerPoint
            </p>
            {item(PPTX_OPTION)}
          </div>
        </div>
      )}

      <p aria-live="polite" className="sr-only">
        {busy ? `Creating ${describe(busy)}…` : ""}
      </p>
      {error && (
        <p
          role="alert"
          className={`absolute top-full ${edge} z-30 mt-2 w-64 rounded-lg border border-accent/30 bg-accent-soft px-3 py-2 text-sm text-accent`}
        >
          {error}
        </p>
      )}
    </div>
  );
}
