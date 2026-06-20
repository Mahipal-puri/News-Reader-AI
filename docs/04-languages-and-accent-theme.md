# 04 — Indian languages + user-selectable accent theme

← back to [`read.md`](../read.md)

## The ask

> "add language change all avialble in india and all change the theme acc to user"
> — 2026-06-20

Two features: support every official language of India in the language picker,
and let the user pick their own theme accent color.

## What was done

### Languages — English + the 22 scheduled languages of India

- **New file `lib/languages.ts`** — exports `LANGUAGES` array of 23 entries.
  Each has `code` (ISO 639), `name` (Latin), and `native` (own script).
  Includes: Hindi, Bengali, Telugu, Marathi, Tamil, Urdu, Gujarati, Kannada,
  Malayalam, Odia, Punjabi, Assamese, Maithili, Sanskrit, Nepali, Sindhi,
  Kashmiri, Konkani, Manipuri, Dogri, Bodo, Santali.
- **`preferencesSlice`** — `locale` widened from `"en"|"hi"|"es"` to
  `LanguageCode`. `setLocale` action accepts any of the 23 codes.
- **Settings page** — replaced the 3-button language strip with a searchable
  grid (English name + native script + ISO code search). Each tile carries
  `lang={code}` so screen readers and font fallback pick the right script.
- **TranslateMenu (article AI panel)** — full `<select>` of all 23 languages
  plus the first 6 as quick-pick buttons. Defaults to the user's Settings
  locale and follows changes live. Renders an honest stub when no
  pre-seeded translation exists, pointing at Bhashini / Google Translate as
  the production path.

### Theme — runtime-switchable accent color

Six accents: **Ocean** (default blue), **Violet**, **Rose**, **Emerald**,
**Amber**, **Teal**.

- **`tailwind.config.ts`** — `brand-50` … `brand-900` rewritten from
  hardcoded hex to `rgb(var(--brand-X) / <alpha-value>)` so every existing
  Tailwind utility (`bg-brand-600`, `text-brand-700/40`, etc.) now reads from
  CSS variables.
- **`globals.css`** — defines defaults under `:root` (blue) and overrides
  per `[data-accent="violet"]`, `[data-accent="rose"]`, etc. Full 50–900
  scale per accent.
- **`preferencesSlice`** — new `accentColor: "blue"|"violet"|"rose"|"emerald"|"amber"|"teal"`
  field + `setAccentColor` action. Persists to localStorage with the rest of
  preferences.
- **`components/providers/AccentSync.tsx`** — tiny client component mounted
  inside `ReduxProvider`. Watches `state.preferences.accentColor` and sets/
  removes `data-accent` on `<html>` via `useEffect`. SSR-safe.
- **Settings page** — Palette section with 6 swatch buttons. Active swatch
  shows a check + brand-tinted ring.

### What now follows the accent

Buttons, links, focus rings, role badges, active nav items, the article
category pill, the reading-progress gradient, sidebar highlights, the
landing-page gradient text — everything that used `brand-*` Tailwind classes
recolors instantly.

## How to verify

1. `/settings` → **Accent color** → pick Rose. CTA buttons, focus rings, the
   active nav item all turn rose-pink without a reload.
2. Open any article → reading-progress bar at top is now a rose-pink gradient.
3. Refresh the page — accent persists (localStorage).
4. `/settings` → **Language** → search "Tamil" → tap. Open any article →
   Translate tab → Tamil is preselected; the title and summary render in
   Tamil script (stub for non-seeded articles, real for article #1).
5. Combine: pick Emerald accent + Bengali language + Dark theme. All three
   compose independently.

## Files touched

- New: `lib/languages.ts`, `components/providers/AccentSync.tsx`
- Modified: `tailwind.config.ts`, `app/globals.css`,
  `store/slices/preferencesSlice.ts`,
  `components/providers/ReduxProvider.tsx`,
  `app/(reader)/settings/page.tsx`,
  `components/ai/TranslateMenu.tsx`
