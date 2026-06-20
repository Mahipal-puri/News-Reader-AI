export type Role =
  | "guest"
  | "user"
  | "premium"
  | "reporter"
  | "editor"
  | "sub-admin"
  | "admin"
  | "super-admin";

export type Sentiment = "positive" | "neutral" | "negative";

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: Role;
  createdAt: string;
};

export type Publisher = {
  id: string;
  name: string;
  logoUrl: string;
  verified: boolean;
};

export type Category = {
  slug: string;
  name: string;
  emoji: string;
  color: string;
};

export type Article = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  bulletSummary: string[];
  keyTakeaways: string[];
  body: string;
  category: string;
  tags: string[];
  publisherId: string;
  authorName: string;
  imageUrl: string;
  publishedAt: string;
  readingMinutes: number;
  sentiment: Sentiment;
  biasScore: number;
  language: "en" | "hi" | "es";
  translations?: Partial<Record<"hi" | "es", { title: string; summary: string }>>;
  likes: number;
  views: number;
  premium?: boolean;
  isLive?: boolean;
  liveUpdates?: LiveUpdate[];
};

export type LiveUpdate = {
  time: string;
  text: string;
};

export type Notification = {
  id: string;
  type: "breaking" | "category" | "topic" | "daily" | "weekly";
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  articleId?: string;
};

export type Comment = {
  id: string;
  articleId: string;
  authorName: string;
  body: string;
  createdAt: string;
};

export type FeedQuery = {
  topics?: string[];
  page?: number;
  pageSize?: number;
};

export type SearchQuery = {
  q: string;
  category?: string;
  publisherId?: string;
  dateFrom?: string;
};
