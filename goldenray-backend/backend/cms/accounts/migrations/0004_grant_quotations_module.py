"""Grant the new Quotations module to the roles that should have it.

0003 seeds roles only when they are missing, so the Super Admin and Sales /
Lead rows that already exist would never see a module added after them. This
adds `quotations: ["view"]` to those two system roles, and only to them — any
other role (or a system role an admin has since edited to drop it) is left for
the Roles screen to decide.
"""

from django.db import migrations

GRANT_TO = ("super-admin", "sales-lead")


def grant(apps, schema_editor):
    Role = apps.get_model("accounts", "Role")
    for role in Role.objects.filter(slug__in=GRANT_TO, is_system=True):
        permissions = dict(role.permissions or {})
        if "quotations" not in permissions:
            permissions["quotations"] = ["view"]
            role.permissions = permissions
            role.save(update_fields=["permissions"])


def revoke(apps, schema_editor):
    Role = apps.get_model("accounts", "Role")
    for role in Role.objects.filter(slug__in=GRANT_TO, is_system=True):
        permissions = dict(role.permissions or {})
        if permissions.pop("quotations", None) is not None:
            role.permissions = permissions
            role.save(update_fields=["permissions"])


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0003_seed_system_roles"),
    ]

    operations = [migrations.RunPython(grant, revoke)]
