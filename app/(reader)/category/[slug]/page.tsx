"use client";
import { notFound, useParams } from "next/navigation";
import { useGetCategoryFeedQuery, useGetCategoriesQuery } from "@/store/api/newsApi";
import { CategoryChips } from "@/components/feed/CategoryChips";
import { ArticleGrid } from "@/components/article/ArticleList";

export default function CategoryPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug as string;
  const { data: cats } = useGetCategoriesQuery();
  const category = cats?.categories.find((c) => c.slug === slug);
  const { data, isLoading, isError } = useGetCategoryFeedQuery({ slug });

  if (cats && !category) return notFound();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-wider text-neutral-500">
          {category?.emoji} Category
        </p>
        <h1 className="text-2xl font-bold md:text-3xl">{category?.name ?? slug}</h1>
        <p className="text-sm text-neutral-500">
          {data?.total ?? "—"} stories
        </p>
      </div>
      <CategoryChips activeSlug={slug} />
      {isError ? (
        <p className="text-sm text-red-500">Failed to load category.</p>
      ) : (
        <ArticleGrid articles={data?.articles} loading={isLoading} />
      )}
    </div>
  );
}
