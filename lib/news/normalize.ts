import type { Article } from "@/types";
import { mapCategory } from "./categoryMap";

export type RawNewsArticle = {
  provider: "newsapi" | "gnews" | "currents";
  providerCategories?: string[];
  title: string;
  description: string | null;
  url: string;
  imageUrl: string | null;
  publishedAt: string;
  source: string;
  author: string | null;
};

function stableId(provider: string, url: string): string {
  let h = 2166136261;
  for (let i = 0; i < url.length; i++) {
    h ^= url.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `live-${provider}-${(h >>> 0).toString(36)}`;
}

function readingMinutesFor(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(2, Math.ceil(words / 200));
}

export function normalize(raw: RawNewsArticle): Article | null {
  if (!raw.title?.trim() || !raw.url) return null;

  const text = `${raw.title} ${raw.description ?? ""}`;
  const category = mapCategory(raw.provider, raw.providerCategories, text);
  if (!category) return null; // strict: drop unmappable

  const description = raw.description ?? "";

  return {
    id: stableId(raw.provider, raw.url),
    slug: raw.url
      .replace(/^https?:\/\//, "")
      .replace(/[^a-z0-9]+/gi, "-")
      .slice(0, 80)
      .toLowerCase(),
    title: raw.title.trim(),
    summary: description,
    bulletSummary: [],
    keyTakeaways: [],
    body: description,
    category,
    tags: [],
    publisherId: `live-${raw.provider}`,
    authorName: raw.author?.trim() || raw.source,
    imageUrl:
      raw.imageUrl ||
      `https://picsum.photos/seed/${stableId(raw.provider, raw.url)}/800/450`,
    publishedAt: raw.publishedAt,
    readingMinutes: readingMinutesFor(`${raw.title} ${description}`),
    sentiment: "neutral",
    biasScore: 0,
    language: "en",
    likes: 0,
    views: 0,
    sourceUrl: raw.url,
    provider: raw.provider
  };
}
