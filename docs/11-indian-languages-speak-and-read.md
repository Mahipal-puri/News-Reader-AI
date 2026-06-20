# 11 — All 22 Indian languages: speak + read

← back to [`read.md`](../read.md)

## The ask

> "there are many state in india and many lang , i need all india lang
> to speak and read the news" — 2026-06-20

All 22 official Indian languages should both **read** (translated text) and
**speak** (text-to-speech) the news, not just English/Hindi.

## What we already had vs. what was missing

The picker in [`lib/languages.ts`](../lib/languages.ts) already listed
English + the 22 official Indian languages (from
[`docs/04`](04-languages-and-accent-theme.md)). What didn't work:

- **Voice Reader** spoke whatever the user picked from the OS voice list,
  but ignored the article's language. Pick a Hindi voice and it would
  still speak the English article text in Hindi-accented English. No
  language-first picker.
- **Translations** only existed for `hi` and `es` on a few articles. No
  Bengali, Tamil, Telugu, Marathi, Gujarati, etc.

## What shipped

### 1. BCP-47 locale on every language

[`lib/languages.ts`](../lib/languages.ts) — each `Language` now carries a
`locale: string` BCP-47 tag (`hi-IN`, `bn-IN`, `ta-IN`, …). This is what
`SpeechSynthesisUtterance.lang` needs to pick the right OS voice when
multiple are installed, or to fall back gracefully when one isn't.

### 2. Voice helper API

[`lib/ai/voice.ts`](../lib/ai/voice.ts) — `speak()` accepts a `lang`
option, and a new `voicesForLang(prefix)` filters
`speechSynthesis.getVoices()` by ISO-639 prefix. Both use a single
`langPrefix(tag)` helper so `"en-US"`, `"en_GB"`, `"en"` all normalise.

### 3. Voice Reader rewrite

[`components/ai/VoiceReader.tsx`](../components/ai/VoiceReader.tsx) is
now language-first:

- **Top "Read in" selector** with all 23 languages (English + 22 Indian),
  defaulting to the user's Settings locale.
- **Voice picker** filtered to that language only ("Voice — 3 for
  Hindi"). Disabled with a helpful zero-state banner when no matching
  voice is installed, with copy-paste instructions for adding one on
  Windows or macOS.
- **Utterance gets `u.lang = locale`** so the synthesizer picks the
  closest installed voice for that locale even if the user doesn't pick
  one manually.
- **Speaks the translated headline + summary** when a translation is
  seeded for the chosen language (Tamil, Telugu, Bengali, Hindi, Marathi,
  Gujarati on `a1`). Falls back to speaking the English text with the
  chosen-language voice when no translation is available — clearly
  labeled "pronunciation will be approximate."
- **Switching language stops the current playback** so you don't get two
  voices fighting.

### 4. Seeded translations for `a1`

[`data/articles.json`](../data/articles.json) — article `a1` now has
translations for `es, hi, bn, ta, te, mr, gu`. Title + summary only.
That's 6 Indian-language pairs out of 22; the rest are flagged honestly
as "would come from a backend service like
[Bhashini](https://bhashini.gov.in/)" — both in TranslateMenu (existing
text) and in the Voice Reader hint.

## How to verify

1. `npm run dev` → http://localhost:3000.
2. Open [`/article/a1#listen`](http://localhost:3000/article/a1#listen).
3. The AI panel opens straight to **Listen**.
4. In the **Read in** dropdown, pick **Hindi — हिन्दी**. The Voice picker
   filters to your installed Hindi voices (Microsoft Hemant, Microsoft
   Kalpana, Google हिन्दी on Chrome, etc.).
5. Press **Listen** — you hear the Hindi headline read aloud in Hindi.
   Switch to **Tamil — தமிழ்** → if you have a Tamil voice installed,
   you hear the Tamil headline.
6. Pick a language with no installed voice (e.g. **Bodo**) → the Listen
   button disables and the amber banner explains how to install one.

## Honest limits

- **Translation is mocked.** Only 6 of the 22 Indian languages have real
  translations on `a1` (and 0 on other articles). For everything else the
  Listen tab falls back to speaking the English text with the chosen
  language's voice. Plug in Bhashini / Google Translate at the
  `mockBaseQuery` boundary for real translations.
- **TTS coverage depends on the user's OS.** Windows 10/11 ships Hindi
  and a few others by default; Linux usually ships only English. We
  surface the gap clearly rather than failing silently.
- **Voice quality varies.** Google Chrome's bundled voices (when online)
  sound much better than the local SAPI voices on Windows. We use
  whatever the browser exposes.

## Files touched

- New: `docs/11-indian-languages-speak-and-read.md`
- Modified: `lib/languages.ts` (added BCP-47 locale to every entry),
  `lib/ai/voice.ts` (added `lang` option + `voicesForLang` helper),
  `components/ai/VoiceReader.tsx` (rewrite with language picker + voice
  filter + zero-state guidance),
  `data/articles.json` (added bn/ta/te/mr/gu translations for `a1`),
  `read.md` (change log entry)
