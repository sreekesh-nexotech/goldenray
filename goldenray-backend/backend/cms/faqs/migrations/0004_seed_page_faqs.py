"""Seed the CMS with the FAQs that ship hardcoded in the React components.

    /, /solutions, /quote-analyser        -> components/Home/Faq.tsx
    /subsidy                              -> components/subsidy/SubsidyFaq.tsx
    /how-flarize-works                    -> components/HowFlarizeWorks/Faq.tsx
    /inverter-comparison(-table)          -> components/InverterComparison/FAQSection.tsx
    /solar-referral-program               -> components/AffiliatePrograms/AffiliateFaq.tsx
    /residential                          -> components/Residential/ResidentialFAQ.tsx
    /solar-warranty                       -> components/SolarWarranty/WarrantyFaq.tsx
    /emi-calculator                       -> components/EmiCalculator/EmiFaq.tsx
    /group-purchase                       -> components/GroupPurchase/GroupPurchaseFAQ.tsx
    /solar-comparison, /comparison-table  -> components/SolarComparison/FAQSection.tsx

Each of those components calls ``usePublicFaqs(fallback)`` (see
frontend/src/hooks/usePublicFaqs.ts), which fetches published FAQs for the
current pathname and only falls back to the hardcoded array when the CMS has
nothing for that exact route. Until now no ``Faq`` rows existed at all, so
every page silently rendered its shipped copy and the Studio's FAQ list only
ever showed whatever an editor had typed by hand. This migration copies each
component's shipped copy into the CMS, published, under its page's route —
so the Studio list shows every page's questions, editing one updates the
live site immediately, and new questions can be added the same way.

A page reused across multiple routes (Home/Faq on ``/``, ``/solutions`` and
``/quote-analyser``; the two comparison FAQ blocks each on two routes) gets
one independent copy of the same starting content per route, matching how
``usePublicFaqs`` keys strictly on the visitor's pathname today.

Idempotent and non-destructive: a ``Page`` is created only if its route is
missing (mirrors ``sitepages.seed_pages``), and a ``Faq`` is created only if
that exact (page, question) pair is missing — re-running, or running after an
editor has already added the same question by hand, does nothing. Reversing
only removes the rows this migration created and that nobody has touched
since (``updated_by`` still null); anything an editor has edited is left in
place.
"""

from django.db import migrations
from django.utils import timezone

HOME_FAQS = [
    (
        "What maintenance is required for solar panels?",
        "Minimal. Cleaning every 3–6 months and one annual check-up. Kerala's humidity and monsoon dust can reduce output, so regular cleaning matters — but it's not a big job. Flarize provides scheduled solar panel maintenance in Kerala, performance monitoring, and fast repairs.",
    ),
    (
        "Can I run my home completely on solar power?",
        "With the right system size and a hybrid or battery-backed setup, yes. Standard on-grid systems generate during daylight and offset nighttime usage via net metering. For full independence including power outages, you'd need battery storage. We assess your needs during the free consultation.",
    ),
    (
        "What is the lifespan of solar panels?",
        "25+ years. Most quality panels retain 80–85% efficiency at year 25. Inverters typically last 10–15 years. Flarize installations use ALMM-approved panels and come with a 10-year comprehensive warranty covering panels, inverters, and workmanship.",
    ),
    (
        "How long does it take to install a solar system?",
        "2–6 days for most residential systems. Golden Ray's team has done 300+ installations — the process is streamlined. Design, mounting, wiring, safety checks, and handover. We handle KSEB approval and net metering setup after installation.",
    ),
    (
        "What is the cost of installing solar panels at home?",
        "A 3kW system: ₹1.85–₹2.15 lakh before subsidy. After the ₹78,000 MNRE subsidy under PM Surya Ghar Yojana, net cost is approximately ₹1.1–₹1.4 lakh. Price varies by panel brand, inverter type, and roof type. Solar EMI options from ₹2,000/month.",
    ),
    (
        "How much can I save by switching to solar?",
        "60–85% reduction on your KSEB bill. For a 3kW system, expect bimonthly savings of ₹2,200–₹2,700. Kerala's telescopic tariff means cutting units with solar drops you into a lower rate slab — so you save twice.",
    ),
    (
        "What happens during a power outage?",
        "Standard on-grid systems shut down during outages — that's a safety requirement so linesmen aren't endangered. For uninterrupted power, a hybrid system with battery storage keeps essential loads running. We recommend the right setup during your free consultation.",
    ),
    (
        "Is the ₹78,000 subsidy available for commercial solar?",
        "No. The PM Surya Ghar Yojana subsidy applies to on-grid residential systems only. Commercial and industrial installations don't qualify. However, businesses benefit from accelerated depreciation (40% in year one) and tax deductions that often deliver faster ROI than the residential subsidy.",
    ),
]

SUBSIDY_FAQS = [
    (
        "Will panels work during Kerala monsoon?",
        "Yes. Solar panels are designed to withstand heavy rain and wind. They are waterproof and have a robust build, ensuring they function efficiently even during the monsoon season.",
    ),
    (
        "Is our roof strong enough?",
        "Most residential roofs in Kerala are suitable for solar panel installation. Our team conducts a structural assessment to ensure your roof can support the panels and mounting equipment safely.",
    ),
    (
        "Do group members have to be neighbours?",
        "No. While it's ideal for group members to be in the same locality for logistical efficiency, they can be from different areas. The key is that the group reaches the minimum number of families required for a confirmed installation.",
    ),
    (
        "Do we need ITR for the loan?",
        "Income Tax Returns (ITR) are typically required for loan applications to verify income and financial stability. However, specific requirements may vary based on the lender's policies. Our team can guide you through the documentation needed for your loan application.",
    ),
    (
        "What about KSEB paperwork and subsidy?",
        "Our team handles all KSEB documentation and subsidy applications on your behalf. We ensure that all necessary forms are completed accurately and submitted in a timely manner, maximizing your chances of receiving the subsidy without any hassle.",
    ),
    (
        "Can anyone earn referral rewards?",
        "Yes, anyone who refers a friend or family member to the group purchase program can earn referral rewards. The specific rewards and terms will be communicated to you by our team.",
    ),
    (
        "What happens during a power outage?",
        "During a power outage, your solar system will automatically shut down for safety reasons. However, if you have a battery storage system installed, it can provide backup power to your home during outages, depending on the capacity of the battery.",
    ),
]

HOW_FLARIZE_WORKS_FAQS = [
    (
        "How does solar installation work in Kerala?",
        "You send your KSEB bill, we visit your roof, and you get 3 checked options. Pick one, and we handle the install, the KSEB paperwork, and your subsidy.",
    ),
    (
        "How long does installation take?",
        "Once your option is approved, the install takes 7 to 12 days. We use pre-packed kits and a local team, so there's no long wait for parts.",
    ),
    (
        "How does Flarize differ from other companies?",
        "We check every installer before you meet them, your payment follows real progress, and our engineer inspects the finished job. You deal with one team for 25 years.",
    ),
    (
        "Does Flarize handle KSEB net metering?",
        "Yes. We file your application and follow it through approval. You don't deal with KSEB yourself.",
    ),
    (
        "What happens after installation?",
        "You stay with Flarize. App monitoring, service visits, and a written energy-loss guarantee, for 25 years. One number to call.",
    ),
    (
        "Is solar a better choice than a fixed deposit?",
        "For most Kerala homes with a high bill, the monthly saving beats FD interest, and it lasts for decades. We'll show you the real numbers for your home.",
    ),
]

INVERTER_COMPARISON_FAQS = [
    (
        "What is the best solar inverter for Kerala?",
        "It depends on your priorities. For shaded roofs or complex layouts, Enphase microinverters give you the best per-panel optimization. For maximum efficiency, SolarEdge's 99% HD-Wave is unmatched. For the best value-to-quality ratio, Sungrow SG5.0RS offers world-class reliability at mid-range pricing. For budget installs, Growatt delivers strong efficiency at the lowest cost.",
    ),
    (
        "String inverter vs microinverter — which is better for Kerala?",
        "String inverters are more affordable and work well on unshaded, uniform roofs — which covers most Kerala homes. Microinverters are better for partially shaded roofs, multi-directional layouts, or when you want panel-level monitoring. If your roof has no shading issues and faces a consistent direction, a quality string inverter gives you the best ROI.",
    ),
    (
        "Do I need a hybrid inverter for my Kerala home?",
        "Only if you plan to add battery storage within the next 2-3 years. A hybrid inverter like Fronius GEN24 lets you connect a battery later without replacing the inverter. But if you're doing standard grid-tie solar with KSEB net metering — which is what most Kerala homes opt for — a regular string inverter is more cost-effective. Don't pay for hybrid capability you may never use.",
    ),
    (
        "How does Kerala's climate affect inverter performance?",
        "Kerala's high humidity (often above 80%) and ambient temperatures exceeding 35°C stress inverters significantly. Humidity can cause internal corrosion if the IP rating isn't adequate. Heat causes derating — the inverter reduces output to protect itself. Look for IP65+ protection, C5 corrosion rating for coastal areas, and derating curves that maintain full output up to at least 45°C.",
    ),
    (
        "What inverter size do I need for my home?",
        "Your inverter size should match your panel system size. A 3kW panel system needs a 3kW inverter. A 5kW system needs a 5kW inverter. For microinverters, you need one per panel — so a 5kW system with 9 panels needs 9 microinverters. All the 5kW inverters on this page work with systems between 3kW and 7kW depending on DC oversizing capabilities. Your installer will help size it correctly based on your roof and KSEB connection.",
    ),
]

AFFILIATE_FAQS = [
    (
        "I already installed solar with Flarize — can I earn?",
        "Yes — you're our most valued partner. Existing Flarize owners join as Advisor Partners, refer neighbours and friends, and earn rewards for every home that goes solar on your word.",
    ),
    (
        "How do I earn?",
        "You introduce a homeowner or business to Flarize. We handle consultation, design, paperwork, KSEB and installation. When the system is installed successfully, a fixed commission is credited to your partner account.",
    ),
    (
        "When do I get paid?",
        "Commission is credited after the installation is completed and verified. Your dashboard shows the exact status and next payout date for every referral.",
    ),
    (
        "How are referrals tracked?",
        "You get a unique tracking link, and referrals shared directly with your partner manager are also logged. Every lead is timestamped through submission, site visit, installation and payout — visible to you in real time.",
    ),
    (
        "What happens if a customer cancels?",
        "You only earn on completed installations, so a cancellation simply means no commission for that lead — no penalty, no clawback. Your other referrals are unaffected.",
    ),
    (
        "Do I need any solar knowledge?",
        "None. Our team handles every technical conversation, quote and approval. Your only job is the introduction and the trust you already have with your network.",
    ),
    (
        "Can influencers and creators join?",
        "Yes. Creator partners get a tracking link and ready-to-use content. You earn on completed installations from your audience — not on clicks, views or impressions.",
    ),
    (
        "Can electricians, builders and agents join?",
        "Absolutely — they're core partners. Solar fits naturally into electrical work, property handovers and design conversations, and you earn without changing your workflow.",
    ),
    (
        "Is there a minimum target?",
        "No. There's no quota and no pressure. Refer one home a year or ten a month — you earn the same fixed rate on each successful installation.",
    ),
    (
        "Can I refer customers outside my district?",
        "Yes. Flarize installs across all 14 Kerala districts, so any qualified referral within Kerala can convert regardless of where you or the homeowner are based.",
    ),
    (
        "How does Flarize support partners?",
        "Every partner gets a dedicated relationship manager, a live tracking dashboard, ready-made referral content, and full handling of consultation, paperwork, KSEB, warranty and after-sales — so the customer experience reflects well on you.",
    ),
]

RESIDENTIAL_FAQS = [
    (
        "How much do solar panels cost for a home in Kerala?",
        "A 3kW on-grid system costs ₹2–2.30 lakh, a 5kW system ₹3–3.30 lakh and a 10kW system ₹5–6 lakh before the ₹78,000 PM Surya Ghar subsidy. The range exists because a flat concrete roof is cheaper to work on than a tiled roof needing a raised frame, taller buildings need more cable and scaffolding, and panel and inverter brands differ in price. After the free site assessment your proposal shows one fixed, item-by-item price that does not change once work starts.",
    ),
    (
        "Is the ₹78,000 solar subsidy real, and how do I get it?",
        "Yes. It is paid under the central PM Surya Ghar Muft Bijli Yojana and credited directly to your bank account after installation and inspection. Flarize files the national portal application, the KSEB paperwork and the subsidy claim on your behalf, so you are not chasing forms yourself.",
    ),
    (
        "How does KSEB net metering work?",
        "A bidirectional KSEB meter records the units your roof exports during the day and the units you draw at night. You are billed only on the net difference, so daytime generation offsets night-time consumption. Flarize handles the net-metering application, feasibility approval and meter installation with KSEB.",
    ),
    (
        "Will solar panels work during the Kerala monsoon?",
        "Yes, at reduced output. Panels run on daylight rather than direct sun, so they keep generating on overcast monsoon days, typically at a lower percentage of rated output. Systems are sized against your full-year consumption, so strong generation from January to May covers the monsoon dip — and rain also washes dust off the panels.",
    ),
    (
        "Is the site assessment free?",
        "Yes. A Flarize engineer visits your home, measures usable shadow-free roof area, checks orientation and shading between 9 AM and 4 PM, reviews your KSEB bill and returns three tailored proposals. There is no cost and no obligation to proceed.",
    ),
    (
        "Do I need a battery with my solar system?",
        "Most Kerala homes do not. An on-grid system is cheapest and pays back fastest, but shuts down during a power cut as a KSEB safety rule. Choose a hybrid system with a battery if outages are frequent in your area, or you need fans, lights, Wi-Fi and the fridge to keep running at night.",
    ),
    (
        "Can I add more panels later or charge an EV?",
        "Yes, if the system is planned for it. Sizing the inverter with headroom and leaving spare roof area lets you add panels later, and an EV charger can be added to a suitably sized system. Tell the engineer at the assessment so the design allows for future load.",
    ),
]

WARRANTY_FAQS = [
    (
        "What is PM Surya Ghar subsidy? How much can I get?",
        "PM Surya Ghar gives ₹78,000 subsidy for 3kW residential systems in Kerala (₹26,000/kW). Flarize handles full documentation & KSEB approval. Net cost: ₹78,000–₹1,27,000 (after subsidy). Eligibility: own home roof, KSEB connection.",
    ),
    (
        "What exactly is included in the \"Full Flarize Guarantee\"?",
        "Covers: installation quality defects (5yr), panel performance (25yr on some), inverter warranty (5–10yr per brand), and Energy Loss Guarantee — if system down >3 days, Flarize pays for lost generation. Post-install: WhatsApp support + 3-layer technician backup.",
    ),
    (
        "What does a Solar Care Plan cost? What's included?",
        "Optional paid plans (price not listed, call for quote). Covers: bi-annual cleaning, health checkups, pest/rodent inspections, priority technician dispatch, performance reporting. Prevents 10–15% efficiency loss from dust/debris.",
    ),
    (
        "How much will I save per year? When is payback?",
        "Depends on system size & roof space. Example 3kW system: saves ₹12,000–₹18,000/yr (₹1,000–₹1,500/month). Payback: 6–8 years (after subsidy). Then 17+ years of near-free power. Use free estimate calculator on site.",
    ),
    (
        "Does Flarize get KSEB approval or do I do it?",
        "Flarize handles 100% — application, inspection coordination, net metering approval. You sign an approval letter only. Flarize tracks status & pushes KSEB (typically 15–30 days post-install).",
    ),
    (
        "What if my electricity consumption is very low?",
        "System undersized. Flarize analyzes your bill (Step 1) and avoids over-sizing. If consumption <100 kWh/month, 1–1.5kW system is better. Subsidy applies to 1kW too (₹26,000). Discuss in free site visit.",
    ),
    (
        "Can I upgrade the system size after 1 year?",
        "Yes. Add panels/inverter capacity. But KSEB needs new net metering (15–30 day wait). Cost varies. Contact Flarize service team post-install.",
    ),
]

EMI_FAQS = [
    (
        "How does the PM Surya Ghar subsidy reduce my solar loan EMI?",
        "The ₹78,000 subsidy is applied directly to your loan principal before your EMI is calculated. For a 3kW system costing ₹2L, the subsidy reduces your loan to ₹1,22,000. Every EMI is calculated on the lower amount — you save on both principal and total interest.",
    ),
    (
        "What is the minimum CIBIL score for a solar loan in Kerala?",
        "Minimum CIBIL score of 650 is required.",
    ),
    (
        "What is the EMI for a 3kW solar system in Kerala?",
        "For a 3kW system in Kerala, EMI starts at ₹2,500/month through Flarize's SBI partnership at 5.75% over 5 years.",
    ),
    (
        "What is Flarize's 5.75% rate and how is it different from SBI's standard rate?",
        "Flarize is an MNRE-empanelled vendor on India's national PM Surya Ghar portal. This enables a direct SBI channel partnership that gives Flarize customers 5.75% — lower than SBI's published rate of 7%.",
    ),
    (
        "How long does solar loan approval take through Flarize?",
        "Our documentation process takes up to one week, while bank procedures vary depending on the partner bank.",
    ),
    (
        "How much will I save over 25 years with a solar loan in Kerala?",
        "For a 3kW system at 5.75% over 5 years, your total investment is approximately ₹1,22,000 after subsidy. Over 25 years at a conservative 5% annual KSEB tariff increase, cumulative savings exceed ₹11 lakh. After year 5, invest ₹2,500/month at 12% SIP returns — that's ₹30 lakh in wealth.",
    ),
    (
        "What documents do I need for a solar loan in Kerala?",
        "Aadhaar card, PAN card, passbook/ bank statements, latest KSEB electricity bill, property ownership proof. For loans above ₹2L: income proof. For 3kW systems: no income proof required. Flarize collects and submits all documents on your behalf.",
    ),
    (
        "What happens to my solar system if I sell my house?",
        "Your solar system transfers with the house. KSEB net metering agreements and remaining warranty transfer to the new owner. A solar-equipped Kerala home commands a premium — buyers factor in zero electricity bills as a financial asset.",
    ),
]

GROUP_PURCHASE_FAQS = [
    (
        "What is a group solar purchase?",
        "A group solar purchase allows nearby homeowners to install solar together. By combining multiple installations in the same area, costs are reduced and installation becomes more efficient.",
    ),
    (
        "How many families are required to form a group?",
        "A group is confirmed when at least 5 families in the same area complete their booking. Once confirmed, installations are scheduled together.",
    ),
    (
        "What happens to my ₹1,000 booking amount?",
        "Your ₹1,000 booking amount reserves your spot in the group and is fully adjusted against your final solar system cost.",
    ),
    (
        "What if the group does not form?",
        "If the required number of families is not reached within the specified period, you can either receive a full refund, or continue with an individual installation while retaining your locked pricing (if applicable).",
    ),
    (
        "Is the solar system quality different from individual bookings?",
        "No. Group purchase customers receive the same panels, inverter brands, installation standards, warranty coverage, and service support as individual customers.",
    ),
    (
        "How much can I save through a group purchase?",
        "Savings vary based on system size and location, but most homeowners can save up to ₹10,000 compared to standard individual pricing.",
    ),
    (
        "How long does installation take after a group is confirmed?",
        "Once a group is confirmed, installations are typically completed within the scheduled group installation week, usually faster than individual installations.",
    ),
    (
        "Can I join if I already have a solar quotation?",
        "Yes. You can still join the group purchase program. Our team can review your existing quotation and help you compare costs, specifications, and potential savings.",
    ),
    (
        "How do I know the status of my group?",
        "After booking, you'll receive updates via WhatsApp, SMS, or phone regarding the number of families joined, group formation progress, installation schedule, and next steps.",
    ),
    (
        "Why is group solar cheaper?",
        "Group installations reduce logistics, survey, transportation, and crew mobilization costs by serving multiple nearby homes during the same installation period. These savings are passed directly to homeowners without compromising quality.",
    ),
]

SOLAR_COMPARISON_FAQS = [
    (
        "What is the best solar panel for Kerala's climate?",
        "The best panel depends on your roof space, budget, and energy needs. For Kerala, prioritize panels with a low temperature coefficient (below -0.35%/°C), IP68-rated junction boxes for humidity resistance, and proven tropical degradation rates. N-type TOPCon panels from Adani and Saatvik currently score highest in our Kerala Climate Rating due to superior heat tolerance and lower degradation. Waaree and Vikram Solar's bifacial models are also strong contenders with proven Kerala track records.",
    ),
    (
        "How important is temperature coefficient for solar panels in Kerala?",
        "Very important. Kerala regularly sees ambient temps above 35°C, pushing panel surfaces to 55-65°C. A panel rated -0.30%/°C loses about 12% output at 65°C, while one at -0.40%/°C loses about 16%. That 4% daily difference over 25 years compounds to a significant gap in total generation and returns on your investment.",
    ),
    (
        "Does high humidity affect solar panel performance?",
        "Yes. Kerala's humidity (often above 80%) accelerates potential-induced degradation (PID), corrodes poorly sealed junction boxes, and causes micro-cracks in lower-quality cells. Panels with IP68-rated junction boxes, anti-PID certification, and tropical-grade encapsulants perform significantly better over their 25-year lifespan. This is why we weight humidity resistance heavily in our Kerala Climate Score.",
    ),
    (
        "What does a 25-year solar panel warranty actually cover?",
        "Most panels have two separate warranties. The product warranty (typically 12 years) covers manufacturing defects — cell cracking, delamination, junction box failure. The performance warranty (25-30 years) guarantees minimum output, usually 80-87% at term end. In Kerala, the product warranty matters more because humidity and heat stress-test build quality early. Always confirm the warranty is manufacturer-backed, not just installer-backed.",
    ),
    (
        "How many solar panels do I need for my home in Kerala?",
        "Divide your monthly KSEB bill by ₹1,000 for approximate system size in kW. A 3kW system needs 5-6 panels (550W each) for bills up to ₹3,000/month. A 5kW system needs 9-10 panels for bills up to ₹5,000/month. Your actual requirement depends on roof direction, shading, and whether you plan to add high-consumption appliances like an EV charger in the coming years. A site visit gives the most accurate number.",
    ),
]

#: route -> (Page name, Page group, faq list). The Page rows mirror
#: ``sitepages.seed_pages`` (same names/groups where a route already appears
#: there); the two comparison-table routes are not in that command's list yet
#: because no page there previously needed a maintainable record.
PAGE_FAQS = {
    "/": ("Home", "Main", HOME_FAQS),
    "/solutions": ("Solutions", "Solutions", HOME_FAQS),
    "/quote-analyser": ("Quote Analyser", "Tools", HOME_FAQS),
    "/subsidy": ("Subsidy", "Programmes", SUBSIDY_FAQS),
    "/how-flarize-works": ("How Flarize Works", "Main", HOW_FLARIZE_WORKS_FAQS),
    "/inverter-comparison": ("Inverter Comparison", "Tools", INVERTER_COMPARISON_FAQS),
    "/inverter-comparison-table": ("Inverter Comparison Table", "Tools", INVERTER_COMPARISON_FAQS),
    "/solar-referral-program": ("Referral Programme", "Programmes", AFFILIATE_FAQS),
    "/residential": ("Residential", "Solutions", RESIDENTIAL_FAQS),
    "/solar-warranty": ("Solar Warranty", "Programmes", WARRANTY_FAQS),
    "/emi-calculator": ("EMI Calculator", "Tools", EMI_FAQS),
    "/group-purchase": ("Group Purchase", "Tools", GROUP_PURCHASE_FAQS),
    "/solar-comparison": ("Solar Comparison", "Tools", SOLAR_COMPARISON_FAQS),
    "/comparison-table": ("Solar Comparison Table", "Tools", SOLAR_COMPARISON_FAQS),
}


def seed_page_faqs(apps, schema_editor):
    Page = apps.get_model("sitepages", "Page")
    Faq = apps.get_model("faqs", "Faq")
    now = timezone.now()

    pages_created = 0
    faqs_created = 0
    for route, (name, group, faqs) in PAGE_FAQS.items():
        page, was_created = Page.objects.get_or_create(
            route=route,
            defaults={
                "name": name,
                "group": group,
                "is_protected": True,
                "status": "published",
            },
        )
        pages_created += int(was_created)

        for order, (question, answer) in enumerate(faqs):
            _, was_created = Faq.objects.get_or_create(
                page=page,
                section="",
                question=question,
                defaults={
                    "answer": answer,
                    "display_order": order,
                    "status": "published",
                    "published_at": now,
                },
            )
            faqs_created += int(was_created)


def unseed_page_faqs(apps, schema_editor):
    """Remove only the seeded rows nobody has edited since (``updated_by`` null)."""
    Page = apps.get_model("sitepages", "Page")
    Faq = apps.get_model("faqs", "Faq")

    all_questions = {q for _, _, faqs in PAGE_FAQS.values() for q, _ in faqs}
    Faq.objects.filter(
        page__route__in=PAGE_FAQS.keys(),
        question__in=all_questions,
        updated_by__isnull=True,
    ).delete()
    # Pages are never removed here: sitepages.seed_pages already treats routes
    # as permanent once registered, and other content (SEO, slots) may since
    # have attached to them.


class Migration(migrations.Migration):

    dependencies = [
        ("faqs", "0003_alter_faq_answer"),
        ("sitepages", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(seed_page_faqs, unseed_page_faqs),
    ]
