"use client";

// src/components/Studio/Bom/BillHelper.tsx
//
// A customer's electricity bill becomes a recommended system size. Sales people have the
// bill in front of them, not a kW figure, so this is usually where a quote starts.
//
// The arithmetic is the engine's: the same KSEB tariff slabs and bisection the BOM tool
// uses. Nothing is computed here, so this panel and the tool cannot disagree.

import { useCallback, useState } from "react";
import { BomApiError, runBomBillSizing, type BomBillSizing, type BomSystemType } from "@/services/bomStaffService";
import { Card, GhostButton, SelectField, TextInput } from "../shared/primitives";
import { studioColors, studioFonts } from "../shared/format";
import { Field, Stat, Step, inr } from "./shared";
import type { HousePhase } from "./inputs";

export default function BillHelper({
  sysType,
  housePhase,
  onApply,
}: {
  sysType: BomSystemType;
  housePhase: HousePhase;
  /** Applying the suggestion sets the size on the main form rather than quoting from here. */
  onApply: (size: string) => void;
}) {
  const [bill, setBill] = useState("");
  const [frequency, setFrequency] = useState<"monthly" | "bimonthly">("bimonthly");
  const [result, setResult] = useState<BomBillSizing | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const run = useCallback(async () => {
    const amount = Number(bill) || 0;
    if (amount <= 0) {
      setResult(null);
      return setError("Enter the amount on the bill.");
    }
    setBusy(true);
    setError("");
    try {
      setResult(
        await runBomBillSizing({
          // An upgrade quote still sizes against the on-grid template: the bill says how
          // much generation the house needs, not what kind of system it has.
          sys_type: sysType === "hybrid" ? "hybrid" : "ongrid",
          bill: amount,
          frequency,
          house_phase: housePhase,
        }),
      );
    } catch (e) {
      setResult(null);
      if (e instanceof BomApiError && e.status === 503) {
        setError("No electricity tariff is configured, so a bill cannot be converted. Ask an admin to set it.");
      } else {
        setError(e instanceof Error ? e.message : "Could not size from that bill.");
      }
    } finally {
      setBusy(false);
    }
  }, [bill, frequency, housePhase, sysType]);

  return (
    <Step n="1a" title="Size it from the bill" hint="optional">
      <Card style={{ padding: 14 }}>
        <div className="flex flex-col gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Bill amount (₹)">
              <TextInput
                type="number"
                value={bill}
                onChange={setBill}
                onKeyDown={(e) => e.key === "Enter" && run()}
                placeholder="e.g. 5000"
                ariaLabel="Bill amount"
              />
            </Field>
            <Field
              label="Billing period"
              hint={frequency === "bimonthly" ? "KSEB's usual two-month bill" : "a single month"}
            >
              <SelectField
                value={frequency}
                onChange={(v) => setFrequency(v as "monthly" | "bimonthly")}
                ariaLabel="Billing period"
              >
                <option value="bimonthly">Bi-monthly (2 months)</option>
                <option value="monthly">Monthly</option>
              </SelectField>
            </Field>
          </div>

          <div>
            <GhostButton onClick={run} style={{ height: 34 }}>
              {busy ? "Working…" : "Suggest a size"}
            </GhostButton>
          </div>

          {error && (
            <p role="alert" style={{ fontSize: 12, color: studioColors.danger, margin: 0 }}>
              {error}
            </p>
          )}

          {result && (
            <div className="flex flex-col gap-3">
              <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Stat label="Units / month" value={String(result.monthly_units)} />
                <Stat label="Generation needed" value={`${result.exact_kw} kW`} />
                <Stat label="Saving / month" value={inr(result.monthly_savings)} tone="positive" />
                <Stat
                  label="Payback"
                  value={result.payback_years ? `${result.payback_years} yrs` : "—"}
                />
              </dl>

              {result.recommended_size ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span style={{ fontSize: 13, color: studioColors.bodyGray }}>
                    Suggested:{" "}
                    <strong style={{ fontFamily: studioFonts.num, color: studioColors.tealDeep }}>
                      {result.recommended_kw} kW
                    </strong>
                  </span>
                  <GhostButton onClick={() => onApply(result.recommended_size as string)} style={{ height: 30 }}>
                    Use this size
                  </GhostButton>
                </div>
              ) : (
                <p style={{ fontSize: 12, color: studioColors.mutedGray, margin: 0 }}>
                  No offered size covers this consumption.
                </p>
              )}

              {result.phase_upgrade_needed && (
                <p style={{ fontSize: 12, fontWeight: 600, color: studioColors.amberInk, margin: 0 }}>
                  This house needs more than 5 kW, which a single-phase supply cannot carry. The customer has to
                  apply to KSEB for a three-phase connection before installation.
                </p>
              )}
            </div>
          )}
        </div>
      </Card>
    </Step>
  );
}
