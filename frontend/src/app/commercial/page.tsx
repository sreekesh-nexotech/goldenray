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
import JsonLD from "@/components/JsonLD";
import { commercialServiceSchema } from "@/data/jsonld";

export const metadata: Metadata = {
  title:
    "Commercial Solar Panel Installation Company in Kerala | Best Solar Company for Business",
  description:
    "Flarize is Kerala's trusted commercial solar panels Kerala installation company & solar EPC company Kerala. Reduce electricity bills by 90%. 40% accelerated depreciation + 75% financing. Solar panel installation cost per kW Kerala from ₹45,000. Get a free quote.",
  keywords: [
    "commercial solar installation Kerala",
    "solar panel installation Kerala",
    "commercial solar panels Kerala",
    "solar company Kerala",
    "solar installation for business Kerala",
    "rooftop solar for commercial buildings",
    "industrial solar installation Kerala",
    "on-grid solar system Kerala business",
    "commercial solar panel price Kerala",
    "solar for factory Kerala",
    "solar for warehouse Kerala",
    "solar for office building Kerala",
    "KSEB net metering commercial",
    "commercial solar ROI Kerala",
    "solar EPC company Kerala",
    "solar power plant installation Kerala",
    "best solar company in Kerala for business",
    "solar panel installation cost per kW Kerala",
  ],
  openGraph: {
    title:
      "Commercial Solar Installation Company in Kerala — Flarize | Solar Company Kerala",
    description:
      "On-grid solar panel installation Kerala for factories, offices, and warehouses. Commercial solar ROI Kerala in 3–4 years. 40% depreciation, GST input tax credit, 75% project financing. KSEB net metering commercial handled end-to-end. MNRE certified, KSEB approved solar installer.",
    url: "https://www.flarize.com/commercial",
    siteName: "Flarize",
    images: [
      {
        url: commercialPageData.hero.image,
        width: 1200,
        height: 630,
        alt: "Commercial solar panel installation on a factory rooftop in Kerala by Flarize — KSEB approved solar company",
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
      <JsonLD data={commercialServiceSchema} />
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
