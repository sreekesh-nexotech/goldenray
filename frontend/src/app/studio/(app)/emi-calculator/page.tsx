// src/app/studio/(app)/emi-calculator/page.tsx
import type { Metadata } from "next";
import EmiCalculatorScreen from "@/components/Studio/EmiCalculator/EmiCalculatorScreen";

export const metadata: Metadata = { title: "EMI Calculator" };

export default function EmiCalculatorPage() {
  return <EmiCalculatorScreen />;
}
