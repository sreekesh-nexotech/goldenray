"""Authoring endpoints for the EMI calculator configuration.

Mounted under /api/emi-admin/ and consumed by the Content Studio's
"EMI Calculator" screen. Reads need a Studio token granting ``emi: view`` and
writes ``emi: edit`` — the Phase 1 Roles matrix, carried in the token; see
goldenray/utils/studio_auth.py for how that is verified across services.
Anonymous visitors get the public subset from /api/emi-calculator/config/.
"""

from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from ...models import (
    EmiBank,
    EmiCalculatorSettings,
    EmiInterestRateRule,
    EmiSubsidyRule,
    EmiSystemSize,
)
from ...serializers.emi_config_serializer import (
    EmiBankSerializer,
    EmiCalculatorSettingsSerializer,
    EmiInterestRateRuleSerializer,
    EmiSubsidyRuleSerializer,
    EmiSystemSizeSerializer,
)
from ...utils.studio_auth import HasStudioModule

# §6.9 / §6.17: reads need `emi: view`, writes need `emi: edit`, straight from
# the Roles matrix carried in the Studio token.
EmiModule = HasStudioModule.for_("emi")


class _StudioViewSet(viewsets.ModelViewSet):
    """ModelViewSet with Studio auth and no DRF-level auth classes.

    DRF's default authentication would try to resolve the bearer token against
    *this* service's user table, where Studio users don't exist. Authorisation
    happens entirely in the permission class instead, which reads the Phase 1
    ``emi`` grant from the token.
    """

    authentication_classes = []
    permission_classes = [EmiModule]


class EmiSystemSizeViewSet(_StudioViewSet):
    """System sizes and their per-kW price."""

    queryset = EmiSystemSize.objects.all()
    serializer_class = EmiSystemSizeSerializer


class EmiSubsidyRuleViewSet(_StudioViewSet):
    """Subsidy amounts per capacity band."""

    queryset = EmiSubsidyRule.objects.all()
    serializer_class = EmiSubsidyRuleSerializer


class EmiInterestRateRuleViewSet(_StudioViewSet):
    """Interest-rate policy per capacity, system-cost and/or loan band."""

    queryset = EmiInterestRateRule.objects.all()
    serializer_class = EmiInterestRateRuleSerializer


class EmiBankViewSet(_StudioViewSet):
    """Banks shown in the comparison table."""

    queryset = EmiBank.objects.all()
    serializer_class = EmiBankSerializer


class EmiCalculatorSettingsAPIView(APIView):
    """The singleton settings row: GET to read, PATCH to update."""

    authentication_classes = []
    permission_classes = [EmiModule]

    def get(self, request):
        return Response(EmiCalculatorSettingsSerializer(EmiCalculatorSettings.load()).data)

    def patch(self, request):
        instance = EmiCalculatorSettings.load()
        serializer = EmiCalculatorSettingsSerializer(
            instance, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    # The Studio's save button sends a full document; accept PUT as well.
    def put(self, request):
        return self.patch(request)
