import type { Article } from "@/types";

export const fakeSummary = async (article: Article, kind: "short" | "bullets" | "takeaways") => {
  await new Promise((r) => setTimeout(r, 600));
  switch (kind) {
    case "short":
      return article.summary;
    case "bullets":
      return article.bulletSummary;
    case "takeaways":
      return article.keyTakeaways;
  }
};
