"""The authoring API's slug rules and delete semantics."""
from django.contrib.auth import get_user_model
from django.test import TestCase

from content.models import Entry, EntrySlugHistory

from .factories import make_collection, make_entry

User = get_user_model()


class AuthoringApiTestCase(TestCase):
    def setUp(self):
        self.collection = make_collection()
        self.user = User.objects.create_user(
            username="editor", password="pw", role=User.Role.EDITOR
        )
        self.client.force_login(self.user)

    def create(self, **overrides):
        payload = {"collection": self.collection.pk, "title": "An Article", "slug": "an-article"}
        payload.update(overrides)
        return self.client.post("/admin-api/entries/", payload, content_type="application/json")


class SlugRulesTests(AuthoringApiTestCase):
    def test_a_valid_slug_is_accepted(self):
        resp = self.create(slug="solar-panel-cost-in-kerala-2026")
        self.assertEqual(resp.status_code, 201, resp.content)
        self.assertEqual(resp.json()["slug"], "solar-panel-cost-in-kerala-2026")

    def test_an_empty_slug_is_rejected(self):
        resp = self.create(slug="")
        self.assertEqual(resp.status_code, 400)
        self.assertIn("slug", resp.json())

    def test_a_placeholder_slug_is_rejected(self):
        for slug in ("test", "asdf", "sdfsdf", "qwerty", "undefined", "null"):
            with self.subTest(slug=slug):
                resp = self.create(slug=slug)
                self.assertEqual(resp.status_code, 400, f"{slug} was accepted")
                self.assertIn("slug", resp.json())

    def test_a_malformed_slug_is_rejected(self):
        resp = self.create(slug="Not A Slug")
        self.assertEqual(resp.status_code, 400)

    def test_a_duplicate_slug_is_rejected(self):
        make_entry(self.collection, slug="solar-roi-kerala")
        resp = self.create(slug="solar-roi-kerala")
        self.assertEqual(resp.status_code, 400)
        self.assertIn("slug", resp.json())

    def test_a_slug_retired_by_another_entry_is_rejected(self):
        """Reusing a retired slug would silently break the redirect that slug
        was keeping alive."""
        entry = make_entry(self.collection, slug="solar-roi-kerala")
        entry.slug = "how-to-calculate-solar-roi-in-kerala"
        entry.save()

        resp = self.create(slug="solar-roi-kerala")
        self.assertEqual(resp.status_code, 400)

    def test_updating_an_entry_records_its_old_slug(self):
        entry = make_entry(self.collection, slug="solar-panel-cost-kerala")
        resp = self.client.patch(
            f"/admin-api/entries/{entry.pk}/",
            {"slug": "solar-panel-cost-in-kerala-2026"},
            content_type="application/json",
        )

        self.assertEqual(resp.status_code, 200, resp.content)
        self.assertEqual(resp.json()["slug"], "solar-panel-cost-in-kerala-2026")
        alias = EntrySlugHistory.objects.get()
        self.assertEqual(alias.slug, "solar-panel-cost-kerala")
        self.assertEqual([h["slug"] for h in resp.json()["slug_history"]], ["solar-panel-cost-kerala"])


class CheckSlugEndpointTests(AuthoringApiTestCase):
    def check(self, slug):
        return self.client.get(
            "/admin-api/entries/check-slug/", {"collection": "articles", "slug": slug}
        ).json()

    def test_a_free_valid_slug_is_available(self):
        body = self.check("solar-panel-cost-in-kerala")
        self.assertTrue(body["available"])
        self.assertTrue(body["valid"])
        self.assertIsNone(body["error"])

    def test_a_placeholder_slug_reports_why_it_will_be_rejected(self):
        body = self.check("test")
        self.assertFalse(body["valid"])
        self.assertIn("placeholder", body["error"])

    def test_a_taken_slug_suggests_a_free_one(self):
        make_entry(self.collection, slug="solar-roi-kerala")
        body = self.check("solar-roi-kerala")
        self.assertFalse(body["available"])
        self.assertEqual(body["suggestion"], "solar-roi-kerala-2")

    def test_a_retired_slug_counts_as_taken(self):
        entry = make_entry(self.collection, slug="solar-roi-kerala")
        entry.slug = "how-to-calculate-solar-roi-in-kerala"
        entry.save()

        body = self.check("solar-roi-kerala")
        self.assertFalse(body["available"])


class DeleteSemanticsTests(AuthoringApiTestCase):
    def setUp(self):
        super().setUp()
        self.entry = make_entry(self.collection, slug="solar-roi-kerala")

    def test_delete_returns_204_and_keeps_the_record(self):
        resp = self.client.delete(f"/admin-api/entries/{self.entry.pk}/")

        self.assertEqual(resp.status_code, 204)
        self.entry.refresh_from_db()
        self.assertEqual(self.entry.status, Entry.Status.DELETED)
        self.assertIsNotNone(self.entry.deleted_at)

    def test_a_deleted_entry_leaves_the_default_list(self):
        self.client.delete(f"/admin-api/entries/{self.entry.pk}/")
        rows = self.client.get("/admin-api/entries/").json()["results"]
        self.assertEqual(rows, [])

    def test_a_deleted_entry_is_listable_on_request(self):
        self.client.delete(f"/admin-api/entries/{self.entry.pk}/")
        rows = self.client.get("/admin-api/entries/", {"include_deleted": "1"}).json()["results"]
        self.assertEqual([r["slug"] for r in rows], ["solar-roi-kerala"])

    def test_a_deleted_entry_can_be_restored(self):
        self.client.delete(f"/admin-api/entries/{self.entry.pk}/")
        resp = self.client.post(f"/admin-api/entries/{self.entry.pk}/restore/")

        self.assertEqual(resp.status_code, 200, resp.content)
        self.entry.refresh_from_db()
        self.assertEqual(self.entry.status, Entry.Status.DRAFT)

    def test_a_nonexistent_entry_is_404(self):
        self.assertEqual(self.client.delete("/admin-api/entries/999999/").status_code, 404)
        self.assertEqual(self.client.get("/admin-api/entries/999999/").status_code, 404)

    def test_an_author_may_not_delete(self):
        self.client.force_login(
            User.objects.create_user(username="writer", password="pw", role=User.Role.AUTHOR)
        )
        resp = self.client.delete(f"/admin-api/entries/{self.entry.pk}/")

        self.assertEqual(resp.status_code, 400)
        self.entry.refresh_from_db()
        self.assertEqual(self.entry.status, Entry.Status.DRAFT)
