"use client";

// src/components/Studio/EmiCalculator/EmiCalculatorScreen.tsx
//
// Content Studio → EMI Calculator. Everything the public calculator and its
// bank comparison table render is edited here.
//
// Note this screen talks to the *main* goldenray backend rather than the CMS
// (see emiConfigService for why). It still uses the Studio session: the
// backend verifies the same JWT with a shared signing key.

import { useCallback, useEffect, useMemo, useState } from "react";
import { useStudio } from "../shared/StudioContext";
import { PageHeader, TipBanner } from "../shared/primitives";
import { studioColors } from "../shared/format";
import type { EMIBank, EMISettings, EMISystemSize } from "@/services/emiCalculator";
import {
  loadEmiAdminData,
  type EMIInterestRateRule,
  type EMISubsidyRule,
} from "@/services/emiConfigService";
import SettingsPanel from "./SettingsPanel";
import SystemSizesPanel from "./SystemSizesPanel";
import SubsidyPanel from "./SubsidyPanel";
import InterestRatesPanel from "./InterestRatesPanel";
import BanksPanel from "./BanksPanel";
import PreviewPanel from "./PreviewPanel";

type TabKey = "sizes" | "subsidy" | "rates" | "settings" | "banks" | "preview";

const TABS: { key: TabKey; label: string }[] = [
  { key: "sizes", label: "System sizes" },
  { key: "subsidy", label: "Subsidy" },
  { key: "rates", label: "Interest rates" },
  { key: "settings", label: "Settings" },
  { key: "banks", label: "Bank comparison" },
  { key: "preview", label: "Preview" },
];

interface AdminData {
  settings: EMISettings;
  sizes: EMISystemSize[];
  subsidies: EMISubsidyRule[];
  rates: EMIInterestRateRule[];
  banks: EMIBank[];
}

export default function EmiCalculatorScreen() {
  const { toast, me } = useStudio();
  const [tab, setTab] = useState<TabKey>("sizes");
  const [data, setData] = useState<AdminData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Authors may look but not touch — pricing changes are admin/editor only.
  // `can_publish` is the CMS's own "admin, editor, or superuser" flag, which is
  // exactly what the backend authorises against (a superuser's token carries
  // role "admin"). Checking the raw role string instead would lock out
  // superusers whose stored role is still the default "author".
  const readOnly = me ? !me.can_publish : true;

  const notify = useMemo(
    () => ({
      success: (msg: string) => toast(msg),
      error: (msg: string) => toast(msg, "error"),
    }),
    [toast]
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const loaded = await loadEmiAdminData();
        if (!cancelled) setData(loaded);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Could not load the calculator settings");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSettingsSaved = useCallback((settings: EMISettings) => {
    setData((prev) => (prev ? { ...prev, settings } : prev));
  }, []);

  return (
    <div>
      <PageHeader
        title="EMI Calculator"
        subtitle="System pricing, subsidy, interest rates and the bank comparison table shown on the public calculator."
      />

      <TipBanner>
        Changes go live as soon as a row is saved — the public page reads these
        values on every visit. The calculation itself runs on the server:
        subsidy is deducted first, then {data ? Number(data.settings.loan_percentage) : 90}% of
        what remains is financed, and the daily figure is the monthly EMI ÷{" "}
        {data ? data.settings.daily_saving_divisor : 30}.
      </TipBanner>

      {readOnly && me && (
        <div
          style={{
            margin: "0 0 16px",
            padding: "10px 14px",
            borderRadius: 12,
            background: "rgba(247,186,65,.14)",
            color: studioColors.amberInk,
            fontSize: 12.5,
          }}
        >
          Your account cannot change pricing, so these settings are read-only.
          Ask an Admin or Editor to make changes.
        </div>
      )}

      {/* Tabs */}
      <div
        className="flex flex-wrap gap-1"
        style={{ marginBottom: 18, borderBottom: `1px solid ${studioColors.ring}` }}
      >
        {TABS.map((t) => {
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

      {error ? (
        <p style={{ fontSize: 13.5, color: studioColors.danger }}>{error}</p>
      ) : !data ? (
        <p style={{ fontSize: 13.5, color: studioColors.mutedGray }}>Loading…</p>
      ) : (
        <>
          {tab === "sizes" && (
            <SystemSizesPanel initial={data.sizes} readOnly={readOnly} notify={notify} />
          )}
          {tab === "subsidy" && (
            <SubsidyPanel initial={data.subsidies} readOnly={readOnly} notify={notify} />
          )}
          {tab === "rates" && (
            <InterestRatesPanel initial={data.rates} readOnly={readOnly} notify={notify} />
          )}
          {tab === "settings" && (
            <SettingsPanel
              initial={data.settings}
              readOnly={readOnly}
              notify={notify}
              onSaved={handleSettingsSaved}
            />
          )}
          {tab === "banks" && (
            <BanksPanel initial={data.banks} readOnly={readOnly} notify={notify} />
          )}
          {tab === "preview" && <PreviewPanel sizes={data.sizes} settings={data.settings} />}
        </>
      )}
    </div>
  );
}
