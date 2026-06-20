# 10 — Landing feature cards are now live links

← back to [`read.md`](../read.md)

## The ask

> "i need all option run this" — pointing at the six feature cards on the
> landing page (AI Summaries, Voice Reader, Translate, Trending Topics,
> Bookmarks & Lists, Smart Alerts) — 2026-06-20

Make every card on the landing page actually go somewhere and demo the
feature it advertises.

## What shipped

Each card is now a `<Link>` that lands the visitor on a working demo of
that feature. AI cards deep-link straight to the matching tab in the
article-detail AI panel via URL hash.

| Card | Goes to | Why |
|---|---|---|
| **AI Summaries** | [`/article/a1#summary`](http://localhost:3000/article/a1#summary) | Opens an article with the Summary tab pre-selected |
| **Voice Reader** | [`/article/a1#listen`](http://localhost:3000/article/a1#listen) | Opens the Listen tab — real `speechSynthesis` |
| **Translate** | [`/article/a1#translate`](http://localhost:3000/article/a1#translate) | Opens the Translate tab |
| **Trending Topics** | [`/home#trending`](http://localhost:3000/home#trending) | Scrolls the right rail to the Trending block |
| **Bookmarks & Lists** | [`/bookmarks`](http://localhost:3000/bookmarks) | Bookmarks screen |
| **Smart Alerts** | [`/notifications`](http://localhost:3000/notifications) | Notifications screen |

Each card also picked up a CTA microcopy line ("Try a summary", "Listen
now", …) and an arrow that nudges on hover — so they read as actionable
not decorative.

## Implementation

### AI panel deep-link via hash

[`components/ai/AIPanel.tsx`](../components/ai/AIPanel.tsx) now reads
`window.location.hash` on mount and on `hashchange`, switches the
controlled Tabs `value` to the matching tab, and smooth-scrolls the panel
into view.

```tsx
const AI_TABS = ["summary","bullets","takeaways","chat","translate","listen"] as const;
useEffect(() => {
  const sync = () => {
    const h = window.location.hash.replace("#","");
    if (AI_TABS.includes(h as AITab)) {
      setTab(h as AITab);
      document.getElementById("ai-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  sync();
  window.addEventListener("hashchange", sync);
  return () => window.removeEventListener("hashchange", sync);
}, []);
```

Any unknown hash falls back to the default `summary` tab — no errors.

### Trending anchor

[`components/feed/TrendingRail.tsx`](../components/feed/TrendingRail.tsx)
got `id="trending"` + `scroll-mt-24` so the sticky navbar doesn't cover
it after `/home#trending` scrolls.

### Landing page

[`app/page.tsx`](../app/page.tsx) — each FEATURES entry now carries
`href` and `cta`; the map renders a `<Link>` (with focus-visible ring
and an arrow that slides on hover) instead of a `<div>`.

## How to verify

1. `npm run dev` → http://localhost:3000.
2. Scroll to the "Built for how you actually read" section.
3. Click **AI Summaries** → lands on article `a1`, AI panel shows the
   Summary tab pre-selected, panel auto-scrolls into view.
4. Back to landing, click **Voice Reader** → same article, Listen tab
   pre-selected. Click play — the browser reads it aloud.
5. Click **Translate** → Translate tab pre-selected.
6. Click **Trending Topics** → home page, right rail Trending block
   scrolls into view.
7. Click **Bookmarks & Lists** → `/bookmarks`.
8. Click **Smart Alerts** → `/notifications`.

## Files touched

- New: `docs/10-landing-feature-links.md`
- Modified: `app/page.tsx` (cards become Links with cta + href),
  `components/ai/AIPanel.tsx` (hash → tab),
  `components/feed/TrendingRail.tsx` (added `id="trending"` + scroll
  margin), `read.md` (change log entry)
