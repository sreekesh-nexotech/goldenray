// src/app/studio/(app)/collections/page.tsx
import type { Metadata } from "next";
import CollectionsScreen from "@/components/Studio/Collections/CollectionsScreen";

export const metadata: Metadata = { title: "Collections" };

export default function CollectionsPage() {
  return <CollectionsScreen />;
}
