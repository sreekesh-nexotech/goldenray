"""Global settings (§6.18): a validated singleton."""
from django.contrib.auth import get_user_model
from django.test import TestCase

from accounts.models import Role
from accounts.modules import CONTENT_MANAGER, SUPER_ADMIN
from seo.schema import organisation

from .models import SiteSettings

User = get_user_model()


class SiteSettingsTests(TestCase):
    def login(self, slug):
        self.client.force_login(
            User.objects.create_user(username=slug, password="pw", access_role=Role.objects.get(slug=slug))
        )

    def test_singleton_cannot_multiply_or_be_deleted(self):
        SiteSettings.load()
        SiteSettings(company_name="Second").save()
        self.assertEqual(SiteSettings.objects.count(), 1)
        self.assertEqual(SiteSettings.load().company_name, "Second")
        SiteSettings.load().delete()
        self.assertEqual(SiteSettings.objects.count(), 1)

    def test_malformed_notification_address_is_rejected(self):
        self.login(SUPER_ADMIN)
        resp = self.client.patch(
            "/admin-api/settings/",
            {"lead_notification_emails": "sales@flarize.com, not-an-email"},
            content_type="application/json",
        )
        self.assertEqual(resp.status_code, 400)
        self.assertIn("not-an-email", str(resp.json()))

        resp = self.client.patch(
            "/admin-api/settings/",
            {"lead_notification_emails": "sales@flarize.com , ops@flarize.com"},
            content_type="application/json",
        )
        self.assertEqual(resp.status_code, 200, resp.content)
        self.assertEqual(resp.json()["lead_recipients"], ["sales@flarize.com", "ops@flarize.com"])

    def test_settings_module_is_required(self):
        self.login(CONTENT_MANAGER)
        self.assertEqual(self.client.get("/admin-api/settings/").status_code, 403)

    def test_organisation_schema_reads_the_row(self):
        row = SiteSettings.load()
        self.assertIsNone(organisation(row, site_url="https://flarize.com"))
        row.company_name = "Flarize"
        row.address_locality = "Kochi"
        row.save()
        doc = organisation(row, site_url="https://flarize.com")
        self.assertEqual(doc["@type"], "Organization")
        self.assertEqual(doc["address"]["addressLocality"], "Kochi")
        self.assertNotIn("email", doc)  # empty branches are dropped
