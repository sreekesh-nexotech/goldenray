from django.db import migrations


def insert_metadata(apps, schema_editor):
    Metadata = apps.get_model('goldenray', 'Metadata')
    entries = [
        {
            "page": "home",
            "title": "Golden Ray - Solar Solutions",
            "description": "Empowering sustainable energy with innovative solar solutions for residential, commercial, and industrial needs.",
            "keywords": ["solar energy", "renewable energy", "Golden Ray"],
            "imageUrl": "/heroImg.png",
            "ogtype": "website",
        },
        {
            "page": "about",
            "title": "About Us | Golden Ray",
            "description": "Learn about Golden Ray's mission, vision, and commitment to sustainable solar energy solutions.",
            "keywords": ["solar energy", "about", "Golden Ray"],
            "imageUrl": "/aboutHeroImg.png",
            "ogtype": "website",
        },
        {
            "page": "advanced-calculator",
            "title": "Solar Calculator | Golden Ray",
            "description": "Calculate your solar energy needs with our advanced solar calculator tool.",
            "keywords": ["solar calculator", "solar energy", "Golden Ray"],
            "imageUrl": "/metrics-1.png",
            "ogtype": "website",
        },
        {
            "page": "faq",
            "title": "FAQ | Golden Ray",
            "description": "Find answers to frequently asked questions about solar energy and our services.",
            "keywords": ["solar faq", "solar energy", "Golden Ray"],
            "imageUrl": "/heroImg.png",
            "ogtype": "website",
        },
        {
            "page": "projects",
            "title": "Projects | Golden Ray",
            "description": "Explore our portfolio of successful solar energy projects.",
            "keywords": ["solar projects", "renewable energy", "Golden Ray"],
            "imageUrl": "/p-1.png",
            "ogtype": "website",
        },
        {
            "page": "projects/123",
            "title": "Solar Farm Project | Golden Ray",
            "description": "A large-scale solar farm for sustainable energy production.",
            "keywords": ["solar farm", "renewable energy", "Golden Ray"],
            "imageUrl": "/p-1.png",
            "ogtype": "article",
        },
        {
            "page": "projects/456",
            "title": "Residential Solar Installation | Golden Ray",
            "description": "A residential solar installation for energy efficiency.",
            "keywords": ["residential solar", "solar energy", "Golden Ray"],
            "imageUrl": "/Residential-1.png",
            "ogtype": "article",
        },
        {
            "page": "resources",
            "title": "Resources | Golden Ray",
            "description": "Discover our latest blogs and resources on solar energy solutions.",
            "keywords": ["solar blogs", "solar resources", "Golden Ray"],
            "imageUrl": "/resources-1.png",
            "ogtype": "website",
        },
        {
            "page": "resources/789",
            "title": "Guide to Solar Energy | Golden Ray",
            "description": "A comprehensive guide to understanding solar energy benefits.",
            "keywords": ["solar guide", "solar energy", "Golden Ray"],
            "imageUrl": "/resources-1.png",
            "ogtype": "article",
        },
        {
            "page": "resources/012",
            "title": "Solar Panel Maintenance Tips | Golden Ray",
            "description": "Tips for maintaining your solar panels for optimal performance.",
            "keywords": ["solar maintenance", "solar panels", "Golden Ray"],
            "imageUrl": "/resources-2.png",
            "ogtype": "article",
        },
        {
            "page": "solutions",
            "title": "Solutions | Golden Ray",
            "description": "Discover our innovative solar energy solutions for residential, commercial, and industrial needs.",
            "keywords": ["solar solutions", "renewable energy", "Golden Ray"],
            "imageUrl": "/Commercial-1.png",
            "ogtype": "website",
        },
    ]
    for entry in entries:
        Metadata.objects.update_or_create(page=entry["page"], defaults=entry)

class Migration(migrations.Migration):
    dependencies = [
        ("goldenray", "0036_metadata"),
    ]

    operations = [
        migrations.RunPython(insert_metadata),
    ] 