import type { RawNewsArticle } from "../normalize";

type GNewsResponse = {
  totalArticles?: number;
  articles?: Array<{
    title: string;
    description: string | null;
    content: string | null;
    url: string;
    image: string | null;
    publishedAt: string;
    source: { name: string; url: string };
  }>;
  errors?: string[];
};

// GNews top-headlines categories (their "topic" param).
const TOPICS = ["business", "technology", "science", "world"] as const;
type Topic = (typeof TOPICS)[number];

async function fetchOneTopic(
  apiKey: string,
  topic: Topic
): Promise<RawNewsArticle[]> {
  try {
    const res = await fetch(
      `https://gnews.io/api/v4/top-headlines?topic=${topic}&lang=en&max=10&apikey=${apiKey}`,
      { next: { revalidate: 600 } }
    );
    if (!res.ok) return [];
    const data = (await res.json()) as GNewsResponse;
    if (!data.articles) return [];
    return data.articles
      .filter((a) => a.title && a.url)
      .map((a) => ({
        provider: "gnews" as const,
        providerCategories: [topic],
        title: a.title,
        description: a.description,
        url: a.url,
        imageUrl: a.image,
        publishedAt: a.publishedAt,
        source: a.source?.name ?? "GNews",
        author: null
      }));
  } catch {
    return [];
  }
}

export async function fetchGNews(
  apiKey: string | undefined
): Promise<RawNewsArticle[]> {
  if (!apiKey) return [];
  const lists = await Promise.all(TOPICS.map((t) => fetchOneTopic(apiKey, t)));
  return lists.flat();
}
