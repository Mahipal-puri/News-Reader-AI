# 12 — Speak button on every news card

← back to [`read.md`](../read.md)

## The ask

> "add speaf option on new , it mean the new in speak to new and hear
> the sound and user change the lang of sound" — 2026-06-20

Add a speak option on each news item — click it to hear the news, and
let the user change the language of the sound.

## What shipped

A new **SpeakButton** appears on every news card across the app — Home
feed, category pages, search results, bookmarks, Most Read, anywhere
[`ArticleCard`](../components/article/ArticleCard.tsx) renders. No need
to open the article first.

The control is a two-piece pill:

1. **Speaker icon** — tap to start; the icon turns into a Pause and the
   button gets a brand-coloured ring while reading.
2. **Language chip** — shows the current language in its native script
   (हिन्दी, தமிழ், বাংলা, …). Tap to open a small dropdown with all 23
   languages (English + 22 official Indian languages). Picking a
   different language stops the current playback so two voices never
   collide.

## How it picks a voice

- Reads the user's Settings locale as the default language; clicking the
  language chip overrides per-card.
- Tags the utterance with the matching **BCP-47 locale** (`hi-IN`,
  `bn-IN`, `ta-IN`, …) and picks the first installed system voice whose
  language prefix matches.
- Speaks the **translated title + summary** when a translation is seeded
  for that language (e.g. article `a1` has Hindi, Bengali, Tamil,
  Telugu, Marathi, Gujarati). Falls back to the English title + summary
  with the chosen-language voice when no translation exists.
- Only one utterance plays at a time. `speak()` calls `cancel()` first,
  which fires the previous utterance's `onend` and resets the
  previously-playing card back to its idle state.

## How it integrates with the card

- Featured (hero) card: speak control sits in the top-right of the image
  overlay, white-on-black tone.
- Compact card: same top-right overlay, next to the bookmark button.
- List card: right rail, under the bookmark button.

All variants stop the underlying `<Link>` from navigating when the user
interacts with the speak control (`e.preventDefault()` +
`e.stopPropagation()`), so clicking the speaker reads aloud instead of
opening the article.

## How to verify

1. `npm run dev` → http://localhost:3000/home.
2. Each card now shows a speaker pill in its top-right corner.
3. Click the speaker on the featured article (a1) — you hear the
   headline + summary in your current language. The icon flips to Pause
   and the button gets a brand-coloured ring.
4. Click the chip showing **English** → dropdown opens → choose
   **हिन्दी** → click **Play**. You hear the Hindi headline read aloud
   in a Hindi system voice (if installed).
5. Switch to a card lower on the page and click its speaker — the first
   card stops, the second one starts.
6. Try a language without an installed voice (e.g. Bodo). The
   synthesizer either falls back to a default voice or stays silent; the
   detail-page Voice Reader (`/article/a1#listen`) is where the full
   zero-state guidance lives.

## Files touched

- New: `components/article/SpeakButton.tsx`,
  `docs/12-speak-button-on-news-card.md`
- Modified: `components/article/ArticleCard.tsx` (speak control wired
  into all three variants), `read.md` (change log entry)
