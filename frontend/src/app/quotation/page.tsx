"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  QuotationPageWrapper,
  Page1Content,
  Page2Content,
  Page9Content,
  Page4Content,
  Page4_1Content,
  Page7Content,
  Page3Content,
  Page6Content,
  Page10Content,
  Page10_1Content,
  Page11Content,
  Page8Content,
} from "@/components/Quotation";
import type { QuotationBom } from "@/services/bomService";

interface QuotationData {
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

export default function QuotationPage() {
  const router = useRouter();
  const [quotationData, setQuotationData] = useState<QuotationData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [quoteNo, setQuoteNo] = useState("");

  // Static data
  const currentDate = new Date();
  const validUntilDate = new Date(currentDate);
  validUntilDate.setMonth(validUntilDate.getMonth() + 1);

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const gstNo = "32AAUFG1464A1ZP";

  const logo =
    "https://gym-manager-pull.b-cdn.net/golden_ray/home/logo_header.png";
  const heroImage =
    "https://golden-ray.b-cdn.net/Residential%20Solar%20Solutions/Project4/belowsectionimageENHANCED.jpg";

  useEffect(() => {
    // Generate quote number once on mount
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const random = String(Math.floor(Math.random() * 999)).padStart(3, "0");
    setQuoteNo(`QUO-GR-AS-${year}-${month}-${random}`);

    // Get data from sessionStorage
    const storedData = sessionStorage.getItem("quotationData");
    if (storedData) {
      setQuotationData(JSON.parse(storedData));
    } else {
      // Redirect back if no data
      router.push("/");
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#123532]"></div>
      </div>
    );
  }

  if (!quotationData) {
    return null;
  }

  const proposalBy = quotationData.bom?.salesPerson || "Golden Ray Team";
  const companyRegistration = quotationData.systemSize;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-4 gap-4 print:py-0 print:gap-0 print:bg-white">
      {/* Page 1 */}
      <QuotationPageWrapper logo={logo}>
        <Page1Content
          quotationData={quotationData}
          quoteNo={quoteNo}
          currentDate={formatDate(currentDate)}
          validUntilDate={formatDate(validUntilDate)}
          proposalBy={proposalBy}
          gstNo={gstNo}
          companyRegistration={companyRegistration}
          heroImage={heroImage}
        />
      </QuotationPageWrapper>

      {/* Page 2 */}
      <QuotationPageWrapper logo={logo}>
        <Page2Content
          monthlyBill={quotationData.monthlyBill}
          systemSize={quotationData.systemSize}
        />
      </QuotationPageWrapper>

      {/* Page 3 */}
      <QuotationPageWrapper logo={logo}>
        <Page3Content />
      </QuotationPageWrapper>

      {/* Page 4 */}
      <QuotationPageWrapper logo={logo}>
        <Page4Content />
      </QuotationPageWrapper>

      {/* Page 5 - Onam Solar Prosperity Campaign */}
      <QuotationPageWrapper logo={logo}>
        <Page4_1Content />
      </QuotationPageWrapper>

      {/* Page 6 */}
      <QuotationPageWrapper logo={logo}>
        <Page6Content pincode={quotationData.pincode} />
      </QuotationPageWrapper>

      {/* Page 7 */}
      <QuotationPageWrapper logo={logo}>
        <Page7Content
          systemPrice={quotationData.systemPrice}
          systemSize={quotationData.systemSize}
        />
      </QuotationPageWrapper>

      {/* Page 8 */}
      <QuotationPageWrapper logo={logo}>
        <Page8Content
          monthlyBill={quotationData.monthlyBill}
          graphData={quotationData.graphData}
        />
      </QuotationPageWrapper>

      {/* Page 9 */}
      <QuotationPageWrapper logo={logo}>
        <Page9Content />
      </QuotationPageWrapper>

      {/* Page 10 */}
      <QuotationPageWrapper logo={logo}>
        <Page10Content />
      </QuotationPageWrapper>

      {/* Page 11 - Terms and Conditions (continued) */}
      <QuotationPageWrapper logo={logo}>
        <Page10_1Content />
      </QuotationPageWrapper>

      {/* Page 12 */}
      <QuotationPageWrapper logo={logo}>
        <Page11Content
          monthlyBill={quotationData.monthlyBill}
          systemPrice={quotationData.systemPrice}
          emiPerMonth={quotationData.emiPerMonth}
        />
      </QuotationPageWrapper>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          @page {
            size: A4;
            margin: 0;
          }

          header,
          footer,
          nav {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
