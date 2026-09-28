from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator
from django.db import models

#: The design's stock photo, used when a testimonial has neither an upload nor a URL.
DEFAULT_TESTIMONIAL_PHOTO_URL = "https://golden-ray.b-cdn.net/quotation-v2/assets/a633cb1664c8569f.jpg"


class QuotationTestimonial(models.Model):
    """
    A customer testimonial for page 6 of the quotation document.

    Admin keeps the library here; the sales team picks which three a quotation
    shows (the BOM calculator), and the website's quotation shows the first
    three active ones. The card prints "name - location", "system_label |
    Installed on <month year>", the quote, and the monthly bill before and
    after solar with the saving (before − after).
    """

    name = models.CharField(max_length=80, help_text='e.g. "Jose V P".')
    location = models.CharField(max_length=80, help_text='e.g. "Vadakkal, Alappuzha".')
    system_label = models.CharField(max_length=40, default="5 kW System")
    installed_on = models.DateField(help_text="Only the month and year are printed.")
    quote = models.TextField(max_length=600)
    quote_ml = models.TextField(
        "Quote (Malayalam)", max_length=600, blank=True,
        help_text="Printed on Malayalam quotations; the English quote is used when blank.",
    )
    # An uploaded photo wins over the URL; with neither, the stock photo is used.
    photo = models.FileField(
        upload_to="quotation/testimonials/", blank=True,
        validators=[FileExtensionValidator(["png", "jpg", "jpeg", "webp"])],
    )
    photo_url = models.URLField(blank=True)
    bill_before = models.PositiveIntegerField("Monthly bill before solar (₹)", default=3200)
    bill_after = models.PositiveIntegerField("Monthly bill after solar (₹)", default=200)
    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0, help_text="Lower comes first.")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["sort_order", "id"]
        verbose_name = "Quotation testimonial"
        verbose_name_plural = "Quotation testimonials"

    def __str__(self):
        return f"{self.name} - {self.location}"

    def clean(self):
        if self.bill_after > self.bill_before:
            raise ValidationError({"bill_after": "The bill after solar cannot be higher than before."})
        if self.photo and self.photo.size > 2 * 1024 * 1024:
            raise ValidationError({"photo": "Photo must be 2 MB or smaller."})

    @property
    def monthly_saving(self):
        return max(0, self.bill_before - self.bill_after)
