"""Cross-service Studio authorisation (§6.8, §6.9, §6.13, §7).

The Content Studio signs in against the CMS; this service verifies those
tokens with a shared key and honours the Phase 1 module grant they carry.
These tests mint tokens the way the CMS does and check that the leads, EMI
and applications endpoints follow the matrix rather than the legacy role.
"""
import tempfile
from datetime import datetime, timedelta, timezone

import jwt
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings

from .models import JobApplication, JobApplicationEvent
from .models.lead_collection_home import LeadCollectionHome

KEY = "test-shared-signing-key"


def token(*, role="editor", modules=None, permissions=None, legacy=False):
    """A Studio access token. ``legacy=True`` omits the module claims."""
    payload = {
        "token_type": "access",
        "exp": datetime.now(timezone.utc) + timedelta(minutes=5),
        "user_id": 1,
        "username": "tester",
        "role": role,
    }
    if not legacy:
        payload["modules"] = modules or []
        payload["permissions"] = permissions or {}
    return jwt.encode(payload, KEY, algorithm="HS256")


def bearer(tok):
    return {"HTTP_AUTHORIZATION": f"Bearer {tok}"}


SALES = dict(role="author", modules=["dashboard", "leads", "emi"],
             permissions={"dashboard": ["view"], "leads": ["view", "edit", "archive"], "emi": ["view"]})
HR = dict(role="editor", modules=["applications", "job_positions"],
          permissions={"applications": ["view", "edit", "archive"], "job_positions": ["view"]})
CONTENT = dict(role="editor", modules=["blogs", "faqs"], permissions={"blogs": ["view"], "faqs": ["view"]})


@override_settings(STUDIO_JWT_SIGNING_KEY=KEY)
class LeadsGatingTests(TestCase):
    def setUp(self):
        self.lead = LeadCollectionHome.objects.create(name="Asha", phone_number="9876543210")

    def test_anonymous_cannot_read_the_queue(self):
        resp = self.client.get("/api/lead-collection-home/")
        self.assertIn(resp.status_code, (401, 403))

    def test_public_form_still_posts_without_a_token(self):
        resp = self.client.post("/api/lead-collection-home/", {"name": "New", "phone_number": "9123456789"})
        self.assertEqual(resp.status_code, 201, resp.content)

    def test_sales_lead_role_reads_edits_and_deletes(self):
        h = bearer(token(**SALES))
        self.assertEqual(self.client.get("/api/lead-collection-home/", **h).status_code, 200)
        resp = self.client.put(
            f"/api/lead-collection-home/{self.lead.pk}/", {"name": "Asha K"}, content_type="application/json", **h
        )
        self.assertEqual(resp.status_code, 200, resp.content)
        self.assertEqual(self.client.delete(f"/api/lead-collection-home/{self.lead.pk}/", **h).status_code, 204)

    def test_roles_without_leads_are_refused(self):
        for grant in (HR, CONTENT):
            with self.subTest(modules=grant["modules"]):
                self.assertEqual(self.client.get("/api/lead-collection-home/", **bearer(token(**grant))).status_code, 403)

    def test_view_only_grant_cannot_delete(self):
        h = bearer(token(role="author", modules=["leads"], permissions={"leads": ["view"]}))
        self.assertEqual(self.client.get("/api/lead-collection-home/", **h).status_code, 200)
        self.assertEqual(self.client.delete(f"/api/lead-collection-home/{self.lead.pk}/", **h).status_code, 403)

    def test_a_forged_token_is_refused(self):
        forged = jwt.encode({"role": "admin", "modules": ["leads"], "exp": datetime.now(timezone.utc) + timedelta(minutes=5)}, "wrong-key", algorithm="HS256")
        self.assertEqual(self.client.get("/api/lead-collection-home/", **bearer(forged)).status_code, 403)


@override_settings(STUDIO_JWT_SIGNING_KEY=KEY)
class EmiGatingTests(TestCase):
    def test_view_grant_reads_but_cannot_write(self):
        h = bearer(token(**SALES))
        self.assertEqual(self.client.get("/api/emi-admin/settings/", **h).status_code, 200)
        self.assertEqual(self.client.patch("/api/emi-admin/settings/", {}, content_type="application/json", **h).status_code, 403)

    def test_editor_without_the_emi_module_is_refused(self):
        # Before Phase 1 any editor could change pricing; the matrix decides now.
        self.assertEqual(self.client.get("/api/emi-admin/settings/", **bearer(token(**CONTENT))).status_code, 403)

    def test_edit_grant_can_write(self):
        h = bearer(token(role="admin", modules=["emi"], permissions={"emi": ["view", "edit"]}))
        self.assertEqual(self.client.patch("/api/emi-admin/settings/", {}, content_type="application/json", **h).status_code, 200)

    def test_pre_matrix_tokens_fall_back_to_the_legacy_role(self):
        self.assertEqual(self.client.get("/api/emi-admin/settings/", **bearer(token(role="editor", legacy=True))).status_code, 200)
        self.assertEqual(self.client.get("/api/emi-admin/settings/", **bearer(token(role="author", legacy=True))).status_code, 403)

    @override_settings(STUDIO_JWT_SIGNING_KEY="")
    def test_unconfigured_key_fails_closed_loudly(self):
        self.assertEqual(self.client.get("/api/emi-admin/settings/", **bearer(token(**SALES))).status_code, 503)


# Uploads go to a throwaway directory, never the real media volume.
@override_settings(STUDIO_JWT_SIGNING_KEY=KEY, MEDIA_ROOT=tempfile.mkdtemp(prefix="goldenray-test-media-"))
class ApplicationsWorkflowTests(TestCase):
    def setUp(self):
        self.app = JobApplication.objects.create(
            full_name="Hari K", email="hari@example.com", phone="9876543210", location="Kochi",
            linkedin="https://linkedin.com/in/hari", resume=SimpleUploadedFile("cv.pdf", b"%PDF-1.4"),
            declaration_accepted=True,
        )
        self.hr = bearer(token(**HR))

    def test_queue_is_hr_only(self):
        self.assertIn(self.client.get("/api/job-applications/").status_code, (401, 403))
        self.assertEqual(self.client.get("/api/job-applications/", **bearer(token(**CONTENT))).status_code, 403)
        self.assertEqual(self.client.get("/api/job-applications/", **self.hr).status_code, 200)

    def test_status_workflow_refuses_illegal_jumps_and_records_a_timeline(self):
        url = f"/api/job-applications/{self.app.pk}/status/"
        resp = self.client.post(url, {"status": "selected"}, content_type="application/json", **self.hr)
        self.assertEqual(resp.status_code, 400)
        self.assertIn("Allowed", resp.json()["detail"])

        resp = self.client.post(url, {"status": "reviewing", "note": "Looks strong"}, content_type="application/json", **self.hr)
        self.assertEqual(resp.status_code, 200, resp.content)
        body = resp.json()
        self.assertEqual(body["status"], "reviewing")
        self.assertEqual(body["allowed_transitions"], ["interview", "rejected", "new"])
        event = JobApplicationEvent.objects.get(application=self.app, kind="status")
        self.assertEqual((event.from_status, event.to_status, event.actor, event.detail), ("new", "reviewing", "tester", "Looks strong"))

    def test_assign_links_a_general_application_and_keeps_the_original(self):
        resp = self.client.post(
            f"/api/job-applications/{self.app.pk}/assign/",
            {"position_id": 7, "position_title": "Solar Engineer", "department_name": "Engineering"},
            content_type="application/json", **self.hr,
        )
        self.assertEqual(resp.status_code, 200, resp.content)
        self.app.refresh_from_db()
        self.assertEqual((self.app.position, self.app.position_id, self.app.display_position), ("General application", 7, "Solar Engineer"))

    def test_delete_archives_and_restore_brings_it_back(self):
        self.assertEqual(self.client.delete(f"/api/job-applications/{self.app.pk}/", **self.hr).status_code, 204)
        self.app.refresh_from_db()
        self.assertIsNotNone(self.app.archived_at)
        ids = [r["id"] for r in self.client.get("/api/job-applications/", **self.hr).json()]
        self.assertNotIn(self.app.pk, ids)
        self.assertEqual(self.client.post(f"/api/job-applications/{self.app.pk}/restore/", **self.hr).status_code, 200)
        self.app.refresh_from_db()
        self.assertIsNone(self.app.archived_at)

    def test_archive_needs_the_archive_verb(self):
        h = bearer(token(role="editor", modules=["applications"], permissions={"applications": ["view", "edit"]}))
        self.assertEqual(self.client.delete(f"/api/job-applications/{self.app.pk}/", **h).status_code, 403)

    def test_public_form_snapshots_the_posting(self):
        resp = self.client.post(
            "/api/job-applications/",
            {
                "position": "Solar Engineer", "position_id": 7, "position_title": "Solar Engineer", "department_name": "Engineering",
                "full_name": "New Person", "email": "new@example.com", "phone": "9123456789", "location": "Kochi",
                "linkedin": "linkedin.com/in/new", "declaration_accepted": "true",
                "resume": SimpleUploadedFile("cv.pdf", b"%PDF-1.4"), "website": "",
            },
        )
        self.assertEqual(resp.status_code, 201, resp.content)
        app = JobApplication.objects.get(email="new@example.com")
        self.assertEqual((app.position_id, app.department_name, app.status), (7, "Engineering", "new"))
        self.assertTrue(app.events.filter(kind="received").exists())


@override_settings(STUDIO_JWT_SIGNING_KEY=KEY, MEDIA_ROOT=tempfile.mkdtemp(prefix="goldenray-test-media-"))
class WebsiteFormsReachStudioTests(TestCase):
    """Every public form's submission must end up somewhere the Studio shows."""

    def setUp(self):
        self.sales = bearer(token(**SALES))

    def enquiries(self):
        return self.client.get("/api/lead-collection-home/", **self.sales).json()

    def test_a_repeat_enquiry_from_the_same_number_is_recorded_not_refused(self):
        body = {"name": "test", "phone_number": "9605466933", "source": "footer", "page": "/"}
        first = self.client.post("/api/lead-collection-home/", body, content_type="application/json")
        again = self.client.post("/api/lead-collection-home/", body, content_type="application/json")
        self.assertEqual((first.status_code, again.status_code), (201, 201), again.content)
        self.assertEqual(LeadCollectionHome.objects.filter(phone_number="9605466933").count(), 2)

    def test_source_page_and_details_are_stored_and_listed(self):
        resp = self.client.post(
            "/api/lead-collection-home/",
            {"name": "Asha", "phone_number": "+91 98765 43210", "source": "group_purchase", "page": "/group-purchase",
             "details": {"District": "Ernakulam", "Locality": "Kakkanad", "Empty": ""}},
            content_type="application/json",
        )
        self.assertEqual(resp.status_code, 201, resp.content)
        row = self.enquiries()[0]
        self.assertEqual(row["phone_number"], "9876543210")
        self.assertEqual((row["source"], row["source_label"], row["page"]), ("group_purchase", "Group Purchase reservation", "/group-purchase"))
        self.assertEqual(row["details"], {"District": "Ernakulam", "Locality": "Kakkanad"})

    def test_invalid_input_returns_field_errors(self):
        resp = self.client.post("/api/lead-collection-home/", {"name": "x", "phone_number": "12345"}, content_type="application/json")
        self.assertEqual(resp.status_code, 400)
        self.assertIn("phone_number", resp.json()["errors"])
        nested = self.client.post(
            "/api/lead-collection-home/",
            {"name": "x", "phone_number": "9876543210", "details": {"a": {"nested": 1}}},
            content_type="application/json",
        )
        self.assertEqual(nested.status_code, 400)

    def test_referral_and_warranty_forms_are_mirrored_into_enquiries(self):
        ref = self.client.post("/api/affiliate-applications/", {
            "full_name": "Ravi", "phone": "9123456780", "email": "ravi@example.com",
            "profession": "Other", "district": "Kollam", "website": "",
        })
        self.assertEqual(ref.status_code, 201, ref.content)
        war = self.client.post("/api/warranty-service-requests/", {
            "full_name": "Mini", "phone": "9123456781", "issue_type": "Inverter Fault", "description": "No output", "website": "",
        })
        self.assertEqual(war.status_code, 201, war.content)
        by_source = {r["source"]: r for r in self.enquiries()}
        self.assertEqual(by_source["referral_partner"]["details"]["District"], "Kollam")
        self.assertEqual(by_source["warranty_service"]["details"]["Issue"], "Inverter Fault")

    def test_general_application_submits_with_its_extra_fields(self):
        resp = self.client.post("/api/job-applications/", {
            "position": "General application", "department_name": "Operations",
            "full_name": "Gen Person", "email": "gen@example.com", "phone": "9123456782", "location": "Kochi",
            "linkedin": "linkedin.com/in/gen", "declaration_accepted": "true",
            "availability": "Full-time", "cover_note": "I like solar.",
            "resume": SimpleUploadedFile("cv.pdf", b"%PDF-1.4"), "website": "",
        })
        self.assertEqual(resp.status_code, 201, resp.content)
        app = JobApplication.objects.get(email="gen@example.com")
        self.assertEqual((app.position, app.department_name, app.availability, app.cover_note),
                         ("General application", "Operations", "Full-time", "I like solar."))


class EmiQuotationTests(TestCase):
    """The quotation's EMI endpoint must apply exactly the calculator's policy."""

    URL = "/api/emi-calculator/quotation/"

    def setUp(self):
        from decimal import Decimal

        from .models import EmiCalculatorSettings, EmiInterestRateRule, EmiSystemSize

        # Today's policy: price − down payment up to ₹2L → 5.75%, above → 8%.
        # Start from exactly that, whatever the seed migrations installed.
        EmiInterestRateRule.objects.all().delete()
        EmiInterestRateRule.objects.create(
            label="up to 2L", max_loan=Decimal("200000"), rate=Decimal("5.75"),
            min_rate=Decimal("5.75"), is_locked=True, priority=20,
        )
        EmiInterestRateRule.objects.create(
            label="above 2L", min_loan=Decimal("200000.01"), rate=Decimal("8"),
            min_rate=Decimal("8"), is_locked=True, priority=20,
        )
        EmiCalculatorSettings.load()
        EmiSystemSize.objects.update_or_create(
            capacity_kw=Decimal("5"),
            defaults={"label": "5kW", "price_per_kw": Decimal("66000"), "is_active": True},
        )

    def post(self, body):
        return self.client.post(self.URL, body, content_type="application/json")

    def test_rate_band_follows_price_minus_down_payment(self):
        res = self.post({"capacity_kw": 3, "packages": {
            "elite": {"system_cost": 300000, "subsidy": 78000},   # basis 2,70,000 → 8%
            "essential": {"system_cost": 200000, "subsidy": 78000},  # basis 1,80,000 → 5.75%
        }})
        self.assertEqual(res.status_code, 200, res.content)
        elite, essential = res.json()["packages"]["elite"], res.json()["packages"]["essential"]
        self.assertEqual(res.json()["tenure_years"], 10)

        self.assertEqual(elite["down_payment"], 30000)
        self.assertEqual(elite["rate_basis"], 270000)
        self.assertEqual(elite["loan_amount"], 192000)
        self.assertEqual(elite["interest_rate"], 8)

        self.assertEqual(essential["rate_basis"], 180000)
        self.assertEqual(essential["loan_amount"], 102000)
        self.assertEqual(essential["interest_rate"], 5.75)
        self.assertAlmostEqual(essential["daily_amount"], round(essential["emi_per_month"] / 30, 2))

    def test_boundary_is_inclusive_at_two_lakh(self):
        # 2,22,222.22 − 10% = 2,00,000.00 exactly → still the ≤ ₹2L band.
        res = self.post({"capacity_kw": 3, "packages": {"p": {"system_cost": 222222.22, "subsidy": 0}}})
        self.assertEqual(res.json()["packages"]["p"]["rate_basis"], 200000)
        self.assertEqual(res.json()["packages"]["p"]["interest_rate"], 5.75)

    def test_subsidy_lowers_emi_but_not_the_band(self):
        with_sub = self.post({"capacity_kw": 5, "packages": {"p": {"system_cost": 330000, "subsidy": 78000}}}).json()
        without = self.post({"capacity_kw": 5, "packages": {"p": {"system_cost": 330000, "subsidy": 0}}}).json()
        self.assertEqual(with_sub["packages"]["p"]["interest_rate"], without["packages"]["p"]["interest_rate"])
        self.assertLess(with_sub["packages"]["p"]["emi_per_month"], without["packages"]["p"]["emi_per_month"])

    def test_matches_the_calculator_for_the_same_price(self):
        from .utils import emi as emi_engine

        calc = emi_engine.calculate(capacity_kw=5, tenure_years=10)
        res = self.post({"capacity_kw": 5, "packages": {"p": {
            "system_cost": calc["system"]["system_cost"], "subsidy": calc["subsidy"]["amount"],
        }}}).json()["packages"]["p"]
        self.assertEqual(res["interest_rate"], calc["interest"]["rate"])
        self.assertEqual(res["loan_amount"], calc["loan"]["amount"])
        self.assertEqual(res["emi_per_month"], calc["result"]["emi_per_month"])
        self.assertEqual(res["daily_amount"], calc["result"]["daily_amount"])

    def test_rejects_bad_input(self):
        self.assertEqual(self.post({"capacity_kw": 3, "packages": {}}).status_code, 400)
        self.assertEqual(self.post({"packages": {"p": {"system_cost": 1}}}).status_code, 400)
        self.assertEqual(self.post({"capacity_kw": 3, "packages": {"p": {"system_cost": 0}}}).status_code, 400)
        self.assertEqual(self.post({"capacity_kw": 3, "tenure_years": 99, "packages": {"p": {"system_cost": 1}}}).status_code, 400)
        many = {str(i): {"system_cost": 100000} for i in range(7)}
        self.assertEqual(self.post({"capacity_kw": 3, "packages": many}).status_code, 400)
