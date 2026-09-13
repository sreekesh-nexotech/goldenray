"""The Phase 1 module/action registry — the vocabulary the permission matrix speaks.

§6.17 of the Phase 1 scope asks for role-based *module* access with per-module
*actions* (View, Create, Edit, Publish, Verify, Archive, Manage), and for four
role archetypes to be expressible against it. The legacy three-role enum on
``AdminUser`` (admin/editor/author) cannot say "this person maintains FAQs but
must never touch leads", so the matrix below is what the Studio actually gates
on from Phase 1 onwards.

Two rules keep this file the single source of truth:

  * ``MODULES`` is the closed set of grantable modules. A screen that is not
    listed here cannot be granted, which is what keeps Comparison, Quotation
    Analyzer and Group Purchasing (all Phase 2) out of Phase 1 by construction
    rather than by remembering to hide them.
  * ``ALLOWED_ACTIONS`` narrows the seven actions per module. "Publish" is
    meaningless on Leads and "Verify" is meaningless on Settings, so granting
    them is a configuration error the serializer rejects rather than a silently
    dead permission row.

The legacy ``AdminUser.role`` field stays: the goldenray backend authorises
Studio tokens by reading the ``role`` claim with a shared signing key
(``goldenray/utils/studio_auth.py``), so it remains the cross-service contract.
The matrix is additive on top of it.
"""

from __future__ import annotations


# ── Actions ───────────────────────────────────────────────────────────────────
class Action:
    """The seven action verbs from §6.17, in escalating order of authority."""

    VIEW = "view"
    CREATE = "create"
    EDIT = "edit"
    PUBLISH = "publish"
    VERIFY = "verify"
    ARCHIVE = "archive"
    MANAGE = "manage"


ALL_ACTIONS = (
    Action.VIEW,
    Action.CREATE,
    Action.EDIT,
    Action.PUBLISH,
    Action.VERIFY,
    Action.ARCHIVE,
    Action.MANAGE,
)

ACTION_LABELS = {
    Action.VIEW: "View",
    Action.CREATE: "Create",
    Action.EDIT: "Edit",
    Action.PUBLISH: "Publish",
    Action.VERIFY: "Verify",
    Action.ARCHIVE: "Archive",
    Action.MANAGE: "Manage",
}


# ── Modules ───────────────────────────────────────────────────────────────────
class Module:
    """Module keys, grouped as the Phase 1 sidebar groups them (§4)."""

    DASHBOARD = "dashboard"

    # WEBSITE
    PAGES = "pages"
    BLOGS = "blogs"
    FAQS = "faqs"
    MEDIA = "media"
    SEO = "seo"

    # BUSINESS
    LEADS = "leads"
    EMI = "emi"

    # CAREERS
    CAREERS = "careers"
    JOB_POSITIONS = "job_positions"
    APPLICATIONS = "applications"
    DEPARTMENTS = "departments"
    CAREER_PAGE = "career_page"

    # ADMINISTRATION
    USERS = "users"
    ROLES = "roles"
    SETTINGS = "settings"


#: Sidebar group → ordered modules. The Studio renders its navigation from this,
#: so a module absent here is unreachable in the UI as well as ungrantable.
MODULE_GROUPS = (
    ("", (Module.DASHBOARD,)),
    ("WEBSITE", (Module.PAGES, Module.BLOGS, Module.FAQS, Module.MEDIA, Module.SEO)),
    ("BUSINESS", (Module.LEADS, Module.EMI)),
    (
        "CAREERS",
        (
            Module.CAREERS,
            Module.JOB_POSITIONS,
            Module.APPLICATIONS,
            Module.DEPARTMENTS,
            Module.CAREER_PAGE,
        ),
    ),
    ("ADMINISTRATION", (Module.USERS, Module.ROLES, Module.SETTINGS)),
)

MODULE_LABELS = {
    Module.DASHBOARD: "Dashboard",
    Module.PAGES: "Pages",
    Module.BLOGS: "Blogs",
    Module.FAQS: "FAQs",
    Module.MEDIA: "Media",
    Module.SEO: "SEO",
    Module.LEADS: "Leads / Entries",
    Module.EMI: "EMI Calculator",
    Module.CAREERS: "Careers Overview",
    Module.JOB_POSITIONS: "Job Positions",
    Module.APPLICATIONS: "Applications",
    Module.DEPARTMENTS: "Departments",
    Module.CAREER_PAGE: "Career Page",
    Module.USERS: "Users",
    Module.ROLES: "Roles & Permissions",
    Module.SETTINGS: "Settings",
}

ALL_MODULES = tuple(m for _, mods in MODULE_GROUPS for m in mods)


#: Which actions mean anything on each module. Read-only surfaces expose View
#: alone; the content modules carry the full publish/verify/archive workflow.
_READ_ONLY = (Action.VIEW,)
_CONTENT = (
    Action.VIEW,
    Action.CREATE,
    Action.EDIT,
    Action.PUBLISH,
    Action.VERIFY,
    Action.ARCHIVE,
)
#: Maintenance-only surfaces (§6.2, §6.16): edit the exposed fields and publish
#: them, but there is nothing to create or archive — the page already exists and
#: is protected.
_MAINTENANCE = (Action.VIEW, Action.EDIT, Action.PUBLISH, Action.VERIFY)

ALLOWED_ACTIONS = {
    Module.DASHBOARD: _READ_ONLY,
    Module.PAGES: _MAINTENANCE,
    Module.BLOGS: _CONTENT,
    Module.FAQS: _CONTENT,
    Module.MEDIA: (Action.VIEW, Action.CREATE, Action.EDIT, Action.ARCHIVE),
    Module.SEO: (Action.VIEW, Action.EDIT, Action.PUBLISH),
    Module.LEADS: (Action.VIEW, Action.EDIT, Action.ARCHIVE),
    Module.EMI: (Action.VIEW, Action.EDIT),
    Module.CAREERS: _READ_ONLY,
    Module.JOB_POSITIONS: _CONTENT,
    Module.APPLICATIONS: (Action.VIEW, Action.EDIT, Action.ARCHIVE),
    Module.DEPARTMENTS: (Action.VIEW, Action.CREATE, Action.EDIT, Action.ARCHIVE),
    Module.CAREER_PAGE: _MAINTENANCE,
    Module.USERS: (Action.VIEW, Action.CREATE, Action.EDIT, Action.ARCHIVE, Action.MANAGE),
    Module.ROLES: (Action.VIEW, Action.CREATE, Action.EDIT, Action.MANAGE),
    Module.SETTINGS: (Action.VIEW, Action.EDIT),
}


def normalise(permissions: dict | None) -> dict:
    """Drop unknown modules/actions and de-duplicate, preserving canonical order.

    Permission maps arrive from the Roles screen as free-form JSON. Storing them
    unfiltered would let a typo (``"faq"`` for ``"faqs"``) sit in the database
    looking like a grant while never matching a check — a permission bug that
    reads as a UI bug. Normalising on the way in makes what is stored exactly
    what the checker can honour.
    """
    clean: dict[str, list[str]] = {}
    for module, actions in (permissions or {}).items():
        allowed = ALLOWED_ACTIONS.get(module)
        if allowed is None or not isinstance(actions, (list, tuple, set)):
            continue
        kept = [a for a in allowed if a in set(actions)]
        if kept:
            clean[module] = kept
    return clean


def full_access() -> dict:
    """Every action the registry allows, on every module — the Super Admin grant."""
    return {module: list(actions) for module, actions in ALLOWED_ACTIONS.items()}


def grant(modules, actions=None) -> dict:
    """Build a permission map giving ``actions`` on each of ``modules``.

    ``actions=None`` means "everything this module allows". Anything asked for
    that a module does not allow is dropped, so a seed definition can name a
    broad action set without having to restate each module's shape.
    """
    out: dict[str, list[str]] = {}
    for module in modules:
        allowed = ALLOWED_ACTIONS.get(module, ())
        wanted = allowed if actions is None else [a for a in allowed if a in set(actions)]
        if wanted:
            out[module] = list(wanted)
    return out


# ── The four Phase 1 role archetypes (§6.17) ──────────────────────────────────
#
# Seed definitions only: once a role row exists, the Roles screen owns it and
# these are not re-applied, so a deliberate loosening or tightening survives the
# next deploy. `slug` is the stable key; `legacy_role` is the value that goes
# into the JWT `role` claim for the goldenray backend's benefit.

SUPER_ADMIN = "super-admin"
CONTENT_MANAGER = "content-manager"
CAREERS_HR = "careers-hr"
SALES_LEAD = "sales-lead"

SEED_ROLES = (
    {
        "slug": SUPER_ADMIN,
        "name": "Super Admin",
        "description": "Full access to every Phase 1 module.",
        "legacy_role": "admin",
        "permissions": full_access(),
    },
    {
        "slug": CONTENT_MANAGER,
        "name": "Content Manager",
        "description": (
            "Website maintenance, Blogs, FAQs, Media and basic SEO. Explicitly "
            "excludes unrestricted full-page editing, leads and careers."
        ),
        "legacy_role": "editor",
        # §6.17 is emphatic that this role must not receive unrestricted
        # full-page editing: Pages is granted at maintenance level only, and the
        # Pages module itself exposes nothing beyond the approved field set.
        "permissions": {
            **grant([Module.DASHBOARD]),
            **grant([Module.PAGES], [Action.VIEW, Action.EDIT]),
            **grant([Module.BLOGS, Module.FAQS]),
            **grant([Module.MEDIA]),
            **grant([Module.SEO]),
        },
    },
    {
        "slug": CAREERS_HR,
        "name": "Career / HR",
        "description": "Job Positions, Applications, Departments and Career Page maintenance.",
        "legacy_role": "editor",
        "permissions": {
            **grant([Module.DASHBOARD]),
            **grant([Module.MEDIA], [Action.VIEW, Action.CREATE, Action.EDIT]),
            **grant(
                [
                    Module.CAREERS,
                    Module.JOB_POSITIONS,
                    Module.APPLICATIONS,
                    Module.DEPARTMENTS,
                ]
            ),
            **grant([Module.CAREER_PAGE], [Action.VIEW, Action.EDIT]),
        },
    },
    {
        "slug": SALES_LEAD,
        "name": "Sales / Lead",
        "description": "Leads / Entries and the EMI calculator. Nothing else without explicit approval.",
        "legacy_role": "author",
        "permissions": {
            **grant([Module.DASHBOARD]),
            **grant([Module.LEADS]),
            **grant([Module.EMI], [Action.VIEW]),
        },
    },
)
