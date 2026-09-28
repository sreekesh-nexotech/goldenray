"""The Phase 1 permission matrix (§6.17): registry, roles, token claims, gating."""
from django.contrib.auth import get_user_model
from django.test import TestCase

from . import modules as mod
from .models import Role
from .serializers import StudioTokenObtainPairSerializer

User = get_user_model()


def role(slug):
    """A seeded archetype — the data migration created these."""
    return Role.objects.get(slug=slug)


def user_with(slug, username=None):
    return User.objects.create_user(
        username=username or slug.replace("-", "_"), password="pw", access_role=role(slug)
    )


class RegistryTests(TestCase):
    def test_phase_2_modules_cannot_be_granted(self):
        for key in ("comparison", "quotation_analyzer", "group_purchasing"):
            self.assertNotIn(key, mod.ALL_MODULES)
            self.assertEqual(mod.normalise({key: ["view"]}), {})

    def test_normalise_drops_unknown_actions_and_keeps_canonical_order(self):
        clean = mod.normalise({"faqs": ["archive", "view", "manage", "typo"]})
        self.assertEqual(clean, {"faqs": ["view", "archive"]})

    def test_grant_respects_each_modules_allowed_actions(self):
        self.assertEqual(mod.grant([mod.Module.DASHBOARD], mod.ALL_ACTIONS), {"dashboard": ["view"]})
        self.assertEqual(mod.grant([mod.Module.PAGES], [mod.Action.CREATE]), {})


class SeededRolesTests(TestCase):
    def test_four_archetypes_exist_and_are_system_roles(self):
        slugs = set(Role.objects.filter(is_system=True).values_list("slug", flat=True))
        self.assertEqual(slugs, {mod.SUPER_ADMIN, mod.CONTENT_MANAGER, mod.CAREERS_HR, mod.SALES_LEAD})

    def test_content_manager_never_gets_full_page_editing_or_leads(self):
        perms = role(mod.CONTENT_MANAGER).permissions
        self.assertEqual(perms["pages"], ["view", "edit"])
        self.assertNotIn("leads", perms)
        self.assertNotIn("job_positions", perms)

    def test_careers_hr_holds_career_page_but_not_pages(self):
        perms = role(mod.CAREERS_HR).permissions
        self.assertIn("career_page", perms)
        self.assertNotIn("pages", perms)
        self.assertNotIn("blogs", perms)

    def test_sales_lead_reaches_leads_and_read_only_emi_only(self):
        perms = role(mod.SALES_LEAD).permissions
        self.assertEqual(set(perms), {"dashboard", "leads", "emi", "quotations"})
        self.assertEqual(perms["emi"], ["view"])
        self.assertEqual(perms["quotations"], ["view"])

    def test_super_admin_reaches_quotations(self):
        self.assertEqual(role(mod.SUPER_ADMIN).permissions.get("quotations"), ["view"])

    def test_content_manager_does_not_reach_quotations(self):
        self.assertNotIn("quotations", role(mod.CONTENT_MANAGER).permissions)


class RoleModelTests(TestCase):
    def test_save_normalises_permissions(self):
        r = Role.objects.create(name="Custom", slug="custom", permissions={"faqs": ["view", "bogus"], "nope": ["view"]})
        self.assertEqual(r.permissions, {"faqs": ["view"]})

    def test_user_legacy_role_follows_the_granted_role(self):
        u = user_with(mod.SALES_LEAD)
        self.assertEqual(u.role, "author")
        u.access_role = role(mod.CONTENT_MANAGER)
        u.save()
        self.assertEqual(u.role, "editor")

    def test_changing_a_roles_legacy_mapping_cascades_to_its_users(self):
        u = user_with(mod.SALES_LEAD)
        r = role(mod.SALES_LEAD)
        r.legacy_role = "editor"
        r.save()
        u.refresh_from_db()
        self.assertEqual(u.role, "editor")

    def test_superuser_can_do_everything_without_a_role(self):
        su = User.objects.create_superuser(username="root", password="pw")
        self.assertTrue(su.can("leads", "archive"))
        self.assertFalse(su.can("leads", "publish"))  # not an allowed action on leads
        self.assertEqual(su.permission_map(), mod.full_access())

    def test_legacy_accounts_without_a_role_keep_working(self):
        admin = User.objects.create_user(username="old_admin", password="pw", role="admin")
        author = User.objects.create_user(username="old_author", password="pw", role="author")
        self.assertTrue(admin.can("users", "manage"))
        self.assertTrue(author.can("faqs", "create"))
        self.assertFalse(author.can("faqs", "publish"))
        self.assertFalse(author.can("leads"))


class TokenClaimTests(TestCase):
    def test_token_carries_role_modules_and_permissions(self):
        u = user_with(mod.CAREERS_HR)
        token = StudioTokenObtainPairSerializer.get_token(u)
        self.assertEqual(token["role"], "editor")
        self.assertIn("applications", token["modules"])
        self.assertEqual(token["permissions"]["career_page"], ["view", "edit"])
        self.assertNotIn("leads", token["modules"])

    def test_superuser_token_claims_admin_regardless_of_stored_role(self):
        su = User.objects.create_superuser(username="root", password="pw")
        self.assertEqual(su.role, "author")
        self.assertEqual(StudioTokenObtainPairSerializer.get_token(su)["role"], "admin")


class ModuleGatingApiTests(TestCase):
    """HasModulePermission as the API sees it, one role at a time."""

    def as_(self, slug):
        self.client.force_login(user_with(slug))

    def test_content_manager_is_kept_out_of_careers_and_leads_screens(self):
        self.as_(mod.CONTENT_MANAGER)
        self.assertEqual(self.client.get("/admin-api/faqs/").status_code, 200)
        self.assertEqual(self.client.get("/admin-api/job-positions/").status_code, 403)
        self.assertEqual(self.client.get("/admin-api/settings/").status_code, 403)
        self.assertEqual(self.client.get("/admin-api/auth/users/").status_code, 403)

    def test_careers_hr_reaches_career_page_mount_but_not_pages(self):
        self.as_(mod.CAREERS_HR)
        self.assertEqual(self.client.get("/admin-api/pages/").status_code, 403)
        self.assertEqual(self.client.get("/admin-api/career-page/").status_code, 200)
        self.assertEqual(self.client.get("/admin-api/job-positions/").status_code, 200)

    def test_sales_lead_cannot_read_blogs_or_media(self):
        self.as_(mod.SALES_LEAD)
        self.assertEqual(self.client.get("/admin-api/entries/").status_code, 403)
        self.assertEqual(self.client.get("/admin-api/media-assets/").status_code, 403)
        self.assertEqual(self.client.get("/admin-api/faqs/").status_code, 403)
        self.assertEqual(self.client.get("/admin-api/dashboard/").status_code, 200)

    def test_workflow_verbs_need_their_own_action(self):
        # An author-level legacy account may create FAQs but not publish them.
        author = User.objects.create_user(username="author", password="pw", role="author")
        self.client.force_login(author)
        from faqs.models import Faq
        from sitepages.models import Page

        page = Page.objects.create(name="Home", route="/")
        faq = Faq.objects.create(question="Q?", answer="A.", page=page)
        self.assertEqual(self.client.post(f"/admin-api/faqs/{faq.pk}/publish/").status_code, 403)

    def test_anonymous_is_refused(self):
        self.assertIn(self.client.get("/admin-api/faqs/").status_code, (401, 403))

    def test_permission_registry_lists_every_module_once(self):
        self.as_(mod.SALES_LEAD)
        data = self.client.get("/admin-api/auth/permission-registry/").json()
        keys = [m["key"] for g in data["groups"] for m in g["modules"]]
        self.assertEqual(sorted(keys), sorted(mod.ALL_MODULES))
        self.assertEqual(len(keys), len(set(keys)))


class RolesApiTests(TestCase):
    def setUp(self):
        self.client.force_login(user_with(mod.SUPER_ADMIN))

    def test_unknown_module_or_action_is_rejected_loudly(self):
        resp = self.client.post(
            "/admin-api/auth/roles/",
            {"name": "X", "slug": "x", "permissions": {"comparison": ["view"]}},
            content_type="application/json",
        )
        self.assertEqual(resp.status_code, 400)
        self.assertIn("comparison", str(resp.json()))

        resp = self.client.post(
            "/admin-api/auth/roles/",
            {"name": "Y", "slug": "y", "permissions": {"leads": ["publish"]}},
            content_type="application/json",
        )
        self.assertEqual(resp.status_code, 400)

    def test_system_roles_cannot_be_deleted(self):
        r = role(mod.CONTENT_MANAGER)
        self.assertEqual(self.client.delete(f"/admin-api/auth/roles/{r.pk}/").status_code, 400)
        self.assertTrue(Role.objects.filter(pk=r.pk).exists())

    def test_a_role_in_use_cannot_be_deleted(self):
        r = Role.objects.create(name="Temp", slug="temp", permissions={"dashboard": ["view"]})
        User.objects.create_user(username="holder", password="pw", access_role=r)
        self.assertEqual(self.client.delete(f"/admin-api/auth/roles/{r.pk}/").status_code, 400)

    def test_deleting_a_role_needs_manage(self):
        # A custom role with roles: view/edit but not manage can read, not delete.
        limited = Role.objects.create(
            name="Role viewer", slug="role-viewer", permissions={"roles": ["view", "edit"]}
        )
        self.client.force_login(User.objects.create_user(username="viewer", password="pw", access_role=limited))
        target = Role.objects.create(name="Doomed", slug="doomed")
        self.assertEqual(self.client.get("/admin-api/auth/roles/").status_code, 200)
        self.assertEqual(self.client.delete(f"/admin-api/auth/roles/{target.pk}/").status_code, 403)

    def test_deactivating_a_user_never_hard_deletes(self):
        u = user_with(mod.SALES_LEAD)
        self.assertEqual(self.client.delete(f"/admin-api/auth/users/{u.pk}/").status_code, 204)
        u.refresh_from_db()
        self.assertFalse(u.is_active)
