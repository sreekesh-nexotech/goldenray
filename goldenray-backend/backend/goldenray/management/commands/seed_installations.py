from django.core.management.base import BaseCommand
from goldenray.models import CustomerInstallation
from datetime import date, timedelta
import random


class Command(BaseCommand):
    help = 'Seeds the database with sample customer installation data for testing'

    def handle(self, *args, **kwargs):
        # Sample data for different pincodes in Kerala
        sample_installations = [
            # Alappuzha district (688xxx, 689xxx)
            {"customer_name": "Rajesh Kumar", "phone_number": "+919876543210", "pincode": "688008", "address": "Vadakkal, Alappuzha", "system_size": 5.0, "installation_date": date(2024, 6, 15)},
            {"customer_name": "Suresh Menon", "phone_number": "+919876543211", "pincode": "688008", "address": "Thannikakal, Alappuzha", "system_size": 3.0, "installation_date": date(2024, 8, 20)},
            {"customer_name": "Priya Nair", "phone_number": "+919876543212", "pincode": "688008", "address": "Cherthala, Alappuzha", "system_size": 5.0, "installation_date": date(2025, 1, 10)},
            {"customer_name": "Anil Thomas", "phone_number": "+919876543213", "pincode": "688008", "address": "Alappuzha Town", "system_size": 3.0, "installation_date": date(2025, 2, 5)},
            {"customer_name": "Deepa Krishnan", "phone_number": "+919876543214", "pincode": "688012", "address": "Ambalapuzha, Alappuzha", "system_size": 5.0, "installation_date": date(2024, 9, 12)},
            {"customer_name": "Vinod Kumar", "phone_number": "+919876543215", "pincode": "688013", "address": "Haripad, Alappuzha", "system_size": 3.0, "installation_date": date(2024, 11, 8)},
            {"customer_name": "Lakshmi Devi", "phone_number": "+919876543216", "pincode": "688001", "address": "Alappuzha", "system_size": 5.0, "installation_date": date(2025, 1, 22)},
            {"customer_name": "Manoj Kumar", "phone_number": "+919876543217", "pincode": "688001", "address": "Alappuzha Beach Road", "system_size": 3.0, "installation_date": date(2024, 7, 30)},
            {"customer_name": "Sreekumar P", "phone_number": "+919876543218", "pincode": "689121", "address": "Chengannur, Alappuzha", "system_size": 5.0, "installation_date": date(2024, 10, 18)},
            {"customer_name": "Kavya Menon", "phone_number": "+919876543219", "pincode": "689122", "address": "Mavelikkara, Alappuzha", "system_size": 3.0, "installation_date": date(2025, 2, 1)},
            
            # Ernakulam district (682xxx, 683xxx)
            {"customer_name": "Ravi Varma", "phone_number": "+919876543220", "pincode": "682001", "address": "Fort Kochi", "system_size": 5.0, "installation_date": date(2024, 5, 14)},
            {"customer_name": "Sangeeta Pillai", "phone_number": "+919876543221", "pincode": "682002", "address": "MG Road, Kochi", "system_size": 3.0, "installation_date": date(2024, 8, 9)},
            {"customer_name": "Anoop George", "phone_number": "+919876543222", "pincode": "682020", "address": "Kakkanad, Kochi", "system_size": 5.0, "installation_date": date(2024, 12, 5)},
            {"customer_name": "Nisha Jacob", "phone_number": "+919876543223", "pincode": "683101", "address": "Aluva, Ernakulam", "system_size": 3.0, "installation_date": date(2025, 1, 15)},
            
            # Thiruvananthapuram district (695xxx)
            {"customer_name": "Krishna Pillai", "phone_number": "+919876543224", "pincode": "695001", "address": "Trivandrum City", "system_size": 5.0, "installation_date": date(2024, 6, 20)},
            {"customer_name": "Vimala Nair", "phone_number": "+919876543225", "pincode": "695003", "address": "Kowdiar, Trivandrum", "system_size": 3.0, "installation_date": date(2024, 9, 25)},
            {"customer_name": "Rajiv Kumar", "phone_number": "+919876543226", "pincode": "695014", "address": "Kazhakootam, Trivandrum", "system_size": 5.0, "installation_date": date(2025, 1, 8)},
            
            # Thrissur district (680xxx)
            {"customer_name": "Thomas Joseph", "phone_number": "+919876543227", "pincode": "680001", "address": "Thrissur City", "system_size": 3.0, "installation_date": date(2024, 7, 11)},
            {"customer_name": "Meera Krishnan", "phone_number": "+919876543228", "pincode": "680002", "address": "Shornur Road, Thrissur", "system_size": 5.0, "installation_date": date(2024, 10, 30)},
            {"customer_name": "Biju Thomas", "phone_number": "+919876543229", "pincode": "680003", "address": "Kodungallur, Thrissur", "system_size": 3.0, "installation_date": date(2025, 2, 3)},
        ]

        # Clear existing data (optional - comment out if you don't want to clear)
        # CustomerInstallation.objects.all().delete()

        # Create installations
        created_count = 0
        skipped_count = 0

        for install_data in sample_installations:
            # Check if already exists (by phone number)
            if not CustomerInstallation.objects.filter(
                phone_number=install_data['phone_number']
            ).exists():
                CustomerInstallation.objects.create(
                    customer_name=install_data['customer_name'],
                    phone_number=install_data['phone_number'],
                    pincode=install_data['pincode'],
                    address=install_data['address'],
                    system_size=install_data['system_size'],
                    installation_date=install_data['installation_date'],
                    status='completed'
                )
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(
                        f"✓ Created: {install_data['customer_name']} - {install_data['pincode']}"
                    )
                )
            else:
                skipped_count += 1
                self.stdout.write(
                    self.style.WARNING(
                        f"⚠ Skipped: {install_data['customer_name']} (already exists)"
                    )
                )

        self.stdout.write(
            self.style.SUCCESS(
                f'\n✓ Successfully seeded {created_count} customer installations'
            )
        )
        if skipped_count > 0:
            self.stdout.write(
                self.style.WARNING(
                    f'⚠ Skipped {skipped_count} existing installations'
                )
            )
