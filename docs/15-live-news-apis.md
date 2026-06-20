# 15 — Live news APIs (NewsAPI, GNews, Currents) with strict category mapping

← back to [`read.md`](../read.md)

## The ask

> "add this api key for my project Free APIs (API Key Required)
> NewsAPI, GNews API, Currents API. and very careful the category of
> new, any new related to that category then on this category" —
> 2026-06-20

Pull live news from three free providers and merge them into the feed.
Be strict about categories: an article only shows in the category it
belongs to. No bleeding across.

## Design choices (confirmed)

- **Keys stay server-side.** The Next.js API route under
  `/app/api/news/feed` holds `NEWSAPI_KEY` / `GNEWS_KEY` /
  `CURRENTS_KEY`. They're not prefixed with `NEXT_PUBLIC_`, so they
  never reach the browser bundle. The client only calls `/api/news/feed`
  — never the providers directly.
- **Mock fallback** is kept. With zero providers configured, or if all
  three fail, the existing `/data/articles.json` keeps the demo alive.
  The `configured` flag in the API response tells the UI whether any
  provider is actually live.
- **Strict category mapping.** If we can't map an article to one of our
  13 slugs, it's **dropped**, not dumped in "general."

## What shipped

### Files

```
.env.example                                 # documents the 3 env vars
lib/news/categoryMap.ts                      # provider category -> our slug
lib/news/normalize.ts                        # provider raw -> our Article
lib/news/providers/newsapi.ts                # NewsAPI client + adapter
lib/news/providers/gnews.ts                  # GNews client + adapter (4 topics)
lib/news/providers/currents.ts               # Currents client + adapter
lib/news/fetchLive.ts                        # fan-out, normalize, dedupe, sort
app/api/news/feed/route.ts                   # Next.js route handler
```

### Category mapping (the careful part)

[`lib/news/categoryMap.ts`](../lib/news/categoryMap.ts) holds the rule.
Three-pass classification:

1. **Keyword rules first.** Crypto / startups / finance / education /
   politics are categories no provider tags directly, so we run regex
   rules over `title + description`. Order matters — `crypto` runs
   before `finance` so a Bitcoin story lands in crypto, not finance.
2. **Strict provider→our map.** A whitelist (not a fallback) of
   `provider:category → ourSlug`. NewsAPI's `general`, GNews's
   `general`, Currents's `lifestyle/food/music/fashion/gaming/arts`
   are intentionally **omitted** so those articles drop out instead of
   becoming noise.
3. **No fallback.** If neither pass produces a slug, the article is
   dropped.

The 13 slugs the map can produce: `politics, technology, business,
sports, entertainment, science, health, education, finance, crypto,
startups, local, world` — these match `data/categories.json` exactly.

### Provider strategy

| Provider | Endpoint | Calls per refresh | Why |
|---|---|---|---|
| NewsAPI | `top-headlines?country=us&pageSize=50` | 1 | Single request gets 50 mixed articles; keyword rules carry the load |
| GNews   | `top-headlines?topic={topic}` × 4 (business, technology, science, world) | 4 | GNews returns per-topic; we tag each result with the queried topic for the map |
| Currents | `latest-news?language=en` | 1 | Currents puts a `category[]` array on every article |

With Next.js `revalidate: 600` (10-min cache), worst case 6×24 = 144
refreshes/day. That's ~144 NewsAPI reqs, 576 GNews reqs, 144 Currents
reqs/day — all within the free tiers
(NewsAPI 100/day Developer plan is tight; raise revalidate to 900 if
you hit a 429).

### Dedupe

Same story sometimes appears across providers (a Reuters piece syndicated
to multiple sources). [`fetchLive.ts`](../lib/news/fetchLive.ts) dedupes
by normalized title prefix (first 80 chars, lowercased, whitespace
collapsed). First provider in the fan-out order wins.

### Client integration

[`lib/mockBaseQuery.ts`](../lib/mockBaseQuery.ts) only changed the
`feed` and `category` endpoints — everything else (article detail,
search, trending, notifications, publishers) still reads from local
JSON. For feed/category it calls `/api/news/feed` with an in-memory
5-minute TTL cache so it doesn't fire on every keystroke.

Live articles are prepended to mock articles, then sorted by
`publishedAt` descending. With keys set you'll see real news up top
and the mock articles further down.

### External-link cards

Live articles carry a `sourceUrl` and a `provider` field on
[`types/index.ts`](../types/index.ts). The new `CardLink` wrapper in
[`components/article/ArticleCard.tsx`](../components/article/ArticleCard.tsx)
swaps the Next `<Link>` for an `<a target="_blank" rel="noopener">`
when `sourceUrl` is set, so clicking a live article opens the
original publisher's page in a new tab. A small `ExternalLink` icon
appears in the metadata row so the affordance is obvious.

Mock articles still open the in-app detail page like before.

## How to wire up the keys

1. Copy `.env.example` → `.env.local`:
   ```
   cp .env.example .env.local
   ```
2. Paste your real keys:
   ```
   NEWSAPI_KEY=xxxx
   GNEWS_KEY=xxxx
   CURRENTS_KEY=xxxx
   ```
3. Restart the dev server (`Ctrl+C`, then `npm run dev`). Env vars only
   load at boot.
4. Visit http://localhost:3000/api/news/feed in your browser — you
   should see a JSON payload with `configured: true` and an `articles`
   array. The `providers` object tells you which of the three returned
   data.

## Verify

- `curl http://localhost:3000/api/news/feed` → returns
  `{ "articles": [...], "configured": false, "providers": {...} }`
  when no keys are set; non-empty `articles` when at least one key is
  set.
- Open `/home` — with keys set, real headlines appear above the mock
  articles. Click one → opens publisher's site in a new tab.
- Open a category like `/category/crypto` — only crypto stories
  appear (mock + live). No "general" leakage. Verify by checking
  `/api/news/feed?category=crypto` returns only crypto.
- Speak / bookmark / like still work on live articles. Bookmarking
  a live article persists by its `live-newsapi-abc123` ID; if the
  article rolls off the feed later, the bookmark just won't resolve
  anymore (acceptable for a mock build).

## Honest limits

- **Quota.** NewsAPI Developer (free) caps at 100 requests/day. The
  10-min cache keeps us at ~144/day worst case — pad to 15 min
  (`revalidate = 900`) if you see 429s.
- **Article detail.** Live articles open the publisher's page rather
  than the in-app detail. We don't have full body text from the free
  endpoints (NewsAPI truncates `content`, Currents returns
  description-only), so the in-app detail would be misleading.
- **Categories the providers can't tell.** Crypto, startups, finance,
  education, and most politics articles come from keyword rules. Tune
  the regex in `categoryMap.ts` if a story keeps ending up in the
  wrong slot.
- **Translation / TTS.** Live articles aren't pre-translated and have
  no real bodies, so multi-language Speak only reads the
  title + description — same as the rest of the app for articles
  without seeded translations.

## Files touched

- New: `.env.example`, `lib/news/categoryMap.ts`,
  `lib/news/normalize.ts`, `lib/news/providers/newsapi.ts`,
  `lib/news/providers/gnews.ts`, `lib/news/providers/currents.ts`,
  `lib/news/fetchLive.ts`, `app/api/news/feed/route.ts`,
  `docs/15-live-news-apis.md`
- Modified: `types/index.ts` (added `sourceUrl?`, `provider?` to
  Article), `lib/mockBaseQuery.ts` (feed + category now merge live
  results with mock + cache 5 min),
  `components/article/ArticleCard.tsx` (CardLink wrapper opens
  external URL for live articles + ExternalLink icon in meta),
  `read.md` (change log entry)
