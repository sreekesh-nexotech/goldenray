"use client";

// src/components/Studio/Bom/AddOnsPanel.tsx
//
// Site extras and the upgrade-ready option. Both are charged OVER the price-list rate,
// because the rate assumes a standard flat-roof install at the included distance -- so
// anything the site actually needed beyond that is an addition, not a substitution.

import type { BomQuoteOptions } from "@/services/bomStaffService";
import { Card, SelectField, Switch, TextInput } from "../shared/primitives";
import { studioColors } from "../shared/format";
import { Field, Step } from "./shared";
import type { BomInputs, FutureOpts } from "./inputs";
import { sizeKw } from "./inputs";

const CABLES: { key: "extraDcCable" | "extraAcCable" | "armouredCable"; label: string; hint: string }[] = [
  { key: "extraDcCable", label: "Extra DC cable", hint: "panel-to-inverter run beyond the standard" },
  { key: "extraAcCable", label: "Extra AC cable", hint: "inverter-to-meter run beyond the standard" },
  { key: "armouredCable", label: "Armoured / UG cable", hint: "buried or exposed runs" },
];

const FUTURE_PARTS: { key: keyof FutureOpts; label: string; detail: string }[] = [
  { key: "structure", label: "Structure", detail: "frame sized for the full array" },
  { key: "db", label: "DCDB / ACDB", detail: "boards sized for the larger inverter" },
  { key: "cables", label: "Cables & earthing", detail: "runs sized for the larger system" },
  { key: "meter", label: "Meter box", detail: "box sized for the larger supply" },
];

export default function AddOnsPanel({
  inputs,
  options,
  set,
}: {
  inputs: BomInputs;
  options: BomQuoteOptions | null;
  set: <K extends keyof BomInputs>(key: K, value: BomInputs[K]) => void;
}) {
  const isUpgrade = inputs.sysType === "upgrade";
  const sys = options?.system_types[inputs.sysType === "upgrade" ? "ongrid" : inputs.sysType];
  // Only a genuinely larger size is an upgrade path; offering the current one or smaller
  // would let a sales person pick something the backend then ignores.
  const larger = (sys?.sizes ?? []).filter((s) => sizeKw(s.key) > sizeKw(inputs.size));
  const futureOn = Boolean(inputs.futureSize);

  const toggleFuture = (on: boolean) => {
    set("futureSize", on ? (larger[0]?.key ?? "") : "");
  };

  return (
    <Step n="2c" title="Site extras" hint="charged over the price list">
      <Card style={{ padding: 14 }}>
        <div className="flex flex-col gap-3">
          <div className="grid gap-3 sm:grid-cols-3">
            {CABLES.map((cable) => (
              <Field key={cable.key} label={`${cable.label} (m)`} hint={cable.hint}>
                <TextInput
                  type="number"
                  value={inputs[cable.key]}
                  onChange={(v) => set(cable.key, v)}
                  ariaLabel={cable.label}
                />
              </Field>
            ))}
          </div>

          {/* Upgrade-ready is meaningless on an upgrade quote -- that IS the upgrade. */}
          {!isUpgrade && larger.length > 0 && (
            <div
              style={{
                padding: "11px 13px",
                borderRadius: 12,
                background: futureOn ? studioColors.cream : "transparent",
                boxShadow: `inset 0 0 0 1px ${futureOn ? studioColors.teal : studioColors.ring}`,
              }}
            >
              <label className="flex items-start gap-2.5" style={{ cursor: "pointer" }}>
                <Switch checked={futureOn} onChange={() => toggleFuture(!futureOn)} ariaLabel="Build upgrade-ready" />
                <span className="min-w-0">
                  <span style={{ fontSize: 13, fontWeight: 600, color: studioColors.tealDeep }}>Build upgrade-ready</span>
                  <span style={{ fontSize: 11.5, color: studioColors.mutedGray, display: "block", marginTop: 2 }}>
                    Panels go in at {inputs.size} kW now, but the inverter and the parts below are built for the
                    larger system — so panels can be added later without replacing them.
                  </span>
                </span>
              </label>

              {futureOn && (
                <div className="mt-3 flex flex-col gap-3">
                  <Field label="Build for" hint="the size the system will reach">
                    <SelectField
                      value={inputs.futureSize}
                      onChange={(v) => set("futureSize", v)}
                      ariaLabel="Future system size"
                    >
                      {larger.map((s) => (
                        <option key={s.key} value={s.key}>{s.label}</option>
                      ))}
                    </SelectField>
                  </Field>
                  {sizeKw(inputs.futureSize) >= 6 && (
                    <p style={{ fontSize: 11.5, fontWeight: 600, color: studioColors.amberInk, margin: 0 }}>
                      A {inputs.futureSize} kW inverter needs a three-phase supply, so the meter and ACDB are
                      quoted as 3Φ.
                    </p>
                  )}
                  <div className="flex flex-col gap-1.5">
                    {FUTURE_PARTS.map((part) => (
                      <label key={part.key} className="flex items-center gap-2.5" style={{ cursor: "pointer" }}>
                        <Switch
                          checked={inputs.futureOpts[part.key]}
                          onChange={() => set("futureOpts", { ...inputs.futureOpts, [part.key]: !inputs.futureOpts[part.key] })}
                          ariaLabel={part.label}
                        />
                        <span className="min-w-0" style={{ fontSize: 12.5 }}>
                          <span style={{ fontWeight: 600, color: studioColors.tealDeep }}>{part.label}</span>
                          <span style={{ color: studioColors.mutedGray }}> · {part.detail}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                  <p style={{ fontSize: 11.5, color: studioColors.mutedGray, margin: 0 }}>
                    Anything switched off is sized for today&apos;s panels instead — it is still quoted, just
                    smaller.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </Step>
  );
}
