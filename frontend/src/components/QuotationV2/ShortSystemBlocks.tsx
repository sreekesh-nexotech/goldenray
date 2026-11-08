/**
 * The blocks of the short quotation, shared by the English, Malayalam and
 * commercial documents: the chosen system's specification table, and its
 * investment summary above Book Now, with the structure-cost note below it.
 */
import type { CSSProperties } from "react";

import type { ShortSystem } from "@/components/QuotationV2/shortSystem";

type Language = "English" | "Malayalam";

const FONT =
  'var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

const GRID_LINE = "1px solid rgba(204,205,208,0.63)";
const ORANGE = "rgb(248,138,34)";
const GREEN = "rgb(21,128,61)";
const BATTERY_BG = "rgb(253,248,242)";

const LABELS: Record<Language, {
  structureCost: string;
  items: string;
  size: (kw: number) => string;
  total: string;
  subsidyAmount: string;
  afterSubsidy: string;
  title: string;
  subtitle: string;
  costPreSubsidy: string;
  cost: string;
  subsidy: string;
  investment: string;
  payback: string;
  emi: (years: number, rate: string) => string;
  perMonth: string;
}> = {
  English: {
    structureCost: "Additional Structure cost (if needed)",
    items: "Items",
    size: (kw) => `${kw} kW Solar System`,
    total: "Total System Cost",
    subsidyAmount: "Subsidy Amount",
    afterSubsidy: "Total System Cost After Subsidy",
    title: "Your Investment Summary",
    subtitle: "A controlled, predictable, one-time decision",
    costPreSubsidy: "System Cost (Pre-Subsidy)",
    cost: "System Cost",
    subsidy: "PM Surya Ghar Subsidy",
    investment: "Your Investment",
    payback: "Payback Period",
    emi: (years, rate) => `EMI Option (${years}yr, ~${rate})`,
    perMonth: "/month",
  },
  Malayalam: {
    structureCost: "അധിക Structure Cost (ആവശ്യമെങ്കിൽ)",
    items: "ഇനങ്ങൾ",
    size: (kw) => `${kw} kW Solar System`,
    total: "Total System Cost",
    subsidyAmount: "Subsidy Amount",
    afterSubsidy: "Total System Cost After Subsidy",
    title: "നിങ്ങളുടെ നിക്ഷേപത്തിന്റെ സംഗ്രഹം",
    subtitle: "ഒറ്റ തീരുമാനം — വർഷങ്ങളോളം ലാഭം",
    costPreSubsidy: "സിസ്റ്റത്തിന്റെ മൊത്തം വില (സബ്‌സിഡിക്ക് മുമ്പ്)",
    cost: "സിസ്റ്റത്തിന്റെ മൊത്തം വില",
    subsidy: "പി.എം. സൂര്യ ഘർ സബ്‌സിഡി",
    investment: "നിങ്ങളുടെ നിക്ഷേപം",
    payback: "നിക്ഷേപം തിരികെ ലഭിക്കാൻ വേണ്ട സമയം",
    emi: (years, rate) => `EMI പദ്ധതി (${years}വർഷം, ഏകദേശം ${rate})`,
    perMonth: "/മാസം",
  },
};

const text = (fontSize: number, fontWeight: number, color: string, extra?: CSSProperties): CSSProperties => ({
  fontFamily: FONT,
  fontSize,
  fontWeight,
  color,
  letterSpacing: "-0.3px",
  ...extra,
});

// ── Page 7 ──────────────────────────────────────────────────────────────────

function SpecRow({
  label,
  value,
  background,
  labelStyle,
  valueStyle,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  background?: string;
  labelStyle: CSSProperties;
  valueStyle: CSSProperties;
}) {
  const cellStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "0 20px",
    backgroundColor: background,
    borderBottom: GRID_LINE,
  };
  return (
    <>
      <div style={cellStyle}>
        <span style={labelStyle}>{label}</span>
      </div>
      <div style={cellStyle}>{typeof value === "string" ? <span style={valueStyle}>{value}</span> : value}</div>
    </>
  );
}

export function ShortSystemSpecTable({
  system,
  subsidyAmount,
  language,
  height = 1582,
}: {
  system: ShortSystem;
  height?: number;
  /** Omitted when no subsidy applies: the table then ends on the total. */
  subsidyAmount?: string;
  language: Language;
}) {
  const l = LABELS[language];
  const labelText = text(23, 500, "var(--text-2)", { lineHeight: "28px" });
  const valueText = text(23, 500, "var(--black)", { lineHeight: "28px" });
  const moneyLabel = text(26, 600, "var(--black)", { lineHeight: "30px" });
  const moneyValue = text(28, 600, "var(--2-2)", { lineHeight: "32px" });
  const white = "rgb(255,255,255)";
  const finalLabel = { ...moneyLabel, color: white };
  const finalValue = { ...moneyValue, color: white };

  return (
    <div
      style={{
        position: "relative",
        width: 1274,
        height,
        display: "grid",
        gridTemplateColumns: "556px 1fr",
        gridAutoRows: "1fr",
        flexShrink: 0,
      }}
    >
      <SpecRow
        label={l.items}
        labelStyle={text(23, 600, "rgb(0,0,0)", { lineHeight: "28px" })}
        valueStyle={valueText}
        value={
          <>
            <span style={text(23, 600, "rgb(0,0,0)", { lineHeight: "30px" })}>{system.name}</span>
            <span style={text(20, 400, "var(--grey)", { lineHeight: "26px" })}>{l.size(system.sizeKW)}</span>
          </>
        }
      />
      {system.specs.map((spec) => (
        <SpecRow
          key={spec.label.English}
          label={spec.label[language]}
          value={spec.value}
          background={spec.emphasis ? BATTERY_BG : undefined}
          labelStyle={spec.emphasis ? { ...labelText, fontWeight: 600 } : labelText}
          valueStyle={spec.emphasis ? { ...valueText, fontWeight: 600 } : valueText}
        />
      ))}
      {subsidyAmount ? (
        <>
          <SpecRow label={l.total} value={system.tier.total} background="var(--light-grey)" labelStyle={moneyLabel} valueStyle={moneyValue} />
          <SpecRow label={l.subsidyAmount} value={subsidyAmount} background="var(--light-grey)" labelStyle={moneyLabel} valueStyle={moneyValue} />
          <SpecRow label={l.afterSubsidy} value={system.tier.final} background="var(--green-2)" labelStyle={finalLabel} valueStyle={finalValue} />
        </>
      ) : (
        <SpecRow label={l.total} value={system.tier.total} background="var(--green-2)" labelStyle={finalLabel} valueStyle={finalValue} />
      )}
    </div>
  );
}

// ── Page 8 ──────────────────────────────────────────────────────────────────

const summaryRow: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 16,
};

export function ShortSystemSummary({
  system,
  emiYears,
  subsidyAmount,
  language,
}: {
  system: ShortSystem;
  emiYears: number;
  /** Omitted when no subsidy applies. */
  subsidyAmount?: string;
  language: Language;
}) {
  const l = LABELS[language];
  const { tier } = system;
  const label = text(26, 400, "var(--grey)", { lineHeight: "34px" });
  const value = text(26, 600, "rgb(17,24,39)", { lineHeight: "34px", whiteSpace: "nowrap" });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px 80px",
        boxSizing: "border-box",
        flexShrink: 0,
        alignSelf: "stretch",
      }}
    >
      <span style={text(42, 700, "rgb(17,24,39)", { lineHeight: "56px", textAlign: "center" })}>{l.title}</span>
      <span style={text(22, 400, "var(--grey)", { lineHeight: "32px", marginTop: 6, textAlign: "center" })}>
        {l.subtitle}
      </span>

      <div
        style={{
          width: 1018,
          marginTop: 36,
          overflow: "hidden",
          borderRadius: 16,
          backgroundColor: "rgb(255,255,255)",
          border: "1px solid rgb(229,231,235)",
          boxShadow: "0px 4px 6px 0px rgba(0,0,0,0.1), 0px 10px 15px 0px rgba(0,0,0,0.1)",
          boxSizing: "border-box",
        }}
      >
        <div
          style={text(27, 700, "rgb(255,255,255)", {
            textAlign: "center",
            lineHeight: "80px",
            backgroundColor: ORANGE,
          })}
        >
          {system.name} — {l.size(system.sizeKW)}
        </div>

        <div style={{ padding: "32px 32px 28px", display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={summaryRow}>
            <span style={label}>{subsidyAmount ? l.costPreSubsidy : l.cost}</span>
            <span style={value}>{tier.total}</span>
          </div>
          {subsidyAmount && (
            <div style={summaryRow}>
              <span style={label}>{l.subsidy}</span>
              <span style={value}>− {subsidyAmount}</span>
            </div>
          )}
          <div style={{ ...summaryRow, borderTop: "1px solid rgb(229,231,235)", paddingTop: 20 }}>
            <span style={text(28, 700, "rgb(18,53,50)", { lineHeight: "36px" })}>{l.investment}</span>
            <span style={text(30, 700, ORANGE, { lineHeight: "36px", whiteSpace: "nowrap" })}>{tier.final}</span>
          </div>
          <div style={{ ...summaryRow, borderTop: "1px solid rgb(229,231,235)", paddingTop: 20 }}>
            <span style={label}>{l.payback}</span>
            <span style={value}>~{system.paybackYears} years</span>
          </div>
          <div
            style={{
              ...summaryRow,
              borderRadius: 12,
              backgroundColor: "rgba(22,163,74,0.15)",
              border: "1px solid rgba(22,163,74,0.25)",
              padding: "18px 24px",
            }}
          >
            <span style={text(24, 400, "var(--grey)", { lineHeight: "30px" })}>{l.emi(emiYears, tier.emiRate)}</span>
            <span style={text(26, 700, GREEN, { lineHeight: "30px", whiteSpace: "nowrap" })}>
              ~{tier.emi}
              {l.perMonth}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Under Required Documents, in the white space above the footer. */
export function ShortStructureCost({ language }: { language: Language }) {
  return (
    <div style={{ alignSelf: "stretch", padding: "0 80px", flexShrink: 0 }}>
      <div style={{ borderLeft: `3px solid ${ORANGE}`, paddingLeft: 16 }}>
        <span style={text(22, 400, "var(--grey)", { lineHeight: "32px", display: "block" })}>
          {LABELS[language].structureCost}
        </span>
        <span style={text(24, 600, "rgb(18,53,50)", { lineHeight: "32px", display: "block" })}>₹4,500/kW</span>
      </div>
    </div>
  );
}
