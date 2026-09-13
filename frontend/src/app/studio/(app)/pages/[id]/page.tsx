// src/app/studio/(app)/pages/[id]/page.tsx
import type { Metadata } from "next";
import PageMaintenanceScreen from "@/components/Studio/Pages/PageMaintenanceScreen";

export const metadata: Metadata = { title: "Maintain page" };

export default async function PageMaintenancePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PageMaintenanceScreen id={id} />;
}
