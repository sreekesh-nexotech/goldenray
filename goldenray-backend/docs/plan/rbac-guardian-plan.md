# RBAC for `backend` (goldenray + bom) with django-guardian + Next.js admin-webapp

## Context

The `backend` Django project (apps `goldenray`, `bom`) has **no authorization layer**. The only
primitive is `goldenray/permissions.py` — 19 lines that answer "authenticated or not" and nothing
more:

```python
class ApiMethodPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        view_method = getattr(view, request.method.lower(), None)
        is_non_authenticated = getattr(view_method, "_non_authenticated_view", False)
        return is_non_authenticated or (request.user and request.user.is_authenticated)
```

Consequences today: **any logged-in user can DELETE any solar panel, tariff, pincode or price row.**
The `bom` HTML portal hardcodes `is_superuser` checks. There is **no JWT login endpoint at all**
despite `JWTAuthentication` being the default authenticator — tokens are minted out-of-band.

The goal: a superadmin creates **roles** and picks exactly which permissions each role holds. That
requires a **permission map covering every endpoint**, which becomes both the enforcement source of
truth and the catalogue the role-builder UI renders. Users then log into a Next.js admin app at
`/admin-webapp` and see only the models and actions their role permits.

### Decisions taken
- Scope: `backend` only (`goldenray` + `bom`). The separate `cms/` project keeps its own role field, untouched.
- Stock `django.contrib.auth.User` + new SimpleJWT endpoints. Roles = Django **Groups**.
- **Model-level** permissions now; guardian installed and its backend wired so per-row rules can be
  added later without rework. (`goldenray` models have zero FKs and no `owner`/`created_by` column,
  so object-level rules have nothing to attach to today.)
- Admin-webapp exposes **all** goldenray + bom models, driven by the registry.
- PII models get new permission-gated read endpoints.
- Pre-existing security holes are fixed as part of this work.

### Hard constraint
Many GET endpoints are `@non_authenticated_view` because **the public marketing site reads them
anonymously** (solar panels, inverters, tariffs, batteries, pincodes, calculators, OTP, metadata).
Public read must not break. RBAC applies to writes, and to reads of sensitive data.

---

## Part 1 — Guardian + auth foundation

**`requirements.txt`** — add `django-guardian==3.3.3` (verified: supports Django 5.2, needs Python
≥3.10; venv is 3.12 ✓).
⚠️ This file is **UTF-16 encoded** — preserve the encoding when editing or the Docker build breaks.

**`backend/settings.py`**
```python
INSTALLED_APPS = [..., "guardian", "rest_framework_simplejwt.token_blacklist", "accounts"]

AUTHENTICATION_BACKENDS = (
    "django.contrib.auth.backends.ModelBackend",      # MUST stay first: grants model-level perms
    "guardian.backends.ObjectPermissionBackend",      # object-level only; grants NO model perms
)
ANONYMOUS_USER_NAME = "AnonymousUser"
```
Two gotchas: guardian's backend **only** answers object-level checks — dropping `ModelBackend` would
deny everything. And `token_blacklist` is added because `BLACKLIST_AFTER_ROTATION=True` is currently
a silent no-op.

Also add `DEFAULT_PAGINATION_CLASS` (PageNumberPagination, PAGE_SIZE 25) so admin list screens page
— matching the CMS convention the frontend already expects.

**New app `accounts`** (`backend/accounts/`) holding auth, roles and the permission map. Guardian's
migration creates its anonymous user instance; run `migrate` after install.

**Auth endpoints** (`accounts/urls.py`, mounted at `/api/auth/`):

| Endpoint | View | Notes |
|---|---|---|
| `POST auth/login/` | `TokenObtainPairView` (custom serializer) | returns `access`, `refresh` |
| `POST auth/refresh/` | `TokenRefreshView` | rotates |
| `POST auth/logout/` | blacklist the refresh token | |
| `GET auth/me/` | `MeAPIView` | user + `is_superuser` + **flat `permissions: string[]`** |

`auth/me/` returning the effective permission list is what lets the frontend gate nav and buttons
without guessing. Build it from `user.get_all_permissions()`, with superusers receiving the full set.

---

## Part 2 — The permission map (the centerpiece)

A single declarative module, `accounts/permission_map.py`, is the source of truth. Nothing else
encodes authorization.

```python
PUBLIC = "PUBLIC"           # anonymous allowed — marketing site depends on it
AUTHENTICATED = "AUTH"      # any logged-in user

# url name -> { HTTP method -> required permission codename | PUBLIC | AUTHENTICATED }
PERMISSION_MAP = {
    "device-type-list-create": {
        "GET": PUBLIC,
        "POST": "goldenray.add_devicetype",
    },
    "device-type-retrieve-update-destroy": {
        "GET": PUBLIC,
        "PUT": "goldenray.change_devicetype",
        "PATCH": "goldenray.change_devicetype",
        "DELETE": "goldenray.delete_devicetype",
    },
    ...
}
```

Keying on the **URL name** (already unique per route in `goldenray/urls.py`) is what makes this work
despite one view class serving both the collection and detail routes — `request.resolver_match.url_name`
distinguishes them where the view class cannot.

Coverage, derived from the existing routes:

- **Catalog / reference models** (12 goldenray CRUD pairs — device-types, batteries, wattages,
  tariffs, ev-cars, ev-scooters, solar-installations, solar-installations-new, solar-panels,
  solar-inverters, pincodes, metadata, room-sizes): `GET → PUBLIC`, writes → `add_/change_/delete_`.
- **PII / leads** (lead-collection-home, customer-installations): `GET → view_*` **(no longer
  public)**, `POST` on lead-collection stays `PUBLIC` so the website can still submit leads.
- **Public form intake** (affiliate-applications, warranty-service-requests, job-applications):
  `POST → PUBLIC` (throttled, unchanged); **new** `GET → view_*`.
- **Calculators & OTP** (calculate-solar, -new, -advanced, emi-calculator, send-otp, verify-otp,
  installation-stats): `PUBLIC`, unchanged.
- **bom** (12 List/Detail pairs): `GET → view_*`, writes → `add_/change_/delete_`. `bom/api/calculate/`
  stays public but the `seed_catalog` call is removed from the request path.

**Enforcement — one permission class, no per-view rewrites.** Replaces `ApiMethodPermission` while
keeping the `@non_authenticated_view` decorator working for backward compatibility:

```python
class MappedPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        url_name = request.resolver_match.url_name
        rule = PERMISSION_MAP.get(url_name, {}).get(request.method)
        if rule is None:
            return False                      # fail closed: unmapped route is denied
        if rule == PUBLIC:
            return True
        if not (request.user and request.user.is_authenticated):
            return False
        if rule == AUTHENTICATED or request.user.is_superuser:
            return True
        return request.user.has_perm(rule)
```

**Fail-closed on unmapped routes** is deliberate: a new endpoint added without a map entry is denied
rather than silently public. A test (below) enumerates the URLconf and asserts full coverage, so this
surfaces at CI time rather than in production.

Wiring is a one-line change per view pattern:
- `goldenray`: set `permission_classes = [MappedPermission]` on each APIView (or set it as the DRF
  global default and delete the per-view lines).
- `bom`: change `AuthMixin` at `bom/views/api.py:39` — a single edit covering all 24 generic views.

**Exposing the map to the frontend**: `GET /api/auth/permissions-catalog/` (superadmin only) returns
permissions grouped by app → model → action, built by joining `PERMISSION_MAP` against
`django.contrib.auth.models.Permission`. This is what the role-builder UI renders as checkboxes.

---

## Part 3 — Roles & user management API

Roles are Django `Group`s. All endpoints gated by a new `IsSuperAdmin` permission class.

| Endpoint | Purpose |
|---|---|
| `GET/POST /api/auth/roles/` | list / create role |
| `GET/PATCH/DELETE /api/auth/roles/<id>/` | rename, **set permission list**, delete |
| `GET/POST /api/auth/users/` | list / invite user |
| `GET/PATCH/DELETE /api/auth/users/<id>/` | assign roles, activate/deactivate |
| `GET /api/auth/permissions-catalog/` | the catalogue above |

Use DRF `ModelViewSet` + `DefaultRouter` here (new code, no reason to hand-roll). `RoleSerializer`
accepts `permissions: string[]` of codenames and resolves them to `Permission` objects, rejecting any
codename absent from the permission map. Deleting a user **deactivates** (`is_active=False`) rather
than hard-deleting, and self-deletion/self-demotion is blocked — mirroring the CMS's
`AdminUserViewSet`, the proven in-repo precedent.

**Bootstrap** — `accounts/management/commands/seed_roles.py`, idempotent, creating:
- `Catalog Manager` — full CRUD on catalog/reference models, no PII.
- `Lead Viewer` — `view_*` on lead/PII models only.
- `Pricing Manager` — full CRUD on all `bom` models.
- `Read Only` — `view_*` across everything.

---

## Part 4 — Security fixes (folded into this work)

1. **`/api/lead-collection-home/` GET leaks every lead's name + phone to anonymous callers.**
   Remove `@non_authenticated_view` from `get()` in
   `goldenray/views/lead_collection_home_views.py`; the map gives
   `GET → goldenray.view_leadcollectionhome`, `POST → PUBLIC`.
2. **`CustomerInstallationAPIView` has no `permission_classes`** — it sits on
   `InstallationStatsByPincodeAPIView` further down the same file
   (`goldenray/views/customer_installation_views.py`). Add it explicitly.
3. **`BomCalculateView` runs `call_command("seed_catalog")` inside `post()`** — an unauthenticated DB
   write trigger. Remove it; seeding belongs in deployment, not a request handler.
4. `goldenray/models/__init__.py` omits `LeadCollectionHome`, `Metadata`, `SendQuoteJunk` — export
   them so the registry and permission map can reference them uniformly.

---

## Part 5 — Next.js admin-webapp at `/admin-webapp`

Mirrors the **existing `/studio` app**, which is a working, complete blueprint — reuse it rather than
inventing patterns.

**Reuse directly (do not rebuild):**
- `frontend/src/components/Studio/shared/primitives.tsx` — `PageHeader`, `Card`, `GoldButton`,
  `TextInput`, `SelectField`, `Switch`, `thStyle`/`tdStyle`.
- `frontend/src/components/Studio/shared/overlays.tsx` — `Modal`, `ConfirmDialog`, `DropdownMenu`,
  `ToastHost`.
- `frontend/src/services/studioService.ts` — copy its structure for `adminService.ts`: `request()`,
  `authRequest()` with **401 → refresh → retry once**, cookie token storage, `ApiError` parsing DRF
  error shapes.
- `frontend/src/components/Studio/Entries/EntriesListScreen.tsx` — the reference CRUD table
  (server-driven search/sort/pagination, bulk actions, per-row menu).

**Files**
```
frontend/src/config.ts                     + GOLDENRAY_ADMIN_API_BASE_URL (default http://127.0.0.1:8000/api/)
frontend/src/services/adminService.ts      auth + generic CRUD + roles/users
frontend/src/app/admin-webapp/layout.tsx           robots: { index: false }
frontend/src/app/admin-webapp/login/page.tsx
frontend/src/app/admin-webapp/(app)/layout.tsx     AdminShell (sidebar + topbar)
frontend/src/app/admin-webapp/(app)/dashboard/page.tsx
frontend/src/app/admin-webapp/(app)/roles/page.tsx      role builder
frontend/src/app/admin-webapp/(app)/users/page.tsx
frontend/src/app/admin-webapp/(app)/[model]/page.tsx    generic list/CRUD, registry-driven
frontend/src/components/Admin/...                  screens + AdminContext
```

**Generic CRUD via a registry.** Rather than 32 hand-written screens, one
`frontend/src/components/Admin/registry.ts` maps model key → `{ label, endpoint, appLabel,
modelName, columns, fields }`. The `[model]` dynamic route renders list/create/edit from it, and the
sidebar shows only entries whose `view_*` permission is in `me.permissions`. Adding a model later is
a registry entry, not a new screen.

**Three-layer auth guard**, matching `/studio`:
1. `frontend/src/middleware.ts` — **extend the existing `matcher`** to
   `["/studio/:path*", "/admin-webapp/:path*"]`, redirecting to `/admin-webapp/login?next=…` when the
   refresh cookie is absent. Use distinct cookie names (`flz_admin_access` / `flz_admin_refresh`) so
   the two apps' sessions don't collide.
2. `AdminContext` — loads `auth/me/` on mount, exposes `useCan(perm)`; on auth error, logout + redirect.
3. Route-group layout — `(app)` wraps authed screens; `login` sits outside it.

Also add `/admin-webapp` to the prefix check in `frontend/src/components/common/ConditionalLayout.tsx`
so the marketing header/footer don't render over the admin UI.

Keep the `nextDestination()` open-redirect guard from
`frontend/src/components/Studio/SignIn/SignInScreen.tsx`, retargeted to `/admin-webapp/`.

> Note: tokens live in JS-readable cookies (not HttpOnly) because the Next middleware must read them
> server-side — this is the existing `/studio` tradeoff, carried over for consistency. Worth revisiting
> repo-wide later; out of scope here.

---

## Implementation order

1. Install guardian, settings changes, `accounts` app skeleton, `migrate`.
2. Auth endpoints (login/refresh/me) — verify a token round-trip before anything depends on it.
3. `permission_map.py` covering every route + the coverage test.
4. `MappedPermission`; wire into `goldenray` views and the `bom` `AuthMixin`.
5. Security fixes (Part 4) + new PII read endpoints, reusing the existing serializers in
   `goldenray/serializers/`.
6. Roles/users API + `seed_roles` command.
7. `adminService.ts` + login + middleware/guard.
8. Roles & users screens, then the registry-driven generic CRUD.

Steps 1–6 are independently testable via curl before any frontend work begins.

## Verification

**Backend**
```bash
cd goldenray-backend/backend && source venv/bin/activate
python manage.py migrate && python manage.py seed_roles
python manage.py test accounts          # incl. the map-coverage test

# public read still works (must stay 200 — regression guard for the marketing site)
curl -i http://127.0.0.1:8000/api/solar-panels/
curl -i http://127.0.0.1:8000/api/calculate-solar/ -X POST -H 'Content-Type: application/json' -d '{}'

# PII no longer public — expect 401/403 (was 200 leaking all leads)
curl -i http://127.0.0.1:8000/api/lead-collection-home/

TOKEN=$(curl -s -X POST http://127.0.0.1:8000/api/auth/login/ \
  -H 'Content-Type: application/json' -d '{"username":"admin","password":"..."}' | jq -r .access)
curl -s http://127.0.0.1:8000/api/auth/me/ -H "Authorization: Bearer $TOKEN" | jq .permissions

# role without delete perm must get 403
curl -i -X DELETE http://127.0.0.1:8000/api/device-types/1/ -H "Authorization: Bearer $LIMITED_TOKEN"
```

The **map-coverage test** is the key regression guard: walk `get_resolver().url_patterns` for the
`api/` and `bom/` prefixes and assert every (url_name, method) pair has a `PERMISSION_MAP` entry.

**Frontend**
```bash
cd frontend && npm run dev
```
- `/admin-webapp` unauthenticated → redirects to `/admin-webapp/login`.
- Log in as superadmin → dashboard; all models in sidebar.
- Create a role with only `view_*` on solar panels; assign to a test user; log in as them →
  sidebar shows only Solar Panels, and edit/delete buttons are hidden. Confirm the API also returns
  403 for a direct write (UI gating is cosmetic; the map is the real boundary).
- Confirm `/studio` still works and its session is unaffected by the admin-webapp cookies.
