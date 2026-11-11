"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/standup", label: "Today" },
  { href: "/history", label: "History" },
  { href: "/settings", label: "Settings" },
] as const;

/** Same placement and order on every page; the current page is marked. */
export function AppNav() {
  const pathname = usePathname();
  return (
    <div className="flex items-center gap-2 sm:gap-6">
      <Link href="/standup" className="font-serif text-lg font-semibold tracking-tight whitespace-nowrap sm:text-xl">
        Standup News
      </Link>
      <nav aria-label="Main" className="flex text-sm">
        {ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`relative inline-flex min-h-11 items-center px-2 transition-colors sm:px-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                active ? "font-medium text-ink" : "text-muted hover:text-ink"
              }`}
            >
              {item.label}
              {active && <span aria-hidden className="absolute inset-x-2 bottom-2 h-0.5 bg-accent sm:inset-x-3" />}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
