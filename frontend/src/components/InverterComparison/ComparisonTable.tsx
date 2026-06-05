"use client";

import { SolarInverter } from "@/types/solarInverter";
import Image from "next/image";
import { X, ChevronDown, Check, X as XIcon, Plus } from "lucide-react";
import { useMemo, useState, type CSSProperties } from "react";
import RecommendationSection from "./RecommendationSection";
import ComparisonCTA from "./ComparisonCTA";
import FAQSection from "./FAQSection";

interface ComparisonTableProps {
  selectedInverters: SolarInverter[];
  allInverters: SolarInverter[];
  onRemoveInverter: (inverterId: string) => void;
  onAddInverter: (inverterId: string) => void;
  onClose: () => void;
}

function SectionHeader({
  title,
  columns,
  gridStyle,
}: {
  title: string;
  columns: number;
  gridStyle: CSSProperties;
}) {
  return (
    <div
      className="grid bg-[#F1F3F6] text-[#3F454D] text-sm sm:text-base"
      style={gridStyle}
    >
      <div className="min-w-0 px-4 py-3 font-semibold sticky left-0 bg-[#F1F3F6] z-20 border-y border-[#DFE3E8] shadow-[2px_0_4px_rgba(0,0,0,0.05)]">
        {title}
      </div>
      {Array.from({ length: columns }).map((_, idx) => (
        <div
          key={idx}
          className="min-w-0 border-l border-y border-[#DFE3E8] bg-[#F1F3F6]"
        />
      ))}
    </div>
  );
}

function ComparisonRow({
  label,
  values,
  gridStyle,
  highlight = false,
}: {
  label: string;
  values: (string | number | boolean | null)[];
  gridStyle: CSSProperties;
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
        <span className="inline-flex items-center gap-1 text-red-500 text-[12px]">
          <XIcon className="w-3.5 h-3.5" />
          No
        </span>
      );
    }

    if (typeof value === "string") {
      // Reusable badge formatting markers
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
      if (value.includes("__BUILT_IN__")) {
        return (
          <span className="inline-flex items-center gap-1 bg-[#D9F3E2] text-[#1E8D4E] px-2 py-0.5 rounded-full text-[12px]">
            <Check className="w-3.5 h-3.5" />
            {value.replace("__BUILT_IN__", "")}
          </span>
        );
      }
      if (value.includes("__OPTIONAL__")) {
        return (
          <span className="inline-flex items-center gap-1 bg-[#FFECCF] text-[#C98013] px-2 py-0.5 rounded-full text-[12px]">
            {value.replace("__OPTIONAL__", "")}
          </span>
        );
      }
      if (value.includes("__NOT_AVAILABLE__")) {
        return (
          <span className="text-red-500 text-[12px]">
            {value.replace("__NOT_AVAILABLE__", "")}
          </span>
        );
      }
      if (value.includes("__ADVANCED__")) {
        return (
          <span className="inline-flex items-center gap-1 bg-[#D9F3E2] text-[#1E8D4E] px-2 py-0.5 rounded-full text-[12px]">
            <Check className="w-3.5 h-3.5" />
            {value.replace("__ADVANCED__", "")}
          </span>
        );
      }
    }

    return value;
  };

  return (
    <div
      className={`grid ${highlight ? "bg-[#FFFFFF]" : "bg-white"}`}
      style={gridStyle}
    >
      <div className="min-w-0 px-3 sm:px-4 py-3 text-[13px] text-[#616770] font-medium border-r border-b border-[#E1E5EA] flex items-center justify-between gap-2 sticky left-0 bg-white z-20 shadow-[2px_0_4px_rgba(0,0,0,0.05)]">
        <span>{label}</span>
        <span className="text-[#8D8D8D] text-xs hidden sm:inline">ⓘ</span>
      </div>
      {values.map((value, index) => (
        <div
          key={index}
          className="min-w-0 px-3 sm:px-4 py-3 text-[11px] sm:text-[13px] text-[#3C4147] font-medium text-left border-r border-b border-[#E1E5EA] last:border-r-0 break-words"
        >
          {formatValue(value)}
        </div>
      ))}
    </div>
  );
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

  const available = allInverters.filter(
    (p) => !selectedInverterIds.includes(p.id) || p.id === selectedInverter?.id,
  );

  const pillSummary = useMemo(() => {
    if (!selectedInverter) return "";
    return `${selectedInverter.type} • ${(selectedInverter.ratedOutputPower / 1000).toFixed(1)}kW${
      selectedInverter.extendableWarrantyYears
        ? ` • ${selectedInverter.warrantyYears} Yr → ${selectedInverter.extendableWarrantyYears} Yr`
        : ` • ${selectedInverter.warrantyYears} Yr Warranty`
    }`;
  }, [selectedInverter]);

  return (
    <div className="relative w-[220px] sm:w-[230px]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full rounded-[6px] border border-[#D8D8D8] bg-[#FAFAFA] px-3 py-2 text-left hover:border-[#074A4D] transition-colors"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[11px] text-[#2F2F2F] font-semibold truncate flex items-center gap-1.5">
              {!selectedInverter && <Plus className="w-3.5 h-3.5" />}
              {selectedInverter ? selectedInverter.name : "Add inverter"}
            </p>
            {selectedInverter && (
              <p className="text-[10px] text-[#6B6B6B] truncate">
                {pillSummary}
              </p>
            )}
          </div>
          {selectedInverter && (
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
            {available.map((inverter) => (
              <button
                key={inverter.id}
                onClick={() => {
                  onSelect(inverter.id);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
              >
                <p className="text-[11px] text-[#074A4D] font-semibold truncate">
                  {inverter.name}
                </p>
                <p className="text-[10px] text-gray-500 truncate">
                  {inverter.type} •{" "}
                  {(inverter.ratedOutputPower / 1000).toFixed(1)} kW •{" "}
                  {inverter.warrantyYears} Yr Warranty
                </p>
              </button>
            ))}
          </div>
        </>
      )}

      {selectedInverter && (
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

function getSafetyScore(inverter: SolarInverter) {
  let score = 0;
  if (inverter.dcSurgeProtection === "Built-in") score += 25;
  if (inverter.acSurgeProtection === "Built-in") score += 25;
  if (inverter.arcFaultDetection === "Built-in") score += 25;
  if (inverter.gridProtection) score += 25;
  return score;
}

function getValueForMoneyScore(inverter: SolarInverter) {
  const blended =
    inverter.ratings.efficiency * 0.35 +
    inverter.ratings.warranty * 0.35 +
    inverter.ratings.keralaClimate * 0.3;
  return Math.round(blended);
}

function VisualSummaryCard({ inverter }: { inverter: SolarInverter }) {
  const metrics = [
    {
      label: "Efficiency (EU)",
      value: inverter.ratings.efficiency,
      rightText: `${inverter.europeanEfficiency}%`,
    },
    {
      label: "Kerala Durability",
      value: inverter.ratings.keralaClimate,
      rightText: scoreToLabel(inverter.ratings.keralaClimate),
    },
    {
      label: "Safety Features",
      value: getSafetyScore(inverter),
      rightText:
        getSafetyScore(inverter) >= 85 ? "All Built-in" : "Optional Add-ons",
    },
    {
      label: "Monitoring",
      value: inverter.ratings.reliability,
      rightText: scoreToLabel(inverter.ratings.reliability),
    },
    {
      label: "Brand Trust",
      value: Math.min(
        100,
        60 +
          (inverter.warrantyYears >= 12 ? 20 : 10) +
          (inverter.corrosionProtection.includes("C5") ? 20 : 10),
      ),
      rightText: scoreToLabel(inverter.ratings.reliability),
    },
    {
      label: "Value for Money",
      value: getValueForMoneyScore(inverter),
      rightText: scoreToLabel(getValueForMoneyScore(inverter)),
    },
  ];

  return (
    <article className="rounded-xl sm:rounded-2xl bg-[#ECEDEF] p-2.5 sm:p-3 md:p-4 lg:p-4 xl:p-4.5 2xl:p-5">
      <p className="text-[9px] sm:text-[10px] md:text-[11px] 2xl:text-xs font-medium text-[#F97316] uppercase tracking-wide mb-1.5 sm:mb-2">
        {inverter.brand}
      </p>
      <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-[26px] 2xl:text-[28px] font-medium text-[#1F2937] leading-tight mb-3 sm:mb-3.5 md:mb-4">
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
  const isTwoPanelLayout = selectedInverters.length === 2;
  return (
    <section className="mt-6 sm:mt-7 md:mt-8 lg:mt-9 xl:mt-10 2xl:mt-12">
      <div className="text-center mb-4 sm:mb-5 md:mb-5 lg:mb-6 xl:mb-7 2xl:mb-8">
        <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] xl:text-[48px] 2xl:text-[52px] font-semibold text-[#183C39] leading-tight">
          Visual Summary
        </h3>
      </div>

      <div className="overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible">
        <div
          className={`flex gap-3 sm:grid sm:gap-4 md:gap-4 lg:gap-5 xl:gap-5 2xl:gap-6 ${
            isTwoPanelLayout ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {selectedInverters.map((inverter) => (
            <div
              key={inverter.id}
              className="min-w-[280px] sm:min-w-0 flex-shrink-0 sm:flex-shrink"
            >
              <VisualSummaryCard inverter={inverter} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Annotate Maximum DC Voltage with Better/Good labels
function dcVoltageBadge(volts: number): string {
  if (volts >= 600) return `${volts} V__BEST__`;
  if (volts >= 500) return `${volts} V__GOOD__`;
  return `${volts} V`;
}

function badgeBuiltIn(value: string): string {
  if (value === "Built-in") return "Built-in__BUILT_IN__";
  if (value === "Optional") return "Optional__OPTIONAL__";
  return value;
}

function badgeIVCurve(value: string): string {
  if (value.toLowerCase().includes("advanced")) return `${value}__ADVANCED__`;
  if (value.toLowerCase().includes("not available"))
    return `${value}__NOT_AVAILABLE__`;
  return value;
}

function badgeMaxDcInput(value: string, hasSuitable: string): string {
  if (hasSuitable.includes("5-6")) return `${value}__K_BEST__`;
  if (hasSuitable) return `${value}__GOOD__`;
  return value;
}

export default function ComparisonTable({
  selectedInverters,
  allInverters,
  onRemoveInverter,
  onAddInverter,
}: ComparisonTableProps) {
  const selectedIds = selectedInverters.map((p) => p.id);
  const tableGridStyle = useMemo<CSSProperties>(
    () => ({
      gridTemplateColumns: `var(--comparison-label-col) repeat(${selectedInverters.length}, minmax(0, 1fr))`,
      minWidth: `calc(var(--comparison-label-col) + ${selectedInverters.length * 180}px)`,
    }),
    [selectedInverters.length],
  );

  const inverterSlots = [0, 1, 2].map(
    (index) => selectedInverters[index] || null,
  );

  const handleSelect = (_slotIndex: number, inverterId: string) => {
    onAddInverter(inverterId);
  };

  const handleRemove = (slotIndex: number) => {
    const inverter = inverterSlots[slotIndex];
    if (inverter) onRemoveInverter(inverter.id);
  };

  const getValues = (
    key:
      | keyof SolarInverter
      | ((inverter: SolarInverter) => string | number | boolean | null),
  ) => {
    return inverterSlots.slice(0, selectedInverters.length).map((inverter) => {
      if (!inverter) return null;
      if (typeof key === "function") return key(inverter);
      return inverter[key] as string | number | boolean | null;
    });
  };

  return (
    <div className="bg-[#F7F8FA] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Inverter Selector row */}
        <div className="overflow-x-auto sm:overflow-visible pb-2 mb-8 sm:mb-10 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex items-center justify-start sm:justify-center gap-2 sm:gap-3 bg-[#F3F3F3] border border-[#E4E4E4] rounded-lg px-3 sm:px-4 py-3 min-w-max sm:min-w-0">
            <InverterSelector
              selectedInverter={inverterSlots[0]}
              allInverters={allInverters}
              selectedInverterIds={selectedIds}
              onSelect={(id) => handleSelect(0, id)}
              onRemove={() => handleRemove(0)}
            />
            <span className="text-xs sm:text-sm text-[#6B6B6B]">VS</span>
            <InverterSelector
              selectedInverter={inverterSlots[1]}
              allInverters={allInverters}
              selectedInverterIds={selectedIds}
              onSelect={(id) => handleSelect(1, id)}
              onRemove={() => handleRemove(1)}
            />
            <span className="text-xs sm:text-sm text-[#6B6B6B]">VS</span>
            <InverterSelector
              selectedInverter={inverterSlots[2]}
              allInverters={allInverters}
              selectedInverterIds={selectedIds}
              onSelect={(id) => handleSelect(2, id)}
              onRemove={() => handleRemove(2)}
            />
          </div>
        </div>

        <div className="mb-4 text-center">
          <h2 className="text-2xl sm:text-4xl font-bold text-[#183C39]">
            Side-by-Side Comparison
          </h2>
        </div>

        {selectedInverters.length >= 2 && (
          <div className="bg-white border border-[#DFE3E8] overflow-x-auto [--comparison-label-col:140px] sm:[--comparison-label-col:160px] md:[--comparison-label-col:170px] lg:[--comparison-label-col:190px] xl:[--comparison-label-col:220px] 2xl:[--comparison-label-col:240px]">
            <div className="min-w-full" style={tableGridStyle}>
              {/* Column headers */}
              <div className="grid" style={tableGridStyle}>
                <div className="min-w-0 border-r border-b border-[#DFE3E8] bg-white sticky left-0 z-20 shadow-[2px_0_4px_rgba(0,0,0,0.05)]" />
                {inverterSlots
                  .slice(0, selectedInverters.length)
                  .map((inverter, idx) => (
                    <div
                      key={inverter?.id || idx}
                      className="min-w-0 bg-[#F4F1E6] border-r border-b border-[#DFE3E8] flex items-center justify-between gap-2 px-3 sm:px-4 py-2 text-[10px] sm:text-[13px] font-semibold text-[#355659]"
                    >
                      <span className="truncate min-w-0">{inverter?.name}</span>
                      <button
                        onClick={() => handleRemove(idx)}
                        className="p-1 text-gray-500 hover:text-gray-800 flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
              </div>

              {/* Image row */}
              <div className="grid" style={tableGridStyle}>
                <div className="min-w-0 border-r border-b border-[#DFE3E8] bg-white sticky left-0 z-20 shadow-[2px_0_4px_rgba(0,0,0,0.05)]" />
                {inverterSlots
                  .slice(0, selectedInverters.length)
                  .map((inverter, idx) => (
                    <div
                      key={inverter?.id || idx}
                      className="min-w-0 border-r border-b border-[#DFE3E8] bg-white flex items-center justify-center h-[180px] sm:h-[260px]"
                    >
                      {inverter && (
                        <div className="relative w-[92%] h-[90%] overflow-hidden">
                          <Image
                            src={inverter.imageUrl || "/invertor image.png"}
                            alt={inverter.name}
                            fill
                            className="object-contain scale-[1.15]"
                            sizes="(max-width: 640px) 60vw, (max-width: 1024px) 45vw, 32vw"
                          />
                        </div>
                      )}
                    </div>
                  ))}
              </div>

              {/* The Basics */}
              <SectionHeader
                title="The Basics"
                columns={selectedInverters.length}
                gridStyle={tableGridStyle}
              />
              <ComparisonRow
                label="Type"
                values={getValues((p) =>
                  p.type === "Hybrid" || p.type === "Microinverter"
                    ? p.type
                    : `On-Grid ${p.type} Inverter`,
                )}
                gridStyle={tableGridStyle}
              />
              <ComparisonRow
                label="Rated Output Power"
                values={getValues((p) =>
                  p.suitableSystemSize
                    ? `${p.ratedOutputPower}W__K_BEST__`
                    : `${p.ratedOutputPower}W`,
                )}
                gridStyle={tableGridStyle}
              />
              <ComparisonRow
                label="Maximum DC Input"
                values={getValues((p) =>
                  badgeMaxDcInput(`${p.maximumDcInput}W`, p.suitableSystemSize),
                )}
                gridStyle={tableGridStyle}
              />
              <ComparisonRow
                label="MPPT Trackers"
                values={getValues("mpptTrackers")}
                gridStyle={tableGridStyle}
              />
              <ComparisonRow
                label="Maximum DC Voltage"
                values={getValues((p) => dcVoltageBadge(p.maximumDcVoltage))}
                gridStyle={tableGridStyle}
              />
              <ComparisonRow
                label="Maximum Input Current"
                values={getValues("maximumInputCurrent")}
                gridStyle={tableGridStyle}
              />
              <ComparisonRow
                label="Weight"
                values={getValues((p) => `${p.weight} kg`)}
                gridStyle={tableGridStyle}
              />
              <ComparisonRow
                label="Display"
                values={getValues("display")}
                gridStyle={tableGridStyle}
              />

              {/* Performance & Efficiency */}
              <SectionHeader
                title="Performance & Efficiency"
                columns={selectedInverters.length}
                gridStyle={tableGridStyle}
              />
              <ComparisonRow
                label="Maximum Efficiency"
                values={getValues((p) => `${p.maximumEfficiency}%`)}
                gridStyle={tableGridStyle}
              />
              <ComparisonRow
                label="European Efficiency"
                values={getValues((p) => `${p.europeanEfficiency}%`)}
                gridStyle={tableGridStyle}
              />
              <ComparisonRow
                label="MPPT Efficiency"
                values={getValues((p) => `${p.mpptEfficiency}%`)}
                gridStyle={tableGridStyle}
              />
              <ComparisonRow
                label="DC Oversizing"
                values={getValues((p) => `${p.dcOversizing}%`)}
                gridStyle={tableGridStyle}
              />
              <ComparisonRow
                label="AC Overloading"
                values={getValues((p) => `${p.acOverloading}%`)}
                gridStyle={tableGridStyle}
              />
              <ComparisonRow
                label="PID Protection"
                values={getValues("pidProtection")}
                gridStyle={tableGridStyle}
              />
              <ComparisonRow
                label="IV Curve Scanning"
                values={getValues((p) => badgeIVCurve(p.ivCurveScanning))}
                gridStyle={tableGridStyle}
              />

              {/* Durability */}
              <SectionHeader
                title="Durability"
                columns={selectedInverters.length}
                gridStyle={tableGridStyle}
              />
              <ComparisonRow
                label="IP Rating"
                values={getValues((p) =>
                  p.ipRating.includes("66") || p.ipRating.includes("68")
                    ? `${p.ipRating}__K_BEST__`
                    : p.ipRating,
                )}
                gridStyle={tableGridStyle}
              />
              <ComparisonRow
                label="Corrosion Protection"
                values={getValues("corrosionProtection")}
                gridStyle={tableGridStyle}
              />
              <ComparisonRow
                label="Operating Temperature"
                values={getValues("operatingTemperature")}
                gridStyle={tableGridStyle}
              />
              <ComparisonRow
                label="Cooling"
                values={getValues("cooling")}
                gridStyle={tableGridStyle}
              />
              <ComparisonRow
                label="Noise Level"
                values={getValues("noiseLevel")}
                gridStyle={tableGridStyle}
              />

              {/* Safety Features */}
              <SectionHeader
                title="Safety Features"
                columns={selectedInverters.length}
                gridStyle={tableGridStyle}
              />
              <ComparisonRow
                label="DC Surge Protection"
                values={getValues((p) => badgeBuiltIn(p.dcSurgeProtection))}
                gridStyle={tableGridStyle}
              />
              <ComparisonRow
                label="AC Surge Protection"
                values={getValues((p) => badgeBuiltIn(p.acSurgeProtection))}
                gridStyle={tableGridStyle}
              />
              <ComparisonRow
                label="Arc Fault Detection (AFCI)"
                values={getValues((p) => badgeBuiltIn(p.arcFaultDetection))}
                gridStyle={tableGridStyle}
              />
              <ComparisonRow
                label="Grid Protection"
                values={getValues("gridProtection")}
                gridStyle={tableGridStyle}
              />

              {/* Monitoring & Software */}
              <SectionHeader
                title="Monitoring & Software"
                columns={selectedInverters.length}
                gridStyle={tableGridStyle}
              />
              <ComparisonRow
                label="Monitoring App"
                values={getValues("monitoringApp")}
                gridStyle={tableGridStyle}
              />
              <ComparisonRow
                label="Real-Time Monitoring"
                values={getValues("realTimeMonitoring")}
                gridStyle={tableGridStyle}
              />
              <ComparisonRow
                label="Remote Diagnostics"
                values={getValues("remoteDiagnostics")}
                gridStyle={tableGridStyle}
              />
              <ComparisonRow
                label="Firmware Updates"
                values={getValues("firmwareUpdates")}
                gridStyle={tableGridStyle}
              />
              <ComparisonRow
                label="Connectivity"
                values={getValues("connectivity")}
                gridStyle={tableGridStyle}
              />

              {/* Warranty & Brand Trust */}
              <SectionHeader
                title="Warranty & Brand Trust"
                columns={selectedInverters.length}
                gridStyle={tableGridStyle}
              />
              <ComparisonRow
                label="Warranty"
                values={getValues((p) =>
                  p.extendableWarrantyYears
                    ? `${p.warrantyYears} Years (ext. to ${p.extendableWarrantyYears})`
                    : `${p.warrantyYears} Years`,
                )}
                gridStyle={tableGridStyle}
              />
              <ComparisonRow
                label="Certifications"
                values={getValues((p) => p.certifications.join(", ") || "—")}
                gridStyle={tableGridStyle}
              />
              <ComparisonRow
                label="Brand Trust"
                values={getValues("brandTrust")}
                gridStyle={tableGridStyle}
              />
              <ComparisonRow
                label="Year Founded"
                values={getValues((p) =>
                  p.yearFounded ? String(p.yearFounded) : "—",
                )}
                gridStyle={tableGridStyle}
              />
              <ComparisonRow
                label="Global Installations"
                values={getValues((p) => p.globalInstallations || "—")}
                gridStyle={tableGridStyle}
              />
              <ComparisonRow
                label="Countries Served"
                values={getValues((p) => p.countriesServed || "—")}
                gridStyle={tableGridStyle}
              />
              <ComparisonRow
                label="Price Range"
                values={getValues("priceRange")}
                gridStyle={tableGridStyle}
                highlight
              />
            </div>
          </div>
        )}

        {selectedInverters.length < 2 && (
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
              Select at least 2 inverters to compare
            </h3>
            <p className="text-sm text-gray-500">
              Use the dropdowns above to select inverters for comparison
            </p>
          </div>
        )}

        {selectedInverters.length >= 2 && (
          <>
            <div className="mt-6 text-center">
              <button className="bg-[#F7BA41] hover:bg-[#E5A930] text-[#272218] px-5 py-2 rounded-lg font-medium text-[12px] transition-colors duration-200">
                Get Free Quote for these Inverters
              </button>
            </div>

            <VisualSummarySection selectedInverters={selectedInverters} />
            <RecommendationSection selectedInverters={selectedInverters} />
            <ComparisonCTA />
          </>
        )}
      </div>

      {selectedInverters.length >= 2 && <FAQSection />}
    </div>
  );
}
