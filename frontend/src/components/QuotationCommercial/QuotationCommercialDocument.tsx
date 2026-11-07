"use client";

import { useEffect, useState } from "react";

import "@/components/QuotationV2/quotation-v2.css";
import "./quotation-commercial.css";
import A4PageFrame from "@/components/QuotationV2/A4PageFrame";
import { COMMERCIAL_COPY, type CommercialCopy, type CommercialLanguage } from "./copy";
import { quotationCommercialFontVariables } from "./fonts";
import type { CommercialData } from "./pages/types";
import CoverPage from "./pages/CoverPage";
import JourneyPage from "./pages/JourneyPage";
import OptionsPage from "./pages/OptionsPage";
import SavingsPage from "./pages/SavingsPage";
import SpecsPage from "./pages/SpecsPage";
import SummaryPage from "./pages/SummaryPage";
import { TermsPageOne, TermsPageTwo } from "./pages/TermsPages";
import WhyPage from "./pages/WhyPage";

interface PageProps {
  data: CommercialData;
  copy: CommercialCopy;
  language: CommercialLanguage;
}

interface PageEntry {
  /** The residential id where the page has a counterpart, so `pageSets` applies to both. */
  id: string;
  render: (props: PageProps) => React.ReactNode;
}

/**
 * The nine design pages, on-grid and hybrid alike: a hybrid quote differs only
 * in its options and specification pages and in the summary, which read
 * `data.hybrid` as the residential pages do.
 */
const PAGES: PageEntry[] = [
  { id: "01-cover", render: (p) => <CoverPage {...p} /> },
  { id: "04-why-flarize", render: (p) => <WhyPage {...p} /> },
  { id: "05-options", render: (p) => <OptionsPage {...p} /> },
  { id: "07-tech-specs", render: (p) => <SpecsPage {...p} /> },
  { id: "08-savings", render: (p) => <SavingsPage {...p} /> },
  { id: "09-journey", render: (p) => <JourneyPage {...p} /> },
  { id: "10-terms", render: (p) => <TermsPageOne {...p} /> },
  { id: "11-terms-2", render: (p) => <TermsPageTwo {...p} /> },
  { id: "12-summary", render: (p) => <SummaryPage {...p} /> },
];

/**
 * The commercial A4 quotation, in English or Malayalam: one set of pages, with
 * the words from `copy.ts` and the figures from the residential data builders.
 */
export default function QuotationCommercialDocument({
  data,
  language,
  pageIds,
}: {
  data: CommercialData;
  language: CommercialLanguage;
  /** Only these pages (the accounting copy); the full document when omitted. */
  pageIds?: readonly string[];
}) {
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    // Same small-screen behaviour as the residential documents.
    const updateZoom = () => {
      const sheetWidthPx = 794; // 210mm ≈ 794px
      const screenWidth = window.innerWidth;
      setZoomLevel(screenWidth < 820 ? Math.min(1, (screenWidth - 16) / sheetWidthPx) : 1);
    };
    updateZoom();
    window.addEventListener("resize", updateZoom);
    return () => window.removeEventListener("resize", updateZoom);
  }, []);

  const pages = pageIds ? PAGES.filter(({ id }) => pageIds.includes(id)) : PAGES;
  const copy = COMMERCIAL_COPY[language];
  const malayalam = language === "Malayalam" ? "quotation-commercial-ml" : "";

  return (
    <div
      className={`quotation-v2 ${malayalam} min-h-screen bg-gray-100 print:bg-white ${quotationCommercialFontVariables}`}
    >
      <div
        className="qv2-zoom-wrap flex flex-col items-center py-4 gap-4 print:py-0 print:gap-0"
        style={{ zoom: zoomLevel }}
      >
        {pages.map(({ id, render }) => (
          <A4PageFrame key={id} pageId={id}>
            {render({ data, copy, language })}
          </A4PageFrame>
        ))}
      </div>
    </div>
  );
}
