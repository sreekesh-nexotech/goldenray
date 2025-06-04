export type BlogPost = {
  id: string;
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
    title: "How Solar Energy Can Transform Indian Industries?",
    description:"Rooftop solar helps industries cut costs and emissions, mitigate CBAM impacts, and stay competitive in global markets.",
    category: "Industry Insights",
    image: "/resources-1.png",
    date: "January 25, 2025",
    readTime: "7 min read",
  },
  {
    id: "h2",
    title: "Boost Your Rooftop Solar Benefits With IoT",
    category: "Technology",
    image: "/resources-2.png",
    date: "January 20, 2025",
    readTime: "5 min read",
  },
  {
    id: "h3",
    title: "18 States and UTs Adopt Group Net Metering for Rooftop Solar",
    category: "Policy",
    image: "/resources-4.png",
    date: "December 30, 2024",
    readTime: "6 min read",
  },
  {
    id: "h4",
    title: "The Future of Solar: Innovations to Watch",
    category: "Technology",
    image: "/resources-2.png",
    date: "January 15, 2025",
    readTime: "5 min read",
  },
  {
    id: "h5",
    title: "Solar Energy: A Game Changer for Rural Communities",
    category: "Community",
    image: "/resources-5.png",
    date: "January 10, 2025",
    readTime: "5 min read",
  },
];

// Other Posts
export const mockBlogs: BlogPost[] = [
  {
    id: "1",
    title: "The Sun's Energy is Democratic: Rooftop Solar as a Solution for...",
    description:"Battery storage boosts solar by storing excess energy, ensuring power during outages, and savings.",
    category: "Solar Lifestyle",
    image: "/resources-3.png",
    date: "January 25, 2025",
    readTime: "5 min read",
    rating: 4.9,
  },
  {
    id: "2",
    title: "The Sun's Energy is Democratic: Rooftop Solar as a Solution for...",
    description:"Battery storage boosts solar by storing excess energy, ensuring power during outages, and savings.",
    category: "Solar Lifestyle",
    image: "/resources-6.png",
    date: "January 20, 2025",
    readTime: "5 min read",
    rating: 4.8,
  },
  {
    id: "3",
    title: "The Sun's Energy is Democratic: Rooftop Solar as a Solution for...",
    description:"Battery storage boosts solar by storing excess energy, ensuring power during outages, and savings.",
    category: "Solar Lifestyle",
    image: "/resources-7.png",
    date: "January 15, 2025",
    readTime: "5 min read",
    rating: 4.7,
  },
  {
    id: "4",
    title: "Solar Panels: Maintenance Tips for Longevity",
    description:"Battery storage boosts solar by storing excess energy, ensuring power during outages, and savings.",
    category: "Technology",
    image: "/resources-3.png",
    date: "January 10, 2025",
    readTime: "6 min read",
    rating: 4.6,
  },
  {
    id: "5",
    title: "The Impact of Solar on Urban Planning",
    description:"Battery storage boosts solar by storing excess energy, ensuring power during outages, and savings.",
    category: "Industry Insights",
    image: "/resources-6.png",
    date: "January 5, 2025",
    readTime: "7 min read",
    rating: 4.5,
  },
    {
    id: "6",
    title: "The Sun's Energy is Democratic: Rooftop Solar as a Solution for...",
    description:"Battery storage boosts solar by storing excess energy, ensuring power during outages, and savings.",
    category: "Solar Lifestyle",
    image: "/resources-7.png",
    date: "January 25, 2025",
    readTime: "5 min read",
    rating: 4.9,
  },
];

// Mock selected category (this would come from backend in the future)
export const selectedCategory: string = "Solar Lifestyle";