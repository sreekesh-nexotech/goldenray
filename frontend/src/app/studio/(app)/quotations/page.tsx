// src/app/studio/(app)/quotations/page.tsx
import type { Metadata } from "next";
import QuotationsScreen from "@/components/Studio/Quotations/QuotationsScreen";

export const metadata: Metadata = { title: "Quotations" };

export default function QuotationsPage() {
  return <QuotationsScreen />;
}
