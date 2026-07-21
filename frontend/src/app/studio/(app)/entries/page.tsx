// src/app/studio/(app)/entries/page.tsx
import type { Metadata } from "next";
import EntriesListScreen from "@/components/Studio/Entries/EntriesListScreen";

export const metadata: Metadata = { title: "Entries" };

export default function EntriesPage() {
  return <EntriesListScreen />;
}
