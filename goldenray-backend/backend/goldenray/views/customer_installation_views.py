from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Count, Q
from datetime import datetime
from ..models import CustomerInstallation, Pincode
from ..serializers.customer_installation_serializer import CustomerInstallationSerializer
from ..permissions import ApiMethodPermission, non_authenticated_view


class CustomerInstallationAPIView(APIView):
    """
    API endpoint for customer installations
    """
    
    def get(self, request, pk=None):
        if pk:
            # Get single installation
            try:
                installation = CustomerInstallation.objects.get(pk=pk)
                serializer = CustomerInstallationSerializer(installation)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except CustomerInstallation.DoesNotExist:
                return Response(
                    {"error": "Installation not found"},
                    status=status.HTTP_404_NOT_FOUND
                )
        else:
            # List all installations
            installations = CustomerInstallation.objects.all().order_by('-installation_date')
            serializer = CustomerInstallationSerializer(installations, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        serializer = CustomerInstallationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, pk):
        try:
            installation = CustomerInstallation.objects.get(pk=pk)
        except CustomerInstallation.DoesNotExist:
            return Response(
                {"error": "Installation not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = CustomerInstallationSerializer(installation, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        try:
            installation = CustomerInstallation.objects.get(pk=pk)
            installation.delete()
            return Response(
                {"message": "Installation deleted successfully"},
                status=status.HTTP_204_NO_CONTENT
            )
        except CustomerInstallation.DoesNotExist:
            return Response(
                {"error": "Installation not found"},
                status=status.HTTP_404_NOT_FOUND
            )


class InstallationStatsByPincodeAPIView(APIView):
    """
    Get installation statistics by pincode
    Returns counts for specific pincode and district
    """
    permission_classes = [ApiMethodPermission]
    
    @non_authenticated_view
    def get(self, request):
        pincode = request.query_params.get('pincode', None)
        
        if not pincode:
            return Response(
                {"error": "Pincode parameter is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get district from pincode table
        district_name = None
        try:
            pincode_obj = Pincode.objects.filter(pincode=pincode).first()
            if pincode_obj:
                district_name = pincode_obj.district
        except Exception:
            pass
        
        # If district not found in DB, use fallback mapping
        if not district_name:
            district_name = self._get_district_fallback(pincode)
        
        # Count installations for this specific pincode (completed only)
        pincode_count = CustomerInstallation.objects.filter(
            pincode=pincode,
            status='completed'
        ).count()
        
        # Count installations for the district (completed only)
        district_count = 0
        if district_name:
            # Get all pincodes in this district
            district_pincodes = Pincode.objects.filter(
                district=district_name
            ).values_list('pincode', flat=True)
            
            district_count = CustomerInstallation.objects.filter(
                pincode__in=district_pincodes,
                status='completed'
            ).count()
        
        # Get installations in current year for the district
        current_year = datetime.now().year
        year_installations = 0
        if district_name:
            district_pincodes = Pincode.objects.filter(
                district=district_name
            ).values_list('pincode', flat=True)
            
            year_installations = CustomerInstallation.objects.filter(
                pincode__in=district_pincodes,
                status='completed',
                installation_date__year=current_year
            ).count()
        
        return Response({
            "pincode": pincode,
            "district": district_name,
            "pincode_installations": pincode_count,
            "district_installations": district_count,
            "current_year_installations": year_installations,
            "year": current_year
        }, status=status.HTTP_200_OK)
    
    def _get_district_fallback(self, pincode):
        """Fallback district mapping for Kerala pincodes"""
        prefix = pincode[:3] if len(pincode) >= 3 else ""
        district_map = {
            "688": "Alappuzha", "689": "Alappuzha",
            "690": "Kollam", "691": "Kollam",
            "695": "Thiruvananthapuram",
            "682": "Ernakulam", "683": "Ernakulam", "684": "Ernakulam",
            "680": "Thrissur", "681": "Thrissur",
            "673": "Kozhikode", "674": "Kozhikode",
            "670": "Kannur", "671": "Kannur",
            "676": "Malappuram", "677": "Malappuram",
            "678": "Palakkad", "679": "Palakkad",
            "685": "Idukki",
            "686": "Kottayam", "687": "Kottayam",
        }
        return district_map.get(prefix, "Kerala")
