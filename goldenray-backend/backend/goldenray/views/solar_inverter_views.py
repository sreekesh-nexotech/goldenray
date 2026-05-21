from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import SolarInverter
from ..serializers.solar_inverter_serializer import SolarInverterSerializer
from ..permissions import ApiMethodPermission, non_authenticated_view


class SolarInverterAPIView(APIView):
    permission_classes = [ApiMethodPermission]

    @non_authenticated_view
    def get(self, request, pk=None):
        if pk:
            try:
                inverter = SolarInverter.objects.get(pk=pk)
                serializer = SolarInverterSerializer(inverter)
                return Response({"data": serializer.data})
            except SolarInverter.DoesNotExist:
                return Response({"error": "Solar inverter not found"}, status=status.HTTP_404_NOT_FOUND)

        inverters = SolarInverter.objects.all()

        # Filter by inverter types (comma-separated)
        types = request.GET.get('type', None)
        if types:
            type_list = [t.strip() for t in types.split(',')]
            inverters = inverters.filter(inverter_type__in=type_list)

        # Filter by rating tier (comma-separated: premium, mid-range, value)
        tiers = request.GET.get('tier', None)
        if tiers:
            tier_list = [t.strip() for t in tiers.split(',')]
            inverters = inverters.filter(rating_tier__in=tier_list)

        # Filter by overall rating (comma-separated)
        ratings = request.GET.get('rating', None)
        if ratings:
            rating_list = [r.strip() for r in ratings.split(',')]
            inverters = inverters.filter(overall_rating__in=rating_list)

        # Filter by minimum standard warranty
        min_warranty = request.GET.get('minWarranty', None)
        if min_warranty:
            inverters = inverters.filter(warranty_years__gte=int(min_warranty))

        # Filter by extendable warranty up to N years
        extendable_to = request.GET.get('extendableTo', None)
        if extendable_to:
            inverters = inverters.filter(extendable_warranty_years__gte=int(extendable_to))

        # Filter by brands (comma-separated)
        brands = request.GET.get('brand', None)
        if brands:
            brand_list = [b.strip() for b in brands.split(',')]
            inverters = inverters.filter(brand__in=brand_list)

        # Filter by Kerala Climate Score
        min_kerala_score = request.GET.get('minKeralaScore', None)
        if min_kerala_score:
            inverters = inverters.filter(kerala_climate_score__gte=int(min_kerala_score))

        # Filter by IDs (comma-separated)
        ids = request.GET.get('ids', None)
        if ids:
            id_list = [int(i.strip()) for i in ids.split(',')]
            inverters = inverters.filter(id__in=id_list)

        # Sorting
        sort_field = request.GET.get('sort', 'kerala_climate_score')
        sort_order = request.GET.get('order', 'desc')

        sort_mapping = {
            'topRated': 'kerala_climate_score',
            'keralaClimateScore': 'kerala_climate_score',
            'efficiency': 'maximum_efficiency',
            'price': 'price_range',
            'warranty': 'warranty_years',
        }

        sort_field = sort_mapping.get(sort_field, sort_field)

        if sort_order == 'desc':
            sort_field = f'-{sort_field}'

        inverters = inverters.order_by(sort_field)

        serializer = SolarInverterSerializer(inverters, many=True)
        return Response({
            "data": serializer.data,
            "meta": {
                "total": inverters.count()
            }
        })

    def post(self, request):
        serializer = SolarInverterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"data": serializer.data}, status=status.HTTP_201_CREATED)
        return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            inverter = SolarInverter.objects.get(pk=pk)
        except SolarInverter.DoesNotExist:
            return Response({"error": "Solar inverter not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = SolarInverterSerializer(inverter, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"data": serializer.data})
        return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            inverter = SolarInverter.objects.get(pk=pk)
        except SolarInverter.DoesNotExist:
            return Response({"error": "Solar inverter not found"}, status=status.HTTP_404_NOT_FOUND)

        inverter.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
