"""Departments, job positions and the public careers delivery (§6.10–§6.15)."""
from datetime import date

from django.contrib.auth import get_user_model
from django.test import TestCase

from accounts.models import Role
from accounts.modules import CAREERS_HR
from seo.schema import job_posting

from .models import Department, JobPosition

User = get_user_model()


class CareersTestCase(TestCase):
    def setUp(self):
        self.dept = Department.objects.create(name="Engineering", slug="engineering")
        self.user = User.objects.create_user(
            username="hr", password="pw", access_role=Role.objects.get(slug=CAREERS_HR)
        )
        self.client.force_login(self.user)

    def position(self, **kw):
        kw.setdefault("title", "Solar Engineer")
        kw.setdefault("slug", kw["title"].lower().replace(" ", "-"))
        kw.setdefault("department", self.dept)
        kw.setdefault("location", "Kochi")
        kw.setdefault("description", "Design rooftop systems.")
        return JobPosition.objects.create(**kw)


class DepartmentTests(CareersTestCase):
    def test_delete_is_refused_while_jobs_depend_on_it(self):
        self.position()
        resp = self.client.delete(f"/admin-api/departments/{self.dept.pk}/")
        self.assertEqual(resp.status_code, 400)
        self.assertIn("Deactivate", resp.json()["detail"])
        self.assertTrue(Department.objects.filter(pk=self.dept.pk).exists())

    def test_delete_works_once_empty_and_list_shows_job_counts(self):
        p = self.position(status=JobPosition.Status.PUBLISHED)
        row = self.client.get("/admin-api/departments/").json()["results"][0]
        self.assertEqual(row["job_count"], 1)
        self.assertEqual(row["open_job_count"], 1)
        p.delete()
        self.assertEqual(self.client.delete(f"/admin-api/departments/{self.dept.pk}/").status_code, 204)


class PositionWorkflowTests(CareersTestCase):
    def test_publish_refuses_an_incomplete_posting(self):
        p = self.position(description="")
        resp = self.client.post(f"/admin-api/job-positions/{p.pk}/publish/")
        self.assertEqual(resp.status_code, 400)
        self.assertIn("A job description is required.", resp.json()["errors"])

    def test_publish_refuses_an_inactive_department(self):
        self.dept.is_active = False
        self.dept.save()
        p = self.position()
        resp = self.client.post(f"/admin-api/job-positions/{p.pk}/publish/")
        self.assertEqual(resp.status_code, 400)
        self.assertTrue(any("inactive" in e for e in resp.json()["errors"]))

    def test_publish_close_and_archive(self):
        p = self.position()
        self.assertEqual(self.client.post(f"/admin-api/job-positions/{p.pk}/publish/").status_code, 200)
        p.refresh_from_db()
        self.assertEqual(p.status, JobPosition.Status.PUBLISHED)
        self.assertIsNotNone(p.published_at)

        self.assertEqual(self.client.post(f"/admin-api/job-positions/{p.pk}/close/").status_code, 200)
        p.refresh_from_db()
        self.assertEqual(p.status, JobPosition.Status.CLOSED)

        self.assertEqual(self.client.delete(f"/admin-api/job-positions/{p.pk}/").status_code, 204)
        p.refresh_from_db()
        self.assertEqual(p.status, JobPosition.Status.ARCHIVED)

    def test_list_filters(self):
        self.position(title="Solar Engineer", status=JobPosition.Status.PUBLISHED)
        self.position(title="Sales Lead", location="Remote", employment_type="contract")

        def ids(qs=""):
            return {r["title"] for r in self.client.get(f"/admin-api/job-positions/?{qs}").json()["results"]}

        self.assertEqual(ids("status=published"), {"Solar Engineer"})
        self.assertEqual(ids("employment_type=contract"), {"Sales Lead"})
        self.assertEqual(ids("location=remote"), {"Sales Lead"})
        self.assertEqual(ids("search=solar"), {"Solar Engineer"})

    def test_overview_counts(self):
        self.position(title="Open", status=JobPosition.Status.PUBLISHED)
        self.position(title="Draft")
        body = self.client.get("/admin-api/careers/overview/").json()
        self.assertEqual(body["counts"]["active_positions"], 1)
        self.assertEqual(body["counts"]["draft_positions"], 1)
        self.assertEqual([p["title"] for p in body["open_positions"]], ["Open"])


class PublicDeliveryTests(CareersTestCase):
    def setUp(self):
        super().setUp()
        self.client.logout()

    def test_list_serves_only_published_positions(self):
        self.position(title="Open", status=JobPosition.Status.PUBLISHED)
        self.position(title="Closed", status=JobPosition.Status.CLOSED)
        self.position(title="Draft")
        body = self.client.get("/api/job-positions").json()
        self.assertEqual([p["title"] for p in body["data"]], ["Open"])
        self.assertEqual([d["slug"] for d in body["meta"]["departments"]], ["engineering"])

    def test_detail_serves_published_and_closed_but_not_draft(self):
        self.position(title="Open", status=JobPosition.Status.PUBLISHED, responsibilities="a\n\nb\n")
        self.position(title="Closed", status=JobPosition.Status.CLOSED)
        self.position(title="Draft")

        open_ = self.client.get("/api/job-positions/open").json()["data"]
        self.assertTrue(open_["is_open"])
        self.assertEqual(open_["responsibilities"], ["a", "b"])

        closed = self.client.get("/api/job-positions/closed").json()["data"]
        self.assertFalse(closed["is_open"])

        self.assertEqual(self.client.get("/api/job-positions/draft").status_code, 404)

    def test_job_posting_schema_comes_from_the_record(self):
        p = self.position(status=JobPosition.Status.PUBLISHED, application_deadline=date(2026, 12, 31))
        p.published_at = p.created_at
        p.save()
        doc = job_posting(p, site_url="https://flarize.com", organisation="Flarize")
        self.assertEqual(doc["@type"], "JobPosting")
        self.assertEqual(doc["validThrough"], "2026-12-31")
        self.assertEqual(doc["url"], "https://flarize.com/career/solar-engineer")
        self.assertEqual(doc["hiringOrganization"]["name"], "Flarize")
        self.assertEqual(doc["occupationalCategory"], "Engineering")
