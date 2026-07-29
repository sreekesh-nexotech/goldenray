import type { QuotationLanguage } from "./i18n/quotationStrings";

/**
 * Stand-in quotation used when /quotation is opened directly in development.
 *
 * The real page reads what the customer details form wrote to sessionStorage,
 * which means it can only be reached by completing the calculator flow. That
 * makes iterating on the layout painful, so in dev the page falls back to this
 * sample instead of redirecting home. It is never used in production.
 */
export interface SampleQuotationData {
  customerName: string;
  address: string;
  phoneNumber: string;
  preferredLanguage?: QuotationLanguage;
  subsidyEligibility?: string;
  pincode: string;
  monthlyBill: number | "";
  systemSize: string;
  systemPrice: number;
  emiPerMonth: number;
  graphData: {
    labels: string[];
    datasets: { data: number[] }[];
  };
}

// 25 years of cumulative cost, the same shape the calculator API returns:
// KSEB bills compounding at ~8%/yr vs a one-off solar spend plus a small bill.
const YEARS = Array.from({ length: 26 }, (_, i) => i);

const withoutSolar = YEARS.map((year) => {
  let total = 0;
  let yearly = 6000 * 12;
  for (let y = 0; y < year; y++) {
    total += yearly;
    yearly *= 1.08;
  }
  return Math.round(total);
});

const withSolar = YEARS.map((year) => Math.round(190000 + year * 500 * 12));

export const sampleQuotationData: SampleQuotationData = {
  customerName: "Sample Customer",
  address: "Vadakkal, Alappuzha",
  phoneNumber: "9876543210",
  preferredLanguage: "English",
  subsidyEligibility: "Eligible (DCR)",
  pincode: "688008",
  monthlyBill: 6000,
  systemSize: "5 kW",
  systemPrice: 190000,
  emiPerMonth: 3940,
  graphData: {
    labels: YEARS.map((y) => `Year ${y}`),
    datasets: [{ data: withoutSolar }, { data: withSolar }],
  },
};
