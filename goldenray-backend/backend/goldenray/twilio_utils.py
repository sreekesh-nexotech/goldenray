import os
from twilio.rest import Client
from django.conf import settings

TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID', getattr(settings, 'TWILIO_ACCOUNT_SID', None))
TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN', getattr(settings, 'TWILIO_AUTH_TOKEN', None))
TWILIO_VERIFY_SERVICE_SID = os.getenv('TWILIO_VERIFY_SERVICE_SID', getattr(settings, 'TWILIO_VERIFY_SERVICE_SID', None))

client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

def send_otp(phone_number):
    verification = client.verify.v2.services(TWILIO_VERIFY_SERVICE_SID).verifications.create(to=phone_number, channel='sms')
    return verification.status

def verify_otp(phone_number, code):
    verification_check = client.verify.v2.services(TWILIO_VERIFY_SERVICE_SID).verification_checks.create(to=phone_number, code=code)
    return verification_check.status 