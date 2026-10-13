"use client";

// src/components/Studio/BomAdmin/BomAdminScreen.tsx
//
// Content Studio → BOM Admin. The data the BOM calculator reads: the component
// catalog and its engineering specs, the structure and tube rates, the
// templates' fixed prices, and the discount offers.
//
// A thin tabbed orchestrator, following Studio/EmiCalculator. One deliberate
// difference: each tab loads its own data when first opened, rather than the
// screen loading everything up front. The catalog alone is a few hundred
// components across three apps' endpoints, and most visits here are to change
// one number on one tab.
//
// The four tabs also span four different permission modules (`catalog`, `bom`,
// `bom`, `offers`), so a tab the user cannot read is not shown at all — a tab
// that opens onto a 403 is worse than a tab that is not there.

import { useCallback, useEffect, useMemo, useState } from "react";
import { PageHeader, TipBanner } from "../shared/primitives";
import { useStudio } from "../shared/StudioContext";
import { studioColors } from "../shared/format";
import {
  categories as categoriesApi,
  components as componentsApi,
  fixedItems as fixedItemsApi,
  offers as offersApi,
  structureItems as structureItemsApi,
  structureTemplates as structureTemplatesApi,
  templates as templatesApi,
  tubeWeights as tubeWeightsApi,
  type BomTemplateRow,
  type CatalogCategory,
  type CatalogComponent,
  type FixedItemRow,
  type OfferRow,
  type StructureItemRow,
  type StructureTemplateRow,
  type TubeWeightRow,
} from "@/services/bomAdminService";
import type { StudioAction, StudioModule } from "@/services/studioService";
import CatalogTab from "./CatalogTab";
import StructureRatesTab from "./StructureRatesTab";
import FixedPricesTab from "./FixedPricesTab";
import OffersTab from "./OffersTab";

type TabKey = "catalog" | "structure" | "fixed" | "offers";

const TABS: { key: TabKey; label: string; module: StudioModule }[] = [
  { key: "catalog", label: "Catalog", module: "catalog" },
  { key: "structure", label: "Structure & tubes", module: "bom" },
  { key: "fixed", label: "Fixed prices", module: "bom" },
  { key: "offers", label: "Offers", module: "offers" },
];

interface CatalogData {
  categories: CatalogCategory[];
  components: CatalogComponent[];
}
interface StructureData {
  templates: StructureTemplateRow[];
  items: StructureItemRow[];
  weights: TubeWeightRow[];
}
interface FixedData {
  templates: BomTemplateRow[];
  items: FixedItemRow[];
}

export default function BomAdminScreen() {
  const { toast, me, can } = useStudio();

  const visibleTabs = useMemo(
    () => (me ? TABS.filter((t) => can(t.module, "view")) : []),
    [me, can]
  );
  const [tab, setTab] = useState<TabKey>("catalog");

  // Land on a tab the user can actually read.
  useEffect(() => {
    if (visibleTabs.length && !visibleTabs.some((t) => t.key === tab)) {
      setTab(visibleTabs[0].key);
    }
  }, [visibleTabs, tab]);

  const notify = useMemo(
    () => ({
      success: (msg: string) => toast(msg),
      error: (msg: string) => toast(msg, "error"),
    }),
    [toast]
  );

  const catalog = useLoaded<CatalogData>(
    tab === "catalog",
    useCallback(async () => {
      const [categories, components] = await Promise.all([
        categoriesApi.list({ is_active: true }),
        componentsApi.list(),
      ]);
      return {
        categories: [...categories].sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name)),
        components,
      };
    }, [])
  );

  const structure = useLoaded<StructureData>(
    tab === "structure",
    useCallback(async () => {
      const [templates, items, weights] = await Promise.all([
        structureTemplatesApi.list(),
        structureItemsApi.list(),
        tubeWeightsApi.list(),
      ]);
      return { templates, items, weights };
    }, [])
  );

  const fixed = useLoaded<FixedData>(
    tab === "fixed",
    useCallback(async () => {
      const [templates, items] = await Promise.all([templatesApi.list(), fixedItemsApi.list()]);
      return { templates, items };
    }, [])
  );

  const offerRows = useLoaded<OfferRow[]>(
    tab === "offers",
    useCallback(() => offersApi.list(), [])
  );

  // Each tab is read-only unless the user holds the edit verb its endpoint
  // enforces — the same grant the API checks, so what is disabled here is
  // exactly what would be refused there.
  // While `me` is still loading, `can()` answers false, which is the right way
  // round: the tabs start read-only and gain controls, rather than offering a
  // Save that turns out to be refused.
  const canEdit = useCallback(
    (module: StudioModule) => (me ? can(module, "edit") : false),
    [me, can]
  );
  const offersCan = useCallback(
    (action: StudioAction) => (me ? can("offers", action) : false),
    [me, can]
  );

  if (me && visibleTabs.length === 0) {
    return (
      <div>
        <PageHeader title="BOM Admin" subtitle="The data behind the BOM calculator." />
        <p style={{ fontSize: 13.5, color: studioColors.mutedGray }}>
          Your role does not include any of these areas. Ask an Admin for the catalog, BOM or
          offers permission.
        </p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="BOM Admin"
        subtitle="The catalog, structure rates, fixed prices and offers the BOM calculator reads."
      />

      <TipBanner>
        Every row here feeds the calculator directly, so a saved change applies to the next
        quote anyone produces. Nothing is written until a row is explicitly saved — a
        half-typed rate never reaches a customer.
      </TipBanner>

      <div
        className="flex flex-wrap gap-1"
        style={{ margin: "16px 0 18px", borderBottom: `1px solid ${studioColors.ring}` }}
      >
        {visibleTabs.map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              style={{
                appearance: "none",
                border: "none",
                background: "transparent",
                padding: "9px 14px",
                marginBottom: -1,
                fontFamily: "var(--font-switzer)",
                fontSize: 13,
                fontWeight: active ? 600 : 500,
                color: active ? studioColors.teal : studioColors.mutedGray,
                borderBottom: `2px solid ${active ? studioColors.gold : "transparent"}`,
                cursor: "pointer",
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === "catalog" && (
        <Loaded state={catalog}>
          {(data) => (
            <CatalogTab
              categories={data.categories}
              items={data.components}
              readOnly={!canEdit("catalog")}
              notify={notify}
            />
          )}
        </Loaded>
      )}

      {tab === "structure" && (
        <Loaded state={structure}>
          {(data) => (
            <StructureRatesTab
              templates={data.templates}
              items={data.items}
              weights={data.weights}
              readOnly={!canEdit("bom")}
              notify={notify}
            />
          )}
        </Loaded>
      )}

      {tab === "fixed" && (
        <Loaded state={fixed}>
          {(data) => (
            <FixedPricesTab
              templates={data.templates}
              items={data.items}
              readOnly={!canEdit("bom")}
              notify={notify}
            />
          )}
        </Loaded>
      )}

      {tab === "offers" && (
        <Loaded state={offerRows}>
          {(data) => (
            <OffersTab items={data} readOnly={!canEdit("offers")} can={offersCan} notify={notify} />
          )}
        </Loaded>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Per-tab loading                                                            */
/* -------------------------------------------------------------------------- */

interface LoadState<T> {
  data: T | null;
  error: string | null;
}

/**
 * Load once, the first time its tab is opened.
 *
 * Keeps the data afterwards so switching tabs back and forth does not re-fetch,
 * and so an in-progress edit on a tab survives a glance at another one.
 */
function useLoaded<T>(active: boolean, load: () => Promise<T>): LoadState<T> {
  const [state, setState] = useState<LoadState<T>>({ data: null, error: null });
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!active || started) return;
    setStarted(true);
    let live = true;
    load()
      .then((data) => live && setState({ data, error: null }))
      .catch((err) =>
        live &&
        setState({
          data: null,
          error: err instanceof Error ? err.message : "Could not load this tab.",
        })
      );
    return () => {
      live = false;
    };
  }, [active, started, load]);

  return state;
}

function Loaded<T>({ state, children }: { state: LoadState<T>; children: (data: T) => React.ReactNode }) {
  if (state.error) {
    return (
      <p role="alert" style={{ fontSize: 13.5, color: studioColors.danger }}>
        {state.error}
      </p>
    );
  }
  if (state.data === null) {
    return <p style={{ fontSize: 13.5, color: studioColors.mutedGray }}>Loading…</p>;
  }
  return <>{children(state.data)}</>;
}
