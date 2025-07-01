from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..twilio_utils import send_otp, verify_otp
from ..serializers.otp_serializer import SendOTPSerializer, VerifyOTPSerializer
from ..models import SentQuote
import uuid

class SendOTPAPIView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = SendOTPSerializer(data=request.data)
        if serializer.is_valid():
            phone_number = serializer.validated_data['phone_number']
            # Auto-prepend +91 if not present
            if not phone_number.startswith('+'):
                phone_number = '+91' + phone_number.lstrip('0')
            try:
                result = send_otp(phone_number)
                return Response({'status': result}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyOTPAPIView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        if serializer.is_valid():
            phone_number = serializer.validated_data['phone_number']
            # Auto-prepend +91 if not present
            if not phone_number.startswith('+'):
                phone_number = '+91' + phone_number.lstrip('0')
            code = serializer.validated_data['code']
            name = request.data.get('name', '')  # Get name from request data
            
            try:
                result = verify_otp(phone_number, code)
                if result == 'approved':
                    # Check if phone already exists in SentQuote
                    if SentQuote.objects.filter(phone=phone_number).exists():
                        return Response({
                            'status': 'approved',
                            'message': 'We already have your details! Our team will contact you soon.'
                        }, status=status.HTTP_200_OK)
                    try:
                        # Generate unique quote_id
                        quote_id = f"QUOTE_{uuid.uuid4().hex[:8].upper()}"
                        
                        # Create SentQuote record
                        sent_quote = SentQuote.objects.create(
                            quote_id=quote_id,
                            name=name,
                            phone=phone_number,
                            quote_url=f"/quote/{quote_id}",  # You can customize this URL
                            is_sent=False
                        )
                        
                        return Response({
                            'status': 'approved',
                            'message': 'OTP verified successfully. Your quote request has been recorded.',
                            'quote_id': quote_id
                        }, status=status.HTTP_200_OK)
                    except Exception as db_error:
                        # If database save fails, still return success for OTP verification
                        return Response({
                            'status': 'approved',
                            'message': 'OTP verified successfully.',
                            'warning': 'Could not save quote request to database.'
                        }, status=status.HTTP_200_OK)
                else:
                    return Response({'status': result}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 