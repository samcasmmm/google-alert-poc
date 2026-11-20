import type { ReactNode } from "react";

/** A titled group of settings. Sections are separated by a rule; the id is the in-page nav target. */
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
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="scroll-mt-8 border-t border-line pt-10 first:border-t-0 first:pt-0"
    >
      <h2 id={`${id}-title`} className="font-serif text-2xl font-medium tracking-tight sm:text-3xl">
        {title}
      </h2>
      {description && <div className="mt-2 max-w-prose leading-relaxed text-muted">{description}</div>}
      <div className="mt-7">{children}</div>
    </section>
  );
}
