import type { ReactNode } from "react";
import { SiteHeader } from "./site-header";

export function PageShell({
  title,
  intro,
  wide = false,
  children,
}: {
  title: string;
  intro?: ReactNode;
  /** Wider column for list pages (History); forms stay narrow for line length. */
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main id="main" className={`mx-auto w-full px-4 pt-10 pb-20 sm:px-8 sm:pt-14 ${wide ? "max-w-5xl" : "max-w-3xl"}`}>
        <h1 className="font-serif text-4xl font-medium tracking-tight sm:text-5xl motion-safe:animate-rise">{title}</h1>
        {intro && <p className="mt-3 max-w-prose text-muted">{intro}</p>}
        <div className="mt-10">{children}</div>
      </main>
    </div>
  );
}
