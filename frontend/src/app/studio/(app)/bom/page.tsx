// src/app/studio/(app)/bom/page.tsx
import type { Metadata } from "next";
import BomCalculatorScreen from "@/components/Studio/Bom/BomCalculatorScreen";

export const metadata: Metadata = { title: "BOM Calculator" };

export default function BomPage() {
  return <BomCalculatorScreen />;
}
