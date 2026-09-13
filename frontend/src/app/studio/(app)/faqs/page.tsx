// src/app/studio/(app)/faqs/page.tsx
import type { Metadata } from "next";
import FaqListScreen from "@/components/Studio/Faqs/FaqListScreen";

export const metadata: Metadata = { title: "FAQs" };

export default function FaqsPage() {
  return <FaqListScreen />;
}
