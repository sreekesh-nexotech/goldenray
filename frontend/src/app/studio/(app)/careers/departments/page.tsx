// src/app/studio/(app)/careers/departments/page.tsx
import type { Metadata } from "next";
import DepartmentsScreen from "@/components/Studio/Careers/DepartmentsScreen";

export const metadata: Metadata = { title: "Departments" };

export default function DepartmentsPage() {
  return <DepartmentsScreen />;
}
