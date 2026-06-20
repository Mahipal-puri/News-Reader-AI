import { createApi } from "@reduxjs/toolkit/query/react";
import { mockBaseQuery } from "@/lib/mockBaseQuery";
import type {
  Article,
  Category,
  Notification,
  Publisher,
  SearchQuery,
  FeedQuery
} from "@/types";

export const newsApi = createApi({
  reducerPath: "newsApi",
  baseQuery: mockBaseQuery,
  tagTypes: ["Article", "Feed", "Notifications"],
  endpoints: (builder) => ({
    getFeed: builder.query<
      { articles: Article[]; total: number; page: number; pageSize: number },
      FeedQuery
    >({
      query: (params) => ({ url: "feed", params }),
      providesTags: ["Feed"]
    }),
    getArticle: builder.query<{ article: Article; related: Article[] }, string>({
      query: (id) => ({ url: "article", params: { id } }),
      providesTags: (_, __, id) => [{ type: "Article", id }]
    }),
    searchArticles: builder.query<{ articles: Article[] }, SearchQuery>({
      query: (params) => ({ url: "search", params })
    }),
    getTrending: builder.query<
      { trending: Array<{ topic: string; category: string; articleIds: string[] }> },
      void
    >({
      query: () => ({ url: "trending" })
    }),
    getCategories: builder.query<{ categories: Category[] }, void>({
      query: () => ({ url: "categories" })
    }),
    getCategoryFeed: builder.query<
      { articles: Article[]; total: number; page: number; pageSize: number },
      { slug: string; page?: number }
    >({
      query: (params) => ({ url: "category", params })
    }),
    getNotifications: builder.query<{ notifications: Notification[] }, void>({
      query: () => ({ url: "notifications" }),
      providesTags: ["Notifications"]
    }),
    getPublishers: builder.query<{ publishers: Publisher[] }, void>({
      query: () => ({ url: "publishers" })
    })
  })
});

export const {
  useGetFeedQuery,
  useGetArticleQuery,
  useSearchArticlesQuery,
  useGetTrendingQuery,
  useGetCategoriesQuery,
  useGetCategoryFeedQuery,
  useGetNotificationsQuery,
  useGetPublishersQuery
} = newsApi;
