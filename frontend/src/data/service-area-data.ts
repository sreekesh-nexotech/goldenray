// src/data/service-area-data.ts

export type ServiceType =
  | "Residential Solar"
  | "Commercial & Industrial"
  | "Group Purchase"
  | "Subsidy Assistance"
  | "Maintenance & SolarCare";

export const SERVICE_OPTIONS: ServiceType[] = [
  "Residential Solar",
  "Commercial & Industrial",
  "Group Purchase",
  "Subsidy Assistance",
  "Maintenance & SolarCare",
];

export type ServiceAreaCard = {
  district: string;
  image: string;
  isTopHub?: boolean;
  features: string[];
  services: ServiceType[];
  ctaLabel: string;
  ctaLink: string;
};

// Sentinel values used by the filter UI to mean "no filter applied".
export const ALL_REGIONS = "All Regions";
export const ALL_SERVICES = "Service Offered";

const DEFAULT_IMAGE =
  "https://golden-ray.b-cdn.net/About%20us/d44d8059-d21e-4d21%20ENHANCED.jpeg";

// Canonical 14 Kerala districts (used by the region dropdown & navbar).
export const keralaDistricts: string[] = [
  "Thiruvananthapuram",
  "Kollam",
  "Pathanamthitta",
  "Alappuzha",
  "Kottayam",
  "Idukki",
  "Ernakulam",
  "Thrissur",
  "Palakkad",
  "Malappuram",
  "Kozhikode",
  "Wayanad",
  "Kannur",
  "Kasaragod",
];

/**
 * Maps the various names/spellings a district can appear under (marketing names,
 * navbar spellings, search input) to a single canonical district so filtering
 * works no matter where the value came from.
 */
export function normalizeDistrict(name: string): string {
  const aliases: Record<string, string> = {
    trivandrum: "Thiruvananthapuram",
    thiruvananthapuram: "Thiruvananthapuram",
    kochi: "Ernakulam",
    cochin: "Ernakulam",
    ernakulam: "Ernakulam",
    calicut: "Kozhikode",
    kozhikode: "Kozhikode",
    kasargod: "Kasaragod",
    kasaragod: "Kasaragod",
    wayanadu: "Wayanad",
    wayanad: "Wayanad",
  };
  const key = name.trim().toLowerCase();
  return aliases[key] ?? name.trim();
}

export const allServiceAreas: ServiceAreaCard[] = [
  {
    district: "Trivandrum",
    image: DEFAULT_IMAGE,
    isTopHub: true,
    features: [
      "Residential & Industrial",
      "KSEB Subsidy Support",
      "24hr Maintenance Team",
    ],
    services: [
      "Residential Solar",
      "Commercial & Industrial",
      "Group Purchase",
      "Subsidy Assistance",
      "Maintenance & SolarCare",
    ],
    ctaLabel: "Explore Trivandrum",
    ctaLink: "#",
  },
  {
    district: "Kollam",
    image: DEFAULT_IMAGE,
    features: [
      "Government Project Desk",
      "Group Solar Discounts",
      "SolarCare Express",
    ],
    services: [
      "Residential Solar",
      "Group Purchase",
      "Subsidy Assistance",
      "Maintenance & SolarCare",
    ],
    ctaLabel: "Explore Kollam",
    ctaLink: "#",
  },
  {
    district: "Pathanamthitta",
    image: DEFAULT_IMAGE,
    features: [
      "Rooftop Residential Solar",
      "Subsidy Assistance",
      "Local Tech Support",
    ],
    services: [
      "Residential Solar",
      "Subsidy Assistance",
      "Maintenance & SolarCare",
    ],
    ctaLabel: "Explore Pathanamthitta",
    ctaLink: "#",
  },
  {
    district: "Alappuzha",
    image: DEFAULT_IMAGE,
    features: [
      "Commercial Grid Solutions",
      "Local Tech Hub",
      "On-site Consultation",
    ],
    services: [
      "Residential Solar",
      "Commercial & Industrial",
      "Maintenance & SolarCare",
    ],
    ctaLabel: "Explore Alappuzha",
    ctaLink: "#",
  },
  {
    district: "Kottayam",
    image: DEFAULT_IMAGE,
    features: [
      "Government Project Desk",
      "Group Solar Discounts",
      "SolarCare Express",
    ],
    services: [
      "Residential Solar",
      "Group Purchase",
      "Subsidy Assistance",
      "Maintenance & SolarCare",
    ],
    ctaLabel: "Explore Kottayam",
    ctaLink: "#",
  },
  {
    district: "Idukki",
    image: DEFAULT_IMAGE,
    features: [
      "Off-grid & Hybrid Systems",
      "Hilly Terrain Expertise",
      "Subsidy Assistance",
    ],
    services: [
      "Residential Solar",
      "Subsidy Assistance",
      "Maintenance & SolarCare",
    ],
    ctaLabel: "Explore Idukki",
    ctaLink: "#",
  },
  {
    district: "Kochi",
    image: DEFAULT_IMAGE,
    isTopHub: true,
    features: [
      "Residential & Industrial",
      "KSEB Subsidy Support",
      "24hr Maintenance Team",
    ],
    services: [
      "Residential Solar",
      "Commercial & Industrial",
      "Group Purchase",
      "Subsidy Assistance",
      "Maintenance & SolarCare",
    ],
    ctaLabel: "Explore Kochi",
    ctaLink: "#",
  },
  {
    district: "Thrissur",
    image: DEFAULT_IMAGE,
    features: [
      "Commercial Rooftop Solar",
      "Group Purchase Benefits",
      "SolarCare Plans",
    ],
    services: [
      "Residential Solar",
      "Commercial & Industrial",
      "Group Purchase",
      "Maintenance & SolarCare",
    ],
    ctaLabel: "Explore Thrissur",
    ctaLink: "#",
  },
  {
    district: "Palakkad",
    image: DEFAULT_IMAGE,
    features: [
      "Agricultural Solar Pumps",
      "Industrial Solutions",
      "Subsidy Assistance",
    ],
    services: [
      "Residential Solar",
      "Commercial & Industrial",
      "Subsidy Assistance",
    ],
    ctaLabel: "Explore Palakkad",
    ctaLink: "#",
  },
  {
    district: "Malappuram",
    image: DEFAULT_IMAGE,
    features: [
      "Residential Rooftop Solar",
      "Group Solar Discounts",
      "Local Technicians",
    ],
    services: [
      "Residential Solar",
      "Group Purchase",
      "Subsidy Assistance",
      "Maintenance & SolarCare",
    ],
    ctaLabel: "Explore Malappuram",
    ctaLink: "#",
  },
  {
    district: "Kozhikode",
    image: DEFAULT_IMAGE,
    isTopHub: true,
    features: [
      "Commercial Grid Solutions",
      "Local Tech Hub",
      "On-site Consultation",
    ],
    services: [
      "Residential Solar",
      "Commercial & Industrial",
      "Group Purchase",
      "Subsidy Assistance",
      "Maintenance & SolarCare",
    ],
    ctaLabel: "Explore Kozhikode",
    ctaLink: "#",
  },
  {
    district: "Wayanad",
    image: DEFAULT_IMAGE,
    features: [
      "Off-grid Hybrid Systems",
      "Estate & Resort Solar",
      "SolarCare Plans",
    ],
    services: [
      "Residential Solar",
      "Commercial & Industrial",
      "Maintenance & SolarCare",
    ],
    ctaLabel: "Explore Wayanad",
    ctaLink: "#",
  },
  {
    district: "Kannur",
    image: DEFAULT_IMAGE,
    features: [
      "Residential & Commercial",
      "KSEB Subsidy Support",
      "24hr Maintenance",
    ],
    services: [
      "Residential Solar",
      "Commercial & Industrial",
      "Subsidy Assistance",
      "Maintenance & SolarCare",
    ],
    ctaLabel: "Explore Kannur",
    ctaLink: "#",
  },
  {
    district: "Kasaragod",
    image: DEFAULT_IMAGE,
    features: [
      "Coastal Solar Solutions",
      "Subsidy Assistance",
      "Local Support Active",
    ],
    services: [
      "Residential Solar",
      "Subsidy Assistance",
      "Maintenance & SolarCare",
    ],
    ctaLabel: "Explore Kasaragod",
    ctaLink: "#",
  },
];

// Kept for backwards-compatibility: the original "popular" subset.
export const popularServiceAreas: ServiceAreaCard[] = allServiceAreas.filter(
  (area) =>
    ["Kochi", "Kottayam", "Alappuzha", "Trivandrum", "Kollam", "Kozhikode"].includes(
      area.district,
    ),
);

export const regionChips: string[] = [
  "Trivandrum",
  "Kochi",
  "Kozhikode",
  "Thrissur",
  "Kannur",
];

export const localSupportFeatures: {
  title: string;
  description: string;
  bg: string;
  iconBg: string;
  iconColor: string;
  icon: "shield" | "users" | "bank" | "care";
}[] = [
  {
    title: "Certified Support",
    description: "ANERT & MNRE certified installation teams in every district.",
    bg: "bg-[#FBF8EC]",
    iconBg: "bg-[#F6EAC2]",
    iconColor: "text-[#C99A2E]",
    icon: "shield",
  },
  {
    title: "Local Technicians",
    description: "Technicians who understand your neighborhood's specific grid needs.",
    bg: "bg-[#E2ECEC]",
    iconBg: "bg-[#C4D9D9]",
    iconColor: "text-[#3F7A7A]",
    icon: "users",
  },
  {
    title: "Subsidy Guidance",
    description: "End-to-end assistance for PM Surya Ghar and state subsidies.",
    bg: "bg-[#E4F0E1]",
    iconBg: "bg-[#C7E0C0]",
    iconColor: "text-[#5A8C4E]",
    icon: "bank",
  },
  {
    title: "Solar Care Plans",
    description: "Dedicated post-installation maintenance plans for peace of mind.",
    bg: "bg-[#FBEBE2]",
    iconBg: "bg-[#F4D6C5]",
    iconColor: "text-[#C77B4E]",
    icon: "care",
  },
];

export const locationServiceCards: { title: string; description: string }[] = [
  {
    title: "Localized Logistics",
    description:
      "Reduced transport costs and faster delivery through district warehouses.",
  },
  {
    title: "Community Solar",
    description:
      "Join neighbors to unlock group purchase benefits and subsidies.",
  },
];
