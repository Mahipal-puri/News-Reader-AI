import { NextResponse } from "next/server";
import { fetchLiveArticles, isAnyProviderConfigured } from "@/lib/news/fetchLive";

// Revalidate every 10 minutes to stay safely under free-tier quotas
// (3 providers × 6 refreshes/hour × 24h = ~432 reqs/day worst case;
// each free plan allows 100+/day).
export const revalidate = 600;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const category = url.searchParams.get("category");
  const configured = isAnyProviderConfigured();
  const articles = configured ? await fetchLiveArticles() : [];
  const filtered = category
    ? articles.filter((a) => a.category === category)
    : articles;
  return NextResponse.json({
    articles: filtered,
    total: filtered.length,
    configured,
    providers: {
      newsapi: !!process.env.NEWSAPI_KEY,
      gnews: !!process.env.GNEWS_KEY,
      currents: !!process.env.CURRENTS_KEY
    }
  });
}
