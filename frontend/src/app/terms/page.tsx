import LegalHero from "@/components/LegalHero";
import { Metadata } from "next";
import Link from "next/link";

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
          <p className="mb-4">
            Welcome to Flarize. operated by Flarize Technologies Private
            Limited. These Terms and Conditions (&quot;Terms&quot;) govern your
            access to and use of our website&nbsp;
            <Link
              href="https://www.flarize.com"
              className="text-blue-600 hover:underline"
            >
              www.flarize.com
            </Link>
            &nbsp;services, and products. By using our platform, you agree to
            comply with and be legally bound by these Terms.
          </p>

          {/* about */}
          <div className="space-y-5">
            <h2 className="text-2xl font-semibold mb-4">1. About Flarize</h2>
            <p className="mb-2">Flarize is a solar energy platform that:</p>

            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>
                Designs and sells complete solar power plant systems to
                residential and commercial users.
              </li>
              <li>
                Procures and delivers all solar hardware (panels, inverters,
                batteries, structures, etc.) directly to customers.
              </li>
              <li>
                Coordinates installation using Flarize-certified, trained, and
                onboarded vendor partners, ensuring consistent service quality.
              </li>
              <li>
                Facilitates solar financing through partnered NBFCs and banks.
              </li>
              <li>
                Provides after-sales service coordination and customer support.
              </li>
            </ul>
            <p>
              Flarize acts as the principal seller and service coordinator. It
              is not a marketplace or third-party listing platform.
            </p>
          </div>

          {/* vendoor installation */}
          <div className="space-y-5">
            <h2 className="text-2xl font-semibold mb-4">
              2. Certified Vendor Installation
            </h2>
            <p className="mb-2">
              Flarize ensures that your system is installed by a certified
              vendor partner, who is:
            </p>

            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Technically qualified and trained by Flarize.</li>
              <li>
                Onboarded through a structured evaluation and documentation
                process.
              </li>
              <li>
                Third-party service providers (e.g., payment gateways, SMS/email
                services) under NDA and data protection agreements
              </li>
              <li>
                Bound to follow Flarize&apos;s installation SOPs, safety
                protocols, and quality standards.
              </li>
            </ul>
            <p>
              Installation performance is continuously monitored, and complaints
              can be raised directly with Flarize.
            </p>
          </div>

          {/* ownership and warranty */}
          <div className="space-y-5">
            <h2 className="text-2xl font-semibold mb-4">
              3. Product Ownership and Warranty
            </h2>

            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>
                Flarize is the official seller and logistics provider for the
                entire solar system package.
              </li>
              <li>
                All hardware components are sourced from reputed manufacturers
                and come with OEM warranties (e.g., 25-year performance warranty
                on solar panels).
              </li>
              <li>
                Flarize does not manufacture components and is not liable for
                inherent product defects but will coordinate warranty claims on
                your behalf.
              </li>
              <li>Flarize provides a limited service warranty covering:</li>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Installation issues</li>
                <li>Operational support during the first year</li>
                <li>Optional AMC packages (Annual Maintenance Contracts)</li>
              </ul>
            </ul>
            <p>Delivery and Installation Terms:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>
                Upon delivery, the customer must verify and acknowledge all
                items.
              </li>
              <li>
                After delivery acknowledgment, the customer is responsible for
                safe storage until installation.
              </li>
              <li>
                Certified installers will re-verify materials before
                installation. Any damage after delivery will be addressed per
                Flarize’s service policy.
              </li>
              <li>
                The warranty period for all components begins on the date of
                installation.
              </li>
            </ul>
            <p>
              Customers must retain the installation report or completion
              certificate for future warranty claims.
            </p>
          </div>

          {/* referral */}
          <div className="space-y-5">
            <h2 className="text-2xl font-semibold mb-4">
              4. Referral & Affiliate Program
            </h2>
            <p className="mb-2">
              Flarize offers referral/affiliate programs for:
            </p>

            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Offline partners: electricians, contractors, retailers.</li>
              <li>Online partners: influencers, students, content creators.</li>
            </ul>
            <p className="mb-2">Terms:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Partners must be registered and approved.</li>
              <li>
                Commissions are paid only on confirmed projects with completed
                payments.
              </li>
              <li>
                Referrals found to be fraudulent, duplicate, or ineligible may
                be disqualified.
              </li>
            </ul>
            <p>
              Commissions are subject to applicable taxes (TDS/GST) and may be
              withheld if compliance is unmet.
            </p>
          </div>

          {/* data retention */}
          <div className="space-y-5">
            <h2 className="text-2xl font-semibold mb-4">
              5. Cancellation and Refund Policy
            </h2>
            <p className="mb-2">Site Visit / Booking Fees:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>
                A non-refundable fee of ₹500 is charged for the initial site
                visit.
              </li>
              <li>
                If the customer proceeds with the project, this amount is
                adjusted in the final invoice.
              </li>
            </ul>
            <p className="mb-2">
              Cancellation Before Dispatch or Installation:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>
                Full refunds (minus payment gateway charges) are allowed if
                cancelled within 48 hours of booking.
              </li>
            </ul>
            <p className="mb-2">
              Cancellation After Material Dispatch or Installation Start:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>
                No refund will be issued once materials are dispatched or
                installation has commenced.
              </li>
              <li>
                If financing is involved, cancellation must follow the lender’s
                terms.
              </li>
            </ul>
            <p>Loan Application Cancellations:</p>
            <p>
              If the customer cancels after the loan process has begun, a ₹1,000
              cancellation charge applies — even if the loan is rejected.
            </p>
          </div>

          {/* shipping and delivery */}
          <div className="space-y-5">
            <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>

            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>
                Flarize will arrange the shipment and delivery of all solar
                hardware (e.g., panels, inverters, batteries, structures)
                directly to the customer&apos;s site address as provided during
                the order confirmation.
              </li>
              <li>
                Products are typically dispatched within 5 to 14 working days
                after full payment or loan approval, depending on material
                availability and warehouse processing times.
              </li>
              <li>
                Customers must ensure that someone is available at the site to
                accept and verify the delivery. If the delivery is received by
                an authorized person on behalf of the customer, it will be
                treated as accepted.
              </li>
              <li>
                Upon delivery, the customer must inspect and confirm receipt of
                all items. Once acknowledged, Flarize is not liable for any
                loss, theft, or damage occurring at the customer’s end prior to
                installation.
              </li>
              <li>
                In case of missed delivery, incorrect address, or access issues,
                rescheduling may involve additional charges or delays.
              </li>
              <li>
                Delivery times may vary due to location, weather, public
                holidays, or other force majeure events. We will notify the
                customer of any delays as early as possible.
              </li>
              <li>
                For remote, hilly, or high-risk locations, additional delivery
                timelines and conditions may apply. Flarize reserves the right
                to decline or delay delivery in such cases, with prior notice.
              </li>
            </ul>
          </div>

          {/* financing  */}
          <div className="space-y-5">
            <h2 className="text-2xl font-semibold mb-4">
              7. Financing Facilitation
            </h2>
            <p className="mb-2">
              Flarize offers financing via partnered banks and NBFCs.
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>
                All approvals, EMI terms, and rejections are handled solely by
                the lender.
              </li>
              <li>
                Flarize is not liable for delays, rejections, or changes in
                lending terms.
              </li>
            </ul>
            <p>
              Customers must read and accept the lender’s terms and conditions
              before proceeding.
            </p>
          </div>

          {/* user responsibility  */}
          <div className="space-y-5">
            <h2 className="text-2xl font-semibold mb-4">
              8. User Responsibilities
            </h2>
            <p className="mb-2">By using Flarize, users agree to:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>
                Provide accurate and complete information for delivery,
                verification, and financing.
              </li>
              <li>Allow reasonable access to the installation site.</li>
              <li>Not misuse the affiliate system or platform.</li>
            </ul>
            <p>Raise service issues via the proper grievance channel.</p>
          </div>

          {/* limitations */}
          <div className="space-y-5">
            <h2 className="text-2xl font-semibold mb-4">
              9. Limitation of Liability
            </h2>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>
                Flarize is not liable for manufacturer defects or financing
                decisions.
              </li>
              <li>
                Our maximum liability is limited to the value of the service
                component paid by the customer.
              </li>
            </ul>
            <p className="mb-2">
              Flarize is not liable for indirect, incidental, or consequential
              damages, including delays due to force majeure events.
            </p>
          </div>

          {/* intelllectual property */}
          <div className="space-y-5">
            <h2 className="text-2xl font-semibold mb-4">
              10. Intellectual Property
            </h2>
            <p className="mb-2">
              All content, branding, design elements, software, and trademarks
              on &nbsp;
              <Link
                href="https://www.flarize.com"
                className="text-blue-600 hover:underline"
              >
                www.flarize.com
              </Link>
              &nbsp;are the exclusive property of Flarize Technologies Private
              Limited.
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>
                Unauthorized copying, distribution, or reuse is strictly
                prohibited.
              </li>
              <li>
                Violations may result in legal action under applicable laws.
              </li>
            </ul>
          </div>

          {/* payment */}
          <div className="space-y-5">
            <h2 className="text-2xl font-semibold mb-4">
              11. Payments & Pricing
            </h2>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>
                Prices displayed include/exclude taxes as mentioned per product
                or service.
              </li>
              <li>
                Payments are accepted through secure, third-party payment
                gateways.
              </li>
              <li>
                Flarize is not liable for payment processing delays or bank
                issues.
              </li>
            </ul>
            <p className="mb-2">
              In case of technical pricing errors, Flarize reserves the right to
              cancel or modify the order and issue a refund.
            </p>
          </div>

          {/* government law */}
          <div className="space-y-5">
            <h2 className="text-2xl font-semibold mb-4">
              12. Governing Law & Jurisdiction
            </h2>
            <p className="mb-2">
              These Terms are governed by the laws of India.Any disputes shall
              fall under the exclusive jurisdiction of courts in Alappuzha,
              Kerala
            </p>
          </div>

          {/* Grievance Redressal */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              13. Grievance Redressal
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

          {/* privacy policy */}
          <div className="space-y-5">
            <h2 className="text-2xl font-semibold mb-4">14. Privacy Policy</h2>
            <p className="mb-2">
              Please review our{" "}
              <Link href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>{" "}
              to understand how we collect, store, and protect your personal
              data in compliance with Indian data protection regulations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
