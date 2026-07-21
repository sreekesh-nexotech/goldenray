from django.contrib.auth.models import AbstractUser
from django.db import models


class AdminUser(AbstractUser):
    """Internal authoring account.

    Roles (§7 of the plan):
      * admin  — manage collections/templates/catalog + entries + publish
      * editor — author + publish entries, no schema edits
      * author — draft only, no publish
    """

    class Role(models.TextChoices):
        ADMIN = "admin", "Admin"
        EDITOR = "editor", "Editor"
        AUTHOR = "author", "Author"

    role = models.CharField(max_length=16, choices=Role.choices, default=Role.AUTHOR)

    class Meta:
        db_table = "accounts_admin_user"

    def __str__(self):
        return f"{self.username} ({self.role})"

    # ── Capability helpers (used by permissions/services) ─────────────────────
    @property
    def can_edit_schema(self) -> bool:
        return self.is_superuser or self.role == self.Role.ADMIN

    @property
    def can_publish(self) -> bool:
        return self.is_superuser or self.role in (self.Role.ADMIN, self.Role.EDITOR)
