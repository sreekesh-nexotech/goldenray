// src/app/studio/(app)/bom-admin/page.tsx
import type { Metadata } from "next";
import BomAdminScreen from "@/components/Studio/BomAdmin/BomAdminScreen";

export const metadata: Metadata = { title: "BOM Admin" };

export default function BomAdminPage() {
  return <BomAdminScreen />;
}
