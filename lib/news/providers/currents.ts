import type { RawNewsArticle } from "../normalize";

type CurrentsResponse = {
  status?: string;
  news?: Array<{
    id: string;
    title: string;
    description: string | null;
    url: string;
    author: string | null;
    image: string | null;
    language: string;
    category: string[];
    published: string;
  }>;
};

export async function fetchCurrents(
  apiKey: string | undefined
): Promise<RawNewsArticle[]> {
  if (!apiKey) return [];
  try {
    const res = await fetch(
      `https://api.currentsapi.services/v1/latest-news?language=en&apiKey=${apiKey}`,
      { next: { revalidate: 600 } }
    );
    if (!res.ok) return [];
    const data = (await res.json()) as CurrentsResponse;
    if (!data.news) return [];
    return data.news
      .filter((a) => a.title && a.url)
      .map((a) => ({
        provider: "currents" as const,
        providerCategories: a.category ?? [],
        title: a.title,
        description: a.description,
        url: a.url,
        imageUrl: a.image && a.image !== "None" ? a.image : null,
        publishedAt: a.published,
        source: new URL(a.url).hostname.replace(/^www\./, ""),
        author: a.author
      }));
  } catch {
    return [];
  }
}
