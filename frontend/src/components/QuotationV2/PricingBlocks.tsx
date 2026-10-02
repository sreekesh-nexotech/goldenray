/**
 * The payment-breakdown blocks shared by the English and Malayalam pages:
 * the three package cards on page 5, the investment summary on page 12 and the
 * admin-controlled offer banner beneath it.
 *
 * Unlike the rest of the v2 pages these are not Figma exports — they were
 * redesigned together (Total System Cost → Down Payment → Subsidy → Amount
 * Payable / Financed → EMI → Daily Investment), so both languages render the
 * same markup and differ only in the `LABELS` column they pick. The Malayalam
 * document imports these from here rather than keeping a copy.
 */
import type { CSSProperties } from "react";

import {
  HYBRID_KEYS,
  HYBRID_OPTION_NAMES,
  HYBRID_RECOMMENDED,
  type HybridKey,
} from "@/components/QuotationV2/hybrid";

type Language = "English" | "Malayalam";

interface TierPricing {
  total: string;
  downPayment: string;
  financed: string;
  emiRate: string;
  emi: string;
  daily: string;
}

/** The fields these blocks read; both languages' quotation data satisfy it. */
interface PricingData {
  hasSubsidy: boolean;
  subsidyAmount: string;
  systemDescription: string;
  emiYears: number;
  downPaymentPercent: number;
  emiRate: string;
  premium: TierPricing;
  smart: TierPricing;
  basic: TierPricing;
  /** A hybrid quote's battery options; the cards show these instead of tiers. */
  hybrid: (Record<HybridKey, TierPricing> & { subtitle: string }) | null;
  grossCost: string;
  downPayment: string;
  financed: string;
  emi: string;
  daily: string;
  monthlySavingsRange: string;
  paybackYears: string;
}

export interface OfferBannerData {
  title: string;
  description: string;
  details: string;
  imageUrl: string;
  validUntil: string;
}

const FONT =
  'var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

const INK = "rgb(18,53,50)";
const GREY = "rgb(107,114,128)";
const ORANGE = "rgb(248,138,34)";
const GREEN = "rgb(21,128,61)";
const RULE = "1px solid rgb(229,231,235)";
const BREAKDOWN_BG = "rgb(250,247,242)";
const BREAKDOWN_BORDER = "1px solid rgb(238,228,214)";

export const LABELS: Record<Language, {
  recommended: string;
  totalSystemCost: string;
  systemCostPreSubsidy: string;
  systemCost: string;
  paymentBreakdown: string;
  downPayment: (percent: number) => string;
  subsidy: string;
  financed: string;
  loanAmount: string;
  emiShort: (years: number) => string;
  emi: (years: number, rate: string) => string;
  emiOn: (amount: string) => string;
  perMonth: string;
  perMonthShort: string;
  daily: string;
  perDay: string;
  perDayShort: string;
  monthlySavings: string;
  payback: string;
  offerValidUntil: (date: string) => string;
}> = {
  English: {
    recommended: "★ Recommended – Most Popular",
    totalSystemCost: "Total system cost",
    systemCostPreSubsidy: "System Cost (Pre-Subsidy)",
    systemCost: "System Cost",
    paymentBreakdown: "Payment breakdown",
    downPayment: (percent: number) => `Down Payment (${percent}%)`,
    subsidy: "PM Surya Ghar Subsidy",
    financed: "Amount Payable / Financed",
    loanAmount: "Loan amount",
    emiShort: (years: number) => `EMI (${years}yr)`,
    emi: (years: number, rate: string) => `EMI (${years} yrs @ ${rate})`,
    emiOn: (amount: string) => ` on ${amount}`,
    perMonth: "/ month",
    perMonthShort: "/mo",
    daily: "Daily Investment",
    perDay: "/ day",
    perDayShort: "/day",
    monthlySavings: "Monthly Savings",
    payback: "Payback Period",
    offerValidUntil: (date: string) => `Offer valid for bookings confirmed before ${date}`,
  },
  Malayalam: {
    recommended: "★ Recommended – Most Popular",
    totalSystemCost: "ആകെ സിസ്റ്റം വില",
    systemCostPreSubsidy: "സിസ്റ്റത്തിന്റെ മൊത്തം വില (സബ്‌സിഡിക്ക് മുമ്പ്)",
    systemCost: "സിസ്റ്റത്തിന്റെ മൊത്തം വില",
    paymentBreakdown: "പേയ്‌മെന്റ് വിശദാംശങ്ങൾ",
    downPayment: (percent: number) => `ഡൗൺ പേയ്‌മെന്റ് (${percent}%)`,
    subsidy: "പി.എം. സൂര്യ ഘർ സബ്‌സിഡി",
    financed: "അടയ്ക്കേണ്ട / ലോൺ തുക",
    loanAmount: "ലോൺ തുക",
    emiShort: (years: number) => `EMI (${years} വർഷം)`,
    emi: (years: number, rate: string) => `EMI (${years} വർഷം @ ${rate})`,
    emiOn: (amount: string) => ` — ${amount}`,
    perMonth: "/ മാസം",
    perMonthShort: "/മാസം",
    daily: "പ്രതിദിന നിക്ഷേപം",
    perDay: "/ ദിവസം",
    perDayShort: "/ദിവസം",
    monthlySavings: "പ്രതിമാസ ലാഭം",
    payback: "നിക്ഷേപം തിരികെ ലഭിക്കാൻ വേണ്ട സമയം",
    offerValidUntil: (date: string) =>
      `${date}-ന് മുമ്പ് ബുക്കിംഗ് സ്ഥിരീകരിക്കുന്നവർക്ക് മാത്രം`,
  },
};

const labelsFor = (language: Language) => LABELS[language] || LABELS.English;

const text = (
  fontSize: number,
  fontWeight: number,
  color: string,
  extra?: CSSProperties,
): CSSProperties => ({
  position: "relative",
  fontFamily: FONT,
  fontSize,
  fontWeight,
  color,
  letterSpacing: "-0.3px",
  ...extra,
});

const row = (extra?: CSSProperties): CSSProperties => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  ...extra,
});

// ── Page 5: package cards ───────────────────────────────────────────────────

/** Left to right, as the design lays the three packages out. */
const PACKAGES: { key: "premium" | "smart" | "basic"; name: string; recommended?: boolean }[] = [
  // The card names follow the pricing-card reference ("Elite System"); the
  // spec table and comparison grid keep the fuller "(Micro inverter)" name.
  { key: "premium", name: "Elite System" },
  { key: "smart", name: "Smart System", recommended: true },
  { key: "basic", name: "Essential" },
];

interface CardSpec {
  key: string;
  /** May break onto a second line ("Hybrid System\n(With Battery)"). */
  name: string;
  subtitle: string;
  tier: TierPricing;
  recommended?: boolean;
}

/** The three cards: tiers on an on-grid quote, battery options on a hybrid. */
function cardsFor(data: PricingData): CardSpec[] {
  const { hybrid } = data;
  if (hybrid) {
    return HYBRID_KEYS.map((key) => ({
      key,
      name: HYBRID_OPTION_NAMES[key],
      subtitle: hybrid.subtitle,
      tier: hybrid[key],
      recommended: key === HYBRID_RECOMMENDED,
    }));
  }
  return PACKAGES.map((pkg) => ({ ...pkg, subtitle: data.systemDescription, tier: data[pkg.key] }));
}

export function PackageCards({ data, language }: { data: PricingData; language: Language }) {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        gap: 22,
        // The recommended card is taller (tab + extra foot) and stands proud of
        // the other two, centred on them.
        alignItems: "center",
        flexShrink: 0,
      }}
    >
      {cardsFor(data).map((card) => (
        <PackageCard key={card.key} card={card} data={data} l={labelsFor(language)} />
      ))}
    </div>
  );
}

function PackageCard({
  card,
  data,
  l,
}: {
  card: CardSpec;
  data: PricingData;
  l: (typeof LABELS)[Language];
}) {
  const { tier } = card;
  const featured = card.recommended;
  const breakdownRow = row({ lineHeight: "36px" });

  return (
    <div
      style={{
        position: "relative",
        width: 410,
        borderRadius: 16,
        overflow: "hidden",
        boxSizing: "border-box",
        backgroundColor: featured ? "rgb(253,248,240)" : "rgb(255,255,255)",
        border: featured ? `2px solid ${ORANGE}` : "2px solid rgb(229,231,235)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      {/* Tab hanging from the top edge, inset from the card's sides */}
      {featured && (
        <div
          style={{
            ...text(17, 500, "rgb(255,255,255)", { textAlign: "center" }),
            backgroundColor: ORANGE,
            lineHeight: "48px",
            margin: "0 18px",
            borderRadius: "0 0 16px 16px",
          }}
        >
          {l.recommended}
        </div>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: featured ? "30px 18px 34px" : "30px 18px 18px",
        }}
      >
        {/* Name + system */}
        <span style={text(24, 700, INK, { lineHeight: "30px", whiteSpace: "pre" })}>
          {card.name}
        </span>
        <span
          style={text(18, 400, featured ? "rgb(22,101,52)" : GREY, {
            lineHeight: "26px",
            marginTop: 2,
          })}
        >
          {card.subtitle}
        </span>

        {/* Total system cost */}
        <div style={{ borderTop: RULE, marginTop: 12, paddingTop: 12 }}>
          <span style={text(18, 400, GREY, { lineHeight: "24px", display: "block" })}>
            {l.totalSystemCost}
          </span>
          <span
            style={text(34, 700, featured ? "rgb(0,0,0)" : INK, {
              lineHeight: "44px",
              letterSpacing: "-0.5px",
              display: "block",
            })}
          >
            {tier.total}
          </span>
        </div>

        {/* Payment breakdown */}
        <div
          style={{
            marginTop: 20,
            borderRadius: 10,
            backgroundColor: featured ? "rgb(250,238,222)" : "rgb(253,249,245)",
            border: featured ? "1px solid rgb(240,218,190)" : BREAKDOWN_BORDER,
            padding: "8px 8px 4px",
          }}
        >
          <span style={text(17, 600, INK, { lineHeight: "28px", display: "block" })}>
            {l.paymentBreakdown}
          </span>
          <div style={breakdownRow}>
            <span style={text(17, 400, GREY)}>{l.downPayment(data.downPaymentPercent)}:</span>
            <span style={text(17, 600, INK)}>{tier.downPayment}</span>
          </div>
          {data.hasSubsidy && (
            <div style={breakdownRow}>
              <span style={text(17, 400, GREY)}>{l.subsidy}:</span>
              <span style={text(17, 600, INK)}>-{data.subsidyAmount}</span>
            </div>
          )}
          <div style={{ ...breakdownRow, borderTop: BREAKDOWN_BORDER, marginTop: 2, paddingTop: 2 }}>
            <span style={text(20, 400, "rgb(0,0,0)")}>{l.loanAmount}</span>
            <span style={text(20, 700, ORANGE, { whiteSpace: "nowrap" })}>{tier.financed}</span>
          </div>
        </div>

        {/* EMI */}
        <div style={row({ borderTop: RULE, marginTop: 16, paddingTop: 12 })}>
          <span style={text(21, 400, "rgb(0,0,0)", { lineHeight: "28px" })}>
            {l.emiShort(data.emiYears)}:
          </span>
          <span style={text(23, 700, ORANGE, { lineHeight: "28px", whiteSpace: "nowrap" })}>
            ~{tier.emi}
            {l.perMonthShort}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Page 12: investment summary ─────────────────────────────────────────────

export function InvestmentSummaryCard({
  data,
  language,
  headline,
}: {
  data: PricingData;
  language: Language;
  headline: string;
}) {
  const l = labelsFor(language);
  const labelText = text(24, 400, "var(--grey)", { lineHeight: "30px" });
  const valueText = text(24, 600, "rgb(17,24,39)", { lineHeight: "30px", whiteSpace: "nowrap" });

  return (
    <div
      style={{
        position: "relative",
        width: 1018,
        overflow: "hidden",
        borderRadius: 16,
        backgroundColor: "rgb(255,255,255)",
        border: "1px solid rgb(229,231,235)",
        boxShadow: "0px 4px 6px 0px rgba(0,0,0,0.1), 0px 10px 15px 0px rgba(0,0,0,0.1)",
        boxSizing: "border-box",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          ...text(27, 700, "rgb(255,255,255)", { textAlign: "center", lineHeight: "80px" }),
          fontFamily:
            'var(--font-inter), Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          backgroundColor: "var(--1-2)",
        }}
      >
        {headline}
      </div>

      <div style={{ padding: "28px 32px 32px", display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={row({ padding: "4px 0" })}>
          <span style={labelText}>
            {data.hasSubsidy ? l.systemCostPreSubsidy : l.systemCost}
          </span>
          <span style={valueText}>{data.grossCost}</span>
        </div>

        <div
          style={{
            borderRadius: 12,
            backgroundColor: BREAKDOWN_BG,
            border: BREAKDOWN_BORDER,
            padding: "18px 24px",
          }}
        >
          <span
            style={text(17, 700, "rgb(146,128,106)", {
              letterSpacing: "1.6px",
              textTransform: "uppercase",
              lineHeight: "22px",
              display: "block",
              marginBottom: 8,
            })}
          >
            {l.paymentBreakdown}
          </span>
          <div style={row({ padding: "6px 0" })}>
            <span style={text(22, 400, "var(--grey)")}>{l.downPayment(data.downPaymentPercent)}</span>
            <span style={text(22, 600, "rgb(17,24,39)")}>{data.downPayment}</span>
          </div>
          {data.hasSubsidy && (
            <div style={row({ padding: "6px 0" })}>
              <span style={text(22, 400, "var(--grey)")}>{l.subsidy}</span>
              <span style={text(22, 600, "rgb(17,24,39)")}>− {data.subsidyAmount}</span>
            </div>
          )}
          <div style={row({ borderTop: BREAKDOWN_BORDER, marginTop: 8, paddingTop: 14 })}>
            <span style={text(23, 700, INK)}>{l.financed}</span>
            <span style={text(26, 700, ORANGE)}>{data.financed}</span>
          </div>
        </div>

        <div style={{ borderTop: RULE, paddingTop: 12 }}>
          <div style={row({ padding: "6px 0" })}>
            <span style={labelText}>{l.monthlySavings}</span>
            <span style={valueText}>{data.monthlySavingsRange}</span>
          </div>
          <div style={row({ padding: "6px 0" })}>
            <span style={labelText}>{l.payback}</span>
            <span style={valueText}>{data.paybackYears}</span>
          </div>
        </div>

        <div
          style={{
            borderRadius: 12,
            backgroundColor: "rgba(22,163,74,0.15)",
            border: "1px solid rgba(22,163,74,0.25)",
            padding: "14px 24px",
          }}
        >
          <div style={row({ padding: "6px 0" })}>
            <span style={text(22, 400, "var(--grey)")}>
              {l.emi(data.emiYears, data.emiRate)}
              <span style={{ fontSize: 19 }}>{l.emiOn(data.financed)}</span>
            </span>
            <span style={text(26, 700, GREEN, { whiteSpace: "nowrap" })}>
              {data.emi}
              {l.perMonthShort}
            </span>
          </div>
          <div style={row({ padding: "6px 0" })}>
            <span style={text(22, 400, "var(--grey)")}>{l.daily}</span>
            <span style={text(26, 700, GREEN, { whiteSpace: "nowrap" })}>
              {data.daily}
              {l.perDayShort}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page 12: offer banner ───────────────────────────────────────────────────

/** Renders nothing when admin has no active offer. */
export function OfferBanner({
  offer,
  language,
}: {
  offer: OfferBannerData | null;
  language: Language;
}) {
  if (!offer) return null;
  const l = labelsFor(language);

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        backgroundColor: "var(--backgrounds-grouped-primary)",
        boxShadow: "0px 0.500px 1px 0px rgba(25,33,61,0.04)",
        display: "flex",
        flexDirection: "row",
        gap: 24,
        padding: "36px 80px",
        justifyContent: "center",
        alignItems: "center",
        boxSizing: "border-box",
        flexShrink: 0,
        alignSelf: "stretch",
      }}
    >
      {/* A plain <img>: the source is admin-configured (any host), and the page
          is printed, so next/image's optimisation buys nothing here. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={offer.imageUrl}
        alt="Special Offer"
        width={260}
        height={105}
        crossOrigin="anonymous"
        style={{
          position: "relative",
          width: 260,
          height: 105,
          objectFit: "contain",
          flexShrink: 0,
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
          alignItems: "flex-start",
          flexGrow: 1,
        }}
      >
        <span style={text(32, 700, "var(--2-2)", { lineHeight: 1.4, letterSpacing: 0 })}>
          {offer.title}
        </span>
        {offer.description && (
          <span style={text(24, 400, "var(--2-2)", { lineHeight: 1.4, letterSpacing: 0 })}>
            {offer.description}
          </span>
        )}
        {offer.details && (
          <span style={text(19, 400, "var(--grey)", { lineHeight: 1.4, letterSpacing: 0 })}>
            {offer.details}
          </span>
        )}
        <span style={text(18, 400, "var(--red-2)", { lineHeight: 1.5, letterSpacing: 0 })}>
          {l.offerValidUntil(offer.validUntil)}
        </span>
      </div>
    </div>
  );
}
