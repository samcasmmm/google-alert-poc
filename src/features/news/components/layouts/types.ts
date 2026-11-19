import type { ReactNode } from "react";
import type { NewsItem } from "../../schema";

// Presentation is pure layout code: Groq only supplies the summary text.

export interface TitleSlideProps {
  date: string;
  /** story count, status, refresh control */
  status: ReactNode;
}
export interface StorySlideProps {
  item: NewsItem;
  position: number;
  total: number;
}
export interface EndSlideProps {
  links: ReactNode;
}

export interface LayoutSet {
  Title: (props: TitleSlideProps) => ReactNode;
  Story: (props: StorySlideProps) => ReactNode;
  End: (props: EndSlideProps) => ReactNode;
}
