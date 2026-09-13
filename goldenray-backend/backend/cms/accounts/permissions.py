from rest_framework.permissions import BasePermission, SAFE_METHODS

from .modules import Action


class IsSchemaEditor(BasePermission):
    """Only admins may mutate catalog/schema (collections, templates, slots)."""

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return request.user and request.user.is_authenticated
        return bool(request.user and request.user.is_authenticated and request.user.can_edit_schema)


class CanAuthorEntries(BasePermission):
    """Any authenticated internal user — the admin shell's own endpoints.

    Only the dashboard and site-config views still use this: every signed-in
    account needs them to render the shell at all. Module-bearing screens are
    gated by ``HasModulePermission`` below.
    """

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)


# ── Phase 1 module matrix (§6.17) ─────────────────────────────────────────────

#: HTTP method → the action it needs. POST is deliberately CREATE here; the
#: workflow verbs (publish/verify/archive) are also POSTs but arrive as DRF
#: ``@action`` routes, which name their own requirement via ``requires``.
METHOD_ACTIONS = {
    "GET": Action.VIEW,
    "HEAD": Action.VIEW,
    "OPTIONS": Action.VIEW,
    "POST": Action.CREATE,
    "PUT": Action.EDIT,
    "PATCH": Action.EDIT,
    "DELETE": Action.ARCHIVE,
}


class HasModulePermission(BasePermission):
    """Gate a viewset on ``module`` + the action the request implies.

    Attach by setting ``permission_module`` on the view::

        class FaqViewSet(viewsets.ModelViewSet):
            permission_classes = [HasModulePermission]
            permission_module = Module.FAQS

    Per-route overrides live in ``permission_actions`` — a map of DRF view
    action name → required action verb — which is how ``publish``/``archive``
    routes ask for the verb they actually mean rather than the CREATE that
    their POST method would otherwise imply::

        permission_actions = {"publish": Action.PUBLISH, "archive": Action.ARCHIVE}

    Failing closed matters more than a helpful default here: a view that forgets
    ``permission_module`` is refused outright rather than silently allowing
    everyone through.
    """

    message = "Your role does not include this action."

    def has_permission(self, request, view):
        user = request.user
        if not (user and user.is_authenticated):
            return False

        module = getattr(view, "permission_module", None)
        if module is None:
            return False

        overrides = getattr(view, "permission_actions", {}) or {}
        action = overrides.get(getattr(view, "action", None))
        if action is None:
            action = METHOD_ACTIONS.get(request.method, Action.VIEW)

        if user.can(module, action):
            return True

        # A safe method always passes when the user can view the module at all —
        # this keeps a viewer able to open a detail page whose route happens to
        # be reached through a non-list action.
        if request.method in SAFE_METHODS and user.can(module, Action.VIEW):
            return True

        return False


def require(user, module: str, action: str) -> bool:
    """Imperative check for service-layer code that has no view to hang off."""
    return bool(user and user.is_authenticated and user.can(module, action))
