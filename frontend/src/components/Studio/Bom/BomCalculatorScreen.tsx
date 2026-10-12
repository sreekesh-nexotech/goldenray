"use client";

// src/components/Studio/Bom/BomCalculatorScreen.tsx
//
// Internal BOM calculator: pick system type/size/tier and commercial inputs,
// get the bill of materials with pricing from the platform's staff API. Cost
// breakdown and margin appear only when the API returns them
// (`pricing_internal.view`).

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Card, CardHeader, CardTitle, FieldLabel, PageHeader, SelectField, TextInput, thStyle, tdStyle } from "../shared/primitives";
import {
  BomApiError,
  getBomQuoteOptions,
  runBomQuote,
  type BomAmountType,
  type BomQuoteOptions,
  type BomQuoteRequest,
  type BomQuoteResponse,
  type BomStructureType,
  type BomSubsidyType,
  type BomSystemType,
  type BomTier,
} from "@/services/bomStaffService";

const inr = (n: number) => `₹${Math.round(n || 0).toLocaleString("en-IN")}`;
const SYSTEM_LABEL: Record<BomSystemType, string> = { ongrid: "On-grid", hybrid: "Hybrid", upgrade: "Upgrade" };

interface Inputs {
  sysType: BomSystemType;
  size: string;
  tier: BomTier;
  batConfig: string;
  distKm: string;
  structure: BomStructureType;
  subsidy: BomSubsidyType;
  ghsHouses: string;
  offerId: string;
  marginType: BomAmountType;
  marginVal: string;
  upgradeFrom: string;
  upgradeTo: string;
}

const DEFAULTS: Inputs = {
  sysType: "ongrid", size: "3", tier: "base", batConfig: "0", distKm: "100", structure: "flatRoof", subsidy: "none",
  ghsHouses: "1", offerId: "", marginType: "percent", marginVal: "20", upgradeFrom: "3", upgradeTo: "5",
};

function toRequest(i: Inputs): BomQuoteRequest {
  const req: BomQuoteRequest = {
    sys_type: i.sysType,
    size: i.size,
    tier: i.tier,
    bat_config: i.batConfig,
    dist_km: Number(i.distKm) || 0,
    structure_type: i.structure,
    subsidy_type: i.subsidy,
    ghs_houses: Math.max(1, Math.floor(Number(i.ghsHouses) || 1)),
    selected_offer_id: i.offerId || null,
    margin_type: i.marginType,
    margin_val: Number(i.marginVal) || 0,
  };
  if (i.sysType === "upgrade") {
    req.upgrade_from_kw = Number(i.upgradeFrom) || 3;
    req.upgrade_to_kw = Number(i.upgradeTo) || 5;
    req.size = String(req.upgrade_to_kw);
  }
  return req;
}

export default function BomCalculatorScreen() {
  return (
    <div>
      <PageHeader title="BOM Calculator" subtitle="Bill of materials and pricing from the Flarize platform. Internal use only." />
      <Calculator />
    </div>
  );
}

function Calculator() {
  const [options, setOptions] = useState<BomQuoteOptions | null>(null);
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS);
  const [result, setResult] = useState<BomQuoteResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const seq = useRef(0);

  const fail = useCallback((e: unknown) => {
    if (e instanceof BomApiError && e.status === 403) return setError("Your platform role does not include the BOM calculator (bom.view).");
    setError(e instanceof Error ? e.message : "Something went wrong.");
  }, []);

  useEffect(() => {
    getBomQuoteOptions().then(setOptions).catch(fail);
  }, [fail]);

  const sys = options?.system_types[inputs.sysType === "upgrade" ? "ongrid" : inputs.sysType];
  const set = <K extends keyof Inputs>(key: K, value: Inputs[K]) => setInputs((prev) => ({ ...prev, [key]: value }));

  // Keep size/tier/battery valid for the chosen system type.
  useEffect(() => {
    if (!sys || inputs.sysType === "upgrade") return;
    setInputs((prev) => ({
      ...prev,
      size: sys.sizes.some((s) => s.key === prev.size) ? prev.size : sys.sizes[0]?.key ?? prev.size,
      tier: sys.tiers.includes(prev.tier) ? prev.tier : sys.tiers[0] ?? prev.tier,
      batConfig: sys.battery_configs.includes(prev.batConfig) ? prev.batConfig : sys.battery_configs[0] ?? "0",
    }));
  }, [sys, inputs.sysType]);

  // Debounced recalculation; a stale response never overwrites a newer one.
  useEffect(() => {
    if (!options) return;
    const mine = ++seq.current;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const out = await runBomQuote(toRequest(inputs));
        if (mine === seq.current) {
          setResult(out);
          setError("");
        }
      } catch (e) {
        if (mine === seq.current) {
          setResult(null);
          fail(e);
        }
      } finally {
        if (mine === seq.current) setLoading(false);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [inputs, options, fail]);

  const offers = result?.available_offers ?? [];
  const sections = useMemo(() => {
    const groups = new Map<string, BomQuoteResponse["bom_lines"]>();
    for (const line of result?.bom_lines ?? []) groups.set(line.section, [...(groups.get(line.section) ?? []), line]);
    return [...groups.entries()];
  }, [result]);

  if (!options && !error) return <p>Loading options…</p>;

  return (
    <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
      <Card style={{ padding: 16, alignSelf: "start" }}>
        <div className="flex flex-col gap-3">
          <div>
            <FieldLabel>System type</FieldLabel>
            <SelectField value={inputs.sysType} onChange={(v) => set("sysType", v as BomSystemType)} ariaLabel="System type">
              {(["ongrid", "hybrid", "upgrade"] as BomSystemType[]).map((t) => (
                <option key={t} value={t}>{SYSTEM_LABEL[t]}</option>
              ))}
            </SelectField>
          </div>
          {inputs.sysType === "upgrade" ? (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <FieldLabel>From kW</FieldLabel>
                <TextInput type="number" value={inputs.upgradeFrom} onChange={(v) => set("upgradeFrom", v)} ariaLabel="Upgrade from kW" />
              </div>
              <div>
                <FieldLabel>To kW</FieldLabel>
                <TextInput type="number" value={inputs.upgradeTo} onChange={(v) => set("upgradeTo", v)} ariaLabel="Upgrade to kW" />
              </div>
            </div>
          ) : (
            <div>
              <FieldLabel>Size</FieldLabel>
              <SelectField value={inputs.size} onChange={(v) => set("size", v)} ariaLabel="Size">
                {(sys?.sizes ?? []).map((s) => (
                  <option key={s.key} value={s.key}>{s.label}</option>
                ))}
              </SelectField>
            </div>
          )}
          <div>
            <FieldLabel>Tier</FieldLabel>
            <SelectField value={inputs.tier} onChange={(v) => set("tier", v as BomTier)} ariaLabel="Tier">
              {(sys?.tiers ?? ["base", "value", "premium"]).map((t) => (
                <option key={t} value={t}>{t[0].toUpperCase() + t.slice(1)}</option>
              ))}
            </SelectField>
          </div>
          {inputs.sysType === "hybrid" && (
            <div>
              <FieldLabel>Battery band</FieldLabel>
              <SelectField value={inputs.batConfig} onChange={(v) => set("batConfig", v)} ariaLabel="Battery band">
                {(sys?.battery_configs ?? ["0", "1", "2"]).map((b) => (
                  <option key={b} value={b}>Band {b}</option>
                ))}
              </SelectField>
            </div>
          )}
          <div>
            <FieldLabel>Structure</FieldLabel>
            <SelectField value={inputs.structure} onChange={(v) => set("structure", v as BomStructureType)} ariaLabel="Structure">
              {(options?.structure_types ?? []).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </SelectField>
          </div>
          <div>
            <FieldLabel>Distance (km)</FieldLabel>
            <TextInput type="number" value={inputs.distKm} onChange={(v) => set("distKm", v)} ariaLabel="Distance in km" />
          </div>
          <div>
            <FieldLabel>Subsidy</FieldLabel>
            <SelectField value={inputs.subsidy} onChange={(v) => set("subsidy", v as BomSubsidyType)} ariaLabel="Subsidy">
              {(options?.subsidy_types ?? []).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </SelectField>
          </div>
          {inputs.subsidy === "ghs" && (
            <div>
              <FieldLabel>GHS houses</FieldLabel>
              <TextInput type="number" value={inputs.ghsHouses} onChange={(v) => set("ghsHouses", v)} ariaLabel="GHS houses" />
            </div>
          )}
          <div>
            <FieldLabel>Offer</FieldLabel>
            <SelectField value={inputs.offerId} onChange={(v) => set("offerId", v)} ariaLabel="Offer">
              <option value="">No offer</option>
              {offers.map((o) => (
                <option key={o.offer_id} value={o.offer_id}>{o.name}</option>
              ))}
            </SelectField>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <FieldLabel>Margin type</FieldLabel>
              <SelectField value={inputs.marginType} onChange={(v) => set("marginType", v as BomAmountType)} ariaLabel="Margin type">
                <option value="percent">Percent</option>
                <option value="flat">Flat ₹</option>
              </SelectField>
            </div>
            <div>
              <FieldLabel>Margin</FieldLabel>
              <TextInput type="number" value={inputs.marginVal} onChange={(v) => set("marginVal", v)} ariaLabel="Margin value" />
            </div>
          </div>
        </div>
      </Card>

      <div className="flex min-w-0 flex-col gap-4">
        {error && (
          <p role="alert" style={{ color: "#b42318", fontSize: 13.5 }}>
            {error}
          </p>
        )}
        {result && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Pricing {loading && "…"}</CardTitle>
              </CardHeader>
              <dl className="grid grid-cols-2 gap-3 p-4 text-sm sm:grid-cols-4">
                <Stat label="Market rate" value={inr(result.pricing.market_rate)} />
                <Stat label="Customer price" value={inr(result.pricing.customer_price)} />
                <Stat label={result.pricing.discount_label || "Discount"} value={`− ${inr(result.pricing.discount_amt)}`} />
                <Stat label="Final price" value={inr(result.pricing.final_price)} />
                <Stat label={result.pricing.subsidy_label || "Subsidy"} value={`− ${inr(result.pricing.subsidy_amt)}`} />
                <Stat label="After subsidy" value={inr(result.pricing.price_after_subsidy)} strong />
              </dl>
            </Card>

            {result.cost_breakdown && result.totals && (
              <Card>
                <CardHeader>
                  <CardTitle>Cost and margin (internal)</CardTitle>
                </CardHeader>
                <dl className="grid grid-cols-2 gap-3 p-4 text-sm sm:grid-cols-4">
                  <Stat label="Material incl. GST" value={inr(result.totals.material_with_gst)} />
                  <Stat label="Install" value={inr(result.cost_breakdown.install)} />
                  <Stat label="Service" value={inr(result.cost_breakdown.service)} />
                  <Stat label="Transport" value={inr(result.cost_breakdown.transport)} />
                  <Stat label="Misc + office" value={inr(result.cost_breakdown.misc + result.cost_breakdown.office)} />
                  <Stat label="Structure" value={inr(result.cost_breakdown.structure_base + result.cost_breakdown.structure_extra + result.cost_breakdown.structure_labor + result.cost_breakdown.structure_repair)} />
                  <Stat label="Margin" value={inr(result.totals.margin)} />
                  <Stat label="Cost-plus total" value={inr(result.totals.grand_total)} strong />
                </dl>
              </Card>
            )}

            <Card style={{ overflowX: "auto" }}>
              <CardHeader>
                <CardTitle>Bill of materials ({result.bom_lines.length} lines)</CardTitle>
              </CardHeader>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Item</th>
                    <th style={thStyle}>Qty</th>
                    <th style={{ ...thStyle, textAlign: "right" }}>Unit price</th>
                    <th style={{ ...thStyle, textAlign: "right" }}>GST</th>
                    <th style={{ ...thStyle, textAlign: "right" }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {sections.map(([section, lines]) => (
                    <SectionRows key={section} section={section} lines={lines} />
                  ))}
                </tbody>
              </table>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

function SectionRows({ section, lines }: { section: string; lines: BomQuoteResponse["bom_lines"] }) {
  return (
    <>
      <tr>
        <td colSpan={5} style={{ ...tdStyle, fontWeight: 600, textTransform: "capitalize", background: "rgba(248,242,225,.35)" }}>
          {section || "Items"}
        </td>
      </tr>
      {lines.map((l) => (
        <tr key={`${l.pos}-${l.name}`}>
          <td style={tdStyle}>
            {l.name}
            {l.brand && <span style={{ opacity: 0.6 }}> · {l.brand}</span>}
          </td>
          <td style={tdStyle}>{l.qty} {l.unit}</td>
          <td style={{ ...tdStyle, textAlign: "right" }}>{inr(l.unit_price)}</td>
          <td style={{ ...tdStyle, textAlign: "right" }}>{l.gst_pct}%</td>
          <td style={{ ...tdStyle, textAlign: "right" }}>{inr(l.amount)}</td>
        </tr>
      ))}
    </>
  );
}

function Stat({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div>
      <dt style={{ fontSize: 11.5, opacity: 0.65 }}>{label}</dt>
      <dd style={{ fontSize: strong ? 18 : 15, fontWeight: strong ? 700 : 600 }}>{value}</dd>
    </div>
  );
}
