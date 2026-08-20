"""Shared fixtures for the content tests."""
from catalog.models import Collection
from content.models import Entry


def make_collection(api_uid="articles", **kwargs):
    return Collection.objects.create(
        api_uid=api_uid,
        singular_name=kwargs.pop("singular_name", "Article"),
        plural_name=kwargs.pop("plural_name", "Articles"),
        **kwargs,
    )


def make_entry(collection, slug="solar-panel-cost-kerala", **kwargs):
    kwargs.setdefault("title", slug.replace("-", " ").title())
    return Entry.objects.create(collection=collection, slug=slug, **kwargs)


def publish(entry):
    from django.utils import timezone

    entry.status = Entry.Status.PUBLISHED
    entry.published_at = entry.published_at or timezone.now()
    entry.save()
    return entry
