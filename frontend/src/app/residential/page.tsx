// src/app/residential/page.tsx
import { Metadata } from "next";
import { residentialPageData } from "@/data/solutions-page-data";
import {
  SolutionHero,
  InfoSection,
  WorkSection,
  PanelTypesSection,
  MilestonesSection,
  BenefitsApplicationsSection,
  FinalThoughtsSection,
  SolutionFaqSection,
  SolutionCtaSection,
} from "@/components/SolutionsPage";

export const metadata: Metadata = {
  title:
    "Residential Solar Installation - Home Solar Solutions | Flarize Kerala",
  description:
    "Transform your home with Flarize's residential solar solutions in Kerala. Expert installation, long-term savings, and reliable power for your household. Get a free consultation today!",
  openGraph: {
    title: "Residential Solar Installation - Home Solar Solutions",
    description:
      "Transform your home with clean solar energy. Expert installation, long-term savings, and reliable power for your household.",
    url: "https://flarize.com/residential",
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
    title: "Residential Solar Solutions - Flarize",
    description:
      "Transform your home with clean solar energy and enjoy significant savings.",
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

      {/* Types of Solar Panels - Dark */}
      <PanelTypesSection panels={data.darkPanelTypes} variant="dark" />

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
