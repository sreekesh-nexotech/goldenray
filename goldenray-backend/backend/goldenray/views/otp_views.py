from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..twilio_utils import send_otp, verify_otp
from ..serializers.otp_serializer import SendOTPSerializer, VerifyOTPSerializer
from ..models import SentQuote
from ..models.send_quote_junk import SendQuoteJunk
from ..serializers.send_quote_junk_serializer import SendQuoteJunkSerializer
import uuid
from rest_framework.permissions import AllowAny
from django.utils import timezone
from datetime import timedelta
from django.db.models import Q

class SendOTPAPIView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SendOTPSerializer(data=request.data)
        if serializer.is_valid():
            phone_number = serializer.validated_data['phone_number']
            if not phone_number.startswith('+'):
                phone_number = '+91' + phone_number.lstrip('0')
            name = request.data.get('name', '')

            # Rate limiting: Check if this phone number has requested OTP in last 30 days
            thirty_days_ago = timezone.now() - timedelta(days=30)

            # Check both SendQuoteJunk (OTP requests) and SentQuote (verified requests)
            recent_request = (
                SendQuoteJunk.objects.filter(
                    phone=phone_number,
                    created_at__gte=thirty_days_ago
                ).exists() or
                SentQuote.objects.filter(
                    phone=phone_number,
                    created_at__gte=thirty_days_ago
                ).exists()
            )

            if recent_request:
                # Get the most recent request date for better error message
                junk_latest = SendQuoteJunk.objects.filter(
                    phone=phone_number,
                    created_at__gte=thirty_days_ago
                ).order_by('-created_at').first()

                sent_latest = SentQuote.objects.filter(
                    phone=phone_number,
                    created_at__gte=thirty_days_ago
                ).order_by('-created_at').first()

                latest_request = None
                if junk_latest and sent_latest:
                    latest_request = max(junk_latest.created_at, sent_latest.created_at)
                elif junk_latest:
                    latest_request = junk_latest.created_at
                elif sent_latest:
                    latest_request = sent_latest.created_at

                days_since_request = (timezone.now() - latest_request).days if latest_request else 0
                days_remaining = max(30 - days_since_request, 1)

                return Response({
                    'error': 'rate_limit_exceeded',
                    'message': f'You have already requested a quote recently. Please try again after {days_remaining} days or contact our team directly.',
                    'days_remaining': days_remaining
                }, status=status.HTTP_429_TOO_MANY_REQUESTS)

            # Generate unique quote_id
            quote_id = f"JUNK_{uuid.uuid4().hex[:8].upper()}"
            try:
                SendQuoteJunk.objects.create(
                    quote_id=quote_id,
                    name=name,
                    phone=phone_number,
                    quote_url=f"/quote/{quote_id}",
                    is_sent=False
                )
            except Exception as junk_error:
                pass  # Don't block OTP sending if logging fails
            try:
                result = send_otp(phone_number)
                return Response({'status': result}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyOTPAPIView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

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