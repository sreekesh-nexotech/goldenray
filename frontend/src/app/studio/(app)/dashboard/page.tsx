// src/app/studio/(app)/dashboard/page.tsx
import type { Metadata } from "next";
import DashboardScreen from "@/components/Studio/Dashboard/DashboardScreen";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return <DashboardScreen />;
}
