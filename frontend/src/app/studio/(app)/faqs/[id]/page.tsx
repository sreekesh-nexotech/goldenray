// src/app/studio/(app)/faqs/[id]/page.tsx
import type { Metadata } from "next";
import FaqEditorScreen from "@/components/Studio/Faqs/FaqEditorScreen";

export const metadata: Metadata = { title: "Edit FAQ" };

export default async function FaqEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <FaqEditorScreen id={id} />;
}
