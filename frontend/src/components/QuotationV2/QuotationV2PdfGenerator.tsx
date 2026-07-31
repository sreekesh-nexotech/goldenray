"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import "./quotation-v2.css";
import { quotationV2FontVariables } from "./fonts";
import { QuotationV2Pages } from "./QuotationV2Document";
import {
  buildQuotationV2Data,
  generateQuoteNo,
  resolveInstallationStats,
  type QuotationV2Data,
  type QuotationV2Input,
} from "./quotationV2Data";

/**
 * Renders the v2 quotation off-screen and rasterises it into a downloaded PDF.
 *
 * The pages are captured at their authored 1440×2038 size rather than through
 * the `.qv2-canvas` scale transform the on-screen document uses: html2canvas
 * reads layout boxes, not transforms, so capturing the untransformed page and
 * letting jsPDF do the A4 fitting is what keeps the output sharp and correctly
 * positioned.
 */

/** Authored size of one design page. */
const PAGE_W = 1440;
const PAGE_H = 2038;

/** A4 in millimetres. */
const PDF_W = 210;
const PDF_H = 297;

/**
 * Capture scale. 1440 × 1.1 ≈ 1584px across a 210mm sheet ≈ 190dpi, matching
 * what the v1 generator produces.
 */
const CAPTURE_SCALE = 1.1;

interface QuotationV2PdfGeneratorProps {
  data: QuotationV2Input;
  onComplete: () => void;
  onError: (error: string) => void;
}

/** Safe-for-filesystem version of the customer's name. */
function fileNameFor(data: QuotationV2Data): string {
  const name = data.customerName.trim().replace(/[^a-zA-Z0-9]+/g, "-");
  return `Flarize-Quotation-${name || "Customer"}-${data.quoteNo}.pdf`;
}

export default function QuotationV2PdfGenerator({
  data,
  onComplete,
  onError,
}: QuotationV2PdfGeneratorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [built, setBuilt] = useState<QuotationV2Data | null>(null);
  const [isRendered, setIsRendered] = useState(false);
  // A PDF must only ever be produced once per mount, even if React re-runs the
  // effect (StrictMode double-invokes effects in development).
  const startedRef = useRef(false);

  // Resolve the neighbourhood install counts before rendering, so the PDF
  // never captures the pincode fallbacks while the request is still in flight.
  useEffect(() => {
    let cancelled = false;
    const quoteNo = generateQuoteNo();
    const base = buildQuotationV2Data(data, { quoteNo });

    resolveInstallationStats(base.pincode, base.stats).then((stats) => {
      if (cancelled) return;
      setBuilt(buildQuotationV2Data(data, { quoteNo, stats }));
    });

    return () => {
      cancelled = true;
    };
  }, [data]);

  // Wait for webfonts and images once the pages are in the DOM. Fonts must be
  // ready before rasterising or the capture bakes in fallback glyphs.
  useEffect(() => {
    if (!built || !containerRef.current) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    fontsReady.then(() => {
      if (cancelled) return;
      timer = setTimeout(() => setIsRendered(true), 2000); // images
    });

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [built]);

  const generatePdf = useCallback(async () => {
    const container = containerRef.current;
    if (!container || !built) {
      onError("Failed to render quotation pages.");
      return;
    }

    try {
      const pages = container.querySelectorAll<HTMLElement>("[data-pdf-page]");
      if (pages.length === 0) {
        onError("No pages found to generate PDF.");
        return;
      }

      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import("jspdf"),
        import("html2canvas-pro"),
      ]);

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      for (let i = 0; i < pages.length; i++) {
        const canvas = await html2canvas(pages[i], {
          scale: CAPTURE_SCALE,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          logging: false,
          width: PAGE_W,
          height: PAGE_H,
          windowWidth: PAGE_W,
          windowHeight: PAGE_H,
        });

        if (i > 0) pdf.addPage();
        // The design page and A4 share an aspect ratio, so the capture fills
        // the sheet exactly — no letterboxing and no overflow onto a 13th page.
        pdf.addImage(
          canvas.toDataURL("image/jpeg", 0.95),
          "JPEG",
          0,
          0,
          PDF_W,
          PDF_H,
        );
      }

      pdf.save(fileNameFor(built));
      onComplete();
    } catch (err) {
      console.error("PDF generation error:", err);
      onError("Failed to generate PDF. Please try again.");
    }
  }, [built, onComplete, onError]);

  useEffect(() => {
    if (!isRendered || startedRef.current) return;
    startedRef.current = true;
    generatePdf();
  }, [isRendered, generatePdf]);

  if (!built) return null;

  return (
    <div
      ref={containerRef}
      className={`quotation-v2 ${quotationV2FontVariables}`}
      style={{
        position: "fixed",
        left: "-99999px",
        top: 0,
        zIndex: -1,
        pointerEvents: "none",
      }}
    >
      <QuotationV2Pages
        data={built}
        renderFrame={({ id, children }) => (
          <div
            key={id}
            data-pdf-page
            data-page={id}
            style={{
              width: PAGE_W,
              height: PAGE_H,
              overflow: "hidden",
              backgroundColor: "#ffffff",
            }}
          >
            {children}
          </div>
        )}
      />
    </div>
  );
}
