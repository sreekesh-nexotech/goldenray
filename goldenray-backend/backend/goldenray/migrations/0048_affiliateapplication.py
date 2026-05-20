from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('goldenray', '0047_solarpanel'),
    ]

    operations = [
        migrations.CreateModel(
            name='AffiliateApplication',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('full_name', models.CharField(max_length=255)),
                ('phone', models.CharField(db_index=True, max_length=20)),
                ('email', models.EmailField(db_index=True, max_length=254)),
                ('profession', models.CharField(
                    choices=[
                        ('Real Estate Agent', 'Real Estate Agent'),
                        ('Builder / Developer', 'Builder / Developer'),
                        ('Influencer / Content Creator', 'Influencer / Content Creator'),
                        ('Financial Advisor', 'Financial Advisor'),
                        ('Freelancer / Gig Worker', 'Freelancer / Gig Worker'),
                        ('Society / RWA Representative', 'Society / RWA Representative'),
                        ('Other', 'Other'),
                    ],
                    max_length=64,
                )),
                ('district', models.CharField(
                    choices=[
                        ('Thiruvananthapuram', 'Thiruvananthapuram'),
                        ('Kollam', 'Kollam'),
                        ('Pathanamthitta', 'Pathanamthitta'),
                        ('Alappuzha', 'Alappuzha'),
                        ('Kottayam', 'Kottayam'),
                        ('Idukki', 'Idukki'),
                        ('Ernakulam', 'Ernakulam'),
                        ('Thrissur', 'Thrissur'),
                        ('Palakkad', 'Palakkad'),
                        ('Malappuram', 'Malappuram'),
                        ('Kozhikode', 'Kozhikode'),
                        ('Wayanad', 'Wayanad'),
                        ('Kannur', 'Kannur'),
                        ('Kasaragod', 'Kasaragod'),
                    ],
                    max_length=64,
                )),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'db_table': 'affiliate_application',
            },
        ),
    ]
