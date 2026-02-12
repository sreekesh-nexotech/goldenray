"use client";

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
  return (
    <div
      className="bg-white shadow-lg print:shadow-none flex flex-col print:break-after-page"
      style={{
        width: "210mm",
        minHeight: "297mm",
        maxHeight: "297mm",
        overflow: "hidden",
        padding: "8mm 10mm",
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
