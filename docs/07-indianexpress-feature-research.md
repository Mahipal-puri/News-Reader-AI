# 07 — Indian Express feature research

← back to [`read.md`](../read.md)

## The ask

> "https://indianexpress.com/ go through this website and which feastrue
> how can advnce my web site"
> — 2026-06-20

Look at indianexpress.com and recommend features that would advance the
News Reader.

## How I researched

`WebFetch` is blocked for `indianexpress.com` from this environment, so
this is a **proposal based on familiarity with the site**, not a live
scrape. Each idea is mapped to what we already have so you can see the
delta clearly.

## What Indian Express does well (their patterns)

A short tour of the patterns worth borrowing:

- **Sticky red breaking-news ticker** above the navbar — rotating top headlines.
- **LIVE blogs** — articles with a pulsing red "LIVE" badge and a
  reverse-chronological update stream + "Last updated 2 min ago".
- **Express Premium** — crown/lock icon on subscriber-only stories,
  paywall preview (first 2 paragraphs visible).
- **Express Explained** — explainer cards: "What happened?", "Why it
  matters", "What's next" — three-part Q&A layout.
- **City editions** — Delhi / Mumbai / Pune / Bangalore / Ahmedabad /
  Chandigarh, each with its own front page.
- **Most Read / Most Commented** sidebar widgets, numbered 1–5.
- **UPSC current-affairs** digest, formatted for civil-services students.
- **E-Paper** — flipbook of the print edition.
- **Express Shorts** — vertical-swipe short news, Inshorts-style.
- **Author byline with face photo** + link to author page.
- **Big WhatsApp share button** (huge in India, before Twitter/FB).
- **Sensex/Nifty + cricket score chips** in the header.
- **Photos / Videos / Audio (podcasts)** as first-class sections.
- **Newsletter signup** — daily briefing email.
- **"Continue reading" sticky CTA** while you scroll a long article.
- **Topic tags + related stories** at article foot.
- **Relative timestamps everywhere** ("2 hours ago").

## What we already have (don't rebuild)

| Their feature | Ours |
|---|---|
| Categories | ✅ 13 categories in `data/categories.json` |
| Search + filters | ✅ `/search` w/ keyword, date, source |
| Bookmarks | ✅ `/bookmarks` + collections |
| Notifications | ✅ `/notifications` + Settings toggles |
| Dark mode | ✅ `next-themes` |
| Author byline | ✅ on `ArticleCard` |
| Reading time | ✅ `article.readingMinutes` |
| Share | ✅ Web Share API |
| AI summary / takeaways | ✅ AI panel |
| Voice reader | ✅ real Web Speech API |
| Roles | ✅ 8 roles incl. Premium |
| Languages | ✅ EN + 22 Indian languages |
| Theme accent | ✅ 6 runtime accents |
| Reading progress bar | ✅ on article detail |

## Recommendations — three tiers

### Tier 1 — high impact, small build (do these next)

1. **Breaking-news ticker** — slim red bar above `Navbar`, auto-rotates the
   top 5 articles every 5s. Drives engagement, pure CSS animation, one
   component. *Effort: S.*
2. **LIVE article type** — add `isLive: boolean` + `liveUpdates: {time, text}[]`
   to the `Article` type, render reverse-chrono updates on detail page,
   pulsing red "LIVE" badge on cards. Seed 2-3 live articles in
   `articles.json`. *Effort: S–M.*
3. **Premium paywall preview** — when `article.premium === true` and
   `role !== "premium"`, show first 2 paragraphs + blur the rest +
   "Upgrade to Premium" CTA (Settings already has the role toggle).
   Real product behavior, zero extra infra. *Effort: S.*
4. **Most Read sidebar widget** — sort articles by a mock `views` count,
   render top 5 numbered. Reuses `ArticleCard` small variant. *Effort: S.*
5. **Relative timestamps** — `formatRelative(publishedAt)` helper used in
   every card ("2h ago", "Yesterday", "3 Jun"). One file change with
   broad visual upgrade. *Effort: XS.*
6. **WhatsApp share button** — add WhatsApp as an explicit option in the
   share menu (massive in India, IE leads with it). *Effort: XS.*

### Tier 2 — medium build, strong fit

7. **Express Explained / Explainer cards** — new article variant with
   three-section layout (What / Why / What's next). Pulls from our
   existing `keyTakeaways` field. *Effort: M.*
8. **City editions** — `data/cities.json` (Delhi, Mumbai, Bangalore,
   Pune, Chandigarh, Ahmedabad, Hyderabad, Kolkata, Chennai), each
   article tagged with a city, `/city/[slug]` page reuses category
   layout. Honors the spec's "Location-Based News". *Effort: M.*
9. **Express Shorts (vertical swipe feed)** — `/shorts` page, full-bleed
   cards stacked, swipe/scroll snap, uses `article.bulletSummary` as the
   body. Mobile-first but works on desktop. *Effort: M.*
10. **Daily Briefing page** — `/briefing` shows today's top 5 stories in
    a newsletter layout with intro line, perfect for a "Subscribe to
    daily digest" CTA that just toggles a Settings flag. *Effort: S–M.*
11. **Most Commented + comments UI** — local-only threaded comments
    (already in-spec for social features) with reaction emojis. Counts
    feed the "Most Commented" widget. *Effort: M.*
12. **Sensex/Nifty + cricket chip strip** — small ticker bar with mock
    market + match scores, dismissible. Cosmetic but very IE. *Effort: S.*

### Tier 3 — bigger lifts (decide later)

13. **E-Paper view** — `/epaper` shows a newspaper-layout grid of today's
    front page (CSS Grid, multi-column type). Pure design exercise, no
    real PDF. *Effort: M–L.*
14. **UPSC Current Affairs digest** — `/upsc` aggregates articles
    tagged `upsc-relevant` with study-format summaries. Fits the spec's
    Student target user. *Effort: M.*
15. **Author profile pages** — `/author/[slug]` with bio, photo, recent
    stories, "Follow author". *Effort: M.*
16. **Photo gallery view** — masonry grid + lightbox for Photos category.
    *Effort: M.*
17. **Podcast feed** — `/audio` list with inline play; reuse our voice
    reader for TTS-generated podcast feel. *Effort: M.*
18. **Newsletter signup component** — email field + frequency picker
    (daily / weekly), persists to Redux preferences, toasts "subscribed".
    *Effort: S.*
19. **Fact-Check badge** — verified true / misleading / false pill on
    cards, ties to spec's Fact Verification AI feature. *Effort: S.*
20. **Article density switcher** — Compact / Comfortable / Magazine on
    the Home feed. *Effort: S.*

## What I'd build first if you say "go"

The Tier 1 bundle (1–6) is the highest signal-to-noise: it makes the
site *feel* like a real Indian news product in roughly one focused build
session, without any new dependencies. Tier 2 adds depth; Tier 3 adds
breadth.

Tell me which tier (or which numbers) to ship and I'll scope it as the
next `docs/08-...md` task.

## Files this doc touched

- New: `docs/07-indianexpress-feature-research.md`
- Modified: `read.md` (change log entry)
