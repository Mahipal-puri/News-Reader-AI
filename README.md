# NewsAI — Frontend-Only AI News Reader

A polished, demoable frontend for an AI-powered news reader, built from the
spec in `read.md`. Everything is mocked locally: articles, users, AI
responses, notifications. Voice playback is the one feature that's actually
real — it uses the browser's built-in Web Speech API.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## What's inside

- **Next.js 14** App Router + **TypeScript**
- **Tailwind CSS** with light/dark theme (`next-themes`)
- **Redux Toolkit** + **RTK Query** with a mock baseQuery that reads from
  `/data/*.json`
- **lucide-react** icons
- Persists `auth`, `bookmarks`, and `preferences` to localStorage

## Routes

| Path | What it does |
|---|---|
| `/` | Marketing landing page |
| `/login`, `/register` | Mock email/Google/OTP — accepts any input |
| `/home` | Personalized feed (or generic if guest) with trending rail |
| `/category/[slug]` | Category feed for any of the 13 categories |
| `/article/[id]` | Full article + AI panel (Summary, Bullets, Takeaways, Chat, Translate, Listen) + comments + related |
| `/search` | Keyword + filter search with voice input (Web Speech) |
| `/bookmarks` | Saved articles + collections |
| `/notifications` | Seeded alerts with dismiss/mark-read |
| `/profile` | Followed topics + publishers + liked articles |
| `/settings` | Theme, language, notification toggles, Premium upgrade, sign out |

## Verifying it works

1. `npm install && npm run dev` — app launches at http://localhost:3000
2. Click **Get started** → enter any email + password → land on `/home`
3. Click any article → AI panel: **Summary** shows summary, **Listen** triggers browser TTS
4. Bookmark an article → `/bookmarks` shows it → refresh → it persists
5. `/search` → type "tech" → results filter; voice button works in Chrome/Edge
6. `/settings` → toggle theme → flips; toggle **Upgrade to Premium** → role badge updates
7. **Sign out** → returns to landing page

## Project structure

```
app/                # Routes (App Router groups: (auth), (reader))
components/
  ai/               # AIPanel, ChatWithNews, TranslateMenu, VoiceReader
  article/          # ArticleCard, ArticleGrid, AIChips, CommentThread
  auth/             # AuthForm, GoogleButton, OTPModal
  feed/             # CategoryChips, TrendingRail
  layout/           # Navbar, Sidebar, MobileNav, Footer
  providers/        # ReduxProvider, ThemeProvider
  ui/               # Button, Card, Input, Modal, Toast, Tabs, Skeleton, RoleBadge, EmptyState
store/              # Redux store, slices, RTK Query newsApi
lib/
  ai/               # fakeSummary, fakeChat, voice (Web Speech wrapper)
  auth/             # mockAuth (sign in / up / google / otp — all local)
  mockBaseQuery.ts  # In-memory query against /data JSON
data/               # articles, categories, publishers, trending, notifications
types/              # Shared TS types
```

## What's mocked vs. real

| Feature | Status |
|---|---|
| Articles, categories, publishers, trending | Mocked JSON in `/data/` |
| Auth (email / Google / OTP) | Mocked — accepts any input, persists locally |
| Bookmarks, likes, collections | Real (localStorage) |
| AI Summary / Bullets / Takeaways | Pre-canned, served from article fields with a 600ms "thinking" spinner |
| AI Chat | Keyword-matched against article body |
| Translation | Static `es`/`hi` strings or `[ES] / [HI]` prefix stub |
| **Voice playback** | **Real** — uses `window.speechSynthesis` |
| **Voice search** | **Real** — uses `webkitSpeechRecognition` (Chrome/Edge) |
| Notifications | Seeded list + in-session dismiss/mark-read |
| Theme | Real — light / dark / system |

## Out of scope (deliberately)

The spec includes an Admin Dashboard, Analytics Dashboard, Editor workflows,
real OAuth, PWA service-worker offline reading, and an 80% test coverage
target. None of those are part of this build — this is the reader-facing
core, frontend-only.
