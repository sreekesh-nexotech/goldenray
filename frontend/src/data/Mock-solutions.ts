// src/data/Mock-solutions.ts

export interface SolutionData {
  id: string;
  slug: string;
  title: string;
  heroTitle: string;
  heroDescription: string;
  metaTitle: string;
  metaDescription: string;
  boxBgColor: string;
  textColor: string;
  showYellowBtn: boolean;
  boxTitle: string;
  boxDescription: string;
  boxImg: string;
  servicesTitle: string;
  features: {
    title: string;
    description: string;
  }[];
}

export const mockSolutions: SolutionData[] = [
  {
    id: "residential",
    slug: "residential",
    title: "Residential Solar Solutions",
    heroTitle: "Residential Solar Solutions",
    heroDescription:
      "Power your home with clean, renewable solar energy and enjoy significant savings on your electricity bills",
    metaTitle:
      "Residential Solar Installation - Home Solar Solutions | Flarize Kerala",
    metaDescription:
      "Transform your home with Flarize's residential solar solutions in Kerala. Expert installation, long-term savings, and reliable power for your household. Get a free consultation today!",
    boxBgColor: "[#074A4D]",
    textColor: "text-[#FFFFFF]",
    showYellowBtn: true,
    boxTitle: "Residential Solar Installation",
    boxDescription:
      "For a home in Kerala, solar is more than a power choice—it's a long-term decision for comfort and savings. Our residential solar solutions are planned around your home's electricity usage, roof space, and local conditions like sunlight and weather. Every step, from the first discussion to system activation, is explained clearly so there are no surprises. The installation is neat, safe, and built to last, helping your household reduce electricity bills while enjoying steady, dependable power for years to come.",
    boxImg:
      "https://gym-manager-pull.b-cdn.net/golden_ray/solution/Rectangle-12153.png",
    servicesTitle: "Why Choose Residential Solar?",
    features: [
      {
        title: "Lower Electricity Bills",
        description:
          "Reduce your monthly electricity costs by generating your own clean energy from sunlight.",
      },
      {
        title: "Energy Independence",
        description:
          "Become less dependent on the grid and protect yourself from rising electricity prices.",
      },
      {
        title: "Increase Property Value",
        description:
          "Solar panels can increase your home's value and make it more attractive to future buyers.",
      },
      {
        title: "Government Subsidies",
        description:
          "Take advantage of state and central government subsidies to reduce installation costs.",
      },
      {
        title: "Eco-Friendly Living",
        description:
          "Reduce your carbon footprint and contribute to a cleaner, greener environment.",
      },
      {
        title: "25+ Years Lifespan",
        description:
          "Our solar panels are built to last with warranties ensuring decades of reliable performance.",
      },
    ],
  },
  {
    id: "commercial",
    slug: "commercial",
    title: "Commercial Solar Solutions",
    heroTitle: "Commercial Solar Solutions",
    heroDescription:
      "Reduce operational costs and boost your business sustainability with our commercial solar installations",
    metaTitle:
      "Commercial Solar Installation - Business Solar Solutions | Flarize Kerala",
    metaDescription:
      "Power your business with Flarize's commercial solar solutions in Kerala. Reduce operational costs, ensure reliable energy, and enhance your brand's sustainability. Contact us for a custom quote!",
    boxBgColor: "[#ADD6D8]",
    textColor: "text-[#444444]",
    showYellowBtn: false,
    boxTitle: "Commercial Solar Installation",
    boxDescription:
      "Running a business in Kerala means managing power costs without interrupting daily operations. Our commercial solar installations are designed after carefully understanding your working hours, power demand, and available rooftop or open space. From approvals to commissioning, the process is handled smoothly with clear communication at every stage. The result is a reliable solar system that supports stable energy expenses and helps businesses plan better for the future.",
    boxImg:
      "https://golden-ray.b-cdn.net/images/Roof%20solar%20panel%20mounting.jpg",
    servicesTitle: "Why Choose Commercial Solar?",
    features: [
      {
        title: "Reduce Operating Costs",
        description:
          "Significantly cut your business electricity expenses and improve your bottom line.",
      },
      {
        title: "Tax Benefits",
        description:
          "Take advantage of accelerated depreciation and other tax incentives for solar investments.",
      },
      {
        title: "Brand Enhancement",
        description:
          "Demonstrate your commitment to sustainability and attract environmentally conscious customers.",
      },
      {
        title: "Scalable Solutions",
        description:
          "Our systems can be designed to grow with your business needs and energy requirements.",
      },
      {
        title: "Minimal Maintenance",
        description:
          "Commercial solar systems require little upkeep while delivering consistent energy production.",
      },
      {
        title: "Quick ROI",
        description:
          "Most commercial installations pay for themselves within 3-5 years through energy savings.",
      },
    ],
  },
];

export const getSolutionBySlug = (slug: string): SolutionData | undefined => {
  return mockSolutions.find((solution) => solution.slug === slug);
};
