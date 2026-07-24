"""Auto-push uploaded media to BunnyCDN, and clean up storage on delete.

The post_save hook covers every upload path (Django admin, the admin API's
multipart endpoint, inline "+" popups) with one code path.
"""
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from .bunny import delete_path, process_asset
from .models import MediaAsset


@receiver(post_save, sender=MediaAsset)
def push_to_cdn(sender, instance, created, **kwargs):
    # Process new uploads (or assets whose CDN copy is missing). process_asset
    # writes via queryset.update(), so no save() recursion happens.
    if instance.file and not instance.cdn_url:
        process_asset(instance)


@receiver(post_delete, sender=MediaAsset)
def remove_from_cdn(sender, instance, **kwargs):
    if instance.storage_path:
        delete_path(instance.storage_path)
    # Remove the local source file too.
    if instance.file:
        instance.file.delete(save=False)
