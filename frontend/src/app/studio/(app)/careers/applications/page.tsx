// src/app/studio/(app)/careers/applications/page.tsx
import type { Metadata } from "next";
import CareerScreen from "@/components/Studio/Careers/CareerScreen";

export const metadata: Metadata = { title: "Applications" };

export default function ApplicationsPage() {
  return <CareerScreen />;
}
