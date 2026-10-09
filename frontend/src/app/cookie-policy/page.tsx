import LegalHero from "@/components/LegalHero";
import { Metadata } from "next";
import { withCmsSeo } from "@/lib/cmsMetadata";
import CmsPageSchema from "@/components/CmsPageSchema";

const BASE_METADATA: Metadata = {
  title: "Cookie Policy - Flarize Solar Energy Solutions",
  description:
    "Learn how Flarize uses cookies and similar technologies on our website to improve your browsing experience and service delivery.",
  openGraph: {
    title: "Cookie Policy - Flarize",
    description:
      "Review Flarize's cookie policy and understand how we use cookies and tracking technologies.",
    url: "https://flarize.com/cookie-policy",
    siteName: "Flarize",
    images: [
      {
        url: "/heroImg.png",
        width: 1200,
        height: 630,
        alt: "Cookie Policy",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cookie Policy - Flarize",
    description: "Understand how Flarize uses cookies and tracking technologies.",
    images: ["/heroImg.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://flarize.com/cookie-policy",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const generateMetadata = () => withCmsSeo("/cookie-policy", BASE_METADATA);

export default function cookiePolicy() {
  return (
    <>
      <CmsPageSchema route="/cookie-policy" />
      <section>
        <LegalHero
          title="Cookie Policy"
          effectiveDate="07-10-2026"
          lastUpdated="07-10-2026"
        />

        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 xl:px-36">
          <div className="space-y-10 text-gray-800">
            <div className="space-y-5">
              <h2 className="mb-4 text-2xl font-semibold">1. What Are Cookies?</h2>
              <p>
                Cookies are small text files that websites may store on your device when you visit them. They can help a website remember information, recognize a browser, understand usage, and support functionality. Cookies may be first-party or third-party.
              </p>
            </div>

            <div className="space-y-5">
              <h2 className="mb-4 text-2xl font-semibold">2. Why Flarize Uses Cookies</h2>
              <p className="mb-2">Flarize uses cookies and similar technologies to understand website usage, measure traffic and
                performance, support functionality, improve user experience, measure embedded-content interactions, and support analytics/reporting.
              </p>
            </div>

            <div className="space-y-5">
              <h2 className="mb-4 text-2xl font-semibold">
                3. Types of Technologies Used
              </h2>
            </div>

            <div className="space-y-5">
              <h2 className="mb-4 text-xl font-semibold">
                3.1 Analytics Cookies
              </h2>
              <p className="mb-2">Flarize uses Google Analytics 4 (GA4) to understand website interactions, including page views, scrolls,outbound clicks, downloads, form interactions, video engagement, searches, device/browser information,approximate location, referral/source information, and time spent.</p>
            </div>

            <div className="space-y-5">
              <h2 className="mb-4 text-xl font-semibold">
                3.2 Third-Party Content
              </h2>
              <p className="mb-2">
                Some pages may contain YouTube content. When third-party content is loaded or interacted with, the
                provider may use cookies or similar technologies under its own policies.
              </p>
            </div>

            <div className="space-y-5">
              <h2 className="mb-4 text-xl font-semibold">3.3. Temporary Browser Storage</h2>
              <p>
                Flarize may use browser storage for certain functionality. For example, quotation-related information may be temporarily stored in the browser during use of quotation functionality.
              </p>
            </div>

            <div className="space-y-5">
              <h2 className="mb-4 text-2xl font-semibold">
                4. Cookies Currently Identified
              </h2>
              <p>
                Based on technical information provided by development:
              </p>
              <ul className="list-disc list-inside">
                <li>_ga — Google Analytics — supports analytics measurement and user distinction — approximately 2 years.</li>
                <li>_ga_GSXM0NLQ8W — Google Analytics — maintains analytics state for the relevant GA4 property —</li>
              </ul>
              <p>approximately 2 years.</p>
            </div>

            <div className="space-y-5">
              <h2 className="mb-4 text-2xl font-semibold">5. YouTube Cookies</h2>
              <p>
                Flarize may embed YouTube content. YouTube may process device/browser information, IP address, and content interactions when its content is loaded or used.
              </p>
            </div>

            <div className="space-y-5">
              <h2 className="mb-4 text-2xl font-semibold">6. Other Third-Party Services</h2>
              <p>
                Flarize uses third-party services including Twilio, Bunny CDN, CARTO/OpenStreetMap, Google Analytics/GTM,YouTube, and WhatsApp. Not every third-party service necessarily uses cookies; some may process technical information through other mechanisms.
              </p>
            </div>

            <div className="space-y-5">
              <h2 className="mb-4 text-2xl font-semibold">7. Managing Cookies</h2>
              <p>
                Users may be able to manage cookies through browser/device settings and any preference controls provided by Flarize. Disabling some cookies may affect website functionality. 
              </p>
            </div>

            <div className="space-y-5">
              <h2 className="mb-4 text-2xl font-semibold">8. Cookies and Personal Information</h2>
              <p>
                Cookies and similar technologies may collect information that can be associated with an individual. Where such information constitutes personal data under applicable law, Flarize will handle it in accordance with its Privacy Policy and applicable requirements.
              </p>
            </div>

            <div className="space-y-5">
              <h2 className="mb-4 text-2xl font-semibold">9. Changes to This Cookie Policy</h2>
              <p>
                We may update this Cookie Policy to reflect changes to the website, cookies, tracking technologies, third-party services, business practices, or applicable laws.
              </p>
            </div>

            <div className="space-y-5">
              <h2 className="mb-4 text-2xl font-semibold">9. Changes to This Cookie Policy</h2>
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
          </div>
        </div>
      </section>
    </>
  );
}
