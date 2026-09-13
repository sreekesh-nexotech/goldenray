// src/app/studio/(app)/users/page.tsx
//
// Users (§6.17): the existing accounts screen, now at /users so /roles can
// hold the permission matrix.
import type { Metadata } from "next";
import RolesScreen from "@/components/Studio/Roles/RolesScreen";

export const metadata: Metadata = { title: "Users" };

export default function UsersPage() {
  return <RolesScreen />;
}
