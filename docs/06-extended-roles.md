# 06 — Reporter, Sub-Admin, Super-Admin roles

← back to [`read.md`](../read.md)

## The ask

> "give the new reporter admin, sub admin super admin"
> — 2026-06-20

Add Reporter, Sub-Admin, and Super-Admin alongside the existing roles, and
give the user a way to switch into any of them to preview what each role
sees and can do.

## Role model (full hierarchy, low → high)

Grouped by intent. Higher level = more privileges. `level` is just a
numeric hint, not a hard gate.

| Group | Role | Level | What they can do (short) |
|---|---|---:|---|
| Audience | Guest | 0 | Browse news, search, view categories |
| Audience | Reader | 10 | + save, follow, alerts, comment, like |
| Audience | Premium | 20 | + ad-free, unlimited bookmarks, AI insights |
| Editorial | **Reporter** *(new)* | 30 | Draft & submit stories, track status, receive editor feedback |
| Editorial | Editor | 40 | Review submissions, verify content, manage featured stories |
| Admin | **Sub Admin** *(new)* | 60 | Moderate comments & reports, manage assigned categories, limited analytics |
| Admin | Admin | 80 | Manage all users & roles, full analytics, audit logs |
| Admin | **Super Admin** *(new)* | 100 | Everything Admin + promote/demote any role, system config, billing |

## What was done

### New types & helpers

- **`types/index.ts`** — widened `Role` union to include `"reporter"`,
  `"sub-admin"`, `"super-admin"`.
- **`lib/roles.ts`** *(new)* — single source of truth: `ROLES` array with
  per-role metadata (label, short tagline, level, group, icon, color tone,
  capabilities list). Exports helpers: `getRole(id)`, `isAdminRole(id)`,
  `isEditorialRole(id)`, `canModerate(id)`.

### UI

- **`components/ui/RoleBadge.tsx`** — now driven by `lib/roles.ts`. New
  `withIcon` prop renders the role's lucide icon inside the pill. Each role
  gets its own color tone.
- **Navbar** + **Profile page** — pass `withIcon` so the active role pill
  shows its icon next to the user's name.
- **Settings page** — new **Role** section under Membership. Three grouped
  panels (Audience / Editorial / Administration), each role rendered as a
  card with its icon, tagline, and the top three capabilities. Click to
  switch — the `auth/setRole` Redux action is already there from the
  Premium toggle, so this just exposes it for every role.

## Demo / how to verify

1. `/settings` → scroll to **Role**.
2. Click **Reporter** → the Reader pill in the Navbar becomes Reporter, sky-blue.
3. Click **Super Admin** → pill turns fuchsia with a `ShieldCheck` icon.
4. Open Profile → role pill matches.
5. Switch back to Reader → personalized feed treats you as Reader again on
   `/home`.

## Out of scope (still)

The dashboards for these roles (Reporter submission queue, Editor review
board, Admin user table, Super Admin system console) are **not** built —
they were already out of scope in the initial frontend-only plan. This PR
only extends the role *model* and lets you assume each role. Wiring those
dashboards is a separate, larger task.

## Files touched

- New: `lib/roles.ts`, `docs/06-extended-roles.md`
- Modified: `types/index.ts`, `components/ui/RoleBadge.tsx`,
  `app/(reader)/settings/page.tsx`, `components/layout/Navbar.tsx`,
  `app/(reader)/profile/page.tsx`
