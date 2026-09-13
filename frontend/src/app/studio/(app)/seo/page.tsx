// src/app/studio/(app)/seo/page.tsx
import type { Metadata } from "next";
import SeoOverviewScreen from "@/components/Studio/Admin/SeoOverviewScreen";

export const metadata: Metadata = { title: "SEO" };

export default function SeoPage() {
  return <SeoOverviewScreen />;
}
