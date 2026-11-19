import type { LayoutSet } from "../types";
import { BriefingEndSlide } from "./end-slide";
import { BriefingStorySlide } from "./story-slide";
import { BriefingTitleSlide } from "./title-slide";

export const briefing: LayoutSet = { Title: BriefingTitleSlide, Story: BriefingStorySlide, End: BriefingEndSlide };
