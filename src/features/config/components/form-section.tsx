import type { ReactNode } from "react";

/** A titled group of settings with an optional description. */
export function FormSection({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-8">
      <h2 id={`${id}-title`} className="font-mono text-xs tracking-[0.2em] text-accent uppercase">
        {title}
      </h2>
      {description && <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted">{description}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}
