"use client";

import { useEffect, useState } from "react";

import "./quotation-v2.css";
import { quotationV2FontVariables } from "./fonts";
import A4PageFrame from "./A4PageFrame";
import type { QuotationV2Data } from "./quotationV2Data";
import Page01Cover from "./pages/Page01Cover";
import Page02OnamFest from "./pages/Page02OnamFest";
import Page03Usage from "./pages/Page03Usage";
import Page04WhyFlarize from "./pages/Page04WhyFlarize";
import Page05Options from "./pages/Page05Options";
import Page06SocialProof from "./pages/Page06SocialProof";
import Page07TechSpecs from "./pages/Page07TechSpecs";
import Page08Savings from "./pages/Page08Savings";
import Page09Journey from "./pages/Page09Journey";
import Page10Terms from "./pages/Page10Terms";
import Page11Terms2 from "./pages/Page11Terms2";
import Page12Summary from "./pages/Page12Summary";

interface PageEntry {
  id: string;
  /** Static pages ignore the argument; the rest read their figures from it. */
  render: (data: QuotationV2Data) => React.ReactNode;
}

/** Document page order as approved in the design prototype. */
const PAGES: PageEntry[] = [
  { id: "01-cover", render: (d) => <Page01Cover data={d} /> },
  { id: "02-onam-fest", render: () => <Page02OnamFest /> },
  { id: "03-usage", render: (d) => <Page03Usage data={d} /> },
  { id: "04-why-flarize", render: () => <Page04WhyFlarize /> },
  { id: "05-options", render: (d) => <Page05Options data={d} /> },
  { id: "06-social-proof", render: (d) => <Page06SocialProof data={d} /> },
  { id: "07-tech-specs", render: (d) => <Page07TechSpecs data={d} /> },
  { id: "08-savings", render: (d) => <Page08Savings data={d} /> },
  { id: "09-journey", render: (d) => <Page09Journey data={d} /> },
  { id: "10-terms", render: () => <Page10Terms /> },
  { id: "11-terms-2", render: () => <Page11Terms2 /> },
  { id: "12-summary", render: (d) => <Page12Summary data={d} /> },
];

/**
 * The 12 design pages in order, each already sized to its A4 sheet.
 *
 * Shared by the on-screen document and the PDF generator so both render
 * exactly the same markup from exactly the same data.
 */
export function QuotationV2Pages({
  data,
  renderFrame,
}: {
  data: QuotationV2Data;
  renderFrame: (page: {
    id: string;
    children: React.ReactNode;
  }) => React.ReactNode;
}) {
  return (
    <>{PAGES.map(({ id, render }) => renderFrame({ id, children: render(data) }))}</>
  );
}

/**
 * The redesigned (v2) 12-page A4 quotation document, stacked vertically and
 * print-ready (one design page per A4 sheet via the browser's print dialog).
 */
export default function QuotationV2Document({
  data,
}: {
  data: QuotationV2Data;
}) {
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    // Same small-screen behaviour as the v1 quotation: shrink whole sheets to
    // the viewport width instead of horizontal scrolling.
    const updateZoom = () => {
      const sheetWidthPx = 794; // 210mm ≈ 794px
      const screenWidth = window.innerWidth;
      if (screenWidth < 820) {
        setZoomLevel(Math.min(1, (screenWidth - 16) / sheetWidthPx));
      } else {
        setZoomLevel(1);
      }
    };
    updateZoom();
    window.addEventListener("resize", updateZoom);
    return () => window.removeEventListener("resize", updateZoom);
  }, []);

  return (
    <div
      className={`quotation-v2 min-h-screen bg-gray-100 print:bg-white ${quotationV2FontVariables}`}
    >
      <div
        className="qv2-zoom-wrap flex flex-col items-center py-4 gap-4 print:py-0 print:gap-0"
        style={{ zoom: zoomLevel }}
      >
        <QuotationV2Pages
          data={data}
          renderFrame={({ id, children }) => (
            <A4PageFrame key={id} pageId={id}>
              {children}
            </A4PageFrame>
          )}
        />
      </div>
    </div>
  );
}
