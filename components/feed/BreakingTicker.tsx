"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Zap } from "lucide-react";
import { allArticles } from "@/lib/mockBaseQuery";

export function BreakingTicker() {
  const headlines = useMemo(() => {
    return [...allArticles()]
      .sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      )
      .slice(0, 5);
  }, []);

  const [i, setI] = useState(0);
  useEffect(() => {
    if (headlines.length < 2) return;
    const id = setInterval(
      () => setI((n) => (n + 1) % headlines.length),
      5000
    );
    return () => clearInterval(id);
  }, [headlines.length]);

  const current = headlines[i];
  if (!current) return null;

  return (
    <div className="border-b bg-rose-600 text-white">
      <div className="mx-auto flex h-9 max-w-7xl items-center gap-3 px-4 text-xs">
        <span className="inline-flex flex-none items-center gap-1.5 rounded-sm bg-white/15 px-1.5 py-0.5 font-semibold uppercase tracking-wide">
          <Zap className="h-3 w-3" />
          Breaking
        </span>
        <Link
          href={`/article/${current.id}`}
          key={current.id}
          className="ticker-fade min-w-0 flex-1 truncate font-medium hover:underline"
        >
          {current.title}
        </Link>
        <div className="hidden items-center gap-1 sm:flex" aria-hidden>
          {headlines.map((_, idx) => (
            <span
              key={idx}
              className={`h-1 w-4 rounded-full transition-colors ${
                idx === i ? "bg-white" : "bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
