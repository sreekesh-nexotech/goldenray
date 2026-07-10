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
