// src/app/career/ui-ux-designer/page.tsx

import { Metadata } from "next";
import CareerHero from "@/components/Career/CareerHero";
import CareerStats from "@/components/Career/CareerStats";
import JobDetail from "@/components/Career/JobDetail";
import ApplicationForm from "@/components/Career/ApplicationForm";
import OpenPositions from "@/components/Career/OpenPositions";
import ResumeCTA from "@/components/Career/ResumeCTA";
import JoinCTA from "@/components/Career/JoinCTA";
import PerksBenefits from "@/components/Career/PerksBenefits";

export const metadata: Metadata = {
  title: "UI/UX Designer | Careers at Flarize",
  description:
    "Join Flarize as a UI/UX Designer. Design responsive web and mobile experiences, maintain design systems, and build products that power solar across Kerala.",
  keywords: [
    "UI/UX Designer job Kerala",
    "Product Designer Kochi",
    "Design jobs Flarize",
    "Figma designer job India",
    "Solar startup design careers",
  ],
  openGraph: {
    title: "UI/UX Designer | Careers at Flarize",
    description:
      "Join Flarize as a UI/UX Designer and design products that power real homes across Kerala.",
    url: "https://flarize.com/career/ui-ux-designer",
    siteName: "Flarize",
    images: [
      { url: "/heroImg.png", width: 1200, height: 630, alt: "UI/UX Designer at Flarize" },
    ],
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://flarize.com/career/ui-ux-designer",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function UiUxDesignerPage() {
  return (
    <section className="relative">
      <CareerHero />
      <CareerStats />
      <JobDetail />
      <ApplicationForm />
      <PerksBenefits/>
      <OpenPositions />
      <ResumeCTA />
      <JoinCTA />
    </section>
  );
}
