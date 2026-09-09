import { Suspense } from "react";
import { Metadata } from "next";
import {
  SolarComparisonHero,
  SolarComparisonMain,
} from "@/components/SolarComparison";
import JsonLD from "@/components/JsonLD";
import { solarComparisonPageSchema } from "@/data/jsonld";
import { getAllPanels } from "@/services/solarPanelService";
import { SITE_URL } from "@/config";

// Revalidate the cached panel data hourly (ISR) — same window the panel
// service uses, so the ItemList markup never outlives the grid it describes.
export const revalidate = 3600;

// `absolute` opts out of the root layout's "%s | Flarize" template: the brand
// has no search volume yet, so appending it would push the title past Google's
// ~60-character cut without winning anything.
const TITLE = "Best Solar Panels for Kerala 2026 | Compare Specs & Ratings";
const DESCRIPTION =
  "Compare solar panels rated for Kerala's heat, humidity and monsoon. Filter by efficiency, warranty and brand, or answer 3 questions for a personal pick.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "best solar panel for Kerala",
    "best solar panel for Kerala climate",
    "solar panel comparison kerala",
    "compare solar panels",
    "temperature coefficient solar panel",
    "solar panel efficiency comparison",
    "solar panel warranty explained",
    "bifacial solar panels kerala",
    "waaree solar panels",
    "adani solar panels",
    "vikram solar panels",
    "kerala climate rated solar",
  ],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/solar-comparison`,
    siteName: "Flarize",
    images: [
      {
        url: "/heroImg.png",
        width: 1200,
        height: 630,
        alt: "Solar panel comparison for Kerala homes",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description:
      "Panels rated for Kerala heat, humidity and monsoon. Filter, compare, or take the 3-question selector.",
    images: ["/heroImg.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  // Filters, sort and selection are carried in the query string, so every
  // combination is a crawlable near-duplicate. The canonical is deliberately
  // parameter-free: it folds all of them back into one indexable URL.
  alternates: {
    canonical: `${SITE_URL}/solar-comparison`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default async function SolarComparisonPage() {
  // Fetched here rather than in the client island so the ItemList is in the
  // server-rendered HTML — structured data injected client-side is processed
  // on delay, if at all.
  const panels = await getAllPanels();

  return (
    <div className="min-h-screen bg-gray-50">
      <JsonLD data={solarComparisonPageSchema(panels)} />
      {/* Server-rendered, so the H1 and positioning copy are in the HTML — the
          island below renders client-side only. */}
      <SolarComparisonHero />
      <Suspense fallback={null}>
        <SolarComparisonMain />
      </Suspense>
    </div>
  );
}
