// src/app/studio/(app)/pages/page.tsx
import type { Metadata } from "next";
import PagesScreen from "@/components/Studio/Pages/PagesScreen";

export const metadata: Metadata = { title: "Pages" };

export default function PagesPage() {
  return <PagesScreen />;
}
