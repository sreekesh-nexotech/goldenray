"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import QuotationHeader from "./QuotationHeader";
import QuotationFooter from "./QuotationFooter";
import Page1Content from "./Page1Content";
import Page2Content from "./Page2Content";
import Page9Content from "./Page9Content";
import Page4Content from "./Page4Content";
import Page7Content from "./Page7Content";
import Page3Content from "./Page3Content";
import Page6Content from "./Page6Content";
import Page10Content from "./Page10Content";
import Page10_1Content from "./Page10_1Content";
import Page11Content from "./Page11Content";
import Page8Content from "./Page8Content";
import type { QuotationBom } from "@/services/bomService";

export interface QuotationPdfData {
  customerName: string;
  address: string;
  phoneNumber: string;
  pincode: string;
  monthlyBill: number | "";
  systemSize: string;
  systemPrice: number;
  emiPerMonth: number;
  graphData: {
    labels: string[];
    datasets: {
      data: number[];
    }[];
  };
  bom?: QuotationBom;
}

interface QuotationPdfGeneratorProps {
  data: QuotationPdfData;
  onComplete: () => void;
  onError: (error: string) => void;
}

export default function QuotationPdfGenerator({
  data,
  onComplete,
  onError,
}: QuotationPdfGeneratorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRendered, setIsRendered] = useState(false);

  const logo =
    "https://gym-manager-pull.b-cdn.net/golden_ray/home/logo_header.png";
  const heroImage =
    "https://golden-ray.b-cdn.net/Residential%20Solar%20Solutions/Project4/belowsectionimageENHANCED.jpg";

  const currentDate = new Date();
  const validUntilDate = new Date(currentDate);
  validUntilDate.setMonth(validUntilDate.getMonth() + 1);

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const random = String(Math.floor(Math.random() * 999)).padStart(3, "0");
  const quoteNo = `QUO-GR-AS-${year}-${month}-${random}`;

  const proposalBy = data.bom?.salesPerson || "Golden Ray Team";
  const gstNo = "32AAUFG1464A1ZP";
  const companyRegistration = data.systemSize;

  // Wait for images to load after render
  useEffect(() => {
    if (!containerRef.current) return;

    const timer = setTimeout(() => {
      setIsRendered(true);
    }, 2000); // Give 2s for images and fonts to load

    return () => clearTimeout(timer);
  }, []);

  const generatePdf = useCallback(async () => {
    if (!containerRef.current) {
      onError("Failed to render quotation pages.");
      return;
    }

    try {
      const pages = containerRef.current.querySelectorAll("[data-pdf-page]");
      if (pages.length === 0) {
        onError("No pages found to generate PDF.");
        return;
      }

      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import("jspdf"),
        import("html2canvas-pro"),
      ]);

      // A4 dimensions in mm
      const pdfWidth = 210;
      const pdfHeight = 297;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i] as HTMLElement;

        const canvas = await html2canvas(page, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          logging: false,
          width: page.scrollWidth,
          height: page.scrollHeight,
        });

        const imgData = canvas.toDataURL("image/jpeg", 0.95);
        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;

        if (i > 0) {
          pdf.addPage();
        }

        pdf.addImage(
          imgData,
          "JPEG",
          0,
          0,
          imgWidth,
          Math.min(imgHeight, pdfHeight),
        );
      }

      const pdfBlob = pdf.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, "_blank");
      onComplete();
    } catch (err) {
      console.error("PDF generation error:", err);
      onError("Failed to generate PDF. Please try again.");
    }
  }, [onComplete, onError]);

  // Trigger PDF generation once rendered
  useEffect(() => {
    if (isRendered) {
      generatePdf();
    }
  }, [isRendered, generatePdf]);

  const PageShell = ({ children }: { children: React.ReactNode }) => (
    <div
      data-pdf-page
      className="bg-white flex flex-col"
      style={{
        width: "210mm",
        minHeight: "297mm",
        maxHeight: "297mm",
        overflow: "hidden",
        padding: "8mm 10mm",
      }}
    >
      <QuotationHeader logo={logo} />
      <div className="flex-grow flex flex-col">{children}</div>
      <div className="flex-grow"></div>
      <QuotationFooter logo={logo} />
    </div>
  );

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        left: "-9999px",
        top: 0,
        zIndex: -1,
        pointerEvents: "none",
      }}
    >
      <PageShell>
        <Page1Content
          quotationData={data}
          quoteNo={quoteNo}
          currentDate={formatDate(currentDate)}
          validUntilDate={formatDate(validUntilDate)}
          proposalBy={proposalBy}
          gstNo={gstNo}
          companyRegistration={companyRegistration}
          heroImage={heroImage}
        />
      </PageShell>

      <PageShell>
        <Page2Content
          monthlyBill={data.monthlyBill}
          systemSize={data.systemSize}
        />
      </PageShell>

      <PageShell>
        <Page3Content />
      </PageShell>

      <PageShell>
        <Page4Content />
      </PageShell>

      <PageShell>
        <Page6Content />
      </PageShell>

      <PageShell>
        <Page7Content
          systemPrice={data.systemPrice}
          systemSize={data.systemSize}
        />
      </PageShell>

      <PageShell>
        <Page8Content
          monthlyBill={data.monthlyBill}
          graphData={data.graphData}
        />
      </PageShell>

      <PageShell>
        <Page9Content />
      </PageShell>

      <PageShell>
        <Page10Content />
      </PageShell>

      <PageShell>
        <Page10_1Content />
      </PageShell>

      <PageShell>
        <Page11Content
          monthlyBill={data.monthlyBill}
          systemPrice={data.systemPrice}
          emiPerMonth={data.emiPerMonth}
        />
      </PageShell>
    </div>
  );
}
