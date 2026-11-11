// Shared Tailwind class strings for the light theme (no UI library).

const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export const inputClass =
  "w-full min-h-11 rounded-lg border border-line bg-paper px-3 py-2 text-ink placeholder:text-muted/70 transition-colors focus:border-ink focus:outline-none";

export const primaryButton = `inline-flex min-h-11 items-center justify-center rounded-lg bg-ink px-5 text-sm font-medium text-paper transition-colors hover:bg-ink/85 disabled:opacity-40 ${focus}`;

export const secondaryButton = `inline-flex min-h-11 items-center justify-center rounded-lg border border-line px-4 text-sm font-medium text-ink transition-colors hover:bg-subtle disabled:opacity-40 ${focus}`;

export const quietButton = `inline-flex min-h-11 items-center justify-center rounded-lg px-3 text-sm text-muted transition-colors hover:bg-subtle hover:text-ink ${focus}`;
