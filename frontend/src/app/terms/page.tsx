import LegalHero from "@/components/LegalHero";
import { Metadata } from "next";

// Metadata
export const metadata: Metadata = {
  title: "Terms and Conditions - Flarize Solar Energy Solutions",
  description:
    "Read Flarize's terms and conditions to understand the terms of service for using our solar energy solutions and services in Kerala.",
  openGraph: {
    title: "Terms and Conditions - Flarize",
    description:
      "Review the terms and conditions for using Flarize's solar energy services.",
    url: "https://flarize.com/terms",
    siteName: "Flarize",
    images: [
      {
        url: "/heroImg.png",
        width: 1200,
        height: 630,
        alt: "Terms and Conditions",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms and Conditions - Flarize",
    description: "Review the terms and conditions for our services.",
    images: ["/heroImg.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://www.flarize.com/terms",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function terms() {
  return (
    <section>
      {/* legal page heading  */}
      <LegalHero
        title="Terms and Conditions"
        effectiveDate=" 27-04-2025"
        lastUpdated="27-04-2025"
      />

      {/* content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-36  py-8">
        <div className="text-gray-800 space-y-10">
          {/* warranty */}
          <div className="space-y-5">
            <h2 className="text-2xl font-semibold mb-4">1. Warranty</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                Flarize provides a five (5) year warranty for the complete solar
                power system, applicable only to technical failures.
              </li>
              <li>
                The company guarantees the performance of the solar energy
                system as per the agreed specifications, subject to the terms of
                this warranty.
              </li>
              <li>
                Warranty claims are limited to manufacturing defects only and do
                not cover issues arising from:
                <ul className="list-disc list-inside space-y-1 ml-6 mt-1">
                  <li>Non-compliance with operating guidelines</li>
                  <li>External physical damage</li>
                  <li>Improper usage or handling</li>
                </ul>
              </li>
            </ul>
          </div>

          {/* warranty exclusions */}
          <div className="space-y-5">
            <h2 className="text-2xl font-semibold mb-4">
              2. Warranty Exclusions
            </h2>
            <p className="mb-2">
              The warranty shall not apply to defects or damages resulting from:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                Willful damage or negligence by the customer after final
                commissioning.
              </li>
              <li>
                Misuse, abuse, or unauthorized modification of the equipment.
              </li>
              <li>
                Damage caused by natural calamities, Acts of God, or Force
                Majeure events.
              </li>
              <li>
                Any third-party installations, alterations, or interference
                related to or affecting the installed system.
              </li>
            </ul>
          </div>

          {/* customer responsibilities */}
          <div className="space-y-5">
            <h2 className="text-2xl font-semibold mb-4">
              3. Customer Responsibilities
            </h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                The customer must provide a shade-free area suitable for solar
                panel installation.
              </li>
              <li>
                Inverter installation locations must be protected from direct
                rain and excessive sunlight and meet safety requirements.
              </li>
              <li>
                Adequate access to the site must be ensured for installation and
                service activities.
              </li>
            </ul>
          </div>

          {/* service and training */}
          <div className="space-y-5">
            <h2 className="text-2xl font-semibold mb-4">
              4. Service &amp; Training
            </h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                Flarize will provide basic service and maintenance training to
                the customer at the time of commissioning.
              </li>
            </ul>
          </div>

          {/* project completion timeline */}
          <div className="space-y-5">
            <h2 className="text-2xl font-semibold mb-4">
              5. Project Completion Timeline
            </h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                Project completion may take up to 30 days from the date of
                receipt of the work order.
              </li>
              <li>
                Delays caused by government authorities, utilities, or
                unforeseen circumstances may extend the timeline.
              </li>
              <li>
                Any additional charges, if applicable, due to such delays will
                be mutually discussed and agreed upon in writing between Flarize
                and the customer.
              </li>
            </ul>
          </div>

          {/* statutory and KSEB-related scope */}
          <div className="space-y-5">
            <h2 className="text-2xl font-semibold mb-4">
              Statutory &amp; KSEB-Related Scope
            </h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                All statutory approvals, permissions, and formalities required
                from the Kerala State Electricity Board (KSEB) shall be
                facilitated as per applicable norms.
              </li>
              <li>
                Load enhancement, tariff change, name change, ownership
                transfer, meter shifting, or any modification in existing KSEB
                consumer details shall be entirely under the customer&apos;s
                scope.
              </li>
              <li>
                Any costs, fees, deposits, penalties, or charges levied by KSEB
                or other authorities for the above activities shall be borne by
                the customer.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
