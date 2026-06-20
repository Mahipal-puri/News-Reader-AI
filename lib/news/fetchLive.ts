import type { Article } from "@/types";
import { fetchNewsApi } from "./providers/newsapi";
import { fetchGNews } from "./providers/gnews";
import { fetchCurrents } from "./providers/currents";
import { normalize } from "./normalize";

// Strip Article fields used only as a dedupe key.
function dedupeKey(a: Article): string {
  return a.title.trim().toLowerCase().replace(/\s+/g, " ").slice(0, 80);
}

export async function fetchLiveArticles(): Promise<Article[]> {
  const [newsapi, gnews, currents] = await Promise.all([
    fetchNewsApi(process.env.NEWSAPI_KEY),
    fetchGNews(process.env.GNEWS_KEY),
    fetchCurrents(process.env.CURRENTS_KEY)
  ]);

  // Normalize + drop unmappable.
  const all = [...newsapi, ...gnews, ...currents]
    .map(normalize)
    .filter((a): a is Article => a !== null);

  // Dedupe by title prefix — same story sometimes appears across providers.
  const seen = new Set<string>();
  const unique: Article[] = [];
  for (const a of all) {
    const k = dedupeKey(a);
    if (seen.has(k)) continue;
    seen.add(k);
    unique.push(a);
  }

  // Newest first.
  unique.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return unique;
}

export function isAnyProviderConfigured(): boolean {
  return !!(
    process.env.NEWSAPI_KEY ||
    process.env.GNEWS_KEY ||
    process.env.CURRENTS_KEY
  );
}
