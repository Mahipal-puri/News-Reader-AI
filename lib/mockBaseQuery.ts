import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import articles from "@/data/articles.json";
import categories from "@/data/categories.json";
import publishers from "@/data/publishers.json";
import trending from "@/data/trending.json";
import seedNotifications from "@/data/notifications.json";
import type {
  Article,
  Category,
  Notification,
  Publisher,
  SearchQuery,
  FeedQuery
} from "@/types";

const ARTICLES = articles as Article[];
const CATEGORIES = categories as Category[];
const PUBLISHERS = publishers as Publisher[];
const TRENDING = trending as Array<{ topic: string; category: string; articleIds: string[] }>;
const SEED_NOTIFICATIONS = seedNotifications as Notification[];

const wait = (ms = 150) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const sortByDateDesc = (a: Article, b: Article) =>
  new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();

export type MockRequest =
  | { url: "feed"; params: FeedQuery }
  | { url: "article"; params: { id: string } }
  | { url: "search"; params: SearchQuery }
  | { url: "trending" }
  | { url: "categories" }
  | { url: "publishers" }
  | { url: "category"; params: { slug: string; page?: number } }
  | { url: "notifications" }
  | { url: "byPublisher"; params: { publisherId: string } };

export const mockBaseQuery: BaseQueryFn<MockRequest, unknown, { message: string }> =
  async (req) => {
    await wait();
    switch (req.url) {
      case "feed": {
        const { topics = [], page = 1, pageSize = 12 } = req.params;
        let pool = [...ARTICLES].sort(sortByDateDesc);
        if (topics.length) {
          const set = new Set(topics);
          const liked = pool.filter(
            (a) => set.has(a.category) || a.tags.some((t) => set.has(t))
          );
          const others = pool.filter((a) => !liked.includes(a));
          pool = [...liked, ...others];
        }
        const start = (page - 1) * pageSize;
        return {
          data: {
            articles: pool.slice(start, start + pageSize),
            total: pool.length,
            page,
            pageSize
          }
        };
      }
      case "article": {
        const found = ARTICLES.find((a) => a.id === req.params.id);
        if (!found) {
          return { error: { message: "Article not found" } };
        }
        const related = ARTICLES.filter(
          (a) => a.category === found.category && a.id !== found.id
        )
          .sort(sortByDateDesc)
          .slice(0, 4);
        return { data: { article: found, related } };
      }
      case "search": {
        const { q, category, publisherId, dateFrom } = req.params;
        const needle = q.trim().toLowerCase();
        let results = [...ARTICLES];
        if (needle) {
          results = results.filter((a) => {
            const hay = (
              a.title +
              " " +
              a.summary +
              " " +
              a.tags.join(" ") +
              " " +
              a.body
            ).toLowerCase();
            return hay.includes(needle);
          });
        }
        if (category) results = results.filter((a) => a.category === category);
        if (publisherId)
          results = results.filter((a) => a.publisherId === publisherId);
        if (dateFrom) {
          const since = new Date(dateFrom).getTime();
          results = results.filter(
            (a) => new Date(a.publishedAt).getTime() >= since
          );
        }
        return { data: { articles: results.sort(sortByDateDesc) } };
      }
      case "trending": {
        return { data: { trending: TRENDING } };
      }
      case "categories": {
        return { data: { categories: CATEGORIES } };
      }
      case "publishers": {
        return { data: { publishers: PUBLISHERS } };
      }
      case "category": {
        const { slug, page = 1 } = req.params;
        const pageSize = 12;
        const pool = ARTICLES.filter((a) => a.category === slug).sort(
          sortByDateDesc
        );
        const start = (page - 1) * pageSize;
        return {
          data: {
            articles: pool.slice(start, start + pageSize),
            total: pool.length,
            page,
            pageSize
          }
        };
      }
      case "notifications": {
        return { data: { notifications: SEED_NOTIFICATIONS } };
      }
      case "byPublisher": {
        return {
          data: {
            articles: ARTICLES.filter(
              (a) => a.publisherId === req.params.publisherId
            ).sort(sortByDateDesc)
          }
        };
      }
      default:
        return { error: { message: "Unknown endpoint" } };
    }
  };

export const getArticleById = (id: string) =>
  ARTICLES.find((a) => a.id === id);
export const getPublisherById = (id: string) =>
  PUBLISHERS.find((p) => p.id === id);
export const allCategories = (): Category[] => CATEGORIES;
export const allArticles = (): Article[] => ARTICLES;
