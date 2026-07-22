"""Assemble the Strapi v5 **flat** payload the blog frontend consumes.

The canonical contract is the frontend service `blogApiService.ts` (its
`ApiArticle` interface). Every key emitted here is read by that client; nothing
is `data.attributes`-nested — Strapi v5 flat shape.
"""
from media.serializers import absolute_media_url


def _iso(dt):
    return dt.isoformat() if dt else None


def _media_payload(asset):
    if asset is None:
        return None
    if asset.cdn_url:
        url = asset.cdn_url
    else:
        try:
            url = absolute_media_url(asset.file.url)
        except ValueError:
            url = None
    if not url:
        return None
    return {
        "url": url,
        "width": asset.width,
        "height": asset.height,
        "alternativeText": asset.alternative_text or None,
    }


def _img_urls(entry):
    """Assemble `imgUrls` from EntryImage rows keyed by group_key.

    Single template groups → a URL string under their key; repeatable groups →
    an array of URL strings. The `key` is the stable contract (labels may be
    renamed freely without changing this output)."""
    # Which groups are repeatable? Derived from the entry's template.
    repeatable = {}
    if entry.template_id:
        for g in entry.template.image_groups.all():
            repeatable[g.key] = g.repeatable

    grouped: dict[str, list] = {}
    for img in entry.images.all():  # prefetched, ordered by (group_key, position)
        url = img.resolved_url()
        if not url:
            continue
        grouped.setdefault(img.group_key, []).append(absolute_media_url(url))

    if not grouped:
        return None

    out = {}
    for key, urls in grouped.items():
        is_repeatable = repeatable.get(key)
        if is_repeatable is None:
            # No template hint: infer — multiple rows ⇒ array, else single string.
            is_repeatable = len(urls) > 1
        out[key] = urls if is_repeatable else urls[0]
    return out


def _cover_payload(entry):
    """Resolve ``coverImage``: the legacy FK wins; otherwise fall back to the
    template image group with the well-known ``coverImg`` key (how the custom
    admin UI stores covers)."""
    cover = _media_payload(entry.cover_image)
    if cover is not None:
        return cover
    for img in entry.images.all():  # prefetched, ordered by (group_key, position)
        if img.group_key != "coverImg":
            continue
        if img.media_asset_id and img.media_asset:
            return _media_payload(img.media_asset)
        if img.external_url:
            return {
                "url": absolute_media_url(img.external_url),
                "width": None,
                "height": None,
                "alternativeText": None,
            }
    return None


def build_entry_payload(entry) -> dict:
    """Full flat payload for one entry (populate=* case)."""
    # Template attribute values under well-known keys back-fill the fixed
    # delivery fields; legacy entry columns win for rows authored before the
    # template system (Django admin era).
    attrs = {av.slot_key: av.value for av in entry.attribute_values.all()}

    def _scalar(legacy_value, slot_key):
        if legacy_value not in (None, ""):
            return legacy_value
        v = attrs.get(slot_key)
        return v if v not in (None, "") else None

    author = None
    if entry.author_id and entry.author:
        author = {
            "id": entry.author.id,
            "name": entry.author.name,
            "bio": entry.author.bio,
            "role": entry.author.role,
        }

    seo = None
    if hasattr(entry, "seo") and entry.seo:
        s = entry.seo
        seo = {
            "metaTitle": s.meta_title,
            "metaDescription": s.meta_description,
            "canonicalUrl": s.canonical_url,
            "keywords": s.keywords,
        }

    return {
        "id": entry.id,
        "documentId": str(entry.document_id),
        "title": entry.title,
        "slug": entry.slug,
        "excerpt": entry.excerpt or "",
        "summary": entry.summary or [],
        "introduction": entry.introduction or [],
        "readTime": _scalar(entry.read_time, "readTime"),
        "isFeatured": entry.is_featured,
        "sortOrder": entry.sort_order,
        "publishedOn": _iso(entry.published_on),
        "updatedAt": _iso(entry.updated_at),
        "publishedAt": _iso(entry.published_at),
        "author": author,
        "categories": [
            {"id": c.id, "name": c.name, "slug": c.slug} for c in entry.categories.all()
        ],
        "tags": [{"id": t.id, "name": t.name} for t in entry.tags.all()],
        "badges": [{"id": b.id, "label": b.label, "color": b.color} for b in entry.badges.all()],
        "contentBlocks": [
            {"__component": cb.component, "id": cb.id, "body": cb.body or []}
            for cb in entry.content_blocks.all()
        ],
        "coverImage": _cover_payload(entry),
        "warning": _scalar(entry.warning, "warning"),
        "insights": _scalar(entry.insights, "insights"),
        "seo": seo,
        "imgUrls": _img_urls(entry),
        # All template attribute values keyed by slot key (additive — lets the
        # frontend read custom slots like `difficulty` without a contract change).
        "attributes": attrs or None,
    }


# Map client (camelCase) scalar field names → what build_entry_payload emits,
# used to honour `fields[]=` selection.
SCALAR_FIELDS = {
    "id", "documentId", "title", "slug", "excerpt", "summary", "introduction",
    "readTime", "isFeatured", "sortOrder", "publishedOn", "updatedAt",
    "publishedAt", "warning", "insights",
}


def build_entry_fields_only(entry, fields) -> dict:
    """Minimal payload when `fields[]=` is used (e.g. slugs-only). Always keeps
    id + documentId, like Strapi."""
    full = build_entry_payload(entry)
    keep = {"id", "documentId"} | {f for f in fields if f in SCALAR_FIELDS}
    return {k: v for k, v in full.items() if k in keep}
