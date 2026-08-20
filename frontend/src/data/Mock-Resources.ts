export type BlogPost = {
  id: string;
  /** Public URL segment. Ids stay for internal keys only. */
  slug: string;
  title: string;
  description?:string;
  category: string;
  image: string;
  date: string;
  readTime: string;
  rating?: number;
};

export type HeroPost = {
  id: string;
  /** Public URL segment. Ids stay for internal keys only. */
  slug: string;
  title: string;
  description?:string;
  category: string;
  image: string;
  date: string;
  readTime: string;
};

// Hero Section Posts
export const heroPosts: HeroPost[] = [
  {
    id: "h1",
    slug: "solar-energy-industries",
    title: "How Solar Energy Can Transform Indian Industries?",
    description:"Rooftop solar helps industries cut costs and emissions, mitigate CBAM impacts, and stay competitive in global markets.",
    category: "Industry Insights",
    image: "https://gym-manager-pull.b-cdn.net/golden_ray/resources/resources-1.png",
    date: "January 25, 2025",
    readTime: "7 min read",
  },
  {
    id: "h2",
    slug: "rooftop-solar-iot-benefits",
    title: "Boost Your Rooftop Solar Benefits With IoT",
    category: "Technology",
    image: "https://gym-manager-pull.b-cdn.net/golden_ray/resources/resources-2.png",
    date: "January 20, 2025",
    readTime: "5 min read",
  },
  {
    id: "h3",
    slug: "group-net-metering-rooftop-solar",
    title: "18 States and UTs Adopt Group Net Metering for Rooftop Solar",
    category: "Policy",
    image: "https://gym-manager-pull.b-cdn.net/golden_ray/resources/resources-4.png",
    date: "December 30, 2024",
    readTime: "6 min read",
  },
  {
    id: "h4",
    slug: "future-of-solar-innovations",
    title: "The Future of Solar: Innovations to Watch",
    category: "Technology",
    image: "https://gym-manager-pull.b-cdn.net/golden_ray/resources/resources-2.png",
    date: "January 15, 2025",
    readTime: "5 min read",
  },
  {
    id: "h5",
    slug: "solar-energy-rural-communities",
    title: "Solar Energy: A Game Changer for Rural Communities",
    category: "Community",
    image: "https://gym-manager-pull.b-cdn.net/golden_ray/resources/resources-5.png",
    date: "January 10, 2025",
    readTime: "5 min read",
  },
];

// Other Posts
export const mockBlogs: BlogPost[] = [
  {
    id: "1",
    slug: "rooftop-solar-battery-storage",
    title: "The Sun's Energy is Democratic: Rooftop Solar as a Solution for...",
    description:"Battery storage boosts solar by storing excess energy, ensuring power during outages, and savings.",
    category: "Solar Lifestyle",
    image: "https://gym-manager-pull.b-cdn.net/golden_ray/resources/resources-3.png",
    date: "January 25, 2025",
    readTime: "5 min read",
    rating: 4.9,
  },
  {
    id: "2",
    slug: "rooftop-solar-battery-storage",
    title: "The Sun's Energy is Democratic: Rooftop Solar as a Solution for...",
    description:"Battery storage boosts solar by storing excess energy, ensuring power during outages, and savings.",
    category: "Solar Lifestyle",
    image: "https://gym-manager-pull.b-cdn.net/golden_ray/resources/resources-6.png",
    date: "January 20, 2025",
    readTime: "5 min read",
    rating: 4.8,
  },
  {
    id: "3",
    slug: "rooftop-solar-battery-storage",
    title: "The Sun's Energy is Democratic: Rooftop Solar as a Solution for...",
    description:"Battery storage boosts solar by storing excess energy, ensuring power during outages, and savings.",
    category: "Solar Lifestyle",
    image: "https://gym-manager-pull.b-cdn.net/golden_ray/resources/resources-7.png",
    date: "January 15, 2025",
    readTime: "5 min read",
    rating: 4.7,
  },
  {
    id: "4",
    slug: "solar-panel-maintenance-tips",
    title: "Solar Panels: Maintenance Tips for Longevity",
    description:"Battery storage boosts solar by storing excess energy, ensuring power during outages, and savings.",
    category: "Technology",
    image: "https://gym-manager-pull.b-cdn.net/golden_ray/resources/resources-3.png",
    date: "January 10, 2025",
    readTime: "6 min read",
    rating: 4.6,
  },
  {
    id: "5",
    slug: "solar-impact-urban-planning",
    title: "The Impact of Solar on Urban Planning",
    description:"Battery storage boosts solar by storing excess energy, ensuring power during outages, and savings.",
    category: "Industry Insights",
    image: "https://gym-manager-pull.b-cdn.net/golden_ray/resources/resources-6.png",
    date: "January 5, 2025",
    readTime: "7 min read",
    rating: 4.5,
  },
    {
    id: "6",
    slug: "rooftop-solar-battery-storage",
    title: "The Sun's Energy is Democratic: Rooftop Solar as a Solution for...",
    description:"Battery storage boosts solar by storing excess energy, ensuring power during outages, and savings.",
    category: "Solar Lifestyle",
    image: "https://gym-manager-pull.b-cdn.net/golden_ray/resources/resources-7.png",
    date: "January 25, 2025",
    readTime: "5 min read",
    rating: 4.9,
  },
];

// Mock selected category (this would come from backend in the future)
export const selectedCategory: string = "Solar Lifestyle";