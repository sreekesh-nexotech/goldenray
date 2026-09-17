import type { Metadata } from "next";

// The base /quotation route renders client-side (page.tsx is "use client"
// and can't export metadata), so without this it silently inherits the
// root layout's canonical of https://flarize.com -- making Google treat a
// customer's quotation as a duplicate of the homepage instead of the
// intentional noindex page it is. /quotation/v2 and /quotation/v2-malayalam
// already set this on their own page.tsx; this covers the parent route.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  alternates: { canonical: "https://flarize.com/quotation" },
};

export default function QuotationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
