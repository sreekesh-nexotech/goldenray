import LegalHero from "@/components/LegalHero";
import { Metadata } from "next";
import Link from "next/link";

// Metadata
export const metadata: Metadata = {
  title: "Privacy Policy - Flarize Solar Energy Solutions",
  description:
    "Read Flarize's privacy policy to understand how we collect, use, and protect your personal information when you use our solar energy services.",
  openGraph: {
    title: "Privacy Policy - Flarize",
    description:
      "Learn about how Flarize protects your privacy and handles your personal information.",
    url: "https://flarize.com/privacy",
    siteName: "Flarize",
    images: [
      { url: "/heroImg.png", width: 1200, height: 630, alt: "Privacy Policy" },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy - Flarize",
    description:
      "Learn about how we protect your privacy and personal information.",
    images: ["/heroImg.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://www.flarize.com/privacy",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function privacy() {
  return (
    <section>
      {/* legal page heading  */}
      <LegalHero
        title="Privacy Policy"
        effectiveDate=" 27-04-2025"
        lastUpdated="27-04-2025"
      />

      {/* content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-36  py-8">
        <div className="text-gray-800 space-y-10">
          <p className="mb-4">
            Welcome to Flarize. This Privacy Policy explains how Flarize
            Technologies Private Limited (&quot;Flarize&quot;, &quot;we&quot;,
            &quot;us&quot;, or &quot;our&quot;) collects, uses, shares, and
            protects your personal information when you access or use our
            website&nbsp;
            <Link
              href="https://www.flarize.com"
              className="text-blue-600 hover:underline"
            >
              www.flarize.com
            </Link>
            , services, and products.
          </p>
          <p className="mb-8">
            By using our platform, you agree to the terms of this Privacy
            Policy.
          </p>

          {/* collect info */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              1. Information We Collect
            </h2>
            <p className="mb-2">
              We may collect the following categories of information:
            </p>

            <div>
              <h3 className="text-xl font-medium mb-2">
                a) Personal Information
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Full name</li>
                <li>Email address</li>
                <li>Contact number</li>
                <li>Address (for delivery, site visits, or installation)</li>
                <li>Date of birth (for KYC/loan processing)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">
                b) Financial/KYC Information
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  PAN, Aadhaar, or other identity documents (when applying for
                  financing)
                </li>
                <li>Loan-related documents</li>
                <li>
                  Bank account details (only if required by the financing
                  partner)
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">
                c) Technical Information
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>IP address</li>
                <li>Browser/device type</li>
                <li>Referring URL</li>
                <li>Location (based on IP or permission-based GPS)</li>
                <li>Usage data and session behavior</li>
              </ul>
            </div>
          </div>

          {/* use info */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              2. How We Use Your Information
            </h2>
            <p className="mb-2">
              We use the collected data for the following purposes:
            </p>

            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>To register, verify, and manage your account</li>
              <li>To process bookings and coordinate delivery/installation</li>
              <li>
                To facilitate loan applications through our NBFC/bank partners
              </li>
              <li>
                To send confirmations, updates, and service-related
                communication
              </li>
              <li>To provide after-sales support and customer service</li>
              <li>To improve our website, user experience, and offerings</li>
              <li>To comply with legal, regulatory, or tax obligations</li>
            </ul>
          </div>

          {/* share info */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              3. Sharing of Information
            </h2>
            <p className="mb-2">
              We do not sell or rent your personal data. However, we may share
              your information with:
            </p>

            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>
                Certified vendor partners for installation and delivery
                coordination
              </li>
              <li>
                Banking and NBFC partners for financing (only with your consent)
              </li>
              <li>
                Third-party service providers (e.g., payment gateways, SMS/email
                services) under NDA and data protection agreements
              </li>
              <li>
                Government or regulatory authorities, as required under
                applicable law
              </li>
              <li>Logistics partners for fulfilling product delivery</li>
            </ul>
            <p>
              All such parties are expected to maintain confidentiality and
              process your data in accordance with this Policy and applicable
              law.
            </p>
          </div>

          {/* cookies */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              4. Cookies and Tracking Technologies
            </h2>
            <p className="mb-2">
              We use cookies and other similar technologies to:
            </p>

            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Remember your preferences and settings</li>
              <li>Track website usage and analytics</li>
              <li>Improve performance and user experience</li>
            </ul>
            <p>
              You may modify your browser settings to disable cookies. However,
              this may impact your ability to access certain features of the
              website.
            </p>
          </div>

          {/* data security */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
            <p className="mb-2">
              We take appropriate security measures to protect your personal
              data, including:
            </p>

            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Encrypted storage and transmission using SSL</li>
              <li>Access control and limited permissions</li>
              <li>Regular security reviews and updates</li>
              <li>Secure servers and firewall protection</li>
            </ul>
            <p>
              Despite our efforts, no system is 100% secure. We encourage you to
              use strong passwords and protect your login credentials.
            </p>
          </div>

          {/* data retention */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">6. Data Retention</h2>
            <p className="mb-2">We retain your personal information:</p>

            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>For as long as necessary to provide services and support</li>
              <li>
                To comply with applicable laws (e.g., tax, accounting, KYC)
              </li>
              <li>
                Or until you request deletion (unless retention is required by
                law)
              </li>
            </ul>
          </div>

          {/* your rights */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">7. Your Rights</h2>
            <p className="mb-2">As a user, you have the right to:</p>

            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Access, update, or correct your personal data</li>
              <li>Withdraw consent for data use (where applicable)</li>
              <li>Request deletion of your data</li>
              <li>File a grievance with our designated officer</li>
            </ul>
            <p>
              Please note that some requests may affect our ability to deliver
              services.
            </p>
          </div>

          {/* childrens privacy */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              8. Children&apos;s Privacy
            </h2>
            <p className="mb-2">
              Flarize is not intended for children under the age of 18. We do
              not knowingly collect personal data from minors. If we become
              aware of such data, we will delete it promptly.
            </p>
          </div>

          {/* third party  */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              9. Third-Party Links
            </h2>
            <p className="mb-2">
              Our platform may contain links to third-party websites or
              services. We are not responsible for the privacy practices or
              content of such third-party sites. Please read their privacy
              policies separately.
            </p>
          </div>

          {/* changes to this policy */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              10. Changes to This Policy
            </h2>
            <p className="mb-2">
              We may update this Privacy Policy from time to time. When we do,
              the &quot;Last Updated&quot; date at the top will be revised. You
              are advised to review the policy periodically for any changes.
            </p>
          </div>

          {/* Grievance Redressal */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              11. Grievance Redressal
            </h2>
            <p className="mb-2">
              In accordance with the Information Technology Act, 2000 and the IT
              Rules, 2021, the following officer is designated for grievance
              handling:
              <br />
              Grievance Officer
            </p>
            <p className="ml-2">
              Name: [Insert Full Name]
              <br />
              Email:{" "}
              <Link
                href="mailto:grievance@flarize.com"
                className="text-blue-600 hover:underline"
              >
                grievance@flarize.com
              </Link>
              <br />
              Phone: [Insert Mobile Number]
              <br />
              Response Time: Within 15 business days
            </p>
          </div>

          {/* governing law */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">12. Governing Law</h2>
            <p className="mb-2">
              This Privacy Policy is governed by the laws of India. All disputes
              shall be subject to the jurisdiction of the competent courts in
              Alappuzha, Kerala.
            </p>
          </div>

          {/* contact */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">13. Contact Us</h2>
            <p className="mb-2">
              For questions or feedback about this Privacy Policy, please
              contact us at:
            </p>
            <p>
              📧{" "}
              <Link
                href="mailto:support@flarize.com"
                className="text-blue-600 hover:underline"
              >
                support@flarize.com
              </Link>
              <br />
              📞 [Insert Support Phone Number]
            </p>
          </div>

          {/* Consent Clause */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Consent Clause</h2>
            <p className="mb-2">
              I agree to the{" "}
              <Link href="/terms" className="text-blue-600 hover:underline">
                Terms & Conditions
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
              , and consent to Flarize contacting me via phone, email, or
              WhatsApp for project-related communication, including financing
              and support.
            </p>
          </div>

          {/* Consent Clause */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Consent Clause</h2>
            <p>
              By submitting this form, I confirm that the information provided
              is accurate and I consent to Flarize Technologies Private Limited
              collecting, storing, and processing my personal and financial
              information for the purposes of project execution, loan
              facilitation, and service coordination.
            </p>
            <br />
            <p>
              I authorize Flarize and its partners (vendors, NBFCs, banks, etc.)
              to contact me via phone, SMS, email, or WhatsApp for verification,
              updates, and related communication.
            </p>
            <br />
            <p className="mb-2">
              I have read and agreed to the{" "}
              <Link href="/terms" className="text-blue-600 hover:underline">
                Terms & Conditions
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
              , I understand that I can withdraw my consent at any time by
              contacting{" "}
              <Link
                href="mailto:grievance@flarize.com"
                className="text-blue-600 hover:underline"
              >
                grievance@flarize.com
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
