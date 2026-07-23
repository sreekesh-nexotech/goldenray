// src/data/studio/entries.ts
import type { Entry } from "@/types/studio";
import { hoursAgo as H } from "./constants";

/**
 * Blog content — the entries across every collection. Static seed matching the
 * design; swap for `GET /api/{collection}` responses during API integration.
 */
export const entries: Entry[] = [
  {
    id: "a1", coll: "articles", tpl: "solar-guide", title: "The 2026 PM Surya Ghar Subsidy Guide", slug: "pm-surya-ghar-subsidy-2026", slugT: true,
    excerpt: "A plain-English breakdown of every rooftop-solar subsidy available in 2026 — who qualifies, how much you actually get back, and how to claim it.",
    author: "flarize", cats: ["Subsidy", "Government"], tags: ["rooftop", "subsidy-2026"], status: "published", pubDate: "18 Jul 2026", _ts: H(2), savedTs: H(2),
    images: { coverImg: "m4", socialSharing: "m2", bodyImages: ["m3", "m1"] },
    attrs: { readTime: "8", badge: "Certified installer", insights: "Most homeowners leave 15,000–20,000 rupees of eligible subsidy unclaimed simply by missing the empanelment step.", warning: "" },
    blocks: [
      { id: "a1b1", label: "Introduction", html: "<p>Rooftop solar has never been cheaper — but the subsidy landscape shifts every year. This guide walks through exactly what PM Surya Ghar pays in 2026, who qualifies, and the paperwork Flarize handles for you.</p>" },
      { id: "a1b2", label: "Body", html: "<h4>Who qualifies in 2026?</h4><p>Any residential rooftop system up to 10 kW is eligible, provided the installer is empanelled with KSEB.</p><ul><li>1–2 kW: ₹30,000 per kW</li><li>2–3 kW: ₹18,000 for the third kW</li><li>Above 3 kW: capped at ₹78,000 total</li></ul>" },
    ],
    seo: { mt: "2026 PM Surya Ghar Subsidy Guide — Who Qualifies & How Much", md: "Everything about rooftop solar subsidies in 2026 — eligibility, amounts, and how to claim yours.", cu: "", kw: "solar subsidy, PM Surya Ghar, rooftop, 2026" },
  },
  {
    id: "a2", coll: "articles", tpl: "solar-guide", title: "Net metering in Kerala, explained simply", slug: "net-metering-kerala", slugT: true,
    excerpt: "Your meter runs both ways once KSEB approves net metering. The whole process, minus the jargon.",
    author: "anair", cats: ["Basics"], tags: ["kseb", "net-metering"], status: "modified", pubDate: "12 Jul 2026", _ts: H(5), savedTs: H(5),
    images: { coverImg: "m2", bodyImages: [] },
    attrs: { readTime: "6", badge: "Editor's pick", insights: "KSEB settles net-metering credits bimonthly — most owners never check the export reading.", warning: "" },
    blocks: [{ id: "a2b1", label: "Introduction", html: "<p>Your meter runs both ways once KSEB approves net metering. Here is the entire process — application, meter change, and how credits appear on your bimonthly bill.</p>" }],
    seo: { mt: "Net Metering in Kerala — the KSEB Process Explained", md: "How KSEB net metering works: application, meter change, and how credits appear on your bill.", cu: "", kw: "net metering, KSEB, Kerala" },
  },
  {
    id: "a3", coll: "articles", tpl: "solar-guide", title: "How a ₹2.4L system erases a ₹6,000 bill", slug: "cut-your-kseb-bill-75", slugT: true,
    excerpt: "The honest math on a 5 kW system in Ernakulam: payback in under 5 years at current KSEB tariffs.",
    author: "flarize", cats: ["Savings"], tags: ["kseb", "emi"], status: "published", pubDate: "09 Jul 2026", _ts: H(26), savedTs: H(26),
    images: { coverImg: "m1", bodyImages: [] },
    attrs: { readTime: "7", badge: "", insights: "A 5 kW system in Ernakulam pays for itself in under 5 years at current tariffs.", warning: "" },
    blocks: [{ id: "a3b1", label: "Introduction", html: "<p>A 75% cut is not a marketing line — it is what the tariff slabs do once your daytime load runs on the sun. Here is the full worked example.</p>" }],
    seo: { mt: "Cut Your KSEB Bill by 75% — the Real Math", md: "A worked example: 5 kW rooftop solar vs a ₹6,000 bimonthly KSEB bill.", cu: "", kw: "KSEB bill, solar savings" },
  },
  {
    id: "a4", coll: "articles", tpl: "comparison", title: "Battery vs grid: the honest comparison", slug: "battery-vs-grid", slugT: true,
    excerpt: "Twelve parameters, no favourites — when a battery earns its keep and when the grid is your battery.",
    author: "anair", cats: ["Comparisons"], tags: [], status: "draft", pubDate: null, _ts: H(30), savedTs: H(30),
    images: {},
    attrs: { readTime: "9", winner: "Depends on usage", verdict: "For most KSEB households under ₹8,000 a month, grid-tied wins on payback." },
    blocks: [{ id: "a4b1", label: "Introduction", html: "<p>Batteries are the most requested add-on and the least understood. We compared both setups across 12 parameters.</p>" }],
    seo: { mt: "", md: "", cu: "", kw: "" },
  },
  {
    id: "a5", coll: "articles", tpl: "solar-guide", title: "Monsoon maintenance: what your panels actually need", slug: "monsoon-panel-maintenance", slugT: true,
    excerpt: "Kerala gets 120+ rain days. What that means for output, cleaning and the one check that matters.",
    author: "flarize", cats: ["Maintenance"], tags: ["monsoon", "rooftop"], status: "published", pubDate: "02 Jul 2026", _ts: H(140), savedTs: H(140),
    images: { coverImg: "m2", bodyImages: [] },
    attrs: { readTime: "5", badge: "", insights: "Rain cleans panels better than most manual washes — the risk is the mounting, not the glass.", warning: "Never walk a wet rooftop array. Book a service visit instead." },
    blocks: [{ id: "a5b1", label: "Introduction", html: "<p>The monsoon is when new owners worry most and need to do least. Here is the honest checklist.</p>" }],
    seo: { mt: "Solar Panel Monsoon Maintenance in Kerala", md: "What Kerala monsoons actually do to rooftop solar output and hardware.", cu: "", kw: "monsoon, solar maintenance" },
  },
  {
    id: "a6", coll: "articles", tpl: "solar-guide", title: "5.65% SBI loans: how a solar EMI really works", slug: "sbi-solar-loan-emi", slugT: true,
    excerpt: "The Flarize-exclusive SBI rate, the subsidy timing trick, and a full EMI table for 3–8 kW systems.",
    author: "smenon", cats: ["Savings"], tags: ["emi"], status: "draft", pubDate: null, _ts: H(70), savedTs: H(70),
    images: {},
    attrs: { readTime: "6", badge: "", insights: "", warning: "" },
    blocks: [{ id: "a6b1", label: "Introduction", html: "<p>Most families pay for solar out of the bill savings themselves. Here is how the 5.65% SBI rate makes that work.</p>" }],
    seo: { mt: "", md: "", cu: "", kw: "" },
  },
  {
    id: "c1", coll: "case-studies", tpl: "case-study", title: "Ernakulam villa — 5 kW installed in 4 days", slug: "ernakulam-villa-5kw", slugT: true,
    excerpt: "Surveyed Monday, generating by Friday. A 5 kW TOPCon array on a two-storey villa.",
    author: "flarize", cats: [], tags: ["rooftop"], status: "published", pubDate: "15 Jul 2026", _ts: H(72), savedTs: H(72),
    images: { coverImg: "m3", siteGallery: ["m1", "m4"] },
    attrs: { location: "Ernakulam, Kerala", systemKw: "5", monthlySavings: "4800", quote: "Bill went from ₹5,600 to ₹800 in the first cycle." },
    blocks: [{ id: "c1b1", label: "Overview", html: "<p>A 5 kW TOPCon array on a two-storey villa — surveyed Monday, KSEB net metering filed Tuesday, generating by Friday.</p>" }],
    seo: { mt: "Case Study: 5 kW in 4 Days — Ernakulam", md: "", cu: "", kw: "" },
  },
  {
    id: "c2", coll: "case-studies", tpl: "case-study", title: "Thrissur housing society — 40 kW shared rooftop", slug: "thrissur-society-40kw", slugT: true,
    excerpt: "Eighteen flats, one rooftop, one group-purchase price. The first society install under the 2026 slab.",
    author: "anair", cats: [], tags: [], status: "modified", pubDate: "30 Jun 2026", _ts: H(50), savedTs: H(50),
    images: { coverImg: "m4", siteGallery: ["m3"] },
    attrs: { location: "Thrissur, Kerala", systemKw: "40", monthlySavings: "38000", quote: "The society meeting took longer than the install." },
    blocks: [{ id: "c2b1", label: "Overview", html: "<p>Housing societies get their own subsidy slab — and their own headaches. This one went right.</p>" }],
    seo: { mt: "", md: "", cu: "", kw: "" },
  },
  {
    id: "p1", coll: "pages", tpl: "standard-page", title: "About Flarize", slug: "about", slugT: true,
    excerpt: "You deal with Flarize. We deal with everyone else.",
    author: "flarize", cats: [], tags: [], status: "published", pubDate: "12 May 2026", _ts: H(700), savedTs: H(700),
    images: { heroImage: "m3" }, attrs: {},
    blocks: [{ id: "p1b1", label: "Body", html: "<p>Flarize is a Kerala solar company selling one thing: a managed, end-to-end path to rooftop solar. WhatsApp your KSEB bill, get three quotes in 24 hours, installed in 3–7 days.</p>" }],
    seo: { mt: "About Flarize", md: "", cu: "", kw: "" },
  },
  {
    id: "p2", coll: "pages", tpl: "standard-page", title: "Warranty & service promise", slug: "warranty", slugT: true,
    excerpt: "25 years of monitoring and service, in writing.",
    author: "flarize", cats: [], tags: [], status: "published", pubDate: "03 Jun 2026", _ts: H(290), savedTs: H(290),
    images: {}, attrs: {},
    blocks: [{ id: "p2b1", label: "Body", html: "<p>Every Flarize install carries the energy-loss guarantee: if the system underperforms the modelled output, we pay the difference.</p>" }],
    seo: { mt: "Flarize Warranty & Service", md: "", cu: "", kw: "" },
  },
];
