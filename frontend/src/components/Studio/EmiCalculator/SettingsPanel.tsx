"use client";

// The calculator's global knobs: the loan percentage and where it is applied,
// tenure bounds, the daily-amount divisor and the slider limits.

import { useState } from "react";
import { GhostButton, GoldButton } from "../shared/primitives";
import { studioColors } from "../shared/format";
import type { EMISettings } from "@/services/emiCalculator";
import { updateSettings } from "@/services/emiConfigService";
import { FieldGrid, NumberField, PanelIntro, ToggleField, str } from "./shared";

export default function SettingsPanel({
  initial,
  readOnly,
  notify,
  onSaved,
}: {
  initial: EMISettings;
  readOnly: boolean;
  notify: { success: (m: string) => void; error: (m: string) => void };
  onSaved: (next: EMISettings) => void;
}) {
  const [saved, setSaved] = useState<EMISettings>(initial);
  const [draft, setDraft] = useState<EMISettings>(initial);
  const [busy, setBusy] = useState(false);

  const dirty = JSON.stringify(saved) !== JSON.stringify(draft);
  const set = (changes: Partial<EMISettings>) => setDraft((d) => ({ ...d, ...changes }));

  const handleSave = async () => {
    setBusy(true);
    try {
      const next = await updateSettings({
        loan_percentage: draft.loan_percentage,
        subsidy_before_loan: draft.subsidy_before_loan,
        tenure_min_years: Number(draft.tenure_min_years) || 1,
        tenure_max_years: Number(draft.tenure_max_years) || 10,
        tenure_default_years: Number(draft.tenure_default_years) || 5,
        daily_saving_divisor: Number(draft.daily_saving_divisor) || 30,
        loan_amount_min: draft.loan_amount_min,
        loan_amount_max: draft.loan_amount_max,
        loan_step: draft.loan_step,
        rate_max: draft.rate_max,
        default_interest_rate: draft.default_interest_rate,
        panel_life_years: Number(draft.panel_life_years) || 25,
      });
      setSaved(next);
      setDraft(next);
      onSaved(next);
      notify.success("Settings saved");
    } catch (err) {
      notify.error(err instanceof Error ? err.message : "Could not save settings");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <PanelIntro
        title="Calculator settings"
        action={
          !readOnly &&
          dirty && (
            <div className="flex gap-2">
              <GhostButton onClick={() => setDraft(saved)} disabled={busy}>
                Discard
              </GhostButton>
              <GoldButton onClick={handleSave} disabled={busy}>
                {busy ? "Saving…" : "Save settings"}
              </GoldButton>
            </div>
          )
        }
      >
        The rules that apply to every quote regardless of system size.
      </PanelIntro>

      <div
        style={{
          background: "#ffffff",
          borderRadius: 16,
          boxShadow: dirty
            ? `inset 0 0 0 1.5px ${studioColors.gold}`
            : `inset 0 0 0 1px ${studioColors.ring}`,
          padding: 18,
          transition: "box-shadow .15s",
        }}
      >
        <FieldGrid>
          <NumberField
            label="Loan percentage"
            value={str(draft.loan_percentage)}
            onChange={(v) => set({ loan_percentage: v })}
            suffix="%"
            disabled={readOnly}
            hint="Share of the cost that is financed. The rest is the customer's upfront."
          />
          <NumberField
            label="Daily amount divisor"
            value={str(draft.daily_saving_divisor)}
            onChange={(v) => set({ daily_saving_divisor: Number(v) || 30 })}
            disabled={readOnly}
            hint="Daily amount = monthly EMI ÷ this. 30 by policy."
          />
          <NumberField
            label="Default interest rate"
            value={str(draft.default_interest_rate)}
            onChange={(v) => set({ default_interest_rate: v })}
            suffix="%"
            disabled={readOnly}
            hint="Fallback when no rate rule matches."
          />
          <NumberField
            label="Minimum tenure"
            value={str(draft.tenure_min_years)}
            onChange={(v) => set({ tenure_min_years: Number(v) || 0 })}
            suffix="yrs"
            disabled={readOnly}
          />
          <NumberField
            label="Maximum tenure"
            value={str(draft.tenure_max_years)}
            onChange={(v) => set({ tenure_max_years: Number(v) || 0 })}
            suffix="yrs"
            disabled={readOnly}
          />
          <NumberField
            label="Default tenure"
            value={str(draft.tenure_default_years)}
            onChange={(v) => set({ tenure_default_years: Number(v) || 0 })}
            suffix="yrs"
            disabled={readOnly}
            hint="Where the tenure slider starts."
          />
          <NumberField
            label="Loan slider minimum"
            value={str(draft.loan_amount_min)}
            onChange={(v) => set({ loan_amount_min: v })}
            prefix="₹"
            disabled={readOnly}
          />
          <NumberField
            label="Loan slider maximum"
            value={str(draft.loan_amount_max)}
            onChange={(v) => set({ loan_amount_max: v })}
            prefix="₹"
            disabled={readOnly}
          />
          <NumberField
            label="Loan step"
            value={str(draft.loan_step)}
            onChange={(v) => set({ loan_step: v })}
            prefix="₹"
            disabled={readOnly}
            hint="Increment for the +/− buttons and slider."
          />
          <NumberField
            label="Rate slider maximum"
            value={str(draft.rate_max)}
            onChange={(v) => set({ rate_max: v })}
            suffix="%"
            disabled={readOnly}
          />
          <NumberField
            label="Panel life"
            value={str(draft.panel_life_years)}
            onChange={(v) => set({ panel_life_years: Number(v) || 25 })}
            suffix="yrs"
            disabled={readOnly}
            hint="Used for the lifetime-savings projection."
          />
          <ToggleField
            label="Deduct subsidy before the loan"
            checked={draft.subsidy_before_loan}
            onChange={() => set({ subsidy_before_loan: !draft.subsidy_before_loan })}
            disabled={readOnly}
            hint="On: subsidy first, then the loan %. This is the agreed flow — turning it off sizes the loan on the gross cost."
          />
        </FieldGrid>
      </div>
    </div>
  );
}
