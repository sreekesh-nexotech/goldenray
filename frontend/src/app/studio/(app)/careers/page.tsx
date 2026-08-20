// src/app/studio/(app)/careers/page.tsx
import type { Metadata } from "next";
import CareerScreen from "@/components/Studio/Careers/CareerScreen";

export const metadata: Metadata = { title: "Career" };

export default function CareerPage() {
  return <CareerScreen />;
}
