"use client";

import { SolarInverter } from "@/types/solarInverter";
import Image from "next/image";
import { Plus, Check } from "lucide-react";

interface InverterCardProps {
  inverter: SolarInverter;
  isSelected: boolean;
  onToggleCompare: (inverterId: string) => void;
  canSelect: boolean;
}

function ProgressBar({ label, value }: { label: string; value: number }) {
  const barColor =
    label === "Reliability" || label === "Warranty" ? "#E6B13F" : "#1FA35B";

  return (
    <div className="flex items-center gap-2.5">
      <span className="text-[10px] text-[#3D3D3D] w-24 sm:w-28 flex-shrink-0">
        {label}
      </span>
      <div className="flex-1 h-2 bg-[#E9E9E9] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${value}%`, backgroundColor: barColor }}
        />
      </div>
      <span className="text-[10px] font-semibold text-[#333333] w-10 text-right">
        {value}%
      </span>
    </div>
  );
}

function KeralaClimateScoreBadge({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2 text-[10px] text-[#2F2F2F]">
      <Image
        src="https://golden-ray.b-cdn.net/icons/Frame%20(6).png"
        alt="Kerala climate score logo"
        width={20}
        height={20}
        className="w-4 h-4 object-contain"
      />
      <span className="font-semibold">Kerala Inverter Rating:</span>
      <span className="font-semibold">{score}/100</span>
    </div>
  );
}

const TIER_BADGE_STYLES: Record<string, string> = {
  Premium: "bg-[#FFEFEF] text-[#D95050]",
  "Mid-Range": "bg-[#E7F1FF] text-[#1F6CD9]",
  Value: "bg-[#FFF6E0] text-[#C98013]",
};

export default function InverterCard({
  inverter,
  isSelected,
  onToggleCompare,
  canSelect,
}: InverterCardProps) {
  const handleCompareClick = () => {
    if (isSelected || canSelect) {
      onToggleCompare(inverter.id);
    }
  };

  const tierBadge =
    TIER_BADGE_STYLES[inverter.ratingTier] ?? TIER_BADGE_STYLES["Mid-Range"];

  return (
    <div className="bg-white rounded-[20px] shadow-[0_6px_20px_rgba(0,0,0,0.04)] border border-[#E8E8E8] overflow-hidden hover:shadow-[0_10px_28px_rgba(0,0,0,0.06)] transition-shadow duration-300">
      {/* Image Section */}
      <div className="relative bg-white h-44 sm:h-48 flex items-center justify-center">
        <Image
          src={inverter.imageUrl || "/invertor image.png"}
          alt={inverter.name}
          fill
          className="object-contain px-6"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      {/* Content */}
      <div className="px-4 sm:px-5 py-4 sm:py-5 space-y-3.5">
        {/* Brand */}
        <p className="text-[10px] font-semibold text-[#D5A11E] uppercase tracking-wide">
          {inverter.brand}
        </p>

        {/* Name */}
        <h3 className="font-semibold text-[17px] sm:text-[19px] text-[#202020] leading-snug">
          {inverter.name}
        </h3>

        {/* Type Badge */}
        <div>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-medium ${tierBadge}`}
          >
            {inverter.type}
          </span>
        </div>

        {/* Specs Row */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#3D3D3D]">
          <span>{inverter.maximumEfficiency}% Efficiency</span>
          <span>{(inverter.ratedOutputPower / 1000).toFixed(1)} kW</span>
          <span>
            {inverter.warrantyYears}
            {inverter.extendableWarrantyYears
              ? ` Yr - ${inverter.extendableWarrantyYears} Yr`
              : " Yr"}{" "}
            Warranty
          </span>
          <span className="hidden sm:inline">{inverter.mpptTrackers} MPPT</span>
        </div>

        {/* Description */}
        <p className="text-[11px] text-[#4A4A4A] leading-[1.45] line-clamp-3">
          {inverter.description}
        </p>

        {/* Progress Bars */}
        <div className="space-y-2 pt-1 pr-6 sm:pr-12 max-w-[90%]">
          <ProgressBar label="Efficiency" value={inverter.ratings.efficiency} />
          <ProgressBar
            label="Reliability"
            value={inverter.ratings.reliability}
          />
          <ProgressBar label="Warranty" value={inverter.ratings.warranty} />
          <ProgressBar
            label="Kerala Climate"
            value={inverter.ratings.keralaClimate}
          />
        </div>

        <div className="border-t border-[#E5E5E5]" />

        {/* Kerala Climate Score */}
        <div className="pr-6 sm:pr-7">
          <KeralaClimateScoreBadge score={inverter.keralaClimateScore} />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1 pr-10 sm:pr-14 justify-start">
          <button
            onClick={handleCompareClick}
            disabled={!isSelected && !canSelect}
            className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-[11px] font-semibold transition-all duration-200 ${
              isSelected
                ? "bg-[#074A4D] text-white"
                : canSelect
                  ? "border border-[#D7D7D7] text-[#2F2F2F] hover:bg-[#F8F8F8]"
                  : "border border-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isSelected ? (
              <Check className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            {isSelected ? "Selected" : "Compare"}
          </button>
          <button className="bg-[#F7BA41] hover:bg-[#E5A930] text-[#272218] px-3 py-2 rounded-xl text-[11px] font-semibold transition-colors duration-200 min-w-[110px]">
            Get Quote
          </button>
        </div>
      </div>
    </div>
  );
}
