// src/data/studio/assets.ts
import type { Asset } from "@/types/studio";

/**
 * Media library — every uploaded image, reused across entries and served by
 * the delivery API. Files live in `public/studio`.
 */
export const assets: Asset[] = [
  { id: "m1", name: "rooftop-panels.jpg", src: "/studio/rooftop-panels.jpg", w: 1435, h: 957, kb: 199, folder: "Blog covers", alt: "Father with his kids outside their home" },
  { id: "m2", name: "hero-house.png", src: "/studio/hero-house.png", w: 512, h: 512, kb: 568, folder: "Social", alt: "Flarize home with a rooftop array" },
  { id: "m3", name: "consultation-evening.jpg", src: "/studio/consultation-evening.jpg", w: 1216, h: 832, kb: 106, folder: "Site visits", alt: "Evening consultation with a family outside their home" },
  { id: "m4", name: "testimonial-family.jpg", src: "/studio/testimonial-family.jpg", w: 1216, h: 832, kb: 94, folder: "Site visits", alt: "Family in front of their solar-powered home at golden hour" },
];

/** Folder filter chips for the media library ("All media" first). */
export const mediaFolders: string[] = ["All media", "Blog covers", "Social", "Site visits"];
