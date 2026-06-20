# 05 — "Developed by Digital Hammer" attribution

← back to [`read.md`](../read.md)

## The ask

> "devloped by Digital hammer"
> — 2026-06-20

Add "Developed by Digital Hammer" credit across the app.

## What was done

### Footers (visible on every page)

- **`components/layout/Footer.tsx`** — shared footer used on every reader
  route (`/home`, `/article/[id]`, `/search`, etc.). Right side now reads:
  *"Developed by [hammer icon] Digital Hammer"*. The brand name is bold,
  recolors to the current accent on hover, and the hammer icon picks up
  `text-brand-600` so it follows the user's accent choice.
- **`app/page.tsx`** (landing page) — same attribution added to the landing
  page footer. Same styling.

### Page metadata

- **`app/layout.tsx`** — extended Next.js `<Metadata>`:
  - `applicationName: "NewsAI"`
  - `authors: [{ name: "Digital Hammer" }]`
  - `creator: "Digital Hammer"`
  - `publisher: "Digital Hammer"`

This adds proper `<meta name="author">`, `<meta name="creator">`, and
`<meta name="publisher">` tags so the attribution shows up in browser dev
tools, social-share cards, and "View Source" — not just the visible UI.

## How to verify

1. Open http://localhost:3000 — scroll to the very bottom of the landing
   page. Right-side: *Developed by 🔨 Digital Hammer*.
2. Sign in → land on `/home` → scroll to the footer. Same credit.
3. View page source — `<meta name="author" content="Digital Hammer">` and
   friends present in `<head>`.
4. Hover the brand name — it tints to the current accent color (try
   switching accents in `/settings` and reloading).

## Files touched

- Modified: `components/layout/Footer.tsx`, `app/page.tsx`, `app/layout.tsx`
