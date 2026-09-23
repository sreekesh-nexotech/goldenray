"use client";

import { SolarInverter } from "@/types/solarInverter";
import Link from "next/link";
import AnchoredMenu from "@/components/common/AnchoredMenu";
import { ChevronDown, Star, X } from "lucide-react";
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import RecommendationSection from "./RecommendationSection";
import ComparisonCTA from "./ComparisonCTA";
import FAQSection from "./FAQSection";
import CompareInverterCard from "./CompareInverterCard";
import {
  STARS_BY_GRADE,
  architecture,
  batteryReady,
  buildQualityGrade,
  certificationList,
  coastalGrade,
  computeBestFor,
  hasArcFaultProtection,
  hasCoastalRating,
  heatToleranceGrade,
  heavyRainGrade,
  humidityGrade,
  isMicro,
  keralaWeatherFitGrade,
  lightningGrade,
  manufacturerTrackRecordGrade,
  maxPvInputLabel,
  maximumWarrantyStars,
  mpptLabel,
  panelLevelMonitoring,
  ratedOutputLabel,
  serviceNetworkGrade,
  shadePerformanceGrade,
  standardWarrantyStars,
  voltageStabilityGrade,
  type Grade,
} from "./inverterInsights";

interface ComparisonTableProps {
  selectedInverters: SolarInverter[];
  allInverters: SolarInverter[];
  onRemoveInverter: (inverterId: string) => void;
  onAddInverter: (inverterId: string) => void;
  onReplaceInverter?: (slotIndex: number, inverterId: string) => void;
  onClose: () => void;
}

/* ---------------------------------------------------------------- atoms -- */

function Stars({ count }: { count: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${count} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3 w-3 ${
            i < count
              ? "fill-[#FFCE31] text-[#FFCE31]"
              : "fill-[#E5E5EA] text-[#E5E5EA]"
          }`}
        />
      ))}
    </span>
  );
}

function GreenPill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[#E8F6ED] px-2.5 py-1 text-[13px] text-[#1D8F47]">
      {children}
    </span>
  );
}

/** Green headline with the star row stacked beneath it — the "top pick" look. */
function StackedVerdict({ label, stars }: { label: string; stars: number }) {
  return (
    <div className="flex flex-col items-start gap-1">
      <span className="font-medium text-[#008130]">{label}</span>
      <Stars count={stars} />
    </div>
  );
}

/**
 * A qualitative grade. "Excellent" is called out in green with stars; the
 * lower grades stay plain so the winner reads at a glance.
 */
function GradeCell({ grade }: { grade: Grade }) {
  if (grade !== "Excellent") {
    return <span>{grade}</span>;
  }
  return (
    <span className="inline-flex items-center gap-2">
      <span className="font-medium text-[#008130]">Excellent</span>
      <Stars count={STARS_BY_GRADE.Excellent} />
    </span>
  );
}

/** An "Expert's Choice" verdict for Excellent, plain text otherwise. */
function VerdictCell({ grade }: { grade: Grade }) {
  if (grade !== "Excellent") {
    return <span>{grade}</span>;
  }
  return (
    <StackedVerdict label="Expert's Choice" stars={STARS_BY_GRADE.Excellent} />
  );
}

function YearsCell({ years, stars }: { years: number; stars: number }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span>{years} years</span>
      <Stars count={stars} />
    </span>
  );
}

function CheckCell({ ok, yes, no }: { ok: boolean; yes: string; no: string }) {
  return ok ? (
    <span className="font-medium text-[#008130]">✓ {yes}</span>
  ) : (
    <span>{no}</span>
  );
}

/* ----------------------------------------------------------- table rows -- */

function SectionHeader({ title, gridStyle }: { title: string; gridStyle: CSSProperties }) {
  return (
    <div className="grid border-b border-[#E5E5EA] bg-[#F3F4F6]" style={gridStyle}>
      <div
        data-section-header={title}
        className="sticky left-0 z-20 col-span-full min-w-0 bg-[#F3F4F6] px-4 py-3.5 text-[14px] font-normal text-[#1A1A1A] sm:px-6 sm:text-[15px] lg:px-10"
      >
        {title}
      </div>
    </div>
  );
}

function Row({
  label,
  values,
  gridStyle,
  expandable = false,
  isExpanded = false,
  onToggle,
}: {
  label: string;
  values: ReactNode[];
  gridStyle: CSSProperties;
  expandable?: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
}) {
  const labelContent = (
    <>
      <span>{label}</span>
      {expandable && (
        <ChevronDown
          className={`h-4 w-4 flex-shrink-0 text-[#1A1A1A] transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      )}
    </>
  );

  return (
    <div className="grid border-b border-[#E5E5EA] bg-white" style={gridStyle}>
      <div className="sticky left-0 z-20 min-w-0 border-r border-[#E5E5EA] bg-white px-4 py-4 text-[13px] text-[#1A1A1A] shadow-[2px_0_4px_rgba(0,0,0,0.03)] sm:px-6 sm:text-[15px] lg:px-10">
        {expandable ? (
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={isExpanded}
            className="flex w-full items-center justify-between gap-3 text-left"
          >
            {labelContent}
          </button>
        ) : (
          <span className="flex items-center justify-between gap-3">
            {labelContent}
          </span>
        )}
      </div>
      {values.map((value, index) => (
        <div
          key={index}
          className="min-w-0 break-words border-r border-[#E5E5EA] px-4 py-4 text-[12px] text-[#444444] last:border-r-0 sm:px-6 sm:text-[15px] lg:px-10"
        >
          {value}
        </div>
      ))}
    </div>
  );
}

/** Full-width explainer that drops in under an expandable row. */
function ExplainerRow({
  title,
  paragraphs,
  gridStyle,
}: {
  title: string;
  paragraphs: string[];
  gridStyle: CSSProperties;
}) {
  // Deliberately drops gridStyle's minWidth: unlike Row/SectionHeader this
  // content isn't per-inverter data needing the table's full scroll width —
  // it's one paragraph that should wrap to the viewport, not the whole table.
  return (
    <div
      className="grid border-b border-[#E5E5EA] bg-white"
      style={{ gridTemplateColumns: gridStyle.gridTemplateColumns }}
    >
      <div
        data-section-header={title}
        className="sticky left-0 z-20 col-span-full min-w-0 space-y-4 bg-white px-4 py-5 sm:px-6 lg:px-10"
      >
        <p className="text-[14px] text-[#444444] sm:text-[15px]">{title}</p>
        {paragraphs.map((paragraph) => (
          <p
            key={paragraph}
            className="text-[13px] leading-relaxed text-[#757575] sm:text-[15px]"
          >
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------- inverter selector -- */

function selectorSummary(inverter: SolarInverter) {
  const capacity = isMicro(inverter)
    ? `${inverter.ratedOutputPower} W/unit`
    : `${(inverter.ratedOutputPower / 1000).toFixed(1)} kW`;
  const warranty = inverter.extendableWarrantyYears
    ? `${inverter.warrantyYears} Yr – ${inverter.extendableWarrantyYears} Yr Warranty`
    : `${inverter.warrantyYears} Yr Warranty`;
  return `${inverter.type}  •  ${capacity}  •  ${warranty}`;
}

function InverterSelector({
  selectedInverter,
  allInverters,
  selectedInverterIds,
  onSelect,
  onRemove,
}: {
  selectedInverter: SolarInverter | null;
  allInverters: SolarInverter[];
  selectedInverterIds: string[];
  onSelect: (inverterId: string) => void;
  onRemove: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeMenu = useCallback(() => setIsOpen(false), []);

  const availableInverters = allInverters.filter(
    (i) => !selectedInverterIds.includes(i.id) || i.id === selectedInverter?.id,
  );

  const summary = useMemo(
    () => (selectedInverter ? selectorSummary(selectedInverter) : ""),
    [selectedInverter],
  );

  return (
    <div className="group relative w-[240px] flex-shrink-0 sm:w-[270px]">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full rounded-lg border border-[#E5E5EA] bg-white px-4 py-3 text-left transition-colors hover:border-[#074A4D]"
      >
        <div className="flex items-center justify-between gap-2">
          <p className="min-w-0 flex-1 truncate text-[15px] text-[#1A1A1A]">
            {selectedInverter ? selectedInverter.name : "Add inverter"}
          </p>
          <ChevronDown className="h-4 w-4 flex-shrink-0 text-[#1A1A1A]" />
        </div>
        {selectedInverter && (
          <p className="mt-1 truncate text-[11px] text-[#757575]">• {summary}</p>
        )}
      </button>

      <AnchoredMenu anchorRef={buttonRef} open={isOpen} onClose={closeMenu}>
            {availableInverters.map((inverter) => (
              <button
                key={inverter.id}
                type="button"
                onClick={() => {
                  onSelect(inverter.id);
                  setIsOpen(false);
                }}
                className="w-full border-b border-gray-100 px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-gray-50"
              >
                <p className="truncate text-[13px] font-medium text-[#074A4D]">
                  {inverter.name}
                </p>
                <p className="truncate text-[11px] text-gray-500">
                  {selectorSummary(inverter)}
                </p>
              </button>
            ))}
      </AnchoredMenu>

      {selectedInverter && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${selectedInverter.name}`}
          className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 opacity-0 shadow-sm transition-opacity hover:text-gray-800 focus-visible:opacity-100 group-hover:opacity-100"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------ visual summary --- */

function SummaryProgressBar({
  label,
  value,
  rightText,
}: {
  label: string;
  value: number;
  rightText: string;
}) {
  const safeValue = Math.max(0, Math.min(100, value));
  const barColor = safeValue >= 80 ? "#1FA35B" : "#E6B13F";

  return (
    <div className="space-y-1 sm:space-y-1.5">
      <div className="flex items-center justify-between gap-2 text-[10px] sm:text-[11px] md:text-xs xl:text-[13px] 2xl:text-sm">
        <span className="text-[#4B5563]">{label}</span>
        <span className="font-medium text-[#2F2F2F]">{rightText}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[#E5E7EB] sm:h-2">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${safeValue}%`, backgroundColor: barColor }}
        />
      </div>
    </div>
  );
}

function scoreToLabel(score: number) {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Very Strong";
  if (score >= 60) return "Good";
  return "Average";
}

function getSafetyScore(inverter: SolarInverter) {
  let score = 0;
  if (/built-in|integrated|compatible/i.test(inverter.dcSurgeProtection)) score += 25;
  if (/built-in|integrated|compatible/i.test(inverter.acSurgeProtection)) score += 25;
  if (hasArcFaultProtection(inverter)) score += 25;
  else if (/activation/i.test(inverter.arcFaultDetection)) score += 15;
  if (inverter.gridProtection) score += 25;
  return score;
}

function getBrandTrustScore(inverter: SolarInverter) {
  let score = inverter.ratings.reliability;
  if (hasCoastalRating(inverter)) score += 4;
  if (inverter.warrantyYears >= 10) score += 4;
  return Math.min(100, score);
}

function getValueForMoneyScore(inverter: SolarInverter) {
  const blended =
    inverter.ratings.efficiency * 0.35 +
    inverter.ratings.warranty * 0.35 +
    inverter.ratings.keralaClimate * 0.3;
  return Math.round(blended);
}

function VisualSummaryCard({ inverter }: { inverter: SolarInverter }) {
  const safety = getSafetyScore(inverter);
  const metrics = [
    {
      label: "Efficiency (peak)",
      value: inverter.ratings.efficiency,
      rightText: `${inverter.maximumEfficiency}%`,
    },
    {
      label: "Kerala Durability",
      value: inverter.ratings.keralaClimate,
      rightText: scoreToLabel(inverter.ratings.keralaClimate),
    },
    {
      label: "Safety Features",
      value: safety,
      rightText: safety >= 85 ? "All Built-in" : "Optional Add-ons",
    },
    {
      label: "Monitoring",
      value: isMicro(inverter) ? 100 : inverter.realTimeMonitoring ? 88 : 60,
      rightText: isMicro(inverter)
        ? "Panel-level"
        : inverter.realTimeMonitoring
          ? "Excellent"
          : "Basic",
    },
    {
      label: "Brand Trust",
      value: getBrandTrustScore(inverter),
      rightText: scoreToLabel(getBrandTrustScore(inverter)),
    },
    {
      label: "Value for Money",
      value: getValueForMoneyScore(inverter),
      rightText: scoreToLabel(getValueForMoneyScore(inverter)),
    },
  ];

  return (
    <article className="rounded-xl bg-[#ECEDEF] p-2.5 sm:rounded-2xl sm:p-3 md:p-4 lg:p-4 xl:p-4.5 2xl:p-5">
      <p className="mb-1.5 text-[9px] font-medium uppercase tracking-wide text-[#F97316] sm:mb-2 sm:text-[10px] md:text-[11px] 2xl:text-xs">
        {inverter.brand}
      </p>
      <h3 className="mb-3 text-base font-medium leading-tight text-[#1F2937] sm:mb-3.5 sm:text-lg md:mb-4 md:text-xl lg:text-2xl xl:text-[26px] 2xl:text-[28px]">
        {inverter.name}
      </h3>

      <div className="space-y-2.5 sm:space-y-3 md:space-y-3.5 lg:space-y-4 xl:space-y-4 2xl:space-y-4.5">
        {metrics.map((metric) => (
          <SummaryProgressBar
            key={metric.label}
            label={metric.label}
            value={metric.value}
            rightText={metric.rightText}
          />
        ))}
      </div>
    </article>
  );
}

function VisualSummarySection({
  selectedInverters,
}: {
  selectedInverters: SolarInverter[];
}) {
  const isTwoColumnLayout = selectedInverters.length === 2;
  return (
    <section className="mt-6 sm:mt-7 md:mt-8 lg:mt-9 xl:mt-10 2xl:mt-12">
      <div className="mb-4 text-center sm:mb-5 md:mb-5 lg:mb-6 xl:mb-7 2xl:mb-8">
        {/* A top-level section of the page, so it sits at h2 alongside
            "Side-by-Side Comparison" rather than dangling at h3. */}
        <h2 className="text-2xl font-semibold leading-tight text-[#183C39] sm:text-3xl md:text-4xl lg:text-[44px] xl:text-[48px] 2xl:text-[52px]">
          Visual Summary
        </h2>
      </div>

      {/* Mobile: horizontal scroll, Desktop: grid */}
      <div className="-mx-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:overflow-visible sm:px-0">
        <div
          className={`flex gap-3 sm:grid sm:gap-4 md:gap-4 lg:gap-5 xl:gap-5 2xl:gap-6 ${
            isTwoColumnLayout ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {selectedInverters.map((inverter) => (
            <div
              key={inverter.id}
              className="min-w-[280px] flex-shrink-0 sm:min-w-0 sm:flex-shrink"
            >
              <VisualSummaryCard inverter={inverter} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- content --- */

const AFCI_EXPLAINER = {
  title: "What is arc-fault protection (AFCI)?",
  paragraphs: [
    "A loose DC connector, a rodent-chewed cable or a corroded MC4 can draw a sustained electrical arc at several hundred volts — the leading cause of rooftop solar fires. An arc-fault circuit interrupter listens for the electrical signature of an arc and shuts the inverter down in milliseconds, before insulation ignites.",
    "Why it matters in Kerala: salt air and monsoon humidity corrode connectors faster than in dry climates, so arcs are more likely here over a 25-year life. \"Integrated\" means it ships on and working; \"activation required\" means the installer must switch it on at commissioning; \"optional\" means it's a paid add-on module.",
  ],
};

// Section headers use `sticky left-0` to track horizontal scroll, but that
// same ancestor's `overflow-x-auto` forces its computed overflow-y to `auto`
// (a CSS rule: a non-visible x with a visible y coerces y to auto too), which
// makes the header's sticky containing block that inner div instead of the
// page — and that div never scrolls vertically itself, so `position: sticky`
// can't pin it to the viewport top. Mobile-only "current section" pin is
// therefore done by hand: track scroll position, find the last header whose
// top has passed the pin line, and render it as a `position: fixed` clone
// sized to the table's (scroll-stable) bounding box.
function usePinnedSectionHeader(
  tableRef: RefObject<HTMLDivElement | null>,
  enabled: boolean,
) {
  const [pinned, setPinned] = useState<{
    title: string;
    left: number;
    width: number;
  } | null>(null);

  useEffect(() => {
    if (!enabled) {
      setPinned(null);
      return;
    }
    const PIN_OFFSET = 64; // matches the fixed site header's mobile height
    let ticking = false;

    const update = () => {
      ticking = false;
      const wrapper = tableRef.current;
      if (!wrapper || window.innerWidth >= 640) {
        setPinned(null);
        return;
      }
      const wrapperRect = wrapper.getBoundingClientRect();
      if (wrapperRect.top > PIN_OFFSET || wrapperRect.bottom <= PIN_OFFSET) {
        setPinned(null);
        return;
      }
      const headers = Array.from(
        wrapper.querySelectorAll<HTMLElement>("[data-section-header]"),
      );
      let active: HTMLElement | null = null;
      for (const el of headers) {
        if (el.getBoundingClientRect().top <= PIN_OFFSET) {
          active = el;
        } else {
          break;
        }
      }
      setPinned(
        active
          ? {
              title: active.dataset.sectionHeader || "",
              left: wrapperRect.left,
              width: wrapperRect.width,
            }
          : null,
      );
    };

    const onScrollOrResize = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [tableRef, enabled]);

  return pinned;
}

export default function ComparisonTable({
  selectedInverters,
  allInverters,
  onRemoveInverter,
  onAddInverter,
  onReplaceInverter,
}: ComparisonTableProps) {
  const [isAfciOpen, setIsAfciOpen] = useState(true);
  const tableWrapperRef = useRef<HTMLDivElement>(null);

  const selectedInverterIds = selectedInverters.map((i) => i.id);
  const columnCount = selectedInverters.length;

  const tableGridStyle = useMemo<CSSProperties>(
    () => ({
      gridTemplateColumns: `var(--comparison-label-col) repeat(${columnCount}, minmax(0, 1fr))`,
      minWidth: `calc(var(--comparison-label-col) + ${columnCount * 180}px)`,
    }),
    [columnCount],
  );

  // Slots for up to 3 inverters
  const inverterSlots = [0, 1, 2].map((index) => selectedInverters[index] || null);

  const handleSelectInverter = (slotIndex: number, inverterId: string) => {
    if (inverterSlots[slotIndex] && onReplaceInverter) {
      onReplaceInverter(slotIndex, inverterId);
    } else {
      onAddInverter(inverterId);
    }
  };

  const handleRemoveInverter = (slotIndex: number) => {
    const inverter = inverterSlots[slotIndex];
    if (inverter) onRemoveInverter(inverter.id);
  };

  const bestFor = useMemo(
    () => computeBestFor(selectedInverters),
    [selectedInverters],
  );

  /** Render one cell per selected inverter. */
  const cells = (render: (inverter: SolarInverter, index: number) => ReactNode) =>
    selectedInverters.map(render);

  const pinnedHeader = usePinnedSectionHeader(tableWrapperRef, columnCount >= 2);

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-5 text-center sm:mb-6">
          <h2 className="text-2xl font-bold text-[#183C39] sm:text-4xl">
            Side-by-Side Comparison
          </h2>
        </div>

        {/* Inverter selectors */}
        <div className="-mx-4 mb-6 overflow-x-auto px-4 pb-2 sm:mx-0 sm:overflow-visible sm:px-0">
          <div className="flex min-w-max items-center justify-start gap-3 rounded-xl bg-[#F1F3F5] px-4 py-4 sm:min-w-0 sm:justify-center sm:gap-4 sm:px-6">
            {[0, 1, 2].map((slotIndex) => (
              <Fragment key={slotIndex}>
                {slotIndex > 0 && (
                  <span className="text-[15px] font-medium text-[#444444]">
                    VS
                  </span>
                )}
                <InverterSelector
                  selectedInverter={inverterSlots[slotIndex]}
                  allInverters={allInverters}
                  selectedInverterIds={selectedInverterIds}
                  onSelect={(id) => handleSelectInverter(slotIndex, id)}
                  onRemove={() => handleRemoveInverter(slotIndex)}
                />
              </Fragment>
            ))}
          </div>
        </div>

        {/* Inverter cards */}
        {columnCount >= 2 && (
          <div className="-mx-4 mb-8 overflow-x-auto px-4 pb-2 sm:mx-0 sm:overflow-visible sm:px-0">
            <div
              className={`grid gap-4 sm:gap-5 ${
                columnCount === 2 ? "grid-cols-2" : "grid-cols-3"
              } min-w-max sm:min-w-0`}
            >
              {selectedInverters.map((inverter) => (
                <div key={inverter.id} className="w-[260px] sm:w-auto">
                  <CompareInverterCard inverter={inverter} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comparison table */}
        {columnCount >= 2 && (
          <div
            ref={tableWrapperRef}
            className="overflow-x-auto rounded-xl border border-[#E5E5EA] bg-white [--comparison-label-col:150px] sm:[--comparison-label-col:220px] lg:[--comparison-label-col:280px] xl:[--comparison-label-col:340px]"
          >
            {pinnedHeader && (
              <div
                className="fixed z-30 border-b border-[#E5E5EA] bg-[#F3F4F6] px-4 py-3.5 text-[14px] font-normal text-[#1A1A1A] shadow-sm sm:hidden"
                style={{
                  top: 64,
                  left: pinnedHeader.left,
                  width: pinnedHeader.width,
                }}
              >
                {pinnedHeader.title}
              </div>
            )}
            <div className="min-w-full">
              {/* The Verdict */}
              <SectionHeader title="The Verdict" gridStyle={tableGridStyle} />
              <Row
                label="Overall Rating"
                gridStyle={tableGridStyle}
                values={cells((inverter) => (
                  <VerdictCell key={inverter.id} grade={inverter.overallRating} />
                ))}
              />
              <Row
                label="Best For"
                gridStyle={tableGridStyle}
                values={cells((inverter, index) => (
                  <GreenPill key={inverter.id}>{bestFor[index]}</GreenPill>
                ))}
              />

              {/* Trust & Reliability */}
              <SectionHeader
                title="Trust & Reliability"
                gridStyle={tableGridStyle}
              />
              <Row
                label="Manufacturer Track Record"
                gridStyle={tableGridStyle}
                values={cells((inverter) => (
                  <GradeCell
                    key={inverter.id}
                    grade={manufacturerTrackRecordGrade(inverter)}
                  />
                ))}
              />
              <Row
                label="Monitoring"
                gridStyle={tableGridStyle}
                values={cells((inverter) => (
                  <CheckCell
                    key={inverter.id}
                    ok={inverter.realTimeMonitoring}
                    yes={isMicro(inverter) ? "Panel-level" : "Yes"}
                    no="Not included"
                  />
                ))}
              />
              <Row
                label="Remote Diagnostics"
                gridStyle={tableGridStyle}
                values={cells((inverter) => inverter.remoteDiagnostics)}
              />
              <Row
                label="Government Approved"
                gridStyle={tableGridStyle}
                values={cells((inverter) => (
                  <CheckCell
                    key={inverter.id}
                    ok={inverter.certifications.some((c) => /BIS|IS 16221/i.test(c))}
                    yes="BIS"
                    no="Not listed"
                  />
                ))}
              />

              {/* Build Quality & Protection */}
              <SectionHeader
                title="Build Quality & Protection"
                gridStyle={tableGridStyle}
              />
              <Row
                label="Build Quality"
                gridStyle={tableGridStyle}
                values={cells((inverter) => (
                  <VerdictCell key={inverter.id} grade={buildQualityGrade(inverter)} />
                ))}
              />
              <Row
                label="IP Protection"
                gridStyle={tableGridStyle}
                values={cells((inverter) => inverter.ipRating)}
              />
              <Row
                label="Surge Protection (DC / AC)"
                gridStyle={tableGridStyle}
                values={cells((inverter) => (
                  <div key={inverter.id} className="space-y-0.5">
                    <p>DC: {inverter.dcSurgeProtection}</p>
                    <p>AC: {inverter.acSurgeProtection}</p>
                  </div>
                ))}
              />
              <Row
                label="Arc-Fault Protection (AFCI)"
                gridStyle={tableGridStyle}
                expandable
                isExpanded={isAfciOpen}
                onToggle={() => setIsAfciOpen((open) => !open)}
                values={cells((inverter) =>
                  hasArcFaultProtection(inverter) ? (
                    <span key={inverter.id} className="font-medium text-[#008130]">
                      ✓ {inverter.arcFaultDetection}
                    </span>
                  ) : (
                    inverter.arcFaultDetection
                  ),
                )}
              />
              {isAfciOpen && (
                <ExplainerRow
                  title={AFCI_EXPLAINER.title}
                  paragraphs={AFCI_EXPLAINER.paragraphs}
                  gridStyle={tableGridStyle}
                />
              )}
              <Row
                label="Corrosion / Coastal Protection"
                gridStyle={tableGridStyle}
                values={cells((inverter) =>
                  hasCoastalRating(inverter) ? (
                    <span key={inverter.id} className="font-medium text-[#008130]">
                      ✓ {inverter.corrosionProtection}
                    </span>
                  ) : (
                    inverter.corrosionProtection
                  ),
                )}
              />

              {/* Kerala Performance */}
              <SectionHeader
                title="Kerala Performance"
                gridStyle={tableGridStyle}
              />
              <Row
                label="Kerala Weather Fit"
                gridStyle={tableGridStyle}
                values={cells((inverter) => (
                  <GradeCell key={inverter.id} grade={keralaWeatherFitGrade(inverter)} />
                ))}
              />
              <Row
                label="Heat Tolerance"
                gridStyle={tableGridStyle}
                values={cells((inverter) => (
                  <GradeCell key={inverter.id} grade={heatToleranceGrade(inverter)} />
                ))}
              />
              <Row
                label="Humidity"
                gridStyle={tableGridStyle}
                values={cells((inverter) => (
                  <GradeCell key={inverter.id} grade={humidityGrade(inverter)} />
                ))}
              />
              <Row
                label="Heavy Rain"
                gridStyle={tableGridStyle}
                values={cells((inverter) => (
                  <GradeCell key={inverter.id} grade={heavyRainGrade(inverter)} />
                ))}
              />
              <Row
                label="Coastal / Salt Air"
                gridStyle={tableGridStyle}
                values={cells((inverter) => (
                  <GradeCell key={inverter.id} grade={coastalGrade(inverter)} />
                ))}
              />
              <Row
                label="Lightning Protection"
                gridStyle={tableGridStyle}
                values={cells((inverter) => (
                  <GradeCell key={inverter.id} grade={lightningGrade(inverter)} />
                ))}
              />
              <Row
                label="Voltage Stability"
                gridStyle={tableGridStyle}
                values={cells((inverter) => (
                  <GradeCell key={inverter.id} grade={voltageStabilityGrade(inverter)} />
                ))}
              />
              <Row
                label="Shade Performance"
                gridStyle={tableGridStyle}
                values={cells((inverter) => (
                  <GradeCell key={inverter.id} grade={shadePerformanceGrade(inverter)} />
                ))}
              />
              <Row
                label="Service Network"
                gridStyle={tableGridStyle}
                values={cells((inverter) => (
                  <GradeCell key={inverter.id} grade={serviceNetworkGrade(inverter)} />
                ))}
              />
              <Row
                label="Overall Kerala Score"
                gridStyle={tableGridStyle}
                values={cells((inverter) => (
                  <span key={inverter.id} className="font-medium text-[#1A1A1A]">
                    {inverter.keralaClimateScore}/100
                  </span>
                ))}
              />

              {/* Warranty Reliability */}
              <SectionHeader
                title="Warranty Reliability"
                gridStyle={tableGridStyle}
              />
              <Row
                label="Standard Warranty"
                gridStyle={tableGridStyle}
                values={cells((inverter) => (
                  <YearsCell
                    key={inverter.id}
                    years={inverter.warrantyYears}
                    stars={standardWarrantyStars(inverter.warrantyYears)}
                  />
                ))}
              />
              <Row
                label="Maximum Warranty"
                gridStyle={tableGridStyle}
                values={cells((inverter) =>
                  inverter.extendableWarrantyYears ? (
                    <YearsCell
                      key={inverter.id}
                      years={inverter.extendableWarrantyYears}
                      stars={maximumWarrantyStars(inverter.extendableWarrantyYears)}
                    />
                  ) : (
                    "Extension available — cap not published"
                  ),
                )}
              />
              <Row
                label="Warranty Extension"
                gridStyle={tableGridStyle}
                values={cells((inverter) => (
                  <CheckCell
                    key={inverter.id}
                    ok={Boolean(inverter.extendableWarrantyYears)}
                    yes="Available"
                    no="Ask your installer"
                  />
                ))}
              />
              <Row
                label="Claim Experience"
                gridStyle={tableGridStyle}
                values={cells(() => "Not publicly scored")}
              />

              {/* Technology & Standards */}
              <SectionHeader
                title="Technology & Standards"
                gridStyle={tableGridStyle}
              />
              <Row
                label="Architecture"
                gridStyle={tableGridStyle}
                values={cells((inverter) => architecture(inverter))}
              />
              <Row
                label="MPPT"
                gridStyle={tableGridStyle}
                values={cells((inverter) => mpptLabel(inverter))}
              />
              <Row
                label="Battery Ready"
                gridStyle={tableGridStyle}
                values={cells((inverter) => batteryReady(inverter))}
              />
              <Row
                label="Panel-Level Monitoring"
                gridStyle={tableGridStyle}
                values={cells((inverter) => (
                  <CheckCell
                    key={inverter.id}
                    ok={panelLevelMonitoring(inverter)}
                    yes="Yes"
                    no="No"
                  />
                ))}
              />
              <Row
                label="App Monitoring"
                gridStyle={tableGridStyle}
                values={cells((inverter) => inverter.monitoringApp)}
              />
              <Row
                label="Connectivity"
                gridStyle={tableGridStyle}
                values={cells((inverter) => inverter.connectivity)}
              />
              <Row
                label="Certifications"
                gridStyle={tableGridStyle}
                values={cells((inverter) => (
                  <div key={inverter.id} className="space-y-1">
                    {certificationList(inverter).map((cert) => (
                      <p key={cert}>{cert}</p>
                    ))}
                  </div>
                ))}
              />

              {/* Technical specs */}
              <SectionHeader
                title="Performance Specifications"
                gridStyle={tableGridStyle}
              />
              <Row
                label="Maximum Efficiency (higher = better)"
                gridStyle={tableGridStyle}
                values={cells((inverter) => `${inverter.maximumEfficiency}%`)}
              />
              <Row
                label="Weighted Efficiency"
                gridStyle={tableGridStyle}
                values={cells((inverter) => `${inverter.europeanEfficiency}%`)}
              />
              <Row
                label="Rated Output"
                gridStyle={tableGridStyle}
                values={cells((inverter) => ratedOutputLabel(inverter))}
              />
              <Row
                label="Max PV Input"
                gridStyle={tableGridStyle}
                values={cells((inverter) => maxPvInputLabel(inverter))}
              />
              <Row
                label="Max DC Voltage"
                gridStyle={tableGridStyle}
                values={cells((inverter) => `${inverter.maximumDcVoltage} V`)}
              />
              <Row
                label="Max Input Current"
                gridStyle={tableGridStyle}
                values={cells((inverter) => inverter.maximumInputCurrent)}
              />
              <Row
                label="Operating Temperature"
                gridStyle={tableGridStyle}
                values={cells((inverter) => inverter.operatingTemperature)}
              />
              <Row
                label="Cooling"
                gridStyle={tableGridStyle}
                values={cells((inverter) => inverter.cooling)}
              />
              <Row
                label="Noise"
                gridStyle={tableGridStyle}
                values={cells((inverter) => inverter.noiseLevel)}
              />
              <Row
                label="Weight"
                gridStyle={tableGridStyle}
                values={cells((inverter) => `${inverter.weight} kg`)}
              />
            </div>
          </div>
        )}

        {/* Empty state */}
        {columnCount < 2 && (
          <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mb-4 text-gray-400">
              <svg
                className="mx-auto h-16 w-16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Select at least 2 inverters to compare
            </h3>
            <p className="text-sm text-gray-500">
              Use the dropdowns above to select inverters for comparison
            </p>
          </div>
        )}

        {columnCount >= 2 && (
          <>
            <div className="mt-6 text-center">
              <Link
                href="/contactus"
                className="btn w-full sm:w-auto bg-[#F7BA41] text-[#272218] hover:bg-[#E5A930]"
              >
                Get Free Quote for these Inverters
              </Link>
            </div>

            <VisualSummarySection selectedInverters={selectedInverters} />
            <RecommendationSection selectedInverters={selectedInverters} />
            <ComparisonCTA />
          </>
        )}
      </div>

      {/* FAQ Section - outside the container since it has its own */}
      {columnCount >= 2 && <FAQSection />}
    </div>
  );
}
