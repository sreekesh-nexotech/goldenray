import { MetadataResponse } from "@/types/types";


const mockMetadata: Record<string, MetadataResponse> = {
  home: {
    title: "Flarize - Solar Solutions",
    description: "Empowering sustainable energy with innovative solar solutions for residential, commercial, and industrial needs.",
    keywords: ["solar energy", "renewable energy", "Flarize"],
    imageUrl: "/heroImg.png",
    ogType: "website",
  },
  about: {
    title: "About Us | Flarize",
    description: "Learn about Flarize's mission, vision, and commitment to sustainable solar energy solutions.",
    keywords: ["solar energy", "about", "Flarize"],
    imageUrl: "/aboutHeroImg.png",
    ogType: "website",
  },
  "advanced-calculator": {
    title: "Solar Calculator | Flarize",
    description: "Calculate your solar energy needs with our advanced solar calculator tool.",
    keywords: ["solar calculator", "solar energy", "Flarize"],
    imageUrl: "/metrics-1.png",
    ogType: "website",
  },
  faq: {
    title: "FAQ | Flarize",
    description: "Find answers to frequently asked questions about solar energy and our services.",
    keywords: ["solar faq", "solar energy", "Flarize"],
    imageUrl: "/heroImg.png",
    ogType: "website",
  },
  projects: {
    title: "Projects | Flarize",
    description: "Explore our portfolio of successful solar energy projects.",
    keywords: ["solar projects", "renewable energy", "Flarize"],
    imageUrl: "/p-1.png",
    ogType: "website",
  },
  "projects/123": {
    title: "Solar Farm Project | Flarize",
    description: "A large-scale solar farm for sustainable energy production.",
    keywords: ["solar farm", "renewable energy", "Flarize"],
    imageUrl: "/p-1.png",
    ogType: "article",
  },
  "projects/456": {
    title: "Residential Solar Installation | Flarize",
    description: "A residential solar installation for energy efficiency.",
    keywords: ["residential solar", "solar energy", "Flarize"],
    imageUrl: "/Residential-1.png",
    ogType: "article",
  },
  resources: {
    title: "Resources | Flarize",
    description: "Discover our latest blogs and resources on solar energy solutions.",
    keywords: ["solar blogs", "solar resources", "Flarize"],
    imageUrl: "/resources-1.png",
    ogType: "website",
  },
  "resources/789": {
    title: "Guide to Solar Energy | Flarize",
    description: "A comprehensive guide to understanding solar energy benefits.",
    keywords: ["solar guide", "solar energy", "Flarize"],
    imageUrl: "/resources-1.png",
    ogType: "article",
  },
  "resources/012": {
    title: "Solar Panel Maintenance Tips | Flarize",
    description: "Tips for maintaining your solar panels for optimal performance.",
    keywords: ["solar maintenance", "solar panels", "Flarize"],
    imageUrl: "/resources-2.png",
    ogType: "article",
  },
  solutions: {
    title: "Solutions | Flarize",
    description: "Discover our innovative solar energy solutions for residential, commercial, and industrial needs.",
    keywords: ["solar solutions", "renewable energy", "Flarize"],
    imageUrl: "/Commercial-1.png",
    ogType: "website",
  },
};

export function getMockMetadata(path: string): MetadataResponse | null {
  // Normalize path: convert "/" to "home" and remove leading/trailing slashes
  const normalizedPath = path === "/" || path === "" ? "home" : path.replace(/^\/|\/$/g, "");
  return mockMetadata[normalizedPath] || null;
}