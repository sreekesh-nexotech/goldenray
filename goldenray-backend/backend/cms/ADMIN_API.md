# Admin API contract — custom admin UI ("Content Studio")

Base URL: `http://<backend-host>/admin-api/`
All endpoints require `Authorization: Bearer <access-token>` (JWT) unless noted.
This document is organized **screen by screen** to match the admin UI design.

> The public blog keeps reading the separate delivery API at `/api/<collection api_uid>`
> (Strapi v5 flat shape). Nothing in this document affects that contract.

---

## Conventions

**Pagination** — every list endpoint is page-number paginated (25/page):

```json
{ "count": 11, "next": "…?page=2", "previous": null, "results": [ … ] }
```

Use `?page=N`. `count` is the total (drives list badges if you don't use the dashboard endpoint).

**Validation errors** — `400` with a field-keyed object:

```json
{ "slug": ["An entry with this slug already exists in this collection."] }
{ "non_field_errors": ["This template already has an image group with this key."] }
```

**Auth errors** — `401` invalid/expired token → try `refresh`, then re-login. `403` role not allowed.

**Trailing slashes are required** (`/admin-api/entries/`, not `/admin-api/entries`).

---

## 1 · Login & session

| Method | URL | Body → Response |
|---|---|---|
| POST | `auth/login/` | `{username, password}` → `{access, refresh}` |
| POST | `auth/refresh/` | `{refresh}` → `{access, refresh}` (refresh tokens rotate — always store the new one) |
| GET | `auth/me/` | current user (shape below) |

`auth/me/` response — drives the sidebar footer ("Sree Nath · Admin") and UI gating:

```json
{
  "id": 1, "username": "sree", "email": "…", "first_name": "Sree", "last_name": "Nath",
  "role": "admin",                  // "admin" | "editor" | "author"
  "can_publish": true,              // gate the Publish button
  "can_edit_schema": true,          // gate Collections/Templates/Roles & access screens
  "is_staff": true, "is_active": true,
  "last_login": "…", "date_joined": "…"
}
```

Roles: **admin** = everything · **editor** = author + publish, no schema/users · **author** = drafts only.
The backend enforces all of this server-side too — the flags are for hiding buttons, not security.

Access-token lifetime: 12 h dev / 30 min prod; refresh 10 days. There is no logout endpoint — discard tokens client-side.

---

## 2 · Shell (header + sidebar)

**GET `config/`** — static site metadata, fetch once at boot:

```json
{
  "environment": "production",             // header pill: "flarize.com · production"
  "site_url": "https://flarize.com",       // "Preview site" link target
  "blog_path": "/blog",                    // entry preview URL = site_url + blog_path + "/" + slug
  "media_base_url": "https://…",
  "delivery_api_base": "/api"
}
```

**GET `dashboard/`** — one call for the Dashboard page **and** the sidebar count badges:

```json
{
  "counts": {
    "collections": 3, "entries": 11, "entries_draft": 4, "entries_published": 7,
    "templates": 2, "media_assets": 4, "authors": 1, "categories": 5, "tags": 8, "badges": 2
  },
  "recent_entries": [ /* 5 most recently updated, list-row shape (§4) */ ]
}
```

---

## 3 · Collections screen

`GET/POST collections/` · `GET/PATCH/DELETE collections/{id}/` — writes are **admin-only**.

```json
{ "id": 1, "api_uid": "articles", "singular_name": "Article", "plural_name": "Articles",
  "description": "", "is_active": true }
```

`api_uid` is the public delivery route (`/api/articles`) — treat as immutable once live.

---

## 4 · Entries screen (list)

`GET entries/` returns **slim rows** (no bodies/images/SEO — open the editor via detail):

```json
{
  "id": 7, "document_id": "uuid", "collection": 1, "collection_uid": "articles",
  "collection_name": "Articles", "template": 2, "template_slug": "solar-guide",
  "title": "…", "slug": "…", "excerpt": "…", "status": "draft",
  "author_name": "Flarize Editorial", "cover_url": "https://…",
  "is_featured": false, "sort_order": null,
  "published_on": null, "published_at": null, "created_at": "…", "updated_at": "…"
}
```

Filters (combinable): `?collection=<id|api_uid>` · `?status=draft|published` · `?category=<id>` ·
`?tag=<id>` · `?template=<id>` · `?author=<id>` · `?search=<title/slug substring>` ·
`?ordering=<field>` with `field` ∈ `title, slug, status, sort_order, created_at, updated_at, published_on, published_at` (prefix `-` for descending).

---

## 5 · Edit entry screen

### 5.1 Read — `GET entries/{id}/`

Full shape; relations are **expanded objects** on read:

```json
{
  "id": 7, "document_id": "uuid",
  "collection": 1, "collection_uid": "articles",
  "template": 2, "template_slug": "solar-guide",

  "title": "…", "slug": "…", "excerpt": "…",
  "summary": [ /* blocks */ ], "introduction": [ /* blocks */ ],
  "is_featured": false, "sort_order": null, "published_on": null,

  "author": { "id": 1, "name": "Flarize Editorial", "bio": null, "role": null },
  "categories": [ { "id": 1, "name": "…", "slug": "…" } ],
  "tags": [ { "id": 1, "name": "…" } ],
  "badges": [ { "id": 1, "label": "…", "color": "#123532" } ],

  "content_blocks": [ { "id": 3, "component": "shared.rich-text", "body": [ /* blocks */ ], "order": 0 } ],
  "images": [ { "id": 9, "group_key": "coverImg", "position": 0, "media_asset": 4, "external_url": "" } ],
  "attribute_values": [ { "id": 2, "slot_key": "readTime", "value": 6 } ],
  "seo": { "meta_title": "…", "meta_description": "…", "canonical_url": null, "keywords": null },

  "status": "draft", "published_at": null,
  "read_time": null, "warning": null, "insights": null, "cover_image": null,   // legacy — see 5.5
  "created_at": "…", "updated_at": "…"
}
```

Rich text (`summary`, `introduction`, `content_blocks[].body`) is a **Strapi-blocks JSON array** —
same format the delivery API emits; store what your editor component produces.

### 5.2 Write — `POST entries/` / `PATCH entries/{id}/`

One call saves everything. Relations are **ids** on write; response is the full read shape.

```json
{
  "collection": 1, "template": 2,
  "title": "…", "slug": "top-5-solar-panel-maintenance-tips", "excerpt": "…",
  "introduction": [ /* blocks */ ],
  "author": 1, "categories": [1, 2], "tags": [3], "badges": [],
  "content_blocks": [ { "component": "shared.rich-text", "body": [ … ], "order": 0 } ],
  "images": [
    { "group_key": "coverImg",     "position": 0, "media_asset": 4 },
    { "group_key": "socialSharing","position": 0, "media_asset": 5 },
    { "group_key": "bodyImages",   "position": 0, "media_asset": 6 },
    { "group_key": "bodyImages",   "position": 1, "external_url": "https://cdn…/x.webp" }
  ],
  "attribute_values": [
    { "slot_key": "readTime", "value": 6 },
    { "slot_key": "badge",    "value": "NABCB Certified" },
    { "slot_key": "insights", "value": "…" },
    { "slot_key": "warning",  "value": "…" }
  ],
  "seo": { "meta_title": "…", "meta_description": "…", "canonical_url": null, "keywords": "a, b" }
}
```

⚠️ On PATCH, `content_blocks` / `images` / `attribute_values` are **replace-all**: sending the key
replaces the full set (send every row, ids optional/ignored); omitting the key leaves it untouched.
`categories`/`tags`/`badges` likewise replace the full set when sent. Each image row uses **either**
`media_asset` (id from §7) **or** `external_url`.

Drafts save loose — required-ness is only enforced at publish (§5.4).

### 5.3 Slug field

`GET entries/check-slug/?collection=<id|api_uid>&slug=<candidate>[&exclude=<entry id>]`

```json
{ "slug": "top-5-solar-panel-maintenance-tips", "available": true, "suggestion": "top-5-…" }
```

The input is slugified server-side, so you can pass the raw title (↻ regenerate button) or a
hand-typed slug. Pass `exclude` when editing an existing entry. Saving still re-validates —
`400 {"slug": ["An entry with this slug already exists in this collection."]}` on a race.

### 5.4 Publish state panel

| Action | Endpoint | Notes |
|---|---|---|
| Save draft | `PATCH entries/{id}/` | any role |
| Publish | `POST entries/{id}/publish/` (no body) | editor/admin; validates against template |
| Unpublish | `POST entries/{id}/unpublish/` | editor/admin |
| Duplicate | `POST entries/{id}/duplicate/` | → `201` new draft, `-copy` slug |
| Discard / Delete | `DELETE entries/{id}/` | |

Publish failure → `400`, render `errors` one per line:

```json
{
  "detail": "Image group 'Cover image' (coverImg) requires at least one image. Attribute 'Read time' (readTime) is required.",
  "errors": [
    "Image group 'Cover image' (coverImg) requires at least one image.",
    "Attribute 'Read time' (readTime) is required."
  ]
}
```

Success (any workflow action) returns the fresh full entry — `status`, `published_at` update from it.
"Last published" = `published_at`; `published_on` is the author-set *display* date (auto-filled on first publish if empty).

### 5.5 Legacy fields — do not build UI for these

`read_time`, `warning`, `insights`, `cover_image` are top-level Entry columns from the pre-template
(Django admin) era. The **canonical** channel for the new UI is `attribute_values` + `images`
driven by the template. The delivery API resolves both: legacy columns win when set, otherwise it
falls back to the well-known keys — attribute slots `readTime` / `warning` / `insights` and the
`coverImg` image group. So: use those exact keys in your templates for these concepts, don't write
the legacy fields, and ignore them on read.

---

## 6 · Templates screen

Templates define what the entry editor renders: image groups + typed attribute slots.

`GET/POST templates/` · `GET/PATCH/DELETE templates/{id}/` — writes **admin-only**.

```json
{
  "id": 2, "name": "Solar guide", "slug": "solar-guide", "description": "",
  "is_active": true, "sort_order": 0,
  "image_groups": [
    { "id": 1, "template": 2, "key": "coverImg",      "label": "Cover image",       "repeatable": false, "max_items": null, "required": true,  "order": 0 },
    { "id": 2, "template": 2, "key": "socialSharing", "label": "Social share card", "repeatable": false, "max_items": null, "required": false, "order": 1 },
    { "id": 3, "template": 2, "key": "bodyImages",    "label": "Body gallery",      "repeatable": true,  "max_items": 8,    "required": false, "order": 2 }
  ],
  "attribute_slots": [
    { "id": 1, "template": 2, "key": "readTime", "label": "Read time (min)", "type": "number", "options": {}, "required": false, "order": 0 },
    { "id": 2, "template": 2, "key": "badge",    "label": "Reviewed by",     "type": "enum",   "options": { "choices": ["NABCB Certified", "MNRE Approved"] }, "required": false, "order": 1 },
    { "id": 3, "template": 2, "key": "insights", "label": "Key insight",     "type": "text",   "options": {}, "required": false, "order": 2 },
    { "id": 4, "template": 2, "key": "warning",  "label": "Important warning","type": "text",  "options": {}, "required": false, "order": 3 }
  ]
}
```

**Render the editor's Images and Attributes sections from this** (chips like `single`,
`repeatable · max 8`, `readTime · number` all come straight from these objects). Slot `type` ∈
`text | richtext_blocks | number | boolean | date | enum | url`; `attribute_values[].value` is free
JSON matching the type (`enum` value = one of `options.choices`).

Nested groups/slots are read-only on the template endpoint — manage them via their own CRUD
(admin-only), each carrying a writable `template` id:

- `template-image-groups/` (+ `?template=<id>` filter) — fields as above
- `template-attribute-slots/` (+ `?template=<id>` filter) — fields as above

Delivery: the well-known keys (`readTime`, `warning`, `insights`, `coverImg`) map onto fixed
delivery fields (§5.5); **all** slot values are additionally delivered as an
`attributes: { <slot_key>: value }` object on the public payload, so custom slots (e.g.
`difficulty`) reach the blog too.

`key` is the frozen contract with the public delivery payload — freely rename `label`, never `key`.
Duplicate keys → `400 {"non_field_errors": ["This template already has an … with this key."]}`.

---

## 7 · Media library screen

`media-assets/` — list / upload / edit metadata / delete. Filters: `?collection=<id|api_uid>`, `?search=` (filename/alt).

```json
{
  "id": 4, "file": "blog/roof.jpg", "collection": 1,
  "url": "https://cdn…/cms/articles/roof.webp",     // ALWAYS render this — CDN copy wins, local fallback
  "cdn_url": "https://cdn…", "mime": "image/jpeg", "size": 182034,
  "width": 1920, "height": 1080,
  "alternative_text": "…", "caption": "…", "created_at": "…"
}
```

- **Upload**: `POST` as `multipart/form-data` — `file` (required, image) + optional `collection`,
  `alternative_text`, `caption`. Backend compresses → WebP → BunnyCDN automatically.
- **Edit**: `PATCH media-assets/{id}/` (JSON) — metadata only (`alternative_text`, `caption`,
  `collection`); the file itself is immutable — replace = upload new + re-link.
- **Delete**: `DELETE` — also removes the CDN copy. Entry rows referencing it keep existing but
  resolve to no image, so warn before deleting.

Editor flow: "Choose" → pick/upload here → put the asset `id` into the entry's `images` row (§5.2).

---

## 8 · Authors & tags screen

Standard CRUD, any authenticated role; paginated list shape:

| Resource | Fields |
|---|---|
| `authors/` | `{ id, name, bio, role }` |
| `categories/` | `{ id, name, slug }` |
| `tags/` | `{ id, name }` (name unique) |
| `badges/` | `{ id, label, color }` |

The Organize panel's `+` chips can `POST` here inline, then attach the returned id to the entry.

---

## 9 · Roles & access screen

`auth/users/` — **admin role only** (others get `403`).

- `GET auth/users/` / `GET auth/users/{id}/` — read shape = §1 `me` shape.
- `POST auth/users/` — `{username, password, role, email?, first_name?, last_name?, is_active?}`.
  Password is validated (min length, not-common, etc.) → field errors on `400`.
- `PATCH auth/users/{id}/` — any subset; include `password` only to reset it.
- `DELETE auth/users/{id}/` — **deactivates** (`is_active: false`, keeps authorship history);
  returns `204`. Deleting your own account → `400`.

---

## Screen → endpoint map

| Screen | Endpoints |
|---|---|
| Login | `auth/login/`, `auth/refresh/`, `auth/me/` |
| Shell / header | `config/`, `auth/me/` |
| Dashboard + sidebar badges | `dashboard/` |
| Collections | `collections/` |
| Entries (list) | `entries/` + filters |
| Edit entry | `entries/{id}/`, `check-slug/`, `publish/`, `unpublish/`, `duplicate/`, `templates/{id}/` (form schema), `media-assets/` (pickers) |
| Templates | `templates/`, `template-image-groups/`, `template-attribute-slots/` |
| Media library | `media-assets/` |
| Authors & tags | `authors/`, `categories/`, `tags/`, `badges/` |
| Roles & access | `auth/users/` |
| Delivery API (docs page) | public `/api/<api_uid>` — read-only reference |

### Backend env vars the frontend team should know

| Var | Purpose |
|---|---|
| `FRONTEND_BASE_URL` | `config.site_url` — Preview-site + slug-preview links |
| `CORS_ALLOWED_ORIGINS` | must include the admin UI's origin in production |
| `PUBLIC_MEDIA_BASE_URL` | absolute prefix for non-CDN media URLs |
