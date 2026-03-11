export type BlogArticle = {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;       // card thumbnail (coverImg)
  mainImage?: string; // article hero image (mainImg)
  readTime: string;
  updatedDate: string;
  featured?: boolean;
};

export const blogCategories = [
  "All Guides",
  "Subsidy & Government",
  "Cost & Savings",
  "Installation Process",
  "Solar Basics",
  "Case Studies",
  "Comparisons",
  "Maintenance",
];

export const categoryColors: Record<string, string> = {
  "Subsidy & Government": "bg-amber-100 text-amber-700",
  "Cost & Savings": "bg-blue-100 text-blue-700",
  "Installation Process": "bg-green-100 text-green-700",
  "Solar Basics": "bg-purple-100 text-purple-700",
  "Case Studies": "bg-orange-100 text-orange-700",
  "Comparisons": "bg-teal-100 text-teal-700",
  "Maintenance": "bg-red-100 text-red-700",
  "Industry Insights": "bg-indigo-100 text-indigo-700",
};

export const blogArticles: BlogArticle[] = [
  {
    id: "complete-guide-kerala-solar-subsidies-2024",
    title: "Complete Guide to Kerala Solar Subsidies 2024",
    description:
      "Everything you need to know about government subsidies, MNRE schemes, and state-specific benefits for solar installation in Kerala.",
    category: "Subsidy & Government",
    image: "https://gym-manager-pull.b-cdn.net/golden_ray/resources/resources-1.png",
    readTime: "12 min read",
    updatedDate: "Dec 15, 2024",
    featured: true,
  },
  {
    id: "how-to-calculate-solar-roi-kerala",
    title: "How to Calculate Solar ROI in Kerala",
    description:
      "Step-by-step guide to calculate your solar return on investment based on your electricity bill and local tariffs.",
    category: "Cost & Savings",
    image: "https://gym-manager-pull.b-cdn.net/golden_ray/resources/resources-3.png",
    readTime: "8 min read",
    updatedDate: "Dec 10, 2024",
  },
  {
    id: "solar-installation-timeline",
    title: "Solar Installation Timeline: What to Expect",
    description:
      "Complete breakdown of the solar installation process from approval to commissioning.",
    category: "Installation Process",
    image: "https://gym-manager-pull.b-cdn.net/golden_ray/resources/resources-2.png",
    readTime: "6 min read",
    updatedDate: "Dec 10, 2024",
  },
  {
    id: "monocrystalline-vs-polycrystalline",
    title: "Monocrystalline vs Polycrystalline Solar Panels",
    description:
      "Which solar panel type is best for Kerala's climate conditions? A detailed comparison.",
    category: "Solar Basics",
    image: "https://gym-manager-pull.b-cdn.net/golden_ray/resources/resources-4.png",
    readTime: "8 min read",
    updatedDate: "Dec 10, 2024",
  },
  {
    id: "sharma-family-case-study",
    title: "How the Sharma Family Saved ₹2.5L Annually",
    description:
      "Real case study of 5kW solar installation in Kochi — costs, savings, and subsidy timeline.",
    category: "Case Studies",
    image: "https://gym-manager-pull.b-cdn.net/golden_ray/resources/resources-5.png",
    readTime: "6 min read",
    updatedDate: "Dec 10, 2024",
  },
  {
    id: "string-vs-power-optimizers",
    title: "String vs Power Optimizers: Which is Better?",
    description:
      "Detailed comparison of solar inverter technologies for Indian homes and which suits Kerala's conditions.",
    category: "Comparisons",
    image: "https://gym-manager-pull.b-cdn.net/golden_ray/resources/resources-6.png",
    readTime: "6 min read",
    updatedDate: "Dec 10, 2024",
  },
  {
    id: "solar-panel-maintenance-monsoon",
    title: "Solar Panel Maintenance During Monsoon",
    description:
      "Essential tips to maintain solar panels during Kerala's monsoon season and protect your investment.",
    category: "Maintenance",
    image: "https://gym-manager-pull.b-cdn.net/golden_ray/resources/resources-7.png",
    readTime: "6 min read",
    updatedDate: "Dec 10, 2024",
  },
  {
    id: "pm-surya-ghar-application-guide",
    title: "How to Apply for PM Surya Ghar Yojana in Kerala",
    description:
      "Step-by-step walkthrough of the PM Surya Ghar portal application process for Kerala residents.",
    category: "Subsidy & Government",
    image: "https://gym-manager-pull.b-cdn.net/golden_ray/resources/resources-1.png",
    readTime: "10 min read",
    updatedDate: "Nov 28, 2024",
  },
  {
    id: "net-metering-kseb-guide",
    title: "Net Metering with KSEB: Complete 2024 Guide",
    description:
      "How net metering works in Kerala, how to apply, and how to maximise your savings with KSEB.",
    category: "Subsidy & Government",
    image: "https://gym-manager-pull.b-cdn.net/golden_ray/resources/resources-2.png",
    readTime: "9 min read",
    updatedDate: "Nov 20, 2024",
  },
];
