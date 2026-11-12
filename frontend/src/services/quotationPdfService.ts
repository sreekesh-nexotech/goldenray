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
import { getHybridBoms, getQuotationBom, type QuotationBom } from "@/services/bomService";
import { getPackagesFinancing } from "@/services/quotationEmiService";
import { PM_SURYA_GHAR_SUBSIDY, subsidyForEligibility } from "@/components/Quotation/subsidy";
import type { HybridKey, HybridQuotationInput } from "@/components/QuotationV2/hybrid";
import type { SystemType } from "@/components/SolarCalculator/installationType";
import type { QuotationLanguage } from "@/components/Quotation/i18n/quotationStrings";
import type { QuotationVariant } from "@/components/QuotationV2/pageSets";
import { quotationFileName } from "@/lib/quotationFileName";

export interface QuotationData extends HybridQuotationInput {
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
 *
 * A hybrid quote is priced entirely by the BOM engine (see `hybridQuotation`)
 * and fails if the engine cannot price it.
 */
export async function assembleQuotationData(
  customer: CustomerDetails,
  figures: CalculatorFigures,
  { salesPerson = "", systemType = "ongrid" }: { salesPerson?: string; systemType?: SystemType } = {},
): Promise<QuotationData> {
  if (systemType === "hybrid") return hybridQuotation(customer, figures, salesPerson);
  const bom = await getQuotationBom({
    systemSize: figures.systemSize,
    customerName: customer.customerName,
    salesPerson,
  });
  return { ...customer, ...figures, bom: bom ?? undefined };
}

/**
 * A hybrid quotation. The website calculator only prices on-grid systems, so
 * the BOM engine prices the hybrid at its nearest size with no battery, one
 * and two; the quote itself (cover, savings, summary) is the one-battery
 * option the document recommends. Its EMI comes from the same engine as the
 * on-grid packages.
 */
async function hybridQuotation(
  customer: CustomerDetails,
  figures: CalculatorFigures,
  salesPerson: string,
): Promise<QuotationData> {
  const boms = await getHybridBoms({
    systemSize: figures.systemSize,
    customerName: customer.customerName,
    salesPerson,
  });
  if (!boms) throw new Error("The BOM engine could not price the hybrid system.");

  const totals: Record<HybridKey, number> = {
    noBattery: boms.noBattery.finalPrice,
    oneBattery: boms.oneBattery.finalPrice,
    twoBattery: boms.twoBattery.finalPrice,
  };
  const subsidy = subsidyForEligibility(customer.subsidyEligibility);
  const financing = await getPackagesFinancing(boms.kw, subsidy, totals);

  // The document reads the quoted system as systemPrice + the PM Surya Ghar
  // subsidy (see quotationPricing).
  const systemPrice = totals.oneBattery - PM_SURYA_GHAR_SUBSIDY;
  // The savings curve with solar is the system's net cost plus costs that do
  // not depend on it, so the hybrid's curve is the calculator's shifted by
  // the difference in price.
  const shift = systemPrice - figures.systemPrice;
  const [withoutSolar, withSolar] = figures.graphData.datasets;
  const graphData = {
    labels: figures.graphData.labels,
    datasets: [withoutSolar, { data: (withSolar?.data ?? []).map((v) => v + shift) }],
  };

  return {
    ...customer,
    ...figures,
    systemSize: `${boms.kw} kW`,
    systemPrice,
    graphData,
    bom: boms.oneBattery,
    systemType: "hybrid",
    packageTotals: totals,
    financing,
  };
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
