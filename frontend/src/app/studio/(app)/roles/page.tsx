// src/app/studio/(app)/roles/page.tsx
import type { Metadata } from "next";
import RolesMatrixScreen from "@/components/Studio/Admin/RolesMatrixScreen";

export const metadata: Metadata = { title: "Roles & Permissions" };

export default function RolesPage() {
  return <RolesMatrixScreen />;
}
