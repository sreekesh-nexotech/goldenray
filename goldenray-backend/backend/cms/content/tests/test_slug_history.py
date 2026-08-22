"""Renaming an entry must not destroy the URL it was published under."""
from django.test import TestCase

from content.models import Entry, EntrySlugHistory
from content.services import record_slug_change

from .factories import make_collection, make_entry


class SlugHistoryTests(TestCase):
    def setUp(self):
        self.collection = make_collection()

    def test_creating_an_entry_records_no_history(self):
        make_entry(self.collection, slug="solar-panel-cost-kerala")
        self.assertEqual(EntrySlugHistory.objects.count(), 0)

    def test_renaming_preserves_the_old_slug(self):
        entry = make_entry(self.collection, slug="solar-panel-cost-kerala")
        entry.slug = "solar-panel-cost-in-kerala-2026"
        entry.save()

        alias = EntrySlugHistory.objects.get()
        self.assertEqual(alias.slug, "solar-panel-cost-kerala")
        self.assertEqual(alias.entry_id, entry.pk)
        self.assertTrue(alias.is_active)
        # …and the entry's own slug is the new one.
        self.assertEqual(Entry.objects.get(pk=entry.pk).slug, "solar-panel-cost-in-kerala-2026")

    def test_renaming_twice_keeps_both_old_slugs(self):
        entry = make_entry(self.collection, slug="slug-one")
        entry.slug = "slug-two"
        entry.save()
        entry.slug = "slug-three"
        entry.save()

        self.assertEqual(
            set(EntrySlugHistory.objects.values_list("slug", flat=True)),
            {"slug-one", "slug-two"},
        )
        self.assertEqual(EntrySlugHistory.objects.filter(is_active=True).count(), 2)

    def test_saving_without_a_slug_change_adds_nothing(self):
        entry = make_entry(self.collection, slug="solar-panel-cost-kerala")
        entry.title = "A new title"
        entry.save()
        self.assertEqual(EntrySlugHistory.objects.count(), 0)

    def test_reclaiming_an_old_slug_retires_its_alias(self):
        """Otherwise the live entry and a stale alias both answer for one URL."""
        entry = make_entry(self.collection, slug="slug-one")
        entry.slug = "slug-two"
        entry.save()
        self.assertTrue(EntrySlugHistory.objects.get(slug="slug-one").is_active)

        entry.slug = "slug-one"
        entry.save()

        self.assertFalse(EntrySlugHistory.objects.get(slug="slug-one").is_active)
        self.assertTrue(EntrySlugHistory.objects.get(slug="slug-two").is_active)

    def test_no_alias_when_another_entry_holds_the_old_slug(self):
        """Entry A frees a slug, entry B takes it, then A is renamed again —
        A must not end up claiming a URL that now belongs to B."""
        a = make_entry(self.collection, slug="shared-slug", title="A")
        a.slug = "a-renamed"
        a.save()
        EntrySlugHistory.objects.all().delete()  # the alias was retired by hand

        b = make_entry(self.collection, slug="shared-slug", title="B")

        a.slug = "a-renamed-twice"
        a.save()

        # Only the genuine rename is recorded; B's live URL is untouched.
        self.assertEqual(
            list(EntrySlugHistory.objects.values_list("slug", flat=True)), ["a-renamed"]
        )
        self.assertFalse(EntrySlugHistory.objects.filter(slug="shared-slug").exists())
        self.assertEqual(Entry.objects.get(slug="shared-slug").pk, b.pk)

    def test_record_slug_change_refuses_a_live_entrys_slug(self):
        live = make_entry(self.collection, slug="taken-by-someone-else", title="Live")
        other = make_entry(self.collection, slug="other-article", title="Other")

        alias = record_slug_change(other, "taken-by-someone-else")

        self.assertIsNone(alias)
        self.assertEqual(EntrySlugHistory.objects.count(), 0)
        self.assertEqual(Entry.objects.get(slug="taken-by-someone-else").pk, live.pk)

    def test_record_slug_change_does_not_steal_another_entrys_alias(self):
        first = make_entry(self.collection, slug="original-slug", title="First")
        first.slug = "first-renamed"
        first.save()

        second = make_entry(self.collection, slug="second-article", title="Second")
        returned = record_slug_change(second, "original-slug")

        self.assertEqual(returned.entry_id, first.pk)
        self.assertEqual(EntrySlugHistory.objects.filter(slug="original-slug").count(), 1)

    def test_alias_is_scoped_to_its_collection(self):
        guides = make_collection(api_uid="guides", singular_name="Guide", plural_name="Guides")
        entry = make_entry(self.collection, slug="slug-one")
        entry.slug = "slug-two"
        entry.save()

        alias = EntrySlugHistory.objects.get()
        self.assertEqual(alias.collection_id, self.collection.pk)
        # The same retired slug is still free in another collection.
        guide = make_entry(guides, slug="slug-one", title="Guide")
        self.assertEqual(guide.slug, "slug-one")

    def test_deleting_an_entry_removes_its_aliases(self):
        entry = make_entry(self.collection, slug="slug-one")
        entry.slug = "slug-two"
        entry.save()
        self.assertEqual(EntrySlugHistory.objects.count(), 1)

        entry.delete()
        self.assertEqual(EntrySlugHistory.objects.count(), 0)
