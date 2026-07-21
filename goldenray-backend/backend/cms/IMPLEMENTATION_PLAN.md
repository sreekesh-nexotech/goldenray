# Blog CMS (Strapi-style delivery) — Implementation Plan

> **Scope (relaxed & re-grounded):**
> - **Purpose is blogging.** Not a general-purpose Strapi clone. The system lets an internal team author blog entries across **one or more collections** (all blog-purposed — e.g. `Article`, `CaseStudy`, `Guide`), pick a **template** per entry, attach **images** and **attributes**, and serves the result to customer websites via a public read API.
> - **Separate standalone Django project** (own repo/service, not mixed into `nexocrm-django-api`). Follows the models/selectors/services/apis separation the team already uses.
> - **Single-tenant / internal.** One team authors; **public read endpoints** serve published content.
> - **Delivery API stays Strapi-shaped** because the front-end already consumes that shape — see [`strappi.ts`](./strappi.ts). We keep it compatible so the existing consumer keeps working.
>
> This document is a plan only. No code is written yet.

---

## 1. Ground truth: what the consumer actually needs

The consuming client [`strappi.ts`](./strappi.ts) tells us precisely what the API must return. The plan is built around **that contract**, not a hypothetical feature set.

Observed from the client:

- **`Article` is the collection the current client consumes**, but the design supports **multiple blog collections** (`Article`, `CaseStudy`, `Guide`, …) that share the same shape and template system. No general runtime content-type builder is required — collections are defined in code, one `Collection` row registers each.
- **Scalar fields used:** `title`, `slug`, `excerpt`, `summary` (blocks), `introduction` (blocks), `readTime`, `isFeatured`, `sortOrder`, `publishedOn`, `updatedAt`, `publishedAt`, `warning`, `insights`.
- **Relations (simple named lookups):** `author`, `categories[]`, `tags[]`, `badges[]`.
- **Rich content:** `contentBlocks[]` — a repeatable component with a `body` in **Strapi Blocks** JSON (`paragraph`/`heading`/`list` nodes → the `RichTextNode` shapes in the client).
- **Multiple images, two mechanisms:**
  - `coverImage` — a single uploaded media asset (`url`, `width`, `height`, `alternativeText`).
  - `imgUrls` — a **component with named image slots** (`coverImg`, `mainImg`, `socialSharing`, `secondaryImg`). This is exactly the user's *"predefined attributes, users can rename the label, each template can have multiple images."*
- **SEO** — a component (`metaTitle`, `metaDescription`, `canonicalUrl`, `keywords`).
- **Delivery query params actually used:** `populate=*`, `filters[slug][$eq]=`, `fields[0]=slug`, `pagination[pageSize]=`. A **small** subset — we do not need the full Strapi query language.
- **Response envelope:** Strapi v5 **flat** shape — `{ data: [...], meta: { pagination } }`, fields at the top level of each item (NOT `data.attributes`). Relations/components/media inlined when populated.

> **Consequence:** the earlier "generic content-type builder + EAV JSON store + full query language" plan is **over-engineered for this.** The relaxed plan below uses concrete, typed Django models for the blog domain and a **template + relabelable-attributes** system for the flexible parts.

---

## 2. Collections, templates & attributes (the core flexibility model)

Two requirements shape this section:
- *There can be **different collections**, all for blogging.*
- *A template must be able to have **N images** (unbounded), plus predefined, relabelable attributes.*

### 2.0 `Collection` — multiple blog collections
Each blog collection (`Article`, `CaseStudy`, `Guide`, …) is registered as a `Collection` row. Every entry belongs to exactly one collection; collections share the same underlying entry schema and the same template/attribute system, and each gets its own delivery route (`/api/<collection.api_uid>`).

- `Collection`: `id`, `api_uid` (route slug, e.g. `articles`), `singular_name`, `plural_name`, `description`, `is_active`.

> Collections are defined by admins as data, but they are **not** arbitrary content-types — every collection is a blog entry with the fixed entry schema in §3.2. This gives "different collections" without a full runtime content-type builder.

### 2.1 `Template`
A named layout an entry is assigned to (e.g. "Solar Guide", "Case Study", "Comparison"). A template **defines the image groups and attribute slots** its entries expose. Templates are **not tied to one collection** by default — a template can be reused across collections (optionally constrainable; see open question).

- `Template`: `id`, `name`, `slug`, `description`, `is_active`.

### 2.2 Images: **N images per template** (groups + repeatable entries)
A template must support an **unbounded** number of images. We model this in two layers so it covers both *named* images (cover, social) and *arbitrary galleries*:

- **`TemplateImageGroup`** — a named, relabelable image collection on a template. Each group declares whether it is **single** (one image, e.g. `coverImg`) or **repeatable** (0..N images, e.g. a gallery/`bodyImages`).
  - `TemplateImageGroup`: `id`, `template_fk`, `key` (stable machine name), `label` (**editable**), `repeatable` (bool), `max_items` (null = unbounded), `required`, `order`.
- Actual images live in **`EntryImage`** rows (§2.4) keyed to a group — a repeatable group can hold as many rows as needed → **N images per template**. Single groups map to Strapi's `imgUrls.coverImg`-style keys; repeatable groups deliver as an **array** under their `key`.

> This replaces the earlier fixed one-slot-per-key model. Named single images and unbounded galleries are both expressible; new groups are data, not code.

### 2.3 `TemplateAttributeSlot` — "predefined attributes, relabelable"
Predefined, typed attribute slots whose **label is user-editable** while the `key` stays stable (so the API contract and the consumer's field names don't break when someone renames a label).

- `TemplateAttributeSlot`: `id`, `template_fk`, `key` (stable), `label` (**editable**), `type` (`text` | `richtext_blocks` | `number` | `boolean` | `date` | `enum` | `url`), `options` (JSON: enum choices, default, min/max), `required`, `order`.

> **Key design rule:** the **`key` is the API contract; the `label` is presentation.** Renaming a label never changes what the delivery API emits — it only changes what authors see in the admin. This lets "users rename labels" be safe, and applies equally to image groups (§2.2).

### 2.4 How an entry binds to a collection + template
- `Entry.collection_fk → Collection`, `Entry.template_fk → Template`.
- `EntryImage`: `id`, `entry_fk`, `group_key` (matches a `TemplateImageGroup.key`), `position` (order within a repeatable group), `media_asset_fk` **or** `external_url`. Unbounded rows per repeatable group → **N images**.
- `EntryAttributeValue`: `id`, `entry_fk`, `slot_key` (matches a `TemplateAttributeSlot.key`), `value` (JSON, validated against the slot's type).
- Plus the standalone `cover_image` FK on `Entry` for the single primary media asset the client reads as `coverImage`.

This keeps flexibility (collections/templates/groups/slots/labels are data) without a full runtime content-type builder.

---

## 3. Data model (concrete, typed — no generic EAV)

Standalone Django project:

```
blog_cms/
  catalog/     # Collection, Template, TemplateImageGroup, TemplateAttributeSlot, Author, Category, Tag, Badge
  content/     # Entry, ContentBlock, EntryImage, EntryAttributeValue, Seo + draft/publish
  media/       # MediaAsset (upload/serve)
  delivery/    # public Strapi-shaped read API (no models)
  accounts/    # AdminUser (internal admin auth + roles)
  config/
```

> **Storage decision:** the blog domain is a **known, fixed schema**, so we use **normal typed Django models + FKs** for it, and reserve **`JSONField` (Postgres `JSONB`) only** for the genuinely variable parts (rich-text **block bodies** and typed **attribute values**). This gives real DB integrity/indexing for relations and sorting and drops the EAV complexity of the first plan.

**Conventions used below:** every model has an integer `id` PK unless noted. `created_at`/`updated_at` are `auto_now_add`/`auto_now` timestamps present on every model (omitted from tables for brevity). "→" denotes a `ForeignKey`; "M2M" a `ManyToManyField`.

### 3.1 `catalog` — collections, templates, groups/slots & lookups

#### `Collection`
Registers a blog collection (`Article`, `CaseStudy`, `Guide`, …). Every entry belongs to one; each drives a delivery route.

| Field | Type | Notes |
| --- | --- | --- |
| `id` | AutoField (PK) | |
| `api_uid` | SlugField, unique | route slug → `/api/<api_uid>` (e.g. `articles`) |
| `singular_name` | CharField(80) | e.g. "Article" |
| `plural_name` | CharField(80) | e.g. "Articles" |
| `description` | TextField, blank | admin help text |
| `is_active` | BooleanField, default `True` | inactive collections are hidden from delivery |

#### `Template`
The layout an entry is assigned to; owns the image-group/attribute-slot definitions. Reusable across collections.

| Field | Type | Notes |
| --- | --- | --- |
| `id` | AutoField (PK) | |
| `name` | CharField(120) | e.g. "Solar Guide", "Case Study" |
| `slug` | SlugField, unique | machine name; front-end may map this → a layout |
| `description` | TextField, blank | admin-facing help text |
| `is_active` | BooleanField, default `True` | inactive templates can't be assigned to new entries |
| `sort_order` | IntegerField, default 0 | ordering in admin pickers |

#### `TemplateImageGroup` — **N images per template**
A named, relabelable image group. `single` groups hold one image (e.g. `coverImg`); `repeatable` groups hold 0..N images (galleries) → unbounded images per template.

| Field | Type | Notes |
| --- | --- | --- |
| `id` | AutoField (PK) | |
| `template` | → `Template` (`CASCADE`, `related_name="image_groups"`) | |
| `key` | CharField(60) | **stable machine name**, e.g. `coverImg`, `bodyImages`. Delivery-API contract. |
| `label` | CharField(120) | **editable display name** shown to authors |
| `repeatable` | BooleanField, default `False` | `False` → one image (object); `True` → array of N images |
| `max_items` | PositiveIntegerField, null | cap for repeatable groups; `null` = unbounded |
| `required` | BooleanField, default `False` | validated on publish |
| `order` | IntegerField, default 0 | display order |

*Constraint:* `unique_together = (template, key)`.

#### `TemplateAttributeSlot` — "predefined attributes, relabelable"
Predefined, typed attribute slots whose **label is editable** while **`key` stays stable**.

| Field | Type | Notes |
| --- | --- | --- |
| `id` | AutoField (PK) | |
| `template` | → `Template` (`related_name="attribute_slots"`) | cascade delete |
| `key` | CharField(60) | **stable machine name** (contract). Unique per template. |
| `label` | CharField(120) | **editable display name** |
| `type` | CharField, choices | `text` \| `richtext_blocks` \| `number` \| `boolean` \| `date` \| `enum` \| `url` |
| `options` | JSONField, default `{}` | type-specific: `{choices:[...]}` for enum, `{default, min, max}` for number, etc. |
| `required` | BooleanField, default `False` | validated on publish |
| `order` | IntegerField, default 0 | display order |

*Constraint:* `unique_together = (template, key)`. **Rule:** renaming `label` never touches `key` → delivery output is stable.

#### `Author`
| Field | Type | Notes |
| --- | --- | --- |
| `id` | AutoField (PK) | client reads `author.id` |
| `name` | CharField(160) | required |
| `bio` | TextField, blank/null | client `author.bio` |
| `role` | CharField(120), blank/null | client `author.role` |

#### `Category`
| Field | Type | Notes |
| --- | --- | --- |
| `id` | AutoField (PK) | |
| `name` | CharField(120) | required; client `category.name` |
| `slug` | SlugField, null/blank | client `category.slug` may be `null` |

#### `Tag`
| Field | Type | Notes |
| --- | --- | --- |
| `id` | AutoField (PK) | |
| `name` | CharField(80), unique | client `tag.name` |

#### `Badge`
| Field | Type | Notes |
| --- | --- | --- |
| `id` | AutoField (PK) | |
| `label` | CharField(120) | client `badge.label` (used as "reviewed by") |
| `color` | CharField(32) | hex/token; client `badge.color` |

### 3.2 `content` — entries, blocks, images, attributes, SEO

#### `Entry` (one row per blog entry, any collection)
The single entry model shared by all collections (`Article`, `CaseStudy`, …). `collection` says which one; `template` says which layout/slots apply. This is what the client reads as `ApiArticle`.

| Field | Type | Notes |
| --- | --- | --- |
| `id` | AutoField (PK) | client `id` |
| `document_id` | UUIDField, unique, default uuid4 | client `documentId` |
| `collection` | → `Collection` (`PROTECT`, `related_name="entries"`) | which blog collection |
| `template` | → `Template` (`PROTECT`, `related_name="entries"`) | which layout / image groups / attr slots apply |
| `title` | CharField(255) | client `title` |
| `slug` | SlugField(255), indexed | client `slug`; primary lookup key. Unique **per collection** (`unique_together = (collection, slug)`) |
| `excerpt` | TextField, blank | client `excerpt` (card description) |
| `summary` | JSONField, default `list` | Strapi-blocks array; client `summary` (rendered as list items) |
| `introduction` | JSONField, default `list` | Strapi-blocks array; client `introduction` |
| `read_time` | PositiveIntegerField, null | client `readTime` (minutes) |
| `is_featured` | BooleanField, default `False` | client `isFeatured` |
| `sort_order` | IntegerField, null | client `sortOrder` |
| `published_on` | DateTimeField, null | client `publishedOn` (author-set display date, distinct from `published_at`) |
| `warning` | TextField, blank/null | client `warning` (→ "important" callout) |
| `insights` | TextField, blank/null | client `insights` (→ "key insight" callout) |
| `author` | → `Author` (`SET_NULL`, null) | client `author` |
| `categories` | M2M `Category` | client `categories[]` |
| `tags` | M2M `Tag` | client `tags[]` |
| `badges` | M2M `Badge` | client `badges[]` |
| `cover_image` | → `MediaAsset` (`SET_NULL`, null) | client `coverImage` (single primary asset) |
| `status` | CharField, choices `draft`\|`published`, default `draft` | draft/publish (§5) |
| `published_at` | DateTimeField, null | set on publish; client `publishedAt` |
| `created_by` / `updated_by` | → `AdminUser` (`SET_NULL`, null) | audit |
| `created_at` / `updated_at` | timestamps | client `updatedAt` |

*Constraint:* `unique_together = (collection, slug)`.
*Indexes:* `(collection, slug)` (unique), `(collection, status, published_on)`, `is_featured`, `sort_order`.
*Note:* attribute values are stored as child `EntryAttributeValue` rows (below), **not** a JSON blob — keeps them queryable and validated against the template's slots. (If querying by attribute is never needed, this can collapse to a single `attribute_values` JSONField on `Entry`; see open question 3.)

#### `ContentBlock` — the repeatable `contentBlocks` component
| Field | Type | Notes |
| --- | --- | --- |
| `id` | AutoField (PK) | client `contentBlocks[].id` |
| `entry` | → `Entry` (`CASCADE`, `related_name="content_blocks"`) | |
| `component` | CharField(120) | client `__component` (Strapi component identifier) |
| `body` | JSONField, default `list` | Strapi-blocks array; client `body` |
| `order` | IntegerField, default 0 | **preserves block order** |

*Ordering:* `Meta.ordering = ["order"]`.

#### `EntryImage` — images per template image-group (**N per group**)
| Field | Type | Notes |
| --- | --- | --- |
| `id` | AutoField (PK) | |
| `entry` | → `Entry` (`CASCADE`, `related_name="images"`) | |
| `group_key` | CharField(60) | matches a `TemplateImageGroup.key` on the entry's template |
| `position` | IntegerField, default 0 | order within a repeatable group |
| `media_asset` | → `MediaAsset` (`SET_NULL`, null) | uploaded image, **or**… |
| `external_url` | URLField, blank | …a full external/CDN URL (client accepts both) |

*Constraint:* single groups → one row per `(entry, group_key)`; repeatable groups → many rows (ordered by `position`, capped by the group's `max_items`). Enforced in the service layer against the template's `TemplateImageGroup` definitions.
*Delivery:* assembled into the client's `imgUrls` object — single groups emit a **URL** under their `key`, repeatable groups emit an **array of URLs**.

#### `EntryAttributeValue` — typed values for template attribute slots
| Field | Type | Notes |
| --- | --- | --- |
| `id` | AutoField (PK) | |
| `entry` | → `Entry` (`CASCADE`, `related_name="attribute_values"`) | |
| `slot_key` | CharField(60) | matches a `TemplateAttributeSlot.key` |
| `value` | JSONField | typed value (validated against the slot's `type`/`options`) |

*Constraint:* `unique_together = (entry, slot_key)`.

#### `Seo` — SEO component (one-to-one)
| Field | Type | Notes |
| --- | --- | --- |
| `id` | AutoField (PK) | |
| `entry` | OneToOne → `Entry` (`CASCADE`, `related_name="seo"`) | |
| `meta_title` | CharField(255), blank/null | client `seo.metaTitle` |
| `meta_description` | TextField, blank/null | client `seo.metaDescription` |
| `canonical_url` | URLField, blank/null | client `seo.canonicalUrl` |
| `keywords` | TextField, blank/null | client `seo.keywords` |

### 3.3 `media`

#### `MediaAsset`
| Field | Type | Notes |
| --- | --- | --- |
| `id` | AutoField (PK) | |
| `file` | FileField/ImageField | stored on local/S3/CDN backend |
| `mime` | CharField(120) | |
| `size` | PositiveIntegerField | bytes |
| `width` / `height` | PositiveIntegerField, null | images only |
| `alternative_text` | CharField(255), blank | client `coverImage.alternativeText` |
| `caption` | CharField(255), blank | |

*Delivery:* resolves to `{ url, width, height, alternativeText }` (the client's `ApiCoverImage`).

### 3.4 `accounts`

#### `AdminUser`
Internal authoring account (extend Django's `AbstractUser` or a custom user).

| Field | Type | Notes |
| --- | --- | --- |
| `id` | AutoField (PK) | |
| `username` / `email` / `password` | standard Django auth | |
| `role` | CharField, choices `admin`\|`editor`\|`author` | see §7 |
| `is_active` | BooleanField | |

### 3.5 Model → client-field cross-reference
Maps every field the consumer [`strappi.ts`](./strappi.ts) reads to its source model, so nothing in the contract is unbacked.

| Client field (`ApiArticle` etc.) | Backed by |
| --- | --- |
| `id`, `documentId` | `Entry.id`, `Entry.document_id` |
| `title`, `slug`, `excerpt` | `Entry.*` |
| `summary`, `introduction` | `Entry.summary`, `Entry.introduction` (blocks) |
| `readTime`, `isFeatured`, `sortOrder`, `publishedOn` | `Entry.read_time` / `is_featured` / `sort_order` / `published_on` |
| `updatedAt`, `publishedAt` | `Entry.updated_at`, `Entry.published_at` |
| `warning`, `insights` | `Entry.warning`, `Entry.insights` |
| `author` | `Entry.author` → `Author` |
| `categories[]`, `tags[]`, `badges[]` | M2M → `Category` / `Tag` / `Badge` |
| `contentBlocks[]` (`__component`, `id`, `body`) | `ContentBlock` rows (ordered) |
| `coverImage` (`url`,`width`,`height`,`alternativeText`) | `Entry.cover_image` → `MediaAsset` |
| `imgUrls` (`coverImg`,`mainImg`,`socialSharing`, … + repeatable galleries) | `EntryImage` rows keyed by `group_key` (per `TemplateImageGroup`); single groups → URL, repeatable → array |
| `seo` (`metaTitle`,`metaDescription`,`canonicalUrl`,`keywords`) | `Seo` (1-1) |

---

## 4. Delivery (public read) API — Strapi-compatible

Routes are **per collection**: `/api/<collection.api_uid>`. The current client hits `articles`; new collections get their own route automatically from their `Collection.api_uid`. Must satisfy the existing [`strappi.ts`](./strappi.ts) calls without changes to that client:

- `GET /api/articles?populate=*&pagination[pageSize]=100` — list.
- `GET /api/articles?populate=*&filters[slug][$eq]=<slug>` — single by slug.
- `GET /api/articles?fields[0]=slug` — slugs only (for `generateStaticParams`).

### 4.1 Supported query params (only what's used + a safe margin)
- `populate` — `*` and explicit lists. Populates: `author`, `categories`, `tags`, `badges`, `contentBlocks`, `coverImage`, `imgUrls` (the assembled image-group object), `seo`.
- `filters[<field>][$eq]` (and `$in`, `$contains`, `$null` for margin) — translated to ORM filters on typed columns.
- `fields[]` — scalar field selection.
- `pagination[page]` / `pagination[pageSize]` — bounded page size; always paginate.
- `sort[]` — `sortOrder`, `publishedOn`, `title` etc.
- `status` — public serves **published only**; `draft` requires admin/preview token.

### 4.2 Response shape (must match client)
```jsonc
{
  "data": [
    {
      "id": 12, "documentId": "…", "title": "…", "slug": "…", "excerpt": "…",
      "summary": [ …blocks… ], "introduction": [ …blocks… ],
      "readTime": 5, "isFeatured": true, "sortOrder": 1,
      "publishedOn": "…", "updatedAt": "…", "publishedAt": "…",
      "author": { "id": 1, "name": "…", "bio": null, "role": null },
      "categories": [ { "id": 1, "name": "…", "slug": null } ],
      "tags": [ … ], "badges": [ { "id": 1, "label": "…", "color": "…" } ],
      "contentBlocks": [ { "__component": "…", "id": 3, "body": [ …blocks… ] } ],
      "coverImage": { "url": "…", "width": 1200, "height": 630, "alternativeText": null },
      "imgUrls": { "coverImg": "…", "mainImg": "…", "socialSharing": "…", "bodyImages": ["…","…","…"] },
      "seo": { "metaTitle": "…", "metaDescription": "…", "canonicalUrl": "…", "keywords": "…" },
      "warning": null, "insights": null
    }
  ],
  "meta": { "pagination": { "page": 1, "pageSize": 100, "pageCount": 1, "total": 1 } }
}
```
- `imgUrls` is assembled from the entry's `EntryImage` rows keyed by `group_key` → the client's `ApiImgUrls` shape. **Single** image groups emit a URL under their key; **repeatable** groups emit an array of URLs (the client's `ApiImgUrls` interface would gain array-typed keys for those). New template image groups appear here automatically (client reads them by key).
- `coverImage.url`: absolute if uploaded to a CDN/host; the client already prefixes relative URLs with the host.

### 4.3 Performance
- `select_related`/`prefetch_related` for author/seo (FK/1-1) and categories/tags/badges/contentBlocks/images (M2M/reverse) — **no N+1**.
- Published content is highly cacheable: `ETag` + `Cache-Control`, optional Redis layer keyed by `(query, published_version)`, invalidated on publish/unpublish.
- Always paginate; bounded populate.

---

## 5. Draft & Publish (kept, scoped to Entry)

The client relies on `publishedAt` and only ever fetches published content, so we keep a simple two-state model on `Entry` (applies to every collection):

- `status`: `draft` | `published`; `published_at` set on publish.
- Admin actions: **publish / unpublish / discard-draft / duplicate / delete** (+ bulk publish/unpublish/delete).
- Public delivery serves `status=published` only. Draft **preview** via a short-lived token.
- (The four fine-grained Strapi statuses from the source doc — *never-published / modified / unmodified* — are **deferred**; not needed by the blog consumer. Revisit only if the admin UI wants them.)

---

## 6. Admin (authoring) API

Thin DRF viewsets; logic in services, reads in selectors.

- **Catalog**: CRUD for `Collection`, `Template` (+ image groups + attribute slots, with **label editing that never touches `key`**), `Author`, `Category`, `Tag`, `Badge`.
- **Entries** (scoped by collection): create/edit (draft), assign template, fill attribute values (validated against the template's attribute slots), manage `ContentBlock`s (ordered), attach images per template image group (N per repeatable group), edit SEO, then publish/unpublish/discard/duplicate/delete + bulk.
- **List view** for authors: search (title/slug), filters (collection/category/tag/status/template), sort, pagination.
- **Validation**: a template-aware serializer validates attribute values (required/type/enum) and images (required groups filled, repeatable caps respected) against the assigned template.

---

## 7. Auth & roles (single-tenant, internal)
- Internal admins authenticate (session or JWT).
- Roles v1: **Admin** (manage collections/templates/catalog + entries + publish), **Editor** (author + publish entries, no schema edits), **Author** (draft only, no publish).
- Delivery API is public read-only for published content; optional static read token or preview token if the site must stay private.

---

## 8. Media (minimal)
- Upload/store/serve `MediaAsset` (local for dev, S3/CDN for prod — client already handles CDN + relative-URL prefixing).
- Media fields: `coverImage` (single asset) and any template image-group image backed by an upload; images may alternatively hold an `external_url` (the client already accepts full URLs in `imgUrls`).

---

## 9. Build phases (revised, blog-first)

1. **Skeleton** — new Django project, apps, settings, Docker, admin auth.
2. **Catalog** — `Collection`, `Template` + `TemplateImageGroup` + `TemplateAttributeSlot` (label-vs-key rule), `Author`, `Category`, `Tag`, `Badge` + admin CRUD.
3. **Entry model + collection/template binding** — typed fields, attribute-value validation against template, ContentBlocks (ordered), EntryImage per image group (N per repeatable), SEO.
4. **Draft & Publish** — status, publish/unpublish/discard/duplicate + bulk.
5. **Media** — upload/store/serve + coverImage + image-group resolution.
6. **Delivery API** — per-collection routes, Strapi-shaped `data/meta` envelope, `populate`/`filters`/`fields`/`pagination`/`sort`, `imgUrls` assembly (single + repeatable groups). **Validate against the real [`strappi.ts`](./strappi.ts) calls end-to-end.**
7. **Caching + hardening** — ETag/Cache-Control/Redis, bounded populate, no-N+1 checks.
8. **Docs** — OpenAPI + a short "consuming the blog API" note pointing at `strappi.ts` as the canonical client.
9. **Admin UI** — separate front-end track against the Admin API (out of scope here; API designed to support it).

---

## 10. Resolved with stakeholder
- ✅ **Multiple collections** — supported via the `Collection` model; all blog-purposed, sharing the `Entry` schema + template system. Each gets its own `/api/<api_uid>` delivery route.
- ✅ **N images per template** — supported via `TemplateImageGroup` (`repeatable` + `max_items`) + unbounded `EntryImage` rows. Single groups deliver a URL, repeatable groups deliver an array.

## 11. What we deliberately dropped vs. the first plan
- ❌ Generic **runtime content-type builder** (arbitrary user-defined content-types/single-types) — not needed; every collection is a blog `Entry` with a fixed schema. Flexibility comes from **collections + templates + relabelable groups/slots**.
- ❌ **EAV/JSONB-everything** store — replaced by typed models + FKs, with JSONB only for block bodies and attribute values.
- ❌ Full Strapi **query language** — only the params the client uses (+ small margin).
- ❌ The **four fine-grained publish statuses** — simple draft/published is enough for the consumer.
- ⏸️ **i18n**, **multi-tenant**, **full media library** — deferred (schema leaves room).

---

## 12. Open questions before coding
1. **Templates across collections:** should a template be reusable across any collection (current assumption), or constrained to specific collections (add an optional `Template.collections` M2M)?
2. **Templates ↔ front-end rendering:** does the front-end map `template.slug` → a React layout, or is the template purely a bundle of image-groups/attributes with no server-side rendering meaning? (The client currently keys visuals off `category`, not template.)
3. **Attribute value storage:** child `EntryAttributeValue` rows (queryable, recommended) vs a single `attribute_values` JSONField on `Entry` (simpler, not queryable). Do you ever need to filter/sort entries by a custom attribute?
4. **Repeatable-image delivery shape:** confirm repeatable groups should emit a **JSON array** under their `key` in `imgUrls` (the current `ApiImgUrls` interface would need array-typed keys added for those groups).
5. **Envelope parity:** keep the exact flat v5 shape `strappi.ts` expects (recommended), or is the client open to change?
6. **Preview:** do authors need to preview drafts on the live site (needs a preview-token flow), or is admin-only preview enough?

---

## Sources
- Consumer contract: [`strappi.ts`](./strappi.ts) (the front-end blog service — canonical shape).
- [Strapi — Content Manager](https://docs.strapi.io/cms/features/content-manager)
- [Strapi — REST API parameters](https://docs.strapi.io/cms/api/rest/parameters)
- [Strapi — Populate and Select](https://docs.strapi.io/cms/api/rest/populate-select)
- [Strapi — REST API: status (Draft & Publish)](https://docs.strapi.io/cms/api/rest/status)
