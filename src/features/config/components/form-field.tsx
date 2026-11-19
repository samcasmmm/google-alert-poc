import type { ReactNode } from "react";

/** Label + hint + control, with the label tied to the control by id. */
export function FormField({
  label,
  hint,
  htmlFor,
  required,
  children,
}: {
  label: string;
  hint?: ReactNode;
  htmlFor: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
        {required && (
          <span className="text-accent" aria-hidden>
            {" "}
            *
          </span>
        )}
      </label>
      {hint && <p className="mt-0.5 text-sm text-muted">{hint}</p>}
      <div className="mt-2">{children}</div>
    </div>
  );
}
