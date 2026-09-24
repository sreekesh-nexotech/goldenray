/**
 * Derived values for the Malayalam quotation document.
 *
 * A dedicated copy of `components/QuotationV2/quotationV2Data.ts` rather than a
 * language flag threaded through the shared one: the two documents are meant to
 * evolve independently (see the "separate PDF, don't reuse the current setup"
 * brief). The number-crunching itself is identical — only the handful of
 * composed strings that bake English words into a number (e.g. "after ₹X
 * subsidy") are re-worded per the translated quotation checklist
 * (`components/Quotation/i18n/malayalam-checklist.md`). Anything the checklist
 * leaves blank for a given key keeps the English wording, exactly as that
 * checklist's own rule says to.
 */
import type { QuotationBom } from "@/services/bomService";
import { getInstallationStats } from "@/services/installationStatsService";
import {
  PM_SURYA_GHAR_SUBSIDY,
  quotationPricing,
  subsidyForEligibility,
} from "@/components/Quotation/subsidy";
import {
  DEFAULT_QUOTATION_SETTINGS,
  EMI_YEARS,
  emiRateFor,
  formatRate,
  paymentBreakdown,
  resolveOffer,
  type QuotationDocumentSettings,
} from "@/components/QuotationV2/financing";

/** What the customer details form writes to sessionStorage. */
export interface QuotationV2Input {
  customerName: string;
  address: string;
  phoneNumber: string;
  /** PM Surya Ghar eligibility picked on the details form (DCR / Non-DCR). */
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
  bom?: QuotationBom;
}

export interface QuotationV2Tier {
  /** Cost before any subsidy. */
  total: string;
  /** What the customer actually pays for this tier. */
  final: string;
  /** 10% of the total cost. */
  downPayment: string;
  /** Total − down payment − subsidy; what the EMI is on. */
  financed: string;
  /** Monthly EMI on the financed amount, e.g. "₹2,646". */
  emi: string;
  /** EMI ÷ 30, e.g. "₹88". */
  daily: string;
}

export interface QuotationV2Data {
  // ── Cover ────────────────────────────────────────────────────────────────
  customerName: string;
  /** First name only, for the "Dear {name}," greeting. */
  firstName: string;
  address: string;
  phoneNumber: string;
  pincode: string;
  currentBill: string;
  systemSize: string;
  quoteNo: string;
  proposalBy: string;
  currentDate: string;
  validUntilDate: string;
  gstNo: string;
  companyRegistration: string;
  /** Headline stat: the subsidy, or the warranty when none applies. */
  heroStatMain: string;
  heroStatSub: string;

  // ── Usage (page 3) ───────────────────────────────────────────────────────
  dailyGeneration: string;
  monthlyValue: string;
  dailyGenerationRange: string;
  dailyUsage: string;
  surplusRange: string;

  // ── Pricing (pages 5, 7, 12) ─────────────────────────────────────────────
  hasSubsidy: boolean;
  subsidyAmount: string;
  /** Subsidy cell on the spec table; that table is a grid, so the row stays. */
  subsidyRowValue: string;
  optionsSubtitle: string;
  sizeLabel: string;
  /** "5 kW · On-Grid Solar System", under each package name on page 5. */
  systemDescription: string;
  emiYears: number;
  /** Interest rate for this system size, e.g. "7.9%". */
  emiRate: string;
  equivalentWatts: string;
  premium: QuotationV2Tier;
  smart: QuotationV2Tier;
  basic: QuotationV2Tier;

  // ── Savings (pages 8, 12) ────────────────────────────────────────────────
  monthlyBillValue: string;
  withSolarBill: string;
  monthlySavingsRange: string;
  netSavings25: string;
  paybackMonths: string;
  paybackYears: string;
  paidToKsebLakh: string;
  savedLakh: string;
  grossCost: string;
  netCost: string;
  /** Quoted system's breakdown, for the summary page. */
  downPayment: string;
  financed: string;
  emi: string;
  daily: string;
  chart: {
    labels: string[];
    withoutSolar: number[];
    withSolar: number[];
  };

  // ── Social proof (page 6) ────────────────────────────────────────────────
  stats: InstallationSummary;

  // ── Journey (page 9) ─────────────────────────────────────────────────────
  ksebRefund: string;

  // ── Summary (page 12) ────────────────────────────────────────────────────
  /** Admin's offer banner, or null when there is no active offer. */
  offer: {
    title: string;
    description: string;
    details: string;
    imageUrl: string;
    validUntil: string;
  } | null;
}

const GST_NO = "32AAGCF7283D1ZR";
const COMPANY_REGISTRATION = "U43222KL2025PTC098799";

/** Neighbourhood install counts quoted on the social-proof page. */
export interface InstallationSummary {
  homes: number;
  district: string;
  installations: number;
  year: number;
}

// ── Installation-stat fallbacks ────────────────────────────────────────────
// Used until the backend answers, and when it has nothing for this pincode.
// Ported verbatim from the v1 social-proof page.

/** Deterministic homes-nearby count so the number is stable per pincode. */
function fallbackHomesCount(pincode: string): number {
  if (!pincode) return 8;
  let hash = 0;
  for (let i = 0; i < pincode.length; i++) {
    hash = (hash * 31 + pincode.charCodeAt(i)) % 100;
  }
  return 5 + (hash % 26);
}

const DISTRICT_BY_PREFIX: Record<string, string> = {
  "688": "Alappuzha",
  "689": "Alappuzha",
  "690": "Kollam",
  "691": "Kollam",
  "695": "Thiruvananthapuram",
  "682": "Ernakulam",
  "683": "Ernakulam",
  "684": "Ernakulam",
  "680": "Thrissur",
  "681": "Thrissur",
  "673": "Kozhikode",
  "674": "Kozhikode",
  "670": "Kannur",
  "671": "Kannur",
  "676": "Malappuram",
  "677": "Malappuram",
  "678": "Palakkad",
  "679": "Palakkad",
  "685": "Idukki",
  "686": "Kottayam",
  "687": "Kottayam",
};

function fallbackDistrict(pincode: string): string {
  return DISTRICT_BY_PREFIX[pincode.substring(0, 3)] || "Alappuzha";
}

/** The district carries roughly 3x the installs of a single pincode area. */
function fallbackDistrictInstallations(pincode: string): number {
  return fallbackHomesCount(pincode) * 3 + 7;
}

function fallbackStats(pincode: string, year: number): InstallationSummary {
  return {
    homes: fallbackHomesCount(pincode),
    district: fallbackDistrict(pincode),
    installations: fallbackDistrictInstallations(pincode),
    year,
  };
}

/**
 * Overlay the backend's real installation counts on top of the fallbacks.
 *
 * Best-effort, exactly as on the v1 page: a failed or empty response leaves
 * the deterministic fallbacks in place rather than blanking the sentence.
 * Awaiting this before rasterising is what keeps the PDF from capturing the
 * fallback numbers and the on-screen page from showing different ones.
 */
export async function resolveInstallationStats(
  pincode: string,
  fallback: InstallationSummary,
): Promise<InstallationSummary> {
  if (!pincode) return fallback;
  try {
    const stats = await getInstallationStats(pincode);
    return {
      homes:
        stats.pincode_installations > 0
          ? stats.pincode_installations
          : fallback.homes,
      district: stats.district || fallback.district,
      installations:
        stats.current_year_installations > 0
          ? stats.current_year_installations
          : stats.district_installations > 0
            ? stats.district_installations
            : fallback.installations,
      year: stats.year || fallback.year,
    };
  } catch (error) {
    console.error("Failed to fetch installation stats:", error);
    return fallback;
  }
}

/**
 * Residual monthly KSEB bill once solar is running — a fixed range, same as
 * the v1 savings page quotes.
 */
const WITH_SOLAR_BILL_MIN = 300;
const WITH_SOLAR_BILL_MAX = 800;

/** Daily household consumption the appliance table on page 3 adds up to. */
const DAILY_USAGE_UNITS = 12.4;

const formatINR = (value: number) => Math.round(value).toLocaleString("en-IN");
const rupees = (value: number) => `₹${formatINR(value)}`;


function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${date.getFullYear()}`;
}

/** Round to the nearest ₹100, the way the v1 usage page presents values. */
function formatToHundred(value: number): string {
  return formatINR(Math.round(value / 100) * 100);
}

/**
 * A quote number for this document, in the format v1 generates.
 *
 * Kept out of `buildQuotationV2MalayalamData` because it is random: the
 * document would otherwise get a different number on every render, and the
 * number printed in the PDF would not match the one on screen.
 */
export function generateQuoteNo(now: Date = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const random = String(Math.floor(Math.random() * 999)).padStart(3, "0");
  return `QUO-GR-AS-${year}-${month}-${random}`;
}

interface BuildOptions {
  /** Quote number to print; generated per document, see `generateQuoteNo`. */
  quoteNo: string;
  /** Overridable so the PDF and the on-screen page agree on "today". */
  now?: Date;
  /** Backend installation counts; falls back to the pincode heuristics. */
  stats?: InstallationSummary;
  /** Admin's EMI rates and offer banner; defaults when the backend is down. */
  settings?: QuotationDocumentSettings;
}

export function buildQuotationV2MalayalamData(
  input: QuotationV2Input,
  { quoteNo, now = new Date(), stats, settings = DEFAULT_QUOTATION_SETTINGS }: BuildOptions,
): QuotationV2Data {
  const billAmount =
    typeof input.monthlyBill === "number" && input.monthlyBill > 0
      ? input.monthlyBill
      : 6000;
  const sizeKW = parseFloat(input.systemSize) || 5;
  const subsidy = subsidyForEligibility(input.subsidyEligibility);
  const hasSubsidy = subsidy > 0;

  const validUntil = new Date(now);
  validUntil.setMonth(validUntil.getMonth() + 1);

  // ── Recommended ("Smart") system, from the calculator ────────────────────
  const { grossCost, netCost } = quotationPricing(
    input.systemPrice,
    input.emiPerMonth,
    subsidy,
  );
  // ── Financing ────────────────────────────────────────────────────────────
  // 10% down on the full system cost; the rest, less the subsidy, is financed
  // over ten years. The summary page and the three tier cards all come from
  // `paymentBreakdown`, so the Smart card on page 5 matches page 12.
  const emiRate = emiRateFor(sizeKW, settings.emiRates);
  const quoted = paymentBreakdown(grossCost, subsidy, emiRate);

  // ── Monthly savings ──────────────────────────────────────────────────────
  // 80%–95% of the current bill, as the v1 investment summary computes it.
  const minSavings = Math.round(billAmount * 0.8);
  const maxSavings = Math.round(billAmount * 0.95);
  const avgMonthlySavings = (minSavings + maxSavings) / 2;

  const paybackYears = Math.round(netCost / (avgMonthlySavings * 12));
  const paybackMonths = Math.round(netCost / avgMonthlySavings);
  const totalSavings25 = Math.round(avgMonthlySavings * 12 * 25 - netCost);

  // 25 years of bills, in lakhs, for the without-solar / with-solar cards.
  const paidToKsebLakh = Math.round((billAmount * 12 * 25) / 100000);

  // ── Tier pricing ─────────────────────────────────────────────────────────
  const smartTotal = grossCost;
  const basicTotal = smartTotal - 70000;
  const premiumTotal = smartTotal + 70000;

  const buildTier = (total: number): QuotationV2Tier => {
    const b = paymentBreakdown(total, subsidy, emiRate);
    return {
      total: rupees(total),
      final: rupees(total - subsidy),
      downPayment: rupees(b.downPayment),
      financed: rupees(b.financed),
      emi: rupees(b.emi),
      daily: rupees(b.daily),
    };
  };

  // ── Daily generation (page 3) ────────────────────────────────────────────
  const minDaily = Math.round(sizeKW * 3.6);
  const maxDaily = Math.round(sizeKW * 4.4);
  const minSurplus = Math.max(0, Math.round(minDaily - DAILY_USAGE_UNITS));
  const maxSurplus = Math.max(0, Math.round(maxDaily - DAILY_USAGE_UNITS));

  const firstName =
    input.customerName?.trim().split(/\s+/)[0] || input.customerName || "";

  return {
    customerName: input.customerName,
    firstName,
    address: input.address,
    phoneNumber: input.phoneNumber,
    pincode: input.pincode,
    // page1.currentBillValue leaves the Malayalam column blank — "/month" stays.
    currentBill: `${rupees(billAmount)}/bi-monthly`,
    systemSize: input.systemSize,
    quoteNo,
    proposalBy: input.bom?.salesPerson || "Flarize Team",
    currentDate: formatDate(now),
    validUntilDate: formatDate(validUntil),
    gstNo: GST_NO,
    companyRegistration: COMPANY_REGISTRATION,
    // page1.statSubsidyMain / statWarrantyMain / statSubsidySub / statWarrantySub.
    heroStatMain: hasSubsidy
      ? `${rupees(PM_SURYA_GHAR_SUBSIDY)} സബ്സിഡി`
      : "25 വർഷ വാറന്റി",
    heroStatSub: hasSubsidy
      ? "PM സൂര്യ ഘർ പദ്ധതിയിലൂടെ"
      : "പ്രകടനം ഉറപ്പ്",

    // page2.dailyGenerationValue keeps "units" in English; monthlyValue is numeric only.
    dailyGeneration: `${minDaily}–${maxDaily} units`,
    monthlyValue: `₹${formatToHundred(minDaily * 30 * 7.5)}–${formatToHundred(
      maxDaily * 30 * 7.5,
    )}`,
    dailyGenerationRange: `${minDaily}–${maxDaily}`,
    dailyUsage: `~${Math.round(DAILY_USAGE_UNITS)}`,
    surplusRange: `${minSurplus}–${maxSurplus}`,

    hasSubsidy,
    subsidyAmount: rupees(subsidy),
    // page7's spec-table values (only its row labels are translated) — stays English.
    subsidyRowValue: hasSubsidy ? rupees(subsidy) : "Not applicable",
    // page4.subtitle / subtitleNoSubsidy.
    optionsSubtitle: hasSubsidy
      ? `ഓരോ പാക്കേജിന്റെയും മൊത്തം വില, ഡൗൺ പേയ്‌മെന്റ്, ${rupees(subsidy)} സബ്‌സിഡി, EMI എന്നിവ താഴെ.`
      : "ഓരോ പാക്കേജിന്റെയും മൊത്തം വില, ഡൗൺ പേയ്‌മെന്റ്, EMI എന്നിവ താഴെ — സബ്‌സിഡി ബാധകമല്ല.",
    // page4.systemSizeLabel / page7.sizeLabel leave the Malayalam column blank.
    sizeLabel: `${sizeKW} kW Solar System`,
    // The customer calculator only ever quotes on-grid systems.
    systemDescription: `${sizeKW} kW · ${
      input.bom?.systemLabel?.startsWith("Hybrid") ? "Hybrid" : "On-Grid"
    } Solar System`,
    emiYears: EMI_YEARS,
    emiRate: formatRate(emiRate),
    equivalentWatts: `${sizeKW * 1000} W`,
    premium: buildTier(premiumTotal),
    smart: buildTier(smartTotal),
    basic: buildTier(basicTotal),

    monthlyBillValue: rupees(billAmount),
    // page8.withSolarValue leaves the Malayalam column blank.
    withSolarBill: `₹${formatINR(WITH_SOLAR_BILL_MIN)}-${formatINR(
      WITH_SOLAR_BILL_MAX,
    )}/month`,
    monthlySavingsRange: `₹${formatINR(minSavings)}–${formatINR(maxSavings)}`,
    netSavings25: `${rupees(totalSavings25)}+`,
    paybackMonths: `${paybackMonths} months`,
    paybackYears: `~${paybackYears} years`,
    // page8.paidToKsebAmount.
    paidToKsebLakh: `₹${paidToKsebLakh} ലക്ഷത്തിലധികം`,
    // page8.savedAmount.
    savedLakh: `25 വർഷത്തിൽ ഏകദേശം ₹${Math.round(paidToKsebLakh * 0.65)} ലക്ഷം`,
    grossCost: rupees(grossCost),
    netCost: rupees(netCost),
    downPayment: rupees(quoted.downPayment),
    financed: rupees(quoted.financed),
    emi: rupees(quoted.emi),
    daily: rupees(quoted.daily),
    chart: {
      labels: input.graphData.labels.map((l) => l.replace("Year ", "")),
      withoutSolar: input.graphData.datasets[0]?.data ?? [],
      withSolar: input.graphData.datasets[1]?.data ?? [],
    },

    stats: stats ?? fallbackStats(input.pincode, now.getFullYear()),

    // page9.refundValue.
    ksebRefund: `${sizeKW} kW സിസ്റ്റത്തിന് ഏകദേശം ₹${formatINR(sizeKW * 1000 * 0.8)} വരെ റീഫണ്ട്`,

    // No Malayalam month names appear anywhere else in the checklist; reusing
    // the numeric dd/mm/yyyy format side-steps inventing one for this date.
    offer: (() => {
      const offer = resolveOffer(settings.offer, {
        now,
        fallbackUntil: validUntil,
        malayalam: true,
      });
      return offer && {
        ...offer,
        validUntil: formatDate(offer.validUntil),
      };
    })(),
  };
}
