// src/app/studio/(app)/delivery-api/page.tsx
import type { Metadata } from "next";
import DeliveryApiScreen from "@/components/Studio/DeliveryApi/DeliveryApiScreen";

export const metadata: Metadata = { title: "Delivery API" };

export default function DeliveryApiPage() {
  return <DeliveryApiScreen />;
}
