// src/app/studio/layout.tsx
//
// Root of the Content Studio (blog CMS). Loads Inter for numerals and exposes
// it as --font-inter, and marks the whole surface noindex (admin app).

import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Content Studio",
    template: "%s · Flarize Content Studio",
  },
  description: "Manage the flarize.com blog — entries, media and templates.",
  robots: { index: false, follow: false },
};

export default function StudioRootLayout({ children }: { children: React.ReactNode }) {
  return <div className={inter.variable}>{children}</div>;
}
