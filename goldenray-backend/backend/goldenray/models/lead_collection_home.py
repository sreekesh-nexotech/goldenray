from django.db import models


class LeadCollectionHome(models.Model):
    """One enquiry from any of the site's contact-type forms.

    This is the single inbox the Studio's Enquiries screen reads, so every
    form that captures a customer's name and number lands here — the ones with
    their own table (referral applications, warranty requests, OTP quote
    requests) are mirrored in by ``record_lead``. ``source`` says which form it
    came from and ``details`` holds whatever extra fields that form collects.

    A phone number is deliberately *not* unique: a returning customer's second
    enquiry is a new enquiry, and refusing it used to surface as a raw
    "HTTP error 400" on the footer form.
    """

    class Source(models.TextChoices):
        FOOTER = "footer", "Footer — Ready to go solar"
        HOME = "home_booking", "Book a consultation form"
        CONTACT = "contact_page", "Contact Us page"
        GROUP_PURCHASE = "group_purchase", "Group Purchase reservation"
        QUOTATION = "quotation", "Quotation request (calculator)"
        QUOTE_OTP = "quote_request", "Quote request (advanced calculator)"
        REFERRAL = "referral_partner", "Referral partner application"
        WARRANTY = "warranty_service", "Warranty service request"
        OTHER = "other", "Website form"

    name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20, db_index=True)
    source = models.CharField(
        max_length=32, choices=Source.choices, default=Source.OTHER, db_index=True
    )
    page = models.CharField(
        max_length=255, blank=True, default="", help_text="site path the form was submitted from"
    )
    details = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'lead_collection_home'

    def __str__(self):
        return f"{self.name} - {self.phone_number}"


def record_lead(*, name, phone_number, source, page="", details=None):
    """Mirror a submission from another form into the Enquiries inbox.

    Never lets a failure here break the form that called it — the caller's own
    record is already saved, and the customer must still see success.
    """
    try:
        return LeadCollectionHome.objects.create(
            name=(name or "").strip()[:255] or "—",
            phone_number=(phone_number or "").strip()[:20],
            source=source,
            page=(page or "")[:255],
            details={k: v for k, v in (details or {}).items() if v not in (None, "")},
        )
    except Exception:  # pragma: no cover - defensive
        return None
