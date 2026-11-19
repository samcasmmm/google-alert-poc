"use client";

import { useEffect, useRef, useState } from "react";

export const SETTINGS_SECTIONS = [
  { id: "brief", label: "Company brief" },
  { id: "sources", label: "News sources" },
  { id: "ai", label: "AI summaries" },
  { id: "briefing", label: "Briefing" },
  { id: "backup", label: "Backup" },
] as const;

/** In-page links to each settings section; marks the one currently in view. Desktop only. */
export function SettingsNav() {
  const [active, setActive] = useState<string>(SETTINGS_SECTIONS[0].id);
  /** After a nav click, keep the clicked item active while the jump's scroll settles. */
  const clickedUntil = useRef(0);

  // Active = the last section whose top has passed 35% of the viewport. Computed from scroll
  // position (not an observer) so it works for sections that render after the config loads.
  useEffect(() => {
    let frame = 0;
    function update() {
      frame = 0;
      if (performance.now() < clickedUntil.current) return;
      const line = window.innerHeight * 0.35;
      let current: string = SETTINGS_SECTIONS[0].id;
      for (const { id } of SETTINGS_SECTIONS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      setActive(atBottom ? SETTINGS_SECTIONS[SETTINGS_SECTIONS.length - 1].id : current);
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <nav aria-label="Settings sections" className="sticky top-8 hidden lg:block">
      <ul className="space-y-0.5 border-l border-line">
        {SETTINGS_SECTIONS.map(({ id, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              onClick={() => {
                clickedUntil.current = performance.now() + 600;
                setActive(id);
              }}
              aria-current={active === id ? "location" : undefined}
              className={`-ml-px flex min-h-10 items-center border-l-2 pl-4 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                active === id ? "border-accent font-medium text-ink" : "border-transparent text-muted hover:text-ink"
              }`}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
