"""Authorise Content Studio users against this backend.

The Studio's JWTs are minted by the *CMS* Django service (a separate project
with its own database and its own SECRET_KEY), so this backend cannot look the
user up — there is no shared user table. Instead it verifies the token's
signature and expiry with a shared key and trusts the claims inside.

Deployment: set ``STUDIO_JWT_SIGNING_KEY`` on this service to the CMS's
``DJANGO_SECRET_KEY``. Nothing changes on the CMS side, and tokens already in
circulation keep working.

The permission fails closed: with no key configured, writes are refused.
"""

import jwt
from django.conf import settings
from rest_framework import permissions
from rest_framework.exceptions import APIException

# Roles allowed to change pricing. Authors can sign into the Studio but must
# not be able to move interest rates or system prices.
WRITE_ROLES = {"admin", "editor"}


class StudioAuthNotConfigured(APIException):
    status_code = 503
    default_detail = (
        "Studio authentication is not configured on this service. "
        "Set STUDIO_JWT_SIGNING_KEY to the CMS DJANGO_SECRET_KEY."
    )
    default_code = "studio_auth_not_configured"


def _signing_key():
    key = getattr(settings, "STUDIO_JWT_SIGNING_KEY", "") or ""
    return key.strip()


def decode_studio_token(raw_token):
    """Return the token payload, or None when it is absent/invalid/expired."""
    key = _signing_key()
    if not key or not raw_token:
        return None
    try:
        return jwt.decode(
            raw_token,
            key,
            algorithms=[settings.SIMPLE_JWT.get("ALGORITHM", "HS256")],
        )
    except jwt.PyJWTError:
        return None


def studio_payload_from_request(request):
    header = request.META.get("HTTP_AUTHORIZATION", "")
    if not header.lower().startswith("bearer "):
        return None
    return decode_studio_token(header.split(" ", 1)[1].strip())


class IsStudioEditor(permissions.BasePermission):
    """Every method needs a valid Studio token with an admin/editor role.

    Reads are gated too, not just writes: these endpoints return inactive rows
    as well (a hidden bank, a system size staged for a price change), which the
    public config endpoint deliberately filters out. Anonymous visitors get
    what they need from /api/emi-calculator/config/ instead.
    """

    message = "A Content Studio admin or editor session is required."

    def has_permission(self, request, view):
        if not _signing_key():
            # Better a loud 503 than silently accepting unsigned writes.
            raise StudioAuthNotConfigured()

        payload = studio_payload_from_request(request)
        if payload is None:
            return False

        role = payload.get("role")
        if role is None:
            # Tokens minted before the CMS started embedding `role` cannot be
            # authorised for pricing changes — the user just signs in again.
            self.message = (
                "This Studio session predates role-aware tokens. "
                "Please sign out and sign in again."
            )
            return False

        if role not in WRITE_ROLES:
            self.message = "Your Studio role cannot change calculator settings."
            return False

        # Stash for audit/debugging in views that want it.
        request.studio_user = {
            "id": payload.get("user_id"),
            "username": payload.get("username"),
            "role": role,
        }
        return True
