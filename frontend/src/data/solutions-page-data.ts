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
    title: "Residential Solar Installation in Kerala",
    description: "",
    image:
      "https://gym-manager-pull.b-cdn.net/golden_ray/solution/Rectangle-12153.png",
  },
  whatSection: {
    title: "Revolutionize Your Home Energy with On-Grid Solar Panels in Kerala",
    description:
      "Every two months, your KSEB bill arrives — and every two months, it\u2019s a little higher than the last. Electricity tariffs keep rising, and for most Kerala homeowners, there\u2019s no sign of that stopping. Installing solar panels for your home changes that completely. Instead of paying more for the same electricity year after year, you generate your own power from your rooftop. With KSEB net metering Kerala, surplus power flows back to the grid and is credited to your bill — on good months, your electricity bill drops to near-zero. This is one decision today that saves you money for the next 25 years. Flarize — the best solar company Kerala — handles everything: system design, KSEB paperwork, PM Surya Ghar subsidy Kerala processing, and home solar power system Kerala installation.",
    image:
      "https://gym-manager-pull.b-cdn.net/golden_ray/solution/Rectangle-12153.png",
    imagePosition: "right",
  },
  howSection: {
    title: "What Are Residential Solar Panels?",
    description:
      "Residential solar panels — or solar panel for house Kerala — are rooftop solar system Kerala solutions that convert sunlight into electricity your home can use. Every system is customised based on roof type, energy usage from recent KSEB bills, and available shade-free area. The result is a rooftop solar system sized exactly for your household with a 25-year performance warranty.",
    image:
      "https://golden-ray.b-cdn.net/images/Roof%20solar%20panel%20mounting.jpg",
    imagePosition: "left",
  },
  workSection: {
    title: "How Do Residential Solar Panels Work?",
    description:
      "Sunlight converts into DC electricity. An inverter converts DC to AC for home use. Surplus energy flows to the KSEB grid through KSEB net metering Kerala and offsets your bill. The on-grid solar system Kerala runs automatically from sunrise to sunset.",
    image: "/ourSolutions1.png",
  },
  panelTypes: [
    {
      name: "Monocrystalline Panels",
      description:
        "Highest efficiency. Ideal for limited roof space.",
      image: "/1.jpeg",
    },
    {
      name: "Polycrystalline Panels",
      description:
        "Lower cost, reliable output.",
      image: "/2.jpeg",
    },
    {
      name: "Hybrid Solar Systems",
      description:
        "Solar + battery storage for outage protection. Hybrid solar system Kerala.",
      image: "/3.jpeg",
    },
  ],
  solarTypes: [
    {
      title: "Monocrystalline",
      description:
        "Most efficient. Best for solar panels Kerala homes with limited roof space.",
      image: "/1.jpeg",
    },
    {
      title: "Polycrystalline",
      description:
        "Budget-friendly. Reliable solar panel for house Kerala.",
      image: "/2.jpeg",
    },
    {
      title: "Hybrid",
      description:
        "Battery backup enabled. Off-grid solar system Kerala + hybrid solar system Kerala.",
      image: "/3.jpeg",
    },
  ],
  milestones: [
    {
      title: "Founded as Golden Ray (2018)",
      description:
        "Started in Alappuzha, Kerala.",
      date: "2022",
      percentage: 25,
    },
    {
      title: "Rebranded to Flarize (2024)",
      description:
        "Kerala solar booking platform with 50+ installations per month.",
      date: "2024",
      percentage: 50,
    },
    {
      title: "Pan-Kerala Expansion (2025\u20132026)",
      description:
        "Operating across all 14 districts.",
      date: "2025",
      percentage: 75,
    },
  ],
  benefitsApplications: {
    benefitsTitle: "Benefits of Residential Solar Power Systems",
    benefits: [
      { text: "Lower KSEB electricity bills" },
      { text: "₹4\u20136 lakh+ savings over 25 years" },
      { text: "₹78,000 rooftop solar subsidy Kerala 2025" },
      { text: "25-year panel warranty" },
      { text: "Increased home resale value" },
      { text: "Clean renewable energy" },
      { text: "Protection from tariff hikes" },
    ],
    applicationsTitle: "Applications of Residential Solar Installation Kerala",
    applications: [
      { text: "Independent houses" },
      { text: "Villas" },
      { text: "Gated communities" },
      { text: "Rooftop solar system Kerala for energy independence" },
    ],
  },
  finalThoughts: {
    title: "Solar Panel Price Kerala: Cost, Subsidy & What to Expect",
    description:
      "A 3kW solar system price Kerala: ₹1.85\u20132.15 lakh before subsidy. After ₹78,000 PM Surya Ghar subsidy, cost drops to ₹1.1\u20131.4 lakh. 5kW solar system Kerala costs ₹2.8\u20133.2 lakh before subsidy. Solar installation cost Kerala payback period: 4\u20136 years. MNRE approved solar installer Kerala. DCR panels Kerala / ALMM approved.",
  },
  darkPanelTypes: [
    {
      name: "Monocrystalline Panels",
      description:
        "Highest efficiency. Solar panels Kerala — best for limited roof space.",
      image: "/1.jpeg",
    },
    {
      name: "Polycrystalline Panels",
      description:
        "Budget-friendly. Reliable solar panel for house Kerala.",
      image: "/2.jpeg",
    },
    {
      name: "Hybrid Solar Systems",
      description:
        "Battery backup enabled. Hybrid solar system Kerala for outage protection.",
      image: "/3.jpeg",
    },
  ],
  faqTitle: "Have any questions about residential solar installation Kerala?",
  faqDescription:
    "Get expert advice and find your ideal solar solution — no obligations, just savings!",
  faqs: [
    {
      question: "How much does solar panel installation cost in Kerala?",
      answer:
        "A 3kW solar system price Kerala is ₹1.85–2.15 lakh before subsidy. After the ₹78,000 PM Surya Ghar subsidy Kerala, the out-of-pocket cost drops to ₹1.1–1.4 lakh. A 5kW solar system Kerala costs ₹2.8–3.2 lakh before subsidy. Solar panel price Kerala varies by system size, panel type, and roof structure. Contact Flarize for a free site-specific quote.",
    },
    {
      question: "How does KSEB net metering work in Kerala?",
      answer:
        "With KSEB net metering Kerala, surplus electricity your solar panels generate flows back into the KSEB grid. A bidirectional meter records both import and export. At billing time, the exported units are credited against your consumption — potentially reducing your bill to near-zero. Flarize handles the complete KSEB net metering application as part of every residential solar installation Kerala project.",
    },
    {
      question: "What is the PM Surya Ghar subsidy for solar in Kerala?",
      answer:
        "The PM Surya Ghar Muft Bijli Yojana provides up to ₹78,000 subsidy for residential rooftop solar systems in Kerala. For a 3kW system, the subsidy is ₹78,000. This is a central government scheme administered through MNRE. Flarize is an MNRE approved solar installer Kerala and processes the PM Surya Ghar subsidy Kerala application on your behalf — so you don't have to chase paperwork.",
    },
    {
      question: "Is Flarize a KSEB-approved and MNRE-certified solar installer?",
      answer:
        "Yes. Flarize is both a KSEB-approved solar installer and an MNRE approved solar installer Kerala. We handle everything from system design, KSEB net metering application, technical inspection coordination, to PM Surya Ghar subsidy Kerala processing. With an MNRE solar subsidy Kerala empanelment, your installation qualifies for all applicable government benefits.",
    },
    {
      question: "What size solar system do I need for my home in Kerala?",
      answer:
        "It depends on your electricity usage. A 1kW solar system Kerala is suitable for small homes with monthly bills under ₹1,000. A 2kW solar system Kerala fits homes with ₹1,000–2,000 bills. A 3kW solar system price Kerala covers most average homes, and a 5kW solar system Kerala handles larger households or those with AC usage. Flarize recommends the right size based on your last 3 KSEB bills and roof area.",
    },
    {
      question: "What is the KSEB solar subsidy for rooftop systems?",
      answer:
        "The KSEB solar subsidy is channelled through the PM Surya Ghar scheme administered by MNRE. For systems up to 3kW, you receive ₹78,000. Flarize manages the full documentation and approval process as part of every residential solar installation Kerala. This rooftop solar subsidy Kerala 2025 is available to all Kerala homeowners with a valid KSEB domestic connection.",
    },
    {
      question: "What is the difference between on-grid, off-grid, and hybrid solar systems?",
      answer:
        "An on-grid solar system Kerala is connected to the KSEB grid and uses net metering — ideal for most homes. An off-grid solar system Kerala operates independently with battery storage and is suitable for areas with unreliable grid supply. A hybrid solar system Kerala combines both: grid-connected with battery backup for power during outages. Flarize installs all three types across Kerala.",
    },
    {
      question: "Do I need DCR / ALMM-approved panels for the subsidy?",
      answer:
        "Yes. To qualify for the PM Surya Ghar subsidy, you must use DCR panels Kerala that are ALMM (Approved List of Models and Manufacturers) listed. Flarize only uses ALMM-approved, DCR-compliant solar panels from top-tier manufacturers — ensuring your system qualifies for the full ₹78,000 MNRE solar subsidy Kerala.",
    },
    {
      question: "How long does residential solar installation take in Kerala?",
      answer:
        "Physical solar panel installation Kerala typically takes 1–2 days for residential systems (1kW–5kW). The full process — including site assessment, KSEB net metering Kerala application, inspection, and commissioning — takes 15–30 days depending on KSEB timelines. Flarize handles the entire process end-to-end.",
    },
  ],
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
      image: "/1.jpeg",
    },
    {
      name: "Polycrystalline Panels",
      description:
        "16–18% efficiency — cost-effective for large rooftops.",
      image: "/2.jpeg",
    },
    {
      name: "Bifacial Panels",
      description:
        "22–25% yield — dual-side generation for industrial rooftops.",
      image: "/3.jpeg",
    },
  ],
  solarTypes: [
    {
      title: "Monocrystalline Panels",
      description:
        "20–22% efficiency — best for limited rooftop space.",
      image: "/1.jpeg",
    },
    {
      title: "Polycrystalline Panels",
      description:
        "16–18% efficiency — cost-effective for large rooftops.",
      image: "/2.jpeg",
    },
    {
      title: "Bifacial Panels",
      description:
        "22–25% yield — dual-side generation for industrial rooftops.",
      image: "/3.jpeg",
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
      image: "/1.jpeg",
    },
    {
      name: "Polycrystalline Panels",
      description:
        "16–18% efficiency — cost-effective for large rooftops.",
      image: "/2.jpeg",
    },
    {
      name: "Bifacial Panels",
      description:
        "22–25% yield — dual-side generation for industrial rooftops.",
      image: "/3.jpeg",
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
