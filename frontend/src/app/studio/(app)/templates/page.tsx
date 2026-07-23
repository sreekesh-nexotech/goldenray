// src/app/studio/(app)/templates/page.tsx
import type { Metadata } from "next";
import TemplatesScreen from "@/components/Studio/Templates/TemplatesScreen";

export const metadata: Metadata = { title: "Templates" };

export default function TemplatesPage() {
  return <TemplatesScreen />;
}
