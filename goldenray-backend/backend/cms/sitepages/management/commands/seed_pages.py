"""Register the website's real routes as maintainable pages (§6.2).

    python manage.py seed_pages

Idempotent: a page is created if its route is missing and left alone otherwise,
so re-running after adding a route to the site only adds the new one. Nothing is
ever deleted — a route that disappears from this list stays in the database,
because FAQs point at it and losing the page would take the questions with it.

Scope note: several routes here (comparison, group purchase, quote analyser)
belong to capabilities whose *admin modules* are Phase 2. Registering them as
maintainable pages is not the same thing — it gives them SEO and lets their FAQs
be managed like every other page's. What stays out of Phase 1 is the navigation
entry and the configuration screens, which is enforced in
``accounts/modules.py`` by those modules simply not existing.

Image and text slots are declared here only for pages whose React component
actually reads them (see ``SLOTS``). A slot is a contract with a specific
component — its ``key`` is what that component reads — so a slot is added the
moment a component is wired to ``/api/page-content``, never guessed at ahead of
time. Seeding is additive: an existing slot keeps its asset and value.
"""

from django.core.management.base import BaseCommand

from sitepages.models import Page, PageImageSlot, PageTextSlot

#: route, name, group, protected
#:
#: ``protected`` marks pages whose copy and layout are developer-owned. §6.16
#: names the career landing page explicitly; the rest of the marketing pages are
#: hand-built React too, so they carry the same lock. Nothing in this module can
#: edit page copy regardless — the flag is what makes the Studio *say so*.
PAGES = [
    ("/", "Home", "Main", True),
    ("/about", "About", "Main", True),
    ("/how-flarize-works", "How Flarize Works", "Main", True),
    ("/contactus", "Contact", "Main", True),
    ("/faq", "FAQ hub", "Main", True),

    ("/residential", "Residential", "Solutions", True),
    ("/commercial", "Commercial", "Solutions", True),
    ("/industrial", "Industrial", "Solutions", True),
    ("/solutions", "Solutions", "Solutions", True),

    ("/subsidy", "Subsidy", "Programmes", True),
    ("/solar-warranty", "Solar Warranty", "Programmes", True),
    ("/solar-referral-program", "Referral Programme", "Programmes", True),
    ("/service-area", "Service Areas", "Programmes", True),

    ("/emi-calculator", "EMI Calculator", "Tools", True),
    ("/advanced-calculator", "Advanced Calculator", "Tools", True),
    ("/solar-comparison", "Solar Comparison", "Tools", True),
    ("/comparison-table", "Solar Comparison Table", "Tools", True),
    ("/inverter-comparison", "Inverter Comparison", "Tools", True),
    ("/inverter-comparison-table", "Inverter Comparison Table", "Tools", True),
    ("/group-purchase", "Group Purchase", "Tools", True),
    ("/quote-analyser", "Quote Analyser", "Tools", True),

    ("/career", "Careers", "Careers", True),

    ("/projects", "Projects", "Content", True),
    ("/resources", "Resources", "Content", True),
    ("/blog", "Blog", "Content", True),

    ("/privacy", "Privacy Policy", "Legal", True),
    ("/terms", "Terms", "Legal", True),
]


#: route → the slots its component reads. ``images`` and ``text`` entries are
#: (key, label, guidance[, kind, max_length]) tuples.
SLOTS = {
    "/career": {
        "images": [
            (
                "hero_background",
                "Hero background",
                "Full-width photo behind the headline; landscape, at least 1920×1080.",
            ),
        ],
        "text": [
            (
                "hero_title",
                "Hero headline",
                "One line; keep it under ~70 characters so it stays on two lines on phones.",
                PageTextSlot.Kind.SHORT_TEXT,
                90,
            ),
            (
                "hero_subtitle",
                "Hero sub-headline",
                "One or two short sentences under the headline.",
                PageTextSlot.Kind.LONG_TEXT,
                220,
            ),
        ],
    },
}


class Command(BaseCommand):
    help = "Register the public website's routes as maintainable pages."

    def handle(self, *args, **options):
        created = 0
        for order, (route, name, group, protected) in enumerate(PAGES):
            _, was_created = Page.objects.get_or_create(
                route=route,
                defaults={
                    "name": name,
                    "group": group,
                    "is_protected": protected,
                    "status": Page.Status.PUBLISHED,
                    "sort_order": order,
                },
            )
            created += int(was_created)
            if was_created:
                self.stdout.write(f"  + {route}  ({name})")

        slots_created = 0
        for route, spec in SLOTS.items():
            page = Page.objects.filter(route=route).first()
            if page is None:
                continue
            for order, (key, label, guidance) in enumerate(spec.get("images", ())):
                _, was_created = PageImageSlot.objects.get_or_create(
                    page=page, key=key, defaults={"label": label, "guidance": guidance, "order": order}
                )
                slots_created += int(was_created)
            for order, (key, label, guidance, kind, cap) in enumerate(spec.get("text", ())):
                _, was_created = PageTextSlot.objects.get_or_create(
                    page=page,
                    key=key,
                    defaults={"label": label, "guidance": guidance, "kind": kind, "max_length": cap, "order": order},
                )
                slots_created += int(was_created)

        total = Page.objects.count()
        self.stdout.write(
            self.style.SUCCESS(
                f"{created} page(s) registered; {total} maintainable page(s) in total; "
                f"{slots_created} slot(s) added."
            )
        )
