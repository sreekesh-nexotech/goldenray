"use client";

// src/components/Studio/Bom/BomCalculatorScreen.tsx
//
// The internal BOM calculator: configure a system, get its bill of materials and pricing
// from the platform's staff API.
//
// A thin orchestrator over the panels in this folder, following the shape of
// Studio/EmiCalculator -- load once, keep the form in one state object, render
// error/loading/content in that order, and let each panel take what it needs. The flow is
// ported from Golden-Ray-BOM (App.jsx), which numbers its steps; the numbering is kept so
// a sales person reads the same sequence in either tool.
//
// Nothing here computes a price. Every number on screen comes from the engine, so the
// Studio and the public website quote can never disagree.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PageHeader, TipBanner } from "../shared/primitives";
import { useStudio } from "../shared/StudioContext";
import { studioColors } from "../shared/format";
import {
  BomApiError,
  downloadBomCsv,
  getBomQuoteOptions,
  runBomQuote,
  type BomQuoteOptions,
  type BomQuoteResponse,
} from "@/services/bomStaffService";
import ConfigPanel, { CommercialPanel } from "./ConfigPanel";
import BomLinesTable, { type BomMode } from "./BomLinesTable";
import PricingPanel, { CostPanel } from "./PricingPanel";
import StringConfigPanel from "./StringConfigPanel";
import UpgradePanel from "./UpgradePanel";
import AddOnsPanel from "./AddOnsPanel";
import BillHelper from "./BillHelper";
import { Step } from "./shared";
import { DEFAULT_INPUTS, phaseAwareSize, sizeForSystemType, toRequest, type BomInputs } from "./inputs";

export default function BomCalculatorScreen() {
  return (
    <div>
      <PageHeader
        title="BOM Calculator"
        subtitle="Bill of materials and pricing from the Flarize platform. Internal use only."
      />
      <Calculator />
    </div>
  );
}

function Calculator() {
  const { can, tips } = useStudio();
  const [options, setOptions] = useState<BomQuoteOptions | null>(null);
  const [inputs, setInputs] = useState<BomInputs>(DEFAULT_INPUTS);
  // The mode a result was fetched for travels with it. The two modes are different
  // documents -- a dispatch body has no `pricing` block at all -- so a result from
  // the other mode must not be rendered while the refetch is in flight.
  const [result, setResult] = useState<{ body: BomQuoteResponse; mode: BomMode } | null>(null);
  const [mode, setMode] = useState<BomMode>("quotation");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const seq = useRef(0);

  // Commercials are gated on the permission the API actually enforces: `pricing_internal`
  // is what makes it send cost_breakdown and totals at all. Asking up front means the
  // margin control is hidden rather than appearing and then doing nothing.
  const canSeeCost = can("pricing_internal", "view");

  const fail = useCallback((e: unknown) => {
    if (e instanceof BomApiError && e.status === 403) {
      return setError("Your platform role does not include the BOM calculator (bom.view).");
    }
    setError(e instanceof Error ? e.message : "Something went wrong.");
  }, []);

  useEffect(() => {
    let live = true;
    getBomQuoteOptions()
      .then((next) => live && setOptions(next))
      .catch((e) => live && fail(e));
    return () => {
      live = false;
    };
  }, [fail]);

  const sys = options?.system_types[inputs.sysType === "upgrade" ? "ongrid" : inputs.sysType];

  const set = useCallback(<K extends keyof BomInputs>(key: K, value: BomInputs[K]) => {
    setInputs((prev) => {
      if (prev[key] === value) return prev;
      const next = { ...prev, [key]: value };
      // Hybrid and on-grid list different sizes, so a type change can leave a size the
      // new template has never heard of. Remap instead of resetting, so the configuration
      // the user built survives.
      if (key === "sysType") next.size = sizeForSystemType(prev.size, next.sysType, prev.housePhase);
      return next;
    });
  }, []);

  // Keep size, tier and battery valid for whatever the chosen template actually offers --
  // the options come from the API, so this cannot be hardcoded.
  useEffect(() => {
    if (!sys || inputs.sysType === "upgrade") return;
    setInputs((prev) => {
      const size = sys.sizes.some((s) => s.key === prev.size) ? prev.size : (sys.sizes[0]?.key ?? prev.size);
      const tier = sys.tiers.includes(prev.tier) ? prev.tier : (sys.tiers[0] ?? prev.tier);
      const batConfig = sys.battery_configs.includes(prev.batConfig) ? prev.batConfig : (sys.battery_configs[0] ?? "0");
      if (size === prev.size && tier === prev.tier && batConfig === prev.batConfig) return prev;
      return { ...prev, size, tier, batConfig };
    });
  }, [sys, inputs.sysType]);

  // Debounced recalculation. The sequence guard means a slow earlier response can never
  // overwrite a newer one -- without it, typing a distance leaves the figures showing an
  // older configuration.
  useEffect(() => {
    if (!options) return;
    const mine = ++seq.current;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const out = await runBomQuote({ ...toRequest(inputs), mode });
        if (mine === seq.current) {
          setResult({ body: out, mode });
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
  }, [inputs, options, mode, fail]);

  // Only a result fetched for the mode now showing. Switching tabs therefore renders
  // "Recalculating…" for one beat rather than a panel built from the other document.
  const shown = result?.mode === mode ? result.body : null;
  const offers = useMemo(() => shown?.available_offers ?? [], [shown]);

  const [exporting, setExporting] = useState(false);
  const exportCsv = useCallback(async () => {
    setExporting(true);
    try {
      await downloadBomCsv({ ...toRequest(inputs), mode });
    } catch (e) {
      fail(e);
    } finally {
      setExporting(false);
    }
  }, [inputs, mode, fail]);

  // A selected offer that stops applying (the tier changed, say) would otherwise keep
  // being sent and silently ignored.
  useEffect(() => {
    if (inputs.offerId && !offers.some((o) => o.offer_id === inputs.offerId)) {
      setInputs((prev) => ({ ...prev, offerId: "" }));
    }
  }, [offers, inputs.offerId]);

  if (!options && !error) return <p style={{ fontSize: 13.5, color: studioColors.mutedGray }}>Loading options…</p>;

  return (
    <div className="flex flex-col gap-4">
      {tips && (
        <TipBanner>
          Every figure here comes from the platform quote engine — the same one behind the public
          website — so this screen and a customer&apos;s quote can never disagree. Switch to the
          dispatch list to hand the warehouse a picking list with no prices on it.
        </TipBanner>
      )}

      {error && (
        <p role="alert" style={{ color: studioColors.danger, fontSize: 13.5 }}>
          {error}
        </p>
      )}

      <div className="grid gap-4 lg:grid-cols-[380px_1fr]">
        <div className="flex min-w-0 flex-col gap-4" style={{ alignSelf: "start" }}>
          {inputs.sysType !== "upgrade" && (
            <BillHelper
              sysType={inputs.sysType}
              housePhase={inputs.housePhase}
              onApply={(size) =>
                // Accepting a suggestion must not leave an impossible configuration: a
                // 3Φ-only size on a single-phase house is corrected, as a manual pick is.
                setInputs((prev) => ({
                  ...prev,
                  size: phaseAwareSize(size, prev.housePhase, sys?.sizes.map((s) => s.key) ?? [size]),
                }))
              }
            />
          )}
          <ConfigPanel
            inputs={inputs}
            options={options}
            set={set}
            // `meta.bat_config` is what the engine built, which under the composite
            // regime comes from the package profile rather than from `inputs.batConfig`.
            // Passing it only when it differs would hide the fact that the package is
            // the authority even when the two happen to agree.
            resolvedBattery={
              typeof shown?.meta?.bat_config === "string" ? shown.meta.bat_config : null
            }
          />
          <AddOnsPanel inputs={inputs} options={options} set={set} />
          {inputs.sysType === "upgrade" && (
            <UpgradePanel
              inputs={inputs}
              set={set}
              // The engine reports the panel count it actually derived from the chosen
              // module's wattage, which beats recomputing it here off an assumed 550 W.
              newPanels={typeof shown?.meta?.new_panels === "number" ? shown.meta.new_panels : null}
            />
          )}
          <Step n="3" title="Review and finalise">
            <CommercialPanel inputs={inputs} set={set} offers={offers} canSeeMargin={canSeeCost} />
          </Step>
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <ModeToggle mode={mode} onChange={setMode} />
            {loading && (
              <span style={{ fontSize: 12, color: studioColors.mutedGray }} aria-live="polite">
                Recalculating…
              </span>
            )}
            <button
              type="button"
              onClick={exportCsv}
              disabled={exporting || !shown}
              className="ml-auto"
              style={{
                appearance: "none",
                border: `1px solid ${studioColors.ring}`,
                background: "#fff",
                color: studioColors.tealDeep,
                borderRadius: 10,
                padding: "7px 13px",
                fontFamily: "var(--font-switzer)",
                fontSize: 12.5,
                fontWeight: 600,
                cursor: exporting || !shown ? "not-allowed" : "pointer",
                opacity: exporting || !shown ? 0.55 : 1,
              }}
            >
              {exporting ? "Preparing…" : mode === "dispatch" ? "Download picking list" : "Download CSV"}
            </button>
          </div>

          {shown && (
            <>
              {mode === "quotation" && <PricingPanel result={shown} />}
              {mode === "quotation" && canSeeCost && <CostPanel result={shown} />}
              {/* Shown in both modes: the installer reads it off the dispatch list too. */}
              <StringConfigPanel config={shown.string_config} />
              <BomLinesTable result={shown} mode={mode} />
            </>
          )}
          {!shown && !error && !loading && (
            <p style={{ fontSize: 13.5, color: studioColors.mutedGray }}>No quote yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

/** Quotation or dispatch. Two tabs rather than a switch, so the active one is readable. */
function ModeToggle({ mode, onChange }: { mode: BomMode; onChange: (mode: BomMode) => void }) {
  const tabs: { key: BomMode; label: string }[] = [
    { key: "quotation", label: "Quotation" },
    { key: "dispatch", label: "Dispatch list" },
  ];
  return (
    <div role="tablist" aria-label="Output mode" className="flex" style={{ borderBottom: `1px solid ${studioColors.ring}` }}>
      {tabs.map((tab) => {
        const active = tab.key === mode;
        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.key)}
            style={{
              padding: "7px 13px",
              fontSize: 13,
              fontWeight: active ? 600 : 500,
              color: active ? studioColors.tealDeep : studioColors.mutedGray,
              borderBottom: `2px solid ${active ? studioColors.gold : "transparent"}`,
              marginBottom: -1,
              background: "none",
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
