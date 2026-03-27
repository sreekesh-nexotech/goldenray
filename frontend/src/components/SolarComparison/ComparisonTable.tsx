"use client";

import { SolarPanel } from "@/types/solarPanel";
import Image from "next/image";
import { X, ChevronDown, Check, X as XIcon, Plus } from "lucide-react";
import { useMemo, useState } from "react";

interface ComparisonTableProps {
  selectedPanels: SolarPanel[];
  allPanels: SolarPanel[];
  onRemovePanel: (panelId: string) => void;
  onAddPanel: (panelId: string) => void;
  onClose: () => void;
}

// Helpers
const gridTemplate = (count: number) => `repeat(${count + 1}, minmax(0, 1fr))`;

// Section header row spanning the table grid
function SectionHeader({ title, columns }: { title: string; columns: number }) {
  return (
    <div
      className="grid bg-[#F1F3F6] text-[#3F454D] border-y border-[#DFE3E8] text-sm sm:text-base"
      style={{ gridTemplateColumns: gridTemplate(columns) }}
    >
      <div className="px-4 py-3 font-semibold">{title}</div>
      {Array.from({ length: columns }).map((_, idx) => (
        <div key={idx} className="border-l border-[#DFE3E8]" />
      ))}
    </div>
  );
}

// Comparison row component
function ComparisonRow({
  label,
  values,
  highlight = false,
}: {
  label: string;
  values: (string | number | boolean | null)[];
  highlight?: boolean;
}) {
  const formatValue = (value: string | number | boolean | null) => {
    if (value === null || value === undefined) return "—";
    if (typeof value === "boolean") {
      return value ? (
        <span className="inline-flex items-center gap-1 bg-[#D9F3E2] text-[#1E8D4E] px-2 py-0.5 rounded-full text-[12px]">
          <Check className="w-3.5 h-3.5" />
          Yes
        </span>
      ) : (
        <XIcon className="w-4 h-4 text-red-400 mx-auto" />
      );
    }

    if (typeof value === "string") {
      if (value.includes("__K_BEST__")) {
        return (
          <div className="inline-flex items-center gap-2">
            <span>{value.replace("__K_BEST__", "")}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#D9F3E2] text-[#1E8D4E]">
              Best for Kerala
            </span>
          </div>
        );
      }

      if (value.includes("__GOOD__")) {
        return (
          <div className="inline-flex items-center gap-2">
            <span>{value.replace("__GOOD__", "")}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#FFECCF] text-[#C98013]">
              Good
            </span>
          </div>
        );
      }

      if (value.includes("__BEST__")) {
        return (
          <div className="inline-flex items-center gap-2">
            <span>{value.replace("__BEST__", "")}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#D9F3E2] text-[#1E8D4E]">
              Best
            </span>
          </div>
        );
      }

      if (value.includes("__BELOW_AVG__")) {
        return (
          <div className="inline-flex items-center gap-2">
            <span>{value.replace("__BELOW_AVG__", "")}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#FFE0E0] text-[#D95050]">
              Below Avg
            </span>
          </div>
        );
      }
    }

    return value;
  };

  return (
    <div
      className={`grid border-b ${highlight ? "bg-[#FFFFFF]" : "bg-white"}`}
      style={{ gridTemplateColumns: gridTemplate(values.length) }}
    >
      <div className="px-3 sm:px-4 py-3 text-[13px] text-[#616770] font-medium border-r border-[#E1E5EA] flex items-center justify-between gap-2">
        <span>{label}</span>
        <span className="text-[#8D8D8D] text-xs">ⓘ</span>
      </div>
      {values.map((value, index) => (
        <div
          key={index}
          className="px-3 sm:px-4 py-3 text-[13px] text-[#3C4147] font-medium text-left border-r border-[#E1E5EA] last:border-r-0"
        >
          {formatValue(value)}
        </div>
      ))}
    </div>
  );
}

// Panel selector dropdown
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

  const pillSummary = useMemo(() => {
    if (!selectedPanel) return "";
    return `${selectedPanel.type} • ${selectedPanel.wattage}W • ${selectedPanel.productWarranty} Yr + ${selectedPanel.performanceWarranty} Yr Warranty`;
  }, [selectedPanel]);

  return (
    <div className="relative w-[220px] sm:w-[230px]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full rounded-[6px] border border-[#D8D8D8] bg-[#FAFAFA] px-3 py-2 text-left hover:border-[#074A4D] transition-colors ${selectedPanel ? "" : ""}`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[11px] text-[#2F2F2F] font-semibold truncate flex items-center gap-1.5">
              {!selectedPanel && <Plus className="w-3.5 h-3.5" />}
              {selectedPanel ? selectedPanel.name : "Add panel"}
            </p>
            {selectedPanel && (
              <p className="text-[10px] text-[#6B6B6B] truncate">
                {pillSummary}
              </p>
            )}
          </div>
          {selectedPanel && (
            <ChevronDown className="w-3.5 h-3.5 text-[#6B6B6B]" />
          )}
        </div>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 z-20 max-h-64 overflow-y-auto">
            {availablePanels.map((panel) => (
              <button
                key={panel.id}
                onClick={() => {
                  onSelect(panel.id);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
              >
                <p className="text-[11px] text-[#074A4D] font-semibold truncate">
                  {panel.name}
                </p>
                <p className="text-[10px] text-gray-500 truncate">
                  {panel.type} • {panel.wattage}W • {panel.productWarranty} Yr +{" "}
                  {panel.performanceWarranty} Yr Warranty
                </p>
              </button>
            ))}
          </div>
        </>
      )}

      {selectedPanel && (
        <button
          onClick={onRemove}
          className="absolute -right-2 -top-2 w-6 h-6 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-500 hover:text-gray-800"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

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
        <span className="text-[#2F2F2F] font-medium">{rightText}</span>
      </div>
      <div className="h-1.5 sm:h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
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
    <article className="rounded-xl sm:rounded-2xl bg-[#ECEDEF] p-2.5 sm:p-3 md:p-4 lg:p-4 xl:p-4.5 2xl:p-5">
      <p className="text-[9px] sm:text-[10px] md:text-[11px] 2xl:text-xs font-medium text-[#F97316] uppercase tracking-wide mb-1.5 sm:mb-2">
        {panel.brand}
      </p>
      <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-[26px] 2xl:text-[28px] font-medium text-[#1F2937] leading-tight mb-3 sm:mb-3.5 md:mb-4">
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

function VisualSummarySection({
  selectedPanels,
}: {
  selectedPanels: SolarPanel[];
}) {
  const isTwoPanelLayout = selectedPanels.length === 2;

  return (
    <section className="mt-6 sm:mt-7 md:mt-8 lg:mt-9 xl:mt-10 2xl:mt-12">
      <div className="text-center mb-4 sm:mb-5 md:mb-5 lg:mb-6 xl:mb-7 2xl:mb-8">
        <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] xl:text-[48px] 2xl:text-[52px] font-semibold text-[#183C39] leading-tight">
          Visual Summary
        </h3>
      </div>

      <div
        className={`grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-4 lg:gap-5 xl:gap-5 2xl:gap-6 ${
          isTwoPanelLayout
            ? "lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 max-w-5xl mx-auto"
            : "lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3"
        }`}
      >
        {selectedPanels.map((panel) => (
          <VisualSummaryCard key={panel.id} panel={panel} />
        ))}
      </div>
    </section>
  );
}

export default function ComparisonTable({
  selectedPanels,
  allPanels,
  onRemovePanel,
  onAddPanel,
  onClose: _onClose,
}: ComparisonTableProps) {
  const selectedPanelIds = selectedPanels.map((p) => p.id);

  // Create slots for up to 3 panels
  const panelSlots = [0, 1, 2].map((index) => selectedPanels[index] || null);

  const handleSelectPanel = (slotIndex: number, panelId: string) => {
    onAddPanel(panelId);
  };

  const handleRemovePanel = (slotIndex: number) => {
    const panel = panelSlots[slotIndex];
    if (panel) {
      onRemovePanel(panel.id);
    }
  };

  // Helper to get values for a row
  const getValues = (
    key:
      | keyof SolarPanel
      | ((panel: SolarPanel) => string | number | boolean | null),
  ) => {
    return panelSlots.slice(0, selectedPanels.length).map((panel) => {
      if (!panel) return null;
      if (typeof key === "function") {
        return key(panel);
      }
      return panel[key] as string | number | boolean | null;
    });
  };

  return (
    <div className="bg-[#F7F8FA] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Panel Selectors row */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 bg-[#F3F3F3] border border-[#E4E4E4] rounded-lg px-3 sm:px-4 py-3 mb-6">
          <PanelSelector
            selectedPanel={panelSlots[0]}
            allPanels={allPanels}
            selectedPanelIds={selectedPanelIds}
            onSelect={(panelId) => handleSelectPanel(0, panelId)}
            onRemove={() => handleRemovePanel(0)}
          />
          <span className="text-xs sm:text-sm text-[#6B6B6B]">VS</span>
          <PanelSelector
            selectedPanel={panelSlots[1]}
            allPanels={allPanels}
            selectedPanelIds={selectedPanelIds}
            onSelect={(panelId) => handleSelectPanel(1, panelId)}
            onRemove={() => handleRemovePanel(1)}
          />
          <span className="text-xs sm:text-sm text-[#6B6B6B]">VS</span>
          <PanelSelector
            selectedPanel={panelSlots[2]}
            allPanels={allPanels}
            selectedPanelIds={selectedPanelIds}
            onSelect={(panelId) => handleSelectPanel(2, panelId)}
            onRemove={() => handleRemovePanel(2)}
          />
        </div>

        <div className="mb-4 text-center">
          <h2 className="text-4xl font-bold text-[#183C39]">
            Side-by-Side Comparison
          </h2>
        </div>

        {/* Comparison Table */}
        {selectedPanels.length >= 2 && (
          <div className="bg-white border border-[#DFE3E8] overflow-hidden">
            {/* Column headers */}
            <div
              className="grid"
              style={{
                gridTemplateColumns: gridTemplate(selectedPanels.length),
              }}
            >
              <div className="border-r border-[#DFE3E8] bg-white" />
              {panelSlots.slice(0, selectedPanels.length).map((panel, idx) => (
                <div
                  key={panel?.id || idx}
                  className="bg-[#F4F1E6] border-r border-[#DFE3E8] flex items-center justify-between px-3 sm:px-4 py-2 text-[13px] font-semibold text-[#355659]"
                >
                  <span className="truncate">{panel?.name}</span>
                  <button
                    onClick={() => handleRemovePanel(idx)}
                    className="p-1 text-gray-500 hover:text-gray-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Image row */}
            <div
              className="grid border-b border-[#DFE3E8]"
              style={{
                gridTemplateColumns: gridTemplate(selectedPanels.length),
              }}
            >
              <div className="border-r border-[#DFE3E8] bg-white" />
              {panelSlots.slice(0, selectedPanels.length).map((panel, idx) => (
                <div
                  key={panel?.id || idx}
                  className="border-r border-[#DFE3E8] bg-white flex items-center justify-center h-[240px] sm:h-[300px]"
                >
                  {panel && (
                    <div className="relative w-[92%] h-[90%] overflow-hidden">
                      <Image
                        src={panel.imageUrl}
                        alt={panel.name}
                        fill
                        className="object-contain scale-[1.35]"
                        sizes="(max-width: 640px) 60vw, (max-width: 1024px) 45vw, 32vw"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* The Basics */}
            <SectionHeader title="The Basics" columns={selectedPanels.length} />
            <ComparisonRow
              label="Technology"
              values={getValues("technology")}
            />
            <ComparisonRow
              label="Power Output"
              values={getValues((p) => `${p.wattage}W`)}
            />
            <ComparisonRow
              label="Construction"
              values={getValues((p) =>
                p.moistureProtection.includes("Glass-to-Glass")
                  ? `${p.moistureProtection}__K_BEST__`
                  : p.moistureProtection,
              )}
            />
            <ComparisonRow
              label="Subsidy Eligible (DCR)"
              values={getValues("subsidyEligible")}
            />
            <ComparisonRow
              label="Bifacial Gain"
              values={getValues((p) =>
                p.bifacialGain ? `+${p.bifacialGain}%` : "N/A",
              )}
            />
            <ComparisonRow
              label="Weight"
              values={getValues((p) => `${p.weight} kg`)}
            />

            {/* Heat Performance */}
            <SectionHeader
              title="Heat Performance — The Kerala Test"
              columns={selectedPanels.length}
            />
            <ComparisonRow
              label="Temperature Coefficient"
              values={getValues((p) => {
                const badge =
                  p.temperatureCoefficient <= -0.35 ? "__BEST__" : "__GOOD__";
                return `${p.temperatureCoefficient}%/°C${badge}`;
              })}
            />
            <ComparisonRow
              label="Efficiency (STC)"
              values={getValues((p) => `${p.efficiency}%`)}
            />
            <ComparisonRow
              label="NOCT"
              values={getValues((p) => `${p.noct}°C`)}
            />
            <ComparisonRow
              label="Real Output at 60°C"
              values={getValues((p) => `~${p.realOutputAt60C}W`)}
            />

            {/* Durability */}
            <SectionHeader
              title="Durability — Kerala Monsoons"
              columns={selectedPanels.length}
            />
            <ComparisonRow
              label="Moisture Protection"
              values={getValues("moistureProtection")}
            />
            <ComparisonRow label="IP Rating" values={getValues("ipRating")} />
            <ComparisonRow
              label="Wind Load"
              values={getValues((p) => `${p.windLoad} Pa`)}
            />

            {/* Warranty & Degradation */}
            <SectionHeader
              title="Warranty & Degradation"
              columns={selectedPanels.length}
            />
            <ComparisonRow
              label="Product Warranty"
              values={getValues((p) => `${p.productWarranty} years`)}
            />
            <ComparisonRow
              label="Performance Warranty"
              values={getValues((p) => `${p.performanceWarranty} years`)}
            />
            <ComparisonRow
              label="First‑Year Power Drop"
              values={getValues((p) => `${p.firstYearPowerDrop}%`)}
            />
            <ComparisonRow
              label="Annual Degradation"
              values={getValues((p) =>
                p.annualDegradation >= 0.5
                  ? `${p.annualDegradation}%/year__BELOW_AVG__`
                  : `${p.annualDegradation}%/year`,
              )}
            />
            <ComparisonRow
              label="Output at Year 25"
              values={getValues((p) => `${p.outputAtYear25}%`)}
            />

            {/* Brand Trust */}
            <SectionHeader
              title="Brand Trust"
              columns={selectedPanels.length}
            />
            <ComparisonRow
              label="Manufacturing Capacity"
              values={getValues("manufacturingCapacity")}
            />
            <ComparisonRow
              label="Bloomberg Tier 1"
              values={getValues((p) =>
                p.bloombergTier1 ? "✓ Tier 1" : "Check",
              )}
            />
            <ComparisonRow
              label="PVEL Top Performer"
              values={getValues((p) =>
                p.pvelTopPerformer ? "✓ Yes" : "Check",
              )}
            />
            <ComparisonRow
              label="BIS Certified"
              values={getValues("bisCertified")}
            />
            <ComparisonRow
              label="Independent Audit"
              values={getValues("independentAudit")}
            />
            <ComparisonRow
              label="Certifications"
              values={getValues((p) => p.certifications.join(", "))}
            />
            <ComparisonRow
              label="Price Range"
              values={getValues("priceRange")}
              highlight
            />
          </div>
        )}

        {/* Empty state */}
        {selectedPanels.length < 2 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Select at least 2 panels to compare
            </h3>
            <p className="text-sm text-gray-500">
              Use the dropdowns above to select panels for comparison
            </p>
          </div>
        )}

        {/* Get Quote Button */}
        {selectedPanels.length >= 2 && (
          <>
            <div className="mt-6 text-center">
              <button className="bg-[#F7BA41] hover:bg-[#E5A930] text-[#272218] px-5 py-2 rounded-lg font-medium text-[12px] transition-colors duration-200">
                Get Free Quote for These Panels
              </button>
            </div>

            <VisualSummarySection selectedPanels={selectedPanels} />
          </>
        )}
      </div>
    </div>
  );
}
