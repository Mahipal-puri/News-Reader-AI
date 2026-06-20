"use client";
import { useState } from "react";
import { Bookmark, FolderPlus, Plus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  createCollection,
  addToCollection,
  removeFromCollection
} from "@/store/slices/bookmarksSlice";
import { ArticleGrid } from "@/components/article/ArticleList";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { allArticles } from "@/lib/mockBaseQuery";
import { cn } from "@/lib/cn";

export default function BookmarksPage() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const ids = useAppSelector((s) => s.bookmarks.ids);
  const collections = useAppSelector((s) => s.bookmarks.collections);
  const [active, setActive] = useState<string>("All");
  const [newCollectionName, setNewCollectionName] = useState("");

  const all = allArticles();
  const lookup = new Map(all.map((a) => [a.id, a]));

  const visibleIds =
    active === "All" ? ids : collections[active] ?? [];
  const visibleArticles = visibleIds
    .map((id) => lookup.get(id))
    .filter((a): a is NonNullable<typeof a> => !!a);

  const collectionNames = ["All", ...Object.keys(collections)];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Bookmarks</h1>
          <p className="text-sm text-neutral-500">
            {ids.length} saved · {Object.keys(collections).length} collections
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => toast("Offline reading would cache via Service Worker", "info")}
        >
          Enable offline reading
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-[220px,1fr]">
        <aside className="space-y-2">
          <p className="px-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Collections
          </p>
          {collectionNames.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={cn(
                "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                active === c
                  ? "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-200"
                  : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
              )}
            >
              <span>{c}</span>
              <span className="text-xs text-neutral-400">
                {c === "All" ? ids.length : collections[c]?.length ?? 0}
              </span>
            </button>
          ))}
          <div className="mt-2 flex gap-1.5">
            <Input
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              placeholder="New collection"
              className="h-9"
            />
            <Button
              size="icon"
              variant="outline"
              onClick={() => {
                const n = newCollectionName.trim();
                if (!n) return;
                dispatch(createCollection(n));
                setNewCollectionName("");
                setActive(n);
              }}
              aria-label="Create"
            >
              <FolderPlus className="h-4 w-4" />
            </Button>
          </div>
        </aside>

        <div>
          {visibleArticles.length === 0 ? (
            <EmptyState
              title={
                active === "All"
                  ? "You haven't saved any articles yet"
                  : `'${active}' is empty`
              }
              description="Bookmark articles to read later — they'll show up here."
              icon={<Bookmark className="h-8 w-8" />}
            />
          ) : (
            <>
              {active !== "All" && (
                <div className="mb-3 flex items-center gap-2 text-xs text-neutral-500">
                  <span>{active} · {visibleArticles.length} items</span>
                  <button
                    onClick={() =>
                      visibleIds.forEach((id) =>
                        dispatch(removeFromCollection({ collection: active, articleId: id }))
                      )
                    }
                    className="text-red-500 hover:underline"
                  >
                    Clear collection
                  </button>
                </div>
              )}
              <ArticleGrid articles={visibleArticles} />
              {active !== "All" && ids.length > 0 && (
                <div className="mt-6 rounded-2xl border p-4">
                  <p className="mb-2 text-sm font-semibold">
                    Add to '{active}' from your saved
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {ids
                      .filter((id) => !(collections[active] ?? []).includes(id))
                      .slice(0, 10)
                      .map((id) => {
                        const a = lookup.get(id);
                        if (!a) return null;
                        return (
                          <button
                            key={id}
                            onClick={() =>
                              dispatch(addToCollection({ collection: active, articleId: id }))
                            }
                            className="inline-flex items-center gap-1 rounded-full border bg-[rgb(var(--card))] px-2.5 py-1 text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800"
                          >
                            <Plus className="h-3 w-3" />
                            {a.title.slice(0, 40)}…
                          </button>
                        );
                      })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
