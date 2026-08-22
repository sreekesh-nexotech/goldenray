// src/app/studio/(app)/enquiries/page.tsx
import type { Metadata } from "next";
import EnquiriesScreen from "@/components/Studio/Enquiries/EnquiriesScreen";

export const metadata: Metadata = { title: "Enquiries" };

export default function EnquiriesPage() {
  return <EnquiriesScreen />;
}
