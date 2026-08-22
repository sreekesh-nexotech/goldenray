"use client";

// System sizes and their per-kW price. System cost is always derived
// (price/kW × capacity), never entered as a lump sum, so one rate change
// re-prices the tile consistently everywhere.

import { GhostButton } from "../shared/primitives";
import { studioColors } from "../shared/format";
import type { EMISystemSize } from "@/services/emiCalculator";
import { systemSizes, type EMISystemSizeInput } from "@/services/emiConfigService";
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

const toInput = (row: EMISystemSize): EMISystemSizeInput => ({
  label: row.label,
  capacity_kw: row.capacity_kw,
  price_per_kw: row.price_per_kw,
  max_system_cost: row.max_system_cost,
  monthly_bill_reference: row.monthly_bill_reference,
  sort_order: Number(row.sort_order) || 0,
  is_active: row.is_active,
});

export default function SystemSizesPanel({
  initial,
  readOnly,
  notify,
}: {
  initial: EMISystemSize[];
  readOnly: boolean;
  notify: { success: (m: string) => void; error: (m: string) => void };
}) {
  const { rows, isDirty, patch, add, discard, save, remove, busyId } = useEditableRows(
    initial,
    systemSizes,
    toInput,
    notify
  );

  return (
    <div>
      <PanelIntro
        title="System sizes & pricing"
        action={
          !readOnly && (
            <GhostButton
              onClick={() =>
                add({
                  label: "",
                  capacity_kw: "",
                  price_per_kw: "",
                  system_cost: 0,
                  max_system_cost: null,
                  monthly_bill_reference: "0",
                  sort_order: rows.length + 1,
                  is_active: true,
                })
              }
            >
              + Add system size
            </GhostButton>
          )
        }
      >
        These are the tiles a customer picks from. System cost is calculated as
        price per kW × capacity — change the per-kW rate and every quote for
        that size updates immediately.
      </PanelIntro>

      <div className="flex flex-col gap-3">
        {rows.length === 0 && <EmptyRow>No system sizes yet. Add one to get started.</EmptyRow>}

        {rows.map((row) => {
          const cost = Number(row.capacity_kw) * Number(row.price_per_kw);
          const cap = row.max_system_cost === null ? null : Number(row.max_system_cost);
          const overCap = cap !== null && Number.isFinite(cost) && cost > cap;
          return (
            <RowCard
              key={row.id}
              title={row.label || "New system size"}
              meta={
                Number.isFinite(cost) && cost > 0 ? (
                  <>
                    System cost{" "}
                    <strong style={{ color: overCap ? studioColors.danger : studioColors.tealDeep }}>
                      {inr(cost)}
                    </strong>
                    {overCap && (
                      <span style={{ color: studioColors.danger }}>
                        {" "}
                        · above the {inr(cap)} cap — this size cannot be quoted
                      </span>
                    )}
                  </>
                ) : undefined
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
                  label="Tile label"
                  value={str(row.label)}
                  onChange={(v) => patch(row.id, { label: v })}
                  placeholder="3kW"
                  disabled={readOnly}
                  hint="Shown on the size tile."
                />
                <NumberField
                  label="Capacity"
                  value={str(row.capacity_kw)}
                  onChange={(v) => patch(row.id, { capacity_kw: v })}
                  suffix="kW"
                  disabled={readOnly}
                  hint="Drives subsidy and interest-rate bands."
                />
                <NumberField
                  label="Price per kW"
                  value={str(row.price_per_kw)}
                  onChange={(v) => patch(row.id, { price_per_kw: v })}
                  prefix="₹"
                  disabled={readOnly}
                  hint="System cost = this × capacity."
                />
                <NumberField
                  label="Maximum system cost"
                  value={str(row.max_system_cost)}
                  onChange={(v) => patch(row.id, { max_system_cost: nullableNum(v) })}
                  prefix="₹"
                  placeholder="no cap"
                  disabled={readOnly}
                  hint="Above this the calculator refuses to quote. 3kW is capped at ₹3,00,000."
                />
                <NumberField
                  label="Reference monthly bill"
                  value={str(row.monthly_bill_reference)}
                  onChange={(v) => patch(row.id, { monthly_bill_reference: v })}
                  prefix="₹"
                  disabled={readOnly}
                  hint="Used for the savings comparison, not the EMI."
                />
                <NumberField
                  label="Display order"
                  value={str(row.sort_order)}
                  onChange={(v) => patch(row.id, { sort_order: Number(v) || 0 })}
                  disabled={readOnly}
                  hint="Lower numbers appear first."
                />
                <ToggleField
                  label="Show on the site"
                  checked={row.is_active}
                  onChange={() => patch(row.id, { is_active: !row.is_active })}
                  disabled={readOnly}
                  hint="Turn off to hide this size without deleting it."
                />
              </FieldGrid>
            </RowCard>
          );
        })}
      </div>
    </div>
  );
}
