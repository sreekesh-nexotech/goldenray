# Blog CMS

A standalone Django service that **replaces Strapi** for the Golden Ray / Flarize
blog. It serves the exact Strapi-v5 flat API shape the Next.js frontend already
consumes (`frontend/src/services/blogApiService.ts`), so the blog page keeps
working with **no frontend rewrite** — and every create / update / delete an
author makes shows up on the site **dynamically**.

Built to `IMPLEMENTATION_PLAN.md`.

## Apps

| App | Responsibility |
| --- | --- |
| `accounts` | Internal `AdminUser` + roles (admin / editor / author) |
| `catalog` | `Collection`, `Template` (+ relabelable image-groups & attribute-slots), `Author`, `Category`, `Tag`, `Badge` |
| `content` | `Entry`, `ContentBlock`, `EntryImage`, `EntryAttributeValue`, `Seo` + draft/publish services |
| `media` | `MediaAsset` upload / serve |
| `delivery` | Public, Strapi-shaped read API (`/api/<collection>`) |

## Quick start (dev)

```bash
cd goldenray-backend/backend/cms
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
cp .env.example .env            # dev-safe defaults already work (SQLite)
.venv/bin/python manage.py migrate
.venv/bin/python manage.py seed_blog          # articles collection + sample entry
.venv/bin/python manage.py createsuperuser    # or reuse admin / admin12345
.venv/bin/python manage.py runserver 8009
```

- **Authoring UI:** http://localhost:8009/admin/  (Django admin — usable now)
- **Delivery API:** http://localhost:8009/api/articles?populate=*
- **Authoring API:** http://localhost:8009/admin-api/  (JWT — for a future custom admin UI)

## The contract (what the frontend calls)

The public delivery API is **read-only** and serves **published** entries only:

```
GET /api/articles?populate=*&pagination[pageSize]=100     # list page
GET /api/articles?populate=*&filters[slug][$eq]=<slug>    # single article
GET /api/articles?fields[0]=slug                          # slugs (static params)
```

Response is the Strapi v5 flat envelope `{ data: [...], meta: { pagination } }`
with fields at the top level. `imgUrls` is assembled from the entry's images
keyed by the template image-group `key` (single group → URL string, repeatable
group → array). Supported params: `populate`, `filters[…][$eq|$in|$contains|$null|$ne|$gt…]`,
`fields[]`, `pagination[page|pageSize]`, `sort[]`.

New collections (CaseStudy, Guide…) get their own route automatically:
`/api/<collection.api_uid>`.

## Dynamic updates → the blog page

1. **API is always live** — delivery reads the DB directly, so a publish is visible
   on the next request.
2. **Instant frontend refresh** — on publish / unpublish / delete the CMS POSTs to
   the frontend's `/api/revalidate` route (Next.js on-demand ISR), so `/blog` and
   `/blog/<slug>` rebuild in seconds. Configure via `FRONTEND_REVALIDATE_URL` +
   `FRONTEND_REVALIDATE_SECRET` (must match the frontend's `BLOG_REVALIDATE_SECRET`).
   Leave the URL blank to disable and fall back to the frontend's hourly ISR.

## Frontend wiring

- `frontend/src/config.ts` → `BLOG_API_BASE_URL` (env `NEXT_PUBLIC_BLOG_API_BASE_URL`).
  Dev default `http://127.0.0.1:8009/api`; prod default `https://blog.flarize.com/api`.
- `frontend/src/app/api/revalidate/route.ts` → on-demand revalidation webhook.
- No change to `blogApiService.ts` transforms — the shape matches Strapi.

## Roles

- **admin** — manage schema (collections/templates/slots) + entries + publish
- **editor** — author + publish entries, no schema edits
- **author** — draft only (publish is blocked in the service layer)

## Production notes

- Set `DJANGO_ENV=production`, a real `DJANGO_SECRET_KEY`, `DJANGO_ALLOWED_HOSTS`,
  and switch `DB_ENGINE` to Postgres (enables JSONB indexing).
- Point `PUBLIC_MEDIA_BASE_URL` at your CDN/host so image URLs are absolute.
- To cut Strapi over with zero frontend deploy, repoint `blog.flarize.com` (or set
  `NEXT_PUBLIC_BLOG_API_BASE_URL`) at this service.
