"use client";
import { useMemo, useRef, useState } from "react";
import { Mic, Search as SearchIcon, X } from "lucide-react";
import {
  useGetCategoriesQuery,
  useGetPublishersQuery,
  useSearchArticlesQuery
} from "@/store/api/newsApi";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ArticleGrid } from "@/components/article/ArticleList";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import {
  speechRecognitionSupported,
  startRecognition
} from "@/lib/ai/voice";

const TRENDING_QUERIES = ["AI", "climate", "fusion", "ETF", "tennis", "fusion"];

export default function SearchPage() {
  const { data: cats } = useGetCategoriesQuery();
  const { data: pubs } = useGetPublishersQuery();
  const { toast } = useToast();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string>("");
  const [publisherId, setPublisherId] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [listening, setListening] = useState(false);
  const recogRef = useRef<any>(null);

  const args = useMemo(
    () => ({ q, category: category || undefined, publisherId: publisherId || undefined, dateFrom: dateFrom || undefined }),
    [q, category, publisherId, dateFrom]
  );
  const { data, isFetching } = useSearchArticlesQuery(args, { skip: !q && !category && !publisherId && !dateFrom });

  const onVoice = () => {
    if (!speechRecognitionSupported()) {
      toast("Voice search not supported in this browser", "error");
      return;
    }
    setListening(true);
    recogRef.current = startRecognition(
      (text) => {
        setQ(text);
        setListening(false);
      },
      (err) => {
        toast(`Voice error: ${err}`, "error");
        setListening(false);
      }
    );
  };

  const reset = () => {
    setQ("");
    setCategory("");
    setPublisherId("");
    setDateFrom("");
  };

  const hasActive = Boolean(q || category || publisherId || dateFrom);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Search</h1>
        <p className="text-sm text-neutral-500">
          Find articles by keyword, category, publisher, or date.
        </p>
      </div>

      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-neutral-400" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search news, topics, sources…"
          className="h-12 pl-10 pr-24 text-base"
        />
        <div className="absolute right-1 top-1 flex gap-1">
          {q && (
            <button
              aria-label="Clear"
              onClick={() => setQ("")}
              className="grid h-10 w-10 place-items-center rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <Button
            size="icon"
            variant={listening ? "primary" : "outline"}
            onClick={onVoice}
            aria-label="Voice search"
          >
            <Mic className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-10 w-full rounded-lg border bg-transparent px-2 text-sm"
        >
          <option value="">All categories</option>
          {cats?.categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.emoji} {c.name}
            </option>
          ))}
        </select>
        <select
          value={publisherId}
          onChange={(e) => setPublisherId(e.target.value)}
          className="h-10 w-full rounded-lg border bg-transparent px-2 text-sm"
        >
          <option value="">All sources</option>
          {pubs?.publishers.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="h-10 w-full rounded-lg border bg-transparent px-2 text-sm"
        />
      </div>

      {hasActive && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-neutral-500">
            {isFetching ? "Searching…" : `${data?.articles?.length ?? 0} results`}
          </p>
          <Button variant="ghost" size="sm" onClick={reset}>
            Reset filters
          </Button>
        </div>
      )}

      {!hasActive ? (
        <div className="rounded-2xl border bg-[rgb(var(--card))] p-6">
          <p className="text-sm text-neutral-500">Trending searches</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {TRENDING_QUERIES.map((t) => (
              <button
                key={t}
                onClick={() => setQ(t)}
                className="rounded-full border px-3 py-1 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      ) : data?.articles?.length ? (
        <ArticleGrid articles={data.articles} variant="list" />
      ) : (
        !isFetching && (
          <EmptyState
            title="No results"
            description="Try a different keyword or remove filters."
            icon={<SearchIcon className="h-8 w-8" />}
          />
        )
      )}
    </div>
  );
}
