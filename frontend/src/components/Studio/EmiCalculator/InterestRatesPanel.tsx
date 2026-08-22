"use client";

// Interest-rate policy. Each rule can be scoped by capacity, by system cost,
// by loan amount, or any combination — which is how today's policy (3kW is
// 5.75% up to ₹2L of system cost and 8% from ₹2L to ₹3L, larger systems
// floored at 8%) and loan-range slabs live in one table.

import { GhostButton } from "../shared/primitives";
import { studioColors } from "../shared/format";
import {
  interestRules,
  type EMIInterestRateRule,
  type EMIInterestRateRuleInput,
} from "@/services/emiConfigService";
import {
  EmptyRow,
  FieldGrid,
  NumberField,
  PanelIntro,
  RowCard,
  TextField,
  ToggleField,
  nullableNum,
  str,
} from "./shared";
import { useEditableRows } from "./useEditableRows";

const toInput = (row: EMIInterestRateRule): EMIInterestRateRuleInput => ({
  label: row.label,
  min_kw: row.min_kw,
  max_kw: row.max_kw,
  min_cost: row.min_cost,
  max_cost: row.max_cost,
  min_loan: row.min_loan,
  max_loan: row.max_loan,
  rate: row.rate,
  min_rate: row.min_rate,
  is_locked: row.is_locked,
  priority: Number(row.priority) || 0,
  is_active: row.is_active,
});

/** Human summary of what a rule applies to, for the row header. */
function scopeLabel(row: EMIInterestRateRule): string {
  const parts: string[] = [];
  if (row.min_kw || row.max_kw) {
    const lo = row.min_kw ? `${Number(row.min_kw)}kW` : "any";
    const hi = row.max_kw ? `${Number(row.max_kw)}kW` : "up";
    parts.push(row.max_kw ? `${lo}–${hi}` : `${lo}+`);
  }
  const rupees = (v: string) => `₹${Number(v).toLocaleString("en-IN")}`;
  if (row.min_cost || row.max_cost) {
    const lo = row.min_cost ? rupees(row.min_cost) : "any";
    const hi = row.max_cost ? rupees(row.max_cost) : "up";
    parts.push(`cost ${row.max_cost ? `${lo}–${hi}` : `${lo}+`}`);
  }
  if (row.min_loan || row.max_loan) {
    const lo = row.min_loan ? rupees(row.min_loan) : "any";
    const hi = row.max_loan ? rupees(row.max_loan) : "up";
    parts.push(`loan ${row.max_loan ? `${lo}–${hi}` : `${lo}+`}`);
  }
  return parts.length ? parts.join(" · ") : "All systems (catch-all)";
}

export default function InterestRatesPanel({
  initial,
  readOnly,
  notify,
}: {
  initial: EMIInterestRateRule[];
  readOnly: boolean;
  notify: { success: (m: string) => void; error: (m: string) => void };
}) {
  const { rows, isDirty, patch, add, discard, save, remove, busyId } = useEditableRows(
    initial,
    interestRules,
    toInput,
    notify
  );

  return (
    <div>
      <PanelIntro
        title="Interest rates"
        action={
          !readOnly && (
            <GhostButton
              onClick={() =>
                add({
                  label: "",
                  min_kw: null,
                  max_kw: null,
                  min_cost: null,
                  max_cost: null,
                  min_loan: null,
                  max_loan: null,
                  rate: "8.00",
                  min_rate: "8.00",
                  is_locked: false,
                  priority: 10,
                  is_active: true,
                })
              }
            >
              + Add rate rule
            </GhostButton>
          )
        }
      >
        Scope a rule by system size, by system cost, by loan amount, or any
        combination — leave a pair blank to ignore it. A locked rule fixes the
        rate outright and the customer&apos;s slider is disabled; an unlocked
        one lets them raise the
        rate but never below the floor. When two rules match, the higher
        priority wins, then the more specific one.
      </PanelIntro>

      <div className="flex flex-col gap-3">
        {rows.length === 0 && (
          <EmptyRow>
            No rate rules — every quote falls back to the default rate in Settings.
          </EmptyRow>
        )}

        {rows.map((row) => (
          <RowCard
            key={row.id}
            title={row.label || "New rate rule"}
            meta={
              <>
                {scopeLabel(row)} ·{" "}
                <strong style={{ color: studioColors.tealDeep }}>{Number(row.rate).toFixed(2)}%</strong>
                {row.is_locked && (
                  <span
                    style={{
                      marginLeft: 8,
                      padding: "2px 8px",
                      borderRadius: 999,
                      background: "rgba(247,186,65,.22)",
                      color: studioColors.amberInk,
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  >
                    Locked
                  </span>
                )}
              </>
            }
            dirty={isDirty(row)}
            busy={busyId === row.id}
            readOnly={readOnly}
            onSave={() => save(row.id)}
            onDiscard={() => discard(row.id)}
            onDelete={() => remove(row.id)}
          >
            <FieldGrid>
              <TextField
                label="Name"
                value={str(row.label)}
                onChange={(v) => patch(row.id, { label: v })}
                placeholder="Above 3kW — floor 8%"
                disabled={readOnly}
              />
              <NumberField
                label="Starting rate"
                value={str(row.rate)}
                onChange={(v) => patch(row.id, { rate: v })}
                suffix="%"
                disabled={readOnly}
                hint="What the customer sees before adjusting."
              />
              <NumberField
                label="Floor rate"
                value={str(row.min_rate)}
                onChange={(v) => patch(row.id, { min_rate: v })}
                suffix="%"
                disabled={readOnly}
                hint="The rate can never go below this."
              />
              <NumberField
                label="From capacity"
                value={str(row.min_kw)}
                onChange={(v) => patch(row.id, { min_kw: nullableNum(v) })}
                suffix="kW"
                placeholder="any"
                disabled={readOnly}
              />
              <NumberField
                label="Up to capacity"
                value={str(row.max_kw)}
                onChange={(v) => patch(row.id, { max_kw: nullableNum(v) })}
                suffix="kW"
                placeholder="any"
                disabled={readOnly}
              />
              <NumberField
                label="From system cost"
                value={str(row.min_cost)}
                onChange={(v) => patch(row.id, { min_cost: nullableNum(v) })}
                prefix="₹"
                placeholder="any"
                disabled={readOnly}
                hint="Bands the rate on the system cost, e.g. up to ₹2,00,000."
              />
              <NumberField
                label="Up to system cost"
                value={str(row.max_cost)}
                onChange={(v) => patch(row.id, { max_cost: nullableNum(v) })}
                prefix="₹"
                placeholder="any"
                disabled={readOnly}
              />
              <NumberField
                label="From loan amount"
                value={str(row.min_loan)}
                onChange={(v) => patch(row.id, { min_loan: nullableNum(v) })}
                prefix="₹"
                placeholder="any"
                disabled={readOnly}
              />
              <NumberField
                label="Up to loan amount"
                value={str(row.max_loan)}
                onChange={(v) => patch(row.id, { max_loan: nullableNum(v) })}
                prefix="₹"
                placeholder="any"
                disabled={readOnly}
              />
              <NumberField
                label="Priority"
                value={str(row.priority)}
                onChange={(v) => patch(row.id, { priority: Number(v) || 0 })}
                disabled={readOnly}
                hint="Higher wins when rules overlap."
              />
              <ToggleField
                label="Lock this rate"
                checked={row.is_locked}
                onChange={() => patch(row.id, { is_locked: !row.is_locked })}
                disabled={readOnly}
                hint="Customer cannot change it (e.g. the 3kW SBI rate)."
              />
              <ToggleField
                label="Active"
                checked={row.is_active}
                onChange={() => patch(row.id, { is_active: !row.is_active })}
                disabled={readOnly}
              />
            </FieldGrid>
          </RowCard>
        ))}
      </div>
    </div>
  );
}
