"use client";

// A live read-out of what the public calculator will show for a given size and
// tenure, hitting the same endpoint the site does. It is the quickest way to
// confirm a pricing change landed the way it was intended.

import { useEffect, useState } from "react";
import { SelectField } from "../shared/primitives";
import { studioColors, studioFonts } from "../shared/format";
import {
  calculateEMI,
  type EMICalculatorResponse,
  type EMISettings,
  type EMISystemSize,
} from "@/services/emiCalculator";
import { Field, PanelIntro, inr } from "./shared";

function Line({
  label,
  value,
  strong,
  accent,
}: {
  label: string;
  value: string;
  strong?: boolean;
  accent?: boolean;
}) {
  return (
    <div
      className="flex items-baseline justify-between gap-4"
      style={{ padding: "9px 0", borderBottom: "1px solid rgba(229,231,235,.7)" }}
    >
      <span style={{ fontSize: 13, color: studioColors.bodyGray }}>{label}</span>
      <span
        style={{
          fontFamily: studioFonts.num,
          fontSize: strong ? 17 : 13.5,
          fontWeight: strong ? 700 : 600,
          color: accent ? studioColors.teal : studioColors.tealDeep,
        }}
      >
        {value}
      </span>
    </div>
  );
}

export default function PreviewPanel({
  sizes,
  settings,
}: {
  sizes: EMISystemSize[];
  settings: EMISettings;
}) {
  const activeSizes = sizes.filter((s) => s.is_active);
  const [sizeId, setSizeId] = useState<string>(String(activeSizes[0]?.id ?? ""));
  const [tenure, setTenure] = useState<string>(String(settings.tenure_default_years));
  const [subsidy, setSubsidy] = useState("on");

  const [data, setData] = useState<EMICalculatorResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!sizeId) return;
    let cancelled = false;
    setLoading(true);
    calculateEMI({
      size_id: Number(sizeId),
      tenure_years: Number(tenure),
      apply_subsidy: subsidy === "on",
    })
      .then((res) => {
        if (cancelled) return;
        setData(res);
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Could not calculate");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [sizeId, tenure, subsidy]);

  const tenureOptions = Array.from(
    { length: Math.max(1, settings.tenure_max_years - settings.tenure_min_years + 1) },
    (_, i) => settings.tenure_min_years + i
  );

  return (
    <div>
      <PanelIntro title="Preview">
        Runs the live calculation against your saved settings — the same
        endpoint the public page uses. Save a change on another tab, then check
        it here.
      </PanelIntro>

      {activeSizes.length === 0 ? (
        <p style={{ fontSize: 13, color: studioColors.mutedGray }}>
          Add an active system size first.
        </p>
      ) : (
        <div style={{ display: "grid", gap: 18, gridTemplateColumns: "minmax(220px, 300px) 1fr" }}>
          <div
            style={{
              background: "#ffffff",
              borderRadius: 16,
              boxShadow: `inset 0 0 0 1px ${studioColors.ring}`,
              padding: 16,
              display: "grid",
              gap: 14,
              alignContent: "start",
            }}
          >
            <Field label="System size">
              <SelectField value={sizeId} onChange={setSizeId} ariaLabel="System size">
                {activeSizes.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label} — {inr(s.system_cost)}
                  </option>
                ))}
              </SelectField>
            </Field>
            <Field label="Tenure">
              <SelectField value={tenure} onChange={setTenure} ariaLabel="Tenure">
                {tenureOptions.map((y) => (
                  <option key={y} value={y}>
                    {y} {y === 1 ? "year" : "years"}
                  </option>
                ))}
              </SelectField>
            </Field>
            <Field label="Subsidy">
              <SelectField value={subsidy} onChange={setSubsidy} ariaLabel="Subsidy">
                <option value="on">Applied</option>
                <option value="off">Not applied</option>
              </SelectField>
            </Field>
          </div>

          <div
            style={{
              background: "#ffffff",
              borderRadius: 16,
              boxShadow: `inset 0 0 0 1px ${studioColors.ring}`,
              padding: "6px 18px 18px",
              opacity: loading ? 0.6 : 1,
              transition: "opacity .15s",
            }}
          >
            {error ? (
              <p style={{ padding: "16px 0", fontSize: 13, color: studioColors.danger }}>{error}</p>
            ) : data ? (
              <>
                <Line label="System cost" value={inr(data.system.system_cost)} />
                <Line
                  label={`Subsidy${data.subsidy.applied ? "" : " (not applied)"}`}
                  value={`− ${inr(data.subsidy.amount)}`}
                />
                <Line label="Cost after subsidy" value={inr(data.subsidy.net_cost_after_subsidy)} />
                <Line
                  label={`Loan (${data.loan.percentage}%)`}
                  value={inr(data.loan.amount)}
                  accent
                />
                <Line label="Customer upfront" value={inr(data.loan.upfront_amount)} />
                <Line
                  label={`Interest rate${data.interest.is_locked ? " (locked)" : ""}`}
                  value={`${data.interest.rate.toFixed(2)}%`}
                />
                <Line label="Tenure" value={`${data.tenure.years} yrs (${data.tenure.months} months)`} />
                <Line label="Monthly EMI" value={inr(data.result.emi_per_month)} strong accent />
                <Line
                  label={`Daily amount (EMI ÷ ${data.result.daily_saving_divisor})`}
                  value={inr(data.result.daily_amount)}
                  strong
                />
                <Line label="Total interest" value={inr(data.result.total_interest)} />
                <Line label="Total payment" value={inr(data.result.total_payment)} />
                {data.interest.rule_label && (
                  <p style={{ margin: "12px 0 0", fontSize: 11.5, color: studioColors.mutedGray }}>
                    Rate rule applied: {data.interest.rule_label}
                  </p>
                )}
              </>
            ) : (
              <p style={{ padding: "16px 0", fontSize: 13, color: studioColors.mutedGray }}>
                Calculating…
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
