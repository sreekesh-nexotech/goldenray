// Page 9 — the recommended package, offer and booking promises.
import { Fragment } from "react";

import NotoLightBulb from "@/components/QuotationV2/icons/NotoLightBulb";
import { InvestmentSummaryCard, OfferBanner } from "@/components/QuotationV2/PricingBlocks";
import TrustStrip from "../TrustStrip";
import { CommercialPage, INK, PageTitle, text } from "../shared";
import type { CommercialPageProps } from "./types";

const RATING_BADGES = [
  { className: "fig-asset-8b319f8907bd6fc0", width: 94, height: 92 },
  { className: "fig-asset-67f845a3da270fe1-f735f282", width: 150, height: 113 },
  { className: "fig-asset-2c1b68d43856ffd7", width: 92, height: 92 },
];

export default function SummaryPage({ data, copy, language }: CommercialPageProps) {
  const c = copy.summary;
  const sizeKW = parseFloat(data.systemSize) || 5;
  return (
    <CommercialPage>
      <PageTitle>{c.title}</PageTitle>
      <div style={text(22, 400, "rgb(100,110,125)", { textAlign: "center", lineHeight: "34px", marginTop: 6, flexShrink: 0 })}>
        {c.subtitle}
      </div>

      <div style={{ display: "flex", justifyContent: "center", paddingTop: 30, flexShrink: 0 }}>
        <InvestmentSummaryCard
          data={data}
          language={language}
          headline={data.hybrid ? c.hybridHeadline(sizeKW) : c.smartHeadline(sizeKW)}
        />
      </div>

      {/* The hybrid upsell; a hybrid quote is already that system. */}
      {!data.hybrid && (
        <div
          style={{
            margin: "36px 80px 0",
            padding: "22px 40px 26px",
            borderRadius: 12,
            backgroundColor: "var(--sec)",
            textAlign: "center",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <NotoLightBulb style={{ zoom: 1.75 }} />
            <span style={text(32, 700, "rgb(255,255,255)", { lineHeight: "42px" })}>{c.backupTitle}</span>
          </div>
          <div style={text(24, 400, "rgb(194,194,194)", { lineHeight: "30px", marginTop: 6 })}>
            {c.backupBefore}
            <span style={{ fontWeight: 500, color: "rgb(243,244,246)" }}>{c.backupStrong}</span>
            {c.backupAfter}
          </div>
        </div>
      )}

      <div style={{ marginTop: 36, display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <OfferBanner offer={data.offer} language={language} />
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 170, marginTop: 40, flexShrink: 0 }}>
        {RATING_BADGES.map(({ className, width, height }) => (
          <div key={className} className={className} style={{ width, height }} />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 48, marginTop: 14, flexShrink: 0 }}>
        {c.ratings.map((rating, i) => (
          <Fragment key={rating}>
            {i > 0 && <span style={text(24, 500, INK)}>|</span>}
            <span
              style={text(24, 500, INK, {
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              })}
            >
              {rating}
            </span>
          </Fragment>
        ))}
      </div>

      <div style={{ marginTop: "auto", flexShrink: 0 }}>
        <TrustStrip />
      </div>
    </CommercialPage>
  );
}
