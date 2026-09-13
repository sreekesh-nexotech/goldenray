// src/app/studio/(app)/careers/positions/[id]/page.tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import PositionEditorScreen from "@/components/Studio/Careers/PositionEditorScreen";

export const metadata: Metadata = { title: "Edit position" };

export default async function PositionEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // useSearchParams() inside the editor needs a Suspense boundary for static rendering.
  return (
    <Suspense fallback={null}>
      <PositionEditorScreen id={id} />
    </Suspense>
  );
}
