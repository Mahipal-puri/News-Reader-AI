"use client";
import { useGetFeedQuery } from "@/store/api/newsApi";
import { useAppSelector } from "@/store";
import { CategoryChips } from "@/components/feed/CategoryChips";
import { TrendingRail } from "@/components/feed/TrendingRail";
import { MostRead } from "@/components/feed/MostRead";
import { ArticleCard } from "@/components/article/ArticleCard";
import { ArticleGrid } from "@/components/article/ArticleList";

export default function HomePage() {
  const topics = useAppSelector((s) => s.preferences.followedTopics);
  const role = useAppSelector((s) => s.auth.role);
  const { data, isLoading } = useGetFeedQuery({
    topics: role === "guest" ? [] : topics,
    page: 1,
    pageSize: 13
  });

  const articles = data?.articles ?? [];
  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">
          {role === "guest" ? "Top stories today" : "Your personalized feed"}
        </h1>
        <p className="text-sm text-neutral-500">
          {role === "guest"
            ? "Sign in to personalize what you see."
            : `Tuned to: ${topics.join(", ")}`}
        </p>
      </div>
      <CategoryChips />
      <div className="grid gap-6 lg:grid-cols-[1fr,300px]">
        <div className="space-y-6">
          {isLoading || !featured ? (
            <div className="aspect-[16/9] w-full rounded-2xl skeleton" />
          ) : (
            <ArticleCard article={featured} variant="featured" />
          )}
          <h2 className="text-lg font-semibold">More to read</h2>
          <ArticleGrid articles={rest} loading={isLoading} />
        </div>
        <aside className="space-y-6">
          <TrendingRail />
          <MostRead />
        </aside>
      </div>
    </div>
  );
}
