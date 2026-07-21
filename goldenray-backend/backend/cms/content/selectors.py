"""Read-side query builders (team convention: selectors hold ORM reads)."""
from .models import Entry


def _base_queryset():
    return (
        Entry.objects.select_related("collection", "template", "author", "cover_image", "seo")
        .prefetch_related(
            "categories", "tags", "badges", "content_blocks",
            "images", "images__media_asset", "attribute_values",
        )
    )


def admin_entry_queryset():
    """All entries (draft + published) for the authoring API."""
    return _base_queryset()


def published_entries(collection_uid: str):
    """Published entries of a collection, for the public delivery API."""
    return _base_queryset().filter(
        collection__api_uid=collection_uid,
        collection__is_active=True,
        status=Entry.Status.PUBLISHED,
    )
