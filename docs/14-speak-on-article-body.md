# 14 — Speak button on the article body

← back to [`read.md`](../read.md)

## The ask

> "in ai assitant to add button on add button to speak" — pointing at
> the article body prose (the "A survey of two thousand large
> employers…" paragraphs) — 2026-06-20

The AI Assistant tabs already each have a speak control (per
[`docs/13`](13-speak-on-ai-panel.md)). The user also wants one **on the
article body itself** so you can press it where you're already reading,
without opening the side panel.

## What shipped

A small **Article ▾ | 🔊 Listen | हिन्दी ▾** header now sits directly
above the article body on `/article/[id]`. It uses the same
[`SpeakInline`](../components/ai/SpeakInline.tsx) component as the AI
panel, but with the label **Listen** and the full body text payload.

What it speaks:

```
title + summary + every visible paragraph of the body
```

Premium paywall is respected — when a free user hits a locked article,
only the first 2 paragraphs are visible, so only those get spoken. After
they upgrade, the full body is spoken.

Behavior is the same as elsewhere:

- Defaults to the user's Settings locale.
- Language chip opens a dropdown with all 23 languages (English + 22
  official Indian languages).
- Tags the utterance with the matching BCP-47 locale (`hi-IN`, `bn-IN`,
  `ta-IN`, …) so the OS picks a matching voice.
- Only one utterance plays globally — pressing Listen here cancels any
  card-level or AI-panel speech that's already running.

## How it relates to the existing Listen tab

The AI Assistant **Listen** tab still exists — it has the fuller voice
picker (filter by language, count of installed voices, speed slider,
zero-state guidance for missing TTS voices). The new article-body
button is the **quick** version: one click and it reads.

Use the article-body button for casual hands-free reading. Use the
Listen tab when you need to switch voice families or troubleshoot a
missing language.

## How to verify

1. `npm run dev` → http://localhost:3000/article/a1.
2. Below the image you now see an **Article** header with a
   **🔊 Listen | <native-lang> ▾** pill on the right.
3. Click **Listen** — the article reads from the title through every
   paragraph. Icon flips to Pause; brand ring appears.
4. Click the language chip → pick **हिन्दी** → **Play**. You hear it
   read in a Hindi system voice (if installed).
5. Open [`/article/a4`](http://localhost:3000/article/a4) as a Reader
   (not Premium). The body cuts off after 2 paragraphs; click Listen
   and only those 2 paragraphs are spoken. Upgrade to Premium →
   Listen now speaks the full body.

## Files touched

- New: `docs/14-speak-on-article-body.md`
- Modified: `app/(reader)/article/[id]/page.tsx` (renders
  `<SpeakInline>` above the article body, fed the visible paragraphs
  so the paywall is respected), `read.md` (change log entry)
