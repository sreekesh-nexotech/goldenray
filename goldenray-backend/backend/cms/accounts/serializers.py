from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from .models import AdminUser


class AdminUserSerializer(serializers.ModelSerializer):
    """Read shape for /auth/me/ and the Roles & access list. The capability
    flags let the UI show/hide the Publish button and schema screens without
    re-encoding role rules client-side."""

    can_publish = serializers.BooleanField(read_only=True)
    can_edit_schema = serializers.BooleanField(read_only=True)

    class Meta:
        model = AdminUser
        fields = (
            "id", "username", "email", "first_name", "last_name", "role",
            "can_publish", "can_edit_schema", "is_staff", "is_active",
            "last_login", "date_joined",
        )
        read_only_fields = fields


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
            "role", "is_active", "password",
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
