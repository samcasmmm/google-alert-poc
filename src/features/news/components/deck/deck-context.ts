import { createContext } from "react";

/** Lets slides (e.g. the end slide's "Start over") control the deck they are in. */
export const DeckContext = createContext<(() => void) | null>(null);
