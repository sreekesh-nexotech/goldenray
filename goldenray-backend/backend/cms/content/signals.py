"""Cross-cutting reactions to entry writes.

Two jobs, both of which must survive *every* write path — the authoring API,
the Django admin (which bypasses the service layer), management commands and
the shell — which is why they live on signals rather than in ``services``:

* record the previous slug when one changes, so old URLs keep resolving;
* ping the frontend's on-demand revalidation route so published pages refresh.
"""
from django.db.models.signals import post_delete, post_save, pre_save
from django.dispatch import receiver

from .models import Entry
from .revalidation import trigger_revalidate
from .services import record_slug_change

# Stashed on the instance by pre_save so post_save can compare. An attribute
# (not a module global) so concurrent saves cannot cross-talk.
_PREVIOUS_SLUG_ATTR = "_previous_slug"


@receiver(pre_save, sender=Entry)
def entry_capture_previous_slug(sender, instance, **kwargs):
    """Read the stored slug before it is overwritten."""
    if not instance.pk:
        setattr(instance, _PREVIOUS_SLUG_ATTR, None)
        return
    previous = (
        Entry.objects.filter(pk=instance.pk)
        .values_list("slug", flat=True)
        .first()
    )
    setattr(instance, _PREVIOUS_SLUG_ATTR, previous)


@receiver(post_save, sender=Entry)
def entry_saved(sender, instance, created, **kwargs):
    previous = getattr(instance, _PREVIOUS_SLUG_ATTR, None)
    if previous and previous != instance.slug:
        record_slug_change(instance, previous)
        # The old URL is about to start 301-ing; refresh its cached page too.
        trigger_revalidate(previous)
    setattr(instance, _PREVIOUS_SLUG_ATTR, instance.slug)

    # Keep published pages fresh after in-admin edits.
    if instance.status == Entry.Status.PUBLISHED:
        trigger_revalidate(instance.slug)


@receiver(post_delete, sender=Entry)
def entry_deleted(sender, instance, **kwargs):
    # Only matters if the entry was public; ping anyway (cheap, best-effort).
    trigger_revalidate(instance.slug)
