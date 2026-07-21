"""Fire frontend revalidation when a published entry is deleted or edited in
the Django admin (which bypasses the service layer)."""
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from .models import Entry
from .revalidation import trigger_revalidate


@receiver(post_delete, sender=Entry)
def entry_deleted(sender, instance, **kwargs):
    # Only matters if the entry was public; ping anyway (cheap, best-effort).
    trigger_revalidate(instance.slug)


@receiver(post_save, sender=Entry)
def entry_saved(sender, instance, created, **kwargs):
    # Keep published pages fresh after in-admin edits.
    if instance.status == Entry.Status.PUBLISHED:
        trigger_revalidate(instance.slug)
