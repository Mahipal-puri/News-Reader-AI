"use client";
import Link from "next/link";
import { Bookmark, BookmarkCheck, Clock, Heart } from "lucide-react";
import type { Article } from "@/types";
import { cn } from "@/lib/cn";
import { timeAgo, formatNumber } from "@/lib/format";
import { useAppDispatch, useAppSelector } from "@/store";
import { toggleBookmark, toggleLike } from "@/store/slices/bookmarksSlice";
import { getPublisherById } from "@/lib/mockBaseQuery";
import { AIChips } from "./AIChips";
import { LiveBadge } from "@/components/ui/LiveBadge";
import { Crown } from "lucide-react";

type Variant = "compact" | "featured" | "list";

export function ArticleCard({
  article,
  variant = "compact"
}: {
  article: Article;
  variant?: Variant;
}) {
  const dispatch = useAppDispatch();
  const bookmarked = useAppSelector((s) =>
    s.bookmarks.ids.includes(article.id)
  );
  const liked = useAppSelector((s) => s.bookmarks.likes.includes(article.id));
  const publisher = getPublisherById(article.publisherId);

  const onBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(toggleBookmark(article.id));
  };
  const onLike = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(toggleLike(article.id));
  };

  if (variant === "featured") {
    return (
      <Link
        href={`/article/${article.id}`}
        className="lift-card group relative block overflow-hidden rounded-2xl border bg-[rgb(var(--card))]"
      >
        <div className="relative aspect-[16/9] overflow-hidden">
          <img
            src={article.imageUrl}
            alt=""
            loading="lazy"
            className="zoom-img h-full w-full object-cover"
          />
          <div className="absolute left-3 top-3 flex gap-1.5">
            {article.isLive && <LiveBadge size="md" />}
            {article.premium && (
              <span className="inline-flex items-center gap-1 rounded-sm bg-amber-500 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                <Crown className="h-3 w-3" />
                Premium
              </span>
            )}
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-5 text-white">
            <div className="mb-2 flex items-center gap-2 text-xs">
              <span className="rounded-full bg-white/15 px-2 py-0.5 backdrop-blur">
                {article.category}
              </span>
              <span>·</span>
              <span>{timeAgo(article.publishedAt)}</span>
            </div>
            <h2 className="text-balance text-2xl font-bold leading-tight">
              {article.title}
            </h2>
            <p className="mt-2 line-clamp-2 text-sm text-white/80">
              {article.summary}
            </p>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "list") {
    return (
      <Link
        href={`/article/${article.id}`}
        className="group flex gap-4 rounded-xl border bg-[rgb(var(--card))] p-3 hover:bg-neutral-50 dark:hover:bg-neutral-900"
      >
        <img
          src={article.imageUrl}
          alt=""
          className="h-24 w-32 flex-none rounded-lg object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2 text-[11px] text-neutral-500">
            {article.isLive && <LiveBadge />}
            {article.premium && (
              <span className="inline-flex items-center gap-1 rounded-sm bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">
                <Crown className="h-3 w-3" />
                Premium
              </span>
            )}
            <span className="font-medium">{publisher?.name ?? "Source"}</span>
            <span>·</span>
            <span>{timeAgo(article.publishedAt)}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" /> {article.readingMinutes}m
            </span>
          </div>
          <h3 className="line-clamp-2 font-semibold leading-snug group-hover:text-brand-600">
            {article.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-neutral-500">
            {article.summary}
          </p>
        </div>
        <div className="flex flex-col items-end justify-between">
          <button
            onClick={onBookmark}
            aria-label={bookmarked ? "Remove bookmark" : "Bookmark"}
            className="rounded-md p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            {bookmarked ? (
              <BookmarkCheck className="h-4 w-4 text-brand-600" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </button>
        </div>
      </Link>
    );
  }

  // compact
  return (
    <Link
      href={`/article/${article.id}`}
      className="lift-card group flex flex-col overflow-hidden rounded-2xl border bg-[rgb(var(--card))]"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={article.imageUrl}
          alt=""
          loading="lazy"
          className="zoom-img h-full w-full object-cover"
        />
        <button
          onClick={onBookmark}
          aria-label={bookmarked ? "Remove bookmark" : "Bookmark"}
          className="absolute right-2 top-2 rounded-full bg-black/40 p-2 text-white backdrop-blur hover:bg-black/60"
        >
          {bookmarked ? (
            <BookmarkCheck className="h-4 w-4" />
          ) : (
            <Bookmark className="h-4 w-4" />
          )}
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-neutral-500">
          {article.isLive && <LiveBadge />}
          {article.premium && (
            <span className="inline-flex items-center gap-1 rounded-sm bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">
              <Crown className="h-3 w-3" />
              Premium
            </span>
          )}
          <span className="font-medium">{publisher?.name ?? "Source"}</span>
          <span>·</span>
          <span>{timeAgo(article.publishedAt)}</span>
          <span>·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" /> {article.readingMinutes}m
          </span>
        </div>
        <h3 className="line-clamp-2 text-base font-semibold leading-snug group-hover:text-brand-600">
          {article.title}
        </h3>
        <p className="line-clamp-2 text-sm text-neutral-500">{article.summary}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <AIChips
            sentiment={article.sentiment}
            biasScore={article.biasScore}
          />
          <button
            onClick={onLike}
            className={cn(
              "inline-flex items-center gap-1 text-xs",
              liked ? "text-rose-600" : "text-neutral-500"
            )}
          >
            <Heart className={cn("h-3.5 w-3.5", liked && "fill-current")} />
            {formatNumber(article.likes + (liked ? 1 : 0))}
          </button>
        </div>
      </div>
    </Link>
  );
}
