"use client";

import { useEffect, useState } from "react";
import QuotationHeader from "./QuotationHeader";
import QuotationFooter from "./QuotationFooter";

interface QuotationPageWrapperProps {
  children: React.ReactNode;
  logo: string;
}

export default function QuotationPageWrapper({
  children,
  logo,
}: QuotationPageWrapperProps) {
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    const updateZoom = () => {
      const pageWidthPx = 793; // 210mm ≈ 793px
      const screenWidth = window.innerWidth;
      if (screenWidth < 820) {
        setZoomLevel(Math.min(1, (screenWidth - 16) / pageWidthPx));
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
      className="bg-white shadow-lg print:shadow-none flex flex-col print:break-after-page"
      style={{
        width: "210mm",
        minHeight: "297mm",
        maxHeight: "297mm",
        overflow: "hidden",
        padding: "8mm 10mm",
        zoom: zoomLevel,
      }}
    >
      {/* Header */}
      <QuotationHeader logo={logo} />

      {/* Page Content */}
      <div className="flex-grow flex flex-col">{children}</div>

      {/* Spacer to push footer to bottom */}
      <div className="flex-grow"></div>

      {/* Footer */}
      <QuotationFooter logo={logo} />
    </div>
  );
}
