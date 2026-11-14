"use client";

// src/components/Studio/Bom/ConfigPanel.tsx
//
// Steps 1, 1b and 2 of the sales flow: what is being installed, what the modules are,
// and the configuration. The ordering follows Golden-Ray-BOM (App.jsx:2727-3050) so a
// sales person works through the same sequence in either tool.

import {
  type BomAmountType,
  type BomModuleDcr,
  type BomQuoteOptions,
  type BomStructureType,
  type BomSubsidyType,
  type BomSystemType,
  type BomTier,
} from "@/services/bomStaffService";
import { Card, SelectField, TextInput } from "../shared/primitives";
import { studioColors } from "../shared/format";
import { ChoiceCard, Field, Step } from "./shared";
import type { BomInputs } from "./inputs";
import { phaseAwareSize, sizeIsSelectable } from "./inputs";

const SYSTEM_CARDS: { key: BomSystemType; title: string; detail: string }[] = [
  { key: "ongrid", title: "On-grid", detail: "Grid-tied, no battery" },
  { key: "hybrid", title: "Hybrid", detail: "Battery backup" },
  { key: "upgrade", title: "Upgrade", detail: "Extend an existing system" },
];

const STRUCTURE_LABEL: Record<BomStructureType, string> = {
  flatRoof: "Flat roof",
  elevated: "Elevated",
  sheetRoof: "Sheet roof",
};

const SUBSIDY_LABEL: Record<BomSubsidyType, string> = {
  none: "No subsidy",
  residential: "PM Surya Ghar — Residential",
  ghs: "PM Surya Ghar — GHS / RWA",
};

export default function ConfigPanel({
  inputs,
  options,
  set,
  resolvedBattery,
}: {
  inputs: BomInputs;
  options: BomQuoteOptions | null;
  set: <K extends keyof BomInputs>(key: K, value: BomInputs[K]) => void;
  /**
   * The battery band the engine actually built, from `meta.bat_config`.
   *
   * The band is a property of the package, not a question for the person quoting: a
   * hybrid value package carries one battery because that is what the package is. When
   * the engine reports a band, this shows it instead of offering a choice that would be
   * overridden. Absent (no quote yet, or a deployment still pricing per line) the select
   * stays, because there the request really does decide.
   */
  resolvedBattery?: string | null;
}) {
  const sys = options?.system_types[inputs.sysType === "upgrade" ? "ongrid" : inputs.sysType];
  const sizes = sys?.sizes ?? [];
  const kwOptions = [3, 5, 6, 8, 10, 15, 20, 25, 30];
  const fromKw = Number(inputs.upgradeFrom) || 3;
  const isUpgrade = inputs.sysType === "upgrade";

  // Subsidy is unavailable on non-DCR modules, so the control is disabled rather than
  // silently returning zero -- the source does the same (App.jsx:4885).
  const subsidyEligible = inputs.moduleDcr === "dcr";

  return (
    <div className="flex flex-col gap-5">
      <Step n="1" title="Select installation type">
        <div className="flex flex-wrap gap-2">
          {SYSTEM_CARDS.map((card) => (
            <ChoiceCard
              key={card.key}
              active={inputs.sysType === card.key}
              title={card.title}
              detail={card.detail}
              onClick={() => set("sysType", card.key)}
            />
          ))}
        </div>
      </Step>

      <Step n="1b" title="Select module type" hint="decides subsidy eligibility">
        <div className="flex flex-wrap gap-2">
          <ChoiceCard
            active={inputs.moduleDcr === "dcr"}
            title="DCR modules"
            detail="Indian-made cells. Eligible for PM Surya Ghar."
            onClick={() => set("moduleDcr", "dcr" as BomModuleDcr)}
          />
          <ChoiceCard
            active={inputs.moduleDcr === "ndcr"}
            title="Non-DCR modules"
            detail="Lower module cost."
            warning="No PM Surya Ghar subsidy"
            onClick={() => set("moduleDcr", "ndcr" as BomModuleDcr)}
          />
        </div>
      </Step>

      <Step n="2" title="Configure the system">
        <Card style={{ padding: 14 }}>
          <div className="grid gap-3 sm:grid-cols-2">
            {isUpgrade ? (
              <>
                <Field label="Existing system" hint="what is installed today">
                  <SelectField
                    value={inputs.upgradeFrom}
                    onChange={(v) => {
                      set("upgradeFrom", v);
                      // Keep the target above the source, as the source does (App.jsx:105).
                      if (Number(v) >= Number(inputs.upgradeTo)) {
                        const next = kwOptions.find((k) => k > Number(v));
                        if (next) set("upgradeTo", String(next));
                      }
                    }}
                    ariaLabel="Existing system kW"
                  >
                    {kwOptions.filter((k) => k < Math.max(...kwOptions)).map((k) => (
                      <option key={k} value={k}>{k} kW</option>
                    ))}
                  </SelectField>
                </Field>
                <Field label="Target system" hint="after the upgrade">
                  <SelectField value={inputs.upgradeTo} onChange={(v) => set("upgradeTo", v)} ariaLabel="Target system kW">
                    {kwOptions.filter((k) => k > fromKw).map((k) => (
                      <option key={k} value={k}>{k} kW</option>
                    ))}
                  </SelectField>
                </Field>
              </>
            ) : (
              <>
                <Field label="House connection" hint="single- or three-phase supply">
                  <SelectField
                    value={inputs.housePhase}
                    onChange={(v) => {
                      const phase = v as BomInputs["housePhase"];
                      set("housePhase", phase);
                      // A phase change can invalidate the chosen size (3 kW is not
                      // offered on 3P, and 5sp/5tp swap) -- correct it rather than
                      // leaving an impossible configuration on screen.
                      const corrected = phaseAwareSize(inputs.size, phase, sizes.map((s) => s.key));
                      if (corrected !== inputs.size) set("size", corrected);
                    }}
                    ariaLabel="House connection phase"
                  >
                    <option value="1P">Single phase (1Φ)</option>
                    <option value="3P">Three phase (3Φ)</option>
                  </SelectField>
                </Field>
                <Field label="System size">
                  <SelectField value={inputs.size} onChange={(v) => set("size", v)} ariaLabel="System size">
                    {sizes.map((s) => {
                      const ok = sizeIsSelectable(s.key, inputs.housePhase);
                      return (
                        <option key={s.key} value={s.key} disabled={!ok}>
                          {s.label}
                          {ok ? "" : inputs.housePhase === "1P" ? " — needs 3Φ" : " — single-phase only"}
                        </option>
                      );
                    })}
                  </SelectField>
                </Field>
              </>
            )}

            <Field label="Package tier">
              <SelectField value={inputs.tier} onChange={(v) => set("tier", v as BomTier)} ariaLabel="Package tier">
                {(sys?.tiers ?? ["base", "value", "premium"]).map((t) => (
                  <option key={t} value={t}>{t[0].toUpperCase() + t.slice(1)}</option>
                ))}
              </SelectField>
            </Field>

            {inputs.sysType === "hybrid" && (
              resolvedBattery != null ? (
                <Field
                  label="Batteries"
                  hint={`Set by the ${inputs.tier} package, not chosen here.`}
                >
                  <p
                    style={{
                      margin: 0,
                      padding: "9px 11px",
                      borderRadius: 10,
                      background: "rgba(0,0,0,.03)",
                      fontSize: 13,
                      color: studioColors.tealDeep,
                    }}
                  >
                    {resolvedBattery === "0"
                      ? "No battery"
                      : `${resolvedBattery} battery${Number(resolvedBattery) > 1 ? " units" : ""}`}
                  </p>
                </Field>
              ) : (
                <Field label="Batteries" hint="how many units the customer is taking">
                  <SelectField value={inputs.batConfig} onChange={(v) => set("batConfig", v)} ariaLabel="Battery count">
                    {(sys?.battery_configs ?? ["0", "1", "2"]).map((b) => (
                      <option key={b} value={b}>{b === "0" ? "No battery" : `${b} battery`}</option>
                    ))}
                  </SelectField>
                </Field>
              )
            )}

            <Field label="Roof / structure">
              <SelectField
                value={inputs.structure}
                onChange={(v) => set("structure", v as BomStructureType)}
                ariaLabel="Structure type"
              >
                {(options?.structure_types ?? []).map((s) => (
                  <option key={s} value={s}>{STRUCTURE_LABEL[s] ?? s}</option>
                ))}
              </SelectField>
            </Field>

            <Field
              label="Distance (km)"
              hint={Number(inputs.distKm) > 100 ? `${Number(inputs.distKm) - 100} km beyond the included 100 km` : "first 100 km included"}
            >
              <TextInput type="number" value={inputs.distKm} onChange={(v) => set("distKm", v)} ariaLabel="Distance in km" />
            </Field>

            <Field label="Subsidy scheme" hint={subsidyEligible ? undefined : "unavailable on non-DCR modules"}>
              <SelectField
                value={subsidyEligible ? inputs.subsidy : "none"}
                onChange={(v) => set("subsidy", v as BomSubsidyType)}
                ariaLabel="Subsidy scheme"
                style={subsidyEligible ? undefined : { opacity: 0.5, pointerEvents: "none" }}
              >
                {(options?.subsidy_types ?? []).map((s) => (
                  <option key={s} value={s}>{SUBSIDY_LABEL[s] ?? s}</option>
                ))}
              </SelectField>
            </Field>

            {subsidyEligible && inputs.subsidy === "ghs" && (
              <Field label="Houses in the society" hint="3 kW of subsidy per house, capped at 500 kW">
                <TextInput type="number" value={inputs.ghsHouses} onChange={(v) => set("ghsHouses", v)} ariaLabel="Number of houses" />
              </Field>
            )}

            {/* Premium replaces the string inverter with one micro-inverter per panel, so
                the brand decides a whole accessory set. Hybrid is always Enphase -- its
                battery and system controller are Enphase parts -- so the choice is not
                offered there rather than being offered and ignored. */}
            {inputs.tier === "premium" && inputs.sysType === "ongrid" && (
              <Field label="Micro-inverter" hint="each brand brings its own accessories">
                <SelectField
                  value={inputs.microBrand}
                  onChange={(v) => set("microBrand", v as BomInputs["microBrand"])}
                  ariaLabel="Micro-inverter brand"
                >
                  <option value="enphase">Enphase</option>
                  <option value="hoymiles">Hoymiles</option>
                </SelectField>
              </Field>
            )}

            {inputs.tier === "premium" && inputs.sysType === "ongrid" && inputs.microBrand === "hoymiles" && (
              <Field label="Zero export" hint={inputs.zeroExport ? "DTU Pro — blocks export to the grid" : "DTU Lite — monitoring only"}>
                <SelectField
                  value={inputs.zeroExport ? "yes" : "no"}
                  onChange={(v) => set("zeroExport", v === "yes")}
                  ariaLabel="Zero export required"
                >
                  <option value="yes">Required</option>
                  <option value="no">Not required</option>
                </SelectField>
              </Field>
            )}

            {inputs.tier === "premium" && inputs.sysType === "hybrid" && (
              <p style={{ fontSize: 11.5, color: studioColors.mutedGray, gridColumn: "1 / -1", margin: 0 }}>
                Hybrid premium uses Enphase throughout — the battery and system controller are
                Enphase parts, so the brand is not a choice here.
              </p>
            )}
          </div>
        </Card>
      </Step>
    </div>
  );
}

/** Margin and offer, shown only to roles that may see or change the commercials. */
export function CommercialPanel({
  inputs,
  set,
  offers,
  canSeeMargin,
}: {
  inputs: BomInputs;
  set: <K extends keyof BomInputs>(key: K, value: BomInputs[K]) => void;
  offers: { offer_id: string; name: string }[];
  canSeeMargin: boolean;
}) {
  return (
    <Card style={{ padding: 14 }}>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Offer" hint={offers.length ? undefined : "no offer is running for this configuration"}>
          <SelectField value={inputs.offerId} onChange={(v) => set("offerId", v)} ariaLabel="Offer">
            <option value="">No offer</option>
            {offers.map((o) => (
              <option key={o.offer_id} value={o.offer_id}>{o.name}</option>
            ))}
          </SelectField>
        </Field>
        {canSeeMargin && (
          <div className="grid grid-cols-2 gap-2">
            <Field label="Margin">
              <SelectField
                value={inputs.marginType}
                onChange={(v) => set("marginType", v as BomAmountType)}
                ariaLabel="Margin type"
              >
                <option value="percent">Percent</option>
                <option value="flat">Flat ₹</option>
              </SelectField>
            </Field>
            <Field label={inputs.marginType === "percent" ? "Percent" : "Rupees"}>
              <TextInput type="number" value={inputs.marginVal} onChange={(v) => set("marginVal", v)} ariaLabel="Margin value" />
            </Field>
          </div>
        )}
      </div>
      {!canSeeMargin && (
        <p style={{ fontSize: 11.5, color: studioColors.mutedGray, marginTop: 10 }}>
          Margin is set by the pricing team; your role does not include it.
        </p>
      )}
    </Card>
  );
}
