"use client";

import { use } from "react";
import { Restart } from "@/components/icons";
import { primaryButton } from "@/components/ui";
import { DeckContext } from "./deck-context";

/** "Start over" for the end slide: jumps back to the first slide. */
export function RestartButton() {
  const restart = use(DeckContext);
  if (!restart) return null;
  return (
    <button type="button" onClick={restart} className={`${primaryButton} gap-2`}>
      <Restart size={16} />
      Start over
    </button>
  );
}
