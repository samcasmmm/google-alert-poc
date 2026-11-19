import type { LayoutSet } from "../types";
import { EditorialEndSlide } from "./end-slide";
import { EditorialStorySlide } from "./story-slide";
import { EditorialTitleSlide } from "./title-slide";

export const editorial: LayoutSet = { Title: EditorialTitleSlide, Story: EditorialStorySlide, End: EditorialEndSlide };
