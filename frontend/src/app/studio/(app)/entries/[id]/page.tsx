// src/app/studio/(app)/entries/[id]/page.tsx
import type { Metadata } from "next";
import EntryEditorScreen from "@/components/Studio/EntryEditor/EntryEditorScreen";

export const metadata: Metadata = { title: "Edit entry" };

export default async function EntryEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EntryEditorScreen entryId={id} />;
}
