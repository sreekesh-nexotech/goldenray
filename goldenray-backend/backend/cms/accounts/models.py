from django.contrib.auth.models import AbstractUser
from django.db import models

from . import modules as mod


class Role(models.Model):
    """A named grant of module/action permissions (§6.17).

    Phase 1 needs four archetypes — Super Admin, Content Manager, Career/HR,
    Sales/Lead — that the legacy three-value ``AdminUser.role`` enum cannot
    express, because they differ by *which modules* they reach rather than by
    how much authority they carry overall. ``permissions`` holds the matrix as
    ``{module_key: [action, ...]}``, normalised against ``accounts.modules`` on
    every save so a stored grant can never name a module or action the checker
    would not honour.

    ``legacy_role`` is what lands in the JWT ``role`` claim. The goldenray
    backend authorises Studio users by reading that claim with a shared signing
    key and has no access to this table, so every role has to map onto one of
    the three values that service already understands.

    System roles (``is_system``) are the seeded archetypes: they can be edited
    but not deleted, so an admin cannot lock everybody out of the Studio by
    removing the role their own account depends on.
    """

    name = models.CharField(max_length=80, unique=True)
    slug = models.SlugField(max_length=80, unique=True, help_text="stable key, e.g. 'content-manager'")
    description = models.TextField(blank=True)
    permissions = models.JSONField(
        default=dict,
        blank=True,
        help_text='{"faqs": ["view", "create", "edit"], ...}',
    )
    legacy_role = models.CharField(
        max_length=16,
        choices=(("admin", "Admin"), ("editor", "Editor"), ("author", "Author")),
        default="author",
        help_text="value sent in the JWT 'role' claim for the goldenray backend",
    )
    is_system = models.BooleanField(default=False, help_text="seeded archetype; editable but not deletable")
    sort_order = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "accounts_role"
        ordering = ["sort_order", "name"]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        self.permissions = mod.normalise(self.permissions)
        super().save(*args, **kwargs)
        # ``AdminUser.role`` is derived from this value on the *user's* save, so
        # a role whose legacy mapping changes would leave every current holder
        # carrying the old claim until each account happened to be re-saved.
        # Push it down here so the token claim moves with the grant.
        self.users.exclude(role=self.legacy_role).update(role=self.legacy_role)

    def allows(self, module: str, action: str) -> bool:
        return action in (self.permissions or {}).get(module, ())

    @property
    def module_count(self) -> int:
        """Modules this role can reach at all — the Roles list's summary column."""
        return len(self.permissions or {})


class AdminUser(AbstractUser):
    """Internal authoring account.

    Two role systems live here on purpose.

    ``role`` is the original coarse enum. It still drives the JWT claim the
    goldenray backend reads, and it is the fallback for accounts created before
    the Phase 1 matrix existed:

      * admin  — manage collections/templates/catalog + entries + publish
      * editor — author + publish entries, no schema edits
      * author — draft only, no publish

    ``access_role`` is the Phase 1 grant (§6.17). When set it is authoritative
    for every module check; ``role`` is then derived from it on save so the two
    can never drift and hand a user more authority through the token than the
    Studio itself would give them.
    """

    class Role(models.TextChoices):
        ADMIN = "admin", "Admin"
        EDITOR = "editor", "Editor"
        AUTHOR = "author", "Author"

    role = models.CharField(max_length=16, choices=Role.choices, default=Role.AUTHOR)
    # String reference, not the class: inside this body the name ``Role`` is the
    # TextChoices enum above, so the model has to be named through the registry.
    access_role = models.ForeignKey(
        "accounts.Role",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="users",
        help_text="Phase 1 permission matrix; overrides the legacy role when set",
    )

    class Meta:
        db_table = "accounts_admin_user"

    def __str__(self):
        return f"{self.username} ({self.role})"

    def save(self, *args, **kwargs):
        # Keep the token claim in step with the granted role. Without this a
        # Sales/Lead user could still hold an "editor" claim from before the
        # grant changed and keep write access to EMI pricing on the other
        # service, which has no way to know the grant moved.
        if self.access_role_id and self.access_role.legacy_role:
            self.role = self.access_role.legacy_role
        super().save(*args, **kwargs)

    # ── Legacy capability helpers (still used by the entry/schema gates) ──────
    @property
    def can_edit_schema(self) -> bool:
        return self.is_superuser or self.role == self.Role.ADMIN

    @property
    def can_publish(self) -> bool:
        return self.is_superuser or self.role in (self.Role.ADMIN, self.Role.EDITOR)

    # ── Phase 1 module matrix ────────────────────────────────────────────────
    def permission_map(self) -> dict:
        """Effective ``{module: [actions]}`` for this user.

        Superusers get everything. A user with a granted role gets exactly that
        grant. Everyone else falls back to a map derived from the legacy enum,
        so accounts predating the matrix keep working with the authority they
        already had rather than losing access on the day this ships.
        """
        if self.is_superuser:
            return mod.full_access()
        if self.access_role_id:
            return dict(self.access_role.permissions or {})
        return self._legacy_permission_map()

    def _legacy_permission_map(self) -> dict:
        """Best-effort matrix for an account that has no granted role yet."""
        if self.role == self.Role.ADMIN:
            return mod.full_access()
        if self.role == self.Role.EDITOR:
            # Everything a Content Manager reaches, plus the careers desk —
            # matching what an editor could already do before the split.
            return {
                **mod.grant([mod.Module.DASHBOARD]),
                **mod.grant([mod.Module.PAGES], [mod.Action.VIEW, mod.Action.EDIT]),
                **mod.grant([mod.Module.BLOGS, mod.Module.FAQS]),
                **mod.grant([mod.Module.MEDIA, mod.Module.SEO]),
                **mod.grant([mod.Module.LEADS, mod.Module.EMI]),
                **mod.grant(
                    [
                        mod.Module.CAREERS,
                        mod.Module.JOB_POSITIONS,
                        mod.Module.APPLICATIONS,
                        mod.Module.DEPARTMENTS,
                    ]
                ),
                **mod.grant([mod.Module.CAREER_PAGE], [mod.Action.VIEW, mod.Action.EDIT]),
            }
        # Author: draft-only authoring, no publish anywhere.
        return {
            **mod.grant([mod.Module.DASHBOARD]),
            **mod.grant(
                [mod.Module.BLOGS, mod.Module.FAQS],
                [mod.Action.VIEW, mod.Action.CREATE, mod.Action.EDIT],
            ),
            **mod.grant([mod.Module.MEDIA], [mod.Action.VIEW, mod.Action.CREATE]),
            **mod.grant([mod.Module.SEO], [mod.Action.VIEW, mod.Action.EDIT]),
        }

    def can(self, module: str, action: str = mod.Action.VIEW) -> bool:
        """Does this user hold ``action`` on ``module``?"""
        if self.is_superuser:
            return action in mod.ALLOWED_ACTIONS.get(module, ())
        return action in self.permission_map().get(module, ())
