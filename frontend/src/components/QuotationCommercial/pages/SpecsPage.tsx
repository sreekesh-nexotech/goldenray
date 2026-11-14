// Page 4 — technical specifications and the pricing table.
import { HYBRID_SPEC_ROWS } from "@/components/QuotationV2/hybrid";
import { SpecComparisonTable } from "@/components/QuotationV2/HybridBlocks";
import { ShortSystemSpecTable } from "@/components/QuotationV2/ShortSystemBlocks";
import { HYBRID_COLUMNS, ONGRID_COLUMNS, ONGRID_SPEC_ROWS } from "../specRows";
import { CommercialPage, FONT, INK, PageTitle, text } from "../shared";
import type { CommercialPageProps } from "./types";

/** The table fills the page down to the footer. */
const TABLE_HEIGHT = 1680;

export default function SpecsPage({ data, copy, language }: CommercialPageProps) {
  const c = copy.specs;
  const equivalent = c.equivalent(data.equivalentWatts);
  const common = {
    sizeKW: parseFloat(data.systemSize) || 5,
    downPaymentPercent: data.downPaymentPercent,
    language,
    height: c.subtitle ? TABLE_HEIGHT - 40 : TABLE_HEIGHT,
  };
  return (
    <CommercialPage>
      <PageTitle>
        {c.title}
        {equivalent && <span style={{ fontFamily: FONT, fontWeight: 400 }}>{`  ${equivalent}`}</span>}
      </PageTitle>
      {c.subtitle && (
        <div style={text(24, 500, INK, { textAlign: "center", lineHeight: "34px", flexShrink: 0 })}>{c.subtitle}</div>
      )}
      <div style={{ display: "flex", justifyContent: "center", paddingTop: 26, flexShrink: 0 }}>
        {data.short ? (
          <ShortSystemSpecTable system={data.short} language={language} height={common.height} />
        ) : data.hybrid ? (
          <SpecComparisonTable {...common} columns={HYBRID_COLUMNS} rows={HYBRID_SPEC_ROWS} figures={data.hybrid} />
        ) : (
          <SpecComparisonTable
            {...common}
            columns={ONGRID_COLUMNS}
            rows={ONGRID_SPEC_ROWS}
            figures={{ premium: data.premium, smart: data.smart, basic: data.basic }}
          />
        )}
      </div>
    </CommercialPage>
  );
}
