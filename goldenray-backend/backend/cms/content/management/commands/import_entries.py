"""Restore entries from a delivery-API export, verbatim.

Written for recovering articles that exist in another instance of the blog API
but not in this one — the case this repository actually has, where three
articles live on the legacy CMS and are missing from the one the site reads.
Fetch the export, review it, then import:

    curl 'https://<legacy-host>/api/articles?populate=*&pagination[pageSize]=100' \\
        -o legacy-articles.json

    python manage.py import_entries legacy-articles.json \\
        --collection articles --only monocrystalline-vs-polycrystalline --dry-run

    python manage.py import_entries legacy-articles.json \\
        --collection articles --only monocrystalline-vs-polycrystalline

Nothing is invented: every field is copied from the export or left empty, and
entries land as **drafts** so an editor publishes them deliberately. Existing
slugs are skipped unless ``--update`` is passed. Idempotent.

The reader accepts either the Strapi v5 flat envelope (``{"data": [...]}``) or a
bare list, which covers this CMS's own delivery output and the Strapi instance
it was migrated from — they share the field names that matter.
"""
import json
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.utils.dateparse import parse_datetime

from catalog.models import Author, Badge, Category, Collection, Tag, Template
from content.models import ContentBlock, Entry, EntryImage, Seo
from content.validators import validate_entry_slug

from django.core.exceptions import ValidationError


class Command(BaseCommand):
    help = "Import entries from a delivery-API JSON export (drafts by default)."

    def add_arguments(self, parser):
        parser.add_argument("export", help="path to the JSON export")
        parser.add_argument("--collection", required=True, help="target collection api_uid")
        parser.add_argument(
            "--only",
            action="append",
            default=[],
            help="import only this slug (repeatable). Default: every entry in the export.",
        )
        parser.add_argument(
            "--template", help="template slug to assign (default: leave unassigned)"
        )
        parser.add_argument(
            "--update",
            action="store_true",
            help="overwrite an entry that already has the slug (default: skip it)",
        )
        parser.add_argument(
            "--dry-run", action="store_true", help="report what would happen, write nothing"
        )

    # ── Entry point ───────────────────────────────────────────────────────────
    @transaction.atomic
    def handle(self, *args, **options):
        path = Path(options["export"])
        if not path.exists():
            raise CommandError(f"Export not found: {path}")
        try:
            payload = json.loads(path.read_text())
        except json.JSONDecodeError as exc:
            raise CommandError(f"Export is not valid JSON: {exc}") from exc

        records = payload.get("data", payload) if isinstance(payload, dict) else payload
        if not isinstance(records, list):
            raise CommandError("Export must be a list of entries or {'data': [...]}.")

        collection = Collection.objects.filter(api_uid=options["collection"]).first()
        if collection is None:
            raise CommandError(f"Unknown collection {options['collection']!r}.")

        template = None
        if options["template"]:
            template = Template.objects.filter(slug=options["template"]).first()
            if template is None:
                raise CommandError(f"Unknown template {options['template']!r}.")

        wanted = set(options["only"])
        if wanted:
            missing = wanted - {r.get("slug") for r in records}
            if missing:
                raise CommandError(f"Not in the export: {', '.join(sorted(missing))}")
            records = [r for r in records if r.get("slug") in wanted]

        created = updated = skipped = 0
        for record in records:
            outcome = self._import_one(record, collection, template, options)
            created += outcome == "created"
            updated += outcome == "updated"
            skipped += outcome == "skipped"

        prefix = "[dry-run] " if options["dry_run"] else ""
        self.stdout.write(
            self.style.SUCCESS(
                f"{prefix}{created} created, {updated} updated, {skipped} skipped."
            )
        )
        if options["dry_run"]:
            transaction.set_rollback(True)
        elif created or updated:
            self.stdout.write(
                "Imported as drafts. Review each one, then publish "
                "(admin action, or POST /admin-api/entries/{id}/publish/)."
            )

    # ── One record ────────────────────────────────────────────────────────────
    def _import_one(self, record, collection, template, options) -> str:
        slug = (record.get("slug") or "").strip()
        title = (record.get("title") or "").strip()
        if not slug or not title:
            self.stdout.write(self.style.WARNING(f"  skip: record without slug/title ({record.get('id')})"))
            return "skipped"
        try:
            validate_entry_slug(slug)
        except ValidationError as exc:
            self.stdout.write(self.style.WARNING(f"  skip {slug!r}: {exc.messages[0]}"))
            return "skipped"

        existing = Entry.objects.filter(collection=collection, slug=slug).first()
        if existing is not None and not options["update"]:
            self.stdout.write(f"  skip {slug!r}: entry #{existing.id} already has this slug.")
            return "skipped"

        entry = existing or Entry(collection=collection, slug=slug)
        entry.title = title
        entry.template = template or entry.template
        entry.excerpt = record.get("excerpt") or ""
        entry.summary = record.get("summary") or []
        entry.introduction = record.get("introduction") or []
        entry.read_time = record.get("readTime")
        entry.is_featured = bool(record.get("isFeatured"))
        entry.sort_order = record.get("sortOrder")
        entry.published_on = parse_datetime(record["publishedOn"]) if record.get("publishedOn") else None
        entry.warning = record.get("warning")
        entry.insights = record.get("insights")
        # Imported content is never live on arrival — a human publishes it.
        entry.status = Entry.Status.DRAFT
        entry.published_at = None
        entry.deleted_at = None
        entry.author = self._author(record.get("author"))

        if options["dry_run"]:
            verb = "update" if existing else "create"
            self.stdout.write(f"  [dry-run] would {verb} {slug!r} — {title}")
            return "updated" if existing else "created"

        entry.save()
        entry.categories.set(self._categories(record.get("categories") or []))
        entry.tags.set(self._tags(record.get("tags") or []))
        entry.badges.set(self._badges(record.get("badges") or []))
        self._blocks(entry, record.get("contentBlocks") or [])
        self._images(entry, record)
        self._seo(entry, record.get("seo"))

        verb = "Updated" if existing else "Created"
        self.stdout.write(self.style.SUCCESS(f"  {verb} draft #{entry.id} {slug!r} — {title}"))
        return "updated" if existing else "created"

    # ── Relations (matched by name so imports reuse existing rows) ────────────
    def _author(self, data):
        if not data or not data.get("name"):
            return None
        author, _ = Author.objects.get_or_create(
            name=data["name"],
            defaults={"bio": data.get("bio") or "", "role": data.get("role") or ""},
        )
        return author

    def _categories(self, rows):
        out = []
        for row in rows:
            if not row.get("name"):
                continue
            category, _ = Category.objects.get_or_create(
                name=row["name"], defaults={"slug": row.get("slug")}
            )
            out.append(category)
        return out

    def _tags(self, rows):
        return [
            Tag.objects.get_or_create(name=row["name"])[0] for row in rows if row.get("name")
        ]

    def _badges(self, rows):
        out = []
        for row in rows:
            if not row.get("label"):
                continue
            badge, _ = Badge.objects.get_or_create(
                label=row["label"], defaults={"color": row.get("color") or "#123532"}
            )
            out.append(badge)
        return out

    # ── Children ──────────────────────────────────────────────────────────────
    def _blocks(self, entry, rows):
        entry.content_blocks.all().delete()
        for order, row in enumerate(rows):
            ContentBlock.objects.create(
                entry=entry,
                component=row.get("__component") or "shared.rich-text",
                body=row.get("body") or [],
                order=order,
            )

    def _images(self, entry, record):
        """Images are referenced by URL, not re-uploaded.

        The export gives absolute URLs on the source's CDN. Storing them as
        ``external_url`` keeps the article rendering immediately; re-hosting the
        files is a separate, deliberate media job.
        """
        entry.images.all().delete()
        cover = (record.get("coverImage") or {}).get("url")
        if cover:
            EntryImage.objects.create(
                entry=entry, group_key="coverImg", position=0, external_url=cover
            )
        for key, value in (record.get("imgUrls") or {}).items():
            urls = value if isinstance(value, list) else [value]
            for position, url in enumerate(urls):
                if not url or (key == "coverImg" and cover):
                    continue
                EntryImage.objects.create(
                    entry=entry, group_key=key, position=position, external_url=url
                )

    def _seo(self, entry, data):
        if not data:
            return
        Seo.objects.update_or_create(
            entry=entry,
            defaults={
                "meta_title": data.get("metaTitle"),
                "meta_description": data.get("metaDescription"),
                "canonical_url": data.get("canonicalUrl"),
                "keywords": data.get("keywords"),
            },
        )
