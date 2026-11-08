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

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PageHeader, TipBanner } from "../shared/primitives";
import { useStudio } from "../shared/StudioContext";
import { studioColors } from "../shared/format";
import {
  categories as categoriesApi,
  fixedItems as fixedItemsApi,
  costConfig as costConfigApi,
  offers as offersApi,
  rateSets as rateSetsApi,
  structureItems as structureItemsApi,
  structureTemplates as structureTemplatesApi,
  templates as templatesApi,
  tubeWeights as tubeWeightsApi,
  type BomTemplateRow,
  type CatalogCategory,
  type CostConfigBody,
  type FixedItemRow,
  type MarketRateSet,
  type OfferRow,
  type StructureItemRow,
  type StructureTemplateRow,
  type TubeWeightRow,
} from "@/services/bomAdminService";
import type { StudioAction, StudioModule } from "@/services/studioService";
import CatalogTab from "./CatalogTab";
import StructureRatesTab from "./StructureRatesTab";
import FixedPricesTab from "./FixedPricesTab";
import CostsTab from "./CostsTab";
import TariffTab from "./TariffTab";
import RatesTab from "./RatesTab";
import OffersTab from "./OffersTab";

type TabKey = "catalog" | "structure" | "fixed" | "costs" | "tariff" | "rates" | "offers";

const TABS: { key: TabKey; label: string; module: StudioModule }[] = [
  { key: "catalog", label: "Catalog", module: "catalog" },
  { key: "structure", label: "Structure & tubes", module: "bom" },
  { key: "fixed", label: "Fixed prices", module: "bom" },
  // Cost config lives under `pricing`, not `bom`: it is already gated there
  // (`pricing.edit` to write, with margin keys additionally needing
  // `pricing_internal.view`), which is why the port needed no new permission
  // module for it.
  { key: "costs", label: "Cost rates", module: "pricing" },
  // Same `pricing` module and the same `CostConfig` storage as the cost rates --
  // `energy.config` is a key in that registry, not a model of its own.
  { key: "tariff", label: "Tariff", module: "pricing" },
  { key: "rates", label: "Market rates", module: "market_rates" },
  { key: "offers", label: "Offers", module: "offers" },
];

interface CatalogData {
  categories: CatalogCategory[];
  counts: Record<string, number>;
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

  // Only the chips are loaded up front. The components themselves are paged by
  // the tab, because the catalog outgrew the server's 200-row page cap and a
  // single request silently returned 200 of 275 -- a complete-looking list
  // missing the rows someone had just added.
  const catalog = useLoaded<CatalogData>(
    tab === "catalog",
    useCallback(async () => {
      const [categories, counts] = await Promise.all([
        categoriesApi.list({ is_active: true }),
        categoriesApi.counts(),
      ]);
      return {
        categories: [...categories].sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name)),
        counts: Object.fromEntries(counts.map((row) => [row.slug, row.count])),
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

  const costs = useLoaded<CostConfigBody>(
    tab === "costs" || tab === "tariff",
    useCallback(() => costConfigApi.get(), [])
  );

  const sets = useLoaded<MarketRateSet[]>(
    tab === "rates",
    useCallback(() => rateSetsApi.list(), [])
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
  const ratesCan = useCallback(
    (action: StudioAction) => (me ? can("market_rates", action) : false),
    [me, can]
  );
  const offersCan = useCallback(
    (action: StudioAction) => (me ? can("offers", action) : false),
    [me, can]
  );
  // Catalog writes split across three verbs, not one: creating a component is
  // `create`, editing it is `edit`, and activating it is `approve`. The tab asks
  // per verb so a control that would 403 is never rendered.
  const catalogCan = useCallback(
    (action: StudioAction) => (me ? can("catalog", action) : false),
    [me, can]
  );

  if (me && visibleTabs.length === 0) {
    return (
      <div>
        <PageHeader title="BOM Admin" subtitle="The data behind the BOM calculator." />
        <p style={{ fontSize: 13.5, color: studioColors.mutedGray }}>
          Your role does not include any of these areas. Ask an Admin for the catalog, BOM,
          pricing or offers permission.
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
              counts={data.counts}
              readOnly={!canEdit("catalog")}
              can={catalogCan}
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

      {tab === "costs" && (
        <Loaded state={costs}>
          {(data) => <CostsTab initial={data} readOnly={!canEdit("pricing")} notify={notify} />}
        </Loaded>
      )}

      {/* Shares the costs load: both read the same cost-config body. */}
      {tab === "tariff" && (
        <Loaded state={costs}>
          {(data) => <TariffTab initial={data} readOnly={!canEdit("pricing")} notify={notify} />}
        </Loaded>
      )}

      {tab === "rates" && (
        <Loaded state={sets}>
          {(data) => (
            <RatesTab sets={data} readOnly={!canEdit("market_rates")} can={ratesCan} notify={notify} />
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
  // A ref, not state: marking the load as started must not re-render. As state it did,
  // and the re-render re-ran this effect -- which bailed out on `started` but only after
  // React had already run the *first* pass's cleanup, flipping its `live` flag to false.
  // The fetch then resolved into a discarded closure and the tab sat on "Loading..."
  // forever, with the request visible in the network tab having succeeded. Each endpoint
  // was also fetched twice, which was the same re-render showing itself.
  const started = useRef(false);

  useEffect(() => {
    if (!active || started.current) return;
    started.current = true;
    load()
      .then((data) => setState({ data, error: null }))
      .catch((err) =>
        setState({
          data: null,
          error: err instanceof Error ? err.message : "Could not load this tab.",
        })
      );
    // No cleanup: this runs once per tab and the result is wanted whenever it lands.
    // Switching away mid-flight and back must not leave the tab blank, which is exactly
    // what cancelling the only load it will ever start would do.
  }, [active, load]);

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
