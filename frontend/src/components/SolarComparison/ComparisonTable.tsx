"use client";

import { SolarPanel } from "@/types/solarPanel";
import { ChevronDown, Star, X } from "lucide-react";
import { Fragment, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import RecommendationSection from "./RecommendationSection";
import ComparisonCTA from "./ComparisonCTA";
import FAQSection from "./FAQSection";
import ComparePanelCard from "./ComparePanelCard";
import {
  MAX_SYSTEM_VOLTAGE,
  STARS_BY_GRADE,
  buildQualityGrade,
  certificationList,
  claimExperienceGrade,
  coastalGrade,
  companyStrengthGrade,
  computeBestFor,
  dualSidedGeneration,
  gradeFromScore,
  humidityGrade,
  isBestAvailableTech,
  lowLightGrade,
  monsoonGrade,
  panelConstruction,
  productWarrantyStars,
  shortTechnology,
  warrantyStars,
  type Grade,
} from "./panelInsights";

interface ComparisonTableProps {
  selectedPanels: SolarPanel[];
  allPanels: SolarPanel[];
  onRemovePanel: (panelId: string) => void;
  onAddPanel: (panelId: string) => void;
  onReplacePanel?: (slotIndex: number, panelId: string) => void;
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
      <div className="sticky left-0 z-20 col-span-full min-w-0 bg-[#F3F4F6] px-4 py-3.5 text-[14px] font-normal text-[#1A1A1A] sm:px-6 sm:text-[15px] lg:px-10">
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
  return (
    <div className="grid border-b border-[#E5E5EA] bg-white" style={gridStyle}>
      <div className="sticky left-0 z-20 col-span-full min-w-0 space-y-4 bg-white px-4 py-5 sm:px-6 lg:px-10">
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

/* ------------------------------------------------------- panel selector -- */

function PanelSelector({
  selectedPanel,
  allPanels,
  selectedPanelIds,
  onSelect,
  onRemove,
}: {
  selectedPanel: SolarPanel | null;
  allPanels: SolarPanel[];
  selectedPanelIds: string[];
  onSelect: (panelId: string) => void;
  onRemove: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const availablePanels = allPanels.filter(
    (p) => !selectedPanelIds.includes(p.id) || p.id === selectedPanel?.id,
  );

  const summary = useMemo(() => {
    if (!selectedPanel) return "";
    return `${selectedPanel.type}  •  ${selectedPanel.wattage} Wp  •  ${selectedPanel.productWarranty} Yr – ${selectedPanel.performanceWarranty} Yr Warranty`;
  }, [selectedPanel]);

  return (
    <div className="group relative w-[240px] flex-shrink-0 sm:w-[270px]">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full rounded-lg border border-[#E5E5EA] bg-white px-4 py-3 text-left transition-colors hover:border-[#074A4D]"
      >
        <div className="flex items-center justify-between gap-2">
          <p className="min-w-0 flex-1 truncate text-[15px] text-[#1A1A1A]">
            {selectedPanel ? selectedPanel.name : "Add panel"}
          </p>
          <ChevronDown className="h-4 w-4 flex-shrink-0 text-[#1A1A1A]" />
        </div>
        {selectedPanel && (
          <p className="mt-1 truncate text-[11px] text-[#757575]">• {summary}</p>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 right-0 top-full z-20 mt-2 max-h-64 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg">
            {availablePanels.map((panel) => (
              <button
                key={panel.id}
                type="button"
                onClick={() => {
                  onSelect(panel.id);
                  setIsOpen(false);
                }}
                className="w-full border-b border-gray-100 px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-gray-50"
              >
                <p className="truncate text-[13px] font-medium text-[#074A4D]">
                  {panel.name}
                </p>
                <p className="truncate text-[11px] text-gray-500">
                  {panel.type} • {panel.wattage} Wp • {panel.productWarranty} Yr –{" "}
                  {panel.performanceWarranty} Yr Warranty
                </p>
              </button>
            ))}
          </div>
        </>
      )}

      {selectedPanel && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${selectedPanel.name}`}
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

function getBrandTrustScore(panel: SolarPanel) {
  let score = 0;
  if (panel.bloombergTier1) score += 30;
  if (panel.pvelTopPerformer) score += 30;
  if (panel.bisCertified) score += 20;
  if (panel.independentAudit) score += 20;
  return score;
}

function getSafetyScore(panel: SolarPanel) {
  const certScore = Math.min(panel.certifications.length * 20, 60);
  const ipBonus = panel.ipRating.includes("68") ? 25 : 15;
  const windBonus = panel.windLoad >= 5400 ? 15 : 10;
  return Math.min(100, certScore + ipBonus + windBonus);
}

function getValueForMoneyScore(panel: SolarPanel) {
  const blended =
    panel.ratings.efficiency * 0.35 +
    panel.ratings.warranty * 0.35 +
    panel.ratings.keralaClimate * 0.3;
  return Math.round(blended);
}

function VisualSummaryCard({ panel }: { panel: SolarPanel }) {
  const metrics = [
    {
      label: "Efficiency (EU)",
      value: panel.ratings.efficiency,
      rightText: `${panel.efficiency}%`,
    },
    {
      label: "Kerala Durability",
      value: panel.ratings.keralaClimate,
      rightText: scoreToLabel(panel.ratings.keralaClimate),
    },
    {
      label: "Safety Features",
      value: getSafetyScore(panel),
      rightText:
        getSafetyScore(panel) >= 85 ? "All Built-in" : "Optional Add-ons",
    },
    {
      label: "Monitoring",
      value: panel.ratings.heatPerformance,
      rightText: scoreToLabel(panel.ratings.heatPerformance),
    },
    {
      label: "Brand Trust",
      value: getBrandTrustScore(panel),
      rightText: scoreToLabel(getBrandTrustScore(panel)),
    },
    {
      label: "Value for Money",
      value: getValueForMoneyScore(panel),
      rightText: scoreToLabel(getValueForMoneyScore(panel)),
    },
  ];

  return (
    <article className="rounded-xl bg-[#ECEDEF] p-2.5 sm:rounded-2xl sm:p-3 md:p-4 lg:p-4 xl:p-4.5 2xl:p-5">
      <p className="mb-1.5 text-[9px] font-medium uppercase tracking-wide text-[#F97316] sm:mb-2 sm:text-[10px] md:text-[11px] 2xl:text-xs">
        {panel.brand}
      </p>
      <h3 className="mb-3 text-base font-medium leading-tight text-[#1F2937] sm:mb-3.5 sm:text-lg md:mb-4 md:text-xl lg:text-2xl xl:text-[26px] 2xl:text-[28px]">
        {panel.name}
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

function VisualSummarySection({ selectedPanels }: { selectedPanels: SolarPanel[] }) {
  const isTwoPanelLayout = selectedPanels.length === 2;
  return (
    <section className="mt-6 sm:mt-7 md:mt-8 lg:mt-9 xl:mt-10 2xl:mt-12">
      <div className="mb-4 text-center sm:mb-5 md:mb-5 lg:mb-6 xl:mb-7 2xl:mb-8">
        <h3 className="text-2xl font-semibold leading-tight text-[#183C39] sm:text-3xl md:text-4xl lg:text-[44px] xl:text-[48px] 2xl:text-[52px]">
          Visual Summary
        </h3>
      </div>

      {/* Mobile: horizontal scroll, Desktop: grid */}
      <div className="-mx-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:overflow-visible sm:px-0">
        <div
          className={`flex gap-3 sm:grid sm:gap-4 md:gap-4 lg:gap-5 xl:gap-5 2xl:gap-6 ${
            isTwoPanelLayout ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {selectedPanels.map((panel) => (
            <div
              key={panel.id}
              className="min-w-[280px] flex-shrink-0 sm:min-w-0 sm:flex-shrink"
            >
              <VisualSummaryCard panel={panel} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- content --- */

const PVEL_EXPLAINER = {
  title: "What is PVEL testing?",
  paragraphs: [
    'PVEL is the world\'s leading independent solar testing lab — think of it like NCAP crash testing, but for solar panels. "Top Performer" means a panel survived extreme stress tests simulating 25+ years of real-world wear — heat cycling, humidity, UV exposure, and heavy loads.',
    "Why it matters: The manufacturer didn't test itself — an independent lab did. A panel can look great on paper but fail in the real world. This test catches that gap. It's the first thing knowledgeable buyers check.",
  ],
};

export default function ComparisonTable({
  selectedPanels,
  allPanels,
  onRemovePanel,
  onAddPanel,
  onReplacePanel,
}: ComparisonTableProps) {
  const [isLabTestingOpen, setIsLabTestingOpen] = useState(true);

  const selectedPanelIds = selectedPanels.map((p) => p.id);
  const columnCount = selectedPanels.length;

  const tableGridStyle = useMemo<CSSProperties>(
    () => ({
      gridTemplateColumns: `var(--comparison-label-col) repeat(${columnCount}, minmax(0, 1fr))`,
      minWidth: `calc(var(--comparison-label-col) + ${columnCount * 180}px)`,
    }),
    [columnCount],
  );

  // Slots for up to 3 panels
  const panelSlots = [0, 1, 2].map((index) => selectedPanels[index] || null);

  const handleSelectPanel = (slotIndex: number, panelId: string) => {
    if (panelSlots[slotIndex] && onReplacePanel) {
      onReplacePanel(slotIndex, panelId);
    } else {
      onAddPanel(panelId);
    }
  };

  const handleRemovePanel = (slotIndex: number) => {
    const panel = panelSlots[slotIndex];
    if (panel) onRemovePanel(panel.id);
  };

  const bestFor = useMemo(() => computeBestFor(selectedPanels), [selectedPanels]);

  /** Render one cell per selected panel. */
  const cells = (render: (panel: SolarPanel, index: number) => ReactNode) =>
    selectedPanels.map(render);

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-5 text-center sm:mb-6">
          <h2 className="text-2xl font-bold text-[#183C39] sm:text-4xl">
            Side-by-Side Comparison
          </h2>
        </div>

        {/* Panel selectors */}
        <div className="-mx-4 mb-6 overflow-x-auto px-4 pb-2 sm:mx-0 sm:overflow-visible sm:px-0">
          <div className="flex min-w-max items-center justify-start gap-3 rounded-xl bg-[#F1F3F5] px-4 py-4 sm:min-w-0 sm:justify-center sm:gap-4 sm:px-6">
            {[0, 1, 2].map((slotIndex) => (
              <Fragment key={slotIndex}>
                {slotIndex > 0 && (
                  <span className="text-[15px] font-medium text-[#444444]">
                    VS
                  </span>
                )}
                <PanelSelector
                  selectedPanel={panelSlots[slotIndex]}
                  allPanels={allPanels}
                  selectedPanelIds={selectedPanelIds}
                  onSelect={(panelId) => handleSelectPanel(slotIndex, panelId)}
                  onRemove={() => handleRemovePanel(slotIndex)}
                />
              </Fragment>
            ))}
          </div>
        </div>

        {/* Panel cards */}
        {columnCount >= 2 && (
          <div className="-mx-4 mb-8 overflow-x-auto px-4 pb-2 sm:mx-0 sm:overflow-visible sm:px-0">
            <div
              className={`grid gap-4 sm:gap-5 ${
                columnCount === 2 ? "grid-cols-2" : "grid-cols-3"
              } min-w-max sm:min-w-0`}
            >
              {selectedPanels.map((panel) => (
                <div key={panel.id} className="w-[260px] sm:w-auto">
                  <ComparePanelCard panel={panel} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comparison table */}
        {columnCount >= 2 && (
          <div className="overflow-x-auto rounded-xl border border-[#E5E5EA] bg-white [--comparison-label-col:150px] sm:[--comparison-label-col:220px] lg:[--comparison-label-col:280px] xl:[--comparison-label-col:340px]">
            <div className="min-w-full">
              {/* The Verdict */}
              <SectionHeader title="The Verdict" gridStyle={tableGridStyle} />
              <Row
                label="Overall Rating"
                gridStyle={tableGridStyle}
                values={cells((panel) => (
                  <VerdictCell key={panel.id} grade={panel.overallRating} />
                ))}
              />
              <Row
                label="Best For"
                gridStyle={tableGridStyle}
                values={cells((panel, index) => (
                  <GreenPill key={panel.id}>{bestFor[index]}</GreenPill>
                ))}
              />

              {/* Trust & Certifications */}
              <SectionHeader
                title="Trust & Certifications"
                gridStyle={tableGridStyle}
              />
              <Row
                label="Independent Lab Testing"
                gridStyle={tableGridStyle}
                expandable
                isExpanded={isLabTestingOpen}
                onToggle={() => setIsLabTestingOpen((open) => !open)}
                values={cells((panel) =>
                  panel.pvelTopPerformer ? (
                    "Top Performer"
                  ) : (
                    <>
                      Tested ·<br />
                      Not Top Performer
                    </>
                  ),
                )}
              />
              {isLabTestingOpen && (
                <ExplainerRow
                  title={PVEL_EXPLAINER.title}
                  paragraphs={PVEL_EXPLAINER.paragraphs}
                  gridStyle={tableGridStyle}
                />
              )}
              <Row
                label="Bank-Trusted Manufacturer"
                gridStyle={tableGridStyle}
                values={cells((panel) => (
                  <CheckCell
                    key={panel.id}
                    ok={panel.bloombergTier1}
                    yes="Tier 1"
                    no="Not listed"
                  />
                ))}
              />
              <Row
                label="Government Approved"
                gridStyle={tableGridStyle}
                values={cells((panel) => (
                  <CheckCell
                    key={panel.id}
                    ok={panel.bisCertified}
                    yes="Approved"
                    no="Not approved"
                  />
                ))}
              />

              {/* Build Quality */}
              <SectionHeader title="Build Quality" gridStyle={tableGridStyle} />
              <Row
                label="Build Quality"
                gridStyle={tableGridStyle}
                values={cells((panel) => (
                  <VerdictCell key={panel.id} grade={buildQualityGrade(panel)} />
                ))}
              />
              <Row
                label="Company Strength"
                gridStyle={tableGridStyle}
                values={cells((panel) => (
                  <VerdictCell
                    key={panel.id}
                    grade={companyStrengthGrade(panel)}
                  />
                ))}
              />

              {/* Kerala Performance */}
              <SectionHeader
                title="Kerala Performance"
                gridStyle={tableGridStyle}
              />
              <Row
                label="Kerala Weather Fit"
                gridStyle={tableGridStyle}
                values={cells((panel) => (
                  <GradeCell
                    key={panel.id}
                    grade={gradeFromScore(panel.ratings.keralaClimate)}
                  />
                ))}
              />
              <Row
                label="Heat Tolerance"
                gridStyle={tableGridStyle}
                values={cells((panel) => (
                  <GradeCell
                    key={panel.id}
                    grade={gradeFromScore(panel.ratings.heatPerformance)}
                  />
                ))}
              />
              <Row
                label="Humidity"
                gridStyle={tableGridStyle}
                values={cells((panel) => (
                  <GradeCell key={panel.id} grade={humidityGrade(panel)} />
                ))}
              />
              <Row
                label="Monsoon"
                gridStyle={tableGridStyle}
                values={cells((panel) => (
                  <GradeCell key={panel.id} grade={monsoonGrade(panel)} />
                ))}
              />
              <Row
                label="Low Light"
                gridStyle={tableGridStyle}
                values={cells((panel) => (
                  <GradeCell key={panel.id} grade={lowLightGrade(panel)} />
                ))}
              />
              <Row
                label="Coastal"
                gridStyle={tableGridStyle}
                values={cells((panel) => (
                  <GradeCell key={panel.id} grade={coastalGrade(panel)} />
                ))}
              />

              {/* Warranty Reliability */}
              <SectionHeader
                title="Warranty Reliability"
                gridStyle={tableGridStyle}
              />
              <Row
                label="Product Warranty"
                gridStyle={tableGridStyle}
                values={cells((panel) => (
                  <YearsCell
                    key={panel.id}
                    years={panel.productWarranty}
                    stars={productWarrantyStars(panel.productWarranty)}
                  />
                ))}
              />
              <Row
                label="Performance Warranty"
                gridStyle={tableGridStyle}
                values={cells((panel) => (
                  <YearsCell
                    key={panel.id}
                    years={panel.performanceWarranty}
                    stars={warrantyStars(panel.performanceWarranty)}
                  />
                ))}
              />
              <Row
                label="Guarantee"
                gridStyle={tableGridStyle}
                values={cells((panel) => (
                  <YearsCell
                    key={panel.id}
                    years={panel.performanceWarranty}
                    stars={warrantyStars(panel.performanceWarranty)}
                  />
                ))}
              />
              <Row
                label="Claim Experience"
                gridStyle={tableGridStyle}
                values={cells((panel) => (
                  <GradeCell key={panel.id} grade={claimExperienceGrade(panel)} />
                ))}
              />

              {/* Technology & Standards */}
              <SectionHeader
                title="Technology & Standards"
                gridStyle={tableGridStyle}
              />
              <Row
                label="Technology"
                gridStyle={tableGridStyle}
                values={cells((panel) => (
                  <div key={panel.id} className="space-y-1.5">
                    <p>{shortTechnology(panel)}</p>
                    {isBestAvailableTech(panel) && (
                      <span className="inline-flex items-center rounded bg-[#E8F6ED] px-1.5 py-0.5 text-[11px] text-[#1D8F47]">
                        Best Available
                      </span>
                    )}
                  </div>
                ))}
              />
              <Row
                label="Certifications"
                gridStyle={tableGridStyle}
                values={cells((panel) => (
                  <div key={panel.id} className="space-y-1">
                    {certificationList(panel).map((cert) => (
                      <p key={cert}>{cert}</p>
                    ))}
                  </div>
                ))}
              />

              {/* Technical specs */}
              <SectionHeader
                title="Technology & Standards"
                gridStyle={tableGridStyle}
              />
              <Row
                label="Efficiency (higher = more power)"
                gridStyle={tableGridStyle}
                values={cells((panel) => `${panel.efficiency}%`)}
              />
              <Row
                label="Heat Performance (lower = better)"
                gridStyle={tableGridStyle}
                values={cells((panel) => `${panel.temperatureCoefficient}%/°C`)}
              />
              <Row
                label="Yearly Output Loss (lower = better)"
                gridStyle={tableGridStyle}
                values={cells(
                  (panel) =>
                    `Yr1 ≤${panel.firstYearPowerDrop}%  ·  ≤${panel.annualDegradation}%/yr`,
                )}
              />
              <Row
                label="Panel Construction"
                gridStyle={tableGridStyle}
                values={cells((panel) => panelConstruction(panel))}
              />
              <Row
                label="Dual-Sided Generation"
                gridStyle={tableGridStyle}
                values={cells((panel) => dualSidedGeneration(panel))}
              />
              <Row
                label="Max Voltage"
                gridStyle={tableGridStyle}
                values={cells(() => MAX_SYSTEM_VOLTAGE)}
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
              Select at least 2 panels to compare
            </h3>
            <p className="text-sm text-gray-500">
              Use the dropdowns above to select panels for comparison
            </p>
          </div>
        )}

        {columnCount >= 2 && (
          <>
            <div className="mt-6 text-center">
              <button
                type="button"
                className="rounded-lg bg-[#F7BA41] px-5 py-2.5 text-[13px] font-medium text-[#272218] transition-colors duration-200 hover:bg-[#E5A930]"
              >
                Get free Quote for these Panels
              </button>
            </div>

            <VisualSummarySection selectedPanels={selectedPanels} />
            <RecommendationSection selectedPanels={selectedPanels} />
            <ComparisonCTA />
          </>
        )}
      </div>

      {/* FAQ Section - outside the container since it has its own */}
      {columnCount >= 2 && <FAQSection />}
    </div>
  );
}
