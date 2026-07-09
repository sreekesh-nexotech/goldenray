
export type WhySolarIcon = "sun" | "roof" | "grid";

export type WhySolarPoint = {
  icon: WhySolarIcon;
  title: string;
  description: string;
};

export type ServiceAreaContent = {
  /** Hero section copy. Heading is derived in the component. */
  hero: {
    badge: string;
    subtext: string;
    ctaLabel: string;
    trustLine: string;
    features: string[];
  };
  /** "Why Solar Works Well in <district>" section. */
  whySolar: {
    intro: string;
    points: WhySolarPoint[];
  };
  // Future sections go here (services, subsidies, testimonials, faq, …).
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
  };
}

/** Full content for a district, falling back to a generic Kerala version. */
export function getServiceAreaContent(district?: string): ServiceAreaContent {
  if (district && districtContent[district]) return districtContent[district];
  return makeDefault(district ?? "Kerala");
}
