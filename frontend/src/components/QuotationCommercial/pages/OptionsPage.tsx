// Page 3 — the three packages, depreciation note and service comparison.
import { CircleCheck, CircleMinus, Info } from "lucide-react";

import { HybridServicePromise } from "@/components/QuotationV2/HybridBlocks";
import { PackageCards } from "@/components/QuotationV2/PricingBlocks";
import { COMMERCIAL_HYBRID_NAMES } from "../specRows";
import { CommercialPage, GREEN, INK, ORANGE, PageTitle, RULE, text } from "../shared";
import type { CommercialPageProps } from "./types";

const PACKAGE_NAMES = ["Elite System", "Smart System", "Essential"];

function ComparisonGrid({ copy }: Pick<CommercialPageProps, "copy">) {
  const c = copy.options;
  const cell = { display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" } as const;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "318px repeat(3, 1fr)",
        gridAutoRows: "minmax(70px, auto)",
        width: 1274,
        flexShrink: 0,
      }}
    >
      <div style={{ gridColumn: "1 / -1", display: "contents" }}>
        {[c.items, ...PACKAGE_NAMES].map((name, i) => (
          <div
            key={name}
            style={{
              ...cell,
              justifyContent: i === 0 ? "flex-start" : "center",
              padding: i === 0 ? "0 20px" : 0,
              height: 76,
              backgroundColor: "rgb(243,244,246)",
              borderRadius: i === 0 ? "12px 0 0 0" : i === 3 ? "0 12px 0 0" : 0,
            }}
          >
            <span style={text(25, 600, "rgb(0,0,0)")}>{name}</span>
          </div>
        ))}
      </div>
      {c.comparison.map((row) => (
        <div key={row.label} style={{ display: "contents" }}>
          <div style={{ display: "flex", alignItems: "center", padding: "6px 20px", borderBottom: RULE }}>
            <span style={text(24, 500, "rgb(68,68,68)", { lineHeight: "24px" })}>{row.label}</span>
          </div>
          {row.values.map((value, i) => (
            <div key={i} style={{ ...cell, padding: "6px 8px", borderBottom: RULE, borderLeft: RULE }}>
              {value === true ? (
                <CircleCheck size={28} color="white" fill={GREEN} strokeWidth={2.2} />
              ) : value === false ? (
                <CircleMinus size={28} color="white" fill="rgb(191,191,191)" strokeWidth={2.2} />
              ) : (
                <span style={text(23, 500, "rgb(26,26,26)", { lineHeight: "24px" })}>{value}</span>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function OptionsPage({ data, copy, language }: CommercialPageProps) {
  const c = copy.options;
  const hybrid = Boolean(data.hybrid);
  return (
    <CommercialPage>
      <PageTitle>{c.title}</PageTitle>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 34, paddingTop: 18, flexShrink: 0 }}>
        <PackageCards
          data={data}
          language={language}
          wording={{
            subtitle: c.size(parseFloat(data.systemSize) || 5),
            amountLabel: hybrid ? c.loanAmount : c.amountPayable,
            emiNote: c.emiNote,
            names: COMMERCIAL_HYBRID_NAMES,
          }}
        />

        <div
          style={{
            width: 1274,
            boxSizing: "border-box",
            border: "2px solid rgb(229,231,235)",
            borderRadius: 14,
            padding: "16px 22px",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Info size={26} color="white" fill={ORANGE} strokeWidth={2.4} />
            <span style={text(23, 600, INK, { lineHeight: "32px" })}>{c.depreciationTitle}</span>
          </div>
          <p style={text(22, 400, "rgb(68,68,68)", { lineHeight: "30px", margin: "4px 0 0" })}>{c.depreciation}</p>
        </div>

        {hybrid ? <HybridServicePromise language={language} /> : <ComparisonGrid copy={copy} />}
      </div>
    </CommercialPage>
  );
}
