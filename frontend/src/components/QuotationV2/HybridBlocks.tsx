/**
 * The two blocks a hybrid quotation swaps in, shared by the English and
 * Malayalam pages (copy lives in `hybrid.ts`):
 *
 *   - page 5: "Our Hybrid Service Promise", in place of the on-grid service
 *     comparison grid under the package cards;
 *   - page 7: the specification table with the battery options as columns
 *     and an extra Battery row. Its cells copy the on-grid table's styles so
 *     the two documents look alike; rows share out the table's fixed height.
 */
import type { CSSProperties, ReactNode } from "react";
import {
  BadgePercent,
  CalendarClock,
  Headset,
  LifeBuoy,
  Settings,
  ShieldCheck,
  Siren,
  Star,
  Wrench,
} from "lucide-react";

import {
  HYBRID_KEYS,
  HYBRID_OPTION_NAMES,
  HYBRID_RECOMMENDED,
  HYBRID_SERVICES,
  HYBRID_SPEC_ROWS,
  type HybridKey,
  type HybridServiceIcon,
} from "@/components/QuotationV2/hybrid";

type Language = "English" | "Malayalam";

const FONT =
  'var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

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
  letterSpacing: "-0.500px",
  ...extra,
});

// ── Page 5: service promise ─────────────────────────────────────────────────

const PROMISE_BG = "rgb(234,244,236)";
const PROMISE_GREEN = "rgb(46,125,50)";
const PROMISE_RULE = "1px solid rgb(234,237,234)";

function SolarPanelIcon() {
  return (
    <svg width={34} height={34} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 3h16l2 11H2z" />
      <path d="M3 8.5h18" />
      <path d="M9.3 3 8.7 14" />
      <path d="m14.7 3 .6 11" />
      <path d="M12 14v5" />
      <path d="M8 21h8" />
    </svg>
  );
}

function InverterIcon() {
  return (
    <svg width={34} height={34} viewBox="0 0 24 24">
      <rect x={5} y={2.5} width={14} height={19} rx={2.5} fill="currentColor" />
      <rect x={9} y={10} width={6} height={2.6} rx={0.6} fill="rgb(255,255,255)" />
    </svg>
  );
}

function AuditIcon() {
  return (
    <svg width={34} height={34} viewBox="0 0 24 24" fill="currentColor">
      <rect x={4} y={11} width={4} height={9} rx={0.8} />
      <rect x={10} y={5} width={4} height={15} rx={0.8} />
      <rect x={16} y={8} width={4} height={12} rx={0.8} />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width={34} height={34} viewBox="0 0 24 24" fill="rgb(37,211,102)">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

const lucide = { size: 34, strokeWidth: 2 };

const SERVICE_ICONS: Record<HybridServiceIcon, ReactNode> = {
  installation: <Wrench {...lucide} />,
  response: <Headset {...lucide} />,
  warranty: <ShieldCheck {...lucide} />,
  emergencyVisit: <Siren {...lucide} />,
  whatsapp: <WhatsAppIcon />,
  maintenance: <Settings {...lucide} />,
  healthCheck: <CalendarClock {...lucide} />,
  panelCleaning: <SolarPanelIcon />,
  inverter: <InverterIcon />,
  priority: <Star {...lucide} fill="currentColor" />,
  audit: <AuditIcon />,
  emergencySupport: <LifeBuoy {...lucide} />,
  amc: <BadgePercent {...lucide} />,
};

export function HybridServicePromise({ language }: { language: Language }) {
  // An odd count leaves the last row's right-hand cell empty, as designed.
  const cells = HYBRID_SERVICES.length % 2 ? [...HYBRID_SERVICES, null] : HYBRID_SERVICES;
  const rows = cells.length / 2;
  const titleRule = (
    <span style={{ width: 290, height: 2, backgroundColor: "rgb(102,120,106)", flexShrink: 0 }} />
  );

  return (
    <div
      style={{
        position: "relative",
        width: 1274,
        boxSizing: "border-box",
        borderRadius: 20,
        backgroundColor: PROMISE_BG,
        padding: "26px 18px 18px",
        display: "flex",
        flexDirection: "column",
        gap: 22,
        flexShrink: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18 }}>
        {titleRule}
        <span style={text(32, 600, "rgb(17,17,17)", { lineHeight: "44px", whiteSpace: "nowrap" })}>
          Our Hybrid Service Promise
        </span>
        {titleRule}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          borderRadius: 14,
          overflow: "hidden",
          backgroundColor: "rgb(255,255,255)",
        }}
      >
        {cells.map((item, i) => {
          const lastRow = Math.floor(i / 2) === rows - 1;
          return (
            <div
              key={item ? item.icon : "empty"}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 22,
                height: 114,
                padding: "0 34px",
                boxSizing: "border-box",
                borderBottom: lastRow ? undefined : PROMISE_RULE,
                borderRight: i % 2 === 0 ? PROMISE_RULE : undefined,
              }}
            >
              {item && (
                <>
                  <span
                    style={{
                      width: 68,
                      height: 68,
                      borderRadius: "50%",
                      backgroundColor: PROMISE_BG,
                      color: PROMISE_GREEN,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {SERVICE_ICONS[item.icon]}
                  </span>
                  <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <span style={text(27, 500, "rgb(55,55,55)", { lineHeight: "36px" })}>
                      {item.title[language]}
                    </span>
                    {item.detail && (
                      <span style={text(19, 400, "rgb(107,114,128)", { lineHeight: "26px", letterSpacing: 0 })}>
                        {item.detail}
                      </span>
                    )}
                  </span>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Page 7: specification table ─────────────────────────────────────────────

interface TierFigures {
  total: string;
  downPayment: string;
  financed: string;
}

/** The fields the table reads; both languages' quotation data satisfy it. */
interface SpecTableData {
  hybrid: Record<HybridKey, TierFigures> | null;
  systemSize: string;
  downPaymentPercent: number;
  subsidyRowValue: string;
}

const TABLE_LABELS: Record<Language, {
  items: string;
  total: string;
  downPayment: (percent: number) => string;
  subsidy: string;
  financed: string;
}> = {
  English: {
    items: "Items",
    total: "Total System Cost",
    downPayment: (percent) => `Down Payment (${percent}%)`,
    subsidy: "Subsidy Amount",
    financed: "Amount Payable / Financed",
  },
  // The Malayalam on-grid table's own wording for the same rows.
  Malayalam: {
    items: "ഇനങ്ങൾ",
    total: "ആകെ സിസ്റ്റം വില",
    downPayment: (percent) => `ഡൗൺ പേയ്‌മെന്റ് (${percent}%)`,
    subsidy: "Subsidy തുക",
    financed: "അടയ്ക്കേണ്ട / ലോൺ തുക",
  },
};

const GRID_LINE = "rgba(204,205,208,0.63)";
const ORANGE = "rgb(248,138,34)";
const FEATURED_BG = "rgb(255,249,243)";
const BATTERY_BG = "rgb(253,248,242)";

/** One table cell; the recommended column is outlined in orange above its neighbours. */
function cell(
  row: number,
  column: number,
  { featured, background, padding = "24px 20px", first, outline }: {
    featured?: boolean;
    background?: string;
    padding?: string;
    first?: boolean;
    /** A full border in this colour instead of the grid lines (column headers). */
    outline?: string;
  },
): CSSProperties {
  return {
    gridRow: String(row),
    gridColumn: String(column),
    position: "relative",
    zIndex: featured ? 1 : undefined,
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    padding,
    boxSizing: "border-box",
    backgroundColor: featured ? FEATURED_BG : background,
    ...(featured || outline
      ? { border: `1px solid ${featured ? ORANGE : outline}` }
      : {
          borderTop: `1px solid ${GRID_LINE}`,
          borderRight: `1px solid ${GRID_LINE}`,
          borderBottom: `0.500px solid ${GRID_LINE}`,
          borderLeft: `${first ? "1px" : "0.500px"} solid ${GRID_LINE}`,
        }),
  };
}

export function HybridSpecTable({ data, language }: { data: SpecTableData; language: Language }) {
  if (!data.hybrid) return null;
  const hybrid = data.hybrid;
  const l = TABLE_LABELS[language] || TABLE_LABELS.English;
  const sizeKW = parseFloat(data.systemSize) || 5;
  const columns = HYBRID_KEYS.map((key, i) => ({ key, column: i + 2, featured: key === HYBRID_RECOMMENDED }));

  const labelText = text(21, 500, "var(--text-2)", { lineHeight: "24px", flexGrow: 1 });
  const valueText = text(21, 500, "var(--black)", { lineHeight: "23.5px", flexGrow: 1 });
  const moneyLabel = (weight: number, color = "var(--black)") =>
    text(26, weight, color, { lineHeight: "29px", flexGrow: 1 });
  const moneyValue = (color: string) => text(28, 600, color, { lineHeight: "31px", flexGrow: 1 });

  const firstMoneyRow = HYBRID_SPEC_ROWS.length + 2;
  const moneyRows: {
    label: string;
    labelStyle: CSSProperties;
    labelBackground?: string;
    background?: string;
    value: (key: HybridKey) => string;
    valueColor: string;
    green?: boolean;
  }[] = [
    {
      label: l.total,
      labelStyle: moneyLabel(600),
      labelBackground: "var(--light-grey)",
      background: "var(--light-grey)",
      value: (key) => hybrid[key].total,
      valueColor: "var(--2-2)",
    },
    {
      label: l.downPayment(data.downPaymentPercent),
      labelStyle: moneyLabel(400),
      labelBackground: "rgb(255,255,255)",
      background: "rgb(255,255,255)",
      value: (key) => hybrid[key].downPayment,
      valueColor: "var(--2-2)",
    },
    {
      label: l.subsidy,
      labelStyle: moneyLabel(600),
      labelBackground: "var(--light-grey)",
      background: "var(--light-grey)",
      value: () => data.subsidyRowValue,
      valueColor: "var(--green-2)",
    },
    {
      label: l.financed,
      labelStyle: moneyLabel(600, "rgb(255,255,255)"),
      labelBackground: "var(--green-2)",
      background: "var(--green-2)",
      value: (key) => hybrid[key].financed,
      valueColor: "rgb(255,255,255)",
      green: true,
    },
  ];

  return (
    <div
      style={{
        position: "relative",
        width: 1274,
        height: 1582,
        display: "grid",
        gridTemplateRows: `repeat(${firstMoneyRow + moneyRows.length - 1}, auto)`,
        gridTemplateColumns: "318.5px 1fr 1fr 1fr",
        flexShrink: 0,
      }}
    >
      {/* Header */}
      <div style={cell(1, 1, { first: true, padding: "28px 20px" })}>
        <span style={text(23, 600, "rgb(0,0,0)", { lineHeight: "25.5px", flexGrow: 1 })}>{l.items}</span>
      </div>
      {columns.map(({ key, column, featured }) => (
        <div
          key={key}
          style={cell(1, column, {
            featured,
            background: "rgb(255,255,255)",
            padding: "28px 20px",
            outline: "rgba(68,68,68,0.41)",
          })}
        >
          <span
            style={text(23, 600, featured ? ORANGE : "rgb(0,0,0)", {
              lineHeight: "29px",
              flexGrow: 1,
              whiteSpace: "pre-wrap",
            })}
          >
            {HYBRID_OPTION_NAMES[key]}
          </span>
        </div>
      ))}

      {/* Specifications */}
      {HYBRID_SPEC_ROWS.map((spec, i) => {
        const row = i + 2;
        const values = spec.values(sizeKW);
        const background = spec.emphasis ? BATTERY_BG : undefined;
        return [
          <div key={`${row}-label`} style={cell(row, 1, { first: true, background })}>
            <span style={spec.emphasis ? { ...labelText, fontWeight: 600 } : labelText}>
              {spec.label[language]}
            </span>
          </div>,
          ...columns.map(({ key, column, featured }) => (
            <div key={`${row}-${key}`} style={cell(row, column, { featured, background: background ?? "rgb(255,255,255)" })}>
              <span style={spec.emphasis ? { ...valueText, fontWeight: 600 } : valueText}>{values[key]}</span>
            </div>
          )),
        ];
      })}

      {/* Pricing */}
      {moneyRows.map((money, i) => {
        const row = firstMoneyRow + i;
        const padding = money.green ? "24px 20px" : "20px 20px";
        return [
          <div key={`${row}-label`} style={cell(row, 1, { first: true, background: money.labelBackground, padding })}>
            <span style={money.labelStyle}>{money.label}</span>
          </div>,
          ...columns.map(({ key, column, featured }) => (
            <div
              key={`${row}-${key}`}
              style={
                money.green
                  ? { ...cell(row, column, { background: money.background, padding }), zIndex: featured ? 1 : undefined }
                  : cell(row, column, { featured, background: money.background, padding })
              }
            >
              <span style={moneyValue(money.valueColor)}>{money.value(key)}</span>
            </div>
          )),
        ];
      })}
    </div>
  );
}
