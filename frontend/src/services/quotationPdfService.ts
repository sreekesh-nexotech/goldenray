// src/services/quotationPdfService.ts
//
// Assembling a quotation and turning it into a PDF, shared by the customer's
// "Get Detailed Quote" popup and the Studio's accounting copy — so both run
// the same calculator figures, the same BOM and the same document.
//
// The PDF itself is rendered server-side by Chrome from the real
// /quotation/v2 (or /quotation/v2-malayalam) page. Those routes live under
// /fe-api/, deliberately not /api/: nginx routes all of /api/ to Django, so a
// route there would 404 in production despite working locally.
import { getQuotationBom, type QuotationBom } from "@/services/bomService";
import type { QuotationLanguage } from "@/components/Quotation/i18n/quotationStrings";
import type { QuotationVariant } from "@/components/QuotationV2/pageSets";
import { quotationFileName } from "@/lib/quotationFileName";

export interface QuotationData {
  customerName: string;
  address: string;
  phoneNumber: string;
  preferredLanguage: QuotationLanguage;
  subsidyEligibility: string;
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

export interface CustomerDetails {
  customerName: string;
  address: string;
  phoneNumber: string;
  preferredLanguage: QuotationLanguage;
  subsidyEligibility: string;
  pincode: string;
  monthlyBill: number | "";
}

/** What the solar calculator worked out for this customer. */
export interface CalculatorFigures {
  systemSize: string;
  systemPrice: number;
  emiPerMonth: number;
  graphData: QuotationData["graphData"];
}

/**
 * The full quotation payload. The Bill of Materials comes from the Django BOM
 * engine and is best-effort — a quotation still renders without it.
 */
export async function assembleQuotationData(
  customer: CustomerDetails,
  figures: CalculatorFigures,
  { salesPerson = "" }: { salesPerson?: string } = {},
): Promise<QuotationData> {
  const bom = await getQuotationBom({
    systemSize: figures.systemSize,
    customerName: customer.customerName,
    salesPerson,
  });
  return { ...customer, ...figures, bom: bom ?? undefined };
}

/**
 * Render the quotation to a PDF in the given language. `variant: "accounting"`
 * is the Studio's short copy (pages 1, 5, 7, 8).
 */
export async function requestQuotationPdf(
  data: QuotationData,
  {
    language = data.preferredLanguage,
    variant = "customer",
    signal,
  }: { language?: QuotationLanguage; variant?: QuotationVariant; signal?: AbortSignal } = {},
): Promise<{ blob: Blob; fileName: string }> {
  const endpoint =
    language === "Malayalam" ? "/fe-api/quotation/pdf-malayalam" : "/fe-api/quotation/pdf";
  const response = await fetch(`${endpoint}?variant=${variant}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, preferredLanguage: language }),
    signal,
  });
  if (!response.ok) throw new Error(`PDF request failed: ${response.status}`);
  return {
    blob: await response.blob(),
    fileName: quotationFileName(data.customerName, data.systemSize, variant),
  };
}

/** Hand a generated file to the browser as a download. */
export function saveFile(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Revoking immediately can cancel the download in some browsers.
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
