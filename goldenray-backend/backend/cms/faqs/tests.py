"""FAQ list, editor workflow and public delivery (§6.4, §6.5)."""
from django.contrib.auth import get_user_model
from django.test import TestCase

from accounts.models import Role
from accounts.modules import CONTENT_MANAGER
from seo.schema import faq_page
from sitepages.models import Page

from .models import Faq, FaqCategory
from .services import FaqWorkflowError, publish_faq, reorder_faqs

User = get_user_model()


class FaqTestCase(TestCase):
    def setUp(self):
        self.page = Page.objects.create(name="Subsidy", route="/subsidy")
        self.user = User.objects.create_user(
            username="content", password="pw", access_role=Role.objects.get(slug=CONTENT_MANAGER)
        )
        self.client.force_login(self.user)

    def faq(self, **kw):
        kw.setdefault("page", self.page)
        kw.setdefault("question", "How much is the subsidy?")
        kw.setdefault("answer", "Up to ₹78,000.")
        return Faq.objects.create(**kw)


class PublishGateTests(FaqTestCase):
    def test_a_draft_may_be_saved_without_an_answer(self):
        resp = self.client.post(
            "/admin-api/faqs/",
            {"question": "Pending?", "page": self.page.pk},
            content_type="application/json",
        )
        self.assertEqual(resp.status_code, 201, resp.content)
        self.assertEqual(resp.json()["status"], "draft")
        self.assertIn("An answer is required.", resp.json()["publish_errors"])

    def test_publishing_refuses_an_incomplete_record(self):
        faq = self.faq(answer="")
        with self.assertRaises(FaqWorkflowError) as ctx:
            publish_faq(faq)
        self.assertIn("An answer is required.", ctx.exception.errors)

        resp = self.client.post(f"/admin-api/faqs/{faq.pk}/publish/")
        self.assertEqual(resp.status_code, 400)
        faq.refresh_from_db()
        self.assertEqual(faq.status, Faq.Status.DRAFT)

    def test_publishing_a_complete_record_stamps_published_at(self):
        faq = self.faq()
        resp = self.client.post(f"/admin-api/faqs/{faq.pk}/publish/")
        self.assertEqual(resp.status_code, 200, resp.content)
        faq.refresh_from_db()
        self.assertEqual(faq.status, Faq.Status.PUBLISHED)
        self.assertIsNotNone(faq.published_at)
        self.assertEqual(faq.updated_by, self.user)

    def test_delete_archives_instead_of_removing(self):
        faq = self.faq()
        self.assertEqual(self.client.delete(f"/admin-api/faqs/{faq.pk}/").status_code, 204)
        faq.refresh_from_db()
        self.assertEqual(faq.status, Faq.Status.ARCHIVED)
        # Archived rows stay out of the working list unless asked for.
        ids = [r["id"] for r in self.client.get("/admin-api/faqs/").json()["results"]]
        self.assertNotIn(faq.pk, ids)
        ids = [r["id"] for r in self.client.get("/admin-api/faqs/?include_archived=1").json()["results"]]
        self.assertIn(faq.pk, ids)


class OrderingTests(FaqTestCase):
    def test_new_faqs_land_at_the_end_of_their_section(self):
        self.faq(question="First", display_order=0)
        resp = self.client.post(
            "/admin-api/faqs/",
            {"question": "Second", "answer": "x", "page": self.page.pk},
            content_type="application/json",
        )
        self.assertEqual(resp.json()["display_order"], 1)

    def test_reorder_renumbers_one_section_and_ignores_strangers(self):
        a = self.faq(question="A", display_order=0)
        b = self.faq(question="B", display_order=1)
        c = self.faq(question="C", display_order=2)
        other = self.faq(question="Other", section="residential", display_order=0)

        rows = reorder_faqs(self.page.pk, "", [c.pk, a.pk, other.pk])
        order = [(r.question, r.display_order) for r in rows]
        self.assertEqual(order, [("C", 0), ("A", 1), ("B", 2)])
        other.refresh_from_db()
        self.assertEqual(other.display_order, 0)

    def test_reorder_endpoint_needs_edit(self):
        a = self.faq(question="A")
        resp = self.client.post(
            "/admin-api/faqs/reorder/",
            {"page": self.page.pk, "section": "", "order": [a.pk]},
            content_type="application/json",
        )
        self.assertEqual(resp.status_code, 200, resp.content)


class ListFilterTests(FaqTestCase):
    def test_filters_by_page_category_status_and_search(self):
        cat = FaqCategory.objects.create(name="Money", slug="money")
        other_page = Page.objects.create(name="Home", route="/")
        self.faq(question="Subsidy amount?", category=cat, status=Faq.Status.PUBLISHED)
        self.faq(question="Home question?", page=other_page)

        def ids(qs):
            return {r["id"] for r in self.client.get(f"/admin-api/faqs/?{qs}").json()["results"]}

        self.assertEqual(len(ids(f"page_id={self.page.pk}")), 1)
        self.assertEqual(len(ids(f"category={cat.pk}")), 1)
        self.assertEqual(len(ids("status=published")), 1)
        self.assertEqual(len(ids("search=home")), 1)

    def test_a_category_in_use_cannot_be_deleted(self):
        cat = FaqCategory.objects.create(name="Money", slug="money")
        self.faq(category=cat)
        self.assertEqual(self.client.delete(f"/admin-api/faq-categories/{cat.pk}/").status_code, 400)


class PublicDeliveryTests(FaqTestCase):
    def test_only_published_faqs_are_served_in_display_order(self):
        self.faq(question="Second", status=Faq.Status.PUBLISHED, display_order=1)
        self.faq(question="First", status=Faq.Status.PUBLISHED, display_order=0)
        self.faq(question="Draft", status=Faq.Status.DRAFT)
        self.client.logout()

        resp = self.client.get("/api/faqs?page=/subsidy")
        self.assertEqual(resp.status_code, 200)
        body = resp.json()
        self.assertEqual([f["question"] for f in body["data"]], ["First", "Second"])
        self.assertEqual(body["meta"]["schema"]["@type"], "FAQPage")
        self.assertEqual(len(body["meta"]["schema"]["mainEntity"]), 2)

    def test_unknown_page_is_a_404_and_section_filters(self):
        self.faq(question="Res", section="residential", status=Faq.Status.PUBLISHED)
        self.faq(question="Com", section="commercial", status=Faq.Status.PUBLISHED)
        self.client.logout()
        self.assertEqual(self.client.get("/api/faqs?page=/nowhere").status_code, 404)
        body = self.client.get("/api/faqs?page=/subsidy&section=residential").json()
        self.assertEqual([f["question"] for f in body["data"]], ["Res"])

    def test_schema_is_generated_from_records_not_typed(self):
        faqs = [self.faq(question="Q1", answer="<p>A1</p>"), self.faq(question="", answer="ignored")]
        doc = faq_page(faqs, site_url="https://flarize.com", page_url="/subsidy")
        self.assertEqual(doc["url"], "https://flarize.com/subsidy")
        self.assertEqual(len(doc["mainEntity"]), 1)
        self.assertEqual(doc["mainEntity"][0]["acceptedAnswer"]["text"], "<p>A1</p>")
