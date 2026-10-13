"use client";

// src/components/Studio/BomAdmin/CatalogTab.tsx
//
// The component catalog, by category, with the engineering specs the string and
// MPPT engine reads.
//
// Two things the source tool cannot do, both worth the extra code:
//
// 1. **Every category is listed.** The source drives its editor off a
//    hand-written `CAT_ORDER` that omits about fourteen of the categories the
//    BOM actually uses, so those rows are invisible there. This list comes from
//    the API, so it is complete by construction and cannot drift.
//
// 2. **Panel and inverter specs are editable.** Without `voc_v`, `vmp_v`,
//    `isc_a`, the temperature coefficient and the MPPT window, the engine
//    returns no string layout at all -- correctly, since a guessed layout is
//    one an installer might build. This is the editor that makes that engine
//    usable rather than merely correct.
//
// Prices are not edited here. They live on the pricing side (append-only, with
// a release lifecycle), and a price field on this screen would imply a write
// this endpoint does not do.

import { useMemo, useState } from "react";
import { studioColors } from "../shared/format";
import {
  EmptyRow,
  FieldGrid,
  NumberField,
  PanelIntro,
  RowCard,
  TextField,
  str,
} from "../shared/rows";
import { useEditableRows } from "../shared/useEditableRows";
import {
  components,
  saveErrorMessage,
  versioned,
  type CatalogCategory,
  type CatalogComponent,
  type CatalogComponentInput,
  type CatalogTier,
} from "@/services/bomAdminService";

interface Notify {
  success: (msg: string) => void;
  error: (msg: string) => void;
}

const TIERS: CatalogTier[] = ["BASE", "VALUE", "PREMIUM"];

export default function CatalogTab({
  categories,
  items,
  readOnly,
  notify,
}: {
  categories: CatalogCategory[];
  items: CatalogComponent[];
  readOnly: boolean;
  notify: Notify;
}) {
  // Categories that actually hold components come first; the rest stay listed
  // so an empty category is visibly empty rather than missing.
  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of items) {
      const slug = item.category?.slug;
      if (slug) map.set(slug, (map.get(slug) ?? 0) + 1);
    }
    return map;
  }, [items]);

  const [category, setCategory] = useState(
    () => categories.find((c) => (counts.get(c.slug) ?? 0) > 0)?.slug ?? categories[0]?.slug ?? ""
  );
  const [search, setSearch] = useState("");

  const api = useMemo(
    () => ({
      // Components are created through the catalog's own screens, which handle
      // SKU generation and the category's attribute schema. This editor exists
      // to correct the specs of components that already exist.
      create: () => Promise.reject(new Error("Add components from the Catalog screen.")),
      update: components.update,
      remove: (uid: string) => components.remove(uid),
    }),
    []
  );

  const toInput = useMemo(
    () =>
      versioned<CatalogComponent, CatalogComponentInput>((row) => ({
        name: row.name.trim(),
        model: row.model,
        brand_label: row.brand_label,
        tiers: row.tiers,
        // Only the spec its category actually has: sending `panel_spec` for an
        // inverter would be writing to a table that does not exist for it.
        ...(row.spec_kind === "panel" ? { panel_spec: row.panel_spec } : {}),
        ...(row.spec_kind === "inverter" ? { inverter_spec: row.inverter_spec } : {}),
      })),
    []
  );

  const { rows, isDirty, patch, discard, save, busyId } = useEditableRows<
    CatalogComponent,
    CatalogComponentInput
  >(items, api, toInput, notify, saveErrorMessage);

  const needle = search.trim().toLowerCase();
  const visible = rows.filter(
    (r) =>
      (!category || r.category?.slug === category) &&
      (!needle || r.name.toLowerCase().includes(needle) || r.sku.toLowerCase().includes(needle))
  );

  return (
    <section>
      <PanelIntro title="Catalog">
        Names, tiers and the engineering specs of each component. A component with no tier
        is invisible to every quote. Prices are managed on the pricing side, not here.
      </PanelIntro>

      <div className="flex flex-wrap gap-1" style={{ marginBottom: 12 }}>
        {categories.map((c) => {
          const n = counts.get(c.slug) ?? 0;
          const active = c.slug === category;
          return (
            <button
              key={c.uid}
              type="button"
              onClick={() => setCategory(c.slug)}
              title={c.bom_role ? `BOM role: ${c.bom_role}` : undefined}
              style={{
                appearance: "none",
                border: `1px solid ${active ? studioColors.teal : studioColors.ring}`,
                background: active ? "rgba(13,110,112,.08)" : "#fff",
                color: active ? studioColors.tealDeep : n ? studioColors.bodyGray : studioColors.mutedGray,
                borderRadius: 999,
                padding: "5px 11px",
                fontFamily: "var(--font-switzer)",
                fontSize: 12,
                fontWeight: active ? 600 : 500,
                cursor: "pointer",
              }}
            >
              {c.name}
              <span style={{ opacity: 0.6, marginLeft: 5 }}>{n}</span>
            </button>
          );
        })}
      </div>

      <div style={{ maxWidth: 320, marginBottom: 14 }}>
        <TextField label="" value={search} onChange={setSearch} placeholder="Search name or SKU…" />
      </div>

      <div className="flex flex-col gap-3">
        {visible.length === 0 && (
          <EmptyRow>
            {needle ? "Nothing matches that search." : "No components in this category."}
          </EmptyRow>
        )}
        {visible.map((row) => (
          <RowCard
            key={row.uid}
            title={row.name || row.sku}
            meta={
              <>
                {row.sku}
                {row.tiers.length === 0 ? (
                  <strong style={{ color: studioColors.amberInk, marginLeft: 8 }}>no tier — never quoted</strong>
                ) : (
                  <span style={{ marginLeft: 8 }}>{row.tiers.map((t) => t.toLowerCase()).join(" / ")}</span>
                )}
              </>
            }
            dirty={isDirty(row)}
            busy={busyId === row.uid}
            readOnly={readOnly}
            onSave={() => save(row.uid)}
            onDiscard={() => discard(row.uid)}
          >
            <FieldGrid>
              <TextField
                label="Name"
                value={row.name}
                onChange={(v) => patch(row.uid, { name: v })}
                hint="Printed on the quote."
                disabled={readOnly}
              />
              <TextField
                label="Model"
                value={row.model}
                onChange={(v) => patch(row.uid, { model: v })}
                disabled={readOnly}
              />
              <TextField
                label="Brand"
                value={row.brand_label}
                onChange={(v) => patch(row.uid, { brand_label: v })}
                disabled={readOnly}
              />
            </FieldGrid>

            <Tiers
              value={row.tiers}
              onChange={(tiers) => patch(row.uid, { tiers })}
              disabled={readOnly}
            />

            {row.spec_kind === "panel" && (
              <PanelSpecFields row={row} patch={patch} readOnly={readOnly} />
            )}
            {row.spec_kind === "inverter" && (
              <InverterSpecFields row={row} patch={patch} readOnly={readOnly} />
            )}
          </RowCard>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Tiers                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Tiers as toggles, with the empty case called out.
 *
 * A component in no tier is not an error the API rejects -- it simply never
 * appears in a quote again, which is a silent and confusing way for a part to
 * disappear. So the state is shown rather than merely allowed.
 */
function Tiers({
  value,
  onChange,
  disabled,
}: {
  value: CatalogTier[];
  onChange: (tiers: CatalogTier[]) => void;
  disabled?: boolean;
}) {
  const toggle = (tier: CatalogTier) =>
    onChange(value.includes(tier) ? value.filter((t) => t !== tier) : [...value, tier]);

  return (
    <div style={{ marginTop: 14 }}>
      <p style={{ margin: "0 0 6px", fontSize: 11.5, fontWeight: 600, color: studioColors.mutedGray }}>
        Offered in
      </p>
      <div className="flex flex-wrap items-center gap-1">
        {TIERS.map((tier) => {
          const on = value.includes(tier);
          return (
            <button
              key={tier}
              type="button"
              disabled={disabled}
              onClick={() => toggle(tier)}
              style={{
                appearance: "none",
                border: `1px solid ${on ? studioColors.teal : studioColors.ring}`,
                background: on ? "rgba(13,110,112,.08)" : "#fff",
                color: on ? studioColors.tealDeep : studioColors.mutedGray,
                borderRadius: 9,
                padding: "6px 12px",
                fontFamily: "var(--font-switzer)",
                fontSize: 12.5,
                fontWeight: on ? 600 : 500,
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.6 : 1,
              }}
            >
              {tier.charAt(0) + tier.slice(1).toLowerCase()}
            </button>
          );
        })}
        {value.length === 0 && (
          <span style={{ fontSize: 11.5, color: studioColors.amberInk, marginLeft: 6 }}>
            With no tier selected this component will not appear in any quote.
          </span>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Engineering specs                                                          */
/* -------------------------------------------------------------------------- */

type Patch = (uid: string, changes: Partial<CatalogComponent>) => void;

function SpecSection({ title, hint, children }: { title: string; hint: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px dashed ${studioColors.ring}` }}>
      <p style={{ margin: "0 0 2px", fontSize: 12.5, fontWeight: 600, color: studioColors.tealDeep }}>
        {title}
      </p>
      <p style={{ margin: "0 0 12px", fontSize: 11.5, color: studioColors.mutedGray, lineHeight: 1.5 }}>
        {hint}
      </p>
      {children}
    </div>
  );
}

function PanelSpecFields({ row, patch, readOnly }: { row: CatalogComponent; patch: Patch; readOnly: boolean }) {
  const spec = row.panel_spec ?? {};
  const set = (changes: Partial<NonNullable<CatalogComponent["panel_spec"]>>) =>
    patch(row.uid, { panel_spec: { ...spec, ...changes } });

  return (
    <SpecSection
      title="Panel specification"
      hint="The string layout is computed from these. Leave any of Voc, Vmp, Isc or the temperature coefficient blank and the quote comes back with no layout rather than a guessed one."
    >
      <FieldGrid>
        <NumberField
          label="Wattage"
          value={str(spec.wattage_w)}
          onChange={(v) => set({ wattage_w: v === "" ? null : Number(v) })}
          suffix="W"
          hint="Also sets the panel count: a 3 kW system is 6 panels at 540 W but 5 at 620 W."
          disabled={readOnly}
        />
        <NumberField
          label="Voc"
          value={str(spec.voc_v)}
          onChange={(v) => set({ voc_v: v || null })}
          suffix="V"
          disabled={readOnly}
        />
        <NumberField
          label="Vmp"
          value={str(spec.vmp_v)}
          onChange={(v) => set({ vmp_v: v || null })}
          suffix="V"
          disabled={readOnly}
        />
        <NumberField
          label="Isc"
          value={str(spec.isc_a)}
          onChange={(v) => set({ isc_a: v || null })}
          suffix="A"
          disabled={readOnly}
        />
        <NumberField
          label="Voc temp. coefficient"
          value={str(spec.temperature_coefficient_voc)}
          onChange={(v) => set({ temperature_coefficient_voc: v || null })}
          suffix="%/°C"
          hint="Negative, e.g. −0.25."
          disabled={readOnly}
        />
        <NumberField
          label="Max system voltage"
          value={str(spec.max_system_voltage_v)}
          onChange={(v) => set({ max_system_voltage_v: v === "" ? null : Number(v) })}
          suffix="V"
          disabled={readOnly}
        />
      </FieldGrid>
      <DcrNote isDcr={spec.is_dcr} onChange={(v) => set({ is_dcr: v })} disabled={readOnly} />
    </SpecSection>
  );
}

/**
 * DCR content, which decides three separate things and so is not a plain label:
 * which panels may be offered, whether PM Surya Ghar applies, and (on hybrid)
 * which price list the quote reads.
 *
 * A panel whose content was never recorded is treated as non-DCR — erring away
 * from promising a subsidy it may not qualify for.
 */
function DcrNote({
  isDcr,
  onChange,
  disabled,
}: {
  isDcr: boolean | null | undefined;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  const unrecorded = isDcr === null || isDcr === undefined;
  return (
    <div className="flex flex-wrap items-center gap-2" style={{ marginTop: 12 }}>
      {([true, false] as const).map((v) => (
        <button
          key={String(v)}
          type="button"
          disabled={disabled}
          onClick={() => onChange(v)}
          style={{
            appearance: "none",
            border: `1px solid ${isDcr === v ? studioColors.teal : studioColors.ring}`,
            background: isDcr === v ? "rgba(13,110,112,.08)" : "#fff",
            color: isDcr === v ? studioColors.tealDeep : studioColors.mutedGray,
            borderRadius: 9,
            padding: "6px 12px",
            fontFamily: "var(--font-switzer)",
            fontSize: 12.5,
            fontWeight: isDcr === v ? 600 : 500,
            cursor: disabled ? "not-allowed" : "pointer",
            opacity: disabled ? 0.6 : 1,
          }}
        >
          {v ? "DCR" : "Non-DCR"}
        </button>
      ))}
      <span style={{ fontSize: 11.5, color: unrecorded ? studioColors.amberInk : studioColors.mutedGray, lineHeight: 1.5 }}>
        {unrecorded
          ? "Not recorded — treated as Non-DCR, so no subsidy is offered on it."
          : "Decides panel eligibility, whether PM Surya Ghar applies, and the hybrid price list."}
      </span>
    </div>
  );
}

function InverterSpecFields({ row, patch, readOnly }: { row: CatalogComponent; patch: Patch; readOnly: boolean }) {
  const spec = row.inverter_spec ?? {};
  const set = (changes: Partial<NonNullable<CatalogComponent["inverter_spec"]>>) =>
    patch(row.uid, { inverter_spec: { ...spec, ...changes } });

  return (
    <SpecSection
      title="Inverter specification"
      hint="The MPPT window and input limits decide how many panels go in a string and whether the layout is safe to install."
    >
      <FieldGrid>
        <NumberField
          label="Rating"
          value={str(spec.kw)}
          onChange={(v) => set({ kw: v || null })}
          suffix="kW"
          disabled={readOnly}
        />
        <NumberField
          label="MPPT count"
          value={str(spec.mppt_count)}
          onChange={(v) => set({ mppt_count: v === "" ? null : Number(v) })}
          disabled={readOnly}
        />
        <NumberField
          label="MPPT voltage min"
          value={str(spec.mppt_voltage_min_v)}
          onChange={(v) => set({ mppt_voltage_min_v: v === "" ? null : Number(v) })}
          suffix="V"
          disabled={readOnly}
        />
        <NumberField
          label="MPPT voltage max"
          value={str(spec.mppt_voltage_max_v)}
          onChange={(v) => set({ mppt_voltage_max_v: v === "" ? null : Number(v) })}
          suffix="V"
          disabled={readOnly}
        />
        <NumberField
          label="Max PV voltage"
          value={str(spec.max_pv_voltage_v)}
          onChange={(v) => set({ max_pv_voltage_v: v === "" ? null : Number(v) })}
          suffix="V"
          hint="Exceeding it can destroy the inverter, so a layout that would is reported as critical."
          disabled={readOnly}
        />
        <NumberField
          label="Max strings per MPPT"
          value={str(spec.max_strings_per_mppt)}
          onChange={(v) => set({ max_strings_per_mppt: v === "" ? null : Number(v) })}
          disabled={readOnly}
        />
        <NumberField
          label="Max input current"
          value={str(spec.max_isc_a)}
          onChange={(v) => set({ max_isc_a: v || null })}
          suffix="A"
          disabled={readOnly}
        />
        <NumberField
          label="Panels per device"
          value={str(spec.panels_per_device)}
          onChange={(v) => set({ panels_per_device: v === "" ? null : Number(v) })}
          hint="Micro-inverters only: how many panels one unit serves."
          disabled={readOnly}
        />
      </FieldGrid>
    </SpecSection>
  );
}
