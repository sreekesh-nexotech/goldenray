// src/app/studio/(app)/roles/page.tsx
import type { Metadata } from "next";
import RolesScreen from "@/components/Studio/Roles/RolesScreen";

export const metadata: Metadata = { title: "Roles & access" };

export default function RolesPage() {
  return <RolesScreen />;
}
