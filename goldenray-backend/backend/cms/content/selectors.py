"""Read-side query builders (team convention: selectors hold ORM reads)."""
from .models import Entry, EntrySlugHistory


def _base_queryset():
    return (
        Entry.objects.select_related("collection", "template", "author", "cover_image", "seo")
        .prefetch_related(
            "categories", "tags", "badges", "content_blocks",
            "images", "images__media_asset", "attribute_values", "slug_history",
        )
    )


def admin_entry_queryset(*, include_deleted: bool = False):
    """Entries for the authoring API.

    Deleted entries are held back by default so the Entries screen shows the
    working set; the list view opts back in with ``?include_deleted=1`` or
    ``?status=deleted``.
    """
    qs = _base_queryset()
    if not include_deleted:
        qs = qs.exclude(status=Entry.Status.DELETED)
    return qs


def published_entries(collection_uid: str):
    """Published entries of a collection, for the public delivery API.

    Filtering on ``PUBLISHED`` is what keeps drafts *and* deleted entries out of
    every public read — nothing else needs to know about the deleted state.
    """
    return _base_queryset().filter(
        collection__api_uid=collection_uid,
        collection__is_active=True,
        status=Entry.Status.PUBLISHED,
    )


def resolve_published_alias(collection_uid: str, slug: str):
    """The published entry a retired ``slug`` used to be served under, or None.

    Only *active* aliases resolve, and only to entries that are currently
    published: a rename should keep a live article reachable, never resurrect
    one that was drafted or deleted on purpose.
    """
    if not slug:
        return None
    alias = (
        EntrySlugHistory.objects.filter(
            slug=slug,
            is_active=True,
            collection__api_uid=collection_uid,
            collection__is_active=True,
            entry__status=Entry.Status.PUBLISHED,
        )
        .order_by("-created_at", "-id")
        .first()
    )
    if alias is None:
        return None
    return _base_queryset().filter(pk=alias.entry_id).first()
