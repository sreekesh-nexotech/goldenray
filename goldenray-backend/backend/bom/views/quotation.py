"""The BOM calculator's quotation step: POST /bom/api/quotation/.

The calculator page (/bom/calculator/) prices a system; this turns that same
configuration into the customer's quotation PDF. It is the website's quotation
document — rendered by the Next.js frontend's /fe-api/quotation/pdf routes —
fed with the BOM's own figures instead of the website calculator's estimates:

  * the three packages on page 5 are the BOM engine's real price for each tier
    (same configuration, tier changed), and the summary describes the tier the
    sales person configured;
  * a hybrid quote compares battery options instead of tiers: the configured
    tier with no battery, one battery and two batteries;
  * the subsidy is the one the calculator applied;
  * page 8's savings graph uses the website calculator's formula, anchored on
    the quoted price;
  * page 6 shows the testimonials the sales person picked from the library.

Only a superuser can reach it — the same people who can open the calculator.
"""

import base64
import json
import mimetypes
from decimal import ROUND_HALF_UP, Decimal
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from django.conf import settings
from django.http import HttpResponse
from django.test import RequestFactory
from rest_framework import status as drf_status
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import BasePermission
from rest_framework.response import Response
from rest_framework.views import APIView

from bom.calculator import BomCalculator
from bom.models import QuotationSettings, QuotationTestimonial
from bom.models.quotation_testimonial import DEFAULT_TESTIMONIAL_PHOTO_URL
from bom.views.api import BomCalculateView, BomUnavailable
from goldenray.models import SolarInstallationNew
from goldenray.utils import emi as emi_engine
from goldenray.utils import savings_graph
from goldenray.views.customer_installation_views import InstallationStatsByPincodeAPIView

#: BOM tier → the package it is sold as in the quotation document.
PACKAGE_FOR_TIER = {"premium": "premium", "value": "smart", "base": "basic"}
#: Hybrid BOM battery config → the option it is sold as in the hybrid document.
OPTION_FOR_BATTERY = {"0": "noBattery", "1": "oneBattery", "2": "twoBattery"}
TIER_LABELS = {"premium": "Premium", "value": "Value", "base": "Base"}
SYSTEM_LABELS = {"ongrid": "On-Grid", "hybrid": "Hybrid"}
LANGUAGES = {"English", "Malayalam"}
PROPERTY_TYPES = {"residential", "commercial"}
MAX_TESTIMONIALS = 3
#: Chrome rendering 12 pages; nginx in front of the calculator allows 60 s.
RENDER_TIMEOUT_S = 55
#: The quotation's loan tenure (the EMI calculator's own engine prices it).
EMI_TENURE_YEARS = 10


class IsSuperuser(BasePermission):
    """The calculator page itself is superuser-only (see views/calculator.py)."""

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_superuser)


def _graph(bill, property_type, initial_cost, subsidy):
    """Page 8's 25-year curves, by the website calculator's formula."""
    cycles = savings_graph.bill_cycles_per_year(property_type)
    loan = 0
    bill_range = savings_graph.bill_range_for(bill)
    if bill_range is not None:
        row = SolarInstallationNew.objects.filter(bill_range=bill_range, type__iexact=property_type).first()
        if row:
            loan = savings_graph.parse_loan_available(row.loan_available)
    return {
        "labels": [f"Year {y}" for y in savings_graph.GRAPH_YEARS],
        "datasets": [
            {"data": savings_graph.without_solar(bill, cycles)},
            {"data": savings_graph.with_solar(initial_cost, loan, cycles, subsidy)},
        ],
    }


def _round(value):
    """Half-up to the rupee, as the website's figures are (JS Math.round)."""
    return int(Decimal(str(value)).quantize(Decimal("1"), rounding=ROUND_HALF_UP))


def _embedded(field_file):
    """An uploaded file as a data: URL.

    The PDF is rendered by a browser inside the frontend, which may not be
    able to fetch this site's /media/ URLs (the public host is not always
    reachable from inside the server) — so uploads travel with the quotation.
    """
    try:
        with field_file.open("rb") as fh:
            payload = base64.b64encode(fh.read()).decode("ascii")
    except (OSError, ValueError):
        return ""
    mime = mimetypes.guess_type(field_file.name)[0] or "image/jpeg"
    return f"data:{mime};base64,{payload}"


def _financing(kw, totals, subsidy):
    """Each package through the EMI calculator's engine — the website's own policy."""
    out = {}
    for package, total in totals.items():
        b = emi_engine.quotation_breakdown(
            capacity_kw=kw, system_cost=total, subsidy=min(subsidy, total), tenure_years=EMI_TENURE_YEARS,
        )
        out[package] = {
            "downPaymentPercent": b["down_payment_percent"],
            "downPayment": _round(b["down_payment"]),
            "financed": _round(b["loan_amount"]),
            "rate": b["interest_rate"],
            "emi": _round(b["emi_per_month"]),
            "daily": _round(b["daily_amount"]),
        }
    return out


def _testimonials(ids):
    """The chosen testimonials in order, topped up from the library to three.

    Page 6 always has three cards; picking fewer fills the rest with the
    library's next active testimonials rather than repeating one.
    """
    active = list(QuotationTestimonial.objects.filter(is_active=True))
    by_id = {t.pk: t for t in active}
    rows = [by_id[i] for i in ids if i in by_id]
    rows += [t for t in active if t not in rows][: MAX_TESTIMONIALS - len(rows)]
    return [
        {
            "id": t.pk,
            "name": t.name,
            "location": t.location,
            "system_label": t.system_label,
            "installed_on": t.installed_on.isoformat(),
            "quote": t.quote,
            "quote_ml": t.quote_ml,
            "photo_src": (_embedded(t.photo) if t.photo else "") or t.photo_url or DEFAULT_TESTIMONIAL_PHOTO_URL,
            "bill_before": t.bill_before,
            "bill_after": t.bill_after,
        }
        for t in rows
    ]


def _document_settings():
    """The page-12 offer banner, in the shape the document reads."""
    s = QuotationSettings.load()
    return {
        "offer": {
            "enabled": s.offer_enabled,
            "title": s.offer_title,
            "description": s.offer_description,
            "details": s.offer_details,
            "titleMl": s.offer_title_ml,
            "descriptionMl": s.offer_description_ml,
            "detailsMl": s.offer_details_ml,
            "validFrom": s.offer_valid_from.isoformat() if s.offer_valid_from else "",
            "validUntil": s.offer_valid_until.isoformat() if s.offer_valid_until else "",
            "imageUrl": (_embedded(s.offer_image) if s.offer_image else "") or s.offer_image_url,
        }
    }


def _installation_stats(pincode):
    """The website's neighbourhood install counts for page 6, or None."""
    request = RequestFactory().get("/api/installation-stats/", {"pincode": pincode})
    try:
        response = InstallationStatsByPincodeAPIView.as_view()(request)
    except Exception:  # noqa: BLE001 — optional; the page falls back to estimates
        return None
    return dict(response.data) if getattr(response, "status_code", 500) == 200 else None


class QuotationPdfView(APIView):
    """
    Body:
      config   — exactly what the calculator page POSTs to /bom/api/calculate/
      customer — name, phone, address, pincode, monthly_bill, property_type,
                 language ("English" | "Malayalam"), sales_person,
                 testimonial_ids (up to 3 library ids, in display order)
    Returns the PDF (`Customer Name_5kW.pdf`).
    """

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsSuperuser]

    def post(self, request):
        config = request.data.get("config") or {}
        customer = request.data.get("customer") or {}

        engine = BomCalculateView()
        errors = engine._validate(config) + self._validate_customer(customer)
        if config.get("sys_type") == "upgrade":
            errors.append("Quotations are for new on-grid or hybrid systems, not upgrades.")
        if errors:
            return Response({"errors": errors}, status=drf_status.HTTP_400_BAD_REQUEST)

        params = engine._coerce(config)
        hybrid = params["sys_type"] == "hybrid"
        if hybrid and params["bat_config"] not in OPTION_FOR_BATTERY:
            return Response(
                {"errors": ["Battery config must be 0, 1 or 2 batteries."]},
                status=drf_status.HTTP_400_BAD_REQUEST,
            )
        # One run per package: the configured one is the quote, the other two
        # are what the same configuration costs as the other packages — another
        # tier on-grid, another battery count on a hybrid.
        if hybrid:
            runs = {option: {**params, "bat_config": bat} for bat, option in OPTION_FOR_BATTERY.items()}
            quoted_package = OPTION_FOR_BATTERY[params["bat_config"]]
        else:
            runs = {package: {**params, "tier": tier} for tier, package in PACKAGE_FOR_TIER.items()}
            quoted_package = PACKAGE_FOR_TIER[params["tier"]]
        try:
            results = {package: engine.compute(run) for package, run in runs.items()}
        except BomUnavailable as exc:
            return Response({"error": exc.message}, status=exc.status)

        quoted = results[quoted_package]
        pricing = quoted["pricing"]
        kw = BomCalculator._size_to_kw(str(quoted["meta"]["size"]))
        subsidy = float(pricing["subsidy_amt"] or 0)
        gross = float(pricing["final_price"])
        bill = int(customer["monthly_bill"])
        property_type = customer.get("property_type", "residential")
        sales_person = (customer.get("sales_person") or "").strip() or (
            request.user.get_full_name() or request.user.username
        )

        quotation = {
            "customerName": customer["name"].strip(),
            "address": (customer.get("address") or "").strip(),
            "phoneNumber": customer["phone"].strip(),
            "preferredLanguage": customer["language"],
            "subsidyEligibility": "Eligible (DCR)" if subsidy > 0 else "Not Eligible (Non-DCR)",
            "pincode": customer["pincode"].strip(),
            "monthlyBill": bill,
            "systemSize": f"{kw:g} kW",
            # The document's legacy contract; the exact figures below win.
            "systemPrice": max(0, gross - subsidy),
            "emiPerMonth": 0,
            "graphData": _graph(bill, property_type, gross, subsidy),
            # "hybrid" switches pages 5 and 7 to the battery-option layout;
            # packageTotals / financing are then keyed by OPTION_FOR_BATTERY.
            "systemType": params["sys_type"],
            "packageTotals": {k: float(r["pricing"]["final_price"]) for k, r in results.items()},
            "quotedPackage": quoted_package,
            "subsidyAmount": subsidy,
            "testimonialIds": [int(i) for i in customer.get("testimonial_ids") or []],
            # Everything the page would otherwise fetch, so the PDF does not
            # depend on the renderer reaching the API from inside the server.
            "financing": _financing(
                kw, {k: float(r["pricing"]["final_price"]) for k, r in results.items()}, subsidy,
            ),
            "testimonials": _testimonials([int(i) for i in customer.get("testimonial_ids") or []]),
            "documentSettings": _document_settings(),
            "installationStats": _installation_stats(customer["pincode"].strip()),
            "bom": {
                "lines": [
                    {"name": l.get("name", ""), "qty": l.get("qty", 0), "unit": l.get("unit", "nos")}
                    for l in quoted["bom_lines"]
                ],
                "basePrice": float(pricing["customer_price"]),
                "addOnTotal": 0,
                "discountAmt": float(pricing["discount_amt"] or 0),
                "discountLabel": pricing["discount_label"] or "",
                "finalPrice": gross,
                "subsidy": subsidy,
                "subsidyLabel": pricing["subsidy_label"] or "",
                "priceAfterSubsidy": float(pricing["price_after_subsidy"]),
                "customerName": customer["name"].strip(),
                "salesPerson": sales_person,
                "systemLabel": f"{SYSTEM_LABELS.get(params['sys_type'], '')} {kw:g}kW".strip(),
                "tierLabel": TIER_LABELS[params["tier"]],
            },
        }
        return self._render(quotation)

    def _validate_customer(self, c):
        errors = []
        if not str(c.get("name") or "").strip():
            errors.append("Customer name is required.")
        phone = str(c.get("phone") or "").strip()
        if not (phone.isdigit() and len(phone) == 10):
            errors.append("Phone number must be 10 digits.")
        pincode = str(c.get("pincode") or "").strip()
        if not (pincode.isdigit() and len(pincode) == 6):
            errors.append("Pincode must be 6 digits.")
        try:
            if int(c.get("monthly_bill")) <= 0:
                raise ValueError
        except (TypeError, ValueError):
            errors.append("Monthly bill must be a positive number.")
        if c.get("language") not in LANGUAGES:
            errors.append("Language must be English or Malayalam.")
        if c.get("property_type", "residential") not in PROPERTY_TYPES:
            errors.append("Property type must be residential or commercial.")
        ids = c.get("testimonial_ids") or []
        if not isinstance(ids, list) or len(ids) > MAX_TESTIMONIALS:
            errors.append(f"Pick at most {MAX_TESTIMONIALS} testimonials.")
        else:
            try:
                ids = [int(i) for i in ids]
            except (TypeError, ValueError):
                errors.append("Testimonial ids must be numbers.")
            else:
                found = set(QuotationTestimonial.objects.filter(pk__in=ids, is_active=True).values_list("pk", flat=True))
                if set(ids) - found:
                    errors.append("A chosen testimonial no longer exists or is inactive.")
        return errors

    def _render(self, quotation):
        route = "pdf-malayalam" if quotation["preferredLanguage"] == "Malayalam" else "pdf"
        url = f"{settings.QUOTATION_RENDERER_URL}/fe-api/quotation/{route}?variant=customer"
        req = Request(
            url,
            data=json.dumps(quotation).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        try:
            with urlopen(req, timeout=RENDER_TIMEOUT_S) as upstream:
                pdf = upstream.read()
                disposition = upstream.headers.get("Content-Disposition", 'attachment; filename="quotation.pdf"')
        except HTTPError as exc:
            return Response(
                {"error": f"The quotation renderer failed ({exc.code})."},
                status=drf_status.HTTP_502_BAD_GATEWAY,
            )
        except (URLError, TimeoutError, OSError) as exc:
            return Response(
                {"error": f"The quotation renderer is unreachable: {getattr(exc, 'reason', exc)}"},
                status=drf_status.HTTP_502_BAD_GATEWAY,
            )
        response = HttpResponse(pdf, content_type="application/pdf")
        response["Content-Disposition"] = disposition
        response["Cache-Control"] = "no-store"
        return response
