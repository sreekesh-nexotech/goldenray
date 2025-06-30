from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..twilio_utils import send_otp, verify_otp
from ..serializers.otp_serializer import SendOTPSerializer, VerifyOTPSerializer

class SendOTPAPIView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = SendOTPSerializer(data=request.data)
        if serializer.is_valid():
            phone_number = serializer.validated_data['phone_number']
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
            code = serializer.validated_data['code']
            try:
                result = verify_otp(phone_number, code)
                if result == 'approved':
                    return Response({'status': 'approved'}, status=status.HTTP_200_OK)
                else:
                    return Response({'status': result}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 