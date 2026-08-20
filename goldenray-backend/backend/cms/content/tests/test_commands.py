"""The recovery / audit management commands."""
import json
from io import StringIO
from pathlib import Path
from tempfile import TemporaryDirectory

from django.core.management import CommandError, call_command
from django.test import TestCase

from content.models import ContentBlock, Entry, EntrySlugHistory, Seo

from .factories import make_collection, make_entry

EXPORT = {
    "data": [
        {
            "id": 15,
            "title": "Monocrystalline vs Polycrystalline Solar Panels",
            "slug": "monocrystalline-vs-polycrystalline",
            "excerpt": "Which panel type suits Kerala's climate?",
            "summary": [{"type": "paragraph", "children": [{"type": "text", "text": "Mono wins."}]}],
            "introduction": [],
            "readTime": 8,
            "isFeatured": None,
            "sortOrder": 0,
            "publishedOn": "2024-12-09T18:30:00.000Z",
            "publishedAt": "2026-03-10T10:39:44.645Z",
            "warning": "Check the MNRE approved list.",
            "insights": "18% more output in monsoon.",
            "author": {"name": "Vikram Pillai", "bio": "Engineer", "role": "Reviewer"},
            "categories": [{"name": "Solar Basics", "slug": None}],
            "tags": [{"name": "Monocrystalline"}],
            "badges": [{"label": "Reviewed by Solar Engineer", "color": "Green"}],
            "contentBlocks": [
                {"__component": "blocks.rich-text", "body": [{"type": "paragraph", "children": []}]}
            ],
            "coverImage": {"url": "https://cdn.example/mono.png"},
            "imgUrls": {"bodyImages": ["https://cdn.example/body-1.png"]},
            "seo": {
                "metaTitle": "Mono vs Poly",
                "metaDescription": "A comparison.",
                "canonicalUrl": "https://www.flarize.com/blog/monocrystalline-vs-polycrystalline",
                "keywords": "solar panels",
            },
        },
        {"id": 99, "title": "Junk", "slug": "test", "contentBlocks": []},
    ]
}


class ImportEntriesTests(TestCase):
    def setUp(self):
        self.collection = make_collection()
        self.tmp = TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.export = Path(self.tmp.name) / "export.json"
        self.export.write_text(json.dumps(EXPORT))

    def run_command(self, *args, **kwargs):
        out = StringIO()
        call_command("import_entries", str(self.export), collection="articles",
                     stdout=out, *args, **kwargs)
        return out.getvalue()

    def test_it_imports_the_article_verbatim_as_a_draft(self):
        self.run_command(only=["monocrystalline-vs-polycrystalline"])

        entry = Entry.objects.get(slug="monocrystalline-vs-polycrystalline")
        self.assertEqual(entry.title, "Monocrystalline vs Polycrystalline Solar Panels")
        self.assertEqual(entry.excerpt, "Which panel type suits Kerala's climate?")
        self.assertEqual(entry.read_time, 8)
        self.assertEqual(entry.warning, "Check the MNRE approved list.")
        self.assertEqual(entry.author.name, "Vikram Pillai")
        self.assertEqual([c.name for c in entry.categories.all()], ["Solar Basics"])
        self.assertEqual([t.name for t in entry.tags.all()], ["Monocrystalline"])

    def test_imported_entries_are_not_published(self):
        self.run_command(only=["monocrystalline-vs-polycrystalline"])
        entry = Entry.objects.get(slug="monocrystalline-vs-polycrystalline")
        self.assertEqual(entry.status, Entry.Status.DRAFT)
        self.assertIsNone(entry.published_at)

    def test_it_imports_body_seo_and_images(self):
        self.run_command(only=["monocrystalline-vs-polycrystalline"])
        entry = Entry.objects.get(slug="monocrystalline-vs-polycrystalline")

        self.assertEqual(ContentBlock.objects.filter(entry=entry).count(), 1)
        self.assertEqual(Seo.objects.get(entry=entry).meta_title, "Mono vs Poly")
        self.assertEqual(
            {i.group_key: i.external_url for i in entry.images.all()},
            {
                "coverImg": "https://cdn.example/mono.png",
                "bodyImages": "https://cdn.example/body-1.png",
            },
        )

    def test_it_skips_records_with_an_invalid_slug(self):
        output = self.run_command()
        self.assertFalse(Entry.objects.filter(slug="test").exists())
        self.assertIn("skip 'test'", output)

    def test_it_is_idempotent(self):
        self.run_command(only=["monocrystalline-vs-polycrystalline"])
        output = self.run_command(only=["monocrystalline-vs-polycrystalline"])

        self.assertEqual(Entry.objects.filter(slug="monocrystalline-vs-polycrystalline").count(), 1)
        self.assertIn("already has this slug", output)

    def test_dry_run_writes_nothing(self):
        output = self.run_command(only=["monocrystalline-vs-polycrystalline"], dry_run=True)
        self.assertIn("[dry-run]", output)
        self.assertEqual(Entry.objects.count(), 0)

    def test_an_unknown_slug_is_an_error(self):
        with self.assertRaises(CommandError):
            self.run_command(only=["not-in-the-export"])

    def test_an_unknown_collection_is_an_error(self):
        with self.assertRaises(CommandError):
            call_command("import_entries", str(self.export), collection="nope", stdout=StringIO())


class AddSlugAliasTests(TestCase):
    def setUp(self):
        self.collection = make_collection()
        self.entry = make_entry(
            self.collection, slug="can-i-buy-solar-panels-myself-and-hire-an-electrician"
        )

    def run_command(self, **kwargs):
        out = StringIO()
        options = {
            "collection": "articles",
            "entry_slug": self.entry.slug,
            "old_slug": "can-i-buy-solar-panels-myself-and-hire-an-electrician-to-install-them",
        }
        options.update(kwargs)
        call_command("add_slug_alias", stdout=out, **options)
        return out.getvalue()

    def test_it_maps_a_historical_slug_to_the_entry(self):
        self.run_command()
        alias = EntrySlugHistory.objects.get()
        self.assertEqual(
            alias.slug, "can-i-buy-solar-panels-myself-and-hire-an-electrician-to-install-them"
        )
        self.assertEqual(alias.entry_id, self.entry.pk)

    def test_dry_run_writes_nothing(self):
        output = self.run_command(dry_run=True)
        self.assertIn("[dry-run]", output)
        self.assertEqual(EntrySlugHistory.objects.count(), 0)

    def test_it_is_idempotent(self):
        self.run_command()
        self.run_command()
        self.assertEqual(EntrySlugHistory.objects.count(), 1)

    def test_it_refuses_to_shadow_a_live_entry(self):
        make_entry(self.collection, slug="a-live-article", title="Live")
        with self.assertRaises(CommandError):
            self.run_command(old_slug="a-live-article")

    def test_it_refuses_a_self_mapping(self):
        with self.assertRaises(CommandError):
            self.run_command(old_slug=self.entry.slug)

    def test_it_refuses_to_remap_another_entrys_alias(self):
        other = make_entry(self.collection, slug="other-article", title="Other")
        other.slug = "other-article-renamed"
        other.save()

        with self.assertRaises(CommandError):
            self.run_command(old_slug="other-article")

    def test_an_unknown_entry_is_an_error(self):
        with self.assertRaises(CommandError):
            self.run_command(entry_slug="no-such-entry")


class AuditSlugsTests(TestCase):
    def setUp(self):
        self.collection = make_collection()

    def audit(self):
        out = StringIO()
        call_command("audit_slugs", stdout=out)
        return out.getvalue()

    def test_a_clean_database_reports_no_problems(self):
        make_entry(self.collection, slug="solar-roi-kerala")
        self.assertIn("No slug problems found", self.audit())

    def test_it_flags_a_placeholder_slug_that_predates_validation(self):
        Entry.objects.bulk_create([Entry(collection=self.collection, title="t", slug="test")])
        output = self.audit()
        self.assertIn("Invalid / placeholder slugs: 1", output)
        self.assertIn("'test'", output)

    def test_it_flags_an_alias_colliding_with_a_live_entry(self):
        entry = make_entry(self.collection, slug="slug-one")
        entry.slug = "slug-two"
        entry.save()
        # Recreate the collision a pre-constraint database could hold.
        make_entry(self.collection, slug="slug-one", title="Reused")

        output = self.audit()
        self.assertIn("Alias/entry collisions: 1", output)
