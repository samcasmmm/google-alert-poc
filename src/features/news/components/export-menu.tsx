"use client";

import { useEffect, useId, useRef, useState, type ComponentType, type KeyboardEvent } from "react";
import { ChevronDown, Download, FileText, Presentation, Spinner } from "@/components/icons";
import { exportPdf } from "../export/pdf/export-pdf";
import { exportPptx } from "../export/pptx/export-pptx";
import type { DailyNews } from "../schema";

type Format = "pdf" | "pptx";

const OPTIONS: { format: Format; label: string; hint: string; Icon: ComponentType<{ size?: number }> }[] = [
  { format: "pdf", label: "PDF", hint: "16:9 pages, ready to share", Icon: FileText },
  { format: "pptx", label: "PowerPoint", hint: "Editable .pptx with speaker notes", Icon: Presentation },
];

export function ExportMenu({ news, company }: { news: DailyNews; company: string }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<Format | null>(null);
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

  async function run(format: Format) {
    close();
    setError(null);
    setBusy(format);
    try {
      await (format === "pdf" ? exportPdf(news, company) : exportPptx(news, company));
    } catch (e) {
      console.error("[export]", e);
      setError(`Couldn’t create the ${format === "pdf" ? "PDF" : "PowerPoint"}. Try again.`);
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
        aria-label={busy ? "Exporting briefing" : "Export briefing"}
        className="inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-full border border-line px-3 text-sm font-medium text-ink transition-[background-color,transform] hover:bg-subtle active:scale-95 disabled:cursor-progress disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:px-4"
      >
        {busy ? <Spinner size={16} /> : <Download size={16} />}
        <span className="hidden sm:inline">{busy ? "Exporting…" : "Export"}</span>
        <ChevronDown
          size={14}
          className={`hidden text-muted transition-transform duration-200 sm:block ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label="Export format"
          onKeyDown={onMenuKeyDown}
          className="absolute top-full right-0 z-30 mt-2 w-72 origin-top-right rounded-xl border border-line bg-paper p-1.5 shadow-[0_12px_32px_-12px_rgb(17_17_17/0.25)] motion-safe:animate-pop"
        >
          <p className="px-3 pt-2 pb-1.5 font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
            Export {news.items.length} {news.items.length === 1 ? "story" : "stories"}
          </p>
          {OPTIONS.map(({ format, label, hint, Icon }, i) => (
            <button
              key={format}
              ref={(el) => {
                itemsRef.current[i] = el;
              }}
              type="button"
              role="menuitem"
              tabIndex={-1}
              onClick={() => void run(format)}
              className="flex min-h-14 w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors outline-none hover:bg-subtle focus-visible:bg-subtle focus-visible:ring-2 focus-visible:ring-accent/40"
            >
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
                <Icon size={18} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium text-ink">{label}</span>
                <span className="block text-xs leading-snug text-muted">{hint}</span>
              </span>
            </button>
          ))}
        </div>
      )}

      <p aria-live="polite" className="sr-only">
        {busy === "pdf" ? "Creating PDF…" : busy === "pptx" ? "Creating PowerPoint…" : ""}
      </p>
      {error && (
        <p
          role="alert"
          className="absolute top-full right-0 z-30 mt-2 w-64 rounded-lg border border-accent/30 bg-accent-soft px-3 py-2 text-sm text-accent"
        >
          {error}
        </p>
      )}
    </div>
  );
}
