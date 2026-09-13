"""Controlled page maintenance (§6.2, §6.16) and its public delivery."""
from io import StringIO

from django.contrib.auth import get_user_model
from django.core.management import call_command
from django.test import TestCase

from accounts.models import Role
from accounts.modules import CAREERS_HR, CONTENT_MANAGER, SUPER_ADMIN

from .models import Page, PageImageSlot, PageSeo, PageTextSlot

User = get_user_model()


def login_as(client, slug, username=None):
    user = User.objects.create_user(
        username=username or slug.replace("-", "_"), password="pw", access_role=Role.objects.get(slug=slug)
    )
    client.force_login(user)
    return user


class PagesTestCase(TestCase):
    def setUp(self):
        self.page = Page.objects.create(name="Careers", route="/career")
        self.text = PageTextSlot.objects.create(page=self.page, key="hero_title", label="Headline", max_length=20)
        self.image = PageImageSlot.objects.create(page=self.page, key="hero_background", label="Hero")


class MaintenanceOnlyTests(PagesTestCase):
    def setUp(self):
        super().setUp()
        login_as(self.client, CONTENT_MANAGER)

    def test_pages_cannot_be_created_or_deleted_through_the_api(self):
        # Refused twice over: the registry allows neither create nor archive on
        # Pages (so even a Super Admin gets 403), and the viewset has no route.
        for slug in (CONTENT_MANAGER, SUPER_ADMIN):
            login_as(self.client, slug, username=f"u_{slug}")
            resp = self.client.post("/admin-api/pages/", {"name": "New", "route": "/new"}, content_type="application/json")
            self.assertIn(resp.status_code, (403, 405))
            self.assertIn(self.client.delete(f"/admin-api/pages/{self.page.pk}/").status_code, (403, 405))
        self.assertEqual(Page.objects.count(), 1)

    def test_route_and_name_are_read_only(self):
        resp = self.client.patch(
            f"/admin-api/pages/{self.page.pk}/",
            {"route": "/elsewhere", "name": "Renamed", "sort_order": 5},
            content_type="application/json",
        )
        self.assertEqual(resp.status_code, 200, resp.content)
        self.page.refresh_from_db()
        self.assertEqual((self.page.route, self.page.name, self.page.sort_order), ("/career", "Careers", 5))

    def test_text_slot_honours_its_cap(self):
        url = f"/admin-api/pages/{self.page.pk}/text-slots/{self.text.pk}/"
        resp = self.client.patch(url, {"value": "x" * 21}, content_type="application/json")
        self.assertEqual(resp.status_code, 400)
        resp = self.client.patch(url, {"value": "Join us", "key": "hacked"}, content_type="application/json")
        self.assertEqual(resp.status_code, 200)
        self.text.refresh_from_db()
        self.assertEqual((self.text.value, self.text.key), ("Join us", "hero_title"))

    def test_status_change_needs_publish_not_just_edit(self):
        # Content Manager holds pages: view, edit — no publish.
        resp = self.client.patch(
            f"/admin-api/pages/{self.page.pk}/", {"status": "archived"}, content_type="application/json"
        )
        self.assertEqual(resp.status_code, 403)
        self.page.refresh_from_db()
        self.assertEqual(self.page.status, Page.Status.PUBLISHED)

        login_as(self.client, SUPER_ADMIN)
        resp = self.client.patch(
            f"/admin-api/pages/{self.page.pk}/", {"status": "draft"}, content_type="application/json"
        )
        self.assertEqual(resp.status_code, 200, resp.content)

    def test_seo_block_is_created_on_first_access_and_reports_validity(self):
        body = self.client.get(f"/admin-api/pages/{self.page.pk}/seo/").json()
        self.assertEqual(body["seo_status"], "error")
        self.assertTrue(PageSeo.objects.filter(page=self.page).exists())

        resp = self.client.patch(
            f"/admin-api/pages/{self.page.pk}/seo/",
            {"seo_title": "Careers at Flarize", "meta_description": "Join the team behind Kerala's fastest-growing solar platform — engineering, sales and operations."},
            content_type="application/json",
        )
        self.assertEqual(resp.json()["seo_status"], "ok", resp.content)


class CareerPageMountTests(PagesTestCase):
    def test_hr_reaches_the_career_page_only(self):
        Page.objects.create(name="Home", route="/")
        login_as(self.client, CAREERS_HR)
        rows = self.client.get("/admin-api/career-page/").json()["results"]
        self.assertEqual([r["route"] for r in rows], ["/career"])
        self.assertEqual(self.client.get(f"/admin-api/career-page/{self.page.pk}/").status_code, 200)
        self.assertEqual(self.client.get("/admin-api/pages/").status_code, 403)

        resp = self.client.patch(
            f"/admin-api/career-page/{self.page.pk}/text-slots/{self.text.pk}/",
            {"value": "Hiring now"},
            content_type="application/json",
        )
        self.assertEqual(resp.status_code, 200, resp.content)

    def test_other_pages_are_not_reachable_through_the_career_mount(self):
        home = Page.objects.create(name="Home", route="/")
        login_as(self.client, SUPER_ADMIN)
        self.assertEqual(self.client.get(f"/admin-api/career-page/{home.pk}/").status_code, 404)


class PublicPageContentTests(PagesTestCase):
    def test_unset_slots_are_null_so_the_site_keeps_its_defaults(self):
        self.text.value = "Hiring now"
        self.text.save()
        body = self.client.get("/api/page-content?route=/career").json()["data"]
        self.assertIsNone(body["images"]["hero_background"])
        self.assertEqual(body["text"], {"hero_title": "Hiring now"})

    def test_unpublished_pages_are_not_served(self):
        self.page.status = Page.Status.DRAFT
        self.page.save()
        self.assertEqual(self.client.get("/api/page-content?route=/career").status_code, 404)
        self.assertEqual(self.client.get("/api/page-content").status_code, 404)


class SeedCommandTests(TestCase):
    def test_seed_pages_is_idempotent_and_declares_career_slots(self):
        out = StringIO()
        call_command("seed_pages", stdout=out)
        pages = Page.objects.count()
        self.assertGreater(pages, 20)
        career = Page.objects.get(route="/career")
        self.assertEqual(set(career.image_slots.values_list("key", flat=True)), {"hero_background"})
        self.assertEqual(set(career.text_slots.values_list("key", flat=True)), {"hero_title", "hero_subtitle"})

        # A maintainer's edits survive a re-run.
        slot = career.text_slots.get(key="hero_title")
        slot.value = "Edited"
        slot.save()
        call_command("seed_pages", stdout=StringIO())
        slot.refresh_from_db()
        self.assertEqual(slot.value, "Edited")
        self.assertEqual(Page.objects.count(), pages)
