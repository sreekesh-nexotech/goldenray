"""Public EMI calculator endpoints.

Both are anonymous — they are what the marketing site renders from. Everything
they return is derived from the admin-managed EmiConfig models, so the Studio
is the single source of truth and the UI can no longer drift from the API.
"""

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from ...models import EmiBank, EmiCalculatorSettings, EmiSystemSize
from ...permissions import ApiMethodPermission, non_authenticated_view
from ...serializers.emi_config_serializer import (
    EmiBankSerializer,
    EmiCalculatorSettingsSerializer,
    EmiSystemSizeSerializer,
)
from ...utils import emi as emi_engine


def _to_float(value):
    if value is None or value == "":
        return None
    return float(value)


def _to_int(value):
    if value is None or value == "":
        return None
    return int(value)


def _to_bool(value, default=True):
    if value is None:
        return default
    if isinstance(value, bool):
        return value
    return str(value).strip().lower() in {"1", "true", "yes", "y"}


class EMICalculatorConfigAPIView(APIView):
    """GET the whole calculator configuration in one call.

    The frontend loads this once on mount so the sliders, tiles and bank cards
    render from admin data instead of hard-coded arrays.
    """

    permission_classes = [ApiMethodPermission]

    @non_authenticated_view
    def get(self, request):
        settings_row = EmiCalculatorSettings.load()
        sizes = EmiSystemSize.objects.filter(is_active=True)
        banks = EmiBank.objects.filter(is_active=True)

        return Response(
            {
                "settings": EmiCalculatorSettingsSerializer(settings_row).data,
                "system_sizes": EmiSystemSizeSerializer(sizes, many=True).data,
                "banks": EmiBankSerializer(banks, many=True).data,
            },
            status=status.HTTP_200_OK,
        )


class EMICalculatorAPIView(APIView):
    """POST a system size (+ optional customer adjustments) → full EMI breakdown.

    Inputs (JSON body):
      - size_id (int) or capacity_kw (float) : which system size to price.
      - tenure_years (int)   : 1–10 by default; falls back to the configured default.
      - interest_rate (float): customer adjustment. Clamped up to the band's
                               floor, and ignored entirely on a locked band.
      - system_cost (float)  : overrides the size's default price; clamped to
                               the size's configured price slider band.
      - down_payment_percent (float): overrides the default (minimum) down
                               payment %; clamped to the configured band.
      - apply_down_payment (bool) : default true. Off means no down payment
                               is deducted, regardless of the slider.
      - apply_subsidy (bool) : default true. Off means the loan is sized
                               without deducting the subsidy.
    """

    permission_classes = [ApiMethodPermission]

    @non_authenticated_view
    def post(self, request):
        data = request.data or {}

        try:
            capacity_kw = _to_float(data.get("capacity_kw") or data.get("power_capacity"))
            size_id = _to_int(data.get("size_id") or data.get("installation_id") or data.get("id"))
            tenure_years = _to_int(data.get("tenure_years"))
            interest_override = _to_float(data.get("interest_rate"))
            price_override = _to_float(data.get("system_cost") or data.get("price"))
            down_payment_override = _to_float(data.get("down_payment_percent"))
        except (TypeError, ValueError):
            return Response(
                {"error": "Invalid numeric value in request"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        apply_down_payment = _to_bool(data.get("apply_down_payment"), default=True)
        apply_subsidy = _to_bool(data.get("apply_subsidy"), default=True)

        if size_id is None and capacity_kw is None:
            return Response(
                {"error": "Provide either size_id or capacity_kw"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            breakdown = emi_engine.calculate(
                capacity_kw=capacity_kw,
                size_id=size_id,
                tenure_years=tenure_years,
                interest_rate_override=interest_override,
                system_cost_override=price_override,
                down_payment_percent_override=down_payment_override,
                apply_down_payment=apply_down_payment,
                apply_subsidy=apply_subsidy,
            )
        except ValueError as exc:
            return Response({"error": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(_with_legacy_keys(breakdown), status=status.HTTP_200_OK)


class EMIQuotationAPIView(APIView):
    """POST a quotation's package prices → the calculator's EMI for each.

    The quotation document prices its packages from the BOM, so it cannot use
    the size tiles above; it sends the prices and gets back exactly what the
    calculator's policy gives them (down payment, rate band, loan, EMI, daily).

    Body:
      - capacity_kw (float)      : the quoted system size
      - tenure_years (int)       : optional, defaults to 10 (the quotation's)
      - packages (object)        : {key: {"system_cost": float, "subsidy": float}},
                                   at most 6 packages
    """

    permission_classes = [ApiMethodPermission]
    MAX_PACKAGES = 6
    DEFAULT_TENURE_YEARS = 10

    @non_authenticated_view
    def post(self, request):
        data = request.data or {}
        packages = data.get("packages")
        if not isinstance(packages, dict) or not packages:
            return Response({"error": "packages must be a non-empty object"}, status=status.HTTP_400_BAD_REQUEST)
        if len(packages) > self.MAX_PACKAGES:
            return Response({"error": f"At most {self.MAX_PACKAGES} packages"}, status=status.HTTP_400_BAD_REQUEST)

        settings_row = EmiCalculatorSettings.load()
        try:
            capacity_kw = _to_float(data.get("capacity_kw"))
            tenure = _to_int(data.get("tenure_years"))
        except (TypeError, ValueError):
            return Response({"error": "Invalid numeric value in request"}, status=status.HTTP_400_BAD_REQUEST)
        if capacity_kw is None or capacity_kw <= 0:
            return Response({"error": "capacity_kw is required"}, status=status.HTTP_400_BAD_REQUEST)
        tenure = self.DEFAULT_TENURE_YEARS if tenure is None else tenure
        if not settings_row.tenure_min_years <= tenure <= settings_row.tenure_max_years:
            return Response(
                {"error": f"tenure_years must be between {settings_row.tenure_min_years} and {settings_row.tenure_max_years}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        result = {}
        for key, package in packages.items():
            if not isinstance(package, dict):
                return Response({"error": f"packages.{key} must be an object"}, status=status.HTTP_400_BAD_REQUEST)
            try:
                result[str(key)[:32]] = emi_engine.quotation_breakdown(
                    capacity_kw=capacity_kw,
                    system_cost=_to_float(package.get("system_cost")),
                    subsidy=_to_float(package.get("subsidy")) or 0,
                    tenure_years=tenure,
                    settings=settings_row,
                )
            except (TypeError, ValueError, ArithmeticError) as exc:
                return Response({"error": f"packages.{key}: {exc}"}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"tenure_years": tenure, "packages": result}, status=status.HTTP_200_OK)


def _with_legacy_keys(breakdown):
    """Flatten the headline numbers alongside the nested breakdown.

    Older callers read `emi_per_month` / `principal` / `interest_rate` off the
    top level; keeping them costs nothing and avoids a breaking change.
    """
    system = breakdown["system"]
    subsidy = breakdown["subsidy"]
    loan = breakdown["loan"]
    interest = breakdown["interest"]
    tenure = breakdown["tenure"]
    result = breakdown["result"]

    return {
        **breakdown,
        "power_capacity_kW": system["capacity_kw"],
        "total_cost": system["system_cost"],
        "total_subsidy": subsidy["amount"],
        "final_cost": subsidy["net_cost_after_subsidy"],
        "principal": loan["amount"],
        "interest_rate": interest["rate"],
        "interest_rate_min": interest["min_rate"],
        "interest_rate_locked": interest["is_locked"],
        "tenure_years": tenure["years"],
        "tenure_months": tenure["months"],
        "emi_per_month": result["emi_per_month"],
        "total_payment": result["total_payment"],
        "total_interest": result["total_interest"],
        "daily_amount": result["daily_amount"],
    }
