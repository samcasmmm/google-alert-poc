import type { LayoutSet } from "../types";
import { PosterEndSlide } from "./end-slide";
import { PosterStorySlide } from "./story-slide";
import { PosterTitleSlide } from "./title-slide";

export const poster: LayoutSet = { Title: PosterTitleSlide, Story: PosterStorySlide, End: PosterEndSlide };
