from django.db import models


class AffiliateApplication(models.Model):
    PROFESSION_CHOICES = [
        ("Real Estate Agent", "Real Estate Agent"),
        ("Builder / Developer", "Builder / Developer"),
        ("Influencer / Content Creator", "Influencer / Content Creator"),
        ("Financial Advisor", "Financial Advisor"),
        ("Freelancer / Gig Worker", "Freelancer / Gig Worker"),
        ("Society / RWA Representative", "Society / RWA Representative"),
        ("Other", "Other"),
    ]

    DISTRICT_CHOICES = [
        ("Thiruvananthapuram", "Thiruvananthapuram"),
        ("Kollam", "Kollam"),
        ("Pathanamthitta", "Pathanamthitta"),
        ("Alappuzha", "Alappuzha"),
        ("Kottayam", "Kottayam"),
        ("Idukki", "Idukki"),
        ("Ernakulam", "Ernakulam"),
        ("Thrissur", "Thrissur"),
        ("Palakkad", "Palakkad"),
        ("Malappuram", "Malappuram"),
        ("Kozhikode", "Kozhikode"),
        ("Wayanad", "Wayanad"),
        ("Kannur", "Kannur"),
        ("Kasaragod", "Kasaragod"),
    ]

    full_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20, db_index=True)
    email = models.EmailField(max_length=254, db_index=True)
    profession = models.CharField(max_length=64, choices=PROFESSION_CHOICES)
    district = models.CharField(max_length=64, choices=DISTRICT_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "affiliate_application"

    def __str__(self):
        return f"{self.full_name} - {self.phone}"
