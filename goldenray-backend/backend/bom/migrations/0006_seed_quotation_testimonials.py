"""Seed the three testimonials page 6 printed before it read from here.

Same names, places, install months, quotes (English and Malayalam) and bills
(₹3,200 → ₹200) as the hard-coded design, with the design's stock photo — so
the page looks as it did until admin edits them. Only runs into an empty table.
"""

from datetime import date

from django.db import migrations

SEED = [
    {
        "name": "Jose V P",
        "location": "Vadakkal, Alappuzha",
        "installed_on": date.fromisoformat("2025-06-01"),
        "quote": "The solar panel installation process was smooth from the very beginning. The team clearly explained each stage—from understanding our energy needs to system design, installation, and final activation. All timelines were communicated in advance, and the execution stayed on track without unnecessary delays. The overall experience felt well-planned and dependable.",
        "quote_ml": "തുടക്കം മുതൽ അവസാനം വരെ മുഴുവൻ പ്രക്രിയയും വളരെ സുഗമമായിരുന്നു. ഞങ്ങളുടെ ആവശ്യങ്ങൾ മനസ്സിലാക്കി ശരിയായ സിസ്റ്റം നിർദേശിക്കുകയും എല്ലാ കാര്യങ്ങളും സമയബന്ധിതമായി പൂർത്തിയാക്കുകയും ചെയ്തു. ടീമിന്റെ സമീപനവും സേവനവും വളരെ മികച്ചതായിരുന്നു.",
        "sort_order": 1,
    },
    {
        "name": "Siraj K P",
        "location": "Cherthala, Alappuzha",
        "installed_on": date.fromisoformat("2025-03-01"),
        "quote": "Our commercial solar installation brought better predictability to our monthly power expenses. The team maintained transparent communication throughout the project and handled the technical and approval processes professionally. The transition to solar was structured, efficient, and free from operational disruption, which made the decision feel reassuring.",
        "quote_ml": "സോളാർ സ്ഥാപിച്ചതോടെ ഞങ്ങളുടെ വൈദ്യുതി ചെലവുകൾ കൂടുതൽ നിയന്ത്രണവിധേയമായി. എല്ലാ ഘട്ടങ്ങളിലും വ്യക്തമായ വിവരങ്ങൾ ലഭിച്ചു. KSEB നടപടികളും സാങ്കേതിക കാര്യങ്ങളും ടീം വളരെ പ്രൊഫഷണലായി കൈകാര്യം ചെയ്തു.",
        "sort_order": 2,
    },
    {
        "name": "Stephen V C",
        "location": "Vattayal, Alappuzha",
        "installed_on": date.fromisoformat("2024-05-01"),
        "quote": "What stood out most was the honest guidance we received on system capacity and realistic expectations around savings. The team took time to explain what would work best for our usage rather than overselling. From planning to completion, the project felt reliable, transparent, and well managed.",
        "quote_ml": "വിൽപ്പനയ്ക്കായി അധിക വാഗ്ദാനങ്ങൾ നൽകാതെ, ഞങ്ങൾക്ക് യഥാർത്ഥത്തിൽ അനുയോജ്യമായ സിസ്റ്റം നിർദേശിച്ചതാണ് ഏറ്റവും ഇഷ്ടപ്പെട്ടത്. പ്ലാനിംഗ് മുതൽ ഇൻസ്റ്റലേഷൻ വരെ മുഴുവൻ പ്രക്രിയയും സുതാര്യവും വിശ്വസ്തതയുള്ളതുമായിരുന്നു.",
        "sort_order": 3,
    },
]


def seed(apps, schema_editor):
    QuotationTestimonial = apps.get_model("bom", "QuotationTestimonial")
    if QuotationTestimonial.objects.exists():
        return
    for row in SEED:
        QuotationTestimonial.objects.create(system_label="5 kW System", bill_before=3200, bill_after=200, **row)


def unseed(apps, schema_editor):
    QuotationTestimonial = apps.get_model("bom", "QuotationTestimonial")
    QuotationTestimonial.objects.filter(name__in=[r["name"] for r in SEED], photo="").delete()


class Migration(migrations.Migration):

    dependencies = [
        ("bom", "0005_quotation_testimonial"),
    ]

    operations = [migrations.RunPython(seed, unseed)]
