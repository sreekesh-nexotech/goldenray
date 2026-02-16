"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  QuotationPageWrapper,
  Page1Content,
  Page2Content,
  Page3Content,
  Page4Content,
  Page5Content,
  Page6Content,
  Page7Content,
} from "@/components/Quotation";

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
}

export default function QuotationPage() {
  const router = useRouter();
  const [quotationData, setQuotationData] = useState<QuotationData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [quoteNo, setQuoteNo] = useState("");

  // Static data
  const proposalBy = "XXX";
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
  const companyRegistration = "5 kW";

  const logo =
    "https://gym-manager-pull.b-cdn.net/golden_ray/home/logo_header.png";
  const heroImage =
    "https://golden-ray.b-cdn.net/Residential%20Solar%20Solutions/Project4/belowsectionimageENHANCED.jpg";

  useEffect(() => {
    // Generate quote number once on mount
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
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
        <Page2Content monthlyBill={quotationData.monthlyBill} />
      </QuotationPageWrapper>

      {/* Page 3 */}
      <QuotationPageWrapper logo={logo}>
        <Page3Content
          pincode={quotationData.pincode}
          monthlyBill={quotationData.monthlyBill}
        />
      </QuotationPageWrapper>

      {/* Page 4 */}
      <QuotationPageWrapper logo={logo}>
        <Page4Content
          monthlyBill={quotationData.monthlyBill}
          systemPrice={quotationData.systemPrice}
          emiPerMonth={quotationData.emiPerMonth}
          graphData={quotationData.graphData}
        />
      </QuotationPageWrapper>

      {/* Page 5 */}
      <QuotationPageWrapper logo={logo}>
        <Page5Content systemPrice={quotationData.systemPrice} />
      </QuotationPageWrapper>

      {/* Page 6 */}
      <QuotationPageWrapper logo={logo}>
        <Page6Content />
      </QuotationPageWrapper>

      {/* Page 7 */}
      <QuotationPageWrapper logo={logo}>
        <Page7Content />
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
