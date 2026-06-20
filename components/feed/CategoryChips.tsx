"use client";
import Link from "next/link";
import { useGetCategoriesQuery } from "@/store/api/newsApi";
import { Skeleton } from "@/components/ui/Skeleton";

export function CategoryChips({ activeSlug }: { activeSlug?: string }) {
  const { data, isLoading } = useGetCategoriesQuery();
  if (isLoading) {
    return (
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-full" />
        ))}
      </div>
    );
  }
  return (
    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 no-scrollbar">
      <Link
        href="/home"
        className={`whitespace-nowrap rounded-full border px-3 py-1 text-sm transition-colors ${
          !activeSlug ? "bg-brand-600 text-white border-brand-600" : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
        }`}
      >
        For you
      </Link>
      {data?.categories.map((c) => {
        const active = activeSlug === c.slug;
        return (
          <Link
            key={c.slug}
            href={`/category/${c.slug}`}
            className={`whitespace-nowrap rounded-full border px-3 py-1 text-sm transition-colors ${
              active ? "bg-brand-600 text-white border-brand-600" : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
            }`}
          >
            <span className="mr-1" aria-hidden>{c.emoji}</span>
            {c.name}
          </Link>
        );
      })}
    </div>
  );
}
