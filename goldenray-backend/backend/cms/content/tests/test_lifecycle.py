"""Draft / published / deleted must be distinguishable, and only published
content may reach the public API."""
from django.test import TestCase

from content.models import Entry
from content.selectors import admin_entry_queryset, published_entries
from content.services import (
    PublishError,
    publish_entry,
    restore_entry,
    soft_delete_entry,
    unpublish_entry,
)

from .factories import make_collection, make_entry


class LifecycleStateTests(TestCase):
    def setUp(self):
        self.collection = make_collection()
        self.entry = make_entry(self.collection, slug="solar-roi-kerala")

    def test_a_new_entry_is_a_draft(self):
        self.assertEqual(self.entry.status, Entry.Status.DRAFT)
        self.assertIsNone(self.entry.published_at)
        self.assertIsNone(self.entry.deleted_at)
        self.assertFalse(self.entry.is_deleted)

    def test_publishing_stamps_published_at(self):
        publish_entry(self.entry)
        self.entry.refresh_from_db()
        self.assertEqual(self.entry.status, Entry.Status.PUBLISHED)
        self.assertIsNotNone(self.entry.published_at)

    def test_deleting_keeps_the_row_and_marks_it(self):
        publish_entry(self.entry)
        soft_delete_entry(self.entry)
        self.entry.refresh_from_db()

        self.assertEqual(self.entry.status, Entry.Status.DELETED)
        self.assertIsNotNone(self.entry.deleted_at)
        self.assertTrue(self.entry.is_deleted)
        # The record — title, body, slug — survives.
        self.assertTrue(Entry.objects.filter(pk=self.entry.pk).exists())

    def test_the_three_states_are_distinguishable(self):
        draft = self.entry
        published = publish_entry(make_entry(self.collection, slug="published-one"))
        deleted = soft_delete_entry(make_entry(self.collection, slug="deleted-one"))

        self.assertEqual(draft.status, Entry.Status.DRAFT)
        self.assertEqual(published.status, Entry.Status.PUBLISHED)
        self.assertEqual(deleted.status, Entry.Status.DELETED)
        # …and "never existed" is the absence of a row, not a fourth status.
        self.assertFalse(Entry.objects.filter(slug="never-existed-at-all").exists())

    def test_restoring_returns_a_deleted_entry_to_draft(self):
        soft_delete_entry(self.entry)
        restore_entry(self.entry)
        self.entry.refresh_from_db()

        self.assertEqual(self.entry.status, Entry.Status.DRAFT)
        self.assertIsNone(self.entry.deleted_at)

    def test_restoring_a_live_entry_is_rejected(self):
        with self.assertRaises(PublishError):
            restore_entry(self.entry)

    def test_publishing_a_deleted_entry_clears_the_deleted_stamp(self):
        soft_delete_entry(self.entry)
        publish_entry(self.entry)
        self.entry.refresh_from_db()

        self.assertEqual(self.entry.status, Entry.Status.PUBLISHED)
        self.assertIsNone(self.entry.deleted_at)

    def test_unpublishing_returns_to_draft(self):
        publish_entry(self.entry)
        unpublish_entry(self.entry)
        self.entry.refresh_from_db()
        self.assertEqual(self.entry.status, Entry.Status.DRAFT)


class LifecycleVisibilityTests(TestCase):
    def setUp(self):
        self.collection = make_collection()
        self.published = publish_entry(make_entry(self.collection, slug="published-one"))
        self.draft = make_entry(self.collection, slug="draft-one")
        self.deleted = soft_delete_entry(make_entry(self.collection, slug="deleted-one"))

    def test_only_published_entries_are_public(self):
        slugs = set(published_entries("articles").values_list("slug", flat=True))
        self.assertEqual(slugs, {"published-one"})

    def test_deleted_entries_are_hidden_from_the_authoring_list_by_default(self):
        slugs = set(admin_entry_queryset().values_list("slug", flat=True))
        self.assertEqual(slugs, {"published-one", "draft-one"})

    def test_deleted_entries_are_reachable_when_asked_for(self):
        slugs = set(admin_entry_queryset(include_deleted=True).values_list("slug", flat=True))
        self.assertEqual(slugs, {"published-one", "draft-one", "deleted-one"})

    def test_an_inactive_collection_is_not_public(self):
        self.collection.is_active = False
        self.collection.save()
        self.assertEqual(published_entries("articles").count(), 0)
