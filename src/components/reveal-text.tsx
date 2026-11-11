import type { CSSProperties } from "react";

/**
 * Word-by-word reveal with a restrained stagger. Screen readers get the unsplit
 * text; the split words are decorative (aria-hidden). Under reduced motion the
 * words render in their final state immediately.
 */
export function RevealText({
  text,
  delay = 0,
  stagger = 35,
  maxStagger = 600,
}: {
  text: string;
  /** ms before the first word */
  delay?: number;
  /** ms between words */
  stagger?: number;
  /** cap so long headlines don't drag */
  maxStagger?: number;
}) {
  const words = text.split(/\s+/).filter(Boolean);
  const step = words.length > 1 ? Math.min(stagger, maxStagger / (words.length - 1)) : 0;
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((word, i) => (
          <span key={i}>
            <span
              className="inline-block motion-safe:animate-word-in"
              style={{ animationDelay: `${Math.round(delay + i * step)}ms` } as CSSProperties}
            >
              {word}
            </span>
            {i < words.length - 1 && " "}
          </span>
        ))}
      </span>
    </>
  );
}

/** Delay helper for blocks that follow a reveal. */
export const after = (ms: number): CSSProperties => ({ animationDelay: `${ms}ms` });
