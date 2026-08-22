"""The public delivery API against renamed, drafted and deleted articles.

The behaviour that matters: a URL an article used to live at keeps resolving to
that article, and nothing else starts resolving that never did.
"""
from django.test import TestCase

from content.services import publish_entry, soft_delete_entry, unpublish_entry

from .factories import make_collection, make_entry


class DeliverySlugResolutionTests(TestCase):
    def setUp(self):
        self.collection = make_collection()
        self.entry = publish_entry(make_entry(self.collection, slug="solar-panel-cost-kerala"))

    def get(self, slug, collection="articles"):
        return self.client.get(
            f"/api/{collection}", {"filters[slug][$eq]": slug, "populate": "*"}
        )

    # ── The happy path is unchanged ───────────────────────────────────────────
    def test_current_slug_resolves_without_a_redirect_hint(self):
        body = self.get("solar-panel-cost-kerala").json()

        self.assertEqual(body["meta"]["pagination"]["total"], 1)
        self.assertEqual(body["data"][0]["slug"], "solar-panel-cost-kerala")
        self.assertNotIn("redirect", body["meta"])

    def test_an_unknown_slug_still_returns_nothing(self):
        body = self.get("an-article-that-never-existed").json()

        self.assertEqual(body["meta"]["pagination"]["total"], 0)
        self.assertEqual(body["data"], [])
        self.assertNotIn("redirect", body["meta"])

    # ── Renamed articles ──────────────────────────────────────────────────────
    def test_an_old_slug_resolves_to_the_renamed_article(self):
        self.entry.slug = "solar-panel-cost-in-kerala-2026"
        self.entry.save()

        body = self.get("solar-panel-cost-kerala").json()

        self.assertEqual(body["meta"]["pagination"]["total"], 1)
        self.assertEqual(body["data"][0]["id"], self.entry.pk)
        self.assertEqual(body["data"][0]["slug"], "solar-panel-cost-in-kerala-2026")

    def test_the_response_names_the_canonical_slug(self):
        """So the caller can answer with a permanent redirect rather than
        serving one article under two URLs."""
        self.entry.slug = "solar-panel-cost-in-kerala-2026"
        self.entry.save()

        redirect = self.get("solar-panel-cost-kerala").json()["meta"]["redirect"]

        self.assertEqual(redirect["from"], "solar-panel-cost-kerala")
        self.assertEqual(redirect["to"], "solar-panel-cost-in-kerala-2026")
        self.assertEqual(redirect["reason"], "slug_changed")

    def test_an_old_slug_survives_two_renames(self):
        self.entry.slug = "second-slug"
        self.entry.save()
        self.entry.slug = "third-slug"
        self.entry.save()

        for old in ("solar-panel-cost-kerala", "second-slug"):
            with self.subTest(old=old):
                body = self.get(old).json()
                self.assertEqual(body["meta"]["pagination"]["total"], 1)
                self.assertEqual(body["data"][0]["slug"], "third-slug")

    # ── An alias must never resurrect non-public content ──────────────────────
    def test_an_alias_of_an_unpublished_article_does_not_resolve(self):
        self.entry.slug = "new-slug"
        self.entry.save()
        unpublish_entry(self.entry)

        body = self.get("solar-panel-cost-kerala").json()
        self.assertEqual(body["meta"]["pagination"]["total"], 0)

    def test_an_alias_of_a_deleted_article_does_not_resolve(self):
        self.entry.slug = "new-slug"
        self.entry.save()
        soft_delete_entry(self.entry)

        body = self.get("solar-panel-cost-kerala").json()
        self.assertEqual(body["meta"]["pagination"]["total"], 0)

    def test_a_deleted_article_is_gone_from_its_own_slug_too(self):
        soft_delete_entry(self.entry)

        body = self.get("solar-panel-cost-kerala").json()
        self.assertEqual(body["meta"]["pagination"]["total"], 0)

    def test_an_alias_does_not_cross_collections(self):
        guides = make_collection(api_uid="guides", singular_name="Guide", plural_name="Guides")
        self.entry.slug = "new-slug"
        self.entry.save()

        body = self.get("solar-panel-cost-kerala", collection=guides.api_uid).json()
        self.assertEqual(body["meta"]["pagination"]["total"], 0)

    # ── Alias resolution must not fire on ordinary list queries ───────────────
    def test_an_empty_list_query_is_not_treated_as_a_slug_lookup(self):
        self.entry.slug = "new-slug"
        self.entry.save()

        resp = self.client.get(f"/api/articles", {"filters[title][$eq]": "Nothing Matches This"})
        body = resp.json()

        self.assertEqual(body["meta"]["pagination"]["total"], 0)
        self.assertNotIn("redirect", body["meta"])

    def test_a_slug_lookup_combined_with_another_filter_does_not_alias(self):
        self.entry.slug = "new-slug"
        self.entry.save()

        body = self.client.get(
            "/api/articles",
            {
                "filters[slug][$eq]": "solar-panel-cost-kerala",
                "filters[title][$eq]": "Some Other Title",
            },
        ).json()

        self.assertEqual(body["meta"]["pagination"]["total"], 0)
        self.assertNotIn("redirect", body["meta"])

    def test_the_slug_list_never_includes_retired_slugs(self):
        """generateStaticParams() builds pages from this; retired slugs must not
        become canonical pages in their own right."""
        self.entry.slug = "new-slug"
        self.entry.save()

        body = self.client.get(
            "/api/articles", {"fields[0]": "slug", "pagination[pageSize]": "100"}
        ).json()

        self.assertEqual([row["slug"] for row in body["data"]], ["new-slug"])
