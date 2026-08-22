"""Serializers for the EMI calculator's admin-managed configuration."""

from rest_framework import serializers

from ..models import (
    EmiBank,
    EmiCalculatorSettings,
    EmiInterestRateRule,
    EmiSubsidyRule,
    EmiSystemSize,
)
from ..utils.emi import format_inr as inr


class EmiSystemSizeSerializer(serializers.ModelSerializer):
    system_cost = serializers.SerializerMethodField()

    class Meta:
        model = EmiSystemSize
        fields = (
            "id", "label", "capacity_kw", "price_per_kw", "system_cost",
            "max_system_cost", "monthly_bill_reference", "sort_order",
            "is_active", "created_at", "updated_at",
        )
        read_only_fields = ("id", "system_cost", "created_at", "updated_at")

    def get_system_cost(self, obj):
        return float(obj.price_per_kw * obj.capacity_kw)

    def validate_price_per_kw(self, value):
        if value <= 0:
            raise serializers.ValidationError("Price per kW must be greater than zero.")
        return value

    def validate_capacity_kw(self, value):
        if value <= 0:
            raise serializers.ValidationError("Capacity must be greater than zero.")
        return value

    def validate(self, attrs):
        # The ceiling is on the derived cost, so it can only be checked once
        # price and capacity are both resolved.
        def resolved(name):
            return attrs.get(name, getattr(self.instance, name, None))

        price, capacity = resolved("price_per_kw"), resolved("capacity_kw")
        ceiling = resolved("max_system_cost")
        if ceiling is not None and price is not None and capacity is not None:
            cost = price * capacity
            if cost > ceiling:
                raise serializers.ValidationError(
                    {
                        "price_per_kw": (
                            f"{inr(price)}/kW puts this system at {inr(cost)}, "
                            f"above the {inr(ceiling)} ceiling set for the size."
                        )
                    }
                )
        return attrs


class EmiSubsidyRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmiSubsidyRule
        fields = (
            "id", "label", "min_kw", "max_kw", "amount", "priority",
            "is_active", "created_at", "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")

    def validate(self, attrs):
        min_kw = attrs.get("min_kw", getattr(self.instance, "min_kw", None))
        max_kw = attrs.get("max_kw", getattr(self.instance, "max_kw", None))
        if min_kw is not None and max_kw is not None and min_kw > max_kw:
            raise serializers.ValidationError(
                {"max_kw": "Upper bound must be greater than or equal to the lower bound."}
            )
        return attrs


class EmiInterestRateRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmiInterestRateRule
        fields = (
            "id", "label", "min_kw", "max_kw", "min_cost", "max_cost",
            "min_loan", "max_loan", "rate", "min_rate", "is_locked",
            "priority", "is_active", "created_at", "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")

    def validate(self, attrs):
        def resolved(name):
            return attrs.get(name, getattr(self.instance, name, None))

        min_kw, max_kw = resolved("min_kw"), resolved("max_kw")
        if min_kw is not None and max_kw is not None and min_kw > max_kw:
            raise serializers.ValidationError(
                {"max_kw": "Upper bound must be greater than or equal to the lower bound."}
            )

        min_cost, max_cost = resolved("min_cost"), resolved("max_cost")
        if min_cost is not None and max_cost is not None and min_cost > max_cost:
            raise serializers.ValidationError(
                {"max_cost": "Upper bound must be greater than or equal to the lower bound."}
            )

        min_loan, max_loan = resolved("min_loan"), resolved("max_loan")
        if min_loan is not None and max_loan is not None and min_loan > max_loan:
            raise serializers.ValidationError(
                {"max_loan": "Upper bound must be greater than or equal to the lower bound."}
            )

        rate, min_rate = resolved("rate"), resolved("min_rate")
        if rate is not None and min_rate is not None and rate < min_rate:
            raise serializers.ValidationError(
                {"rate": "The starting rate cannot be below the floor rate."}
            )
        return attrs


class EmiCalculatorSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmiCalculatorSettings
        fields = (
            "loan_percentage", "subsidy_before_loan", "tenure_min_years",
            "tenure_max_years", "tenure_default_years", "daily_saving_divisor",
            "loan_amount_min", "loan_amount_max", "loan_step", "rate_max",
            "default_interest_rate", "panel_life_years", "updated_at",
        )
        read_only_fields = ("updated_at",)

    def validate(self, attrs):
        def resolved(name):
            return attrs.get(name, getattr(self.instance, name, None))

        pct = resolved("loan_percentage")
        if pct is not None and not (0 < pct <= 100):
            raise serializers.ValidationError(
                {"loan_percentage": "Must be greater than 0 and at most 100."}
            )

        lo, hi = resolved("tenure_min_years"), resolved("tenure_max_years")
        default = resolved("tenure_default_years")
        if lo is not None and hi is not None and lo > hi:
            raise serializers.ValidationError(
                {"tenure_max_years": "Maximum tenure must be at least the minimum."}
            )
        if default is not None and lo is not None and hi is not None:
            if not (lo <= default <= hi):
                raise serializers.ValidationError(
                    {"tenure_default_years": "Default tenure must fall inside the allowed range."}
                )

        loan_lo, loan_hi = resolved("loan_amount_min"), resolved("loan_amount_max")
        if loan_lo is not None and loan_hi is not None and loan_lo > loan_hi:
            raise serializers.ValidationError(
                {"loan_amount_max": "Maximum loan must be at least the minimum."}
            )

        if resolved("daily_saving_divisor") in (0, None):
            raise serializers.ValidationError(
                {"daily_saving_divisor": "Must be greater than zero."}
            )
        return attrs


class EmiBankSerializer(serializers.ModelSerializer):
    slug = serializers.SlugField(max_length=64, required=False)

    class Meta:
        model = EmiBank
        fields = (
            "id", "name", "abbr", "slug", "logo_bg", "interest_rate",
            "min_loan", "max_loan", "upfront_requirement", "eligibility",
            "cibil_required", "processing_fee_percent", "processing_fee_note",
            "approval_min_days", "approval_max_days", "max_tenure_years",
            "features", "best_for", "is_recommended", "sort_order",
            "is_active", "created_at", "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")

    def validate_features(self, value):
        if not isinstance(value, list) or not all(isinstance(v, str) for v in value):
            raise serializers.ValidationError("Features must be a list of strings.")
        return [v.strip() for v in value if v.strip()]

    def validate(self, attrs):
        def resolved(name):
            return attrs.get(name, getattr(self.instance, name, None))

        lo, hi = resolved("min_loan"), resolved("max_loan")
        if lo is not None and hi is not None and hi and lo > hi:
            raise serializers.ValidationError(
                {"max_loan": "Maximum loan must be at least the minimum."}
            )

        d_lo, d_hi = resolved("approval_min_days"), resolved("approval_max_days")
        if d_lo is not None and d_hi is not None and d_hi and d_lo > d_hi:
            raise serializers.ValidationError(
                {"approval_max_days": "Must be at least the minimum approval days."}
            )
        return attrs

    def create(self, validated_data):
        validated_data.setdefault("slug", self._auto_slug(validated_data.get("name", "")))
        return super().create(validated_data)

    @staticmethod
    def _auto_slug(name):
        from django.utils.text import slugify

        base = slugify(name)[:56] or "bank"
        slug, n = base, 2
        while EmiBank.objects.filter(slug=slug).exists():
            slug = f"{base}-{n}"
            n += 1
        return slug
