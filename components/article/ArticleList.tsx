import type { Article } from "@/types";
import { ArticleCard } from "./ArticleCard";
import { ArticleCardSkeleton } from "@/components/ui/Skeleton";

export function ArticleGrid({
  articles,
  loading,
  variant = "compact",
  skeletonCount = 6
}: {
  articles?: Article[];
  loading?: boolean;
  variant?: "compact" | "list";
  skeletonCount?: number;
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <ArticleCardSkeleton key={i} />
        ))}
      </div>
    );
  }
  if (!articles?.length) return null;
  if (variant === "list") {
    return (
      <div className="flex flex-col gap-3">
        {articles.map((a) => (
          <ArticleCard key={a.id} article={a} variant="list" />
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((a) => (
        <ArticleCard key={a.id} article={a} />
      ))}
    </div>
  );
}
