"""Every website form lands in the Studio.

* ``LeadCollectionHome`` becomes the single Enquiries inbox: ``source`` says
  which form, ``page`` where on the site, ``details`` the form's extra fields.
  The phone number stops being unique — a repeat enquiry is refused with a raw
  400 no longer, it is recorded like any other.
* ``JobApplication`` gains the two General Application fields that had no
  column, so that form can finally submit.
"""

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("goldenray", "0063_emi_down_payment_quick_adds"),
    ]

    operations = [
        migrations.AlterField(
            model_name="leadcollectionhome",
            name="phone_number",
            field=models.CharField(db_index=True, max_length=20),
        ),
        migrations.AddField(
            model_name="leadcollectionhome",
            name="source",
            field=models.CharField(
                choices=[
                    ("footer", "Footer — Ready to go solar"),
                    ("home_booking", "Book a consultation form"),
                    ("contact_page", "Contact Us page"),
                    ("group_purchase", "Group Purchase reservation"),
                    ("quotation", "Quotation request (calculator)"),
                    ("quote_request", "Quote request (advanced calculator)"),
                    ("referral_partner", "Referral partner application"),
                    ("warranty_service", "Warranty service request"),
                    ("other", "Website form"),
                ],
                db_index=True,
                default="other",
                max_length=32,
            ),
        ),
        migrations.AddField(
            model_name="leadcollectionhome",
            name="page",
            field=models.CharField(blank=True, default="", help_text="site path the form was submitted from", max_length=255),
        ),
        migrations.AddField(
            model_name="leadcollectionhome",
            name="details",
            field=models.JSONField(blank=True, default=dict),
        ),
        migrations.AddField(
            model_name="jobapplication",
            name="availability",
            field=models.CharField(blank=True, default="", max_length=32),
        ),
        migrations.AddField(
            model_name="jobapplication",
            name="cover_note",
            field=models.TextField(blank=True, default="", help_text="'Why Flarize?' answer"),
        ),
    ]
