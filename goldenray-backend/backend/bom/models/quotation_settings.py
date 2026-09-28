from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator
from django.db import models

DEFAULT_OFFER_IMAGE_URL = "https://golden-ray.b-cdn.net/icons/37.png"



class QuotationSettings(models.Model):
    """
    What the quotation document prints but the BOM does not decide — one row.

    EMI rates are deliberately not here: the quotation asks the EMI calculator
    (`/api/emi-calculator/quotation/`) so it applies exactly the Content
    Studio's EMI rules, the same as the /emi-calculator page.

    * The offer banner on the summary page. It is printed only while it is
      switched on, has a title and today falls inside its dates; otherwise the
      document drops the section entirely.

    Defaults reproduce what the document printed before this was configurable.
    """

    offer_enabled = models.BooleanField("Show offer", default=True)
    offer_title = models.CharField(max_length=150, blank=True, default="Priority 10-Day Installation")
    offer_description = models.CharField(
        max_length=300, blank=True, default="Fast-tracked scheduling and execution",
    )
    offer_details = models.CharField(max_length=300, blank=True, default="")
    # Malayalam quotations fall back to the English text when these are blank.
    offer_title_ml = models.CharField(
        "Offer title (Malayalam)", max_length=150, blank=True,
        default="10 ദിവസത്തിനുള്ളിൽ മുൻഗണനാ ഇൻസ്റ്റലേഷൻ",
    )
    offer_description_ml = models.CharField(
        "Offer description (Malayalam)", max_length=300, blank=True,
        default="വേഗത്തിലുള്ള ഷെഡ്യൂളിംഗും ഇൻസ്റ്റലേഷനും",
    )
    offer_details_ml = models.CharField("Offer details (Malayalam)", max_length=300, blank=True, default="")
    offer_valid_from = models.DateField(null=True, blank=True)
    # Blank means the offer runs as long as the quotation itself is valid.
    offer_valid_until = models.DateField(null=True, blank=True)
    # An uploaded image wins over the URL.
    offer_image = models.FileField(
        upload_to="quotation/offers/", blank=True,
        validators=[FileExtensionValidator(["png", "jpg", "jpeg", "webp"])],
    )
    offer_image_url = models.URLField(blank=True, default=DEFAULT_OFFER_IMAGE_URL)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Quotation Settings"
        verbose_name_plural = "Quotation Settings"

    def __str__(self):
        return "Quotation Settings"

    def clean(self):
        if (
            self.offer_valid_from and self.offer_valid_until
            and self.offer_valid_from > self.offer_valid_until
        ):
            raise ValidationError({"offer_valid_until": "The offer ends before it starts."})
        if self.offer_image and self.offer_image.size > 2 * 1024 * 1024:
            raise ValidationError({"offer_image": "Image must be 2 MB or smaller."})

    def save(self, *args, **kwargs):
        # Singleton: there is only ever row 1.
        self.pk = 1
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        # Deleting would silently reset every quotation to the defaults.
        pass

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj

    def offer_is_active(self, today):
        if not self.offer_enabled or not self.offer_title.strip():
            return False
        if self.offer_valid_from and self.offer_valid_from > today:
            return False
        if self.offer_valid_until and self.offer_valid_until < today:
            return False
        return True
