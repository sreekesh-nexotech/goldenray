// src/app/studio/(app)/taxonomy/page.tsx
import type { Metadata } from "next";
import TaxonomyScreen from "@/components/Studio/Taxonomy/TaxonomyScreen";

export const metadata: Metadata = { title: "Authors & taxonomy" };

export default function TaxonomyPage() {
  return <TaxonomyScreen />;
}
