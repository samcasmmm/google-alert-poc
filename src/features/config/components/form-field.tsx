import type { ReactNode } from "react";

/** Label, hint and control, with the label tied to the control by id and an error under it. */
export function FormField({
  label,
  hint,
  htmlFor,
  error,
  errorId,
  children,
}: {
  label: string;
  hint?: ReactNode;
  htmlFor: string;
  error?: string;
  /** id of the error text, for the control's aria-describedby */
  errorId?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </label>
      {hint && <p className="mt-0.5 text-sm text-muted">{hint}</p>}
      <div className="mt-2">{children}</div>
      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-accent">
          {error}
        </p>
      )}
    </div>
  );
}
