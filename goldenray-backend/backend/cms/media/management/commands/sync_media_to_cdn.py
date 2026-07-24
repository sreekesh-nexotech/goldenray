"""Push existing (pre-CDN) uploads to BunnyCDN.

Usage:  python manage.py sync_media_to_cdn
Processes every MediaAsset without a cdn_url: compress → upload → stamp URL.
"""
from django.conf import settings
from django.core.management.base import BaseCommand

from media.bunny import process_asset
from media.models import MediaAsset


class Command(BaseCommand):
    help = "Compress and push all local media assets without a cdn_url to BunnyCDN."

    def handle(self, *args, **options):
        if not settings.BUNNY_ENABLED:
            self.stderr.write(self.style.ERROR("Bunny is not configured (set BUNNY_* in .env)."))
            return

        pending = MediaAsset.objects.filter(cdn_url="")
        total = pending.count()
        self.stdout.write(f"{total} asset(s) to push…")
        ok = 0
        for asset in pending:
            if process_asset(asset):
                ok += 1
                self.stdout.write(self.style.SUCCESS(f"  ✓ #{asset.pk} → {asset.cdn_url}"))
            else:
                self.stdout.write(self.style.WARNING(f"  ✗ #{asset.pk} failed (see log)"))
        self.stdout.write(self.style.SUCCESS(f"Done: {ok}/{total} pushed."))
