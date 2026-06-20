# 01 — Initial frontend build

← back to [`read.md`](../read.md)

## The ask

> "read the md and make a web appliaction only on forntend"
> — 2026-06-20

Build the AI News Reader spec as a frontend-only web application. No backend,
no real news API, no real AI services.

## Scope agreed up front

- **Reader-facing core only** (10 of 12 screens) — Admin / Analytics
  dashboards out of scope.
- **Mock data only** — hardcoded JSON in `/data/`.
- **AI features = UI shells** with canned responses; Web Speech for voice.
- **Stack** — Next.js 14 App Router + TypeScript + Tailwind + Redux Toolkit +
  RTK Query (matches the spec's tech stack).

## What was built

### Routes (10 pages)

| Path | Purpose |
|---|---|
| `/` | Marketing landing with hero, features, FAQ |
| `/login`, `/register` | Email / Google / OTP — all mocked |
| `/home` | Personalized feed + trending rail |
| `/category/[slug]` | Per-category feed |
| `/article/[id]` | Article + AI panel (Summary, Bullets, Takeaways, Chat, Translate, Listen) + comments + related |
| `/search` | Keyword + filter search, voice input via Web Speech |
| `/bookmarks` | Saved articles, collections |
| `/notifications` | Seeded alerts, mark-read, dismiss |
| `/profile` | Followed topics + publishers, liked articles |
| `/settings` | Theme, language, notifications, Premium toggle, sign out |

### Foundation

- **State** — `store/slices/{auth,bookmarks,preferences,notifications}.ts` +
  `store/api/newsApi.ts` (RTK Query against `lib/mockBaseQuery.ts`)
- **Data** — `data/articles.json` (40 articles, 13 categories),
  `categories.json`, `publishers.json`, `trending.json`, `notifications.json`
- **AI shells** — `lib/ai/{fakeSummary,fakeChat,voice}.ts`
- **Auth** — `lib/auth/mockAuth.ts` (any input accepted, persists to localStorage)
- **UI primitives** — `components/ui/*` (Button, Card, Input, Modal, Toast,
  Skeleton, Tabs, RoleBadge, EmptyState)
- **Layout** — Navbar (sticky), Sidebar, MobileNav (responsive bottom bar),
  Footer
- **Providers** — ReduxProvider (localStorage sync), ThemeProvider (next-themes),
  ToastProvider

## How to verify

```bash
cd "c:/cluade project/New reader"
npm install
npm run dev
```

Open http://localhost:3000. Click **Get started** → enter any email + password →
land on `/home`. Bookmarks persist across refresh. AI panel's Listen tab speaks
the article aloud (no API key).

## Out of scope (documented)

Admin / Analytics dashboards, Editor workflows, real OAuth, PWA service worker,
test suite. README notes these explicitly.
