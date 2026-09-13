// src/app/studio/(app)/careers/page/page.tsx
//
// Career Page maintenance (§6.16): the controlled maintenance view pinned to
// the /career route and gated on the career_page module.
import type { Metadata } from "next";
import PageMaintenanceScreen from "@/components/Studio/Pages/PageMaintenanceScreen";

export const metadata: Metadata = { title: "Career Page" };

export default function CareerPageMaintenancePage() {
  return <PageMaintenanceScreen route="/career" module="career_page" />;
}
