// src/app/studio/(app)/settings/page.tsx
import type { Metadata } from "next";
import SettingsScreen from "@/components/Studio/Admin/SettingsScreen";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return <SettingsScreen />;
}
