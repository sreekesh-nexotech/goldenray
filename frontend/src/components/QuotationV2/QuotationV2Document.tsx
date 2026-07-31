"use client";

import { useEffect, useState } from "react";

import "./quotation-v2.css";
import { quotationV2FontVariables } from "./fonts";
import A4PageFrame from "./A4PageFrame";
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

/** Document page order as approved in the design prototype. */
const PAGES: { id: string; Content: React.ComponentType }[] = [
  { id: "01-cover", Content: Page01Cover },
  { id: "02-onam-fest", Content: Page02OnamFest },
  { id: "03-usage", Content: Page03Usage },
  { id: "04-why-flarize", Content: Page04WhyFlarize },
  { id: "05-options", Content: Page05Options },
  { id: "06-social-proof", Content: Page06SocialProof },
  { id: "07-tech-specs", Content: Page07TechSpecs },
  { id: "08-savings", Content: Page08Savings },
  { id: "09-journey", Content: Page09Journey },
  { id: "10-terms", Content: Page10Terms },
  { id: "11-terms-2", Content: Page11Terms2 },
  { id: "12-summary", Content: Page12Summary },
];

/**
 * The redesigned (v2) 12-page A4 quotation document, stacked vertically and
 * print-ready (one design page per A4 sheet via the browser's print dialog).
 *
 * Customer/pricing values are currently static sample data baked into the
 * page components, pending review of the static quote; they will be swapped
 * for backend-driven props afterwards.
 */
export default function QuotationV2Document() {
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
        {PAGES.map(({ id, Content }) => (
          <A4PageFrame key={id} pageId={id}>
            <Content />
          </A4PageFrame>
        ))}
      </div>
    </div>
  );
}
