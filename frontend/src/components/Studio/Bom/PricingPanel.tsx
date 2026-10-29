"use client";

// src/components/Studio/Bom/PricingPanel.tsx
//
// Step 3: what the customer pays, and -- only for roles holding pricing_internal.view --
// what it costs us. The two are deliberately separate cards: the customer-facing ladder
// is what a sales person reads out, and the cost ladder is not theirs to quote from.

import type { BomQuoteResponse } from "@/services/bomStaffService";
import { Card, CardHeader, CardTitle } from "../shared/primitives";
import { studioColors, studioFonts } from "../shared/format";
import { inr, PriceNotConfigured, Stat } from "./shared";

export default function PricingPanel({ result }: { result: BomQuoteResponse }) {
  const p = result.pricing;
  // A dispatch body has no pricing block at all. That reaches here for one render
  // when the tab is switched back to Quotation, before the refetch lands -- the
  // result in hand is still the picking list.
  if (!p) return null;
  // No market rate means no price to quote. `customer_price` still carries a number in
  // that case -- the engine falls back to cost-plus -- and showing it to a sales person
  // as if it were a price is the one mistake this screen must not make, so the rate
  // itself is the test, exactly as the source does it (App.jsx:4917).
  if (p.market_rate <= 0) return <PriceNotConfigured />;

  const hasDiscount = p.discount_amt > 0;
  const hasSubsidy = p.subsidy_amt > 0;
  // The list price can sit above the price-list rate when the sales person has swapped in
  // costlier parts. Showing the drift, rather than only the result, is what lets them see
  // they have moved off the configuration the rate was set for.
  const drift = Math.round(p.customer_price - p.market_rate);

  return (
    <Card>
      <CardHeader>
        <CardTitle>What the customer pays</CardTitle>
      </CardHeader>
      <div className="flex flex-col gap-3 p-4">
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Price list rate" value={inr(p.market_rate)} tone="muted" />
          {drift !== 0 && (
            <Stat
              label={drift > 0 ? "Component upgrades" : "Component savings"}
              value={`${drift > 0 ? "+" : "−"} ${inr(Math.abs(drift))}`}
              tone={drift > 0 ? "danger" : "positive"}
            />
          )}
          <Stat label="List price" value={inr(p.customer_price)} />
          {hasDiscount && (
            <Stat label={p.discount_label || "Discount"} value={`− ${inr(p.discount_amt)}`} tone="positive" />
          )}
          <Stat label="Price" value={inr(p.final_price)} strong={!hasSubsidy} />
          {hasSubsidy && <Stat label={p.subsidy_label || "Subsidy"} value={`− ${inr(p.subsidy_amt)}`} tone="positive" />}
        </dl>

        {hasSubsidy ? (
          <div
            style={{
              padding: "12px 14px",
              borderRadius: 12,
              background: studioColors.tealDeep,
            }}
          >
            <p style={{ fontSize: 11.5, color: "rgba(255,255,255,.7)", margin: 0 }}>Customer pays after subsidy</p>
            <p
              style={{
                fontSize: 26,
                fontWeight: 700,
                fontFamily: studioFonts.num,
                color: studioColors.gold,
                margin: "2px 0 0",
              }}
            >
              {inr(p.price_after_subsidy)}
            </p>
          </div>
        ) : (
          // No subsidy is a fact worth stating: a quote that silently omits it invites
          // "where is my ₹78,000?" later. The source shows the reason too.
          <p style={{ fontSize: 12, color: studioColors.mutedGray, margin: 0 }}>
            {p.subsidy_label || "No subsidy applies to this configuration."}
          </p>
        )}
      </div>
    </Card>
  );
}

/**
 * Cost and margin. Rendered only when the API sent them, which it does for callers
 * holding `pricing_internal.view` -- so the gate is the API's, not the browser's.
 */
export function CostPanel({ result }: { result: BomQuoteResponse }) {
  const cost = result.cost_breakdown;
  const totals = result.totals;
  // `pricing` joins these: a dispatch body carries none of the three, and this
  // panel is margin, which must never render from a half-populated body.
  if (!cost || !totals || !result.pricing) return null;

  const structure = cost.structure_base + cost.structure_extra + cost.structure_labor + cost.structure_repair;
  const composite = totals.pre_gst_subtotal !== null;
  const margin = result.pricing.customer_price - totals.grand_total;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cost and margin · internal</CardTitle>
      </CardHeader>
      <div className="flex flex-col gap-3 p-4">
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Material ex-GST" value={inr(totals.material_ex_gst)} />
          <Stat label={composite ? "GST (composite)" : "GST"} value={inr(totals.gst_total)} />
          <Stat label="Install" value={inr(cost.install)} />
          <Stat label="Service" value={inr(cost.service)} />
          <Stat label="Transport" value={inr(cost.transport)} />
          <Stat label="Misc + office" value={inr(cost.misc + cost.office)} />
          <Stat label="Structure" value={inr(structure)} />
          <Stat label="Our margin" value={inr(totals.margin)} />
        </dl>
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Cost-plus total" value={inr(totals.grand_total)} strong />
          <Stat
            label="Against list price"
            value={`${margin >= 0 ? "+" : ""}${inr(margin)}`}
            tone={margin >= 0 ? "positive" : "danger"}
            strong
          />
        </dl>
        {margin < 0 && (
          <p style={{ fontSize: 12, fontWeight: 600, color: studioColors.danger, margin: 0 }}>
            The list price is below our cost for this configuration.
          </p>
        )}
      </div>
    </Card>
  );
}
