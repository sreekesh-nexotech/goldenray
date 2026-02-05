// src/app/residential/page.tsx
import { Metadata } from "next";
import { residentialPageData } from "@/data/solutions-page-data";
import {
  SolutionHero,
  InfoSection,
  WorkSection,
  PanelTypesSection,
  SolarTypes,
  MilestonesSection,
  BenefitsApplicationsSection,
  FinalThoughtsSection,
  SolutionFaqSection,
} from "@/components/SolutionsPage";

export const metadata: Metadata = {
  title: "Residential Solar Installation in Kerala | Rooftop Experts",
  description:
    "Install rooftop solar panels for your Kerala home. Reduce electricity bills with safe, efficient residential solar systems by Flarize.",
  keywords: [
    "residential solar installation kerala",
    "rooftop solar for home kerala",
    "home solar system kerala",
    "on grid solar for home kerala",
    "solar panels for house kerala",
  ],
  openGraph: {
    title: "Residential Solar Installation in Kerala | Rooftop Experts",
    description:
      "Install rooftop solar panels for your Kerala home. Reduce electricity bills with safe, efficient residential solar systems by Flarize.",
    url: "https://flarize.com/residential-solar-installation-kerala",
    siteName: "Flarize",
    images: [
      {
        url: residentialPageData.hero.image,
        width: 1200,
        height: 630,
        alt: "Residential Solar Installation",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Residential Solar Installation in Kerala | Rooftop Experts",
    description:
      "Install rooftop solar panels for your Kerala home. Reduce electricity bills with safe, efficient residential solar systems by Flarize.",
    images: [residentialPageData.hero.image],
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://www.flarize.com/residential-solar-installation-kerala",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ResidentialPage() {
  const data = residentialPageData;

  return (
    <>
      {/* Hero Section */}
      <SolutionHero data={data.hero} />

      {/* What Are Residential Solar Panels */}
      <InfoSection data={data.whatSection} variant="boxed" />

      {/* How Do Residential Solar Panels Work */}
      <InfoSection data={data.howSection} variant="boxed" />

      {/* Work Section */}
      <WorkSection data={data.workSection} />

      {/* Types of Solar Panels - Light */}
      <PanelTypesSection panels={data.panelTypes} variant="light" />

      {/* Our Milestones */}
      <MilestonesSection milestones={data.milestones} />

      {/* Benefits & Applications */}
      <BenefitsApplicationsSection data={data.benefitsApplications} />

      {/* Final Thoughts */}
      <FinalThoughtsSection data={data.finalThoughts} />

      {/* Solar Types with Background */}
      <SolarTypes solarTypes={data.solarTypes} />

      {/* FAQ Section */}
      <SolutionFaqSection
        title={data.faqTitle}
        description={data.faqDescription}
      />
    </>
  );
}
