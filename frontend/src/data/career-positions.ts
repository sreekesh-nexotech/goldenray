// src/data/career-positions.ts
//
// Mock data for the career open positions and their detail pages.
// This is temporary — the same shape will later be served from the CMS/backend,
// so keep the field names stable when wiring the API in.

import React from "react";
import { Briefcase, PenTool, Tag, Truck } from "lucide-react";

/** Two-column bullet layout used by the detail sections. */
export type BulletGroup = {
  left: string[];
  right: string[];
};

export type CareerPosition = {
  /** URL segment: /career/<slug> */
  slug: string;
  title: string;
  department: string;
  /** Short location shown on the open-positions card. */
  location: string;
  /** Full location line shown in the detail page "Location" section. */
  locationDetail: string;
  employmentType: string;
  icon: React.ComponentType<{ className?: string }>;

  /**
   * Whether we are actively hiring for this role. When false the detail page
   * shows a "not currently hiring" message instead of the job details and the
   * application form.
   */
  isHiring: boolean;

  /** Role Overview — one paragraph per entry. */
  overview: string[];
  responsibilities: BulletGroup;
  requirements: BulletGroup;
  niceToHave: BulletGroup;
  whatYoullGet: BulletGroup;

  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogTitle: string;
    ogDescription: string;
    ogImageAlt: string;
  };
};

export const careerPositions: CareerPosition[] = [
  {
    slug: "senior-full-stack-engineer",
    title: "Senior Full-Stack Engineer",
    department: "Engineering",
    location: "Kochi / Remote",
    locationDetail: "Kochi, Kerala / Remote (based on role)",
    employmentType: "Full Time",
    icon: Briefcase,
    isHiring: false,
    overview: [
      "We are looking for a Senior Full-Stack Engineer who enjoys owning features end to end and building products that hold up in the real world.",
      "You will work closely with founders, designers, and operations to ship customer-facing platforms, internal dashboards, and the services that keep them running.",
    ],
    responsibilities: {
      left: [
        "Design, build, and ship features across the stack",
        "Write clean, well-tested, maintainable code",
        "Review code and mentor engineers on the team",
        "Own deployments and monitor production health",
      ],
      right: [
        "Model data and design pragmatic APIs",
        "Improve performance, reliability, and security",
        "Translate product requirements into technical plans",
      ],
    },
    requirements: {
      left: [
        "3–6 years of full-stack product engineering experience",
        "Strong fundamentals in JavaScript / TypeScript",
        "Experience with relational databases and API design",
      ],
      right: [
        "Hands-on experience with React and Next.js",
        "Backend experience with Node.js, Django, or similar",
        "Strong communication and problem-solving skills",
      ],
    },
    niceToHave: {
      left: ["Experience with AWS or similar cloud platforms", "CI/CD and Docker experience"],
      right: ["Exposure to the energy or IoT domain", "SaaS, Dashboard, or Marketplace experience"],
    },
    whatYoullGet: {
      left: [
        "Work directly with decision-makers",
        "Fast learning environment",
        "Career growth as the company expands",
      ],
      right: [
        "Ownership of real products",
        "Technical decisions that ship, not sit in a backlog",
      ],
    },
    seo: {
      title: "Senior Full-Stack Engineer | Careers at Flarize",
      description:
        "Join Flarize as a Senior Full-Stack Engineer. Build customer platforms, dashboards, and services that power solar across Kerala.",
      keywords: [
        "Full-Stack Engineer job Kerala",
        "Senior Engineer Kochi",
        "React Next.js jobs India",
        "Engineering jobs Flarize",
        "Solar startup engineering careers",
      ],
      ogTitle: "Senior Full-Stack Engineer | Careers at Flarize",
      ogDescription:
        "Join Flarize as a Senior Full-Stack Engineer and build products that power real homes across Kerala.",
      ogImageAlt: "Senior Full-Stack Engineer at Flarize",
    },
  },
  {
    slug: "ui-ux-designer",
    title: "UI/UX Designer",
    department: "Design",
    location: "Alappuzha",
    locationDetail: "Kochi, Kerala / Hybrid (based on role)",
    employmentType: "Full Time",
    icon: PenTool,
    isHiring: true,
    overview: [
      "We are looking for a UI/UX Designer who enjoys solving real user problems and designing products that balance customer needs with business goals.",
      "You will work closely with founders, developers, and stakeholders to create user-friendly experiences across websites, mobile applications, dashboards, and internal platforms.",
    ],
    responsibilities: {
      left: [
        "Create user flows, wireframes, and prototypes",
        "Conduct UX research and competitor analysis",
        "Collaborate with developers during implementation",
        "Present design solutions and rationale to stakeholders",
      ],
      right: [
        "Design responsive web and mobile experiences",
        "Maintain and improve design systems",
        "Translate business requirements into intuitive user experiences",
      ],
    },
    requirements: {
      left: [
        "1–3 years of UI/UX or Product Design experience",
        "Understanding of UX principles and user-centered design",
        "Basic understanding of front-end technologies is a plus",
      ],
      right: [
        "Strong proficiency in Figma",
        "Experience designing responsive web and mobile interfaces",
        "Strong communication and problem-solving skills",
      ],
    },
    niceToHave: {
      left: ["Experience with Design Systems", "Basic HTML/CSS understanding"],
      right: ["Framer knowledge", "SaaS, Dashboard, or Marketplace experience"],
    },
    whatYoullGet: {
      left: [
        "Work directly with decision-makers",
        "Fast learning environment",
        "Career growth as the company expands",
      ],
      right: [
        "Ownership of real products",
        "SaaS, Dashboard, or Marketplace experience",
      ],
    },
    seo: {
      title: "UI/UX Designer | Careers at Flarize",
      description:
        "Join Flarize as a UI/UX Designer. Design responsive web and mobile experiences, maintain design systems, and build products that power solar across Kerala.",
      keywords: [
        "UI/UX Designer job Kerala",
        "Product Designer Kochi",
        "Design jobs Flarize",
        "Figma designer job India",
        "Solar startup design careers",
      ],
      ogTitle: "UI/UX Designer | Careers at Flarize",
      ogDescription:
        "Join Flarize as a UI/UX Designer and design products that power real homes across Kerala.",
      ogImageAlt: "UI/UX Designer at Flarize",
    },
  },
  {
    slug: "field-sales-lead",
    title: "Field Sales Lead",
    department: "Sales",
    location: "Alappuzha",
    locationDetail: "Alappuzha, Kerala / On-site",
    employmentType: "Full Time",
    icon: Tag,
    isHiring: false,
    overview: [
      "We are looking for a Field Sales Lead who enjoys meeting customers on the ground and turning interest in solar into installations.",
      "You will own your territory end to end — building the pipeline, guiding homeowners through the decision, and working with the operations team to close and hand over.",
    ],
    responsibilities: {
      left: [
        "Own the sales pipeline for your territory",
        "Meet homeowners and businesses on site",
        "Explain solar sizing, savings, and financing clearly",
        "Coordinate site visits with the technical team",
      ],
      right: [
        "Build and manage a local referral network",
        "Maintain accurate records in the CRM",
        "Hit monthly and quarterly targets",
      ],
    },
    requirements: {
      left: [
        "2–4 years of field sales experience",
        "Fluency in Malayalam and English",
        "Valid driving licence and willingness to travel locally",
      ],
      right: [
        "Proven track record of meeting sales targets",
        "Comfort with CRM tools and daily reporting",
        "Strong communication and negotiation skills",
      ],
    },
    niceToHave: {
      left: ["Experience in solar, EV, or home improvement sales", "Existing local network in Kerala"],
      right: ["Understanding of subsidy and financing schemes", "Team-leading experience"],
    },
    whatYoullGet: {
      left: [
        "Work directly with decision-makers",
        "Fast learning environment",
        "Career growth as the company expands",
      ],
      right: [
        "Uncapped incentives on top of a fixed salary",
        "A product customers genuinely want",
      ],
    },
    seo: {
      title: "Field Sales Lead | Careers at Flarize",
      description:
        "Join Flarize as a Field Sales Lead. Own your territory, meet customers on the ground, and grow solar adoption across Kerala.",
      keywords: [
        "Field Sales job Kerala",
        "Sales Lead Alappuzha",
        "Solar sales jobs India",
        "Sales jobs Flarize",
        "Clean energy sales careers",
      ],
      ogTitle: "Field Sales Lead | Careers at Flarize",
      ogDescription:
        "Join Flarize as a Field Sales Lead and bring solar to real homes across Kerala.",
      ogImageAlt: "Field Sales Lead at Flarize",
    },
  },
  {
    slug: "logistics-coordinator",
    title: "Logistics Coordinator",
    department: "Operations",
    location: "Kochi",
    locationDetail: "Kochi, Kerala / On-site",
    employmentType: "Full Time",
    icon: Truck,
    isHiring: false,
    overview: [
      "We are looking for a Logistics Coordinator who keeps material, vendors, and installation crews moving in sync.",
      "You will work closely with procurement, warehouse, and site teams to make sure every installation has the right panels, inverters, and hardware on the right day.",
    ],
    responsibilities: {
      left: [
        "Plan and schedule material dispatch to sites",
        "Coordinate with vendors and transport partners",
        "Track inventory levels and flag shortages early",
        "Maintain delivery and stock documentation",
      ],
      right: [
        "Support installation crews with on-time material",
        "Resolve delivery delays and damage claims",
        "Report on logistics costs and turnaround times",
      ],
    },
    requirements: {
      left: [
        "1–3 years in logistics, supply chain, or warehouse operations",
        "Working knowledge of inventory and dispatch processes",
        "Comfort with spreadsheets and ERP or inventory tools",
      ],
      right: [
        "Strong coordination and follow-up skills",
        "Fluency in Malayalam and English",
        "Ability to stay organised under tight timelines",
      ],
    },
    niceToHave: {
      left: ["Experience in solar, EPC, or construction supply", "Vendor negotiation experience"],
      right: ["Knowledge of GST and e-way bill documentation", "Basic data analysis skills"],
    },
    whatYoullGet: {
      left: [
        "Work directly with decision-makers",
        "Fast learning environment",
        "Career growth as the company expands",
      ],
      right: [
        "Ownership of a core part of the operation",
        "Clear visibility of your impact on delivery",
      ],
    },
    seo: {
      title: "Logistics Coordinator | Careers at Flarize",
      description:
        "Join Flarize as a Logistics Coordinator. Keep material, vendors, and installation crews in sync across Kerala.",
      keywords: [
        "Logistics Coordinator job Kerala",
        "Supply chain jobs Kochi",
        "Operations jobs Flarize",
        "Warehouse jobs India",
        "Solar operations careers",
      ],
      ogTitle: "Logistics Coordinator | Careers at Flarize",
      ogDescription:
        "Join Flarize as a Logistics Coordinator and keep solar installations moving across Kerala.",
      ogImageAlt: "Logistics Coordinator at Flarize",
    },
  },
];

export const getPositionBySlug = (slug: string): CareerPosition | undefined =>
  careerPositions.find((position) => position.slug === slug);
