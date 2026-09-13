// src/app/studio/(app)/careers/positions/page.tsx
import type { Metadata } from "next";
import PositionsScreen from "@/components/Studio/Careers/PositionsScreen";

export const metadata: Metadata = { title: "Job Positions" };

export default function PositionsPage() {
  return <PositionsScreen />;
}
