"use client";

// The calculator's global knobs: tenure bounds, the daily-amount divisor,
// the price and down-payment sliders' increments/bounds, and the rate
// slider's ceiling.

import { useState } from "react";
import { GhostButton, GoldButton } from "../shared/primitives";
import { studioColors } from "../shared/format";
import type { EMISettings } from "@/services/emiCalculator";
import { updateSettings } from "@/services/emiConfigService";
import { FieldGrid, NumberField, PanelIntro, TextField, str } from "./shared";

/** "5000, 10000, 20000" → [5000, 10000, 20000]; junk and blanks are dropped. */
function parseAmounts(text: string): number[] {
  return text
    .split(/[,\s]+/)
    .map((s) => Number(s))
    .filter((n) => Number.isFinite(n) && n > 0);
}

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
  // Kept as the raw string so a half-typed "5000, 1" isn't mangled mid-edit.
  const [quickAddsText, setQuickAddsText] = useState(
    (initial.down_payment_quick_adds ?? []).join(", ")
  );
  const [busy, setBusy] = useState(false);

  const dirty = JSON.stringify(saved) !== JSON.stringify(draft);
  const set = (changes: Partial<EMISettings>) => setDraft((d) => ({ ...d, ...changes }));

  const handleSave = async () => {
    setBusy(true);
    try {
      const next = await updateSettings({
        tenure_min_years: Number(draft.tenure_min_years) || 1,
        tenure_max_years: Number(draft.tenure_max_years) || 10,
        tenure_default_years: Number(draft.tenure_default_years) || 5,
        daily_saving_divisor: Number(draft.daily_saving_divisor) || 30,
        price_step: draft.price_step,
        down_payment_min_percent: draft.down_payment_min_percent,
        down_payment_max_percent: draft.down_payment_max_percent,
        down_payment_step_percent: draft.down_payment_step_percent,
        down_payment_quick_adds: draft.down_payment_quick_adds,
        rate_max: draft.rate_max,
        default_interest_rate: draft.default_interest_rate,
        panel_life_years: Number(draft.panel_life_years) || 25,
      });
      setSaved(next);
      setDraft(next);
      setQuickAddsText((next.down_payment_quick_adds ?? []).join(", "));
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
              <GhostButton
                onClick={() => {
                  setDraft(saved);
                  setQuickAddsText((saved.down_payment_quick_adds ?? []).join(", "));
                }}
                disabled={busy}
              >
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
            label="Price step"
            value={str(draft.price_step)}
            onChange={(v) => set({ price_step: v })}
            prefix="₹"
            disabled={readOnly}
            hint="Increment for the system price +/− buttons and slider."
          />
          <NumberField
            label="Down payment minimum"
            value={str(draft.down_payment_min_percent)}
            onChange={(v) => set({ down_payment_min_percent: v })}
            suffix="%"
            disabled={readOnly}
            hint="Floor for the down-payment slider, as % of the system price."
          />
          <NumberField
            label="Down payment maximum"
            value={str(draft.down_payment_max_percent)}
            onChange={(v) => set({ down_payment_max_percent: v })}
            suffix="%"
            disabled={readOnly}
            hint="Ceiling for the down-payment slider, as % of the system price."
          />
          <NumberField
            label="Down payment step"
            value={str(draft.down_payment_step_percent)}
            onChange={(v) => set({ down_payment_step_percent: v })}
            suffix="%"
            disabled={readOnly}
            hint="Increment for the down-payment +/− buttons and slider."
          />
          <TextField
            label="Down payment quick-adds"
            value={quickAddsText}
            onChange={(v) => {
              setQuickAddsText(v);
              set({ down_payment_quick_adds: parseAmounts(v) });
            }}
            placeholder="5000, 10000, 20000"
            disabled={readOnly}
            hint="₹ amounts for the one-tap chips under the slider, comma-separated."
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
        </FieldGrid>
      </div>
    </div>
  );
}
