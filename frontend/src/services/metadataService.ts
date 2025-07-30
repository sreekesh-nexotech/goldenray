// src/services/metadataService.ts
//import { apiCall } from "./apiService";
import { getMockMetadata} from "@/data/mock-metadata";
import { MetadataResponse } from "@/types/types";

export async function getMetadataForPage(path: string): Promise<MetadataResponse | null> {
  try {
    // Mock API call simulation using apiCall structure
    const normalizedPath = path === "/" || path === "" ? "home" : path.replace(/^\/|\/$/g, "");
    const mockData = getMockMetadata(normalizedPath);
    if (!mockData) {
      console.warn(`No mock metadata found for path: ${normalizedPath}`);
      return null;
    }
    // Simulate API response using apiCall's structure
    const metadata = await Promise.resolve(mockData); // Mimic async API call
    return {
      title: metadata.title,
      description: metadata.description,
      keywords: metadata.keywords,
      imageUrl: metadata.imageUrl,
      ogType: metadata.ogType,
    };

    // Real API integration (commented out for future use)
    /*
    const normalizedPath = path === "/" || path === "" ? "home" : path.replace(/^\/|\/$/g, "");
    const metadata = await apiCall<MetadataResponse>(`/metadata/${normalizedPath}`, "GET");
    return {
      title: metadata.title || "Flarize - Solar Solutions",
      description: metadata.description || "Empowering sustainable energy with innovative solar solutions.",
      keywords: metadata.keywords || ["solar energy", "renewable energy", "Flarize"],
      imageUrl: metadata.imageUrl?.startsWith("http")
        ? metadata.imageUrl
        : `https://goldenray.com${metadata.imageUrl || "/heroImg.png"}`,
      ogType: metadata.ogType || "website",
    };
    */
  } catch (error) {
    console.error(`Error fetching metadata for ${path}:`, error);
    return null;
  }
}