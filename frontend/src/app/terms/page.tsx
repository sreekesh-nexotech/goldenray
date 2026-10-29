import LegalHero from "@/components/LegalHero";
import { Metadata } from "next";
import { withCmsSeo } from "@/lib/cmsMetadata";
import CmsPageSchema from "@/components/CmsPageSchema";

// Metadata
const BASE_METADATA: Metadata = {
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
    canonical: "https://flarize.com/terms",
  },
  robots: {
    index: true,
    follow: true,
  },
};


// The Studio's SEO block for /terms (§6.2) overrides title, description,
// canonical and indexing; anything left blank there keeps the shipped value.
export const generateMetadata = () => withCmsSeo("/terms", BASE_METADATA);
export default function terms() {
  return (
    <>
      <CmsPageSchema route="/terms" />
      <section>
        {/* legal page heading  */}
        <LegalHero
          title="Terms and Conditions"
          effectiveDate="07-10-2026"
          lastUpdated="07-10-2026"
        />

        {/* content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-36  py-8">
          <div className="text-gray-800 space-y-10">
            {/* About Flarize */}
            <div className="space-y-5">
              <h2 className="text-2xl font-semibold mb-4">1. About Flarize</h2>
              <p>These Terms govern access to and use of the Flarize website, tools, products, and services provided by Flarize Technologies Private Limited.
                Flarize provides information and services relating to solar energy solutions, including consultations, quotations, solar system planning,
                installation-related services,financing-related information, maintenance/support, and related offerings.</p>
            </div>

            {/* Website Use */}
            <div className="space-y-5">
              <h2 className="text-2xl font-semibold mb-4">
                2. Website Use
              </h2>
              <p className="mb-2">
                You agree to use the website only for lawful purposes and not to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  Provide false or misleading information.
                </li>
                <li>
                  Attempt unauthorized access to our systems.
                </li>
                <li>
                  Interfere with website operation or security.
                </li>
                <li>
                  Improperly collect website content using automated systems.
                </li>
                <li>
                  Upload malicious code.
                </li>
                <li>
                  Use the website for fraudulent or unlawful purposes.
                </li>
                <li>
                  Misuse calculators, quotation tools, forms, or other services.
                </li>
              </ul>
            </div>

            {/* Website Information */}
            <div className="space-y-5">
              <h2 className="text-2xl font-semibold mb-4">
                3. Website Information
              </h2>
              <p className="mb-2">
                We make reasonable efforts to keep website information accurate and current. Product specifications,
                pricing, availability, offers, estimated savings, government schemes, subsidies, financing information, and other information may change. Website information should be treated as general information unless specifically confirmed in writing or through an approved quotation/agreement.

              </p>
            </div>

            {/* Calculators and Estimates */}
            <div className="space-y-5">
              <h2 className="text-2xl font-semibold mb-4">
                4. Calculators and Estimates
              </h2>
              <p className="mb-2">
                Calculators may provide estimates of solar requirements, savings, electricity-related values, EMI/financing,system pricing, and other information. Results are for informational purposes and are not guarantees. Actual outcomes may vary based on consumption, tariffs, solar conditions, roof/shading, equipment, installation conditions, policies, financing terms, and other project-specific factors.
              </p>

            </div>

            {/* Quotations and Pricing */}
            <div className="space-y-5">
              <h2 className="text-2xl font-semibold mb-4">
                5. Quotations and Pricing
              </h2>
              <p className="mb-2">
                Quotations are subject to the assumptions, validity period, and conditions stated in the quotation. Website prices may be indicative and may change due to product availability, supplier pricing, taxes, transportation,installation requirements, or other factors. A quotation does not automatically constitute a binding contract unless accepted and confirmed under Flarize&apos;s applicable process.
              </p>
            </div>

            {/* Products and Specifications */}
            <div className="space-y-5">
              <h2 className="text-2xl font-semibold mb-4">
                6. Products and Specifications
              </h2>
              <p className="mb-2">
                Product specifications, models, brands, availability, warranties, and performance characteristics may change because of manufacturer changes, model replacement, availability, technical requirements, supplier changes, or regulatory requirements.
              </p>
            </div>


            {/* Site Assessment and Technical Feasibility */}
            <div className="space-y-5">
              <h2 className="text-2xl font-semibold mb-4">
                7. Site Assessment and Technical Feasibility
              </h2>
              <p className="mb-2">
                Solar installation requirements may depend on roof condition, available area, structural suitability, electrical requirements, shading, capacity, access, installation conditions, and utility requirements. Final system design may change after site assessment.
              </p>
            </div>

            {/* Installation and Timelines */}
            <div className="space-y-5">
              <h2 className="text-2xl font-semibold mb-4">
                8. Installation and Timelines
              </h2>
              <p className="mb-2">
                Installation timelines are estimates unless expressly confirmed in writing. Project completion may depend on site readiness, product availability, weather, customer availability, technical requirements, permissions,KSEB/statutory processes, third parties, and unforeseen circumstances.
              </p>
            </div>

            {/* KSEB and Statutory Approvals */}
            <div className="space-y-5">
              <h2 className="text-2xl font-semibold mb-4">
                9. KSEB and Statutory Approvals
              </h2>
              <p className="mb-2">
                Projects may require approvals, inspections, documentation, or processes involving KSEB or other
                authorities. Responsibilities depend on the project and applicable agreement. Authority decisions and
                timelines are outside Flarize&apos;s direct control. Customers must provide accurate documents and information required for applicable processes.
              </p>
            </div>

            {/* Customer Responsibilities */}
            <div className="space-y-5">
              <h2 className="text-2xl font-semibold mb-4">
                10. Customer Responsibilities
              </h2>
              <p className="mb-2">
                Customers are responsible for providing accurate information/documents, providing reasonable property access, ensuring site accessibility, informing Flarize of relevant site restrictions, providing required approvals/permissions, making payments as agreed, following operating/maintenance instructions, and avoiding unauthorized system modifications.
              </p>
            </div>

            {/*  Payments and Financing */}
            <div className="space-y-5">
              <h2 className="text-2xl font-semibold mb-4">
                11. Payments and Financing
              </h2>
              <p className="mb-2">
                Payment terms are communicated through applicable quotations, invoices, orders, agreements, or other documents. Financing/EMI information displayed on the website may be informational. Financing approval,interest rates, loan amount, tenure, eligibility, documentation, and other conditions are determined by the relevant financing provider. Flarize does not guarantee financing approval.
              </p>
            </div>

            {/*  Government Subsidies and Benefits */}
            <div className="space-y-5">
              <h2 className="text-2xl font-semibold mb-4">
                12. Government Subsidies and Benefits
              </h2>
              <p className="mb-2">
                Subsidy, incentive, scheme, or benefit information may change according to government policies, eligibility,system specifications, application status, and other conditions. Eligibility and approval are subject to the relevant authority.
              </p>
            </div>

            {/*  Warranty */}
            <div className="space-y-5">
              <h2 className="text-2xl font-semibold mb-4">
                13. Warranty
              </h2>
              <p className="mb-2">
                Products and services may be subject to manufacturer, installation, service, or other warranty terms.
                Coverage differs by product, manufacturer, service, and applicable agreement. The specific warranty
                applicable to a customer is determined by the relevant documentation.
              </p>
            </div>

            {/*  Warranty Exclusions */}
            <div className="space-y-5">
              <h2 className="text-2xl font-semibold mb-4">
                14. Warranty Exclusions
              </h2>
              <p className="mb-2">
                Unless otherwise specified, warranty coverage may not apply to willful damage, misuse, unauthorized
                modification/repair, negligence, failure to follow instructions, external interference, natural disasters/force majeure, third-party damage, normal wear and tear, or other applicable exclusions.
              </p>
            </div>

            {/*  Service and Maintenance */}
            <div className="space-y-5">
              <h2 className="text-2xl font-semibold mb-4">
                15. Service and Maintenance
              </h2>
              <p className="mb-2">
                Where maintenance or service is included in a package or agreement, the applicable scope and frequency will be stated in the relevant quotation or service terms. Services not included may incur additional charges.
              </p>
            </div>

            {/*  Third-Party Services */}
            <div className="space-y-5">
              <h2 className="text-2xl font-semibold mb-4">
                16. Third-Party Services
              </h2>
              <p className="mb-2">
                The website may contain links, integrations, or references to third-party services such as communication,mapping, financing, payment, analytics, or other services. Third parties may have their own terms, policies,pricing, availability, and conditions.
              </p>
            </div>

            {/*  Intellectual Property*/}
            <div className="space-y-5">
              <h2 className="text-2xl font-semibold mb-4">
                17. Intellectual Property
              </h2>
              <p className="mb-2">
                Unless otherwise stated, website content including text, logos, branding, graphics, images, designs, layouts,software, calculators, and other materials are owned by or licensed to Flarize Technologies Private Limited.Reproduction, modification, distribution, publication, sale, or commercial exploitation without permission is prohibited except as permitted by law.
              </p>
            </div>

            {/*  User-Submitted Content */}
            <div className="space-y-5">
              <h2 className="text-2xl font-semibold mb-4">
                18. User-Submitted Content
              </h2>
              <p className="mb-2">
                Where users submit information, documents, reviews, feedback, or other content, they are responsible for accuracy and for having the right to provide it. Users must not submit unlawful, fraudulent, infringing,malicious, or unauthorized content.
              </p>
            </div>

            {/* Website Availability */}
            <div className="space-y-5">
              <h2 className="text-2xl font-semibold mb-4">
                19. Website Availability
              </h2>
              <p className="mb-2">
                We aim to keep the website available and functional but do not guarantee uninterrupted or error-free
                access. The website may be unavailable because of maintenance, updates, technical issues, network
                problems, third-party interruptions, security incidents, or events beyond our reasonable control.
              </p>
            </div>

            {/* Limitation of Liability */}
            <div className="space-y-5">
              <h2 className="text-2xl font-semibold mb-4">
                20. Limitation of Liability
              </h2>
              <p className="mb-2">
                To the extent permitted by applicable law, Flarize will not be responsible for losses arising solely from
                reliance on estimates/calculator results, changes in tariffs or government policies, subsidy changes,
                third-party interruptions, financing decisions, authority delays, events outside reasonable control, or
                inaccurate/incomplete information provided by users.Legal review required: Confirm the appropriate liability language and statutory limitations.
              </p>
            </div>

            {/* Force Majeure */}
            <div className="space-y-5">
              <h2 className="text-2xl font-semibold mb-4">
                21. Force Majeure
              </h2>
              <p className="mb-2">
                Flarize will not be responsible for delays or failures caused by circumstances beyond reasonable control,including natural disasters, severe weather, fire, flood, government restrictions, infrastructure failures,strikes/disruptions, war/civil unrest, epidemics/pandemics, major technical failures, supplier disruptions, or similar events.
              </p>
            </div>

            {/* Suspension or Termination */}
            <div className="space-y-5">
              <h2 className="text-2xl font-semibold mb-4">
                22. Suspension or Termination
              </h2>
              <p className="mb-2">
                Flarize may suspend or restrict website/service access where reasonably necessary because of Terms violations, misuse, suspected fraud, security risks, non-payment, or legal/authority requirements.
              </p>
            </div>

            {/* Changes to These Terms */}
            <div className="space-y-5">
              <h2 className="text-2xl font-semibold mb-4">
                23. Changes to These Terms
              </h2>
              <p className="mb-2">
                Flarize may update these Terms to reflect changes in services, website functionality, pricing/commercial practices, law, or operations. Updated Terms will be published with a revised Last Updated date.
              </p>
            </div>

            {/* Governing Law and Dispute Resolution */}
            <div className="space-y-5">
              <h2 className="text-2xl font-semibold mb-4">
                24. Governing Law and Dispute Resolution
              </h2>
              <p className="mb-2">
                These Terms are governed by the laws of India. Disputes will be handled in accordance with applicable Indian law and any dispute-resolution provisions in the applicable customer agreement, quotation, or contract.Legal review required: Confirm jurisdiction and dispute-resolution mechanism.
              </p>
            </div>

            {/* Severability */}
            <div className="space-y-5">
              <h2 className="text-2xl font-semibold mb-4">
                25. Severability
              </h2>
              <p className="mb-2">
                If any provision is invalid or unenforceable, the remaining provisions continue to apply to the extent
                permitted by law.
              </p>
            </div>

            {/* Entire Agreement */}
            <div className="space-y-5">
              <h2 className="text-2xl font-semibold mb-4">
                26. Entire Agreement
              </h2>
              <p className="mb-2">
                These Terms, together with applicable quotations, agreements, warranty/service terms, policies, and other documents, govern the relevant relationship. Where a specific written agreement or quotation conflicts with these Terms, the specific document may prevail to the extent expressly stated.
              </p>
            </div>

            {/* Contact Us */}
            <div className="space-y-5">
              <h2 className="text-2xl font-semibold mb-4">
                27. Contact Us
              </h2>
              <p className="mb-2">
                Flarize Technologies Private Limited
              </p>
              <p className="mb-2">
                1st Floor, Tharath Building
              </p>
              <p className="mb-2">
                Kalappura, Alappuzha – 688007
              </p>
              <p className="mb-2">
                Kerala, India
              </p>
              <p className="mb-2">
                Email: info@flarize.com
              </p>
              <p className="mb-2">
                Phone: +91 99950 83579
              </p>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
