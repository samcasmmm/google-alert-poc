import type { SlideLayout } from "@/features/config/schema";
import { briefing } from "./briefing";
import { editorial } from "./editorial";
import { poster } from "./poster";
import type { LayoutSet } from "./types";

export type { EndSlideProps, LayoutSet, StorySlideProps, TitleSlideProps } from "./types";

/** Slide layouts selectable in Settings → Presentation. */
export const SLIDE_LAYOUTS: Record<SlideLayout, LayoutSet> = { editorial, poster, briefing };
