/**
 * Payment breakdown, EMI and the summary-page offer banner, shared by the
 * English and Malayalam quotations.
 *
 * The EMI follows the /emi-calculator page exactly — the quotation asks the
 * same backend engine (`POST /api/emi-calculator/quotation/`, see
 * `services/quotationEmiService.ts`), so the Content Studio's EMI rules,
 * minimum down payment and daily divisor drive both:
 *
 *   Total System Cost − Down Payment          = X   (picks the rate band)
 *   X − Subsidy (if applicable)               = Amount Payable / Financed (the loan)
 *   EMI on the loan over ten years; Daily Investment = EMI ÷ 30
 *
 * `localFinancing` below is only the fallback for when that backend cannot be
 * reached; it mirrors the calculator's policy at the time of writing.
 */
import {
  quotationPricing,
  subsidyForEligibility,
} from "@/components/Quotation/subsidy";

export const EMI_YEARS = 10;

/** Offline fallback only — the live values come from the EMI calculator. */
const FALLBACK_POLICY = {
  downPaymentPercent: 10,
  /** X = total − down payment at or below this is at `rateAtOrBelow`. */
  threshold: 200000,
  rateAtOrBelow: 5.75,
  rateAbove: 8,
  dailyDivisor: 30,
};

export type PackageKey = "premium" | "smart" | "basic";
export const PACKAGE_KEYS: PackageKey[] = ["premium", "smart", "basic"];

/** One package's financing, as the EMI calculator works it out. */
export interface PackageFinancing {
  downPaymentPercent: number;
  downPayment: number;
  /** The loan: total − down payment − subsidy. */
  financed: number;
  /** Annual rate, in percent. */
  rate: number;
  emi: number;
  daily: number;
}

export type QuotationFinancing = Record<PackageKey, PackageFinancing>;

/** What the quotation prices, before any financing. */
export interface PackagePrices {
  sizeKW: number;
  /** Applied subsidy; 0 for a Non-DCR customer. */
  subsidy: number;
  /** Pre-subsidy total per package. */
  totals: Record<PackageKey, number>;
}

/**
 * The three package totals. The recommended ("Smart") package is the system
 * the calculator priced; the other two sit ±₹70,000 around it, as the
 * technical-specification table has always derived them.
 */
export function packagePrices(input: {
  systemSize: string;
  systemPrice: number;
  emiPerMonth: number;
  subsidyEligibility?: string;
}): PackagePrices {
  const subsidy = subsidyForEligibility(input.subsidyEligibility);
  const { grossCost } = quotationPricing(input.systemPrice, input.emiPerMonth, subsidy);
  return {
    sizeKW: parseFloat(input.systemSize) || 5,
    subsidy,
    totals: { premium: grossCost + 70000, smart: grossCost, basic: grossCost - 70000 },
  };
}

/** "5.75%" / "8%" — no trailing zeros. */
export function formatRate(rate: number): string {
  return `${Number(rate.toFixed(2))}%`;
}

/** Exact monthly instalment on `principal` at `annualRatePct` over `years`. */
function exactEmi(principal: number, annualRatePct: number, years = EMI_YEARS): number {
  if (principal <= 0 || annualRatePct <= 0) return 0;
  const months = years * 12;
  const r = annualRatePct / 100 / 12;
  const growth = Math.pow(1 + r, months);
  return (principal * r * growth) / (growth - 1);
}

/** The calculator's policy computed locally, for when its backend is down. */
export function localFinancing(prices: PackagePrices): QuotationFinancing {
  const p = FALLBACK_POLICY;
  const one = (total: number): PackageFinancing => {
    const downPayment = Math.round((total * p.downPaymentPercent) / 100);
    const x = total - downPayment;
    const rate = x > p.threshold ? p.rateAbove : p.rateAtOrBelow;
    const financed = Math.max(0, x - Math.min(prices.subsidy, total));
    // As the engine does: the daily figure divides the exact EMI.
    const emi = exactEmi(financed, rate);
    return {
      downPaymentPercent: p.downPaymentPercent,
      downPayment,
      financed,
      rate,
      emi: Math.round(emi),
      daily: Math.round(emi / p.dailyDivisor),
    };
  };
  return {
    premium: one(prices.totals.premium),
    smart: one(prices.totals.smart),
    basic: one(prices.totals.basic),
  };
}

export interface OfferSettings {
  enabled: boolean;
  title: string;
  description: string;
  details: string;
  titleMl: string;
  descriptionMl: string;
  detailsMl: string;
  /** "YYYY-MM-DD" or "" */
  validFrom: string;
  /** "YYYY-MM-DD" or "" — blank runs the offer as long as the quote is valid. */
  validUntil: string;
  imageUrl: string;
}

export interface QuotationDocumentSettings {
  offer: OfferSettings;
}

/** What the summary page printed before the banner became admin-controlled. */
export const DEFAULT_QUOTATION_SETTINGS: QuotationDocumentSettings = {
  offer: {
    enabled: true,
    title: "Priority 10-Day Installation",
    description: "Fast-tracked scheduling and execution",
    details: "",
    titleMl: "10 ദിവസത്തിനുള്ളിൽ മുൻഗണനാ ഇൻസ്റ്റലേഷൻ",
    descriptionMl: "വേഗത്തിലുള്ള ഷെഡ്യൂളിംഗും ഇൻസ്റ്റലേഷനും",
    detailsMl: "",
    validFrom: "",
    validUntil: "",
    imageUrl: "https://golden-ray.b-cdn.net/icons/37.png",
  },
};

export interface ResolvedOffer {
  title: string;
  description: string;
  details: string;
  imageUrl: string;
  validUntil: Date;
}

function parseIsoDate(value: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || "");
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : null;
}

function isoDay(date: Date): string {
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${mm}-${dd}`;
}

/**
 * The offer to print on the summary page, or null when there is no active
 * offer — the page then drops the banner entirely.
 */
export function resolveOffer(
  offer: OfferSettings,
  { now, fallbackUntil, malayalam }: { now: Date; fallbackUntil: Date; malayalam: boolean },
): ResolvedOffer | null {
  if (!offer.enabled) return null;

  const today = isoDay(now);
  if (offer.validFrom && offer.validFrom > today) return null;
  if (offer.validUntil && offer.validUntil < today) return null;

  const pick = (en: string, ml: string) => ((malayalam && ml.trim()) || en || "").trim();
  const title = pick(offer.title, offer.titleMl);
  if (!title) return null;

  return {
    title,
    description: pick(offer.description, offer.descriptionMl),
    details: pick(offer.details, offer.detailsMl),
    imageUrl: offer.imageUrl.trim() || DEFAULT_QUOTATION_SETTINGS.offer.imageUrl,
    validUntil: parseIsoDate(offer.validUntil) ?? fallbackUntil,
  };
}
