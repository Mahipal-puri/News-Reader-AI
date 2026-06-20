import type { RawNewsArticle } from "../normalize";

type NewsApiResponse = {
  status: "ok" | "error";
  message?: string;
  articles?: Array<{
    source: { id: string | null; name: string };
    author: string | null;
    title: string | null;
    description: string | null;
    url: string;
    urlToImage: string | null;
    publishedAt: string;
  }>;
};

export async function fetchNewsApi(
  apiKey: string | undefined
): Promise<RawNewsArticle[]> {
  if (!apiKey) return [];
  try {
    const res = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&pageSize=50&apiKey=${apiKey}`,
      { next: { revalidate: 600 }, headers: { "User-Agent": "ai-news-reader/1.0" } }
    );
    if (!res.ok) return [];
    const data = (await res.json()) as NewsApiResponse;
    if (data.status !== "ok" || !data.articles) return [];
    return data.articles
      .filter((a) => a.title && a.url)
      .map((a) => ({
        provider: "newsapi" as const,
        providerCategories: undefined,
        title: a.title as string,
        description: a.description,
        url: a.url,
        imageUrl: a.urlToImage,
        publishedAt: a.publishedAt,
        source: a.source?.name ?? "NewsAPI",
        author: a.author
      }));
  } catch {
    return [];
  }
}
