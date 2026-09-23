from django.db import models


def resume_upload_path(instance, filename):
    return f"job_applications/resumes/{filename}"


def portfolio_upload_path(instance, filename):
    return f"job_applications/portfolios/{filename}"


class JobApplication(models.Model):
    """A candidate application submitted from the public Careers page.

    Job postings live in the CMS service (``careers.JobPosition``), which has
    its own database — so there is no foreign key to the posting. Instead the
    application carries ``position_id`` plus a snapshot of the title and
    department it was submitted against. That is also what §6.14 asks for in
    its own words: the original submission is preserved even if the posting is
    later renamed, closed or archived. ``position`` (the free-text title) stays
    for the general-application form, which has no posting to point at.

    Status follows the §6.13 workflow. Records are never hard-deleted from the
    Studio: ``archived_at`` retires them (§6.13 — "records should not be
    silently deleted"), and every status change lands in the timeline.
    """

    class Status(models.TextChoices):
        NEW = "new", "New"
        REVIEWING = "reviewing", "Reviewing"
        INTERVIEW = "interview", "Interview"
        SELECTED = "selected", "Selected"
        REJECTED = "rejected", "Rejected"

    #: Which transitions the workflow allows. Anything not listed is refused,
    #: so a rejected candidate cannot silently become "new" again — reopening
    #: is deliberate: reject → reviewing.
    TRANSITIONS = {
        Status.NEW: (Status.REVIEWING, Status.REJECTED),
        Status.REVIEWING: (Status.INTERVIEW, Status.REJECTED, Status.NEW),
        Status.INTERVIEW: (Status.SELECTED, Status.REJECTED, Status.REVIEWING),
        Status.SELECTED: (Status.REJECTED,),
        Status.REJECTED: (Status.REVIEWING,),
    }

    EXPERIENCE_CHOICES = [
        ("0–1 years", "0–1 years"),
        ("1–3 years", "1–3 years"),
        ("3–5 years", "3–5 years"),
        ("5+ years", "5+ years"),
    ]

    SALARY_CHOICES = [
        ("Below ₹3 LPA", "Below ₹3 LPA"),
        ("₹3–5 LPA", "₹3–5 LPA"),
        ("₹5–8 LPA", "₹5–8 LPA"),
        ("₹8–12 LPA", "₹8–12 LPA"),
        ("₹12+ LPA", "₹12+ LPA"),
    ]

    NOTICE_PERIOD_CHOICES = [
        ("Immediate", "Immediate"),
        ("15 days", "15 days"),
        ("1 month", "1 month"),
        ("2 months", "2 months"),
        ("3 months", "3 months"),
    ]

    HEARD_ABOUT_CHOICES = [
        ("LinkedIn", "LinkedIn"),
        ("Job Portal", "Job Portal"),
        ("Referral", "Referral"),
        ("Company Website", "Company Website"),
        ("Social Media", "Social Media"),
        ("Other", "Other"),
    ]

    # Which opening this application is for. Free text so the general form can
    # submit "General application"; the CMS posting, when there is one, is
    # snapshotted alongside.
    position = models.CharField(max_length=200, default="General application")
    position_id = models.IntegerField(
        null=True, blank=True, db_index=True,
        help_text="careers.JobPosition id on the CMS service (no FK: different database)",
    )
    position_title = models.CharField(max_length=200, blank=True, default="", help_text="snapshot at submission")
    department_name = models.CharField(max_length=120, blank=True, default="", help_text="snapshot at submission")

    # ── Workflow (§6.13) ────────────────────────────────────────────────────
    status = models.CharField(max_length=12, choices=Status.choices, default=Status.NEW, db_index=True)
    status_changed_at = models.DateTimeField(null=True, blank=True)
    archived_at = models.DateTimeField(null=True, blank=True, db_index=True)

    # Personal information
    full_name = models.CharField(max_length=255)
    email = models.EmailField(max_length=254, db_index=True)
    phone = models.CharField(max_length=20, db_index=True)
    location = models.CharField(max_length=255)
    linkedin = models.URLField(max_length=300)
    portfolio_website = models.URLField(max_length=300, blank=True, default="")

    # Professional details (all optional)
    current_company = models.CharField(max_length=255, blank=True, default="")
    current_role = models.CharField(max_length=255, blank=True, default="")
    total_experience = models.CharField(
        max_length=32, choices=EXPERIENCE_CHOICES, blank=True, default=""
    )
    relevant_experience = models.CharField(
        max_length=32, choices=EXPERIENCE_CHOICES, blank=True, default=""
    )
    current_salary = models.CharField(
        max_length=32, choices=SALARY_CHOICES, blank=True, default=""
    )
    expected_salary = models.CharField(
        max_length=32, choices=SALARY_CHOICES, blank=True, default=""
    )
    notice_period = models.CharField(
        max_length=32, choices=NOTICE_PERIOD_CHOICES, blank=True, default=""
    )
    heard_about_us = models.CharField(
        max_length=32, choices=HEARD_ABOUT_CHOICES, blank=True, default=""
    )

    # General-application extras: the talent-pool form asks for these instead
    # of a posting.
    availability = models.CharField(max_length=32, blank=True, default="")
    cover_note = models.TextField(blank=True, default="", help_text="'Why Flarize?' answer")

    # Uploads
    resume = models.FileField(upload_to=resume_upload_path)
    portfolio_file = models.FileField(
        upload_to=portfolio_upload_path, blank=True, null=True
    )

    # Declaration checkbox on the form.
    declaration_accepted = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "job_application"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.full_name} - {self.position} ({self.phone})"

    @property
    def is_archived(self) -> bool:
        return self.archived_at is not None

    def can_transition(self, to_status: str) -> bool:
        return to_status in self.TRANSITIONS.get(self.status, ())

    @property
    def display_position(self) -> str:
        """The posting title if this answered one, else the free-text position."""
        return self.position_title or self.position

    def delete(self, *args, **kwargs):
        """Drop the uploaded files along with the row.

        Django deliberately leaves files behind on delete; for applications the
        Studio removes on purpose that just leaves unreachable resumes sitting
        in media. `save=False` because the row is about to disappear anyway.
        """
        for field in (self.resume, self.portfolio_file):
            if field:
                field.delete(save=False)
        return super().delete(*args, **kwargs)


class JobApplicationNote(models.Model):
    """An internal note from the hiring team (§6.14). Never shown to candidates.

    ``author`` is a username rather than a user FK: Studio users live in the
    CMS database and cannot be referenced from here, so the name travels in
    from the verified token and is stored as text.
    """

    application = models.ForeignKey(JobApplication, on_delete=models.CASCADE, related_name="notes")
    author = models.CharField(max_length=150, blank=True, default="")
    body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "job_application_note"
        ordering = ["-created_at"]

    def __str__(self):
        return f"note on #{self.application_id} by {self.author or 'unknown'}"


class JobApplicationEvent(models.Model):
    """One line of an application's timeline (§6.14).

    Written by the system on every meaningful change — received, status moved,
    assigned to a posting, archived, restored — so the detail view can show
    what happened to a candidate and when, without reconstructing it from
    updated_at fields.
    """

    class Kind(models.TextChoices):
        RECEIVED = "received", "Application received"
        STATUS = "status", "Status changed"
        ASSIGNED = "assigned", "Assigned to a position"
        ARCHIVED = "archived", "Archived"
        RESTORED = "restored", "Restored"
        NOTE = "note", "Note added"

    application = models.ForeignKey(JobApplication, on_delete=models.CASCADE, related_name="events")
    kind = models.CharField(max_length=12, choices=Kind.choices)
    from_status = models.CharField(max_length=12, blank=True, default="")
    to_status = models.CharField(max_length=12, blank=True, default="")
    detail = models.CharField(max_length=255, blank=True, default="")
    actor = models.CharField(max_length=150, blank=True, default="", help_text="Studio username, or blank for the system")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "job_application_event"
        ordering = ["-created_at", "-id"]

    def __str__(self):
        return f"{self.kind} on #{self.application_id}"
