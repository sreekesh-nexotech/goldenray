import { slugifyDistrict } from "@/data/service-area-data";

export type WhySolarIcon = "sun" | "roof" | "grid";

export type WhySolarPoint = {
  icon: WhySolarIcon;
  title: string;
  description: string;
};

export type InstallStep = {
  title: string;
  description: string;
  /** Optional inline link rendered under the description. */
  link?: { label: string; href: string };
};

export type RecentInstall = {
  /** CDN image of the completed installation (dynamic — driven from the CMS). */
  image: string;
  /** Accessible alt text for the install photo. */
  imageAlt: string;
  /** System headline, e.g. "3kW Rooftop Solar". */
  system: string;
  /** Town / panchayat the project sits in, e.g. "Cherthala, Alappuzha". */
  location: string;
  /** Outcome summary — bill reduction, savings, payback, system spec. */
  description: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type ServiceLocation = {
  /** Town / locality name shown on the card and map pin. */
  name: string;
  /** Short line describing what we do there. */
  description: string;
  /** Real coordinates — drive the map marker and the Google Maps redirect. */
  lat: number;
  lng: number;
};

export type ServiceAreaContent = {
  hero: {
    badge: string;
    subtext: string;
    ctaLabel: string;
    trustLine: string;
    features: string[];
  };
  whySolar: {
    intro: string;
    points: WhySolarPoint[];
  };
  locations: {
    headingDescription: string;
    places: ServiceLocation[];
  };
  installation: {
    steps: InstallStep[];
    /** Bolded panchayat list in the "We also serve …" footer line. */
    alsoServe: string;
  };
  recentInstalls: {
    /** Sub-heading under the "Recent Installs" title. */
    intro: string;
    items: RecentInstall[];
  };
  narrative: {
    /** Full-bleed background CDN image behind the quote (dynamic — from CMS). */
    image: string;
    /** Accessible alt text for the background image. */
    imageAlt: string;
    /** Local-story quote rendered centered over the image. Empty = hide section. */
    quote: string;
  };
  /** District-specific FAQ accordion. Empty = hide section. */
  faqs: FaqItem[];
};

// ─── Shared defaults ──────────────────────────────────────────────────────────

const BADGE = "Affordable Rooftop Solar Solutions with 25-Year Warranty";


const TRUST_LINE =
  "Backed by Golden Ray Renewable Energy — 8 years, 300+ installations, 4.9-star rated, KSEB-empaneled and MNRE-approved.";

const DEFAULT_FEATURES = [
  "Lower Electricity Bills",
  "₹78,000 Subsidy Available",
  "25-Year Warranty",
];

// The 5 installation steps are identical across districts except the
// "Custom Design" step, which references the local wind-load conditions.
function makeInstallSteps(designNote: string): InstallStep[] {
  return [
    {
      title: "Site Survey",
      description:
        "Certified engineer assesses your rooftop, shade, structural load, and KSEB consumption data. Written proposal within 24 hours.",
    },
    {
      title: "Custom Design",
      description: designNote,
    },
    {
      title: "Permitting",
      description:
        "We submit your KSEB net metering application and PM Surya Ghar subsidy to MNRE — fully handled. KSEB approval takes 5–7 working days.",
      link: { label: "KSEB net metering", href: "/kseb-net-metering" },
    },
    {
      title: "Installation",
      description:
        "Certified team completes mounting and wiring in 1–2 days. HDGI rails, BIS-certified cables, surge protection, earthing to MNRE standards.",
    },
    {
      title: "Activation",
      description:
        "KSEB installs bidirectional net meter. System registered on monitoring portal. Full documentation handed over. 25-year warranty activates.",
    },
  ];
}

// The FAQ set is identical across districts apart from the district name woven
// into each question and answer.
function makeFaqs(district: string): FaqItem[] {
  return [
    {
      question: `How much does solar installation cost in ${district}?`,
      answer:
        "A typical 3kW home system costs around ₹1.6–1.8 lakh before subsidy. After the PM Surya Ghar subsidy of up to ₹78,000, most homes pay it back in 3–4 years through bill savings. You get three checked options with exact numbers after a free site survey.",
    },
    {
      question: `Does Flarize handle KSEB net metering in ${district}?`,
      answer: `Yes. We file your KSEB net metering application and follow it through approval — you don't deal with KSEB yourself. Sanction typically takes 5–7 working days across ${district}.`,
    },
    {
      question: "How long does installation take?",
      answer:
        "Once your option and KSEB approval are through, mounting and wiring take 1–2 days. We use pre-packed kits and a local team, so there's no long wait for parts.",
    },
    {
      question: `Which areas of ${district} do you cover?`,
      answer: `Our certified local teams are stationed across ${district}, so we install district-wide with on-site technician visits within 48 hours — no waiting for someone to travel from another district. Not sure if we reach your panchayat? WhatsApp us and we'll confirm within minutes.`,
    },
    {
      question: "What subsidy can I claim?",
      answer:
        "Homes can claim the PM Surya Ghar (MNRE) subsidy — up to ₹78,000 for systems of 3kW and above. We handle the full subsidy paperwork and submission for you as part of the install.",
    },
    {
      question: "What happens after installation?",
      answer:
        "You stay with Flarize. App-based generation monitoring, service visits, and a written 25-year warranty. One number to call for the life of the system.",
    },
  ];
}

// ─── Per-district content ─────────────────────────────────────────────────────

export const districtContent: Record<string, ServiceAreaContent> = {
  Alappuzha: {
    hero: {
      badge: BADGE,
      subtext:
        "Clean, affordable rooftop solar solutions for homes and businesses across Alappuzha district. Government subsidies available. Get paid for excess power through KSEB net metering.",
      ctaLabel: "Get Free Solar Quote in Alappuzha",
      trustLine: TRUST_LINE,
      features: DEFAULT_FEATURES,
    },
    whySolar: {
      intro:
        "Alappuzha's coastal climate and terrace-heavy housing make it one of Kerala's most solar-ready districts.",
      points: [
        {
          icon: "sun",
          title: "Sunlight Availability",
          description:
            "5.2–5.6 kWh/m²/day average. Coastal geography delivers consistent, unobstructed sunlight — even diffuse light generates strong output from mono PERC and bifacial panels.",
        },
        {
          icon: "roof",
          title: "Rooftop Suitability",
          description:
            "RCC flat roofs dominate Alappuzha architecture — ideal for aluminium rail mounting. We use HDGI-treated rails rated for coastal humidity and salt-air environments.",
        },
        {
          icon: "grid",
          title: "Grid Connectivity",
          description:
            "KSEB has fully operational net metering across Alappuzha district. Surplus units you generate are exported and credited at prevailing rates. We handle the full application.",
        },
      ],
    },
    locations: {
      headingDescription:
        "From the historic canals of Alappuzha town to the Kuttanad lowlands — our certified local installation teams are stationed across the district, enabling 2-day on-site installation with zero waiting periods.",
      places: [
        {
          name: "Cherthala",
          description: "Coastal installations with salt-air-rated hardware",
          lat: 9.6841,
          lng: 76.3388,
        },
        {
          name: "Ambalappuzha",
          description: "Residential + hybrid inverter options for backup power",
          lat: 9.3835,
          lng: 76.3339,
        },
        {
          name: "Kayamkulam",
          description: "Active commercial solar hub — seafood and coir industries",
          lat: 9.1795,
          lng: 76.5010,
        },
        {
          name: "Haripad",
          description: "Full PM Surya Ghar subsidy paperwork handled",
          lat: 9.2870,
          lng: 76.4590,
        },
        {
          name: "Chengannur",
          description: "Subsidy applications processed within 7 working days",
          lat: 9.3163,
          lng: 76.6146,
        },
        {
          name: "Mavelikkara",
          description: "Residential and commercial — strong KSEB net metering",
          lat: 9.2588,
          lng: 76.5510,
        },
        {
          name: "Kuttanad",
          description: "Elevated mounting for water-adjacent and flood-risk zones",
          lat: 9.4000,
          lng: 76.4500,
        },
        {
          name: "Aroor",
          description: "Coastal residential — humidity-rated, anti-corrosion hardware",
          lat: 9.8667,
          lng: 76.3000,
        },
      ],
    },
    installation: {
      steps: makeInstallSteps(
        "System designed for your roof orientation, Alappuzha coastal wind loads, and consumption pattern. Includes inverter sizing and generation forecast.",
      ),
      alsoServe: "Mannar, Bharanikavu, Pulincunnoo",
    },
    recentInstalls: {
      intro:
        "Real installations. Real numbers. Three recent projects completed across Alappuzha district — with verified generation data and customer outcomes.",
      items: [
        {
          image: "https://golden-ray.b-cdn.net/service-area/819d434c1472d0e4dc73223f360d907f4cc99d80.png",
          imageAlt: "3kW rooftop solar installation in Cherthala, Alappuzha",
          system: "3kW Rooftop Solar",
          location: "Cherthala, Alappuzha",
          description:
            "Monthly bill reduced from Rs.4,500 to Rs.300. Annual savings: Rs.25,200. Payback: 3.5 years. System: 3kW on-grid, mono PERC panels, string inverter.",
        },
        {
          image: "https://golden-ray.b-cdn.net/service-area/ed41c88fecb9b837537e8b46da218cf4ee7a0b88.png",
          imageAlt: "10kW commercial solar installation in Kayamkulam, Alappuzha",
          system: "10kW Commercial Solar",
          location: "Kayamkulam, Alappuzha",
          description:
            "Industrial on-grid system for seafood processing unit. 90% daytime consumption offset. Monthly savings: Rs.12,000+. Payback: 3.2 years.",
        },
        {
          image: "https://golden-ray.b-cdn.net/service-area/43144031607b751402ace4229a7ed49306400215.png",
          imageAlt: "5kW residential solar installation in Ambalappuzha, Alappuzha",
          system: "5kW Residential Solar",
          location: "Ambalappuzha, Alappuzha",
          description:
            "Hybrid inverter with 10kWh battery backup. Zero power cuts post-install. Monthly bill: Rs.6,800 to Rs.800. Grid import reduced by 80%.",
        },
      ],
    },
    narrative: {
      image:
        "https://golden-ray.b-cdn.net/service-area/0318176579a5b2167a99295fc9b9a3814e033cc2.png",
      imageAlt: "Aerial view of the Alappuzha coast and Kuttanad backwaters",
      quote:
        "Flarize has been installing solar systems across Alappuzha district since 2018, working across both coastal towns and the unique conditions of the Kuttanad lowlands. Our local installation team understands Alappuzha's specific challenges — salt air corrosion in coastal zones, flood-risk elevation requirements in Kuttanad, and humidity-accelerated degradation that affects non-rated mounting hardware. Every system uses HDGI-treated aluminium rails, IP-65 rated junction boxes, and UV-stabilised DC cabling rated for coastal conditions. Our Alappuzha service team guarantees on-site technician visits within 48 hours — no waiting for someone to travel from another district. We operate as a KSEB-empaneled vendor under MNRE's Rooftop Solar Phase II programme, serving residential and commercial customers across all 9 taluks of the district.",
    },
    faqs: makeFaqs("Alappuzha"),
  },

  Ernakulam: {
    hero: {
      badge: BADGE,
      subtext:
        "Clean, affordable rooftop solar for homes and businesses across Ernakulam and Kochi. PM Surya Ghar subsidies available, with surplus power credited through KSEB net metering.",
      ctaLabel: "Get Free Solar Quote in Ernakulam",
      trustLine: TRUST_LINE,
      features: DEFAULT_FEATURES,
    },
    whySolar: {
      intro:
        "Ernakulam pairs an open urban skyline with strong grid infrastructure, giving rooftop solar dependable year-round returns.",
      points: [
        {
          icon: "sun",
          title: "Sunlight Availability",
          description:
            "5.4–5.8 kWh/m²/day average. Ernakulam's open skyline and long clear spells give mono PERC panels high, dependable yields throughout the year.",
        },
        {
          icon: "roof",
          title: "Rooftop Suitability",
          description:
            "A mix of RCC terraces and sloped commercial roofs across Kochi — both suit low-profile mounting. Our structural surveys size systems for high-rise wind loads.",
        },
        {
          icon: "grid",
          title: "Grid Connectivity",
          description:
            "KSEB net metering is well established across the Ernakulam grid with fast sanction turnaround. Surplus generation is exported and credited, and we manage the full paperwork.",
        },
      ],
    },
    locations: {
      headingDescription:
        "From the Kochi waterfront to the eastern highland towns — our certified local installation teams are stationed across the district, enabling 2-day on-site installation with zero waiting periods.",
      places: [
        {
          name: "Kochi",
          description: "High-rise and commercial rooftops — wind-load-rated mounting",
          lat: 9.9312,
          lng: 76.2673,
        },
        {
          name: "Aluva",
          description: "Residential + hybrid inverter options for backup power",
          lat: 10.1004,
          lng: 76.3570,
        },
        {
          name: "Kakkanad",
          description: "IT-park commercial hub — large C&I rooftop systems",
          lat: 10.0159,
          lng: 76.3419,
        },
        {
          name: "Perumbavoor",
          description: "Industrial and plywood-cluster solar installations",
          lat: 10.1074,
          lng: 76.4750,
        },
        {
          name: "Muvattupuzha",
          description: "Full PM Surya Ghar subsidy paperwork handled",
          lat: 9.9895,
          lng: 76.5790,
        },
        {
          name: "Angamaly",
          description: "Residential and commercial — strong KSEB net metering",
          lat: 10.1960,
          lng: 76.3860,
        },
        {
          name: "Kothamangalam",
          description: "Highland rooftops — optimised tilt for hill terrain",
          lat: 10.0614,
          lng: 76.6300,
        },
        {
          name: "Tripunithura",
          description: "Subsidy applications processed within 7 working days",
          lat: 9.9450,
          lng: 76.3470,
        },
      ],
    },
    installation: {
      steps: makeInstallSteps(
        "System designed for your roof orientation, Ernakulam urban high-rise wind loads, and consumption pattern. Includes inverter sizing and generation forecast.",
      ),
      alsoServe: "Kalady, Chottanikkara, Njarakkal",
    },
    recentInstalls: {
      intro:
        "Real installations. Real numbers. Three recent projects completed across Ernakulam district — with verified generation data and customer outcomes.",
      items: [
        {
          image: "https://golden-ray.b-cdn.net/service-area/819d434c1472d0e4dc73223f360d907f4cc99d80.png",
          imageAlt: "15kW commercial solar installation in Kakkanad, Ernakulam",
          system: "15kW Commercial Solar",
          location: "Kakkanad, Ernakulam",
          description:
            "IT-park rooftop C&I system. 92% daytime offset across office hours. Monthly savings: Rs.18,000+. Payback: 3.1 years. On-grid, bifacial panels.",
        },
        {
          image: "https://golden-ray.b-cdn.net/service-area/ed41c88fecb9b837537e8b46da218cf4ee7a0b88.png",
          imageAlt: "5kW residential solar installation in Aluva, Ernakulam",
          system: "5kW Residential Solar",
          location: "Aluva, Ernakulam",
          description:
            "Hybrid inverter with 8kWh battery backup. Monthly bill reduced from Rs.7,200 to Rs.750. Annual savings: Rs.38,000. Payback: 3.4 years.",
        },
        {
          image: "https://golden-ray.b-cdn.net/service-area/43144031607b751402ace4229a7ed49306400215.png",
          imageAlt: "3kW rooftop solar installation in Tripunithura, Ernakulam",
          system: "3kW Rooftop Solar",
          location: "Tripunithura, Ernakulam",
          description:
            "On-grid mono PERC system with string inverter. Monthly bill from Rs.4,100 to Rs.280. Grid export credited via KSEB net metering. Payback: 3.6 years.",
        },
      ],
    },
    narrative: {
      image:
        "https://golden-ray.b-cdn.net/service-area/0318176579a5b2167a99295fc9b9a3814e033cc2.png",
      imageAlt: "Aerial view of Kochi's waterfront and Ernakulam skyline",
      quote:
        "Flarize has been installing solar systems across Ernakulam and Kochi since 2018, from high-rise commercial rooftops on the waterfront to residential terraces in the eastern highland towns. Our local team understands Ernakulam's specific conditions — high-rise wind loads on the Kochi skyline, mixed RCC and sloped commercial roofs, and dense grid infrastructure that demands clean net-metering synchronisation. Every system uses HDGI-treated aluminium rails, IP-65 rated junction boxes, and BIS-certified DC cabling sized for urban high-rise exposure. Our Ernakulam service team guarantees on-site technician visits within 48 hours — no waiting for someone to travel from another district. We operate as a KSEB-empaneled vendor under MNRE's Rooftop Solar Phase II programme, serving residential and commercial customers across the district.",
    },
    faqs: makeFaqs("Ernakulam"),
  },

  Kannur: {
    hero: {
      badge: BADGE,
      subtext:
        "Clean, affordable rooftop solar solutions for homes and businesses across Kannur district. Government subsidies available, and you get paid for excess power through KSEB net metering.",
      ctaLabel: "Get Free Solar Quote in Kannur",
      trustLine: TRUST_LINE,
      features: DEFAULT_FEATURES,
    },
    whySolar: {
      intro:
        "Kannur's bright northern coast and sturdy roof stock make it a high-yield location for long-life solar systems.",
      points: [
        {
          icon: "sun",
          title: "Sunlight Availability",
          description:
            "5.3–5.7 kWh/m²/day average. Kannur's northern coast enjoys long, bright afternoons — strong irradiance that keeps bifacial and mono PERC panels producing at peak.",
        },
        {
          icon: "roof",
          title: "Rooftop Suitability",
          description:
            "Traditional tiled and RCC roofs are common in Kannur. We use corrosion-resistant HDGI mounting rails engineered for coastal salt-air and monsoon exposure.",
        },
        {
          icon: "grid",
          title: "Grid Connectivity",
          description:
            "KSEB net metering operates across Kannur district with reliable credit for exported units. We handle site inspection, application, and grid synchronisation end to end.",
        },
      ],
    },
    locations: {
      headingDescription:
        "From the Kannur coastline to the eastern hill towns of Iritty — our certified local installation teams are stationed across the district, enabling 2-day on-site installation with zero waiting periods.",
      places: [
        {
          name: "Kannur",
          description: "Coastal installations with salt-air-rated hardware",
          lat: 11.8745,
          lng: 75.3704,
        },
        {
          name: "Thalassery",
          description: "Residential + hybrid inverter options for backup power",
          lat: 11.7480,
          lng: 75.4929,
        },
        {
          name: "Payyannur",
          description: "Full PM Surya Ghar subsidy paperwork handled",
          lat: 12.0947,
          lng: 75.2020,
        },
        {
          name: "Taliparamba",
          description: "Residential and commercial — strong KSEB net metering",
          lat: 12.0361,
          lng: 75.3599,
        },
        {
          name: "Mattannur",
          description: "Subsidy applications processed within 7 working days",
          lat: 11.9330,
          lng: 75.5750,
        },
        {
          name: "Iritty",
          description: "Highland rooftops — optimised tilt for hill terrain",
          lat: 11.9860,
          lng: 75.6320,
        },
        {
          name: "Kuthuparamba",
          description: "Active commercial solar hub for the central taluk",
          lat: 11.8300,
          lng: 75.5700,
        },
        {
          name: "Panoor",
          description: "Coastal residential — humidity-rated, anti-corrosion hardware",
          lat: 11.7660,
          lng: 75.5330,
        },
      ],
    },
    installation: {
      steps: makeInstallSteps(
        "System designed for your roof orientation, Kannur coastal wind loads, and consumption pattern. Includes inverter sizing and generation forecast.",
      ),
      alsoServe: "Azhikode, Chirakkal, Valapattanam",
    },
    recentInstalls: {
      intro:
        "Real installations. Real numbers. Three recent projects completed across Kannur district — with verified generation data and customer outcomes.",
      items: [
        {
          image: "https://golden-ray.b-cdn.net/service-area/819d434c1472d0e4dc73223f360d907f4cc99d80.png",
          imageAlt: "3kW rooftop solar installation in Thalassery, Kannur",
          system: "3kW Rooftop Solar",
          location: "Thalassery, Kannur",
          description:
            "Monthly bill reduced from Rs.4,300 to Rs.320. Annual savings: Rs.23,800. Payback: 3.5 years. System: 3kW on-grid, mono PERC panels, string inverter.",
        },
        {
          image: "https://golden-ray.b-cdn.net/service-area/ed41c88fecb9b837537e8b46da218cf4ee7a0b88.png",
          imageAlt: "8kW commercial solar installation in Kuthuparamba, Kannur",
          system: "8kW Commercial Solar",
          location: "Kuthuparamba, Kannur",
          description:
            "On-grid system for a retail complex. 88% daytime consumption offset. Monthly savings: Rs.9,800+. Payback: 3.3 years. Bifacial panels, HDGI rails.",
        },
        {
          image: "https://golden-ray.b-cdn.net/service-area/43144031607b751402ace4229a7ed49306400215.png",
          imageAlt: "5kW residential solar installation in Payyannur, Kannur",
          system: "5kW Residential Solar",
          location: "Payyannur, Kannur",
          description:
            "Hybrid inverter with 10kWh battery backup. Zero power cuts post-install. Monthly bill: Rs.6,500 to Rs.700. Grid import reduced by 82%.",
        },
      ],
    },
    narrative: {
      image:
        "https://golden-ray.b-cdn.net/service-area/43144031607b751402ace4229a7ed49306400215.png",
      imageAlt: "Aerial view of the Kannur coastline and northern Kerala hills",
      quote:
        "Flarize has been installing solar systems across Kannur district since 2018, working from the bright northern coastline to the eastern hill towns of Iritty. Our local installation team understands Kannur's specific challenges — salt air corrosion along the coast, monsoon exposure on traditional tiled roofs, and optimised tilt for highland terrain. Every system uses HDGI-treated aluminium rails, IP-65 rated junction boxes, and UV-stabilised DC cabling rated for coastal and monsoon conditions. Our Kannur service team guarantees on-site technician visits within 48 hours — no waiting for someone to travel from another district. We operate as a KSEB-empaneled vendor under MNRE's Rooftop Solar Phase II programme, serving residential and commercial customers across all taluks of the district.",
    },
    faqs: makeFaqs("Kannur"),
  },
};

// ─── Generic fallback for districts without bespoke content ───────────────────

function makeDefault(district: string): ServiceAreaContent {
  return {
    hero: {
      badge: BADGE,
      subtext: `Clean, affordable rooftop solar solutions for homes and businesses across ${district} district. Government subsidies available. Get paid for excess power through KSEB net metering.`,
      ctaLabel: `Get Free Solar Quote in ${district}`,
      trustLine: TRUST_LINE,
      features: DEFAULT_FEATURES,
    },
    whySolar: {
      intro: `${district}'s tropical sunlight, terrace-heavy housing, and statewide net metering make rooftop solar a dependable investment.`,
      points: [
        {
          icon: "sun",
          title: "Sunlight Availability",
          description:
            "5.0–5.6 kWh/m²/day average. Consistent tropical sunlight — even diffuse light generates strong output from mono PERC and bifacial panels.",
        },
        {
          icon: "roof",
          title: "Rooftop Suitability",
          description:
            "RCC and tiled roofs are common across the district — both ideal for rail mounting. We use HDGI-treated rails rated for Kerala's humid, coastal conditions.",
        },
        {
          icon: "grid",
          title: "Grid Connectivity",
          description:
            `KSEB net metering is operational across ${district}. Surplus units you generate are exported and credited at prevailing rates. We handle the full application.`,
        },
      ],
    },
    locations: {
      headingDescription: `Our certified local installation teams are stationed across ${district}, enabling fast on-site installation with zero waiting periods.`,
      // No bespoke town-level map data for this district yet — the Locations
      // section falls back to heading-only when `places` is empty.
      places: [],
    },
    installation: {
      steps: makeInstallSteps(
        `System designed for your roof orientation, ${district}'s local wind loads, and consumption pattern. Includes inverter sizing and generation forecast.`,
      ),
      alsoServe: "",
    },
    recentInstalls: {
      intro: `Real installations. Real numbers. Recent projects completed across ${district} — with verified generation data and customer outcomes.`,
      // No bespoke install photos for this district yet — the section hides
      // itself when `items` is empty.
      items: [],
    },
    narrative: {
      // No bespoke local story for this district yet — an empty quote hides
      // the section entirely.
      image: "",
      imageAlt: "",
      quote: "",
    },
    faqs: makeFaqs(district),
  };
}

/** Full content for a district, falling back to a generic Kerala version. */
export function getServiceAreaContent(district?: string): ServiceAreaContent {
  if (district && districtContent[district]) return districtContent[district];
  return makeDefault(district ?? "Kerala");
}

// ─── Served districts ─────────────────────────────────────────────────────────
// Only districts with bespoke content in `districtContent` get a live page.
// Everything else 404s. Add a district's content above to make it live.

/** Canonical names of the districts we currently have live pages for. */
export const servedDistricts: string[] = Object.keys(districtContent);

/** Canonical URL slugs for the served districts (e.g. "alappuzha"). */
export const servedDistrictSlugs: string[] =
  servedDistricts.map(slugifyDistrict);

/** True if the given canonical district name has a live service-area page. */
export function isServedDistrict(district?: string): boolean {
  return Boolean(district && district in districtContent);
}
