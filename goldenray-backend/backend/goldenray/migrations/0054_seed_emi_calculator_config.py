"""Seed the EMI calculator configuration from the values already in use.

Nothing here is a new business decision — it is a transcription so the
calculator keeps working the moment this ships, with the Studio taking over
from the hard-coded frontend arrays:

  * price_per_kw   — the `per_kw_rate` on the Residential SolarInstallationNew
                     rows (migrations 0015/0019), which is what the API has
                     been pricing from.
  * monthly_bill_reference — the matching `bill_range` on those rows.
  * subsidy        — the ₹78,000 PM Surya Ghar figure used everywhere.
  * interest rules — the policy previously hard-coded in the EMI view: 3kW
                     locked at 5.75%, larger systems floored at 8%.
  * banks          — transcribed from frontend BankRates.tsx.

The team is expected to correct these through the Studio; the migration only
creates rows that do not already exist, so re-running it never clobbers edits.
"""

from django.db import migrations


SYSTEM_SIZES = [
    # label, capacity, price/kW, reference monthly bill, sort
    ("3kW", "3.00", "76667.00", "6000.00", 1),
    ("5kW", "5.00", "66000.00", "10000.00", 2),
    ("8kW", "8.00", "65625.00", "15500.00", 3),
    ("10kW", "10.00", "60000.00", "20000.00", 4),
]

SUBSIDY_RULES = [
    # label, min_kw, max_kw, amount, priority
    ("PM Surya Ghar — 1kW", "1.00", "1.99", "30000.00", 10),
    ("PM Surya Ghar — 2kW", "2.00", "2.99", "60000.00", 10),
    ("PM Surya Ghar — 3kW and above", "3.00", None, "78000.00", 10),
]

INTEREST_RULES = [
    # label, min_kw, max_kw, rate, min_rate, locked, priority
    ("Up to 3kW — Flarize/SBI PM Surya Ghar (fixed)", None, "3.00", "5.75", "5.75", True, 20),
    ("Above 3kW — floor 8%", "3.01", None, "8.00", "8.00", False, 20),
]

BANKS = [
    {
        "slug": "sbi",
        "name": "State Bank of India",
        "abbr": "SBI",
        "logo_bg": "#1D4ED8",
        "interest_rate": "5.65",
        "min_loan": "0.00",
        "max_loan": "600000.00",
        "upfront_requirement": "No collateral up to ₹2L",
        "eligibility": "No income proof for 3kW",
        "cibil_required": 0,
        "processing_fee_percent": "0.00",
        "processing_fee_note": "Zero processing fee",
        "approval_min_days": 5,
        "approval_max_days": 7,
        "max_tenure_years": 10,
        "features": [
            "Up to ₹2L at 5.65% (Flarize rate)",
            "Up to ₹6L at 7.00%",
            "5–7 days approval",
            "Zero processing fee",
            "No collateral up to ₹2L",
            "No income proof for 3kW",
        ],
        "best_for": "Most Kerala homeowners — 3kW, first-time solar buyers",
        "is_recommended": True,
        "sort_order": 1,
    },
    {
        "slug": "federal",
        "name": "Federal Bank",
        "abbr": "FED",
        "logo_bg": "#374151",
        "interest_rate": "8.50",
        "min_loan": "0.00",
        "max_loan": "500000.00",
        "upfront_requirement": "",
        "eligibility": "CIBIL 700+ required",
        "cibil_required": 700,
        "processing_fee_percent": "0.50",
        "processing_fee_note": "",
        "approval_min_days": 3,
        "approval_max_days": 5,
        "max_tenure_years": 7,
        "features": [
            "Up to ₹5L loan amount",
            "3–5 days approval (fastest)",
            "0.5% processing fee",
            "CIBIL 700+ required",
            "Tenure up to 7 years",
        ],
        "best_for": "Buyers who need fastest approval",
        "is_recommended": False,
        "sort_order": 2,
    },
    {
        "slug": "union",
        "name": "Union Bank of India",
        "abbr": "UBI",
        "logo_bg": "#7C3AED",
        "interest_rate": "7.90",
        "min_loan": "0.00",
        "max_loan": "600000.00",
        "upfront_requirement": "",
        "eligibility": "CIBIL 650+ required",
        "cibil_required": 650,
        "processing_fee_percent": "0.10",
        "processing_fee_note": "₹500 flat",
        "approval_min_days": 5,
        "approval_max_days": 7,
        "max_tenure_years": 10,
        "features": [
            "Up to ₹6L loan amount",
            "5–7 days approval",
            "₹500 flat processing fee",
            "CIBIL 650+ required",
            "Tenure up to 10 years",
        ],
        "best_for": "5kW–10kW systems needing larger loans",
        "is_recommended": False,
        "sort_order": 3,
    },
    {
        "slug": "canara",
        "name": "Canara Bank",
        "abbr": "CAN",
        "logo_bg": "#065F46",
        "interest_rate": "8.25",
        "min_loan": "0.00",
        "max_loan": "600000.00",
        "upfront_requirement": "",
        "eligibility": "CIBIL 650+ required",
        "cibil_required": 650,
        "processing_fee_percent": "0.25",
        "processing_fee_note": "",
        "approval_min_days": 7,
        "approval_max_days": 10,
        "max_tenure_years": 7,
        "features": [
            "Up to ₹6L loan amount",
            "7–10 days approval",
            "0.25% processing fee",
            "CIBIL 650+ required",
            "Tenure up to 7 years",
        ],
        "best_for": "Buyers prioritising lower upfront costs",
        "is_recommended": False,
        "sort_order": 4,
    },
]


def seed(apps, schema_editor):
    EmiSystemSize = apps.get_model("goldenray", "EmiSystemSize")
    EmiSubsidyRule = apps.get_model("goldenray", "EmiSubsidyRule")
    EmiInterestRateRule = apps.get_model("goldenray", "EmiInterestRateRule")
    EmiCalculatorSettings = apps.get_model("goldenray", "EmiCalculatorSettings")
    EmiBank = apps.get_model("goldenray", "EmiBank")

    for label, capacity, price, bill, order in SYSTEM_SIZES:
        EmiSystemSize.objects.get_or_create(
            capacity_kw=capacity,
            defaults={
                "label": label,
                "price_per_kw": price,
                "monthly_bill_reference": bill,
                "sort_order": order,
                "is_active": True,
            },
        )

    for label, min_kw, max_kw, amount, priority in SUBSIDY_RULES:
        EmiSubsidyRule.objects.get_or_create(
            label=label,
            defaults={
                "min_kw": min_kw,
                "max_kw": max_kw,
                "amount": amount,
                "priority": priority,
                "is_active": True,
            },
        )

    for label, min_kw, max_kw, rate, min_rate, locked, priority in INTEREST_RULES:
        EmiInterestRateRule.objects.get_or_create(
            label=label,
            defaults={
                "min_kw": min_kw,
                "max_kw": max_kw,
                "rate": rate,
                "min_rate": min_rate,
                "is_locked": locked,
                "priority": priority,
                "is_active": True,
            },
        )

    # Singleton settings row — model defaults already encode the agreed policy
    # (90% after subsidy, 1–10 year tenure, EMI ÷ 30).
    EmiCalculatorSettings.objects.get_or_create(pk=1)

    for bank in BANKS:
        EmiBank.objects.get_or_create(slug=bank["slug"], defaults=bank)


def unseed(apps, schema_editor):
    EmiSystemSize = apps.get_model("goldenray", "EmiSystemSize")
    EmiSubsidyRule = apps.get_model("goldenray", "EmiSubsidyRule")
    EmiInterestRateRule = apps.get_model("goldenray", "EmiInterestRateRule")
    EmiBank = apps.get_model("goldenray", "EmiBank")

    EmiSystemSize.objects.filter(
        capacity_kw__in=[c for _, c, _, _, _ in SYSTEM_SIZES]
    ).delete()
    EmiSubsidyRule.objects.filter(label__in=[r[0] for r in SUBSIDY_RULES]).delete()
    EmiInterestRateRule.objects.filter(label__in=[r[0] for r in INTEREST_RULES]).delete()
    EmiBank.objects.filter(slug__in=[b["slug"] for b in BANKS]).delete()


class Migration(migrations.Migration):
    dependencies = [
        ("goldenray", "0053_emibank_emicalculatorsettings_emiinterestraterule_and_more"),
    ]

    operations = [
        migrations.RunPython(seed, unseed),
    ]
