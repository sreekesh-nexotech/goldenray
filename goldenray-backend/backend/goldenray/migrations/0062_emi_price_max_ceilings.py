"""Raise the price-slider ceilings to the agreed maximum system prices.

Migration 0060 seeded ``price_max`` at roughly default price + 20%. The
customer has since given the actual maximum a system of each size may be
priced at, so the slider now runs up to those figures. ``price_min`` is
untouched. Reversing restores the 0060 values.
"""

from django.db import migrations


# capacity_kw -> (previous ceiling from 0060, new ceiling)
PRICE_MAX = {
    "3.00": ("280000.00", "500000.00"),
    "5.00": ("400000.00", "650000.00"),
    "8.00": ("630000.00", "750000.00"),
    "10.00": ("720000.00", "900000.00"),
}


def raise_ceilings(apps, schema_editor):
    EmiSystemSize = apps.get_model("goldenray", "EmiSystemSize")
    for capacity, (_, new_max) in PRICE_MAX.items():
        EmiSystemSize.objects.filter(capacity_kw=capacity).update(price_max=new_max)


def restore_ceilings(apps, schema_editor):
    EmiSystemSize = apps.get_model("goldenray", "EmiSystemSize")
    for capacity, (old_max, _) in PRICE_MAX.items():
        EmiSystemSize.objects.filter(capacity_kw=capacity).update(price_max=old_max)


class Migration(migrations.Migration):
    dependencies = [
        ("goldenray", "0061_emi_down_payment_slider"),
    ]

    operations = [
        migrations.RunPython(raise_ceilings, restore_ceilings),
    ]
