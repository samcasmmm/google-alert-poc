import type { ReactNode } from "react";
import { AppNav } from "./app-nav";

export function PageShell({ title, intro, children }: { title: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <div className="min-h-dvh">
      <header className="border-b border-line">
        <div className="mx-auto w-full max-w-3xl px-4 py-2 sm:px-6">
          <AppNav />
        </div>
      </header>
      <main id="main" className="mx-auto w-full max-w-3xl px-4 pt-10 pb-20 sm:px-6 sm:pt-14">
        <h1 className="font-serif text-4xl font-medium tracking-tight sm:text-5xl motion-safe:animate-rise">{title}</h1>
        {intro && <p className="mt-3 max-w-prose text-muted">{intro}</p>}
        <div className="mt-10">{children}</div>
      </main>
    </div>
  );
}
