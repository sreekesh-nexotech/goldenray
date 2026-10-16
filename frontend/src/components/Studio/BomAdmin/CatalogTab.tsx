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
//
// ── Adding things ─────────────────────────────────────────────────────────
//
// Products and categories are both created here. Three platform rules shape
// how, and none of them is guessable from the form:
//
// * **Three permissions, not one.** `catalog.create` to add, `catalog.edit` to
//   change, `catalog.approve` to activate. A button gated on the wrong verb
//   renders for a role the API then refuses, so each asks for its own.
// * **A new component is born DRAFT, and a DRAFT is quoted by nobody** -- the
//   same silent disappearance as having no tier. Creating one is therefore two
//   steps, and the second is stated rather than implied.
// * **Panels and inverters cannot be activated without their spec**
//   (`wattage_w`; `kw` + `inverter_type`), because the BOM builder sizes the
//   system from them. The spec is left optional at create time and required at
//   activation, which is where the server draws the line too.

import { useCallback, useMemo, useState } from "react";
import { studioColors } from "../shared/format";
import { GhostButton, SelectField } from "../shared/primitives";
import {
  AddRowButton,
  EmptyRow,
  FieldGrid,
  NumberField,
  PanelIntro,
  RowCard,
  TextField,
  str,
} from "../shared/rows";
import { isNewRow, useEditableRows } from "../shared/useEditableRows";
import {
  BOM_ROLES,
  CATEGORY_UNITS,
  categories as categoriesApi,
  components,
  saveErrorMessage,
  versioned,
  type CatalogCategory,
  type CatalogComponent,
  type CatalogComponentInput,
  type CatalogTier,
} from "@/services/bomAdminService";
import type { StudioAction } from "@/services/studioService";

interface Notify {
  success: (msg: string) => void;
  error: (msg: string) => void;
}

const TIERS: CatalogTier[] = ["BASE", "VALUE", "PREMIUM"];
const INVERTER_TYPES = ["ONGRID", "HYBRID"] as const;

/** A spec object with nothing filled in — there is no point sending it. */
function isBlankSpec(spec: object | null | undefined): boolean {
  if (!spec) return true;
  return Object.values(spec).every((v) => v === null || v === undefined || v === "");
}

export default function CatalogTab({
  categories,
  items,
  readOnly,
  can,
  notify,
}: {
  categories: CatalogCategory[];
  items: CatalogComponent[];
  readOnly: boolean;
  /**
   * `catalog.<verb>`. Creating is its own verb server-side, not `edit`, so a
   * button gated on `edit` would render for roles that then get a 403 on save.
   */
  can: (action: StudioAction) => boolean;
  notify: Notify;
}) {
  // The first category that holds anything, chosen once from the loaded list.
  // (The live counts below cannot seed this: they depend on `rows`, which the
  // editing hook owns, and the hook is created further down.)
  const [category, setCategory] = useState(() => {
    const held = new Set(items.map((i) => i.category?.slug).filter(Boolean));
    return categories.find((c) => held.has(c.slug))?.slug ?? categories[0]?.slug ?? "";
  });
  const [search, setSearch] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);
  const [busyAction, setBusyAction] = useState<string | null>(null);
  // Categories created in this session, so the new pill appears without a reload.
  const [extraCategories, setExtraCategories] = useState<CatalogCategory[]>([]);
  const allCategories = useMemo(
    () => [...categories, ...extraCategories],
    [categories, extraCategories]
  );
  const api = useMemo(
    () => ({
      create: components.create,
      update: components.update,
      remove: (uid: string) => components.remove(uid),
    }),
    []
  );

  const toInput = useMemo(
    () =>
      versioned<CatalogComponent, CatalogComponentInput>((row) => {
        const isNew = isNewRow(row.uid);
        return {
          // `category` decides which spec table the row carries, so it is a
          // create-time choice; changing it later is a move, not an edit.
          ...(isNew ? { category: row.category?.uid, sku: row.sku.trim() || undefined } : {}),
          name: row.name.trim(),
          model: row.model,
          brand_label: row.brand_label,
          tiers: row.tiers,
          // Only the spec its category actually has: sending `panel_spec` for an
          // inverter would be writing to a table that does not exist for it.
          // An untouched spec on a new row is omitted rather than sent empty:
          // the server requires `wattage_w` (panel) and `kw` + `inverter_type`
          // (inverter) the moment the spec exists, so sending `{}` would fail on
          // fields the person has not been asked for yet. The row saves as a
          // draft without a spec, and Activate is what insists on it.
          ...(row.spec_kind === "panel" && !(isNew && isBlankSpec(row.panel_spec))
            ? { panel_spec: row.panel_spec }
            : {}),
          ...(row.spec_kind === "inverter" && !(isNew && isBlankSpec(row.inverter_spec))
            ? { inverter_spec: row.inverter_spec }
            : {}),
        };
      }),
    []
  );

  const { rows, isDirty, patch, add, discard, save, replace, busyId } = useEditableRows<
    CatalogComponent,
    CatalogComponentInput
  >(items, api, toInput, notify, saveErrorMessage);

  /**
   * DRAFT -> ACTIVE. Its own endpoint and its own permission, because it is the
   * step that makes a component quotable: until it runs, a newly created row is
   * saved, correct and invisible to every quote.
   */
  const activate = useCallback(
    async (row: CatalogComponent) => {
      setBusyAction(row.uid);
      try {
        const next = await components.activate(row.uid, { expected_version: row.version });
        replace(next);
        notify.success("Activated — it can now be quoted.");
      } catch (err) {
        notify.error(saveErrorMessage(err));
      } finally {
        setBusyAction(null);
      }
    },
    [notify, replace]
  );

  /** A blank row in the category now selected, so the spec fields match it. */
  const addComponent = useCallback(() => {
    const cat = allCategories.find((c) => c.slug === category);
    if (!cat) {
      notify.error("Pick a category first.");
      return;
    }
    return add({
      sku: "",
      name: "",
      model: "",
      category: { uid: cat.uid, slug: cat.slug, name: cat.name },
      brand_label: "",
      status: "DRAFT",
      is_public: false,
      tiers: [],
      spec_kind: cat.spec_kind,
      panel_spec: null,
      inverter_spec: null,
      effective_gst_rate: null,
      effective_unit: null,
      version: 0,
    } as Omit<CatalogComponent, "uid">);
  }, [add, allCategories, category, notify]);

  const onCategoryCreated = useCallback(
    (created: CatalogCategory) => {
      setExtraCategories((prev) => [...prev, created]);
      setCategory(created.slug);
      setAddingCategory(false);
      notify.success(`Added the ${created.name} type.`);
    },
    [notify]
  );

  // Counted off the live rows rather than the loaded prop, so saving a new
  // component moves its category's number straight away.
  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const row of rows) {
      const slug = row.category?.slug;
      if (slug) map.set(slug, (map.get(slug) ?? 0) + 1);
    }
    return map;
  }, [rows]);

  const needle = search.trim().toLowerCase();
  const visible = rows.filter(
    (r) =>
      (!category || r.category?.slug === category) &&
      // An unsaved row has no name or SKU to match yet, so a search that was
      // already typed must not hide the row the person just asked for.
      (!needle ||
        isNewRow(r.uid) ||
        r.name.toLowerCase().includes(needle) ||
        r.sku.toLowerCase().includes(needle))
  );

  return (
    <section>
      <PanelIntro title="Catalog">
        Names, tiers and the engineering specs of each component. A component with no tier
        is invisible to every quote. Prices are managed on the pricing side, not here.
      </PanelIntro>

      <div className="flex flex-wrap items-center gap-1" style={{ marginBottom: 12 }}>
        {allCategories.map((c) => {
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
        {!readOnly && can("create") && !addingCategory && (
          <button
            type="button"
            onClick={() => setAddingCategory(true)}
            title="Add a new category"
            style={{
              appearance: "none",
              border: `1px dashed ${studioColors.teal}`,
              background: "#fff",
              color: studioColors.teal,
              borderRadius: 999,
              padding: "5px 11px",
              fontFamily: "var(--font-switzer)",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            + New type
          </button>
        )}
      </div>

      {addingCategory && (
        <NewCategoryForm
          onCancel={() => setAddingCategory(false)}
          onCreated={onCategoryCreated}
          notify={notify}
        />
      )}

      <div style={{ maxWidth: 320, marginBottom: 14 }}>
        <TextField label="" value={search} onChange={setSearch} placeholder="Search name or SKU…" />
      </div>

      {!readOnly && can("create") && category && (
        <div style={{ marginBottom: 12 }}>
          <AddRowButton onAdd={addComponent} emphasis>
            Add product
          </AddRowButton>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {visible.length === 0 && (
          <EmptyRow>
            {needle ? "Nothing matches that search." : "No components in this category."}
          </EmptyRow>
        )}
        {visible.map((row) => {
          const unsaved = isNewRow(row.uid);
          return (
          <RowCard
            key={row.uid}
            uid={row.uid}
            title={row.name || (unsaved ? "New component" : row.sku)}
            meta={
              <>
                {unsaved ? <em>not saved yet</em> : row.sku}
                {row.status === "DRAFT" && !unsaved && (
                  <strong style={{ color: studioColors.amberInk, marginLeft: 8 }}>
                    draft — not quoted until activated
                  </strong>
                )}
                {row.tiers.length === 0 ? (
                  <strong style={{ color: studioColors.amberInk, marginLeft: 8 }}>no tier — never quoted</strong>
                ) : (
                  <span style={{ marginLeft: 8 }}>{row.tiers.map((t) => t.toLowerCase()).join(" / ")}</span>
                )}
              </>
            }
            dirty={isDirty(row)}
            busy={busyId === row.uid || busyAction === row.uid}
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

            {unsaved && (
              <div style={{ marginTop: 14 }}>
                <FieldGrid>
                  <TextField
                    label="SKU"
                    value={row.sku}
                    onChange={(v) => patch(row.uid, { sku: v })}
                    placeholder="Generated"
                    hint="Leave blank for the next number in this category. It cannot be changed once the component is active."
                    disabled={readOnly}
                  />
                </FieldGrid>
                <p style={{ margin: "10px 0 0", fontSize: 11.5, color: studioColors.mutedGray, lineHeight: 1.5 }}>
                  Saving adds this as a <strong>draft</strong>. Drafts are not quoted — activate it below once the
                  details are right.
                </p>
              </div>
            )}

            {!unsaved && row.status === "DRAFT" && !readOnly && can("approve") && (
              <div
                className="flex flex-wrap items-center gap-2"
                style={{ marginTop: 16, paddingTop: 14, borderTop: `1px dashed ${studioColors.ring}` }}
              >
                <GhostButton
                  onClick={() => activate(row)}
                  disabled={busyAction === row.uid || isDirty(row)}
                  style={{ height: 32, fontSize: 12 }}
                >
                  {busyAction === row.uid ? "Working…" : "Activate"}
                </GhostButton>
                <span style={{ fontSize: 11.5, color: studioColors.mutedGray, lineHeight: 1.5 }}>
                  {isDirty(row)
                    ? "Save your changes first."
                    : row.spec_kind === "panel" || row.spec_kind === "inverter"
                      ? "A panel needs its wattage and an inverter its rating before it can be activated."
                      : "Makes it quotable."}
                </span>
              </div>
            )}
          </RowCard>
          );
        })}

        {!readOnly && can("create") && category && (
          <AddRowButton onAdd={addComponent}>Add product</AddRowButton>
        )}
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
          hint="Required. Also sets the panel count: a 3 kW system is 6 panels at 540 W but 5 at 620 W."
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
          hint="Required — the BOM builder sizes the system by it."
          disabled={readOnly}
        />
        <div>
          <p style={{ margin: "0 0 6px", fontSize: 11.5, fontWeight: 600, color: studioColors.mutedGray }}>
            Type
          </p>
          <SelectField
            value={spec.inverter_type ?? ""}
            onChange={(v) => set({ inverter_type: v || null })}
            ariaLabel="Inverter type"
            style={readOnly ? { opacity: 0.6, pointerEvents: "none" } : undefined}
          >
            <option value="">—</option>
            {INVERTER_TYPES.map((t) => (
              <option key={t} value={t}>
                {t === "ONGRID" ? "On-grid" : "Hybrid"}
              </option>
            ))}
          </SelectField>
          <p style={{ margin: "6px 0 0", fontSize: 11.5, color: studioColors.mutedGray, lineHeight: 1.5 }}>
            Required alongside the rating.
          </p>
        </div>
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

/* -------------------------------------------------------------------------- */
/*  New category                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Adding a type (a category), which is a heavier decision than adding a product
 * and so is a deliberate form rather than a blank row.
 *
 * Two fields are consequential and neither is obvious from its name:
 *
 * - **BOM role** decides which spec table the category's components carry. Pick
 *   Miscellaneous for what is really a panel and the wattage, Voc and Vmp
 *   fields never appear, so the string engine has nothing to compute a layout
 *   from. The role is fixed at the point a component exists under it.
 * - **GST rate is a fraction**, as the API stores it: 0.18, not 18. Typed as
 *   `18` it is rejected rather than silently applied -- a hundredfold error on
 *   every line of every quote using the category.
 */
function NewCategoryForm({
  onCancel,
  onCreated,
  notify,
}: {
  onCancel: () => void;
  onCreated: (created: CatalogCategory) => void;
  notify: Notify;
}) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [role, setRole] = useState("MISC");
  const [gst, setGst] = useState("0.18");
  const [prefix, setPrefix] = useState("");
  const [unit, setUnit] = useState("NOS");
  const [busy, setBusy] = useState(false);

  const autoSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const effectiveSlug = slug.trim() || autoSlug;
  const autoPrefix = (name.replace(/[^A-Za-z]/g, "").slice(0, 3) || "GEN").toUpperCase();
  const effectivePrefix = prefix.trim().toUpperCase() || autoPrefix;
  const gstNumber = Number(gst);
  const spec = BOM_ROLES.find((r) => r.value === role)?.spec ?? null;

  // Checked here as well as server-side: a fraction typed as a percentage is
  // the one mistake that reads as a plausible number in the field.
  const problem =
    !name.trim()
      ? "Give the type a name."
      : !effectiveSlug
        ? "Give the type a slug."
        : !Number.isFinite(gstNumber) || gstNumber < 0 || gstNumber > 1
          ? "GST is a fraction between 0 and 1 — 0.18 for 18%."
          : null;

  const submit = async () => {
    if (problem) {
      notify.error(problem);
      return;
    }
    setBusy(true);
    try {
      const created = await categoriesApi.create({
        slug: effectiveSlug,
        name: name.trim(),
        bom_role: role,
        gst_rate: gst,
        unit,
        sku_prefix: effectivePrefix,
      });
      onCreated(created);
    } catch (err) {
      notify.error(saveErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      style={{
        border: `1px solid ${studioColors.ring}`,
        borderRadius: 14,
        padding: 16,
        marginBottom: 14,
        background: "#fff",
      }}
    >
      <p style={{ margin: "0 0 12px", fontSize: 12.5, fontWeight: 600, color: studioColors.tealDeep }}>
        New type
      </p>

      <FieldGrid>
        <TextField
          label="Name"
          value={name}
          onChange={setName}
          hint="Shown on the chips above."
          disabled={busy}
        />
        <TextField
          label="Slug"
          value={slug}
          onChange={setSlug}
          placeholder={autoSlug || "slug"}
          hint="Derived from the name when blank."
          disabled={busy}
        />
        <TextField
          label="SKU prefix"
          value={prefix}
          onChange={setPrefix}
          placeholder={autoPrefix}
          hint={`SKUs become ${effectivePrefix}-0001, ${effectivePrefix}-0002 …`}
          disabled={busy}
        />
        <NumberField
          label="GST rate"
          value={gst}
          onChange={setGst}
          hint="A fraction: 0.18 is 18%."
          disabled={busy}
        />
      </FieldGrid>

      <div className="flex flex-wrap gap-3" style={{ marginTop: 14 }}>
        <div style={{ minWidth: 190, flex: "1 1 190px" }}>
          <p style={{ margin: "0 0 6px", fontSize: 11.5, fontWeight: 600, color: studioColors.mutedGray }}>
            BOM role
          </p>
          <SelectField value={role} onChange={setRole} ariaLabel="BOM role">
            {BOM_ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </SelectField>
          <p style={{ margin: "6px 0 0", fontSize: 11.5, color: studioColors.mutedGray, lineHeight: 1.5 }}>
            {spec
              ? `Its products carry the ${spec} specification, and the quote engine reads it.`
              : "Its products carry no engineering specification."}
          </p>
        </div>
        <div style={{ minWidth: 190, flex: "1 1 190px" }}>
          <p style={{ margin: "0 0 6px", fontSize: 11.5, fontWeight: 600, color: studioColors.mutedGray }}>
            Unit
          </p>
          <SelectField value={unit} onChange={setUnit} ariaLabel="Unit">
            {CATEGORY_UNITS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </SelectField>
        </div>
      </div>

      <p style={{ margin: "12px 0 0", fontSize: 11.5, color: studioColors.amberInk, lineHeight: 1.5 }}>
        The BOM role fixes which specification its products carry, so it is worth getting right now.
      </p>

      <div className="flex flex-wrap items-center gap-2" style={{ marginTop: 14 }}>
        <GhostButton onClick={submit} disabled={busy || !!problem} style={{ height: 34, fontSize: 12.5 }}>
          {busy ? "Adding…" : "Add type"}
        </GhostButton>
        <GhostButton onClick={onCancel} disabled={busy} style={{ height: 34, fontSize: 12.5 }}>
          Cancel
        </GhostButton>
        {problem && (
          <span style={{ fontSize: 11.5, color: studioColors.amberInk }}>{problem}</span>
        )}
      </div>
    </div>
  );
}
