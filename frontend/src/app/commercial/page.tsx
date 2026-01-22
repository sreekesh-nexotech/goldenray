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
  SolutionCtaSection,
} from "@/components/SolutionsPage";

export const metadata: Metadata = {
  title:
    "Commercial Solar Installation - Business Solar Solutions | Flarize Kerala",
  description:
    "Power your business with Flarize's commercial solar solutions in Kerala. Reduce operational costs, ensure reliable energy, and enhance your brand's sustainability. Contact us for a custom quote!",
  openGraph: {
    title: "Commercial Solar Installation - Business Solar Solutions",
    description:
      "Reduce operational costs and boost your business sustainability with our commercial solar installations.",
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
    title: "Commercial Solar Solutions - Flarize",
    description:
      "Reduce operational costs and enhance your business sustainability with solar.",
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

      {/* Solar Types with Background */}
      <SolarTypes solarTypes={data.solarTypes} />

      {/* FAQ Section */}
      <SolutionFaqSection
        title={data.faqTitle}
        description={data.faqDescription}
      />

      {/* CTA Section */}
      <SolutionCtaSection />
    </>
  );
}
