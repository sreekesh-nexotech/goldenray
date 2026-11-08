"use client";

// src/components/Studio/BomAdmin/FixedPricesTab.tsx
//
// The templates' fixed-price items: the BOM rows priced from the template
// rather than from the catalog — consumables, labour lines, earthing, and the
// structure tubes on the upgrade path.
//
// Two fields here are easy to get wrong and expensive to get wrong:
//
//   `condition`  decides which configurations the line appears in. An empty
//                condition means *every* quote, so clearing it adds the line
//                (and its price) to every size, tier and system type at once.
//
//   `is_tube`    moves the row from flat pricing to weight-based structure
//                costing. On the standard path tubes are priced by weight; on
//                the upgrade path the template's two tube rows are ordinary
//                flat-priced items, and treating them as weighted dropped
//                ₹2,289 of structure from every upgrade quote.
//
// Both are shown with that stated rather than as bare inputs.

import { useCallback, useMemo, useState } from "react";
import { studioColors } from "../shared/format";
import {
  AddRowButton,
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
} from "../shared/rows";
import { useEditableRows } from "../shared/useEditableRows";
import {
  fixedItems,
  saveErrorMessage,
  versioned,
  type BomTemplateRow,
  type FixedItemInput,
  type FixedItemRow,
} from "@/services/bomAdminService";

interface Notify {
  success: (msg: string) => void;
  error: (msg: string) => void;
}

export default function FixedPricesTab({
  templates,
  items,
  readOnly,
  notify,
}: {
  templates: BomTemplateRow[];
  items: FixedItemRow[];
  readOnly: boolean;
  notify: Notify;
}) {
  const [template, setTemplate] = useState(templates[0]?.uid ?? "");
  const [search, setSearch] = useState("");

  const api = useMemo(
    () => ({
      create: fixedItems.create,
      update: fixedItems.update,
      remove: (uid: string) => fixedItems.remove(uid),
    }),
    []
  );

  const toInput = useMemo(
    () =>
      versioned<FixedItemRow, FixedItemInput>((row) => ({
        template_uid: row.template_uid,
        name: row.name.trim(),
        code: row.code,
        unit_price: nullableNum(str(row.unit_price)),
        gst_rate: nullableNum(str(row.gst_rate)),
        qty: nullableNum(str(row.qty)),
        section: row.section,
        unit: row.unit,
        is_tube: row.is_tube,
        sort_order: row.sort_order,
      })),
    []
  );

  const { rows, isDirty, patch, add, discard, save, remove, busyId } = useEditableRows<
    FixedItemRow,
    FixedItemInput
  >(items, api, toInput, notify, saveErrorMessage);

  const current = templates.find((t) => t.uid === template);
  /** A blank row in the template now selected. Returns its uid so the page can scroll to it. */
  const addItem = useCallback(() => {
    if (!current) return;
    return add({
      template_uid: current.uid,
      component: null,
      category: null,
      code: "",
      name: "",
      unit_price: null,
      gst_rate: null,
      qty: "1",
      qty_rule: null,
      // Starts targeted at nothing rather than everything: a new row
      // defaulting to `{}` would be added to every quote the moment
      // it was saved, before anyone had set its price.
      condition: { sizes: [] },
      section: "",
      unit: "nos",
      is_tube: false,
      sort_order: rows.length,
      version: 0,
    } as Omit<FixedItemRow, "uid">);
  }, [add, current, rows.length]);

  const needle = search.trim().toLowerCase();
  const visible = rows.filter(
    (r) =>
      (!template || r.template_uid === template) &&
      (!needle || r.name.toLowerCase().includes(needle) || r.code.toLowerCase().includes(needle))
  );

  return (
    <section>
      <PanelIntro title="Fixed-price items">
        Rows priced from the template rather than the catalog. The condition decides which
        configurations each line appears in — an empty condition means every quote.
      </PanelIntro>

      <div className="flex flex-wrap items-center gap-2" style={{ marginBottom: 14 }}>
        {templates.map((t) => (
          <button
            key={t.uid}
            type="button"
            onClick={() => setTemplate(t.uid)}
            style={pill(t.uid === template)}
          >
            {t.name}
          </button>
        ))}
        <div className="ml-auto" style={{ minWidth: 200 }}>
          <TextField label="" value={search} onChange={setSearch} placeholder="Search name or code…" />
        </div>
      </div>

      {!readOnly && current && (
        <div style={{ marginBottom: 12 }}>
          <AddRowButton onAdd={addItem} emphasis>
            Add item to {current.name}
          </AddRowButton>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {visible.length === 0 && (
          <EmptyRow>{needle ? "Nothing matches that search." : "No fixed items on this template."}</EmptyRow>
        )}
        {visible.map((row) => (
          <RowCard
            key={row.uid}
            uid={row.uid}
            title={row.name || "New item"}
            meta={
              <ConditionSummary condition={row.condition} price={row.unit_price} isTube={row.is_tube} />
            }
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
                hint="Printed on the quote, and what the consumable classifier reads."
                disabled={readOnly}
              />
              <TextField
                label="Code"
                value={row.code}
                onChange={(v) => patch(row.uid, { code: v })}
                disabled={readOnly}
              />
              <NumberField
                label="Unit price"
                value={str(row.unit_price)}
                onChange={(v) => patch(row.uid, { unit_price: v })}
                prefix="₹"
                hint={row.is_tube ? "Ignored on the standard path, where tubes are priced by weight." : undefined}
                disabled={readOnly}
              />
              <NumberField
                label="Quantity"
                value={str(row.qty)}
                onChange={(v) => patch(row.uid, { qty: v })}
                hint={row.qty_rule ? "Overridden by this row's quantity rule." : undefined}
                disabled={readOnly}
              />
              <TextField
                label="Unit"
                value={row.unit}
                onChange={(v) => patch(row.uid, { unit: v })}
                placeholder="nos"
                disabled={readOnly}
              />
              <TextField
                label="Section"
                value={row.section}
                onChange={(v) => patch(row.uid, { section: v })}
                hint="Groups the line on the quote."
                disabled={readOnly}
              />
              <NumberField
                label="Sort order"
                value={String(row.sort_order ?? 0)}
                onChange={(v) => patch(row.uid, { sort_order: Number(v) || 0 })}
                disabled={readOnly}
              />
              <ToggleField
                label="Priced by weight"
                checked={row.is_tube}
                onChange={() => patch(row.uid, { is_tube: !row.is_tube })}
                hint="On for structure tubes on the standard path. The upgrade template's tubes are flat-priced, so this stays off there."
                disabled={readOnly}
              />
            </FieldGrid>

            <ConditionNote condition={row.condition} />
          </RowCard>
        ))}

        {!readOnly && current && (
          <AddRowButton onAdd={addItem}>Add item to {current.name}</AddRowButton>
        )}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Condition display                                                          */
/* -------------------------------------------------------------------------- */

/**
 * The condition is read-only here, shown rather than edited.
 *
 * It is a filter document (sizes, phases, tiers, battery_configs, min_kw,
 * max_kw) and a free-text editor over it would let a typo widen a line to every
 * quote silently. Showing what it currently targets is the useful half; editing
 * it is a separate job with its own validation.
 */
function ConditionSummary({
  condition,
  price,
  isTube,
}: {
  condition: Record<string, unknown>;
  price: string | null;
  isTube: boolean;
}) {
  const parts: string[] = [];
  if (price) parts.push(inr(price));
  if (isTube) parts.push("by weight");
  const keys = Object.keys(condition ?? {});
  parts.push(keys.length === 0 ? "every quote" : `${keys.length} condition${keys.length === 1 ? "" : "s"}`);
  return <>{parts.join(" · ")}</>;
}

function ConditionNote({ condition }: { condition: Record<string, unknown> }) {
  const entries = Object.entries(condition ?? {}).filter(
    ([, v]) => v !== null && v !== undefined && !(Array.isArray(v) && v.length === 0)
  );
  const empty = Object.keys(condition ?? {}).length === 0;

  return (
    <div
      style={{
        marginTop: 14,
        padding: "10px 12px",
        borderRadius: 10,
        background: empty ? "rgba(247,186,65,.12)" : "rgba(13,110,112,.05)",
        fontSize: 12,
        color: empty ? studioColors.amberInk : studioColors.bodyGray,
        lineHeight: 1.5,
      }}
    >
      {empty ? (
        <>
          <strong>Appears in every quote.</strong> No condition is set, so this line and its
          price are added to every size, tier and system type.
        </>
      ) : entries.length === 0 ? (
        <>
          <strong>Appears in no quote.</strong> Every condition on this row is an empty list,
          which nothing can match.
        </>
      ) : (
        <>
          Applies when:{" "}
          {entries.map(([k, v], i) => (
            <span key={k}>
              {i > 0 && ", "}
              <strong>{k.replace(/_/g, " ")}</strong> {Array.isArray(v) ? v.join(" / ") : String(v)}
            </span>
          ))}
        </>
      )}
    </div>
  );
}

function pill(active: boolean) {
  return {
    appearance: "none" as const,
    border: `1px solid ${active ? studioColors.teal : studioColors.ring}`,
    background: active ? "rgba(13,110,112,.08)" : "#fff",
    color: active ? studioColors.tealDeep : studioColors.mutedGray,
    borderRadius: 999,
    padding: "6px 13px",
    fontFamily: "var(--font-switzer)",
    fontSize: 12.5,
    fontWeight: active ? 600 : 500,
    cursor: "pointer",
  };
}
