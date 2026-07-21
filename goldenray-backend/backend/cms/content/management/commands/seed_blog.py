"""Seed the `articles` collection, a default template, and one sample published
entry so the blog frontend renders immediately.

Usage:  python manage.py seed_blog
Idempotent — safe to run more than once.
"""
from django.core.management.base import BaseCommand
from django.utils import timezone

from catalog.models import (
    Author,
    Badge,
    Category,
    Collection,
    Tag,
    Template,
    TemplateAttributeSlot,
    TemplateImageGroup,
)
from content.models import ContentBlock, Entry, EntryImage, Seo


def _p(text):
    return {"type": "paragraph", "children": [{"type": "text", "text": text}]}


def _h(text, level=2):
    return {"type": "heading", "level": level, "children": [{"type": "text", "text": text}]}


def _ul(items):
    return {
        "type": "list",
        "format": "unordered",
        "children": [
            {"type": "list-item", "children": [{"type": "text", "text": i}]} for i in items
        ],
    }


class Command(BaseCommand):
    help = "Seed the articles collection, a default template, and a sample entry."

    def handle(self, *args, **options):
        collection, _ = Collection.objects.get_or_create(
            api_uid="articles",
            defaults=dict(
                singular_name="Article",
                plural_name="Articles",
                description="Solar blog articles served to the website.",
            ),
        )
        self.stdout.write(self.style.SUCCESS(f"Collection: {collection.plural_name}"))

        template, _ = Template.objects.get_or_create(
            slug="solar-guide",
            defaults=dict(name="Solar Guide", description="Default blog article layout."),
        )
        # Relabelable, key-stable image groups (single + repeatable gallery).
        for key, label, repeatable in [
            ("coverImg", "Cover image", False),
            ("mainImg", "Main image", False),
            ("socialSharing", "Social sharing image", False),
            ("bodyImages", "Body gallery", True),
        ]:
            TemplateImageGroup.objects.get_or_create(
                template=template, key=key,
                defaults=dict(label=label, repeatable=repeatable),
            )
        TemplateAttributeSlot.objects.get_or_create(
            template=template, key="difficulty",
            defaults=dict(label="Difficulty", type=TemplateAttributeSlot.Type.ENUM,
                          options={"choices": ["Beginner", "Intermediate", "Advanced"]}),
        )
        self.stdout.write(self.style.SUCCESS(f"Template: {template.name}"))

        author, _ = Author.objects.get_or_create(
            name="Golden Ray Solar",
            defaults=dict(role="Editorial team", bio="Solar experts at Golden Ray."),
        )
        category, _ = Category.objects.get_or_create(name="Subsidy & Government", defaults=dict(slug="subsidy-government"))
        badge, _ = Badge.objects.get_or_create(label="Reviewed by Engineering", defaults=dict(color="#ED8723"))
        tag_a, _ = Tag.objects.get_or_create(name="PM Surya Ghar")
        tag_b, _ = Tag.objects.get_or_create(name="Kerala")

        slug = "pm-surya-ghar-subsidy-guide"
        if Entry.objects.filter(collection=collection, slug=slug).exists():
            self.stdout.write(self.style.WARNING("Sample entry already exists — skipping."))
            return

        entry = Entry.objects.create(
            collection=collection,
            template=template,
            title="PM Surya Ghar Subsidy: A Complete Kerala Guide",
            slug=slug,
            excerpt="Everything Kerala homeowners need to know about the PM Surya Ghar rooftop solar subsidy.",
            summary=[_ul([
                "Up to ₹78,000 central subsidy for rooftop solar.",
                "Applies to residential connections in Kerala via the national portal.",
                "Payback typically under 5 years with KSEB net-metering.",
            ])],
            introduction=[_p(
                "The PM Surya Ghar Muft Bijli Yojana makes rooftop solar dramatically more "
                "affordable for Kerala households. This guide walks through eligibility, the "
                "subsidy slabs, and how to apply."
            )],
            read_time=6,
            is_featured=True,
            sort_order=1,
            published_on=timezone.now(),
            author=author,
            warning="Subsidy slabs are revised periodically — always confirm current rates on the national portal before applying.",
            insights="Households that pair a 3 kW system with net-metering see the fastest payback in Kerala's tariff structure.",
        )
        entry.categories.set([category])
        entry.tags.set([tag_a, tag_b])
        entry.badges.set([badge])

        ContentBlock.objects.create(
            entry=entry, order=0, component="shared.rich-text",
            body=[
                _h("Understanding the subsidy slabs"),
                _p("The subsidy is tiered by system capacity."),
                _p("[TABLE]"),
                _p("| Capacity | Central Subsidy |"),
                _p("| 1 kW | ₹30,000 |"),
                _p("| 2 kW | ₹60,000 |"),
                _p("| 3 kW and above | ₹78,000 |"),
                _p("These amounts are credited after successful installation and inspection."),
            ],
        )
        ContentBlock.objects.create(
            entry=entry, order=1, component="shared.rich-text",
            body=[
                _h("Who is eligible"),
                _p("Most Kerala homeowners with a valid KSEB residential connection qualify."),
                _ul([
                    "Own the rooftop (or have owner consent).",
                    "Have a sanctioned residential KSEB connection.",
                    "Do not already have a subsidised system on the same connection.",
                ]),
            ],
        )

        EntryImage.objects.create(
            entry=entry, group_key="coverImg", position=0,
            external_url="https://gym-manager-pull.b-cdn.net/golden_ray/resources/resources-1.png",
        )
        EntryImage.objects.create(
            entry=entry, group_key="mainImg", position=0,
            external_url="https://gym-manager-pull.b-cdn.net/golden_ray/resources/resources-1.png",
        )

        Seo.objects.create(
            entry=entry,
            meta_title="PM Surya Ghar Subsidy Guide for Kerala | Golden Ray Solar",
            meta_description="Complete guide to the PM Surya Ghar rooftop solar subsidy for Kerala homeowners — slabs, eligibility, and how to apply.",
            keywords="PM Surya Ghar, Kerala solar subsidy, rooftop solar",
        )

        # Publish it so the public delivery API serves it.
        from content.services import publish_entry
        publish_entry(entry)

        self.stdout.write(self.style.SUCCESS(f"Published sample entry: {entry.title}"))
        self.stdout.write("Try:  curl 'http://localhost:8001/api/articles?populate=*'")
