"use client";
import Link from "next/link";
import { useMemo } from "react";
import { Eye, Flame } from "lucide-react";
import { allArticles } from "@/lib/mockBaseQuery";
import { formatNumber } from "@/lib/format";

export function MostRead() {
  const top = useMemo(
    () => [...allArticles()].sort((a, b) => b.views - a.views).slice(0, 5),
    []
  );

  return (
    <section
      aria-label="Most read"
      className="rounded-2xl border bg-[rgb(var(--card))] p-4"
    >
      <header className="mb-3 flex items-center gap-2">
        <Flame className="h-4 w-4 text-rose-500" />
        <h2 className="text-sm font-semibold uppercase tracking-wide">
          Most read
        </h2>
      </header>
      <ol className="space-y-3">
        {top.map((a, i) => (
          <li key={a.id} className="flex gap-3">
            <span
              aria-hidden
              className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-700 dark:bg-brand-900/40 dark:text-brand-200"
            >
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <Link
                href={`/article/${a.id}`}
                className="line-clamp-2 text-sm font-medium leading-snug hover:text-brand-600"
              >
                {a.title}
              </Link>
              <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-neutral-500">
                <Eye className="h-3 w-3" />
                {formatNumber(a.views)} views
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
