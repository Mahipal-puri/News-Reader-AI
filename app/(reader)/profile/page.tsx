"use client";
import Link from "next/link";
import { Bookmark, Heart, Settings as SettingsIcon } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  useGetCategoriesQuery,
  useGetPublishersQuery
} from "@/store/api/newsApi";
import {
  toggleTopic,
  togglePublisher
} from "@/store/slices/preferencesSlice";
import { Button } from "@/components/ui/Button";
import { RoleBadge } from "@/components/ui/RoleBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { allArticles } from "@/lib/mockBaseQuery";
import { ArticleGrid } from "@/components/article/ArticleList";
import { cn } from "@/lib/cn";

export default function ProfilePage() {
  const user = useAppSelector((s) => s.auth.user);
  const role = useAppSelector((s) => s.auth.role);
  const topics = useAppSelector((s) => s.preferences.followedTopics);
  const publishers = useAppSelector((s) => s.preferences.followedPublishers);
  const likes = useAppSelector((s) => s.bookmarks.likes);
  const bookmarks = useAppSelector((s) => s.bookmarks.ids);
  const dispatch = useAppDispatch();
  const { data: cats } = useGetCategoriesQuery();
  const { data: pubs } = useGetPublishersQuery();

  if (!user) {
    return (
      <EmptyState
        title="Sign in to view your profile"
        description="Personalize your feed, follow topics, save articles."
        action={
          <Link href="/login">
            <Button>Sign in</Button>
          </Link>
        }
      />
    );
  }

  const all = allArticles();
  const lookup = new Map(all.map((a) => [a.id, a]));
  const likedArticles = likes
    .map((id) => lookup.get(id))
    .filter((a): a is NonNullable<typeof a> => !!a)
    .slice(0, 6);

  return (
    <div className="space-y-8">
      <header className="flex flex-col items-start gap-4 rounded-2xl border bg-[rgb(var(--card))] p-5 sm:flex-row sm:items-center">
        <img
          src={user.avatarUrl}
          alt=""
          className="h-20 w-20 rounded-full ring-4 ring-brand-100 dark:ring-brand-900/40"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <RoleBadge role={role} withIcon />
          </div>
          <p className="text-sm text-neutral-500">{user.email}</p>
          <div className="mt-2 flex gap-4 text-sm">
            <span className="inline-flex items-center gap-1">
              <Bookmark className="h-4 w-4" /> {bookmarks.length} saved
            </span>
            <span className="inline-flex items-center gap-1">
              <Heart className="h-4 w-4" /> {likes.length} liked
            </span>
          </div>
        </div>
        <Link href="/settings">
          <Button variant="outline">
            <SettingsIcon className="h-4 w-4" />
            Edit settings
          </Button>
        </Link>
      </header>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Topics you follow</h2>
        <div className="flex flex-wrap gap-2">
          {cats?.categories.map((c) => {
            const active = topics.includes(c.slug);
            return (
              <button
                key={c.slug}
                onClick={() => dispatch(toggleTopic(c.slug))}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm transition-colors",
                  active
                    ? "border-brand-600 bg-brand-600 text-white"
                    : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
                )}
              >
                <span className="mr-1" aria-hidden>{c.emoji}</span>
                {c.name}
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Publishers</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {pubs?.publishers.map((p) => {
            const following = publishers.includes(p.id);
            return (
              <div
                key={p.id}
                className="flex items-center gap-3 rounded-xl border bg-[rgb(var(--card))] p-3"
              >
                <img src={p.logoUrl} alt="" className="h-10 w-10 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-neutral-500">
                    {p.verified ? "Verified publisher" : "Independent"}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant={following ? "outline" : "primary"}
                  onClick={() => dispatch(togglePublisher(p.id))}
                >
                  {following ? "Following" : "Follow"}
                </Button>
              </div>
            );
          })}
        </div>
      </section>

      {likedArticles.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold">Recently liked</h2>
          <ArticleGrid articles={likedArticles} />
        </section>
      )}
    </div>
  );
}
