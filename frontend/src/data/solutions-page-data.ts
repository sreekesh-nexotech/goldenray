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

export interface SolutionPageData {
  hero: SolutionHeroData;
  whatSection: InfoSectionData;
  howSection: InfoSectionData;
  workSection: WorkSectionData;
  panelTypes: PanelType[];
  milestones: Milestone[];
  benefitsApplications: BenefitsApplicationsData;
  finalThoughts: FinalThoughtsData;
  darkPanelTypes: PanelType[];
  faqTitle: string;
  faqDescription: string;
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
    title: "Commercial Solar Installation",
    description: "",
    image:
      "https://golden-ray.b-cdn.net/images/Roof%20solar%20panel%20mounting.jpg",
  },
  whatSection: {
    title: "Power Your Business with Commercial Solar Installation",
    description:
      "Commercial solar installation enables businesses to significantly reduce operational costs while demonstrating environmental responsibility. Our commercial solar solutions are designed for offices, factories, warehouses, and retail spaces, providing reliable power generation that scales with your business needs. Commercial solar installation enables businesses to significantly reduce operational costs while demonstrating environmental responsibility.",
    image:
      "https://golden-ray.b-cdn.net/images/Roof%20solar%20panel%20mounting.jpg",
    imagePosition: "right",
  },
  howSection: {
    title: "What Are Commercial Solar Systems?",
    description:
      "Commercial solar systems are large-scale photovoltaic installations designed to meet the higher energy demands of businesses and industrial facilities. These systems are engineered for maximum efficiency, featuring advanced inverters, monitoring systems, and optimized panel configurations. Commercial solar power systems are customized based on available space, energy consumption patterns, and business objectives. Commercial solar systems are large-scale photovoltaic installations designed for businesses.",
    image:
      "https://gym-manager-pull.b-cdn.net/golden_ray/solution/Rectangle-12153.png",
    imagePosition: "left",
  },
  workSection: {
    title: "How Do Commercial Solar Systems Work?",
    description:
      "Commercial solar systems operate by capturing sunlight through multiple panel arrays and converting it to electricity via industrial-grade inverters. The generated power is used to run business operations, with excess energy either stored in batteries or fed back to the grid for credits. Smart monitoring systems track performance and optimize energy distribution in real-time.",
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
      name: "Bifacial Panels",
      description:
        "End-to-end subsidy support with zero hassle, guaranteed.",
      image: "https://golden-ray.b-cdn.net/images/hybrid-panel.png",
    },
  ],
  milestones: [
    {
      title: "Enterprise Partnerships",
      description:
        "Partnered with 500+ businesses across Kerala for commercial solar installations.",
      date: "MARCH 2022",
      percentage: 30,
    },
    {
      title: "Industrial Expansion",
      description:
        "Expanded to serve manufacturing units, IT parks, and commercial complexes.",
      date: "JULY 2022",
      percentage: 45,
    },
    {
      title: "MW Scale Projects",
      description:
        "Successfully completed 50+ megawatt-scale commercial installations.",
      date: "DECEMBER 2022",
      percentage: 60,
    },
  ],
  benefitsApplications: {
    benefitsTitle: "Benefits of Commercial Solar Power Systems",
    benefits: [
      { text: "Significant reduction in operational costs" },
      { text: "Tax benefits and accelerated depreciation" },
      { text: "Enhanced brand image and CSR compliance" },
      { text: "Protection against rising electricity tariffs" },
    ],
    applicationsTitle: "Applications of Commercial Solar Installation",
    applications: [
      { text: "Office buildings and IT parks" },
      { text: "Manufacturing facilities" },
      { text: "Shopping malls and retail spaces" },
      { text: "Warehouses and logistics centers" },
    ],
  },
  finalThoughts: {
    title: "Commercial Solar Investment & ROI",
    description:
      "Commercial solar installations typically achieve ROI within 3-5 years, with systems lasting 25+ years. Our team provides comprehensive feasibility studies, ensuring your investment delivers maximum returns while reducing your carbon footprint.",
  },
  darkPanelTypes: [
    {
      name: "Monocrystalline Panels",
      description:
        "Premium efficiency for high-demand commercial operations.",
      image: "https://golden-ray.b-cdn.net/images/monocrystalline-panel.png",
    },
    {
      name: "Polycrystalline Panels",
      description:
        "Budget-friendly option for large rooftop installations.",
      image: "https://golden-ray.b-cdn.net/images/polycrystalline-panel.png",
    },
    {
      name: "Bifacial Panels",
      description:
        "Next-gen technology for maximized energy harvest.",
      image: "https://golden-ray.b-cdn.net/images/hybrid-panel.png",
    },
  ],
  faqTitle: "Have any questions?",
  faqDescription:
    "Get expert advice and find the perfect commercial solar solution for your business!",
};
