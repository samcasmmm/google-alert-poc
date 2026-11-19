import { ArrowUpRight } from "@/components/icons";
import type { NewsItem } from "../../schema";

export function ArticleLink({ item }: { item: NewsItem }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex min-h-11 items-center text-sm text-muted underline decoration-line underline-offset-4 transition-colors hover:text-ink hover:decoration-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      Read at {item.source || "source"}
      <ArrowUpRight size={14} className="ml-1" />
    </a>
  );
}
