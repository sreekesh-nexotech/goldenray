"""FAQ workflow: publish, archive, reorder (§6.4, §6.5)."""

from django.db import transaction
from django.utils import timezone

from .models import Faq


class FaqWorkflowError(Exception):
    """Raised when a workflow step cannot proceed. ``errors`` is editor-facing."""

    def __init__(self, message, errors=None):
        super().__init__(message)
        self.errors = errors or []


def publish_faq(faq: Faq, *, user=None) -> Faq:
    """Make an FAQ live, refusing incomplete records (§6.5).

    Validation runs here rather than on the serializer because a draft is
    allowed to be incomplete — that is what a draft is for. The completeness bar
    only applies at the moment of publishing.
    """
    errors = faq.publish_errors()
    if errors:
        raise FaqWorkflowError("This FAQ is not ready to publish.", errors)

    faq.status = Faq.Status.PUBLISHED
    faq.published_at = faq.published_at or timezone.now()
    faq.archived_at = None
    faq.updated_by = user
    faq.save(update_fields=["status", "published_at", "archived_at", "updated_by", "updated_at"])
    return faq


def unpublish_faq(faq: Faq, *, user=None) -> Faq:
    """Take an FAQ off the site, keeping it as a draft."""
    faq.status = Faq.Status.DRAFT
    faq.updated_by = user
    faq.save(update_fields=["status", "updated_by", "updated_at"])
    return faq


def archive_faq(faq: Faq, *, user=None) -> Faq:
    """Retire an FAQ without destroying it.

    §7 requires destructive actions to be deliberate, and an archived record is
    how an FAQ leaves the site while its history stays readable. Deletion proper
    is a Django-admin action, not something the Studio offers.
    """
    faq.status = Faq.Status.ARCHIVED
    faq.archived_at = timezone.now()
    faq.updated_by = user
    faq.save(update_fields=["status", "archived_at", "updated_by", "updated_at"])
    return faq


def restore_faq(faq: Faq, *, user=None) -> Faq:
    """Bring an archived FAQ back as a draft."""
    faq.status = Faq.Status.DRAFT
    faq.archived_at = None
    faq.updated_by = user
    faq.save(update_fields=["status", "archived_at", "updated_by", "updated_at"])
    return faq


@transaction.atomic
def reorder_faqs(page_id: int, section: str, ordered_ids: list[int], *, user=None) -> list[Faq]:
    """Renumber one page/section's FAQs to the given order.

    Atomic and whole-list on purpose. §6.4 makes ordering mandatory because it
    is what a visitor sees, and a drag that renumbers eight rows through eight
    separate saves can half-apply — leaving two questions claiming position 3
    and an order nobody chose. One transaction over the whole section means the
    order either moves or it does not.

    Ids that do not belong to the named page/section are ignored rather than
    erroring: a stale browser tab reordering a list that has since moved on
    should not be able to drag an unrelated FAQ into this section.
    """
    members = {f.id: f for f in Faq.objects.filter(page_id=page_id, section=section or "")}
    updated = []
    # Only ids that belong to this section take a position; a stranger id is
    # skipped *without* consuming a slot, or the tail below would start one
    # past where the ordered block actually ends.
    applied = [fid for fid in ordered_ids if fid in members]
    for index, faq_id in enumerate(applied):
        faq = members[faq_id]
        if faq.display_order != index:
            faq.display_order = index
            faq.updated_by = user
            updated.append(faq)

    if updated:
        Faq.objects.bulk_update(updated, ["display_order", "updated_by"])

    # Anything the caller did not mention keeps its relative order but moves
    # below the explicitly ordered block, so the list stays fully determined.
    tail = [f for f in members.values() if f.id not in set(applied)]
    if tail:
        start = len(applied)
        for offset, faq in enumerate(sorted(tail, key=lambda f: (f.display_order, f.id))):
            faq.display_order = start + offset
        Faq.objects.bulk_update(tail, ["display_order"])

    return list(Faq.objects.filter(page_id=page_id, section=section or ""))


def next_display_order(page_id: int, section: str) -> int:
    """Position a newly created FAQ at the end of its section."""
    last = (
        Faq.objects.filter(page_id=page_id, section=section or "")
        .order_by("-display_order")
        .values_list("display_order", flat=True)
        .first()
    )
    return 0 if last is None else last + 1
