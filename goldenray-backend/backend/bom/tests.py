import datetime
import shutil
import tempfile

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings
from django.utils import timezone
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from bom.models import QuotationSettings

URL = "/bom/api/quotation-settings/"

# 1x1 transparent PNG
PNG = bytes.fromhex(
    "89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c489"
    "0000000d4944415478da63f8cfc0f01f0005000201a2dd7cc80000000049454e44ae426082"
)


class QuotationSettingsApiTests(TestCase):
    def setUp(self):
        self.media = tempfile.mkdtemp()
        self.addCleanup(shutil.rmtree, self.media, ignore_errors=True)
        override = override_settings(MEDIA_ROOT=self.media)
        override.enable()
        self.addCleanup(override.disable)

        self.client = APIClient()
        user = get_user_model().objects.create_user(username="admin", password="x")
        self.token = str(RefreshToken.for_user(user).access_token)

    def auth(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")

    def test_public_get_returns_defaults(self):
        res = self.client.get(URL)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data["offer_title"], "Priority 10-Day Installation")
        self.assertTrue(res.data["offer_active"])
        self.assertEqual(res.data["offer_image_src"], "https://golden-ray.b-cdn.net/icons/37.png")

    def test_public_get_ignores_a_bad_token(self):
        self.client.credentials(HTTP_AUTHORIZATION="Bearer not-a-token")
        self.assertEqual(self.client.get(URL).status_code, 200)

    def test_update_requires_auth(self):
        res = self.client.patch(URL, {"offer_title": "x"}, format="json")
        self.assertEqual(res.status_code, 401)
        self.assertEqual(QuotationSettings.load().offer_title, "Priority 10-Day Installation")

    def test_partial_update(self):
        self.auth()
        res = self.client.patch(
            URL, {"offer_details": "T&C apply", "offer_title": "Free Panel Cleaning"}, format="json",
        )
        self.assertEqual(res.status_code, 200, res.data)
        obj = QuotationSettings.load()
        self.assertEqual(obj.offer_details, "T&C apply")
        self.assertEqual(obj.offer_title, "Free Panel Cleaning")
        self.assertEqual(obj.offer_description, "Fast-tracked scheduling and execution")  # untouched
        self.assertEqual(QuotationSettings.objects.count(), 1)

    def test_rejects_offer_that_ends_before_it_starts(self):
        self.auth()
        res = self.client.patch(
            URL, {"offer_valid_from": "2026-10-01", "offer_valid_until": "2026-09-01"}, format="json",
        )
        self.assertEqual(res.status_code, 400)
        self.assertIn("offer_valid_until", res.data)

    def test_date_order_is_checked_against_stored_values(self):
        self.auth()
        self.client.patch(URL, {"offer_valid_from": "2026-10-01"}, format="json")
        res = self.client.patch(URL, {"offer_valid_until": "2026-09-01"}, format="json")
        self.assertEqual(res.status_code, 400)

    def test_offer_inactive_outside_its_dates_or_switched_off(self):
        today = timezone.localdate()
        obj = QuotationSettings.load()

        obj.offer_valid_until = today - datetime.timedelta(days=1)
        obj.save()
        self.assertFalse(self.client.get(URL).data["offer_active"])

        obj.offer_valid_until = None
        obj.offer_valid_from = today + datetime.timedelta(days=1)
        obj.save()
        self.assertFalse(self.client.get(URL).data["offer_active"])

        obj.offer_valid_from = None
        obj.offer_enabled = False
        obj.save()
        self.assertFalse(self.client.get(URL).data["offer_active"])

        obj.offer_enabled = True
        obj.offer_title = "  "
        obj.save()
        self.assertFalse(self.client.get(URL).data["offer_active"])

    def test_image_upload_takes_precedence_over_url(self):
        self.auth()
        res = self.client.patch(
            URL, {"offer_image": SimpleUploadedFile("offer.png", PNG, content_type="image/png")},
            format="multipart",
        )
        self.assertEqual(res.status_code, 200, res.data)
        self.assertIn("/media/quotation/offers/", res.data["offer_image_src"])
        stored = QuotationSettings.load().offer_image
        storage, name = stored.storage, stored.name
        self.assertTrue(storage.exists(name))

        # Clearing the upload falls back to the URL.
        res = self.client.patch(URL, {"offer_image": ""}, format="multipart")
        self.assertEqual(res.status_code, 200, res.data)
        self.assertEqual(res.data["offer_image_src"], "https://golden-ray.b-cdn.net/icons/37.png")
        self.assertFalse(storage.exists(name))  # old upload deleted

    def test_rejects_non_image_upload(self):
        self.auth()
        res = self.client.patch(
            URL, {"offer_image": SimpleUploadedFile("offer.svg", b"<svg/>", content_type="image/svg+xml")},
            format="multipart",
        )
        self.assertEqual(res.status_code, 400)

    def test_singleton_cannot_be_deleted(self):
        QuotationSettings.load().delete()
        self.assertEqual(QuotationSettings.objects.count(), 1)
