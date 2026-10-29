// src/services/quotationEmiService.ts
//
// The quotation's EMI figures, from the same backend engine as the
// /emi-calculator page (the platform's EMI engine, public API v1). The quotation sends its own
// package prices and the subsidy it applies; the engine answers with the
// calculator's down payment, rate band, loan, EMI and daily amount for each.
import { PUBLIC_API_BASE_URL } from "@/config";
import {
  EMI_YEARS,
  localPackageFinancing,
  type PackageFinancing,
  type PackagePrices,
  type QuotationFinancing,
} from "@/components/QuotationV2/financing";

// Capped so a request that hangs (e.g. the PDF renderer inside the server
// reaching the public API) falls back to defaults instead of stalling the page.
const TIMEOUT_MS = 8000;
const ENDPOINT = `${PUBLIC_API_BASE_URL}calculators/emi/quotation/`;

interface EngineBreakdown {
  down_payment_percent: number;
  down_payment: number;
  loan_amount: number;
  interest_rate: number;
  emi_per_month: number;
  daily_amount: number;
}

/**
 * The engine's financing for any set of packages (at most six), keyed as given.
 * Falls back to the calculator's policy computed locally if the backend is
 * unreachable, so a quotation still renders.
 */
export async function getPackagesFinancing<K extends string>(
  sizeKW: number,
  subsidy: number,
  totals: Record<K, number>,
): Promise<Record<K, PackageFinancing>> {
  const keys = Object.keys(totals) as K[];
  try {
    const packages = Object.fromEntries(
      keys.map((key) => [key, { system_cost: totals[key], subsidy }]),
    );
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ capacity_kw: sizeKW, tenure_years: EMI_YEARS, packages }),
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body: { packages: Record<string, EngineBreakdown> } = await res.json();

    const result = {} as Record<K, PackageFinancing>;
    for (const key of keys) {
      const p = body.packages[key];
      if (!p) throw new Error(`missing package ${key}`);
      result[key] = {
        downPaymentPercent: p.down_payment_percent,
        downPayment: Math.round(p.down_payment),
        financed: Math.round(p.loan_amount),
        rate: p.interest_rate,
        // The calculator page shows these rounded to the rupee too.
        emi: Math.round(p.emi_per_month),
        daily: Math.round(p.daily_amount),
      };
    }
    return result;
  } catch (error) {
    console.error("Failed to fetch quotation EMI; using the local fallback:", error);
    const result = {} as Record<K, PackageFinancing>;
    for (const key of keys) result[key] = localPackageFinancing(totals[key], subsidy);
    return result;
  }
}

/** Financing for the three tier packages. */
export async function getQuotationFinancing(prices: PackagePrices): Promise<QuotationFinancing> {
  return getPackagesFinancing(prices.sizeKW, prices.subsidy, prices.totals);
}
