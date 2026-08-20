"""Write-side business logic for entries: publish workflow + validation.

Views stay thin; all state transitions live here (team convention).
"""
import logging

from django.db import transaction
from django.utils import timezone

from catalog.models import TemplateAttributeSlot, TemplateImageGroup

from .models import Entry, EntrySlugHistory
from .revalidation import trigger_revalidate

logger = logging.getLogger("blog_cms")


class PublishError(Exception):
    """Raised when an entry fails validation on publish.

    ``errors`` is the machine-readable list of individual failures so the admin
    UI can render them one per line (``str(exc)`` stays the joined summary).
    """

    def __init__(self, message: str, errors: list[str] | None = None):
        super().__init__(message)
        self.errors = errors if errors is not None else [message]


# ── Template-aware validation ─────────────────────────────────────────────────
def validate_for_publish(entry: Entry) -> None:
    """Validate required attribute slots and image groups against the assigned
    template. Raises PublishError with a readable message on failure."""
    if entry.template_id is None:
        return  # no template → nothing template-specific to enforce

    errors: list[str] = []

    # Required attribute slots must have a value.
    slots = {s.key: s for s in entry.template.attribute_slots.all()}
    provided = {av.slot_key: av.value for av in entry.attribute_values.all()}
    for key, slot in slots.items():
        if slot.required and (key not in provided or provided[key] in (None, "", [])):
            errors.append(f"Attribute '{slot.label}' ({key}) is required.")

    # Required image groups must have at least one image; repeatable caps honored.
    groups = {g.key: g for g in entry.template.image_groups.all()}
    counts: dict[str, int] = {}
    for img in entry.images.all():
        counts[img.group_key] = counts.get(img.group_key, 0) + 1
    for key, group in groups.items():
        n = counts.get(key, 0)
        if group.required and n == 0:
            errors.append(f"Image group '{group.label}' ({key}) requires at least one image.")
        if not group.repeatable and n > 1:
            errors.append(f"Image group '{group.label}' ({key}) is single but has {n} images.")
        if group.repeatable and group.max_items and n > group.max_items:
            errors.append(f"Image group '{group.label}' ({key}) exceeds max_items={group.max_items}.")

    if errors:
        raise PublishError(" ".join(errors), errors=errors)


# ── Slug availability ─────────────────────────────────────────────────────────
def slug_taken(collection_id, slug: str, *, exclude_entry_pk=None) -> bool:
    """Is ``slug`` claimed in this collection, by a live entry **or** by an
    active alias? Aliases count: handing a new article a URL that still resolves
    to an older one is how you get two articles fighting over one path."""
    entries = Entry.objects.filter(collection_id=collection_id, slug=slug)
    aliases = EntrySlugHistory.objects.filter(
        collection_id=collection_id, slug=slug, is_active=True
    )
    if exclude_entry_pk is not None:
        entries = entries.exclude(pk=exclude_entry_pk)
        aliases = aliases.exclude(entry_id=exclude_entry_pk)
    return entries.exists() or aliases.exists()


# ── Slug history ──────────────────────────────────────────────────────────────
def record_slug_change(entry: Entry, old_slug: str, *, note: str = "") -> EntrySlugHistory | None:
    """Keep ``old_slug`` pointing at ``entry`` after a rename.

    Called from the post-save signal so every write path is covered (authoring
    API, Django admin, management commands, shell). Returns the alias row, or
    ``None`` when no alias should exist:

    * the old slug is now some *other* entry's live slug — that entry owns the
      URL, and an alias would fight the real article for it;
    * an active alias for that slug already exists — if it points elsewhere we
      leave it alone rather than silently stealing a URL from another article.

    An entry reclaiming one of its own old slugs retires the matching alias, so
    the live entry and the alias table never both answer for the same URL.
    """
    old_slug = (old_slug or "").strip()
    if not old_slug or old_slug == entry.slug:
        return None

    # The entry has taken this slug back — the live row wins, retire the alias.
    EntrySlugHistory.objects.filter(
        collection_id=entry.collection_id, slug=entry.slug, is_active=True
    ).update(is_active=False)

    # Never shadow a live entry's slug.
    if (
        Entry.objects.filter(collection_id=entry.collection_id, slug=old_slug)
        .exclude(pk=entry.pk)
        .exists()
    ):
        logger.info(
            "Slug alias %r not recorded for entry #%s: another entry holds that slug.",
            old_slug,
            entry.pk,
        )
        return None

    existing = EntrySlugHistory.objects.filter(
        collection_id=entry.collection_id, slug=old_slug, is_active=True
    ).first()
    if existing is not None:
        if existing.entry_id != entry.pk:
            logger.warning(
                "Slug alias %r already maps to entry #%s; not remapping to #%s.",
                old_slug,
                existing.entry_id,
                entry.pk,
            )
        return existing

    alias = EntrySlugHistory.objects.create(
        entry=entry,
        collection_id=entry.collection_id,
        slug=old_slug,
        note=note or f"renamed to '{entry.slug}'",
    )
    logger.info("Recorded slug alias %r → entry #%s.", old_slug, entry.pk)
    return alias


# ── State transitions ─────────────────────────────────────────────────────────
@transaction.atomic
def publish_entry(entry: Entry, *, user=None) -> Entry:
    if user is not None and not user.can_publish:
        raise PublishError("Your role may create drafts but not publish.")
    validate_for_publish(entry)
    entry.status = Entry.Status.PUBLISHED
    entry.deleted_at = None  # publishing a deleted entry brings it back
    if entry.published_at is None:
        entry.published_at = timezone.now()
    if entry.published_on is None:
        entry.published_on = entry.published_at
    if user is not None:
        entry.updated_by = user
    entry.save()
    trigger_revalidate(entry.slug)
    return entry


@transaction.atomic
def unpublish_entry(entry: Entry, *, user=None) -> Entry:
    if user is not None and not user.can_publish:
        raise PublishError("Your role may not unpublish.")
    entry.status = Entry.Status.DRAFT
    entry.deleted_at = None
    if user is not None:
        entry.updated_by = user
    entry.save()
    trigger_revalidate(entry.slug)
    return entry


@transaction.atomic
def soft_delete_entry(entry: Entry, *, user=None) -> Entry:
    """Take an entry down without destroying it.

    A hard ``DELETE`` loses the title, the body, the slug and the alias rows
    that hang off it — so a URL that was deliberately retired becomes
    indistinguishable from one that never existed, and an accidental deletion is
    unrecoverable. Moving to ``deleted`` keeps the record (and its slug claim)
    while removing it from every public read, which all filter on ``published``.
    """
    if user is not None and not user.can_publish:
        raise PublishError("Your role may not delete entries.")
    entry.status = Entry.Status.DELETED
    if entry.deleted_at is None:
        entry.deleted_at = timezone.now()
    if user is not None:
        entry.updated_by = user
    entry.save()
    trigger_revalidate(entry.slug)
    return entry


@transaction.atomic
def restore_entry(entry: Entry, *, user=None) -> Entry:
    """Bring a deleted entry back as a draft. Re-publishing stays a separate,
    explicitly authorised step."""
    if user is not None and not user.can_publish:
        raise PublishError("Your role may not restore entries.")
    if not entry.is_deleted:
        raise PublishError("Entry is not deleted.")
    entry.status = Entry.Status.DRAFT
    entry.deleted_at = None
    if user is not None:
        entry.updated_by = user
    entry.save()
    return entry


@transaction.atomic
def duplicate_entry(entry: Entry, *, user=None) -> Entry:
    """Deep-copy an entry (as a fresh draft) with a unique slug."""
    src_pk = entry.pk
    categories = list(entry.categories.all())
    tags = list(entry.tags.all())
    badges = list(entry.badges.all())

    entry.pk = None
    entry.id = None
    entry._state.adding = True
    import uuid

    entry.document_id = uuid.uuid4()
    entry.status = Entry.Status.DRAFT
    entry.published_at = None
    base_slug = f"{entry.slug}-copy"
    slug = base_slug
    i = 2
    while slug_taken(entry.collection_id, slug):
        slug = f"{base_slug}-{i}"
        i += 1
    entry.slug = slug
    entry.title = f"{entry.title} (copy)"
    if user is not None:
        entry.created_by = user
        entry.updated_by = user
    entry.save()

    entry.categories.set(categories)
    entry.tags.set(tags)
    entry.badges.set(badges)

    src = Entry.objects.get(pk=src_pk)
    for cb in src.content_blocks.all():
        cb.pk = None
        cb.entry = entry
        cb.save()
    for img in src.images.all():
        img.pk = None
        img.entry = entry
        img.save()
    for av in src.attribute_values.all():
        av.pk = None
        av.entry = entry
        av.save()
    if hasattr(src, "seo"):
        seo = src.seo
        seo.pk = None
        seo.entry = entry
        seo.save()
    return entry
