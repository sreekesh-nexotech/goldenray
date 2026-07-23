# Content Studio (blog CMS) — presentation layer

A pixel-perfect rebuild of the **Flarize Content Studio** design (blog CMS for
flarize.com). This session delivered the **presentation layer only** — every
screen renders from static seed data and all mutations are local UI state /
toast stubs. API integration is a later session.

## Routes (`src/app/studio`)

| Route | Screen |
| --- | --- |
| `/studio` | redirects → `/studio/dashboard` |
| `/studio/login` | Sign in (standalone, outside the shell) |
| `/studio/dashboard` | Dashboard (counts + recently edited) |
| `/studio/collections` | Collections |
| `/studio/entries` | Entries list (tabs, filters, bulk, pagination) |
| `/studio/entries/[id]` | Entry editor (`new` id = blank draft) |
| `/studio/templates` | Template builder |
| `/studio/media` | Media library (+ asset drawer) |
| `/studio/taxonomy` | Authors & taxonomy |
| `/studio/delivery-api` | Delivery API reference |
| `/studio/roles` | Roles & access (+ invite) |

`src/app/studio/(app)/layout.tsx` wraps the authenticated screens in
`StudioShell` (sidebar + topbar). `ConditionalLayout` treats every `/studio`
path as standalone, so the marketing header/footer never render here.

## Components (`src/components/Studio`)

- `shell/` — `StudioShell`, `Sidebar`, `Topbar`, `Wordmark`.
- `shared/` — `StudioContext` (role preview + tips + toasts), `primitives.tsx`
  (Card, StatusPill, buttons, form fields, table styles…), `overlays.tsx`
  (Modal, DropdownMenu, ToastHost), `format.ts` (statusPill, humanTime,
  slugify, colours, fonts).
- One folder per screen (`Dashboard/`, `Collections/`, `Entries/`,
  `EntryEditor/`, `Templates/`, `Media/`, `Taxonomy/`, `DeliveryApi/`,
  `Roles/`, `SignIn/`).

## Where the data lives — the API swap point

All content is static under **`src/data/studio/`** and re-exported from
`src/data/studio/index.ts`. Components import named exports from
`@/data/studio` and never inline data, so wiring the admin API is a matter of
replacing each export with a service call that returns the same shape (types in
`src/types/studio.ts`):

`authors`, `categories`, `tags`, `badges`, `members`, `currentUser`,
`collections`, `templates`, `assets`, `mediaFolders`, `entries`,
`rolePermissions`, `roleOptions`.

`STUDIO_NOW` in `constants.ts` is the fixed reference clock for relative
timestamps — swap for `Date.now()` with live data.

## Not in scope (this session)

Real auth, persistence, uploads, and any server calls. Publish / save / delete /
invite / copy actions are presentation stubs that raise a toast.
