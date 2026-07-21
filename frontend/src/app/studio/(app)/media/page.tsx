// src/app/studio/(app)/media/page.tsx
import type { Metadata } from "next";
import MediaScreen from "@/components/Studio/Media/MediaScreen";

export const metadata: Metadata = { title: "Media library" };

export default function MediaPage() {
  return <MediaScreen />;
}
