"use client";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import {
  Bookmark,
  BookmarkCheck,
  Clock,
  Crown,
  Heart,
  Lock
} from "lucide-react";
import { useGetArticleQuery } from "@/store/api/newsApi";
import { useAppDispatch, useAppSelector } from "@/store";
import { toggleBookmark, toggleLike } from "@/store/slices/bookmarksSlice";
import { setRole } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/Button";
import { LiveBadge } from "@/components/ui/LiveBadge";
import { AIPanel } from "@/components/ai/AIPanel";
import { SpeakInline } from "@/components/ai/SpeakInline";
import { CommentThread } from "@/components/article/CommentThread";
import { ArticleGrid } from "@/components/article/ArticleList";
import { AIChips } from "@/components/article/AIChips";
import { ReadingProgress } from "@/components/article/ReadingProgress";
import { ShareMenu } from "@/components/article/ShareMenu";
import { getPublisherById } from "@/lib/mockBaseQuery";
import { formatNumber, timeAgo } from "@/lib/format";
import { useToast } from "@/components/ui/Toast";

export default function ArticlePage() {
  const params = useParams<{ id: string }>();
  const id = params?.id as string;
  const { data, isLoading, isError } = useGetArticleQuery(id);
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const bookmarked = useAppSelector((s) => s.bookmarks.ids.includes(id));
  const liked = useAppSelector((s) => s.bookmarks.likes.includes(id));
  const role = useAppSelector((s) => s.auth.role);

  if (isError) return notFound();
  if (isLoading || !data) {
    return (
      <div className="space-y-4">
        <div className="h-72 w-full rounded-2xl skeleton" />
        <div className="h-8 w-3/4 skeleton" />
        <div className="h-4 w-1/2 skeleton" />
      </div>
    );
  }

  const { article, related } = data;
  const publisher = getPublisherById(article.publisherId);
  const locked = !!article.premium && role !== "premium";
  const paragraphs = article.body.split("\n\n");
  const visibleParagraphs = locked ? paragraphs.slice(0, 2) : paragraphs;

  const upgrade = () => {
    dispatch(setRole("premium"));
    toast("Welcome to Premium ✨", "success");
  };

  return (
    <article className="space-y-6">
      <ReadingProgress />
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/category/${article.category}`}
            className="inline-flex rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700 dark:bg-brand-900/40 dark:text-brand-200"
          >
            {article.category}
          </Link>
          {article.isLive && <LiveBadge size="md" />}
          {article.premium && (
            <span className="inline-flex items-center gap-1 rounded-sm bg-amber-500 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-white">
              <Crown className="h-3 w-3" />
              Premium
            </span>
          )}
        </div>
        <h1
          className="text-balance font-bold leading-[1.1] tracking-tight"
          style={{ fontSize: "var(--fs-2xl)" }}
        >
          {article.title}
        </h1>
        <p
          className="text-pretty text-neutral-600 dark:text-neutral-400"
          style={{ fontSize: "var(--fs-lg)" }}
        >
          {article.summary}
        </p>
        <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-500">
          <span className="font-medium text-neutral-700 dark:text-neutral-300">
            {article.authorName}
          </span>
          <span>·</span>
          <span>{publisher?.name}</span>
          <span>·</span>
          <span>{timeAgo(article.publishedAt)}</span>
          <span>·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" /> {article.readingMinutes} min read
          </span>
          <span>·</span>
          <AIChips sentiment={article.sentiment} biasScore={article.biasScore} />
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          <Button
            size="sm"
            variant={bookmarked ? "primary" : "outline"}
            onClick={() => dispatch(toggleBookmark(id))}
          >
            {bookmarked ? (
              <BookmarkCheck className="h-4 w-4" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
            {bookmarked ? "Saved" : "Save"}
          </Button>
          <Button
            size="sm"
            variant={liked ? "primary" : "outline"}
            onClick={() => dispatch(toggleLike(id))}
          >
            <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
            {formatNumber(article.likes + (liked ? 1 : 0))}
          </Button>
          <ShareMenu title={article.title} />
        </div>
      </div>

      <img
        src={article.imageUrl}
        alt=""
        className="aspect-[16/9] w-full rounded-2xl object-cover shadow-[var(--shadow-2)]"
      />

      <div className="grid gap-6 lg:grid-cols-[1fr,360px]">
        <div className="min-w-0">
          {article.isLive && article.liveUpdates && article.liveUpdates.length > 0 && (
            <section
              aria-label="Live updates"
              className="mb-6 rounded-2xl border border-rose-200 bg-rose-50/50 p-4 dark:border-rose-900/40 dark:bg-rose-950/20"
            >
              <header className="mb-3 flex items-center gap-2">
                <LiveBadge size="md" />
                <h2 className="text-sm font-semibold">Live updates</h2>
                <span className="ml-auto text-xs text-neutral-500">
                  Last updated {timeAgo(article.liveUpdates[0].time)}
                </span>
              </header>
              <ol className="space-y-3">
                {article.liveUpdates.map((u, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <time
                      dateTime={u.time}
                      className="w-12 flex-none pt-0.5 text-xs font-mono text-rose-600 dark:text-rose-400"
                    >
                      {new Date(u.time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </time>
                    <p className="flex-1 text-neutral-800 dark:text-neutral-200">
                      {u.text}
                    </p>
                  </li>
                ))}
              </ol>
            </section>
          )}

          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Article
            </h2>
            <SpeakInline
              text={`${article.title}. ${article.summary} ${visibleParagraphs.join(" ")}`}
              label="Listen"
            />
          </div>
          <div className="prose-news relative max-w-none text-neutral-800 dark:text-neutral-200">
            {visibleParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            {locked && (
              <>
                <div className="pointer-events-none absolute inset-x-0 -top-12 h-32 bg-gradient-to-b from-transparent to-[rgb(var(--card))]" />
                <div className="not-prose mt-2 rounded-2xl border border-amber-300 bg-gradient-to-br from-amber-50 to-amber-100 p-6 text-center dark:border-amber-700/50 dark:from-amber-900/30 dark:to-amber-900/10">
                  <Lock className="mx-auto h-8 w-8 text-amber-600 dark:text-amber-300" />
                  <h3 className="mt-3 text-lg font-bold">
                    This is a Premium story
                  </h3>
                  <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
                    {paragraphs.length - 2} more paragraphs, plus full AI
                    analysis, are reserved for Premium readers.
                  </p>
                  <Button className="mt-4" onClick={upgrade}>
                    <Crown className="h-4 w-4" />
                    Upgrade to Premium
                  </Button>
                  <p className="mt-2 text-[11px] text-neutral-500">
                    Demo only — flips your role in Redux, no payment.
                  </p>
                </div>
              </>
            )}
          </div>
          {!locked && (
            <div className="mt-4 flex flex-wrap gap-2">
              {article.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border bg-[rgb(var(--card))] px-2.5 py-1 text-xs"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>
        <aside className="lg:sticky lg:top-20 lg:h-fit">
          <AIPanel article={article} />
        </aside>
      </div>

      <CommentThread articleId={article.id} />

      {related.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-semibold">More from {article.category}</h2>
          <ArticleGrid articles={related} />
        </section>
      )}
    </article>
  );
}
