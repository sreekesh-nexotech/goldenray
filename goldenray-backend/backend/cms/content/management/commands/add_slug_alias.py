"""Record a slug an entry used to be published under.

Renames from now on are captured automatically (``content.signals``). This
command is for the ones that already happened — where the old URL is known to
have served *this* article and the rename predates the alias table:

    python manage.py add_slug_alias \\
        --collection articles \\
        --entry-slug can-i-buy-solar-panels-myself-and-hire-an-electrician \\
        --old-slug can-i-buy-solar-panels-myself-and-hire-an-electrician-to-install-them

Only use it when the mapping is verified — the old URL genuinely served the
entry you are pointing it at. Guessing a plausible-looking target is how an
article ends up permanently redirecting to something it was never about.
"""
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from content.models import Entry, EntrySlugHistory


class Command(BaseCommand):
    help = "Point a historical slug at an existing entry (verified mappings only)."

    def add_arguments(self, parser):
        parser.add_argument("--collection", required=True, help="collection api_uid")
        parser.add_argument("--entry-slug", required=True, help="the entry's current slug")
        parser.add_argument("--old-slug", required=True, help="the retired slug to map")
        parser.add_argument("--note", default="", help="why this alias exists")
        parser.add_argument(
            "--dry-run", action="store_true", help="report what would happen, write nothing"
        )

    @transaction.atomic
    def handle(self, *args, **options):
        collection_uid = options["collection"]
        old_slug = options["old_slug"].strip()
        entry = (
            Entry.objects.select_related("collection")
            .filter(collection__api_uid=collection_uid, slug=options["entry_slug"])
            .first()
        )
        if entry is None:
            raise CommandError(
                f"No entry with slug {options['entry_slug']!r} in collection {collection_uid!r}."
            )
        if old_slug == entry.slug:
            raise CommandError("The old slug and the entry's current slug are the same.")

        # An alias must never shadow a live article's URL.
        clash = (
            Entry.objects.filter(collection_id=entry.collection_id, slug=old_slug)
            .exclude(pk=entry.pk)
            .first()
        )
        if clash is not None:
            raise CommandError(
                f"Entry #{clash.id} currently uses {old_slug!r}. That live URL must keep "
                f"resolving to it, so no alias was created."
            )

        existing = EntrySlugHistory.objects.filter(
            collection_id=entry.collection_id, slug=old_slug, is_active=True
        ).first()
        if existing is not None:
            if existing.entry_id == entry.pk:
                self.stdout.write(
                    self.style.SUCCESS(f"Alias {old_slug!r} → entry #{entry.id} already exists.")
                )
                return
            raise CommandError(
                f"Alias {old_slug!r} already maps to entry #{existing.entry_id}. Retire that "
                f"alias first if the mapping is genuinely wrong."
            )

        if options["dry_run"]:
            self.stdout.write(
                f"[dry-run] Would map {old_slug!r} → entry #{entry.id} ({entry.slug!r})."
            )
            transaction.set_rollback(True)
            return

        EntrySlugHistory.objects.create(
            entry=entry,
            collection_id=entry.collection_id,
            slug=old_slug,
            note=options["note"] or f"historical slug, verified mapping to '{entry.slug}'",
        )
        self.stdout.write(
            self.style.SUCCESS(f"Mapped {old_slug!r} → entry #{entry.id} ({entry.slug!r}).")
        )
