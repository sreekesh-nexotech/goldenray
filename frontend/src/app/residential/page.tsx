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
  title:
    "Solar Panels for Home in Kerala | ₹78,000 Subsidy + KSEB Net Metering",
  description:
    "Install on-grid solar panels for your home in Kerala. Get ₹78,000 PM Surya Ghar subsidy, KSEB net metering & MNRE-approved installation. Best solar company Kerala. Solar panel price Kerala from ₹1.1 lakh. Free quote from Flarize.",
  keywords: [
    "solar panels Kerala",
    "solar panels for home Kerala",
    "solar panel installation Kerala",
    "residential solar installation Kerala",
    "rooftop solar system Kerala",
    "on-grid solar system Kerala",
    "solar panel price Kerala",
    "solar panel for house Kerala",
    "3kW solar system price Kerala",
    "5kW solar system Kerala",
    "PM Surya Ghar subsidy Kerala",
    "KSEB solar subsidy",
    "MNRE solar subsidy Kerala",
    "KSEB net metering Kerala",
    "solar installation cost Kerala",
    "MNRE approved solar installer Kerala",
    "off-grid solar system Kerala",
    "hybrid solar system Kerala",
    "rooftop solar subsidy Kerala 2025",
    "home solar power system Kerala",
    "best solar company Kerala",
    "DCR panels Kerala ALMM approved",
    "1kW solar system Kerala",
    "2kW solar system Kerala",
  ],
  openGraph: {
    title:
      "Solar Panels for Home in Kerala | ₹78,000 Subsidy + KSEB Net Metering",
    description:
      "Install on-grid solar panels for your home in Kerala. Get ₹78,000 PM Surya Ghar subsidy, KSEB net metering & MNRE-approved residential solar installation Kerala. Free quote from Flarize.",
    url: "https://www.flarize.com/residential",
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
    title:
      "Solar Panels for Home in Kerala | ₹78,000 Subsidy + KSEB Net Metering",
    description:
      "Install on-grid solar panels for your home in Kerala. Get ₹78,000 PM Surya Ghar subsidy, KSEB net metering & MNRE-approved installation. Free quote from Flarize.",
    images: [residentialPageData.hero.image],
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://www.flarize.com/residential",
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
        faqs={data.faqs}
      />
    </>
  );
}
