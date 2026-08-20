"""Slug shape, placeholder rejection and uniqueness."""
from django.core.exceptions import ValidationError
from django.db import IntegrityError, transaction
from django.test import TestCase

from content.models import Entry
from content.services import slug_taken
from content.validators import slug_error, validate_entry_slug

from .factories import make_collection, make_entry


class ValidateEntrySlugTests(TestCase):
    def test_accepts_a_normal_slug(self):
        for slug in (
            "solar-panel-cost-in-kerala-2026",
            "monocrystalline-vs-polycrystalline",
            "pm-surya-ghar",
            "5kw-solar-system",
        ):
            with self.subTest(slug=slug):
                validate_entry_slug(slug)  # must not raise

    def test_rejects_empty(self):
        for value in ("", None):
            with self.subTest(value=value), self.assertRaises(ValidationError) as ctx:
                validate_entry_slug(value)
            self.assertEqual(ctx.exception.code, "slug_empty")

    def test_rejects_malformed(self):
        for slug in (
            "Solar-Panel",          # uppercase
            "solar_panel",          # underscore
            "solar panel",          # space
            "solar--panel",         # doubled hyphen
            "-solar-panel",         # leading hyphen
            "solar-panel-",         # trailing hyphen
            "solar/panel",          # path separator
            "[object Object]",
            "{slug}",
        ):
            with self.subTest(slug=slug), self.assertRaises(ValidationError) as ctx:
                validate_entry_slug(slug)
            self.assertEqual(ctx.exception.code, "slug_malformed")

    def test_rejects_the_known_placeholder_values(self):
        for slug in ("sdf", "sdfsdf", "test", "testing", "asdf", "qwerty", "undefined", "null"):
            with self.subTest(slug=slug), self.assertRaises(ValidationError) as ctx:
                validate_entry_slug(slug)
            self.assertEqual(ctx.exception.code, "slug_placeholder")

    def test_rejects_placeholder_variants(self):
        """The junk that actually reaches production is 'test-2', not 'test'."""
        for slug in ("test-1", "asdf-asdf", "object-object", "lorem-ipsum", "untitled-3"):
            with self.subTest(slug=slug), self.assertRaises(ValidationError) as ctx:
                validate_entry_slug(slug)
            self.assertEqual(ctx.exception.code, "slug_placeholder")

    def test_rejects_reserved_site_paths(self):
        for slug in ("blog", "admin", "api", "sitemap"):
            with self.subTest(slug=slug), self.assertRaises(ValidationError) as ctx:
                validate_entry_slug(slug)
            self.assertEqual(ctx.exception.code, "slug_reserved")

    def test_rejects_over_length(self):
        with self.assertRaises(ValidationError) as ctx:
            validate_entry_slug("a" * 256)
        self.assertEqual(ctx.exception.code, "slug_too_long")

    def test_slug_error_returns_a_message_or_none(self):
        self.assertIsNone(slug_error("solar-panel-cost"))
        self.assertIn("placeholder", slug_error("test"))


class ModelLevelSlugTests(TestCase):
    def setUp(self):
        self.collection = make_collection()

    def test_full_clean_rejects_a_placeholder_slug(self):
        entry = Entry(collection=self.collection, title="Test", slug="test")
        with self.assertRaises(ValidationError) as ctx:
            entry.full_clean()
        self.assertIn("slug", ctx.exception.error_dict)

    def test_duplicate_slug_is_rejected_by_the_database(self):
        """Uniqueness is a constraint, not just serializer logic — a direct
        create must fail too."""
        make_entry(self.collection, slug="solar-roi-kerala")
        with self.assertRaises(IntegrityError), transaction.atomic():
            make_entry(self.collection, slug="solar-roi-kerala", title="Other")

    def test_same_slug_in_a_different_collection_is_allowed(self):
        other = make_collection(api_uid="guides", singular_name="Guide", plural_name="Guides")
        make_entry(self.collection, slug="solar-roi-kerala")
        make_entry(other, slug="solar-roi-kerala")  # must not raise
        self.assertEqual(Entry.objects.filter(slug="solar-roi-kerala").count(), 2)

    def test_deleted_entry_keeps_its_slug_claim(self):
        entry = make_entry(self.collection, slug="solar-roi-kerala")
        entry.status = Entry.Status.DELETED
        entry.save()
        self.assertTrue(slug_taken(self.collection.pk, "solar-roi-kerala"))


class SlugTakenTests(TestCase):
    def setUp(self):
        self.collection = make_collection()

    def test_free_slug_is_not_taken(self):
        self.assertFalse(slug_taken(self.collection.pk, "brand-new-article"))

    def test_live_entry_slug_is_taken(self):
        make_entry(self.collection, slug="solar-roi-kerala")
        self.assertTrue(slug_taken(self.collection.pk, "solar-roi-kerala"))

    def test_an_entry_does_not_block_its_own_slug(self):
        entry = make_entry(self.collection, slug="solar-roi-kerala")
        self.assertFalse(
            slug_taken(self.collection.pk, "solar-roi-kerala", exclude_entry_pk=entry.pk)
        )

    def test_an_active_alias_makes_a_slug_taken(self):
        entry = make_entry(self.collection, slug="solar-roi-kerala")
        entry.slug = "how-to-calculate-solar-roi-in-kerala"
        entry.save()
        self.assertTrue(slug_taken(self.collection.pk, "solar-roi-kerala"))
