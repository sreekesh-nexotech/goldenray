// src/app/commercial/page.tsx
import { Metadata } from "next";
import { commercialPageData } from "@/data/solutions-page-data";
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
  title: "Commercial Solar Panel Installation Company in Kerala — Flarize",
  description:
    "Flarize is Kerala's trusted commercial solar panel installation company. Reduce electricity bills by 90%. 40% accelerated depreciation + 75% financing. Get a free quote.",
  keywords: [
    "commercial solar installation kerala",
    "commercial solar panels kerala",
    "solar for offices kerala",
    "solar power for shops kerala",
    "rooftop solar commercial kerala",
  ],
  openGraph: {
    title: "Commercial Solar Installation Company in Kerala — Flarize",
    description:
      "On-grid solar panel installation for factories, offices, and warehouses across Kerala. ROI in 3–4 years. 40% depreciation, GST input tax credit, 75% project financing. KSEB approvals and net metering handled end-to-end. MNRE certified, KSEB approved solar installer.",
    url: "https://flarize.com/commercial",
    siteName: "Flarize",
    images: [
      {
        url: commercialPageData.hero.image,
        width: 1200,
        height: 630,
        alt: "Commercial Solar Installation",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Commercial Solar Installation Company in Kerala — Flarize",
    description:
      "Flarize is Kerala's trusted commercial solar panel installation company. Reduce electricity bills by 90%. 40% accelerated depreciation + 75% financing. Get a free quote.",
    images: [commercialPageData.hero.image],
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://www.flarize.com/commercial",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function CommercialPage() {
  const data = commercialPageData;

  return (
    <>
      {/* Hero Section */}
      <SolutionHero data={data.hero} />

      {/* What Are Commercial Solar Systems */}
      <InfoSection data={data.whatSection} variant="boxed" />

      {/* How Do Commercial Solar Systems Work */}
      <InfoSection data={data.howSection} variant="boxed" />

      {/* Work Section */}
      <WorkSection data={data.workSection} />

      {/* Types of Solar Panels - Light */}
      <PanelTypesSection panels={data.panelTypes} variant="light" />

      {/* Solar Types with Background */}
      <SolarTypes solarTypes={data.solarTypes} />

      {/* Our Milestones */}
      <MilestonesSection milestones={data.milestones} />

      {/* Benefits & Applications */}
      <BenefitsApplicationsSection data={data.benefitsApplications} />

      {/* Final Thoughts */}
      <FinalThoughtsSection data={data.finalThoughts} />

      {/* FAQ Section */}
      <SolutionFaqSection
        title={data.faqTitle}
        description={data.faqDescription}
        faqs={data.faqs}
      />
    </>
  );
}
