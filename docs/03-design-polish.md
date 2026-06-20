# 03 — Modern design polish

← back to [`read.md`](../read.md)

## The ask

> "add skill acc to her"
> — 2026-06-20

Apply the `modern-web-design` skill to refine the existing app — 2024-2025
trends, no new dependencies.

## What was done

### `globals.css` — design system foundation
- Fluid typography tokens via `clamp()` (`--fs-xs` through `--fs-3xl`).
- Elevation scale (`--shadow-1`, `--shadow-2`, `--shadow-3`) with dark-mode
  variants.
- Motion easings (`--ease-out`, `--ease-spring`).
- WCAG-compliant `:focus-visible` ring; hidden for mouse-only users.
- `.glass` utility — backdrop-filter blur + saturate for frosted navbar.
- `.lift-card` + `.zoom-img` — GPU-accelerated hover lift with brand-tinted
  border and 1.04× image zoom on parent hover.
- `.stagger` — staggered entrance for grids (children animate in with
  cascading delay).
- `.press` — active-state micro-interaction for buttons.
- Drop cap on the first paragraph of `.prose-news`.
- `@media (prefers-reduced-motion: reduce)` short-circuits all of the above.

### Components
- **Navbar** (`Navbar.tsx`) + landing header (`app/page.tsx`) — switched to
  `.glass` sticky header (frosted background, no hard border).
- **ArticleCard** — replaced ad-hoc hover classes with `.lift-card` +
  `.zoom-img` on both `compact` and `featured` variants. Added
  `loading="lazy"` on images.
- **Landing hero** — fluid typography (`--fs-3xl`), arrow micro-interaction
  on the CTA, `.stagger` on the features grid.
- **Article detail** — fluid `--fs-2xl` headline, `text-pretty` dek, hero
  image gets `--shadow-2` elevation.
- **ChatWithNews** — `role="log"` + `aria-live="polite"` so screen readers
  announce new AI replies.

### New components
- **`ReadingProgress.tsx`** — fixed top progress bar that fills as you scroll
  through an article. Uses `requestAnimationFrame` for smooth updates.

### Accessibility
- Skip link in root layout (`Skip to content` → `#main`).
- `#main` landmark on reader layout's `<main>` and landing's hero `<section>`.
- Focus-visible everywhere via global CSS.
- All animations honor `prefers-reduced-motion`.

## How to verify

1. `npm run dev` — open http://localhost:3000, hard-refresh (Ctrl+Shift+R) to
   bust cached CSS.
2. Navbar should be frosted/glassy (subtle blur over scrolled content).
3. Hover any article card on `/home` — lifts 3px, image zooms slightly.
4. Open an article — fluid title size, progress bar fills at the top as you
   scroll.
5. Press Tab to navigate — keyboard focus rings visible on all interactive
   elements.
6. In OS settings → "reduce motion" → reload — all animations short-circuit.

## Constraints honored

- No new dependencies (no Framer Motion, no GSAP — Tailwind + CSS only).
- Existing component structure unchanged.
- Works with `next-themes` light/dark.
