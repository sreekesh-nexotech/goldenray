// src/app/studio/(app)/careers/page.tsx
import type { Metadata } from "next";
import CareersOverviewScreen from "@/components/Studio/Careers/CareersOverviewScreen";

export const metadata: Metadata = { title: "Careers" };

export default function CareersPage() {
  return <CareersOverviewScreen />;
}
