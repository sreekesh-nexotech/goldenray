"use client";

// src/components/Studio/Bom/UpgradePanel.tsx
//
// The upgrade scope: which parts of an existing system are being replaced, and what phase
// it ends up on. Ported from Golden-Ray-BOM's UpgradePanel (App.jsx:168-215).
//
// This is the screen's most consequential control. An upgrade quote is not a smaller
// install quote -- it prices only what is touched -- so a mis-set toggle produces a
// plausible number for the wrong job.

import { Card, Switch } from "../shared/primitives";
import { studioColors } from "../shared/format";
import { Field, Step } from "./shared";
import type { BomInputs, UpgradeSections } from "./inputs";
import { upgradePhaseIsForced } from "./inputs";

const SECTIONS: { key: keyof UpgradeSections; label: string; detail: string }[] = [
  { key: "panels", label: "New panels", detail: "the added modules only" },
  { key: "structure", label: "Structure", detail: "frame, clamps, paint" },
  { key: "inverter", label: "Inverter", detail: "on-grid inverter, DCDB, ACDB" },
  { key: "hybridInv", label: "Hybrid inverter", detail: "replaces the on-grid inverter" },
  { key: "battery", label: "Battery", detail: "battery and its MCCB box" },
  { key: "wiring", label: "Wiring", detail: "DC/AC cable, conduit" },
];

export default function UpgradePanel({
  inputs,
  set,
  newPanels,
}: {
  inputs: BomInputs;
  set: <K extends keyof BomInputs>(key: K, value: BomInputs[K]) => void;
  newPanels: number | null;
}) {
  const sections = inputs.upgradeSections;
  const toKw = Number(inputs.upgradeTo) || 5;
  const fromKw = Number(inputs.upgradeFrom) || 3;
  const phaseForced = upgradePhaseIsForced(sections, toKw);

  const toggle = (key: keyof UpgradeSections) => {
    const next: UpgradeSections = { ...sections, [key]: !sections[key] };
    // A hybrid inverter replaces the on-grid one; the battery only means anything with a
    // hybrid inverter present. Enforcing that here keeps the request and the UI agreeing.
    if (key === "hybridInv") {
      if (next.hybridInv) next.inverter = false;
      else next.battery = false;
    }
    if (key === "inverter" && next.inverter) next.hybridInv = false;
    set("upgradeSections", next);
  };

  return (
    <Step n="2b" title="What is being upgraded?" hint="only these parts are quoted">
      <Card style={{ padding: 14 }}>
        <div className="flex flex-col gap-3">
          <p style={{ fontSize: 12, color: studioColors.bodyGray, margin: 0 }}>
            Going from <strong>{fromKw} kW</strong> to <strong>{toKw} kW</strong>
            {newPanels ? (
              <>
                {" "}
                — about <strong>{newPanels} new panels</strong> ({toKw - fromKw} kW added)
              </>
            ) : null}
            .
          </p>

          <div className="flex flex-col gap-1.5">
            {SECTIONS.map((section) => {
              // The on-grid inverter row is hidden rather than disabled once a hybrid is
              // chosen, because it is not a choice any more -- the hybrid took its place.
              if (section.key === "inverter" && sections.hybridInv) return null;
              const disabled = section.key === "battery" && !sections.hybridInv;
              return (
                <label
                  key={section.key}
                  className="flex items-center gap-2.5"
                  style={{
                    padding: "7px 10px",
                    borderRadius: 10,
                    background: sections[section.key] ? studioColors.cream : "transparent",
                    boxShadow: `inset 0 0 0 1px ${sections[section.key] ? studioColors.teal : studioColors.ring}`,
                    opacity: disabled ? 0.45 : 1,
                    cursor: disabled ? "not-allowed" : "pointer",
                  }}
                >
                  <Switch
                    checked={sections[section.key]}
                    onChange={disabled ? undefined : () => toggle(section.key)}
                    ariaLabel={section.label}
                    disabled={disabled}
                  />
                  <span className="min-w-0">
                    <span style={{ fontSize: 13, fontWeight: 600, color: studioColors.tealDeep }}>{section.label}</span>
                    <span style={{ fontSize: 11.5, color: studioColors.mutedGray }}> · {section.detail}</span>
                    {disabled && (
                      <span style={{ fontSize: 11.5, color: studioColors.mutedGray }}> — needs a hybrid inverter</span>
                    )}
                  </span>
                </label>
              );
            })}
          </div>

          <Field
            label="Target phase"
            hint={
              phaseForced
                ? "Hybrid inverters up to 5 kW are single-phase only, so this is forced to 1Φ."
                : inputs.upgradePhase === "3P"
                  ? "Adds a 3Φ meter, meter box and isolator, and a longer AC run."
                  : undefined
            }
          >
            <div className="flex gap-2">
              {(["1P", "3P"] as const).map((phase) => {
                const active = (phaseForced ? "1P" : inputs.upgradePhase) === phase;
                return (
                  <button
                    key={phase}
                    type="button"
                    aria-pressed={active}
                    disabled={phaseForced && phase === "3P"}
                    onClick={() => set("upgradePhase", phase)}
                    style={{
                      flex: 1,
                      padding: "8px 10px",
                      borderRadius: 10,
                      fontSize: 13,
                      fontWeight: 600,
                      color: active ? studioColors.tealDeep : studioColors.mutedGray,
                      background: active ? studioColors.cream : "#fff",
                      boxShadow: `inset 0 0 0 ${active ? 1.5 : 1}px ${active ? studioColors.teal : studioColors.ring}`,
                      opacity: phaseForced && phase === "3P" ? 0.4 : 1,
                      cursor: phaseForced && phase === "3P" ? "not-allowed" : "pointer",
                    }}
                  >
                    {phase === "1P" ? "Single phase" : "Three phase"}
                  </button>
                );
              })}
            </div>
          </Field>

          {!Object.values(sections).some(Boolean) && (
            <p style={{ fontSize: 12, fontWeight: 600, color: studioColors.danger, margin: 0 }}>
              Nothing is selected, so the quote covers labour and travel only.
            </p>
          )}
        </div>
      </Card>
    </Step>
  );
}
