// src/data/service-area-data.ts

export type ServiceAreaCard = {
  district: string;
  image: string;
  isTopHub?: boolean;
  features: string[];
  ctaLabel: string;
  ctaLink: string;
};

export const popularServiceAreas: ServiceAreaCard[] = [
  {
    district: "Kochi",
    image:
      "https://golden-ray.b-cdn.net/About%20us/d44d8059-d21e-4d21%20ENHANCED.jpeg",
    isTopHub: true,
    features: [
      "Residential & Industrial",
      "KSEB Subsidy Support",
      "24hr Maintenance Team",
    ],
    ctaLabel: "Explore Kochi",
    ctaLink: "#",
  },
  {
    district: "Kottayam",
    image:
      "https://golden-ray.b-cdn.net/About%20us/d44d8059-d21e-4d21%20ENHANCED.jpeg",
    features: [
      "Government Project Desk",
      "Group Solar Discounts",
      "SolarCare Express",
    ],
    ctaLabel: "Explore Kottayam",
    ctaLink: "#",
  },
  {
    district: "Alappuzha",
    image:
      "https://golden-ray.b-cdn.net/About%20us/d44d8059-d21e-4d21%20ENHANCED.jpeg",
    features: [
      "Commercial Grid Solutions",
      "Local Tech Hub",
      "On-site Consultation",
    ],
    ctaLabel: "Explore Alappuzha",
    ctaLink: "#",
  },
  {
    district: "Trivandrum",
    image:
      "https://golden-ray.b-cdn.net/About%20us/d44d8059-d21e-4d21%20ENHANCED.jpeg",
    isTopHub: true,
    features: [
      "Residential & Industrial",
      "KSEB Subsidy Support",
      "24hr Maintenance Team",
    ],
    ctaLabel: "Explore Trivandrum",
    ctaLink: "#",
  },
  {
    district: "Kollam",
    image:
      "https://golden-ray.b-cdn.net/About%20us/d44d8059-d21e-4d21%20ENHANCED.jpeg",
    features: [
      "Government Project Desk",
      "Group Solar Discounts",
      "SolarCare Express",
    ],
    ctaLabel: "Explore Kollam",
    ctaLink: "#",
  },
  {
    district: "Kozhikode",
    image:
      "https://golden-ray.b-cdn.net/About%20us/d44d8059-d21e-4d21%20ENHANCED.jpeg",
    features: [
      "Commercial Grid Solutions",
      "Local Tech Hub",
      "On-site Consultation",
    ],
    ctaLabel: "Explore Kozhikode",
    ctaLink: "#",
  },
];

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
