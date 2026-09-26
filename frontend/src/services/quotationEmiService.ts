// src/services/quotationEmiService.ts
//
// The quotation's EMI figures, from the same backend engine as the
// /emi-calculator page (goldenray/utils/emi.py). The quotation sends its own
// package prices and the subsidy it applies; the engine answers with the
// calculator's down payment, rate band, loan, EMI and daily amount for each.
import { API_BASE_URL } from "@/config";
import {
  EMI_YEARS,
  PACKAGE_KEYS,
  localFinancing,
  type PackagePrices,
  type QuotationFinancing,
} from "@/components/QuotationV2/financing";

const ENDPOINT = `${API_BASE_URL}emi-calculator/quotation/`;

interface EngineBreakdown {
  down_payment_percent: number;
  down_payment: number;
  loan_amount: number;
  interest_rate: number;
  emi_per_month: number;
  daily_amount: number;
}

/**
 * Financing for every package. Falls back to the calculator's policy computed
 * locally if the backend is unreachable, so a quotation still renders.
 */
export async function getQuotationFinancing(prices: PackagePrices): Promise<QuotationFinancing> {
  try {
    const packages = Object.fromEntries(
      PACKAGE_KEYS.map((key) => [key, { system_cost: prices.totals[key], subsidy: prices.subsidy }]),
    );
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ capacity_kw: prices.sizeKW, tenure_years: EMI_YEARS, packages }),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body: { packages: Record<string, EngineBreakdown> } = await res.json();

    const result = {} as QuotationFinancing;
    for (const key of PACKAGE_KEYS) {
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
    return localFinancing(prices);
  }
}
