"""Report slug problems without changing anything.

Run this against any environment (it is read-only) to see what the new
validation would have caught, before deciding what to do about it:

    python manage.py audit_slugs
    python manage.py audit_slugs --collection articles

Reports duplicate slugs, slugs that fail ``validate_entry_slug`` (placeholder /
malformed / reserved), and aliases that collide with a live entry. Existing rows
are never rewritten — the validator runs on save, so historical junk stays
visible until someone fixes it deliberately.
"""
from collections import defaultdict

from django.core.management.base import BaseCommand

from content.models import Entry, EntrySlugHistory
from content.validators import slug_error


class Command(BaseCommand):
    help = "Report duplicate, invalid and colliding entry slugs. Read-only."

    def add_arguments(self, parser):
        parser.add_argument(
            "--collection",
            help="restrict to one collection api_uid (default: all)",
        )

    def handle(self, *args, **options):
        entries = Entry.objects.select_related("collection").order_by("collection_id", "slug")
        aliases = EntrySlugHistory.objects.select_related("collection", "entry")
        if options["collection"]:
            entries = entries.filter(collection__api_uid=options["collection"])
            aliases = aliases.filter(collection__api_uid=options["collection"])

        entries = list(entries)
        self.stdout.write(f"Auditing {len(entries)} entries, {aliases.count()} slug aliases.\n")

        problems = 0
        problems += self._report_duplicates(entries)
        problems += self._report_invalid(entries)
        problems += self._report_alias_collisions(entries, list(aliases))

        if problems:
            self.stdout.write(self.style.WARNING(f"\n{problems} problem(s) found."))
        else:
            self.stdout.write(self.style.SUCCESS("\nNo slug problems found."))

    # ── Sections ──────────────────────────────────────────────────────────────
    def _report_duplicates(self, entries) -> int:
        """Duplicates should be impossible (uniq_entry_collection_slug), but a
        database restored from before that constraint could still carry them —
        and they must be resolved by hand, never automatically."""
        buckets = defaultdict(list)
        for e in entries:
            buckets[(e.collection_id, e.slug)].append(e)
        dupes = {k: v for k, v in buckets.items() if len(v) > 1}
        if not dupes:
            self.stdout.write(self.style.SUCCESS("Duplicate slugs: none"))
            return 0
        self.stdout.write(self.style.ERROR(f"Duplicate slugs: {len(dupes)}"))
        for (_, slug), rows in sorted(dupes.items(), key=lambda kv: kv[0][1]):
            ids = ", ".join(f"#{r.id} [{r.status}]" for r in rows)
            self.stdout.write(f"  {rows[0].collection.api_uid}/{slug}: {ids}")
        return len(dupes)

    def _report_invalid(self, entries) -> int:
        bad = [(e, err) for e in entries if (err := slug_error(e.slug))]
        if not bad:
            self.stdout.write(self.style.SUCCESS("Invalid / placeholder slugs: none"))
            return 0
        self.stdout.write(self.style.ERROR(f"Invalid / placeholder slugs: {len(bad)}"))
        for entry, err in bad:
            self.stdout.write(
                f"  #{entry.id} [{entry.status}] {entry.collection.api_uid}/{entry.slug!r}: {err}"
            )
        return len(bad)

    def _report_alias_collisions(self, entries, aliases) -> int:
        """An active alias sharing a slug with a live entry means two things
        answer for one URL. The live entry wins; the alias should be retired."""
        live = {(e.collection_id, e.slug): e for e in entries}
        clashes = [
            (a, live[(a.collection_id, a.slug)])
            for a in aliases
            if a.is_active and (a.collection_id, a.slug) in live
        ]
        if not clashes:
            self.stdout.write(self.style.SUCCESS("Alias/entry collisions: none"))
            return 0
        self.stdout.write(self.style.ERROR(f"Alias/entry collisions: {len(clashes)}"))
        for alias, entry in clashes:
            self.stdout.write(
                f"  alias {alias.slug!r} (→ entry #{alias.entry_id}) collides with "
                f"live entry #{entry.id}. Retire the alias (is_active=False)."
            )
        return len(clashes)
