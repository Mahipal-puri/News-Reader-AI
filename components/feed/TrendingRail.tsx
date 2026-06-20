"use client";
import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { useGetTrendingQuery } from "@/store/api/newsApi";

export function TrendingRail() {
  const { data } = useGetTrendingQuery();
  if (!data?.trending?.length) return null;
  return (
    <div className="rounded-2xl border bg-[rgb(var(--card))] p-4">
      <div className="mb-3 flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-brand-600" />
        <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
          Trending now
        </h3>
      </div>
      <ol className="space-y-3">
        {data.trending.map((t, i) => (
          <li key={t.topic} className="flex gap-3">
            <span className="text-lg font-bold text-neutral-300 dark:text-neutral-700">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="flex-1">
              <Link
                href={`/category/${t.category}`}
                className="text-sm font-medium hover:text-brand-600"
              >
                {t.topic}
              </Link>
              <div className="text-xs text-neutral-500 capitalize">
                {t.category} · {t.articleIds.length} stories
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
