import Main from "@/components/Home/home";
import { Metadata } from "next";
import { withCmsSeo } from "@/lib/cmsMetadata";
import CmsPageSchema from "@/components/CmsPageSchema";

import JsonLD from "@/components/JsonLD";
import { localBusinessSchema, organizationSchema, faqSchema, breadcrumbSchema } from "@/data/jsonld";

// Semrush audit (SEO-Implementation-Report-Semrush-Audit.md): the page's head
// term is "solar panel installation in Kerala" and it leads the title. The
// string already carries the brand, so `absolute` opts out of the root
// layout's "%s | Flarize" template rather than appending it a second time.
const TITLE = "Solar Panel Installation in Kerala | KSEB Approved | Flarize";
const DESCRIPTION =
  "Solar panel installation in Kerala for homes and businesses. Flarize handles KSEB approvals, PM Surya Ghar subsidy and net metering for long-term savings.";

const BASE_METADATA: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "solar panel installation in kerala",
    "kerala solar panel",
    "solar installation kerala",
    "solar panel kerala",
    "solar panel in kerala",
    "solar power system for home kerala",
    "solar panel price in kerala",
    "rooftop solar kerala",
    "on grid solar system kerala",
    "off grid solar kerala",
    "best solar company in kerala",
  ],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://flarize.com",
    siteName: "Flarize",
    images: [
      {
        url: "/heroImg.png",
        width: 1200,
        height: 630,
        alt: "Flarize Solar Solutions",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/heroImg.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://flarize.com",
  },
  robots: {
    index: true,
    follow: true,
  },
};


// The Studio's SEO block for / (§6.2) overrides title, description,
// canonical and indexing; anything left blank there keeps the shipped value.
export const generateMetadata = () => withCmsSeo("/", BASE_METADATA);
export default function Home() {
  return (
    <>
      <CmsPageSchema route="/" />
      <>
        <JsonLD data={localBusinessSchema} />
        <JsonLD data={organizationSchema} />
        <JsonLD data={faqSchema} />
        <JsonLD data={breadcrumbSchema} />
        <section>
          <Main />
        </section>
      </>
    </>
  );
}
