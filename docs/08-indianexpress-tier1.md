# 08 — Indian Express Tier 1 features

← back to [`read.md`](../read.md)

## The ask

> "do it in my project"
> — 2026-06-20

Build the Tier 1 bundle proposed in [`07-indianexpress-feature-research.md`](07-indianexpress-feature-research.md):
breaking-news ticker, LIVE article type, Premium paywall preview, Most
Read sidebar, WhatsApp share. (Relative timestamps were already covered
by `timeAgo()` in [`lib/format.ts`](../lib/format.ts), so #5 was a no-op.)

## What shipped

### 1. Breaking-news ticker

Slim **red bar above the navbar**, present on every reader route.
Rotates the five most recent headlines every 5 seconds with a fade-in,
plus tiny progress dots. Clicking the headline jumps to the article.

- **New:** [`components/feed/BreakingTicker.tsx`](../components/feed/BreakingTicker.tsx)
- **Modified:** [`app/(reader)/layout.tsx`](<../app/(reader)/layout.tsx>) — renders `<BreakingTicker />` above `<Navbar />`
- **Modified:** [`app/globals.css`](../app/globals.css) — `tickerFade` keyframe

### 2. LIVE article type

New optional `isLive: boolean` + `liveUpdates: {time, text}[]` fields on
the `Article` type. When `isLive`:
- A pulsing red **LIVE** pill renders on cards (featured / compact / list
  variants) and at the top of the article detail page.
- The article detail page renders a **Live updates** block above the
  body — reverse-chronological, with monospaced timestamps and "Last
  updated *N* ago" in the header.

Seeded two LIVE articles in `data/articles.json`:
- **`a5`** — Premier League title (5 updates)
- **`a11`** — Election coalition shift (4 updates)

- **New:** [`components/ui/LiveBadge.tsx`](../components/ui/LiveBadge.tsx) — pulsing-dot pill, `size="sm" | "md"`
- **Modified:** [`types/index.ts`](../types/index.ts) — adds `isLive`, `liveUpdates`, `LiveUpdate` type
- **Modified:** [`components/article/ArticleCard.tsx`](../components/article/ArticleCard.tsx) — badge on all three variants
- **Modified:** [`app/(reader)/article/[id]/page.tsx`](<../app/(reader)/article/[id]/page.tsx>) — updates feed block
- **Modified:** [`app/globals.css`](../app/globals.css) — `livePulse` keyframe + `.live-dot`
- **Modified:** [`data/articles.json`](../data/articles.json) — LIVE on `a5`, `a11`

### 3. Premium paywall preview

New optional `premium: boolean` on `Article`. When `article.premium &&
role !== "premium"`:
- Body renders only the **first 2 paragraphs**.
- A fade-out gradient drops onto the page.
- An amber **"Upgrade to Premium"** card with a Crown icon offers an
  inline upgrade — clicking it dispatches `setRole("premium")` and
  toasts a welcome.
- A small "Premium" pill renders next to the category at the top.

Seeded two premium articles:
- **`a4`** — Fusion startup net-energy gain
- **`a8`** — Bitcoin spot-ETF inflows

- **Modified:** [`types/index.ts`](../types/index.ts) — adds `premium?: boolean`
- **Modified:** [`app/(reader)/article/[id]/page.tsx`](<../app/(reader)/article/[id]/page.tsx>) — `locked` computation, paywall block, upgrade handler
- **Modified:** [`components/article/ArticleCard.tsx`](../components/article/ArticleCard.tsx) — Premium pill on cards
- **Modified:** [`data/articles.json`](../data/articles.json) — premium on `a4`, `a8`

### 4. Most Read sidebar

Top 5 articles by mock `views`, numbered 1–5, with view count and link
to article. Renders below Trending on the Home page right rail.

- **New:** [`components/feed/MostRead.tsx`](../components/feed/MostRead.tsx)
- **Modified:** [`app/(reader)/home/page.tsx`](<../app/(reader)/home/page.tsx>) — adds `<MostRead />` under `<TrendingRail />`

### 5. WhatsApp share

The article-page share button became a **menu** with four options:
WhatsApp (green), X/Twitter (black), Copy link (grey), Native share
("More…"). WhatsApp uses `api.whatsapp.com/send?text=...` — opens
WhatsApp Web on desktop and the app on mobile. Click-outside closes the
menu.

- **New:** [`components/article/ShareMenu.tsx`](../components/article/ShareMenu.tsx)
- **Modified:** [`app/(reader)/article/[id]/page.tsx`](<../app/(reader)/article/[id]/page.tsx>) — replaces the plain Share button + removes the old `share()` helper

## Demo / how to verify

1. `npm run dev` → http://localhost:3000.
2. **Ticker** — top of every reader page, red bar rotates 5 headlines.
3. **Home** — right rail now shows **Trending** *and* **Most Read** with rank numbers.
4. **LIVE** — open [`/article/a5`](http://localhost:3000/article/a5) or
   [`/article/a11`](http://localhost:3000/article/a11). Card shows
   pulsing LIVE badge; detail page shows updates feed.
5. **Premium paywall** — go to Settings, set role to **Reader** (not
   Premium). Open [`/article/a4`](http://localhost:3000/article/a4) — body cuts
   off after 2 paragraphs with the gold upgrade card. Click **Upgrade
   to Premium** → full article reveals.
6. **Share menu** — click **Share** on any article. WhatsApp / X /
   Copy link / More… appear. WhatsApp opens a draft message with
   the title + URL.

## What's still on the menu (Tier 2 / 3)

From [`docs/07`](07-indianexpress-feature-research.md): Express Explained
cards, City editions, Express Shorts swipe feed, Daily Briefing, Most
Commented, market/cricket chip strip, E-Paper, UPSC digest, Author
pages, Podcast feed, Newsletter signup, Fact-Check badge, density
switcher.

Say which next.

## Files touched

- New: `components/feed/BreakingTicker.tsx`, `components/feed/MostRead.tsx`,
  `components/ui/LiveBadge.tsx`, `components/article/ShareMenu.tsx`,
  `docs/08-indianexpress-tier1.md`
- Modified: `types/index.ts`, `app/(reader)/layout.tsx`,
  `app/(reader)/home/page.tsx`, `app/(reader)/article/[id]/page.tsx`,
  `components/article/ArticleCard.tsx`, `app/globals.css`,
  `data/articles.json`, `read.md`
