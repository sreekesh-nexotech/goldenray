"""Seed the four Phase 1 role archetypes (§6.17).

Idempotent and non-destructive: a role is created if its slug is missing and
left completely alone if it already exists. Once the Roles screen owns a role,
a redeploy must not quietly hand permissions back that an admin deliberately
removed — so this only ever fills in what is absent.
"""

from django.db import migrations

from accounts import modules as mod


def seed_roles(apps, schema_editor):
    Role = apps.get_model("accounts", "Role")
    for order, definition in enumerate(mod.SEED_ROLES):
        Role.objects.get_or_create(
            slug=definition["slug"],
            defaults={
                "name": definition["name"],
                "description": definition["description"],
                "permissions": definition["permissions"],
                "legacy_role": definition["legacy_role"],
                "is_system": True,
                "sort_order": order,
            },
        )


def unseed_roles(apps, schema_editor):
    """Remove only seeded roles nobody is using — never orphan a live account."""
    Role = apps.get_model("accounts", "Role")
    slugs = [d["slug"] for d in mod.SEED_ROLES]
    Role.objects.filter(slug__in=slugs, is_system=True, users__isnull=True).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0002_role_adminuser_access_role"),
    ]

    operations = [
        migrations.RunPython(seed_roles, unseed_roles),
    ]
