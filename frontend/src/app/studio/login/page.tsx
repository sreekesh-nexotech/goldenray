// src/app/studio/login/page.tsx
import type { Metadata } from "next";
import SignInScreen from "@/components/Studio/SignIn/SignInScreen";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function StudioLoginPage() {
  return <SignInScreen />;
}
