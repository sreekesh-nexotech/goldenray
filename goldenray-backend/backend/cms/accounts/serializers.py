from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from . import modules as mod
from .models import AdminUser, Role


class StudioTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Embed `role` and `username` in the access token.

    The main goldenray backend authorises Studio users (e.g. for the EMI
    calculator settings) by verifying this token with a shared signing key. It
    has no access to this service's user table, so the role has to travel in
    the token itself.

    ``role`` stays the legacy three-value claim that the other service already
    understands. ``modules`` lists the granted module keys and ``permissions``
    carries the full ``{module: [actions]}`` grant, so that service can gate
    reads on ``view`` and writes on ``edit`` from the same matrix an admin sees
    in the Roles screen. Both are additive and safe for an older consumer to
    ignore.
    """

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["username"] = user.username
        # Superusers act as admins regardless of the stored role.
        token["role"] = "admin" if user.is_superuser else user.role
        permissions = user.permission_map()
        token["modules"] = sorted(permissions.keys())
        token["permissions"] = {m: list(a) for m, a in permissions.items()}
        return token


class RoleSerializer(serializers.ModelSerializer):
    """Read/write shape for the Roles & Permissions screen."""

    module_count = serializers.IntegerField(read_only=True)
    user_count = serializers.SerializerMethodField()

    class Meta:
        model = Role
        fields = (
            "id", "name", "slug", "description", "permissions", "legacy_role",
            "is_system", "sort_order", "module_count", "user_count",
            "created_at", "updated_at",
        )
        read_only_fields = ("is_system", "created_at", "updated_at")

    def get_user_count(self, obj) -> int:
        return obj.users.filter(is_active=True).count()

    def validate_permissions(self, value):
        """Reject grants the registry cannot honour instead of quietly dropping them.

        ``Role.save()`` normalises anyway, but a silent drop means the Roles
        screen shows a checkbox ticked, saves, reloads, and shows it unticked
        with no explanation. Failing loudly here turns that into a message
        naming the offending key.
        """
        if not isinstance(value, dict):
            raise serializers.ValidationError("Permissions must be an object of module → actions.")

        unknown_modules = [k for k in value if k not in mod.ALLOWED_ACTIONS]
        if unknown_modules:
            raise serializers.ValidationError(
                f"Unknown module(s): {', '.join(sorted(unknown_modules))}."
            )

        for module, actions in value.items():
            if not isinstance(actions, (list, tuple)):
                raise serializers.ValidationError(f"'{module}' must map to a list of actions.")
            allowed = set(mod.ALLOWED_ACTIONS[module])
            bad = [a for a in actions if a not in allowed]
            if bad:
                raise serializers.ValidationError(
                    f"'{module}' does not support: {', '.join(sorted(bad))}. "
                    f"Allowed: {', '.join(sorted(allowed))}."
                )
        return value


class AdminUserSerializer(serializers.ModelSerializer):
    """Read shape for /auth/me/ and the Roles & access list. The capability
    flags let the UI show/hide the Publish button and schema screens without
    re-encoding role rules client-side.

    ``permissions`` is the resolved Phase 1 matrix — what this user can actually
    do, after superuser override and legacy fallback. The Studio renders its
    navigation and its per-screen action buttons straight from it, so a module
    absent from this map is a module the user never sees a route to.
    """

    can_publish = serializers.BooleanField(read_only=True)
    can_edit_schema = serializers.BooleanField(read_only=True)
    access_role_name = serializers.CharField(source="access_role.name", read_only=True, default=None)
    access_role_slug = serializers.CharField(source="access_role.slug", read_only=True, default=None)
    permissions = serializers.SerializerMethodField()

    class Meta:
        model = AdminUser
        fields = (
            "id", "username", "email", "first_name", "last_name", "role",
            "access_role", "access_role_name", "access_role_slug", "permissions",
            "can_publish", "can_edit_schema", "is_staff", "is_active",
            "last_login", "date_joined",
        )
        read_only_fields = fields

    def get_permissions(self, obj) -> dict:
        return obj.permission_map()


class AdminUserWriteSerializer(serializers.ModelSerializer):
    """Create/update internal users (admin role only).

    ``password`` is write-only: required on create, optional on update
    (omit it to keep the current password).
    """

    password = serializers.CharField(write_only=True, required=False, allow_blank=False)

    class Meta:
        model = AdminUser
        fields = (
            "id", "username", "email", "first_name", "last_name",
            "role", "access_role", "is_active", "password",
        )

    def validate_password(self, value):
        validate_password(value)
        return value

    def validate(self, attrs):
        if self.instance is None and not attrs.get("password"):
            raise serializers.ValidationError({"password": "Password is required for new users."})
        return attrs

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = AdminUser(**validated_data)
        user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        for field, value in validated_data.items():
            setattr(instance, field, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance

    def to_representation(self, instance):
        return AdminUserSerializer(instance, context=self.context).data
