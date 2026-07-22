"""Write-side business logic for entries: publish workflow + validation.

Views stay thin; all state transitions live here (team convention).
"""
from django.db import transaction
from django.utils import timezone

from catalog.models import TemplateAttributeSlot, TemplateImageGroup

from .models import Entry
from .revalidation import trigger_revalidate


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


# ── State transitions ─────────────────────────────────────────────────────────
@transaction.atomic
def publish_entry(entry: Entry, *, user=None) -> Entry:
    if user is not None and not user.can_publish:
        raise PublishError("Your role may create drafts but not publish.")
    validate_for_publish(entry)
    entry.status = Entry.Status.PUBLISHED
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
    if user is not None:
        entry.updated_by = user
    entry.save()
    trigger_revalidate(entry.slug)
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
    while Entry.objects.filter(collection=entry.collection, slug=slug).exists():
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
