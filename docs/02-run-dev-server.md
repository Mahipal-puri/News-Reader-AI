# 02 — Run the dev server

← back to [`read.md`](../read.md)

## The ask

> [Screenshot showing localhost:3000 — ERR_CONNECTION_REFUSED]
> "run this, i said only web appliaction no use of mobile appliactions"
> — 2026-06-20

After step 01, dependencies hadn't been installed and the dev server wasn't
running yet. Also clarification that the project is a web app, not a mobile
application.

## What was done

- `npm install` — installed Next.js 14 + React 18 + Tailwind + Redux Toolkit
  + lucide-react + next-themes (~118 packages).
- `npm run dev` — started Next dev server on port 3000 (background process).
- Verified `GET /` returns HTTP 200.
- Clarified that the project is purely a web app:
  - Next.js renders HTML/CSS/JS to a browser.
  - No React Native, no Capacitor, no native shell.
  - `MobileNav` is responsive web CSS — appears only when the *browser
    window* is narrower than 768px. Still HTML/CSS.

## How to verify

```bash
cd "c:/cluade project/New reader"
npm run dev
```

Open http://localhost:3000 in a browser. First load takes ~4s (Next dev
compile); subsequent navigation is fast.

To stop: close the terminal or kill the Next process. To restart: `npm run dev`
again.
