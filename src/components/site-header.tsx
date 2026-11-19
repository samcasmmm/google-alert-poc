import type { ReactNode } from "react";
import { AppNav } from "./app-nav";

/**
 * The one top bar for every page: same width, padding and height everywhere, so the
 * logo and links never shift between pages. Page-specific controls go in `actions`.
 */
export function SiteHeader({ actions }: { actions?: ReactNode }) {
  return (
    <header className="shrink-0 border-b border-line bg-paper">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-8">
        <AppNav />
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}
