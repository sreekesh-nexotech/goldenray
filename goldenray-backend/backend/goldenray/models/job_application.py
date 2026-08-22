from django.db import models


def resume_upload_path(instance, filename):
    return f"job_applications/resumes/{filename}"


def portfolio_upload_path(instance, filename):
    return f"job_applications/portfolios/{filename}"


class JobApplication(models.Model):
    """A candidate application submitted from the public Careers page.

    Currently only the "UI/UX Designer" position is open, but the model keeps a
    `position` field so the same endpoint can serve future openings.
    """

    POSITION_CHOICES = [
        ("UI/UX Designer", "UI/UX Designer"),
    ]

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

    # Which opening this application is for.
    position = models.CharField(
        max_length=64, choices=POSITION_CHOICES, default="UI/UX Designer"
    )

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
