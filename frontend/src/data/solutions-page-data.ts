// src/data/solutions-page-data.ts

export interface SolutionHeroData {
  title: string;
  description: string;
  image: string;
}

export interface InfoSectionData {
  title: string;
  description: string;
  image: string;
  imagePosition: "left" | "right";
}

export interface PanelType {
  name: string;
  description: string;
  image: string;
}

export interface Milestone {
  title: string;
  description: string;
  date: string;
  percentage: number;
}

export interface BenefitItem {
  text: string;
}

export interface BenefitsApplicationsData {
  benefitsTitle: string;
  benefits: BenefitItem[];
  applicationsTitle: string;
  applications: BenefitItem[];
}

export interface FinalThoughtsData {
  title: string;
  description: string;
}

export interface WorkSectionData {
  title: string;
  description: string;
  image: string;
}

export interface SolarType {
  title: string;
  description: string;
}

export interface SolutionPageData {
  hero: SolutionHeroData;
  whatSection: InfoSectionData;
  howSection: InfoSectionData;
  workSection: WorkSectionData;
  panelTypes: PanelType[];
  solarTypes: SolarType[];
  milestones: Milestone[];
  benefitsApplications: BenefitsApplicationsData;
  finalThoughts: FinalThoughtsData;
  darkPanelTypes: PanelType[];
  faqTitle: string;
  faqDescription: string;
  faqs?: { question: string; answer: string }[];
}

// Residential Page Data
export const residentialPageData: SolutionPageData = {
  hero: {
    title: "Residential Solar Installation",
    description: "",
    image:
      "https://gym-manager-pull.b-cdn.net/golden_ray/solution/Rectangle-12153.png",
  },
  whatSection: {
    title: "Revolutionize Your Home Energy with Residential Solar Installation",
    description:
      "Residential solar installation allows homeowners to reduce dependence on traditional electricity sources while embracing renewable energy. Home solar panels provide consistent power generation, helping households manage rising energy costs efficiently. Residential solar installation allows homeowners to reduce dependence on traditional electricity sources while embracing renewable energy. Home solar panels provide consistent power generation, helping households manage rising energy costs efficiently.",
    image:
      "https://gym-manager-pull.b-cdn.net/golden_ray/solution/Rectangle-12153.png",
    imagePosition: "right",
  },
  howSection: {
    title: "What Are Residential Solar Panels?",
    description:
      "Residential solar panels are photovoltaic systems designed for homes to convert sunlight into usable electricity. These residential solar power systems are customized based on roof size, energy needs, and sunlight availability. Residential solar panels are photovoltaic systems designed for homes to convert sunlight into usable electricity. These residential solar power systems are customized based on roof size, energy needs, and sunlight availability. Residential solar panels are photovoltaic systems designed for homes to convert sunlight into usable electricity. These residential solar power systems are customized based.",
    image:
      "https://golden-ray.b-cdn.net/images/Roof%20solar%20panel%20mounting.jpg",
    imagePosition: "left",
  },
  workSection: {
    title: "How Do Residential Solar Panels Work?",
    description:
      "Solar panels capture sunlight and convert it into direct current electricity, which is then transformed into usable power through an inverter. Excess energy can be exported to the grid, reducing electricity bills. Solar panels capture sunlight and convert it into direct current electricity, which is then transformed into usable power through an inverter. Excess energy can be exported to the grid, reducing electricity bills.",
    image:
      "https://gym-manager-pull.b-cdn.net/golden_ray/solution/Rectangle-12153.png",
  },
  panelTypes: [
    {
      name: "Monocrystalline Panels",
      description:
        "Fast service & regular maintenance for maximum output.",
      image: "https://golden-ray.b-cdn.net/images/monocrystalline-panel.png",
    },
    {
      name: "Polycrystalline Panels",
      description:
        "Long-term warranty for reliable performance & peace of mind.",
      image: "https://golden-ray.b-cdn.net/images/polycrystalline-panel.png",
    },
    {
      name: "Hybrid Panels",
      description:
        "End-to-end subsidy support with zero hassle, guaranteed.",
      image: "https://golden-ray.b-cdn.net/images/hybrid-panel.png",
    },
  ],
  solarTypes: [
    {
      title: "Monocrystalline Panels",
      description:
        "Fast service & regular maintenance for maximum output.",
    },
    {
      title: "Polycrystalline Panels",
      description:
        "Long-term warranty for reliable performance & peace of mind.",
    },
    {
      title: "Hybrid Panels",
      description:
        "End-to-end subsidy support with zero hassle, guaranteed.",
    },
  ],
  milestones: [
    {
      title: "Increased our PAN India reach",
      description:
        "We have gained 1000+ additional channel partnerships! 25000+ satisfied customers on global scale.",
      date: "JANUARY 2022",
      percentage: 25,
    },
    {
      title: "Increased our PAN India reach",
      description:
        "We have gained 1000+ additional channel partnerships! 25000+ satisfied customers on global scale.",
      date: "JANUARY 2022",
      percentage: 25,
    },
    {
      title: "Going Global",
      description:
        "For the first time Flarize Solar started exploring its Solar PV module.",
      date: "JANUARY 2022",
      percentage: 25,
    },
  ],
  benefitsApplications: {
    benefitsTitle: "Benefits of Residential Solar Power Systems",
    benefits: [
      { text: "Reduces energy costs" },
      { text: "Long term savings" },
      { text: "Increase property value" },
      { text: "Supports environmental sustainability by lowering carbon emissions" },
    ],
    applicationsTitle: "Applications of Residential Solar Installation",
    applications: [
      { text: "Independent houses" },
      { text: "Villas" },
      { text: "Gated communities" },
      { text: "Rooftop systems for energy independence" },
    ],
  },
  finalThoughts: {
    title: "Solar Panels Cost for House & Final Thoughts",
    description:
      "Solar panels cost for house installations vary based on capacity and components. Choosing the best solar company for homes ensures transparent pricing, professional installation, and reliable long-term performance.",
  },
  darkPanelTypes: [
    {
      name: "Monocrystalline Panels",
      description:
        "Highest efficiency & regular maintenance for maximum output.",
      image: "https://golden-ray.b-cdn.net/images/monocrystalline-panel.png",
    },
    {
      name: "Polycrystalline Panels",
      description:
        "Long life expectancy for reliable performance & peace of mind.",
      image: "https://golden-ray.b-cdn.net/images/polycrystalline-panel.png",
    },
    {
      name: "Hybrid Panels",
      description:
        "Combined durability, superior efficiency with fantastic guarantee.",
      image: "https://golden-ray.b-cdn.net/images/hybrid-panel.png",
    },
  ],
  faqTitle: "Have any questions?",
  faqDescription:
    "Get expert advice and find your ideal solar solution—no obligations, just savings!",
};

// Commercial Page Data
export const commercialPageData: SolutionPageData = {
  hero: {
    title: "Commercial Solar Panel Installation in Kerala",
    description: "Flarize — the best solar company in Kerala for business — cuts your KSEB bill by 70–90%. On-grid rooftop solar for commercial buildings across all 14 districts — 3–4 year ROI, 75% financing, commercial solar panel price Kerala from ₹45,000/kW. KSEB approvals handled end-to-end.",
    image:
      "https://golden-ray.b-cdn.net/images/Roof%20solar%20panel%20mounting.jpg",
  },
  whatSection: {
    title: "What Are Commercial Solar Systems for Businesses and Factories?",
    description:
      "Grid-connected photovoltaic systems ranging from 10 kW to MW scale — a complete solar installation for business Kerala. Engineered for factories, offices, warehouses, and industrial facilities. Solar for factory Kerala and solar for office building Kerala by Flarize, your trusted solar EPC company Kerala.",
    image:
      "https://golden-ray.b-cdn.net/images/Roof%20solar%20panel%20mounting.jpg",
    imagePosition: "right",
  },
  howSection: {
    title: "How Does Commercial Solar Reduce Business Electricity Costs in Kerala?",
    description:
      "Rooftop solar panel installation on a commercial building in Kerala reduces KSEB bill by 70–90%. Backed by 40% accelerated depreciation, GST input tax credit, and up to 75% IREDA financing. On-grid solar system Kerala business owners trust for long-term savings.",
    image:
      "https://gym-manager-pull.b-cdn.net/golden_ray/solution/Rectangle-12153.png",
    imagePosition: "left",
  },
  workSection: {
    title: "How Do Commercial Solar Systems Work?",
    description:
      "Solar power plant installation Kerala — panels generate electricity, surplus exported via KSEB net metering commercial, real-time monitoring via dashboard. On-grid solar system Kerala business solution for factories, warehouses, and offices.",
    image:
      "https://gym-manager-pull.b-cdn.net/golden_ray/solution/Rectangle-12153.png",
  },
  panelTypes: [
    {
      name: "Monocrystalline Panels",
      description:
        "20–22% efficiency — best for limited rooftop space.",
      image: "https://golden-ray.b-cdn.net/images/monocrystalline-panel.png",
    },
    {
      name: "Polycrystalline Panels",
      description:
        "16–18% efficiency — cost-effective for large rooftops.",
      image: "https://golden-ray.b-cdn.net/images/polycrystalline-panel.png",
    },
    {
      name: "Bifacial Panels",
      description:
        "22–25% yield — dual-side generation for industrial rooftops.",
      image: "https://golden-ray.b-cdn.net/images/hybrid-panel.png",
    },
  ],
  solarTypes: [
    {
      title: "Monocrystalline Panels",
      description:
        "20–22% efficiency — best for limited rooftop space.",
    },
    {
      title: "Polycrystalline Panels",
      description:
        "16–18% efficiency — cost-effective for large rooftops.",
    },
    {
      title: "Bifacial Panels",
      description:
        "22–25% yield — dual-side generation for industrial rooftops.",
    },
  ],
  milestones: [
    {
      title: "Enterprise Partnerships",
      description:
        "500+ businesses across Kerala.",
      date: "MARCH 2022",
      percentage: 30,
    },
    {
      title: "Industrial Expansion",
      description:
        "Services expanded to all 14 Kerala districts.",
      date: "JULY 2022",
      percentage: 45,
    },
    {
      title: "MW Scale Projects",
      description:
        "50+ megawatt-scale commercial installations.",
      date: "DECEMBER 2022",
      percentage: 60,
    },
  ],
  benefitsApplications: {
    benefitsTitle: "Benefits of Commercial Solar Power Systems",
    benefits: [
      { text: "70–90% cost reduction" },
      { text: "40% depreciation" },
      { text: "GST ITC; up to 75% financing" },
      { text: "MSME 15–25% subsidy" },
    ],
    applicationsTitle: "Applications of Commercial & Industrial Solar Installation Kerala",
    applications: [
      { text: "Solar for office building Kerala" },
      { text: "Solar for factory Kerala, malls" },
      { text: "Solar for warehouse Kerala, hospitals" },
      { text: "Educational institutions" },
    ],
  },
  finalThoughts: {
    title: "Commercial Solar Investment & ROI Kerala",
    description:
      "Commercial solar ROI Kerala: A 50 kW system costs ₹25–30 lakh with annual savings of ₹6–8 lakh. ROI in 3–4 years. Lifetime savings of ₹1.5+ crore over 20+ years. Solar panel installation cost per kW Kerala: ₹45,000–60,000 turnkey. KSEB approvals handled end-to-end. Timeline: 5–10 days install; 15–30 days full process. 40% accelerated depreciation under Section 32. MSME ESS 15–25% subsidy for eligible units. Up to 75% financing via IREDA & banks.",
  },
  darkPanelTypes: [
    {
      name: "Monocrystalline Panels",
      description:
        "20–22% efficiency — best for limited rooftop space.",
      image: "https://golden-ray.b-cdn.net/images/monocrystalline-panel.png",
    },
    {
      name: "Polycrystalline Panels",
      description:
        "16–18% efficiency — cost-effective for large rooftops.",
      image: "https://golden-ray.b-cdn.net/images/polycrystalline-panel.png",
    },
    {
      name: "Bifacial Panels",
      description:
        "22–25% yield — dual-side generation for industrial rooftops.",
      image: "https://golden-ray.b-cdn.net/images/hybrid-panel.png",
    },
  ],
  faqTitle: "Have any questions about solar installation for business Kerala?",
  faqDescription:
    "Expert answers for businesses, factories, and commercial property owners in Kerala.",
  faqs: [
    {
      question: "How much does commercial solar panel installation cost in Kerala? (Solar panel installation cost per kW Kerala)",
      answer:
        "Commercial solar panel price Kerala: installation costs ₹45,000–60,000 per kW on a turnkey basis. A 50 kW system is approximately ₹25–30 lakh. After 40% accelerated depreciation, GST input tax credit, and Kerala ESS subsidy for eligible MSMEs, the effective cost is significantly lower. With up to 75% bank financing, most businesses start with just ₹7–8 lakh out of pocket. Contact Flarize for a free, site-specific quote.",
    },
    {
      question: "What is the ROI on commercial solar installation in Kerala?",
      answer:
        "Commercial solar ROI Kerala: most installations achieve full ROI in 3–4 years by combining electricity savings, 40% accelerated depreciation, GST input tax credit, KSEB net metering commercial credits, and applicable MSME subsidies. After payback, the system generates near-free electricity for 20+ years — lifetime savings on a 50 kW system can exceed ₹1.5 crore.",
    },
    {
      question: "Does Flarize handle KSEB approvals and net metering for commercial solar?",
      answer:
        "Yes. As a KSEB approved solar installer, solar EPC company Kerala, and MNRE certified commercial solar company in Kerala, Flarize manages the complete KSEB net metering commercial process — net metering application, feasibility report, technical approval, inspection coordination, and bidirectional meter installation. End-to-end paperwork handling is included in every project.",
    },
    {
      question: "How long does commercial solar installation take?",
      answer:
        "Physical solar panel installation Kerala takes 5–10 working days for most projects (10–100 kW range). The full timeline from site assessment to KSEB commissioning is typically 15–30 days, depending on KSEB approval timelines and system complexity.",
    },
    {
      question: "Can I claim 40% accelerated depreciation on commercial solar in India?",
      answer:
        "Yes. Under Section 32 of the Income Tax Act, solar power plant equipment qualifies for 40% accelerated depreciation in Year 1. For a business in the 30% tax bracket, this alone recovers \u20B93\u20134 lakh on a \u20B925 lakh system in Year 1. Combined with GST input tax credit and KSEB net metering credits, the solar tax benefit for business in India is substantial.",
    },
    {
      question: "Is there a government subsidy for commercial solar in Kerala?",
      answer:
        "The PM Surya Ghar subsidy is for residential only. Commercial businesses benefit from: 1) 40% accelerated depreciation under Section 32, 2) GST input tax credit on installation cost, 3) MSME solar subsidy Kerala \u2014 15\u201325% capital subsidy under the Kerala Entrepreneur Support Scheme for eligible manufacturing units.",
    },
    {
      question: "Can I get a loan for commercial solar installation in Kerala?",
      answer:
        "Yes. A solar loan from IREDA in Kerala and major banks (SBI, HDFC, ICICI, Axis Bank) covers up to 75% project financing, with repayment over 7\u201315 years. RBI classifies renewable energy under priority sector lending. The monthly EMI is often comparable to or lower than the current KSEB bill. Flarize assists with all loan documentation.",
    },
  ],
};
