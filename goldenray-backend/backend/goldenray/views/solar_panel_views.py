from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import SolarPanel
from ..serializers.solar_panel_serializer import SolarPanelSerializer
from ..permissions import ApiMethodPermission, non_authenticated_view
from django.db.models import Q


class SolarPanelAPIView(APIView):
    permission_classes = [ApiMethodPermission]

    @non_authenticated_view
    def get(self, request, pk=None):
        if pk:
            try:
                panel = SolarPanel.objects.get(pk=pk)
                serializer = SolarPanelSerializer(panel)
                return Response({"data": serializer.data})
            except SolarPanel.DoesNotExist:
                return Response({"error": "Solar panel not found"}, status=status.HTTP_404_NOT_FOUND)

        # Get all panels with optional filtering
        panels = SolarPanel.objects.all()

        # Filter by panel types (comma-separated)
        panel_types = request.GET.get('type', None)
        if panel_types:
            type_list = [t.strip() for t in panel_types.split(',')]
            panels = panels.filter(panel_type__in=type_list)

        # Filter by ratings (comma-separated)
        ratings = request.GET.get('rating', None)
        if ratings:
            rating_list = [r.strip() for r in ratings.split(',')]
            panels = panels.filter(overall_rating__in=rating_list)

        # Filter by efficiency range
        min_efficiency = request.GET.get('minEfficiency', None)
        if min_efficiency:
            panels = panels.filter(efficiency__gte=float(min_efficiency))

        max_efficiency = request.GET.get('maxEfficiency', None)
        if max_efficiency:
            panels = panels.filter(efficiency__lte=float(max_efficiency))

        # Filter by product warranty
        min_product_warranty = request.GET.get('minProductWarranty', None)
        if min_product_warranty:
            panels = panels.filter(product_warranty__gte=int(min_product_warranty))

        # Filter by performance warranty
        min_performance_warranty = request.GET.get('minPerformanceWarranty', None)
        if min_performance_warranty:
            panels = panels.filter(performance_warranty__gte=int(min_performance_warranty))

        # Filter by brands (comma-separated)
        brands = request.GET.get('brand', None)
        if brands:
            brand_list = [b.strip() for b in brands.split(',')]
            panels = panels.filter(brand__in=brand_list)

        # Filter by Kerala Climate Score
        min_kerala_score = request.GET.get('minKeralaScore', None)
        if min_kerala_score:
            panels = panels.filter(kerala_climate_score__gte=int(min_kerala_score))

        # Filter by IDs (comma-separated)
        ids = request.GET.get('ids', None)
        if ids:
            id_list = [int(i.strip()) for i in ids.split(',')]
            panels = panels.filter(id__in=id_list)

        # Sorting
        sort_field = request.GET.get('sort', 'kerala_climate_score')
        sort_order = request.GET.get('order', 'desc')

        # Map frontend sort values to model fields
        sort_mapping = {
            'topRated': 'kerala_climate_score',
            'keralaClimateScore': 'kerala_climate_score',
            'efficiency': 'efficiency',
            'price': 'price_range',  # Note: string sorting for price range
            'warranty': 'performance_warranty',
        }

        sort_field = sort_mapping.get(sort_field, sort_field)

        if sort_order == 'desc':
            sort_field = f'-{sort_field}'

        panels = panels.order_by(sort_field)

        serializer = SolarPanelSerializer(panels, many=True)
        return Response({
            "data": serializer.data,
            "meta": {
                "total": panels.count()
            }
        })

    def post(self, request):
        serializer = SolarPanelSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"data": serializer.data}, status=status.HTTP_201_CREATED)
        return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            panel = SolarPanel.objects.get(pk=pk)
        except SolarPanel.DoesNotExist:
            return Response({"error": "Solar panel not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = SolarPanelSerializer(panel, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"data": serializer.data})
        return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            panel = SolarPanel.objects.get(pk=pk)
        except SolarPanel.DoesNotExist:
            return Response({"error": "Solar panel not found"}, status=status.HTTP_404_NOT_FOUND)

        panel.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
