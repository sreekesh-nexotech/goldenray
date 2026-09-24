/**
 * Payment breakdown, EMI and the summary-page offer banner, shared by the
 * English and Malayalam quotations.
 *
 * Every price on pages 5, 7 and 12 is broken down the same way:
 *
 *   Total System Cost − Down Payment (10%) − Subsidy = Amount Payable / Financed
 *
 * and the EMI is always on the amount financed, over ten years. The interest
 * rates and the offer banner are admin-controlled in the Django BOM app
 * (`/bom/api/quotation-settings/`, see `services/quotationSettingsService.ts`);
 * the defaults here apply while that is unreachable.
 */

export const DOWN_PAYMENT_SHARE = 0.1;
export const EMI_YEARS = 10;

/**
 * PM Surya Ghar loans are priced by system size: one rate for systems up to
 * 3 kW, another for anything larger.
 */
export const EMI_SIZE_THRESHOLD_KW = 3;

export interface EmiRates {
  upTo3kW: number;
  above3kW: number;
}

export const DEFAULT_EMI_RATES: EmiRates = { upTo3kW: 5.75, above3kW: 7.9 };

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
  emiRates: EmiRates;
  offer: OfferSettings;
}

/** What the summary page printed before the banner became admin-controlled. */
export const DEFAULT_QUOTATION_SETTINGS: QuotationDocumentSettings = {
  emiRates: DEFAULT_EMI_RATES,
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

/** Annual interest rate, in percent, for a system of `sizeKW`. */
export function emiRateFor(sizeKW: number, rates: EmiRates = DEFAULT_EMI_RATES): number {
  const rate = sizeKW <= EMI_SIZE_THRESHOLD_KW ? rates.upTo3kW : rates.above3kW;
  return Number.isFinite(rate) && rate >= 0 ? rate : DEFAULT_EMI_RATES.above3kW;
}

/** "5.75%" / "7.9%" — no trailing zeros. */
export function formatRate(rate: number): string {
  return `${Number(rate.toFixed(2))}%`;
}

/** Monthly instalment on `principal` at `annualRatePct` over `years`, to the rupee. */
export function loanEmi(principal: number, annualRatePct: number, years = EMI_YEARS): number {
  if (principal <= 0) return 0;
  const months = years * 12;
  const r = annualRatePct / 100 / 12;
  if (r === 0) return Math.round(principal / months);
  const growth = Math.pow(1 + r, months);
  return Math.round((principal * r * growth) / (growth - 1));
}

export interface PaymentBreakdown {
  downPayment: number;
  financed: number;
  emi: number;
  daily: number;
}

/** Down payment, amount financed, EMI and daily cost for a pre-subsidy price. */
export function paymentBreakdown(
  grossCost: number,
  subsidy: number,
  annualRatePct: number,
): PaymentBreakdown {
  const downPayment = Math.round(grossCost * DOWN_PAYMENT_SHARE);
  const financed = Math.max(0, grossCost - downPayment - subsidy);
  const emi = loanEmi(financed, annualRatePct);
  return { downPayment, financed, emi, daily: Math.round(emi / 30) };
}

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
