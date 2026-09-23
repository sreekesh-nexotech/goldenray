# Building a CMS Module — A Reference Blueprint

> A reusable design reference distilled from a production Django CMS that replaced
> Strapi for a marketing site. It documents the architecture, the endpoint surface,
> the response contracts and the features — generically, so another project can
> implement the same thing without inheriting this one's domain.
>
> Everything here is described as a **pattern with a rationale**, followed by the
> concrete contract that realises it. Where the source system has a wart, it is
> flagged as **⚠ Known weakness** rather than presented as guidance.

---

## Table of contents

1. [What this architecture is for](#1-what-this-architecture-is-for)
2. [The shape of the system](#2-the-shape-of-the-system)
3. [Layering conventions](#3-layering-conventions)
4. [Content modelling: collections, templates, entries](#4-content-modelling-collections-templates-entries)
5. [The lifecycle: draft / published / deleted](#5-the-lifecycle-draft--published--deleted)
6. [Slugs: validation, history and redirects](#6-slugs-validation-history-and-redirects)
7. [Auth and the RBAC matrix](#7-auth-and-the-rbac-matrix)
8. [The public delivery API](#8-the-public-delivery-api)
9. [The authoring API](#9-the-authoring-api)
10. [Structured modules beyond the generic engine](#10-structured-modules-beyond-the-generic-engine)
11. [Media pipeline and CDN](#11-media-pipeline-and-cdn)
12. [SEO subsystem](#12-seo-subsystem)
13. [Cache invalidation / instant freshness](#13-cache-invalidation--instant-freshness)
14. [Configuration and deployment](#14-configuration-and-deployment)
15. [Testing strategy](#15-testing-strategy)
16. [Implementation checklist](#16-implementation-checklist)
17. [Known weaknesses to fix when copying](#17-known-weaknesses-to-fix-when-copying)

---

## 1. What this architecture is for

This blueprint suits a **single-tenant, internally-authored content system** that
feeds one or more public websites:

- An internal team authors content through an admin UI.
- A public, read-only API serves published content to a frontend (Next.js, Nuxt, etc.).
- Content has *some* structural variability, but is not an arbitrary
  user-defined content-type builder.
- Roles differ by **which modules** people reach, not just by how much authority
  they hold.

**It is deliberately not** a Strapi/Contentful clone. The single most important
scoping decision in the source system was rejecting a runtime content-type
builder and an EAV store in favour of **typed models plus a template system**.
That decision is what keeps the query layer honest, the database indexable and
the code readable.

> **Rule of thumb:** use typed columns and foreign keys for everything you know
> the shape of. Reserve JSON for the two things that are genuinely open-ended —
> rich-text block bodies and per-template attribute values.

---

## 2. The shape of the system

### 2.1 Two API surfaces, one model set

The central architectural move is that **one set of models serves two completely
different HTTP surfaces**:

| Surface | Path prefix | Audience | Auth | Shape |
|---|---|---|---|---|
| **Delivery** | `/api/…` | Public website | None (`AllowAny`) | Flat, frontend-shaped, published-only |
| **Authoring** | `/admin-api/…` | Admin UI / Content Studio | JWT (+ RBAC) | Rich, normalised, all statuses |
| **Fallback admin** | `/admin/` | Developers, day-one authoring | Session | Framework admin |

Why this matters: the public shape is a **contract with a frontend you may not
control**, while the authoring shape is a contract with your own UI. Conflating
them means every admin convenience leaks into the public payload and every
public-shape change breaks the editor. Keep two serializer families.

The third surface (the framework's built-in admin) is worth keeping: it makes
the system usable on day one, before any custom admin UI exists, and it stays
useful for support and data repair. **But** it bypasses your service layer — see
[§3.3](#33-signals-for-what-must-survive-every-write-path).

### 2.2 Application split

```
cms/
  config/      # settings, root urls, wsgi/asgi
  accounts/    # users, roles, the permission registry
  catalog/     # SCHEMA: collections, templates, image groups, attribute slots,
               #         plus taxonomy (authors, categories, tags, badges)
  content/     # INSTANCES: entries, blocks, images, attribute values, SEO,
               #            slug history + the publish services
  media/       # media assets + CDN pipeline
  delivery/    # public read API (no models of its own)
  seo/         # abstract SEO mixin + JSON-LD builders (no tables of its own)
  <modules>/   # structured content modules (pages, faqs, careers, settings)
```

Two directional rules make this hold together:

1. **`catalog` imports nothing from `content`.** Schema definitions must not know
   about instances. This is what lets you reason about templates independently.
2. **`delivery` and `seo` own no tables.** `delivery` is pure read/serialise;
   `seo` is an abstract mixin plus pure functions. Both are safe to restructure.

---

## 3. Layering conventions

Every app follows the same five-layer split. This is the convention that keeps
views thin and business rules testable.

```
models.py      → shape + database constraints. No business logic.
validators.py  → pure field rules. No query context, no I/O.
selectors.py   → ALL ORM reads. One shared prefetch chain.
services.py    → ALL state transitions. @transaction.atomic. Raises domain errors.
views.py       → thin. Parse request → call service/selector → serialise.
signals.py     → only what must survive EVERY write path.
```

### 3.1 Selectors: one prefetch chain, defined once

Define a single `_base_queryset()` that eager-loads every relation the
serializers touch, and build every read path on top of it:

```python
def _base_queryset():
    return (
        Entry.objects
        .select_related("collection", "template", "author", "cover_image", "seo")
        .prefetch_related(
            "categories", "tags", "badges", "content_blocks",
            "images", "images__media_asset",   # ← the nested one that bites
            "attribute_values", "slug_history",
        )
    )
```

- `select_related` for single-valued relations (FKs and reverse one-to-ones) —
  these become JOINs in the same query.
- `prefetch_related` for the many-valued ones.
- **The nested `images__media_asset` is the one people forget.** Without it, any
  per-image URL resolution triggers one query per image per entry.

Result: serialising *N* entries costs 1 + 8 queries, not O(N × relations).

Then express every read as a narrowing of that base:

```python
def published_entries(collection_uid):
    return _base_queryset().filter(
        collection__api_uid=collection_uid,
        collection__is_active=True,
        status=Entry.Status.PUBLISHED,
    )

def admin_entry_queryset(*, include_deleted=False):
    qs = _base_queryset()
    return qs if include_deleted else qs.exclude(status=Entry.Status.DELETED)
```

> **Why this is the important one:** because *every* public read filters on
> `status=PUBLISHED`, drafts and soft-deleted content are excluded structurally.
> No other layer has to remember. Security by construction, not by discipline.

### 3.2 Services: transitions raise a structured domain error

Define one exception carrying **both** a human summary and a machine-readable list:

```python
class PublishError(Exception):
    def __init__(self, message, errors=None):
        super().__init__(message)
        self.errors = errors if errors is not None else [message]
```

Views render it uniformly as HTTP 400:

```json
{
  "detail": "Image group 'Cover image' (coverImg) requires at least one image. Attribute 'Read time' (readTime) is required.",
  "errors": [
    "Image group 'Cover image' (coverImg) requires at least one image.",
    "Attribute 'Read time' (readTime) is required."
  ]
}
```

Two things worth copying exactly:

- **Errors accumulate; they do not short-circuit.** An author fixing a publish
  failure should see every problem at once, not discover them one save at a time.
- **The message format is `'{human label}' ({stable key})`.** The label is what
  the editor recognises; the key is what a developer greps for. One string serves
  both audiences.

### 3.3 Signals for what must survive every write path

Business rules that need **role context** belong in services. Bookkeeping that
must hold no matter how the row was written — authoring API, framework admin,
management command, shell — belongs on signals.

In the source system, two jobs qualify:

1. **Recording the previous slug** when a slug changes.
2. **Pinging the frontend** to rebuild affected pages.

The pattern for comparing old vs. new on save:

```python
_PREVIOUS_SLUG_ATTR = "_previous_slug"   # an attribute, NOT a module global,
                                         # so concurrent saves cannot cross-talk

@receiver(pre_save, sender=Entry)
def capture_previous_slug(sender, instance, **kwargs):
    if not instance.pk:
        setattr(instance, _PREVIOUS_SLUG_ATTR, None)
        return
    setattr(instance, _PREVIOUS_SLUG_ATTR,
            Entry.objects.filter(pk=instance.pk).values_list("slug", flat=True).first())

@receiver(post_save, sender=Entry)
def entry_saved(sender, instance, created, **kwargs):
    previous = getattr(instance, _PREVIOUS_SLUG_ATTR, None)
    if previous and previous != instance.slug:
        record_slug_change(instance, previous)
        trigger_revalidate(previous)        # the old URL starts redirecting
    setattr(instance, _PREVIOUS_SLUG_ATTR, instance.slug)   # reset the stash
    if instance.status == Entry.Status.PUBLISHED:
        trigger_revalidate(instance.slug)
```

Note the stash reset — without it, a second `.save()` on the same in-memory
instance re-records the change.

---

## 4. Content modelling: collections, templates, entries

### 4.1 The three-layer flexibility model

This is the core idea, and the part most worth lifting wholesale.

```
COLLECTION   → registers a content type and its public route (/api/<api_uid>)
   ↓
TEMPLATE     → declares WHAT FIELDS an entry exposes:
                 • image groups    (named, single or repeatable)
                 • attribute slots (named, typed)
   ↓
ENTRY        → an instance: binds to one collection + one template,
               holds values keyed by the template's STRING keys
```

**Collection** gives you "multiple content types" without a content-type builder.
Each collection is a registered row (`api_uid`, `singular_name`, `plural_name`,
`is_active`), and each automatically gets a public route. Adding a `CaseStudy`
collection is a data operation, not a deployment.

**Template** gives you per-entry structural variation. It is *not* tied to a
collection — templates are reusable across them.

### 4.2 The stable-key / editable-label contract

This is the single most important rule in the whole design:

> **`key` is the API contract. `label` is presentation.**
> Renaming a label must never change what the delivery API emits.

```python
class TemplateImageGroup(models.Model):
    template   = FK(Template, related_name="image_groups", on_delete=CASCADE)
    key        = CharField(60)     # stable machine name — the contract
    label      = CharField(120)    # editable display name — free to rename
    repeatable = BooleanField(default=False)
    max_items  = PositiveIntegerField(null=True)   # null = unbounded
    required   = BooleanField(default=False)
    order      = IntegerField(default=0)
    class Meta:
        unique_together = (("template", "key"),)
        ordering = ["order", "id"]

class TemplateAttributeSlot(models.Model):
    template = FK(Template, related_name="attribute_slots", on_delete=CASCADE)
    key      = CharField(60)
    label    = CharField(120)
    type     = CharField(choices=[
        "text", "richtext_blocks", "number", "boolean", "date", "enum", "url",
    ], default="text")
    options  = JSONField(default=dict)   # {"choices": [...]} for enum,
                                         # {"default","min","max"} for number
    required = BooleanField(default=False)
    order    = IntegerField(default=0)
    class Meta:
        unique_together = (("template", "key"),)
        ordering = ["order", "id"]
```

Instance rows reference these by **plain string, not a foreign key**:

```python
class EntryImage(models.Model):
    entry        = FK(Entry, related_name="images", on_delete=CASCADE)
    group_key    = CharField(60)          # matches TemplateImageGroup.key
    position     = IntegerField(default=0)
    media_asset  = FK(MediaAsset, null=True, on_delete=SET_NULL)
    external_url = URLField(1000, blank=True)
    class Meta:
        ordering = ["group_key", "position", "id"]

class EntryAttributeValue(models.Model):
    entry    = FK(Entry, related_name="attribute_values", on_delete=CASCADE)
    slot_key = CharField(60)              # matches TemplateAttributeSlot.key
    value    = JSONField(null=True, blank=True)
    class Meta:
        constraints = [UniqueConstraint(fields=["entry", "slot_key"],
                                        name="uniq_entry_attr_slot")]
```

**The deliberate trade-off:** string references rather than FKs mean renaming a
*label* is free and safe, while renaming a *key* silently orphans existing
values. That is the correct bias — labels get renamed constantly, keys almost
never. Make key immutable in your UI and document it.

Cardinality is data, not table shape:

| `repeatable` | `max_items` | Meaning | Delivered as |
|---|---|---|---|
| `false` | — | single image | a URL **string** |
| `true` | `null` | unbounded gallery | an **array** of URLs |
| `true` | `N` | capped gallery | an **array**, max N |

### 4.3 The entry model

```python
class Entry(models.Model):
    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        PUBLISHED = "published", "Published"
        DELETED = "deleted", "Deleted"

    document_id  = UUIDField(default=uuid4, unique=True, editable=False)
    collection   = FK(Collection, on_delete=PROTECT, related_name="entries")
    template     = FK(Template, on_delete=PROTECT, null=True, blank=True)

    title        = CharField(255)
    slug         = SlugField(255, db_index=True, validators=[validate_entry_slug])
    excerpt      = TextField(blank=True)
    summary      = JSONField(default=list)     # rich-text block array
    introduction = JSONField(default=list)     # rich-text block array

    is_featured  = BooleanField(default=False)
    sort_order   = IntegerField(null=True, blank=True)
    published_on = DateTimeField(null=True, blank=True)  # author-set DISPLAY date

    author     = FK(Author, on_delete=SET_NULL, null=True)
    categories = M2M(Category, related_name="entries", blank=True)
    tags       = M2M(Tag, related_name="entries", blank=True)
    badges     = M2M(Badge, related_name="entries", blank=True)

    status       = CharField(choices=Status.choices, default=Status.DRAFT)
    published_at = DateTimeField(null=True, blank=True)  # SYSTEM first-publish stamp
    deleted_at   = DateTimeField(null=True, blank=True)

    created_by = FK(AUTH_USER_MODEL, on_delete=SET_NULL, null=True, related_name="+")
    updated_by = FK(AUTH_USER_MODEL, on_delete=SET_NULL, null=True, related_name="+")
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)

    class Meta:
        ordering = ["sort_order", "-published_on", "-created_at"]
        constraints = [UniqueConstraint(fields=["collection", "slug"],
                                        name="uniq_entry_collection_slug")]
        indexes = [
            Index(fields=["collection", "status", "published_on"]),
            Index(fields=["is_featured"]),
            Index(fields=["sort_order"]),
        ]
```

Four details that carry weight:

- **`document_id`** — a stable UUID identity that survives slug and title
  changes. Give consumers this for "is this the same thing?" questions.
- **`published_on` vs `published_at`** — two dates that are routinely conflated
  and must not be. `published_on` is the *author-set display date* (backdatable,
  what you sort and show). `published_at` is the *system first-publish stamp*
  (set once, never refreshed on re-publish). On first publish, seed
  `published_on` from `published_at` if the author left it blank.
- **Uniqueness is scoped to the collection**, not global — two collections may
  legitimately both have `/getting-started`.
- **`on_delete=PROTECT` on collection and template** — deleting a schema row out
  from under live content should be an error, not a cascade.

### 4.4 Rich text

Store rich text as a **block array in JSON**, in whatever schema your editor
produces (the source system uses the Strapi-blocks shape:
`[{type: "paragraph", children: [{type: "text", text: "…"}]}]`). Both the
authoring API and the delivery API pass it through verbatim.

Repeatable body sections get their own ordered child table:

```python
class ContentBlock(models.Model):
    entry     = FK(Entry, related_name="content_blocks", on_delete=CASCADE)
    component = CharField(120, default="shared.rich-text")  # discriminator
    body      = JSONField(default=list)
    order     = IntegerField(default=0)
    class Meta:
        ordering = ["order", "id"]
```

---

## 5. The lifecycle: draft / published / deleted

### 5.1 Three states, not a boolean

Make **deletion a status**, not a `deleted_at IS NULL` test and not a hard row
delete. The reasoning is worth internalising:

> A hard `DELETE` loses the title, the body, the slug and the redirect aliases.
> It makes "a URL we deliberately took down" indistinguishable from "a URL that
> never existed", and it makes an accidental deletion unrecoverable.

| State | Meaning | Public? | Slug still claimed? |
|---|---|---|---|
| `draft` | Not public **yet** | No | Yes |
| `published` | Live | Yes | Yes |
| `deleted` | Deliberately taken down, record retained | No | **Yes** |
| *(row absent)* | Never existed | No | No |

Because every public read filters `status=PUBLISHED`, removal from the public
site is free — no other layer needs to know the deleted state exists.

### 5.2 Transitions

All transitions live in services, are `@transaction.atomic`, and check the
caller's role:

| Service | Guard | Effects |
|---|---|---|
| `publish_entry` | can publish | validates against template; `→ PUBLISHED`; clears `deleted_at`; stamps `published_at` **if null**; seeds `published_on` **if null**; revalidates |
| `unpublish_entry` | can publish | `→ DRAFT`; clears `deleted_at`; **leaves `published_at`/`published_on` intact**; revalidates |
| `soft_delete_entry` | can delete | `→ DELETED`; stamps `deleted_at` if null; revalidates |
| `restore_entry` | can restore | requires current state `DELETED`; `→ DRAFT`; clears `deleted_at`; **no revalidate** (nothing public changed) |
| `duplicate_entry` | (view-gated) | deep-copies entry + children; new `document_id`; `→ DRAFT`; `-copy` slug; **no revalidate** |

`DELETE /entries/{id}/` returns **204 as usual** — callers see no difference,
but the record survives and `POST /entries/{id}/restore/` brings it back as a
draft. Re-publishing stays a separate, explicitly authorised step.

### 5.3 Publish-time validation against the template

Drafts save loose; **required-ness is enforced only at publish**. This is the
right bias — an author mid-draft should never fight the validator.

```python
def validate_for_publish(entry):
    if entry.template_id is None:
        return                      # templates are opt-in
    errors = []
    slots    = {s.key: s for s in entry.template.attribute_slots.all()}
    provided = {av.slot_key: av.value for av in entry.attribute_values.all()}
    for key, slot in slots.items():
        if slot.required and (key not in provided or provided[key] in (None, "", [])):
            errors.append(f"Attribute '{slot.label}' ({key}) is required.")

    groups = {g.key: g for g in entry.template.image_groups.all()}
    counts = Counter(img.group_key for img in entry.images.all())
    for key, group in groups.items():
        n = counts.get(key, 0)
        if group.required and n == 0:
            errors.append(f"Image group '{group.label}' ({key}) requires at least one image.")
        if not group.repeatable and n > 1:
            errors.append(f"Image group '{group.label}' ({key}) is single but has {n} images.")
        if group.max_items is not None and n > group.max_items:
            errors.append(f"Image group '{group.label}' ({key}) exceeds max_items={group.max_items}.")

    if errors:
        raise PublishError(" ".join(errors), errors=errors)
```

Note the emptiness test `in (None, "", [])` — deliberately narrow, so `0` and
`False` count as provided values.

---

## 6. Slugs: validation, history and redirects

A slug is a **permanent public URL**. Treat it with more care than an ordinary
field. Three concerns, three mechanisms.

### 6.1 Validation — reject junk before it ships

Attach a field validator that rejects three classes of failure:

| Class | Examples | Why |
|---|---|---|
| **Malformed** | `Not A Slug`, `trailing-`, `UPPER` | Must match `^[a-z0-9]+(?:-[a-z0-9]+)*$` — exactly what `slugify()` emits and what the frontend routes on |
| **Placeholder** | `test`, `asdf`, `undefined`, `objectobject`, `untitled` | Keyboard-mash and serialisation accidents that reach production |
| **Reserved** | `admin`, `api`, `blog`, `static`, `sitemap`, `search` | Paths the site itself owns; a match shadows a real route |

The placeholder check is the non-obvious one. Match case-insensitively against
**four forms** of the candidate, because the junk that actually ships is
`test-2`, not `test`:

```python
_TRAILING_COUNTER_RE = re.compile(r"-\d+$")

def _placeholder_forms(value):
    stripped = _TRAILING_COUNTER_RE.sub("", value)
    return {value, value.replace("-", ""),
            stripped, stripped.replace("-", "")}
```

Order the checks: empty → whitespace → max length → **regex** → min length →
reserved → placeholder. (Max before the regex, min after, so a 2-char valid-shape
slug reports "too short" while `AB` reports "malformed".)

Also expose the validator as a **nullable message** for read-only reporting —
the availability endpoint and the audit command both want "why would this fail?"
without raising:

```python
def slug_error(value) -> str | None:
    try:
        validate_entry_slug(value); return None
    except ValidationError as exc:
        return exc.messages[0]
```

⚠ **Know the limit:** a field validator runs on the serializer and on
`full_clean()`, but **never on a bare `.save()`**. Either call `full_clean()` in
your service layer or accept that shell/script writes can persist junk.

### 6.2 Slug history — renaming must not break the web

When an entry's slug changes, the old URL is already in Google, in newsletters
and in other people's links. Record it:

```python
class EntrySlugHistory(models.Model):
    entry      = FK(Entry, related_name="slug_history", on_delete=CASCADE)
    collection = FK(Collection, on_delete=CASCADE)   # denormalised: it IS the
                                                     # uniqueness scope
    slug       = SlugField(255, db_index=True)
    is_active  = BooleanField(default=True)          # retire without losing audit
    note       = CharField(255, blank=True)
    created_at = DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at", "-id"]
        constraints = [
            UniqueConstraint(
                fields=["collection", "slug"],
                condition=Q(is_active=True),          # ← PARTIAL unique index
                name="uniq_active_slug_alias_per_collection",
            )
        ]
```

Two load-bearing details:

- **`collection` is denormalised onto the alias** because entry slugs are unique
  *per collection*, so aliases must be scoped the same way — otherwise a stale
  alias in one collection can shadow a live entry's slug in another.
- **The unique index is partial** (`condition=Q(is_active=True)`). This is what
  lets you retire an alias without deleting the audit trail.

The recording algorithm has four guards, each protecting against a real failure:

```python
def record_slug_change(entry, old_slug, *, note=""):
    old_slug = (old_slug or "").strip()
    if not old_slug or old_slug == entry.slug:
        return None

    # 1. RECLAIM: the entry has taken this slug back — the live row wins.
    EntrySlugHistory.objects.filter(
        collection_id=entry.collection_id, slug=entry.slug, is_active=True
    ).update(is_active=False)

    # 2. NEVER SHADOW a live entry that now holds the old slug.
    if Entry.objects.filter(collection_id=entry.collection_id,
                            slug=old_slug).exclude(pk=entry.pk).exists():
        return None

    # 3. NEVER STEAL another entry's existing alias.
    existing = EntrySlugHistory.objects.filter(
        collection_id=entry.collection_id, slug=old_slug, is_active=True).first()
    if existing:
        return existing          # no remap, no duplicate

    # 4. Record it.
    return EntrySlugHistory.objects.create(
        entry=entry, collection_id=entry.collection_id, slug=old_slug,
        note=note or f"renamed to '{entry.slug}'")
```

### 6.3 Resolution and the redirect hint

Aliases resolve **only** when active *and* the target is currently published —
a rename should keep a live article reachable, never resurrect one that was
drafted or deleted on purpose.

When a single-slug lookup finds nothing, the delivery API retries against the
alias table and, on a hit, returns the entry **plus a redirect hint**:

```json
{
  "data": [ { "...": "the entry, under its CURRENT slug" } ],
  "meta": {
    "pagination": { "page": 1, "pageSize": 25, "pageCount": 1, "total": 1 },
    "redirect": {
      "from": "the-old-slug",
      "to": "the-current-slug",
      "reason": "slug_changed"
    }
  }
}
```

The frontend answers with a **permanent redirect** rather than serving one
article under two URLs. Link equity is preserved and no duplicate content is
created.

The trigger must be **deliberately narrow** — only when the query is
unambiguously a single-slug lookup:

```python
def single_slug_lookup(params):
    """Return the slug ONLY if this is unambiguously a one-slug lookup."""
    # every filter present must be on `slug`, with $eq/$eqi,
    # exactly one such filter, exactly one value → else None
```

Otherwise a legitimately-empty list query (a category with no published entries)
would trigger alias resolution and return an unrelated article.

### 6.4 Supporting operations

Three small capabilities make slugs manageable in practice:

- **An availability endpoint** for the editor's slug field — slugifies the input
  server-side (so it accepts a raw title), reports whether it is free, suggests
  the next free `slug-N`, and says *why* it would be rejected.
- **An alias-recording command**, for renames that predate the alias table. Use
  it only for **verified** mappings — guessing a plausible target is how an
  article permanently redirects to something it was never about.
- **A read-only audit command** reporting duplicates, values that fail the
  validator, and aliases colliding with live entries. Never auto-rewrites:
  historical junk stays visible until someone fixes it deliberately.

---

## 7. Auth and the RBAC matrix

### 7.1 The problem with a single role enum

A three-value enum (`admin`/`editor`/`author`) expresses *how much authority*
someone has. It cannot express **which modules** they reach — and that is what
real teams need. A Careers/HR user and a Sales user may both be "editors" while
sharing no screens at all.

The solution is a **module × action matrix**, with the coarse enum retained as a
cross-service compatibility claim.

### 7.2 A closed registry as the single source of truth

Define the vocabulary in one module that both the checker and the UI read:

```python
class Action(models.TextChoices):      # escalating authority
    VIEW, CREATE, EDIT, PUBLISH, VERIFY, ARCHIVE, MANAGE

MODULE_GROUPS = (
    ("",               ("dashboard",)),
    ("WEBSITE",        ("pages", "blogs", "faqs", "media", "seo")),
    ("BUSINESS",       ("leads", "emi")),
    ("CAREERS",        ("careers", "job_positions", "applications",
                        "departments", "career_page")),
    ("ADMINISTRATION", ("users", "roles", "settings")),
)

# Not every action is meaningful on every module.
_READ_ONLY   = (VIEW,)
_CONTENT     = (VIEW, CREATE, EDIT, PUBLISH, VERIFY, ARCHIVE)
_MAINTENANCE = (VIEW, EDIT, PUBLISH, VERIFY)   # edit & publish, nothing to create

ALLOWED_ACTIONS = {
    "dashboard": _READ_ONLY,
    "pages": _MAINTENANCE,        # pages are seeded, not authored
    "blogs": _CONTENT,
    "faqs":  _CONTENT,
    "media": (VIEW, CREATE, EDIT, ARCHIVE),
    ...
}
```

Making the module set **closed** is a design choice with teeth: future screens
are excluded by construction, not by remembering to hide them.

### 7.3 Normalise grants on write

Store the matrix as flat JSON, `{module: [action, ...]}` — no nesting, no
wildcards, no deny rules. **Absence is denial.** Normalise on every save so a
stored grant can never name something the checker would not honour:

```python
def normalise(permissions):
    clean = {}
    for module, actions in (permissions or {}).items():
        allowed = ALLOWED_ACTIONS.get(module)
        if allowed is None or not isinstance(actions, (list, tuple, set)):
            continue
        # iterate ALLOWED (not the input) → canonical order + dedupe for free
        kept = [a for a in allowed if a in set(actions)]
        if kept:
            clean[module] = kept
    return clean
```

One pass does three jobs: drops unknown modules, drops unknown actions, and
orders the output canonically.

**But validate loudly at the API boundary anyway.** Silent normalisation means
"the Roles screen shows a checkbox ticked, saves, reloads, and shows it unticked
with no explanation." The serializer should reject unknown modules and
disallowed actions with specific messages.

### 7.4 Deriving the coarse claim downward

Keep the legacy enum as a denormalised field derived from the role:

```python
class AdminUser(AbstractUser):
    role        = CharField(choices=["admin","editor","author"], default="author")
    access_role = FK("accounts.Role", null=True, blank=True, related_name="users")

    def save(self, *args, **kwargs):
        if self.access_role_id and self.access_role.legacy_role:
            self.role = self.access_role.legacy_role
        super().save(*args, **kwargs)
```

And when a role's mapping changes, **fan it out immediately** — otherwise every
current holder carries a stale claim until their account happens to be re-saved:

```python
class Role(models.Model):
    def save(self, *args, **kwargs):
        self.permissions = normalise(self.permissions)
        super().save(*args, **kwargs)
        self.users.exclude(role=self.legacy_role).update(role=self.legacy_role)
```

Effective-permission resolution has a clear precedence, with a **legacy fallback
so pre-matrix accounts do not lose access on ship day**:

```python
def permission_map(self):
    if self.is_superuser:   return full_access()
    if self.access_role_id: return dict(self.access_role.permissions or {})
    return self._legacy_permission_map()     # derived from the old enum

def can(self, module, action=Action.VIEW):
    if self.is_superuser:
        return action in ALLOWED_ACTIONS.get(module, ())   # still registry-bound
    return action in self.permission_map().get(module, ())
```

Note that even a superuser is bound by `ALLOWED_ACTIONS` — nobody can be granted
`publish` on a module where publishing is meaningless.

### 7.5 The permission class

Views declare their module and any per-action overrides; the class maps HTTP
method → action and **fails closed**:

```python
METHOD_ACTIONS = {
    "GET": VIEW, "HEAD": VIEW, "OPTIONS": VIEW,
    "POST": CREATE, "PUT": EDIT, "PATCH": EDIT, "DELETE": ARCHIVE,
}

class HasModulePermission(BasePermission):
    message = "Your role does not include this action."

    def has_permission(self, request, view):
        user = request.user
        if not (user and user.is_authenticated):
            return False
        module = getattr(view, "permission_module", None)
        if module is None:
            return False                       # ← fail closed on misconfiguration
        overrides = getattr(view, "permission_actions", {}) or {}
        action = overrides.get(getattr(view, "action", None)) \
                 or METHOD_ACTIONS.get(request.method, VIEW)
        if user.can(module, action):
            return True
        # a safe method passes if the user can view the module at all
        return request.method in SAFE_METHODS and user.can(module, VIEW)
```

Usage:

```python
class EntryViewSet(viewsets.ModelViewSet):
    permission_classes  = [HasModulePermission]
    permission_module   = Module.BLOGS
    permission_actions  = {          # workflow verbs name their own requirement
        "publish": Action.PUBLISH, "unpublish": Action.PUBLISH,
        "duplicate": Action.CREATE, "restore": Action.EDIT,
    }
```

Why the overrides matter: workflow verbs arrive as `POST` routes, which would
otherwise all read as `CREATE`. `DELETE → ARCHIVE` (rather than a `delete`
action) matches a soft-delete design.

Combined with a project default of `IsAuthenticated`, a forgotten permission
declaration on a new view yields **403, not an open door**.

### 7.6 Serve the registry to the UI

Expose the registry over the API so the permissions grid and the server checker
**cannot drift**:

```http
GET /admin-api/auth/permission-registry/
```
```json
{
  "actions": [ { "key": "view", "label": "View" }, "…" ],
  "groups": [
    { "title": "WEBSITE", "modules": [
        { "key": "blogs", "label": "Blogs",
          "actions": ["view","create","edit","publish","verify","archive"] }
    ]}
  ]
}
```

Deliberately **not** module-gated — everyone needs it to render the shell.

### 7.7 JWT and cross-service enforcement

Embed the matrix in the token so a *separate* service — with no access to your
user table — can enforce the same rules using only a shared signing key:

```python
@classmethod
def get_token(cls, user):
    token = super().get_token(user)
    token["username"]    = user.username
    token["role"]        = "admin" if user.is_superuser else user.role
    permissions          = user.permission_map()
    token["modules"]     = sorted(permissions.keys())
    token["permissions"] = {m: list(a) for m, a in permissions.items()}
    return token
```

The downstream service degrades gracefully across three tiers:

```python
if modules is None:                  # pre-matrix token
    allowed = payload.get("role") in {"admin", "editor"}
elif self.module not in modules:
    allowed = False
elif isinstance(grants, dict):
    allowed = needed in (grants.get(self.module) or ())
else:                                # modules but no permissions map
    allowed = True
```

And when the signing key is unconfigured it raises **503, not 403** — "I cannot
check" is a different answer from "you may not", and conflating them turns a
deployment mistake into a silent lockout.

> ⚠ **Operational caveat:** tokens carry a permission *snapshot*. Revoking a
> grant does not invalidate issued access tokens — they remain valid until
> expiry. Keep access-token lifetime short in production (30 min) and understand
> that without a blacklist there is no true logout; clients discard tokens.

### 7.8 Seeding roles safely

Seed archetypes in a data migration, keyed on a stable slug:

- Use **`get_or_create`, never `update_or_create`** — a redeploy must not quietly
  hand back permissions an admin deliberately removed.
- Mark them `is_system=True` and **refuse to delete them**, so an admin cannot
  lock everyone out by removing the role their own account depends on.
- Refuse deletion of any role users still hold, naming the count.
- Reverse the migration narrowly: `filter(slug__in=…, is_system=True, users__isnull=True)`.

---

## 8. The public delivery API

### 8.1 Route shape

One dynamic route serves every collection:

```
GET /api/<collection_api_uid>        e.g. /api/articles, /api/case-studies
```

Adding a collection adds a route with no deployment.

> ⚠ **Ordering trap:** this route ends in a catch-all path converter. Any
> *fixed* public route (`/api/faqs`, `/api/page-content`) **must be registered
> before** the catch-all include, or it resolves as a collection lookup and 404s.

Characteristics:

- `permission_classes = [AllowAny]` **and** `authentication_classes = []` — the
  latter matters: it stops the framework even attempting session/JWT auth on a
  public endpoint.
- `GET` only; anything else is 405.
- Unknown **or inactive** collection → **404**, identically. Deactivating a
  collection takes its whole route dark.
- `Cache-Control: public, max-age=60, stale-while-revalidate=600`.

### 8.2 Query parameters

A deliberately **small subset** of the Strapi query language — what the client
actually uses, plus a safe margin.

**Filtering** — `filters[<field>][<$op>]=<value>`:

| Operator | ORM lookup | Notes |
|---|---|---|
| `$eq` | `exact` | |
| `$eqi` | `iexact` | |
| `$ne` | `exact` | routed through `.exclude()` |
| `$in` | `in` | repeated keys or comma-separated |
| `$contains` | `icontains` | case-**insensitive** |
| `$null` | `isnull` | value coerced to bool |
| `$gt` `$gte` `$lt` `$lte` | same | |

**Field whitelist.** Filtering and sorting both resolve through one closed
camelCase → column map. Anything not in it is **silently ignored**. This is the
security boundary: it is what stops `filters[password][$contains]` from ever
being a question.

```python
FIELD_MAP = {
    "slug": "slug", "title": "title", "documentId": "document_id",
    "isFeatured": "is_featured", "sortOrder": "sort_order",
    "publishedOn": "published_on", "publishedAt": "published_at",
    "updatedAt": "updated_at", "readTime": "read_time",
}
```

**Other params:**

| Param | Behaviour |
|---|---|
| `fields[0]=slug`, `fields[1]=…` | scalar selection; `id` and `documentId` are **always** included |
| `pagination[page]` | default 1, floored at 1 |
| `pagination[pageSize]` | default 25, **clamped to 200** |
| `sort[0]=title:desc` | `field`, `field:asc`, `field:desc` |
| `populate=*` | accepted for client compatibility; responses are fully populated regardless |

Invalid parameters are **silently ignored, never a 400** — a frontend should not
break because a stray param was appended.

⚠ **But:** see [§17](#17-known-weaknesses-to-fix-when-copying) — in the source
system an *unparseable value* on a typed column (`filters[isFeatured][$eq]=true`,
`filters[readTime][$gte]=abc`) raises an uncaught error and returns **500**.
Coerce per-column and treat failures as "no match" or 400.

### 8.3 Response envelope

A flat envelope — fields at the top level of each item, **not** nested under an
`attributes` key:

```json
{
  "data": [ { "id": 5, "documentId": "…", "title": "…" } ],
  "meta": {
    "pagination": { "page": 1, "pageSize": 25, "pageCount": 1, "total": 5 }
  }
}
```

`data` is **always an array**. There is no single-object shape — "fetch one" is
just a slug filter returning a one-element array. This keeps the client's
parsing uniform.

The full item shape (verified against a running instance — 24 keys):

```jsonc
{
  "id": 5,
  "documentId": "1d457dc2-def9-4a93-963a-12b5c10d51cd",
  "title": "How to Choose the Right Solar Inverter",
  "slug": "how-to-choose-the-right-solar-inverter",
  "excerpt": "String, hybrid or micro? …",
  "summary": [ /* rich-text blocks */ ],
  "introduction": [ /* rich-text blocks */ ],
  "readTime": 6,
  "isFeatured": false,
  "sortOrder": null,
  "publishedOn": "2026-07-22T12:59:56.555037+00:00",
  "updatedAt":   "2026-07-22T12:59:56.555167+00:00",
  "publishedAt": "2026-07-22T12:59:56.555037+00:00",

  "author":     { "id": 1, "name": "…", "bio": "…", "role": "…" },
  "categories": [ { "id": 2, "name": "Cost & Savings", "slug": "cost-savings" } ],
  "tags":       [ { "id": 2, "name": "Kerala" } ],
  "badges":     [ { "id": 1, "label": "Reviewed by Engineering", "color": "#ED8723" } ],

  "contentBlocks": [
    { "__component": "shared.rich-text", "id": 7, "body": [ /* blocks */ ] }
  ],
  "coverImage": {
    "url": "https://cdn.example.net/cms/articles/cover.webp",
    "width": 1920, "height": 1080, "alternativeText": null
  },
  "warning":  "Never install an inverter in direct sunlight…",
  "insights": "A hybrid inverter costs ~15% more upfront…",
  "seo": {
    "metaTitle": "…", "metaDescription": "…",
    "canonicalUrl": null, "keywords": "…"
  },

  // Template image groups, keyed by their STABLE key.
  // single group → string; repeatable group → array.
  "imgUrls": {
    "coverImg":   "https://cdn.example.net/cms/articles/cover.webp",
    "bodyImages": [ "https://…/a.webp", "https://…/b.webp" ]
  },

  // EVERY attribute slot value, so custom slots reach the frontend
  // without a delivery-code change.
  "attributes": { "difficulty": "Beginner", "readTime": 6 }
}
```

### 8.4 Assembling `imgUrls`

The rule that makes templates reach the frontend:

1. Read the entry's template image groups into `{key: repeatable}`.
2. Group the entry's image rows by `group_key`, resolving each URL and skipping
   unresolvable ones.
3. Per key: `out[key] = urls if repeatable else urls[0]`.
4. If no images resolve at all, emit `null`.

With no template to consult, infer `repeatable = len(urls) > 1`. A repeatable
group holding exactly one image still emits a **one-element array** when the
template says repeatable — which is what keeps the client's type stable.

### 8.5 The `attributes` escape hatch

Emitting **every** slot value under `attributes` is what makes the template
system genuinely extensible: adding a `difficulty` slot in the admin makes
`attributes.difficulty` appear in the public payload with **no delivery code
change and no deployment**.

### 8.6 Legacy field resolution

When a system predates its own template mechanism, you will have both typed
columns and slot values for the same concept. Resolve with **legacy column
wins, slot as fallback**:

```python
def _scalar(legacy_value, slot_key):
    if legacy_value not in (None, ""):
        return legacy_value
    v = attrs.get(slot_key)
    return v if v not in (None, "") else None
```

Document the well-known keys so new templates adopt them, tell the new admin UI
to write **only** the canonical channel, and plan the column removal.

### 8.7 Absolute media URLs

The public API must emit fully-qualified URLs. One helper, applied everywhere:

```python
def absolute_media_url(url):
    if not url:                                   return None
    if url.startswith(("http://", "https://")):   return url   # CDN: pass through
    return f"{settings.PUBLIC_MEDIA_BASE_URL}{url}"
```

---

## 9. The authoring API

### 9.1 Conventions

- **Base:** `/admin-api/`, **trailing slashes required**.
- **Auth:** `Authorization: Bearer <access token>`.
- **Pagination:** page-number, 25/page — `{count, next, previous, results}`.
- **Validation errors:** `400` with a field-keyed object.
- **Permission errors:** `401` invalid/expired token; `403` module/action denied.

### 9.2 Session endpoints

| Method | Path | Body → Response |
|---|---|---|
| `POST` | `auth/login/` | `{username, password}` → `{access, refresh}` |
| `POST` | `auth/refresh/` | `{refresh}` → `{access, refresh}` (**rotates** — always store the new one) |
| `GET` | `auth/me/` | current user + effective permissions |
| `GET` | `auth/permission-registry/` | the module/action vocabulary |

`auth/me/` drives UI gating:

```json
{
  "id": 1, "username": "sree", "email": "…",
  "first_name": "Sree", "last_name": "Nath",
  "role": "admin",
  "access_role": 2, "access_role_name": "Content Manager",
  "access_role_slug": "content-manager",
  "permissions": { "blogs": ["view","create","edit","publish"], "media": ["view","create"] },
  "can_publish": true, "can_edit_schema": true,
  "is_staff": true, "is_active": true,
  "last_login": "…", "date_joined": "…"
}
```

> These flags are for **hiding buttons, not for security**. Every rule is
> enforced server-side independently.

### 9.3 Shell endpoints

**`GET config/`** — static metadata, fetched once at boot:

```json
{
  "environment": "production",
  "site_url": "https://example.com",
  "blog_path": "/blog",
  "media_base_url": "https://cdn.example.net",
  "delivery_api_base": "/api"
}
```

**`GET dashboard/`** — one call for the dashboard **and** the sidebar badges.
Answer "what needs attention", not just "how many rows exist":

```json
{
  "counts": {
    "collections": 3, "entries": 11, "entries_draft": 4, "entries_published": 7,
    "templates": 2, "media_assets": 4, "authors": 1, "categories": 5,
    "faqs_draft": 2, "positions_active": 3, "pages_seo_issues": 4
  },
  "recent_entries": [ /* 5 most recently updated, list-row shape */ ],
  "recent_activity": [
    { "kind": "blog", "label": "…", "detail": "Published · Articles",
      "href": "/studio/entries/7", "actor": "Sree Nath", "at": "…" }
  ]
}
```

The cross-module activity feed (`kind` + `href`) is what makes a dashboard
useful rather than decorative.

### 9.4 Entries

**List — `GET entries/`** returns **slim rows** (no bodies, images or SEO):

```json
{
  "id": 7, "document_id": "uuid", "collection": 1, "collection_uid": "articles",
  "collection_name": "Articles", "template": 2, "template_slug": "solar-guide",
  "title": "…", "slug": "…", "excerpt": "…", "status": "draft",
  "author_name": "…", "cover_url": "https://…",
  "is_featured": false, "sort_order": null,
  "published_on": null, "published_at": null, "deleted_at": null,
  "created_at": "…", "updated_at": "…"
}
```

Splitting list and detail shapes is what keeps the list screen fast.

Filters (combinable): `collection=<id|api_uid>`, `status`, `category`, `tag`,
`template`, `author`, `search` (title/slug), `ordering` (whitelisted fields,
`-` prefix for descending), `include_deleted=1`.

Note the **dual-mode `collection`** param — numeric matches the PK, otherwise
the public `api_uid`. It is a small thing that makes URLs hand-writable.

**Detail — `GET entries/{id}/`** returns the full shape with relations expanded
as objects, plus `content_blocks`, `images`, `attribute_values`, `seo` and
`slug_history`.

**Write — `POST entries/` / `PATCH entries/{id}/`.** One call saves everything;
relations are **ids on write**, expanded objects on read.

```json
{
  "collection": 1, "template": 2,
  "title": "…", "slug": "top-5-maintenance-tips", "excerpt": "…",
  "introduction": [ /* blocks */ ],
  "author": 1, "categories": [1, 2], "tags": [3], "badges": [],
  "content_blocks": [ { "component": "shared.rich-text", "body": [], "order": 0 } ],
  "images": [
    { "group_key": "coverImg",   "position": 0, "media_asset": 4 },
    { "group_key": "bodyImages", "position": 0, "media_asset": 6 },
    { "group_key": "bodyImages", "position": 1, "external_url": "https://…/x.webp" }
  ],
  "attribute_values": [ { "slot_key": "readTime", "value": 6 } ],
  "seo": { "meta_title": "…", "meta_description": "…", "keywords": "a, b" }
}
```

> ⚠ **Child collections are replace-all on PATCH.** Sending
> `content_blocks` / `images` / `attribute_values` replaces the **entire** set
> (send every row); omitting the key leaves it untouched. Same for
> `categories`/`tags`/`badges`. Document this loudly — it is the single easiest
> way for a client to silently destroy data.

Each image row uses **either** `media_asset` **or** `external_url`.

**Slug availability — `GET entries/check-slug/`**
`?collection=<id|api_uid>&slug=<candidate>[&exclude=<entry id>]`

```json
{ "slug": "top-5-maintenance-tips", "available": true,
  "suggestion": "top-5-maintenance-tips", "valid": true, "error": null }
```

"Taken" includes **retired aliases still pointing at another entry**. Pass
`exclude` when editing so an entry does not block its own slug.

**Workflow actions:**

| Action | Endpoint | Required action | Result |
|---|---|---|---|
| Save draft | `PATCH entries/{id}/` | `edit` | any role |
| Publish | `POST entries/{id}/publish/` | `publish` | validates against template |
| Unpublish | `POST entries/{id}/unpublish/` | `publish` | |
| Duplicate | `POST entries/{id}/duplicate/` | `create` | `201`, new draft, `-copy` slug |
| Restore | `POST entries/{id}/restore/` | `edit` | deleted → draft |
| Delete | `DELETE entries/{id}/` | `archive` | `204`, soft |

Every successful workflow action returns the **fresh full entry**, so the client
updates from the response rather than re-fetching.

### 9.5 Schema endpoints

`collections/`, `templates/`, `template-image-groups/`,
`template-attribute-slots/` — reads open to any authenticated user, **writes
restricted to schema editors**.

`GET templates/{id}/` is the **form schema for the entry editor**: the UI renders
its Images and Attributes sections directly from `image_groups` and
`attribute_slots` (chips like `single`, `repeatable · max 8`, `readTime · number`
all come from these objects).

Nested groups/slots are **read-only on the template endpoint** — manage them
through their own CRUD routes, each carrying a writable `template` id. Duplicate
keys produce a specific message: `"This template already has an image group with
this key."`

`POST templates/{id}/duplicate/` deep-copies a template with all its groups and
slots. Existing entries stay on the original.

### 9.6 Taxonomy endpoints

`authors/`, `categories/`, `tags/`, `badges/` — simple CRUD, gated on the
content module ("an editor who can write a post can file it"). These back the
inline `+` chips in the editor's Organize panel.

---

## 10. Structured modules beyond the generic engine

Not all content fits the collection/entry engine. Marketing pages, FAQs and job
listings have **known, fixed shapes** and benefit from purpose-built models.

The generalisable insight: **decide per content type whether it is *authored* or
*maintained*.**

| | Authored | Maintained |
|---|---|---|
| Rows created by | authors, freely | developers, via migration |
| Example | blog entries | marketing pages |
| API | full CRUD | **edit-only** |

### 10.1 Maintained pages — edit-only, not CRUD

A marketing page's *existence* and *route* are a frontend concern: the page is a
React route, and the CMS only fills in its copy and images. So:

- Pages are **seeded by a data migration**, keyed on `route` via `get_or_create`.
- The API exposes **no create and no delete route**, and the registry grants
  neither action on the module — refused twice over, so even a super admin gets
  a 403.
- `route` and `name` are **read-only** on update.
- Content lives in explicit, declared slots:
  - `PageTextSlot` — `key`, `label`, `value`, `max_length` (enforced, because
    marketing copy has real layout limits)
  - `PageImageSlot` — `key`, `label`, `media_asset`
  - `PageSeo` — one-to-one SEO block

Editing a slot is a scoped nested action, not a generic row update:

```
PATCH /admin-api/pages/{id}/text-slots/{slot_id}/     { "value": "Join us" }
PATCH /admin-api/pages/{id}/image-slots/{slot_id}/    { "asset": 12, "alt_text": "…" }
GET|PATCH /admin-api/pages/{id}/seo/
GET  /admin-api/pages/{id}/preview/
```

The nested route is what makes `key` un-forgeable. Reinforce it in the
serializer: on a text slot **only `value` is writable** (`key`, `label`, `kind`,
`guidance`, `max_length`, `order` are read-only); on an image slot **only
`asset` and `alt_text`**. A client cannot rename or re-cap a slot by including
those fields — they are silently ignored rather than honoured.

The `max_length` cap is enforced **server-side** with a message that states the
actual numbers, because the author needs to know how much to cut:

> `"This field holds up to 80 characters — you have 97."`

**Escalate the permission check on a status change.** Reordering a page and
taking it off the site are different acts, even though both are a `PATCH`:

```python
def perform_update(self, serializer):
    new_status = serializer.validated_data.get("status")
    if new_status and new_status != self.get_object().status:
        if not require(self.request.user, Module.PAGES, Action.PUBLISH):
            raise PermissionDenied("Changing a page's status needs the Publish permission.")
    serializer.save(updated_by=self.request.user)
```

So `pages.edit` alone can reorder and rewrite copy, but cannot unpublish.

Public read:

```http
GET /api/page-content?route=/
```
```json
{ "data": { "route": "/", "name": "Home",
            "images": {}, "text": {}, "seo": null } }
```

`text` and `images` are **keyed maps**, so the frontend reads
`text.hero_title` — stable regardless of admin-side reordering or relabelling.

### 10.2 FAQs — ordering as a first-class feature

Display order is editorial, so make reordering a **dedicated endpoint**, not N
separate row updates (which would be non-atomic and racy):

```
POST /admin-api/faqs/reorder/      →  reorders within a page/section scope
POST /admin-api/faqs/{id}/publish/
POST /admin-api/faqs/{id}/unpublish/
POST /admin-api/faqs/{id}/archive/
POST /admin-api/faqs/{id}/restore/
GET  /admin-api/faqs/{id}/preview/
```

Model notes: ordering is `["page", "section", "display_order", "id"]`, so the
**default ordering is the published order** and nothing downstream has to
re-sort. New FAQs land at the end of their section (a `next_display_order()`
helper returns `max + 1`, or `0` when empty, so new rows never collide on 0).
`section` is a free string scoped to the page; grouping is by `(page, section)`
throughout, with `category` as a purely optional label/filter.

The reorder body names its scope explicitly and is `@transaction.atomic`:

```json
POST /admin-api/faqs/reorder/
{ "page": 3, "section": "Pricing", "order": [17, 12, 44] }
```

Two details make it safe against a stale admin tab:

1. **Ids not in that page/section are silently ignored and do not consume a
   position** — a client working from stale data cannot corrupt the sequence.
2. **Members omitted from `order` are appended**, sorted by their existing
   order, rather than being left with colliding values.

**`status` is read-only on the serializer.** It moves *only* through the
workflow actions, so a careless `PATCH` can never publish something.

Surface `publish_errors` on **every read**, so the editor can disable the
Publish button and say why before the author clicks it.

**Guard hard deletes with a dependant count and a remediation.** Categories and
departments are genuinely deletable, but not while in use — and the check
pre-empts a database `PROTECT` that would otherwise surface as a raw 500:

```json
400 { "detail": "4 FAQ(s) use this category. Deactivate it instead, or move those FAQs first." }
```

Public read requires an explicit page scope:

```http
GET /api/faqs?page=/            →  400 without `page`; 404 for an unknown page
```
```json
{ "data": [
  { "id": 1, "question": "What maintenance is required?", "answer": "Minimal…",
    "section": "", "category": null, "order": 0 }
] }
```

### 10.3 Careers — a lifecycle with a meaningful terminal state

Job positions carry a richer lifecycle than blog entries: `publish`,
`unpublish`, **`close`** and `archive`. Departments are a separate managed
module, deletable only when no positions belong to them.

**`closed` is not `unpublished`** — and the distinction earns its keep at the
public route. A closed posting **still resolves publicly**, flagged
`is_open: false`, so a bookmarked or indexed link says *"no longer accepting
applications"* instead of 404ing. Draft and archived postings 404.

```
GET  /api/job-positions[?department=<dept-slug>]
GET  /api/job-positions/<slug>
```
```json
{ "data": [],
  "meta": { "count": 0, "departments": [],
            "accepting_general_applications": true, "intro": "" } }
```

The public list carries the facets the page needs (`departments`) and the
**site-settings-driven flags** (`accepting_general_applications`, `intro`) in
`meta`, so the careers page renders from one request.

> **A boundary worth copying deliberately:** in the source system, job
> *applications* deliberately **do not live in the CMS**. They sit with the rest
> of the lead data in a separate service, carrying the position id plus a
> **snapshot** of the title and department rather than a foreign key — so an
> application preserves what the candidate actually applied to even after the
> posting is edited or archived. The consequence is that the CMS has no resume
> upload and no application workflow; a module key is reserved and granted, and
> the admin UI fetches those records from the other service directly.
>
> If your applications *do* belong in the CMS, model them here — but keep the
> snapshot idea. Denormalising the title and department at submission time is
> what makes historical applications readable years later.

### 10.4 Site settings — a typed singleton

For global settings, prefer a **typed singleton row** over key/value pairs: the
fields are known, and typed values are what let schema builders and notification
senders read them without guessing.

```python
class SiteSettings(models.Model):
    SINGLETON_PK = 1

    def save(self, *args, **kwargs):
        self.pk = self.SINGLETON_PK      # a second row cannot be created
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        return None                      # not deletable; clear fields to reset

    @classmethod
    def load(cls):
        row, _ = cls.objects.get_or_create(pk=cls.SINGLETON_PK)
        return row
```

Pinning the PK in `save()` is what makes the singleton **structurally**
guaranteed rather than conventionally.

Scope it deliberately — "a settings screen is where scope creep goes to hide."
The source system limits it to company/address info (which also feeds the
`Organization` JSON-LD), notification recipients, site-wide SEO defaults and
careers configuration.

Two details worth copying: comma-separated recipient lists exposed as **parsed
read-only list fields** (`lead_recipients`) alongside the raw string, and
**validating those addresses on save** — a typo does not fail at send time, the
mail just never arrives and nobody finds out until a lead is missed.

Being a singleton, it needs **no list route, no detail route and no id** —
`GET`/`PATCH` on one path, with no `id` field in the payload to reinforce the
shape.

### 10.5 Cross-cutting rules for structured modules

These hold across every module and are worth adopting as house style:

1. **Soft delete is the default.** `DELETE` archives and returns `204`. Hard
   deletes exist only for taxonomy rows, and only behind a dependant-count guard.
   Maintained pages expose no `DELETE` at all; settings cannot be deleted.
2. **`status` is never `PATCH`-writable on content records.** It moves only via
   workflow actions. Where a record does allow it (maintained pages), the check
   is escalated to the publish action inside `perform_update`.
3. **`published_at` is sticky** — set on first publish, never cleared by
   unpublish, on every content type. Consistency here matters more than which
   rule you pick.
4. **Every module offers a `preview/` endpoint** returning the SEO and JSON-LD
   the public site will actually emit, plus outstanding issues. Authors should
   be able to see the real output before publishing, not a guess.
5. **Watch param naming across the two surfaces.** In the source system the same
   concept is `?page_id=<int>` on the admin API (because `?page` means
   pagination) but `?page=<route>` publicly, and `?department=<id>` vs
   `?department=<slug>`. That divergence is a real usability tax — pick one
   convention and document any forced exception.

---

## 11. Media pipeline and CDN

### 11.1 The asset model

```python
class MediaAsset(models.Model):
    file             = ImageField(upload_to=upload_to)
    collection       = FK(Collection, null=True, blank=True)  # → CDN folder
    cdn_url          = URLField(1000, blank=True)
    storage_path     = CharField(500, blank=True)
    mime             = CharField(120, blank=True)
    size             = PositiveIntegerField(default=0)
    width            = PositiveIntegerField(null=True)
    height           = PositiveIntegerField(null=True)
    alternative_text = CharField(255, blank=True)
    caption          = CharField(255, blank=True)
    created_at / updated_at
```

**URL resolution is always "CDN wins, local fallback":**

```python
def resolved_url(asset):
    if asset.cdn_url:
        return asset.cdn_url
    try:    return absolute_media_url(asset.file.url)
    except ValueError:  return None     # no file associated
```

> ⚠ Define this **once**, as a property on the model. The source system
> reimplements it in three places (admin serializer, delivery serializer, entry
> image resolution) — a genuine maintenance hazard.

### 11.2 The upload pipeline

Compress → convert → upload → stamp, triggered from a `post_save` signal so
**every** upload path is covered by one code path (admin, API, inline pickers):

```python
@receiver(post_save, sender=MediaAsset)
def push_to_cdn(sender, instance, created, **kwargs):
    if instance.file and not instance.cdn_url:   # note: not `created` —
        process_asset(instance)                  # a failed upload retries later
```

**Compression:**

- Preserve transparency: convert to `RGBA` if the image has an alpha band or a
  palette; otherwise `RGB`.
- Resize on the **long edge only**, preserving aspect ratio, and **never
  upscale** — images already under the cap are untouched.
- Encode to **WebP** at a configurable quality (default 80) with the
  slowest/best compression method.

**Immutable storage paths — the key trick:**

```python
def build_storage_path(original_name, collection_uid):
    stem   = original_name.rsplit("/", 1)[-1].rsplit(".", 1)[0]
    safe   = slugify(stem)[:60] or "image"
    folder = collection_uid or "general"
    return f"cms/{folder}/{safe}-{uuid4().hex[:8]}.webp"
```

Because every upload gets a **random suffix**, no path is ever reused —
therefore **no cache purging is ever necessary**. This eliminates an entire
class of CDN-invalidation bugs. (The source system still carries unused
purge-related settings; they are dead config, and this is why.)

**Upload and deletion** are a plain authenticated `PUT`/`DELETE` against the
storage API. Deletion is best-effort and never raises; a failed cleanup should
not fail the user's request.

**Failure is non-fatal by design.** If the CDN is unreachable, catch broadly,
log a warning and return — the asset keeps working from local storage. The
whole feature degrades rather than breaking uploads.

**Avoid signal recursion** by writing results through a queryset update, then
mirroring onto the in-memory instance so the caller sees fresh values:

```python
type(asset).objects.filter(pk=asset.pk).update(
    cdn_url=cdn_url, storage_path=path,
    width=w, height=h, size=len(data), mime="image/webp")
```

**On delete**, remove both the CDN object and the local file.

### 11.3 Media endpoints

```
GET    /admin-api/media-assets/          ?collection=<id|api_uid>&search=<filename|alt>
POST   /admin-api/media-assets/          multipart: file + optional collection, alt, caption
PATCH  /admin-api/media-assets/{id}/     metadata only — the file is immutable
DELETE /admin-api/media-assets/{id}/
```

```json
{
  "id": 4, "file": "blog/roof.jpg", "collection": 1,
  "url": "https://cdn…/cms/articles/roof-a1b2c3d4.webp",
  "cdn_url": "https://cdn…", "mime": "image/webp", "size": 182034,
  "width": 1920, "height": 1080,
  "alternative_text": "…", "caption": "…", "created_at": "…"
}
```

Always render `url` — it encapsulates the CDN/local decision.

**The file is immutable after upload** (the CDN path derives from it); replacing
an image means uploading a new asset and re-linking. The serializer drops a
`file` on update.

⚠ Two behaviours to improve when copying: a `file` sent on PATCH is **silently
discarded** rather than rejected, and deletion has **no usage check** — entry
rows referencing a deleted asset survive but resolve to no image.

⚠ **The upload request blocks** on compression plus the CDN PUT. For large
images or a slow CDN this is a slow endpoint; consider offloading to a task
queue and returning the local URL immediately.

Provide a **backfill command** for pre-CDN assets: select everything with no
`cdn_url`, process serially, report progress. Idempotent by construction, since
successes drop out of the pending set.

---

## 12. SEO subsystem

### 12.1 An abstract mixin, not a table

SEO fields apply to many models, so define them as an **abstract mixin** with no
table of its own:

```python
class SeoFields(models.Model):
    seo_title        = CharField(255, blank=True)   # falls back to the record's title
    meta_description = TextField(blank=True)
    canonical_url    = URLField(1000, blank=True)
    og_image         = FK("media.MediaAsset", null=True, blank=True,
                          related_name="+")          # ← "+" is REQUIRED here
    schema_type      = CharField(choices=SchemaType.choices, default="none")
    schema_extra     = JSONField(default=dict, blank=True)
    noindex          = BooleanField(default=False)

    class Meta:
        abstract = True
```

`related_name="+"` is load-bearing on an abstract mixin — without it every
concrete subclass collides on the reverse accessor name.

Subclasses override two hooks: `seo_fallback_title()` and `seo_path()`.

### 12.2 Quality reporting, not validation

Report SEO problems as **advice, never as save-blocking validation**:

```python
def seo_issues(self):   # → [{"level": "error"|"warning", "field", "message"}]
```

| Condition | Level | Message |
|---|---|---|
| No title and no fallback | error | "No SEO title, and nothing to fall back on." |
| Title > 60 chars | warning | "Title is N characters — search results usually cut off near 60." |
| No description | **error, or warning if `noindex`** | "…search engines will invent one from the page copy." |
| Description > 160 | warning | "…usually cut off near 160." |
| Description < 70 | warning | "…under 70 tends to read as thin." |

Two things to copy: the messages **explain the consequence** rather than stating
a rule, and severity is **context-dependent** — a noindexed page genuinely does
not need a description.

`seo_status()` collapses to `"error" | "warning" | "ok"` for badges.

### 12.3 JSON-LD generation from record facts

The governing principle:

> **Nothing reads a JSON field the author filled in.** Each builder reads the
> record's own typed columns. `schema_extra` only supplies what genuinely cannot
> be inferred.

Builders return a plain dict (or `None`); serialising and embedding is the
frontend's job. Two helpers make them safe:

- `_clean(value)` recursively drops `None`/`""`/`[]`/`{}` entries, so no
  null-valued keys are emitted.
- `_merge_extra(doc, extra)` merges author extras **last and non-destructively**,
  skipping `@`-prefixed keys and using `setdefault` — extras can fill gaps but
  can **never rewrite a record fact**.

Supported types: `WebPage`, `Article`, `FAQPage`, `JobPosting`, `Organization`,
`BreadcrumbList`, plus `none`.

One domain detail worth stealing: for a job posting, `validThrough` is **omitted
rather than invented** when no deadline is set — a wrong expiry silently
delists the job from Google Jobs.

### 12.4 The cross-module SEO overview

A single endpoint surveying SEO health across **every** content type:

```http
GET /admin-api/seo/overview/?kind=page|faq|job&seo_status=error|warning|ok
```
```json
{
  "counts": { "error": 3, "warning": 7, "ok": 22 },
  "results": [
    { "kind": "page", "id": 4, "label": "Home", "path": "/",
      "record_status": "published", "seo_title": "…", "meta_description": "…",
      "schema_type": "WebPage", "noindex": false, "seo_status": "error",
      "issues": [ { "level": "error", "field": "meta_description",
                    "message": "No meta description — …" } ] }
  ]
}
```

Sorted **worst first**. This is the screen that makes SEO debt visible instead
of theoretical.

⚠ It evaluates issues in Python across full table scans and is unpaginated —
fine at hundreds of rows, not at tens of thousands.

---

## 13. Cache invalidation / instant freshness

A frontend using incremental static regeneration serves cached pages. Without a
push, a publish is invisible until the ISR window elapses. Ping the frontend on
every state change:

```python
def trigger_revalidate(slug=None, *, path=None):
    url = getattr(settings, "FRONTEND_REVALIDATE_URL", "")
    if not url:
        return                              # ← no-op kill switch
    payload = {"secret": settings.FRONTEND_REVALIDATE_SECRET}
    if slug: payload["slug"] = slug
    if path: payload["path"] = path
    try:
        import requests                     # local import: optional dependency
        requests.post(url, json=payload, timeout=3)
    except Exception as exc:
        logger.warning("Revalidation ping failed: %s", exc)
```

Design properties worth keeping:

- **Best-effort.** The API is always live regardless; the ping is an
  optimisation. Never let it fail a publish.
- **A no-op kill switch.** An empty URL disables it — dev and test need no config.
- **Short timeout** (3s) so a hung frontend cannot stall an admin request.
- **Optional dependency** via function-local import.
- **The CMS names a slug, not a route.** The frontend decides what to rebuild
  (`/blog/<slug>`, the index, feeds). Keeps routing knowledge on the frontend.
- **Rename pings both slugs** — the old URL is about to start redirecting, so its
  cached page needs refreshing too.

⚠ Three things to fix when copying:

1. **The ping fires inside the transaction**, so a later rollback leaves the
   frontend told to rebuild something that never committed. Move it to
   `transaction.on_commit()`.
2. **The shared secret rides in the body**, unsigned, and the **response status
   is never checked** — a mismatched secret fails silently forever. Prefer an
   HMAC signature header and log non-2xx responses.
3. **Publishing pings twice** (once from the service, once from `post_save`).
   Harmless but wasteful; dedupe.

---

## 14. Configuration and deployment

### 14.1 Dev-safe defaults

Make the service run with an **empty environment**: SQLite, debug on, permissive
CORS. `migrate && runserver` should work on a fresh clone with no configuration.
Every production concern is then an explicit override.

```python
ENVIRONMENT = os.getenv("DJANGO_ENV", "development")
DEBUG = ENVIRONMENT != "production"

_db_engine = os.getenv("DB_ENGINE", "sqlite").strip()
if _db_engine in ("sqlite", "django.db.backends.sqlite3", ""):
    DATABASES = {"default": {"ENGINE": "…sqlite3", "NAME": BASE_DIR / "db.sqlite3"}}
else:
    DATABASES = {"default": { … Postgres from env … }}

if ENVIRONMENT == "production":
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = CSRF_COOKIE_SECURE = True
    SECURE_HSTS_SECONDS = 31536000
    SECURE_HSTS_INCLUDE_SUBDOMAINS = SECURE_HSTS_PRELOAD = True
```

### 14.2 Environment variables

| Variable | Purpose |
|---|---|
| `DJANGO_ENV` | `development` \| `production` — gates DEBUG and all security headers |
| `DJANGO_SECRET_KEY` | signing key; **also the shared JWT key** for downstream services |
| `DJANGO_ALLOWED_HOSTS` | comma-separated |
| `DB_ENGINE` / `DB_NAME` / `DB_USER` / `DB_PASSWORD` / `DB_HOST` / `DB_PORT` | Postgres in production (JSONB indexing) |
| `PUBLIC_MEDIA_BASE_URL` | absolute prefix for non-CDN media URLs |
| `FRONTEND_BASE_URL` | preview links, `config.site_url` |
| `CORS_ALLOWED_ORIGINS` | must include the admin UI origin in production |
| `FRONTEND_REVALIDATE_URL` / `_SECRET` | ISR webhook; blank disables |
| `<CDN>_*` | storage zone, credentials, CDN base URL, max dimension, quality |

### 14.3 Container notes

- Collect static at **build** time with `DJANGO_ENV=production` and a throwaway
  secret; no database is touched.
- Serve admin static from the app container via WhiteNoise — no separate web
  server needed.
- Run migrations at **container start**, then the WSGI server.
- Load the env file with **`override=False`** so orchestrator-provided values
  (DB host, allowed hosts) win over the mounted file. Mount the file rather than
  using `env_file` if secrets may contain `$`, to avoid interpolation.
- In local HTTP-only compose, keep `DJANGO_ENV=development` — production mode
  enables `SECURE_SSL_REDIRECT` and 301s every API call to https.

⚠ **Deployment footgun:** local media is typically only served by the framework
when `DEBUG` is on. In production without a CDN, media serving must be handled
by the web server, or every local image 404s.

---

## 15. Testing strategy

The source system's ~150 tests concentrate on the rules that are expensive to
get wrong. Test by **behaviour and consequence**, not by method.

Worth mirroring:

**Lifecycle** — a new entry is a draft; publishing stamps `published_at`;
deleting keeps the row and marks it; the three states are distinguishable; only
published content is public; restoring returns to draft; restoring a live entry
is rejected; publishing a deleted entry clears the deleted stamp; an inactive
collection is not public.

**Slug validation** — accepts normal slugs; rejects empty, malformed, reserved,
over-length; rejects known placeholders **and their variants** (`test-2` is the
one that actually ships); duplicates rejected by the **database**, not only by
the serializer; the same slug in a different collection is allowed; a deleted
entry keeps its slug claim.

**Slug history** — creating records no history; renaming preserves the old slug;
renaming twice keeps both; saving without a change adds nothing; reclaiming an
old slug retires its alias; no alias when another entry holds the old slug
(A frees a slug, B takes it, A renames again — A must not claim B's URL);
aliases are collection-scoped; deleting an entry removes its aliases.

**Delivery resolution** — a current slug resolves without a redirect hint; an old
slug resolves to the renamed article and the response names the canonical slug;
an old slug survives two renames; an alias of an unpublished or deleted article
does **not** resolve; an empty list query is not treated as a slug lookup; a slug
lookup combined with another filter does not alias; the slugs list never includes
retired slugs (static generation must not turn them into canonical pages).

**Authoring API + RBAC** — role gating per action; an author may not delete;
workflow verbs require their own action; deleted entries leave the default list
but are listable on request.

**Notes on the source suite's state (verified by running it):**

- `content` — **85 tests, all passing.** The slug/lifecycle/delivery core is
  genuinely well covered.
- `siteconfig` — 4 tests passing.
- `accounts`, `faqs`, `sitepages` — pass in isolation but **fail when the full
  suite runs together**: a data migration seeds 14 `Page` rows, and several test
  fixtures create `Page(route="/")` or assert `Page.objects.count() == 1`,
  colliding with the seeded data. This is a **test-fixture bug, not a defect in
  the CMS design** — but it is the first thing to fix when adopting this code.
- `requirements.txt` lists `whitenoise`, but it was **missing from the project
  virtualenv**; without it the entire suite errored at import. I installed it to
  run the tests.

> **Lesson worth generalising:** if you seed reference data in migrations, your
> test fixtures must **account for the seeded rows** — use unique routes, or
> assert deltas rather than absolute counts.

---

## 16. Implementation checklist

Build in this order; each phase is independently useful.

**Phase 1 — skeleton**
- [ ] Project, apps, settings with dev-safe defaults, Dockerfile
- [ ] Custom user model **first** (changing `AUTH_USER_MODEL` later is painful)
- [ ] JWT auth, `login` / `refresh` / `me`

**Phase 2 — permission system**
- [ ] The closed module/action registry
- [ ] `Role` model with normalise-on-save
- [ ] `HasModulePermission` (fail closed)
- [ ] `permission-registry/` endpoint
- [ ] Seed archetype roles via `get_or_create` data migration

**Phase 3 — schema layer**
- [ ] `Collection`, `Template`, image groups, attribute slots (`unique_together` on `(template, key)`)
- [ ] Taxonomy models
- [ ] Schema CRUD with editor-only writes

**Phase 4 — content layer**
- [ ] `Entry` with the three-state status, both date fields, `document_id`
- [ ] Child tables for blocks, images, attribute values, SEO
- [ ] Slug validator + slug history with the **partial** unique index
- [ ] Selectors with the one shared prefetch chain
- [ ] Services for every transition, `@transaction.atomic`
- [ ] Signals for slug history

**Phase 5 — media**
- [ ] Asset model with a **single** `url` property
- [ ] Compression → WebP → CDN with uuid-suffixed immutable paths
- [ ] `post_save` upload hook, `post_delete` cleanup
- [ ] Backfill command

**Phase 6 — delivery**
- [ ] Per-collection dynamic route (registered **after** any fixed routes)
- [ ] Query parser with a **closed field whitelist** and **per-column coercion**
- [ ] Flat envelope, `imgUrls` assembly, `attributes` passthrough
- [ ] Alias fallback with the `meta.redirect` hint
- [ ] Verify no N+1 with a query-count assertion

**Phase 7 — authoring API**
- [ ] Slim list / rich detail / write serializers
- [ ] Filters, whitelisted ordering, search
- [ ] Workflow actions returning the fresh entity
- [ ] Slug availability endpoint
- [ ] `dashboard/` and `config/`

**Phase 8 — structured modules & SEO**
- [ ] Decide authored vs. maintained per type
- [ ] Seeded pages with edit-only slot APIs
- [ ] SEO mixin, issue reporting, JSON-LD builders, overview endpoint

**Phase 9 — freshness & hardening**
- [ ] Revalidation webhook on `transaction.on_commit()`, signed
- [ ] `Cache-Control` / ETag on delivery
- [ ] Audit + import/recovery commands

---

## 17. Known weaknesses to fix when copying

Verified against the running system. **Do not reproduce these.**

| # | Issue | Impact | Fix |
|---|---|---|---|
| 1 | **Bad filter value → HTTP 500.** `filters[isFeatured][$eq]=true` and `filters[readTime][$gte]=abc` raise an uncaught error. *(Confirmed live.)* | A malformed public URL returns a server error, not a 4xx | Coerce per column type; treat failures as no-match or 400 |
| 2 | Revalidation ping fires **inside** the transaction | Frontend told to rebuild content that may roll back | `transaction.on_commit()` |
| 3 | Revalidation secret in the body, unsigned; **response never checked** | A mismatched secret fails silently forever | HMAC header; log non-2xx |
| 4 | Duplicate revalidation pings on publish | Wasted requests | Dedupe |
| 5 | "CDN wins, local fallback" implemented in **three** places | Divergence over time | One `url` property on the model |
| 6 | `duplicate_entry` resets `published_at` but **not** `published_on` or `deleted_at` | A copy inherits a stale display date; duplicating a deleted entry yields a draft with a stale delete stamp | Reset both |
| 7 | Service functions **skip the role check entirely when `user is None`** | Any caller omitting the user bypasses authorisation | Require an explicit `system=True` opt-in |
| 8 | `duplicate_entry` has no role check (view-gated only) | Inconsistent with sibling transitions | Add the guard |
| 9 | Template duplication is **not atomic** | A failure leaves a partial template | Wrap in `atomic` |
| 10 | Slug validator never runs on a bare `.save()` | Shell/service writes can persist invalid slugs | `full_clean()` in services |
| 11 | `$in` with a comma-separated single value yields `["a,b"]` | Silent wrong results | Split on comma when one value is present |
| 12 | Media delete has **no usage check** | Entries silently lose images | Warn, or block, on in-use assets |
| 13 | `file` on PATCH is **silently discarded** | Client believes a replacement succeeded | Reject with 400 |
| 14 | Upload blocks on compression + CDN PUT | Slow endpoint on large images | Offload to a task queue |
| 15 | SEO overview is unpaginated, full-scan, Python-evaluated | Degrades at scale | Paginate; precompute status |
| 16 | No token blacklist; no logout | Revoked grants live until token expiry | Short access lifetime; add a blacklist if needed |
| 17 | Test fixtures collide with migration-seeded `Page` rows | Suite fails when run whole *(confirmed)* | Unique fixture routes; assert deltas |
| 18 | `whitenoise` in requirements but missing from the venv | Entire suite errors on import *(confirmed; installed to run tests)* | Pin and verify in CI |
| 19 | Dead config: CDN purge settings referenced nowhere | Misleads operators | Delete them — uuid paths make purging unnecessary |
| 20 | `FRONTEND_BASE_URL` defined twice in settings | Noise | Remove the duplicate |
| 21 | Catalog routes have no pagination | Unbounded responses as taxonomy grows | Paginate |
| 22 | Local media unserved in production without `DEBUG` | Every local image 404s | Serve via the web server or require a CDN |
| 23 | **Revalidation covers pages only** — FAQ and job-posting changes never ping the frontend | Those pages stay stale until the ISR window elapses | Call the webhook from every module's workflow actions |
| 24 | A declared `application_count` field is never populated by any view | Always serialises as `0`; the UI silently shows wrong data | Populate it, or remove the field |
| 25 | `faq_count` does `.count()` per row with no annotation | N+1 on the categories list | `annotate(Count(...))` — the department equivalent already does |
| 26 | Empty `?section=` behaves differently on the admin vs. public FAQ list (ignored vs. matches the blank section) | Same query, two answers | Pick one semantic |

---

## Appendix A — Endpoint index

### Public delivery (`AllowAny`)

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/<api_uid>` | Collection delivery — filters, fields, pagination, sort, alias redirect |
| `GET` | `/api/faqs?page=<route>[&section=]` | FAQs for a page (page scope **required**) |
| `GET` | `/api/job-positions[?department=<slug>]` | Open + closed positions, department facets, settings flags |
| `GET` | `/api/job-positions/<slug>` | One position (closed still resolves, `is_open: false`) |
| `GET` | `/api/page-content?route=<route>` | Maintained page slots + SEO |

Note the fixed public routes carry **no trailing slash** (they are literal
paths), while router-generated admin routes **require** one.

### Authoring (`/admin-api/`, JWT + module RBAC)

| Group | Endpoints |
|---|---|
| Session | `auth/login/`, `auth/refresh/`, `auth/me/`, `auth/permission-registry/` |
| Users & roles | `auth/users/`, `auth/users/{id}/`, `auth/roles/`, `auth/roles/{id}/` |
| Shell | `config/`, `dashboard/` |
| Entries | `entries/`, `entries/{id}/`, `entries/check-slug/`, `entries/{id}/publish|unpublish|duplicate|restore/` |
| Schema | `collections/`, `templates/`, `templates/{id}/duplicate/`, `template-image-groups/`, `template-attribute-slots/` |
| Taxonomy | `authors/`, `categories/`, `tags/`, `badges/` |
| Media | `media-assets/`, `media-assets/{id}/` |
| Pages | `pages/`, `pages/{id}/`, `pages/{id}/text-slots/{slot_id}/`, `pages/{id}/image-slots/{slot_id}/`, `pages/{id}/seo/`, `pages/{id}/preview/` |
| FAQs | `faqs/`, `faqs/{id}/`, `faqs/reorder/`, `faqs/{id}/publish|unpublish|archive|restore|preview/`, `faq-categories/` |
| Careers | `job-positions/`, `job-positions/{id}/publish|unpublish|close|archive|preview/`, `departments/`, `careers/overview/` |
| SEO | `seo/overview/` |
| Settings | `settings/` |

### Appendix B — Management commands

| Command | Purpose |
|---|---|
| `seed_<content>` | Idempotent sample collection/template/entry so the frontend renders immediately |
| `seed_pages` | Seed maintained pages and their slots |
| `import_entries <export.json>` | Restore entries from a delivery-API export. Lands as **drafts**; `--dry-run`, `--only`, `--update`; idempotent; skips invalid slugs |
| `add_slug_alias` | Record a historical slug → entry mapping. **Verified mappings only** |
| `audit_slugs` | Read-only report: duplicates, invalid slugs, alias collisions |
| `sync_media_to_cdn` | Backfill pre-CDN assets. Idempotent |

---

*Derived from a production Django 5.2 / DRF 3.16 CMS (~10,000 lines across 12
apps). Contracts and behaviours in this document were verified against the
running system, its live delivery API and its test suite.*
