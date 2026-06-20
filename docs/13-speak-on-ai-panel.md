# 13 — Speak option inside the AI Assistant panel

← back to [`read.md`](../read.md)

## The ask

> "add option on this to speak" — pointing at the AI Assistant panel
> Summary tab — 2026-06-20

The AI Assistant panel renders summary text on three tabs (Summary,
Bullets, Takeaways). The user wants a speak button right there so they
can hear the summary read aloud, with the language they pick.

## What shipped

A new **SpeakInline** pill now appears at the top-right of each summary
tab in the AI Assistant panel — Summary, Bullets, and Takeaways. It
reads aloud whatever text is currently rendered on that tab.

The control:

- A **Speak** button (speaker icon → flips to Pause + brand-coloured
  ring while playing).
- A **language chip** showing the chosen language in its native script
  (हिन्दी, தமிழ், বাংলা, …). Tap to open a dropdown with all 23
  languages (English + 22 official Indian languages). Picking a
  different language stops the current playback so two voices never
  collide.

## How it picks the text

| Tab | Text spoken |
|---|---|
| Summary | `article.summary` (the short one) |
| Bullets | The bullets joined with ". " so the synthesizer pauses between them |
| Takeaways | Same join pattern for the key-takeaways list |

The Listen tab still speaks the **full** article (title + summary +
body). SpeakInline on Summary/Bullets/Takeaways is for the much shorter
AI-generated outputs — usually a few seconds to read.

## How it picks a voice

Same model as [`docs/11`](11-indian-languages-speak-and-read.md) and
[`docs/12`](12-speak-button-on-news-card.md):

- Defaults to the user's Settings locale.
- Tags the utterance with the language's BCP-47 locale (`hi-IN`,
  `bn-IN`, …) so the OS picks a matching voice.
- Picks the first system voice whose ISO-639 prefix matches.
- Only one utterance plays globally — switching tabs or hitting another
  card's speak control cancels the previous one.

## How to verify

1. `npm run dev` → http://localhost:3000.
2. Open [`/article/a1`](http://localhost:3000/article/a1).
3. The AI Assistant panel opens on **Summary**. A **🔊 Speak | हिन्दी ▾**
   pill sits at the top-right of the summary text.
4. Click **Speak** — the summary reads aloud in your current language.
5. Click the language chip → pick **हिन्दी** → **Play**. You hear the
   summary spoken with a Hindi voice (if installed).
6. Switch to the **Bullets** tab — the same pill is there; it now reads
   the bullet list. Same for **Takeaways**.
7. Click another speak control elsewhere on the page (e.g. a card's
   speak button) — the panel's audio stops.

## Files touched

- New: `components/ai/SpeakInline.tsx`,
  `docs/13-speak-on-ai-panel.md`
- Modified: `components/ai/AIPanel.tsx` (renders `<SpeakInline />` above
  every Summary/Bullets/Takeaways tab content), `read.md` (change log
  entry)
