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

# Legacy fallback for tokens minted before the CMS embedded the module grant:
# admins and editors keep write access, authors do not.
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


class HasStudioModule(permissions.BasePermission):
    """Every method needs a valid Studio token that grants a Phase 1 module.

    The CMS embeds the user's grant in the token (see
    ``accounts.serializers.StudioTokenObtainPairSerializer``): ``modules`` is
    the list of granted module keys and ``permissions`` maps each module to its
    action verbs. Checking those claims here means the permission matrix an
    admin edits in the Studio is honoured by this service too, without this
    service having any user table to consult.

    Safe methods need ``read_action`` (default ``view``) on the module; every
    other method needs ``write_action`` (default ``edit``). ``DELETE`` asks for
    ``delete_action`` when one is given, so a queue that archives rather than
    deletes can name ``archive``.

    Older tokens degrade gracefully: one with ``modules`` but no ``permissions``
    is treated as holding every action on its modules, and one with neither
    falls back to the coarse ``role`` check — so nobody is locked out by a
    deploy; they simply get the pre-matrix behaviour until they sign in again.

    Use as ``permission_classes = [HasStudioModule.for_("applications")]`` or
    ``HasStudioModule.for_("leads", delete_action="archive")``.
    """

    module = None
    read_action = "view"
    write_action = "edit"
    delete_action = None
    message = "Your Studio role does not include this module."

    @classmethod
    def for_(cls, module, *, read_action="view", write_action="edit", delete_action=None):
        return type(
            f"HasStudioModule_{module}",
            (cls,),
            {
                "module": module,
                "read_action": read_action,
                "write_action": write_action,
                "delete_action": delete_action,
            },
        )

    def _required_action(self, request):
        if request.method in permissions.SAFE_METHODS:
            return self.read_action
        if request.method == "DELETE" and self.delete_action:
            return self.delete_action
        return self.write_action

    def has_permission(self, request, view):
        if not _signing_key():
            raise StudioAuthNotConfigured()

        payload = studio_payload_from_request(request)
        if payload is None:
            return False

        modules = payload.get("modules")
        grants = payload.get("permissions")
        needed = self._required_action(request)

        if modules is None:
            allowed = payload.get("role") in WRITE_ROLES
        elif self.module not in modules:
            allowed = False
        elif isinstance(grants, dict):
            allowed = needed in (grants.get(self.module) or ())
        else:
            allowed = True

        if not allowed:
            self.message = (
                f"Your Studio role does not include '{needed}' on this module."
                if modules is not None and self.module in modules
                else "Your Studio role does not include this module."
            )
            return False

        request.studio_user = {
            "id": payload.get("user_id"),
            "username": payload.get("username"),
            "role": payload.get("role"),
            "modules": modules,
            "permissions": grants,
        }
        return True
