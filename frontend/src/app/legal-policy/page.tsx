import LegalHero from "@/components/LegalHero";
import { Metadata } from "next";
import { withCmsSeo } from "@/lib/cmsMetadata";
import CmsPageSchema from "@/components/CmsPageSchema";

const BASE_METADATA: Metadata = {
  title: "Legal Policy - Flarize Solar Energy Solutions",
  description:
    "Read Flarize's legal policy covering website usage, rights, responsibilities, and governing terms for our solar energy services.",
  openGraph: {
    title: "Legal Policy - Flarize",
    description:
      "Review Flarize's legal policy, website terms, and compliance information.",
    url: "https://flarize.com/legal-policy",
    siteName: "Flarize",
    images: [
      {
        url: "/heroImg.png",
        width: 1200,
        height: 630,
        alt: "Legal Policy",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Legal Policy - Flarize",
    description: "Review Flarize's legal policy and website usage terms.",
    images: ["/heroImg.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://flarize.com/legal-policy",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const generateMetadata = () => withCmsSeo("/legal-policy", BASE_METADATA);

export default function legalPolicy() {
  return (
    <>
      <CmsPageSchema route="/legal-policy" />
      <section>
        <LegalHero
          title="Legal Policy"
          effectiveDate="07-10-2026"
          lastUpdated="07-10-2026"
        />

        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 xl:px-36">
          <div className="space-y-10 text-gray-800">
            <div className="space-y-5">
              <h2 className="mb-4 text-2xl font-semibold">1. About Flarize</h2>
              <p>
                Flarize Technologies Private Limited operates the Flarize website and provides information and services related to solar energy solutions, including solar consultations, quotations, calculators, project-related
                services, warranty and support services, and other related offerings.
              </p>
              <p>
                Flarize Technologies Private Limited
              </p>
              <p>
                1st Floor, Tharath Building
              </p>
              <p>
                Kalappura, Alappuzha – 688007
              </p>
              <p>
                Kerala, India
              </p>
              <p>
                Email: info@flarize.com
              </p>
              <p>
                Phone: +91 99950 83579
              </p>
            </div>

            <div className="space-y-5">
              <h2 className="mb-4 text-2xl font-semibold">2. Information We Collect</h2>
              <p>
                The information we collect depends on how you interact with the Flarize website and services.
              </p>
            </div>

            <div className="space-y-5">
              <h2 className="mb-4 text-xl font-semibold">2.1. Information You Provide</h2>
              <p className="mb-2">Depending on the form or service, this may include:</p>
              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  Name, mobile number, email address, location or address-related information, and pincode.
                </li>
                <li>
                  Electricity consumption or electricity bill information.
                </li>
                <li>
                  Solar requirements, preferences, quotation or project information.
                </li>
                <li>
                  Information submitted through consultation, enquiry, Group Purchase, referral, warranty/service, or career forms.
                </li>
              </ul>
            </div>
            <div className="space-y-5">
              <h2 className="mb-4 text-xl font-semibold">2.2. Information Collected Automatically</h2>
              <p className="mb-2">When you visit the website, certain technical information may be collected through cookies, analytics tools,
                and similar technologies, including:
              </p>
              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  IP address, browser/device information, operating system, approximate location, pages visited, time spent,
                  referral/source information, website interactions, downloads, link clicks, video engagement, and website
                  searches.
                </li>
              </ul>
            </div>

            <div className="space-y-5">
              <h2 className="mb-4 text-2xl font-semibold">3. Information Collected Through Forms</h2>
              <p>
                Information submitted through applicable Flarize website forms may be stored in our backend systems. We
                use this information to respond to requests, provide services, process enquiries, communicate with users, and manage related business activities.
              </p>
            </div>

            <div className="space-y-5">
              <h2 className="mb-4 text-2xl font-semibold">4. Calculators and Interactive Tools</h2>
              <p>
                Calculator inputs are generally processed to provide the requested result and are not ordinarily stored in our
                database. Certain quotation-related information may be temporarily stored in the user&apos;s browser and
                transmitted to our server when required to generate a quotation or related output.
              </p>
            </div>

            <div className="space-y-5">
              <h2 className="mb-4 text-2xl font-semibold">5. How We Use Your Information</h2>
              <p>
                We may use information for:
              </p>
              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>Responding to enquiries and requests.</li>
                <li>Providing information about solar products and services and consultations.</li>
                <li>Preparing or processing quotations and understanding solar requirements.</li>
                <li>Processing Group Purchase or referral requests.</li>
                <li>Managing warranty and service requests.</li>
                <li>Processing job applications.</li>
                <li>Improving website performance, services, security, and user experience.</li>
                <li>Understanding website usage and measuring performance.</li>
                <li>Detecting/preventing misuse or fraud.</li>
                <li>Complying with applicable legal and regulatory requirements.</li>
                <li>Other purposes communicated at collection.</li>
              </ul>
            </div>

            <div className="space-y-5">
              <h2 className="mb-4 text-2xl font-semibold">6. Cookies and Analytics</h2>
              <p>
                Flarize uses cookies and similar technologies. We currently use Google Analytics 4 (GA4) and Google Tag
                Manager (GTM) for website analytics and measurement. See the Cookie Policy for details.
              </p>
            </div>

            <div className="space-y-5">
              <h2 className="mb-4 text-2xl font-semibold">9. Third-Party Services</h2>
              <p>
                Flarize may use third-party services including:
              </p>
              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>Twilio — communication and OTP functionality.</li>
                <li>Google Analytics / Google Tag Manager — analytics and tag management.</li>
                <li>Bunny CDN — content delivery.</li>
                <li>CARTO / OpenStreetMap — map functionality.</li>
                <li>YouTube — video/embedded media.</li>
                <li>WhatsApp — communication when a user chooses to use it.</li>
              </ul>
            </div>

            <div className="space-y-5">
              <h2 className="mb-4 text-2xl font-semibold">8. Storage and Retention</h2>
              <p>
                Information submitted through applicable forms may be stored in Flarize backend/database systems. Certain
                website functionality may use temporary browser storage.
                Currently, some form information may remain stored until manually deleted. Appropriate retention periods
                for different categories of information should be confirmed by the company and legal reviewer before
                publication.
              </p>
            </div>

            <div className="space-y-5">
              <h2 className="mb-4 text-2xl font-semibold">9. Data Security</h2>
              <p>
                We take reasonable technical and organizational measures to protect personal information against
                unauthorized access, misuse, loss, alteration, or disclosure. No electronic transmission or storage method
                can be guaranteed to be completely secure.
              </p>
            </div>

            <div className="space-y-5">
              <h2 className="mb-4 text-2xl font-semibold">10. Sharing of Personal Information</h2>
              <p>
                We may provide access to or share relevant information where necessary to provide services, respond to
                enquiries, operate our systems, use necessary third-party services, maintain security, comply with law,
                protect our rights, or prevent misuse. We do not intend to sell personal information as a commercial product.
              </p>
            </div>

            <div className="space-y-5">
              <h2 className="mb-4 text-2xl font-semibold">11. Your Privacy Rights</h2>
              <p>
                Subject to applicable law, you may have rights to request information about personal data processed about
                you, request correction or deletion where applicable, withdraw consent where consent is the basis for
                processing, raise a grievance, and exercise other rights available under applicable data-protection law.
              </p>
            </div>

            <div className="space-y-5">
              <h2 className="mb-4 text-2xl font-semibold">12. Withdrawal of Consent</h2>
              <p>
                Where processing is based on consent, you may have the right to withdraw consent subject to applicable
                law. Withdrawal does not affect processing already carried out lawfully before withdrawal.
              </p>
            </div>

            <div className="space-y-5">
              <h2 className="mb-4 text-2xl font-semibold">13. Children&apos;s Privacy</h2>
              <p>
                Our website and services are not intended to knowingly collect personal information from children except
                where permitted and handled in accordance with applicable law.
              </p>
            </div>

            <div className="space-y-5">
              <h2 className="mb-4 text-2xl font-semibold">14. Third-Party Websites</h2>
              <p>
                Flarize may link to third-party websites or services. Their privacy practices, security, and policies are
                governed by those third parties.
              </p>
            </div>

            <div className="space-y-5">
              <h2 className="mb-4 text-2xl font-semibold">15. International Data Processing</h2>
              <p>
                Some third-party providers may process information outside India. The applicable legal requirements and
                countries involved should be confirmed during legal review.
              </p>
            </div>

            <div className="space-y-5">
              <h2 className="mb-4 text-2xl font-semibold">16. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy to reflect changes in services, technology, data practices, or applicable
                laws. The Last Updated date will be revised when changes are made.
              </p>
            </div>

            <div className="space-y-5">
              <h2 className="mb-4 text-2xl font-semibold">17. Contact Us</h2>
              <p>
                Flarize Technologies Private Limited
              </p>
              <p>
                1st Floor, Tharath Building
              </p>
              <p>
                Kalappura, Alappuzha – 688007
              </p>
              <p>
                Kerala, India
              </p>
              <p>
                Email: info@flarize.com
              </p>
              <p>
                Phone: +91 99950 83579
              </p>
              <p>
                For privacy-related questions, concerns, or requests, contact us using the details above.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
