from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from ...models import SolarInstallationNew
from ...permissions import ApiMethodPermission, non_authenticated_view
from ...utils.finance import emi_calc


DEFAULT_TENURE_YEARS = 10
DEFAULT_INTEREST_RATE = 9.5


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


class EMICalculatorAPIView(APIView):
    """Public EMI calculator backed by SolarInstallationNew rows.

    Inputs (JSON body):
      - power_capacity (float)  : kW capacity to look up; OR
      - installation_id (int)   : SolarInstallationNew PK.
      - property_type (str)     : disambiguates rows when multiple share a capacity.
      - tenure_years (int)      : loan tenure, defaults to 10.
      - interest_rate (float)   : optional override of the row's interest_rate.
      - apply_subsidy (bool)    : if true (default) use final_cost as principal,
                                  otherwise use total_cost.
      - principal (float)       : direct principal override; bypasses subsidy logic.
    """

    permission_classes = [ApiMethodPermission]

    @non_authenticated_view
    def post(self, request):
        data = request.data or {}

        try:
            power_capacity = _to_float(data.get("power_capacity"))
            installation_id = _to_int(data.get("installation_id") or data.get("id"))
            tenure_years = _to_int(data.get("tenure_years")) or DEFAULT_TENURE_YEARS
            interest_override = _to_float(data.get("interest_rate"))
            principal_override = _to_float(data.get("principal"))
        except (TypeError, ValueError):
            return Response(
                {"error": "Invalid numeric value in request"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        property_type = data.get("property_type")
        apply_subsidy = _to_bool(data.get("apply_subsidy"), default=True)

        if installation_id is None and power_capacity is None:
            return Response(
                {"error": "Provide either installation_id or power_capacity"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if tenure_years <= 0:
            return Response(
                {"error": "tenure_years must be a positive integer"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        row = self._fetch_installation(installation_id, power_capacity, property_type)
        # If the caller already supplied a principal AND interest_rate, the row
        # is purely a source of display metadata. Treat a missing row as a soft
        # miss in that case so the EMI calculator UI still works for any
        # capacity even if its row hasn't been seeded yet.
        row_missing = isinstance(row, Response)
        can_self_serve = principal_override is not None and interest_override is not None
        if row_missing and not can_self_serve:
            return row
        if row_missing:
            row = None

        if principal_override is not None:
            principal = principal_override
            principal_source = "override"
        elif apply_subsidy and row.final_cost is not None:
            principal = float(row.final_cost)
            principal_source = "final_cost"
        else:
            principal = float(row.total_cost)
            principal_source = "total_cost"

        if interest_override is not None:
            interest_rate = interest_override
        elif row is not None and row.interest_rate is not None:
            interest_rate = float(row.interest_rate)
        else:
            interest_rate = DEFAULT_INTEREST_RATE

        if principal <= 0:
            return Response(
                {"error": "Resolved principal must be greater than zero"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        emi = emi_calc(
            principal=principal,
            interest_rate=interest_rate,
            tenure_years=tenure_years,
        )

        if row is not None:
            row_display = {
                "installation_id": row.id,
                "power_capacity_kW": row.power_capacity,
                "property_type": row.type,
                "total_cost": float(row.total_cost),
                "total_subsidy": float(row.total_subsidy),
                "final_cost": float(row.final_cost) if row.final_cost is not None else None,
            }
        else:
            row_display = {
                "installation_id": None,
                "power_capacity_kW": power_capacity,
                "property_type": property_type,
                "total_cost": None,
                "total_subsidy": None,
                "final_cost": None,
            }

        result = {
            **row_display,
            "apply_subsidy": apply_subsidy,
            "principal": round(principal, 2),
            "principal_source": principal_source,
            "interest_rate": interest_rate,
            "tenure_years": tenure_years,
            "tenure_months": tenure_years * 12,
            "emi_per_month": emi["emi_per_month"],
            "total_payment": emi["total_payment"],
            "total_interest": emi["total_interest"],
        }
        return Response(result, status=status.HTTP_200_OK)

    @staticmethod
    def _fetch_installation(installation_id, power_capacity, property_type):
        qs = SolarInstallationNew.objects.all()
        if installation_id is not None:
            try:
                return qs.get(pk=installation_id)
            except SolarInstallationNew.DoesNotExist:
                return Response(
                    {"error": "Installation not found for the given id"},
                    status=status.HTTP_404_NOT_FOUND,
                )

        qs = qs.filter(power_capacity=power_capacity)
        if property_type:
            qs = qs.filter(type__iexact=property_type)

        matches = list(qs[:2])
        if not matches:
            return Response(
                {"error": "No installation found for the given power_capacity"},
                status=status.HTTP_404_NOT_FOUND,
            )
        if len(matches) > 1:
            return Response(
                {
                    "error": "Multiple installations match power_capacity; "
                             "provide property_type to disambiguate"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        return matches[0]
