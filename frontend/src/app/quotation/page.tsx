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
import { QuotationLanguageProvider } from "@/components/Quotation/i18n/QuotationLanguageContext";
import { quotationFontClass } from "@/components/Quotation/i18n/quotationFonts";
import type { QuotationLanguage } from "@/components/Quotation/i18n/quotationStrings";
import type { QuotationBom } from "@/services/bomService";
import { subsidyForEligibility } from "@/components/Quotation/subsidy";
import { sampleQuotationData } from "@/components/Quotation/sampleQuotationData";

interface QuotationData {
  customerName: string;
  address: string;
  phoneNumber: string;
  /** Language the customer asked the quotation in; defaults to English. */
  preferredLanguage?: QuotationLanguage;
  /** PM Surya Ghar eligibility picked on the details form (DCR / Non-DCR). */
  subsidyEligibility?: string;
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
  const [languageOverride, setLanguageOverride] =
    useState<QuotationLanguage | null>(null);

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

    const lang = new URLSearchParams(window.location.search)
      .get("lang")
      ?.toLowerCase();
    if (lang === "ml" || lang === "malayalam") setLanguageOverride("Malayalam");
    else if (lang === "en" || lang === "english") setLanguageOverride("English");

    // Get data from sessionStorage
    const storedData = sessionStorage.getItem("quotationData");
    if (storedData) {
      setQuotationData(JSON.parse(storedData));
    } else if (process.env.NODE_ENV !== "production") {
      // Dev convenience: render a sample quote so /quotation can be opened
      // directly and edited live, instead of having to redo the calculator
      // flow after every change. Production still redirects home.
      setQuotationData(sampleQuotationData);
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
  // ?lang=ml (or =en) previews the other language without regenerating the
  // quote — handy while translating. Falls back to what the customer chose.
  const language: QuotationLanguage =
    languageOverride ?? quotationData.preferredLanguage ?? "English";
  const subsidy = subsidyForEligibility(quotationData.subsidyEligibility);

  return (
    <QuotationLanguageProvider language={language}>
      <div
        className={`min-h-screen bg-gray-100 flex flex-col items-center py-4 gap-4 print:py-0 print:gap-0 print:bg-white ${quotationFontClass(language)}`}
      >
        {/* Page 1 */}
        <QuotationPageWrapper logo={logo}>
          <Page1Content
            quotationData={quotationData}
            subsidy={subsidy}
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
          <Page4Content subsidy={subsidy} />
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
            subsidy={subsidy}
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
            subsidy={subsidy}
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
    </QuotationLanguageProvider>
  );
}
