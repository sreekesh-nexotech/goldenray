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

import JsonLD from "@/components/JsonLD";
import { residentialServiceSchema } from "@/data/jsonld";

export const metadata: Metadata = {
  title:
    "Solar Panels for Home in Kerala | ₹78,000 Subsidy + KSEB Net Metering",
  description:
    "Install solar panels for your Kerala home from ₹1.1 lakh after ₹78,000 PM Surya Ghar subsidy. MNRE-approved, KSEB net metering, 25-year warranty. Free quote from Flarize — Kerala's solar EPC.",
  openGraph: {
    title:
      "Solar Panels for Home in Kerala | ₹78,000 Subsidy + KSEB Net Metering | Flarize",
    description:
      "Solar panels for Kerala homes from ₹1.1 lakh after subsidy. MNRE-approved installer. KSEB net metering. 25-year warranty. Free quote from Flarize.",
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
    title:
      "Solar Panels for Home in Kerala | ₹78,000 Subsidy + KSEB Net Metering | Flarize",
    description:
      "Solar panels for Kerala homes from ₹1.1 lakh after subsidy. MNRE-approved installer. KSEB net metering. 25-year warranty. Free quote from Flarize.",
    images: [residentialPageData.hero.image],
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://flarize.com/residential",
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
      <JsonLD data={residentialServiceSchema} />
      {/* Hero Section */}
      <SolutionHero data={data.hero} />

      {/* Citable Answer Block — first substantive paragraph below the H1 */}
      <section className="px-4 md:px-6 lg:px-8 pt-8 md:pt-10">
        <p className="max-w-7xl mx-auto text-base md:text-lg leading-relaxed text-[#444444]">
          Residential solar panel installation in Kerala costs
          ₹1,85,000–₹2,15,000 for a 3 kW on-grid system before subsidy. After
          the ₹78,000 PM Surya Ghar central subsidy, the net cost drops to
          ₹1,07,000–₹1,37,000. Most Kerala homes consuming 300–500 KSEB units
          per month need a 3–5 kW system, which generates 12–20 units per day
          and can reduce the electricity bill to near-zero via KSEB net
          metering. Flarize is an MNRE-empanelled EPC company operating across
          all 14 Kerala districts including Alappuzha, Ernakulam,
          Thiruvananthapuram, Kozhikode, and Thrissur. Installation takes 2–3
          days for a typical residential system. The process includes site
          assessment, KSEB feasibility approval, panel installation, electrical
          inspector sign-off, and net meter activation. Flarize handles every
          step end-to-end with a 25-year platform accountability guarantee.
        </p>
      </section>

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
