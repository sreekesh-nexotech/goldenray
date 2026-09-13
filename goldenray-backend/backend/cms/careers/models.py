"""Careers: departments and job positions (§6.11, §6.12, §6.15).

Today the public Open Positions list is a static frontend data file and the
application form's ``position`` is a hard-coded choice with one value in it.
Every job change is a code change, and an application cannot be tied to the
posting it answered. These two models are what replace that.

They live in the CMS rather than the goldenray backend because the Studio is
authenticated against the CMS and §7 requires one login and one permission
system. The consequence is that ``JobApplication`` — which stays in the
goldenray database with the rest of the lead data — cannot hold a foreign key
to ``JobPosition``. It carries the position's id plus a snapshot of its title
and department instead, which is also what §6.14 asks for on its own terms:
"preserve the original submission while linking it to the selected job". A
snapshot survives the posting being renamed or archived; a join would not.
"""

from django.conf import settings
from django.db import models

from seo.models import SeoFields


class Department(models.Model):
    """A hiring department (§6.15)."""

    name = models.CharField(max_length=120, unique=True)
    slug = models.SlugField(max_length=120, unique=True)
    description = models.TextField(blank=True, help_text="short description shown on the careers page")
    is_active = models.BooleanField(default=True)
    sort_order = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "careers_department"
        ordering = ["sort_order", "name"]

    def __str__(self):
        return self.name

    # These are properties rather than queryset annotations on purpose: an
    # annotation aliased to the same name cannot be assigned onto the instance
    # (a property with no setter raises AttributeError), which turns any
    # annotated read into a 500. The list view prefetches ``positions`` instead,
    # so ``.all()`` is served from cache and these cost no extra queries.
    @property
    def job_count(self) -> int:
        """Positions attached to this department, archived ones included.

        §6.15 asks the list to show how many jobs depend on a department, and
        that count is what blocks deletion — so it has to count every dependant,
        not just the ones currently open.
        """
        return len(self.positions.all())

    @property
    def open_job_count(self) -> int:
        return sum(1 for p in self.positions.all() if p.status == JobPosition.Status.PUBLISHED)


class JobPosition(SeoFields):
    """One job posting (§6.11, §6.12).

    ``status`` is what the public site filters on: §6.11 requires that only
    active jobs appear in Open Positions, so the delivery API serves
    ``PUBLISHED`` alone and unpublishing a role removes it from the site without
    touching the applications already attached to it.
    """

    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        PUBLISHED = "published", "Published"
        CLOSED = "closed", "Closed"
        ARCHIVED = "archived", "Archived"

    class EmploymentType(models.TextChoices):
        FULL_TIME = "full_time", "Full-time"
        PART_TIME = "part_time", "Part-time"
        CONTRACT = "contract", "Contract"
        INTERNSHIP = "internship", "Internship"
        TEMPORARY = "temporary", "Temporary"

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, help_text="public URL: /career/<slug>")
    department = models.ForeignKey(
        Department,
        on_delete=models.PROTECT,  # §6.15: a department with jobs cannot be deleted
        related_name="positions",
    )
    location = models.CharField(max_length=160)
    employment_type = models.CharField(
        max_length=16, choices=EmploymentType.choices, default=EmploymentType.FULL_TIME
    )
    experience_required = models.CharField(
        max_length=120, blank=True, help_text="e.g. '2–4 years'"
    )

    description = models.TextField(blank=True)
    responsibilities = models.TextField(blank=True, help_text="one per line")
    requirements = models.TextField(blank=True, help_text="one per line")
    benefits = models.TextField(blank=True, help_text="one per line; omit if the design has no benefits block")
    application_instructions = models.TextField(blank=True)
    application_deadline = models.DateField(null=True, blank=True)

    status = models.CharField(max_length=12, choices=Status.choices, default=Status.DRAFT)
    sort_order = models.IntegerField(default=0)

    published_at = models.DateTimeField(null=True, blank=True)
    closed_at = models.DateTimeField(null=True, blank=True)

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="+"
    )
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="+"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "careers_job_position"
        ordering = ["sort_order", "-published_at", "-created_at"]
        indexes = [
            models.Index(fields=["status", "sort_order"]),
            models.Index(fields=["department", "status"]),
        ]

    def __str__(self):
        return f"{self.title} [{self.status}]"

    @property
    def is_open(self) -> bool:
        return self.status == self.Status.PUBLISHED

    # ── SEO hooks ────────────────────────────────────────────────────────────
    def seo_fallback_title(self) -> str:
        return self.title

    def seo_path(self) -> str:
        return f"/career/{self.slug}"

    # ── Publish validation (§6.12 — preview and publish gates) ───────────────
    def publish_errors(self) -> list[str]:
        errors = []
        if not (self.title or "").strip():
            errors.append("A job title is required.")
        if not self.department_id:
            errors.append("Choose a department.")
        elif not self.department.is_active:
            errors.append(f"'{self.department.name}' is inactive — reactivate it or pick another department.")
        if not (self.location or "").strip():
            errors.append("A location is required.")
        if not (self.description or "").strip():
            errors.append("A job description is required.")
        return errors
