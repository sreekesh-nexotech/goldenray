"use client";

// src/components/Studio/BomAdmin/StructureRatesTab.tsx
//
// Structure templates, their items, and the tube weight table.
//
// Structure is priced as weight x a per-kg rate, so the weight table is a
// direct multiplier on the structure cost of every quote that uses that tube.
// It is the one editor here where a typo moves many prices at once, which is
// why the weights sit in their own section with that stated rather than mixed
// in among the items.

import { useMemo, useState } from "react";
import { GhostButton } from "../shared/primitives";
import { studioColors } from "../shared/format";
import {
  FieldGrid,
  NumberField,
  PanelIntro,
  RowCard,
  TextField,
  EmptyRow,
  str,
  nullableNum,
} from "../shared/rows";
import { useEditableRows } from "../shared/useEditableRows";
import {
  saveErrorMessage,
  structureItems,
  tubeWeights,
  versioned,
  type StructureItemInput,
  type StructureItemRow,
  type StructureTemplateRow,
  type TubeWeightRow,
} from "@/services/bomAdminService";

interface Notify {
  success: (msg: string) => void;
  error: (msg: string) => void;
}

export default function StructureRatesTab({
  templates,
  items,
  weights,
  readOnly,
  notify,
}: {
  templates: StructureTemplateRow[];
  items: StructureItemRow[];
  weights: TubeWeightRow[];
  readOnly: boolean;
  notify: Notify;
}) {
  const [template, setTemplate] = useState(templates[0]?.uid ?? "");

  return (
    <div className="flex flex-col gap-6">
      <TubeWeights initial={weights} readOnly={readOnly} notify={notify} />
      <StructureItems
        templates={templates}
        initial={items}
        template={template}
        onTemplate={setTemplate}
        readOnly={readOnly}
        notify={notify}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Tube weights                                                              */
/* -------------------------------------------------------------------------- */

function TubeWeights({
  initial,
  readOnly,
  notify,
}: {
  initial: TubeWeightRow[];
  readOnly: boolean;
  notify: Notify;
}) {
  const api = useMemo(
    () => ({
      create: tubeWeights.create,
      update: tubeWeights.update,
      remove: (uid: string) => tubeWeights.remove(uid),
    }),
    []
  );
  const toInput = useMemo(
    () => versioned<TubeWeightRow, { tube_size: string; weight_kg: string }>((row) => ({
      tube_size: row.tube_size.trim(),
      weight_kg: str(row.weight_kg),
    })),
    []
  );
  const { rows, isDirty, patch, add, discard, save, remove, busyId } = useEditableRows<
    TubeWeightRow,
    { tube_size: string; weight_kg: string }
  >(initial, api, toInput, notify, saveErrorMessage);

  return (
    <section>
      <PanelIntro title="Tube weights">
        Weight of one standard length of each tube size. Structure is priced as weight ×
        the per-kg rate, so a change here moves the structure cost of every quote that
        uses that tube.
      </PanelIntro>
      <div className="flex flex-col gap-3">
        {rows.length === 0 && <EmptyRow>No tube sizes recorded yet.</EmptyRow>}
        {rows.map((row) => (
          <RowCard
            key={row.uid}
            title={row.tube_size || "New tube size"}
            meta={row.weight_kg ? `${row.weight_kg} kg` : undefined}
            dirty={isDirty(row)}
            busy={busyId === row.uid}
            readOnly={readOnly}
            onSave={() => save(row.uid)}
            onDiscard={() => discard(row.uid)}
            onDelete={() => remove(row.uid)}
          >
            <FieldGrid>
              <TextField
                label="Tube size"
                value={row.tube_size}
                onChange={(v) => patch(row.uid, { tube_size: v })}
                placeholder="2.5x1.5"
                hint="As written on the structure items that reference it — the two must match exactly."
                disabled={readOnly}
              />
              <NumberField
                label="Weight"
                value={str(row.weight_kg)}
                onChange={(v) => patch(row.uid, { weight_kg: v })}
                suffix="kg"
                disabled={readOnly}
              />
            </FieldGrid>
          </RowCard>
        ))}
        {!readOnly && (
          <GhostButton onClick={() => add({ tube_size: "", weight_kg: "", version: 0 } as Omit<TubeWeightRow, "uid">)}>
            Add tube size
          </GhostButton>
        )}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Structure items                                                           */
/* -------------------------------------------------------------------------- */

function StructureItems({
  templates,
  initial,
  template,
  onTemplate,
  readOnly,
  notify,
}: {
  templates: StructureTemplateRow[];
  initial: StructureItemRow[];
  template: string;
  onTemplate: (uid: string) => void;
  readOnly: boolean;
  notify: Notify;
}) {
  const api = useMemo(
    () => ({
      create: structureItems.create,
      update: structureItems.update,
      remove: (uid: string) => structureItems.remove(uid),
    }),
    []
  );
  const toInput = useMemo(
    () => versioned<StructureItemRow, StructureItemInput>((row) => ({
      template_uid: row.template_uid,
      name: row.name.trim(),
      item_type: row.item_type,
      tube_size: row.tube_size,
      weight_kg: nullableNum(str(row.weight_kg)),
      unit_price: nullableNum(str(row.unit_price)),
      unit: row.unit,
      length_m_per_kw: nullableNum(str(row.length_m_per_kw)),
      qty_rule: row.qty_rule,
      sort_order: row.sort_order,
    })),
    []
  );
  const { rows, isDirty, patch, add, discard, save, remove, busyId } = useEditableRows<
    StructureItemRow,
    StructureItemInput
  >(initial, api, toInput, notify, saveErrorMessage);

  const visible = rows.filter((r) => !template || r.template_uid === template);
  const current = templates.find((t) => t.uid === template);

  return (
    <section>
      <PanelIntro title="Structure items">
        What each roof type is built from. A tube row is priced by weight — length per kW
        × the weight above × the per-kg rate — and a unit row at its own price.
      </PanelIntro>

      {templates.length > 1 && (
        <div className="flex flex-wrap gap-1" style={{ marginBottom: 14 }}>
          {templates.map((t) => (
            <button
              key={t.uid}
              type="button"
              onClick={() => onTemplate(t.uid)}
              style={{
                appearance: "none",
                border: `1px solid ${t.uid === template ? studioColors.teal : studioColors.ring}`,
                background: t.uid === template ? "rgba(13,110,112,.08)" : "#fff",
                color: t.uid === template ? studioColors.tealDeep : studioColors.mutedGray,
                borderRadius: 999,
                padding: "6px 13px",
                fontFamily: "var(--font-switzer)",
                fontSize: 12.5,
                fontWeight: t.uid === template ? 600 : 500,
                cursor: "pointer",
              }}
            >
              {t.name}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-3">
        {visible.length === 0 && <EmptyRow>No items on this structure template.</EmptyRow>}
        {visible.map((row) => (
          <RowCard
            key={row.uid}
            title={row.name || "New item"}
            meta={row.item_type === "TUBE" ? `Tube ${row.tube_size || "—"}` : "Per unit"}
            dirty={isDirty(row)}
            busy={busyId === row.uid}
            readOnly={readOnly}
            onSave={() => save(row.uid)}
            onDiscard={() => discard(row.uid)}
            onDelete={() => remove(row.uid)}
          >
            <FieldGrid>
              <TextField
                label="Name"
                value={row.name}
                onChange={(v) => patch(row.uid, { name: v })}
                disabled={readOnly}
              />
              <div>
                <TypeToggle
                  value={row.item_type}
                  onChange={(v) => patch(row.uid, { item_type: v })}
                  disabled={readOnly}
                />
              </div>
              {row.item_type === "TUBE" ? (
                <>
                  <TextField
                    label="Tube size"
                    value={row.tube_size}
                    onChange={(v) => patch(row.uid, { tube_size: v })}
                    hint="Must match a row in the tube weight table above."
                    disabled={readOnly}
                  />
                  <NumberField
                    label="Length per kW"
                    value={str(row.length_m_per_kw)}
                    onChange={(v) => patch(row.uid, { length_m_per_kw: v })}
                    suffix="m/kW"
                    disabled={readOnly}
                  />
                </>
              ) : (
                <>
                  <NumberField
                    label="Unit price"
                    value={str(row.unit_price)}
                    onChange={(v) => patch(row.uid, { unit_price: v })}
                    prefix="₹"
                    disabled={readOnly}
                  />
                  <TextField
                    label="Unit"
                    value={row.unit}
                    onChange={(v) => patch(row.uid, { unit: v })}
                    placeholder="nos"
                    disabled={readOnly}
                  />
                </>
              )}
              <NumberField
                label="Sort order"
                value={String(row.sort_order ?? 0)}
                onChange={(v) => patch(row.uid, { sort_order: Number(v) || 0 })}
                hint="Where the line appears on the quote."
                disabled={readOnly}
              />
            </FieldGrid>
          </RowCard>
        ))}
        {!readOnly && current && (
          <GhostButton
            onClick={() =>
              add({
                template_uid: current.uid,
                name: "",
                item_type: "FIXED",
                tube_size: "",
                weight_kg: null,
                unit_price: null,
                unit: "nos",
                length_m_per_kw: null,
                // The engine needs a rule to compute a quantity from; `fixed: 1`
                // is the one that is correct before anything else is filled in.
                qty_rule: { type: "fixed", qty: 1 },
                sort_order: visible.length,
                version: 0,
              } as Omit<StructureItemRow, "uid">)
            }
          >
            Add item to {current.name}
          </GhostButton>
        )}
      </div>
    </section>
  );
}

function TypeToggle({
  value,
  onChange,
  disabled,
}: {
  value: "TUBE" | "FIXED";
  onChange: (v: "TUBE" | "FIXED") => void;
  disabled?: boolean;
}) {
  return (
    <div>
      <p style={{ margin: "0 0 6px", fontSize: 11.5, fontWeight: 600, color: studioColors.mutedGray }}>
        Priced by
      </p>
      <div className="flex gap-1">
        {(["TUBE", "FIXED"] as const).map((t) => (
          <button
            key={t}
            type="button"
            disabled={disabled}
            onClick={() => onChange(t)}
            style={{
              appearance: "none",
              border: `1px solid ${value === t ? studioColors.teal : studioColors.ring}`,
              background: value === t ? "rgba(13,110,112,.08)" : "#fff",
              color: value === t ? studioColors.tealDeep : studioColors.mutedGray,
              borderRadius: 9,
              padding: "7px 12px",
              fontFamily: "var(--font-switzer)",
              fontSize: 12.5,
              fontWeight: value === t ? 600 : 500,
              cursor: disabled ? "not-allowed" : "pointer",
              opacity: disabled ? 0.6 : 1,
            }}
          >
            {t === "TUBE" ? "Weight" : "Unit"}
          </button>
        ))}
      </div>
    </div>
  );
}

