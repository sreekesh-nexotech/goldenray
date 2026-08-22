"use client";

// Subsidy bands. The amount matched here is deducted from the system cost
// *before* the loan percentage is applied — that ordering is the corrected
// calculation flow and is enforced server-side.

import { GhostButton } from "../shared/primitives";
import { subsidyRules, type EMISubsidyRule, type EMISubsidyRuleInput } from "@/services/emiConfigService";
import {
  EmptyRow,
  FieldGrid,
  NumberField,
  PanelIntro,
  RowCard,
  TextField,
  ToggleField,
  inr,
  nullableNum,
  str,
} from "./shared";
import { useEditableRows } from "./useEditableRows";

const toInput = (row: EMISubsidyRule): EMISubsidyRuleInput => ({
  label: row.label,
  min_kw: row.min_kw,
  max_kw: row.max_kw,
  amount: row.amount,
  priority: Number(row.priority) || 0,
  is_active: row.is_active,
});

function bandLabel(row: EMISubsidyRule): string {
  const lo = row.min_kw ? `${Number(row.min_kw)}kW` : "any";
  const hi = row.max_kw ? `${Number(row.max_kw)}kW` : "above";
  if (!row.min_kw && !row.max_kw) return "All capacities";
  if (!row.max_kw) return `${lo} and ${hi}`;
  return `${lo} – ${hi}`;
}

export default function SubsidyPanel({
  initial,
  readOnly,
  notify,
}: {
  initial: EMISubsidyRule[];
  readOnly: boolean;
  notify: { success: (m: string) => void; error: (m: string) => void };
}) {
  const { rows, isDirty, patch, add, discard, save, remove, busyId } = useEditableRows(
    initial,
    subsidyRules,
    toInput,
    notify
  );

  return (
    <div>
      <PanelIntro
        title="Subsidy"
        action={
          !readOnly && (
            <GhostButton
              onClick={() =>
                add({
                  label: "",
                  min_kw: null,
                  max_kw: null,
                  amount: "0",
                  priority: 10,
                  is_active: true,
                })
              }
            >
              + Add subsidy band
            </GhostButton>
          )
        }
      >
        The subsidy for a capacity band. The loan percentage is applied to the
        system cost first, and the subsidy is then deducted from that loan.
        Leave a bound blank for an open-ended band; if two bands overlap, the
        higher priority wins.
      </PanelIntro>

      <div className="flex flex-col gap-3">
        {rows.length === 0 && <EmptyRow>No subsidy bands configured — quotes will show no subsidy.</EmptyRow>}

        {rows.map((row) => (
          <RowCard
            key={row.id}
            title={row.label || "New subsidy band"}
            meta={
              <>
                {bandLabel(row)} · <strong>{inr(row.amount)}</strong>
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
                placeholder="PM Surya Ghar — 3kW and above"
                disabled={readOnly}
              />
              <NumberField
                label="From capacity"
                value={str(row.min_kw)}
                onChange={(v) => patch(row.id, { min_kw: nullableNum(v) })}
                suffix="kW"
                placeholder="any"
                disabled={readOnly}
                hint="Blank = no lower bound."
              />
              <NumberField
                label="Up to capacity"
                value={str(row.max_kw)}
                onChange={(v) => patch(row.id, { max_kw: nullableNum(v) })}
                suffix="kW"
                placeholder="any"
                disabled={readOnly}
                hint="Blank = no upper bound."
              />
              <NumberField
                label="Subsidy amount"
                value={str(row.amount)}
                onChange={(v) => patch(row.id, { amount: v })}
                prefix="₹"
                disabled={readOnly}
                hint="Comes off the loan after the loan % is applied."
              />
              <NumberField
                label="Priority"
                value={str(row.priority)}
                onChange={(v) => patch(row.id, { priority: Number(v) || 0 })}
                disabled={readOnly}
                hint="Higher wins when bands overlap."
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
