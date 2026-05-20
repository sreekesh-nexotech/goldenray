"use client";

import React, { useState, useMemo } from "react";
import { ChevronDown, Check } from "lucide-react";
import LinkingButton from "../ui/LinkingButton";

// ─── filter options ────────────────────────────────────────────────────────────
const LOAN_OPTIONS = [
  { label: "Up to ₹1L", value: 100000 },
  { label: "Up to ₹2L", value: 200000 },
  { label: "Up to ₹3L", value: 300000 },
  { label: "Up to ₹4L", value: 400000 },
  { label: "Up to ₹5L", value: 500000 },
  { label: "Up to ₹6L", value: 600000 },
];

const CIBIL_OPTIONS = [
  { label: "Below 600", value: 599 },
  { label: "600–619",   value: 610 },
  { label: "620–649",   value: 635 },
  { label: "650–679",   value: 665 },
  { label: "680–699",   value: 690 },
  { label: "700–719",   value: 710 },
  { label: "720–749",   value: 735 },
  { label: "750+",      value: 800 },
];

const PRIORITY_OPTIONS = [
  { label: "Fastest approval",    value: "speed"  },
  { label: "Lowest rate",         value: "rate"   },
  { label: "Lowest fee",          value: "fee"    },
  { label: "Highest loan amount", value: "amount" },
];

// ─── bank data ─────────────────────────────────────────────────────────────────
const BANKS = [
  {
    id: "sbi",
    name: "State Bank of India",
    abbr: "SBI",
    logoBg: "#1D4ED8",
    rate: 5.65,
    recommended: true,
    maxLoan: 600000,
    cibilRequired: 0,
    approvalMin: 5,
    processingFee: 0,
    features: [
      "Up to ₹2L at 5.65% (Flarize rate)",
      "Up to ₹6L at 7.00%",
      "5–7 days approval",
      "Zero processing fee",
      "No collateral up to ₹2L",
      "No income proof for 3kW",
    ],
    bestFor: "Most Kerala homeowners — 3kW, first-time solar buyers",
  },
  {
    id: "federal",
    name: "Federal Bank",
    abbr: "FED",
    logoBg: "#374151",
    rate: 8.50,
    recommended: false,
    maxLoan: 500000,
    cibilRequired: 700,
    approvalMin: 3,
    processingFee: 0.5,
    features: [
      "Up to ₹5L loan amount",
      "3–5 days approval (fastest)",
      "0.5% processing fee",
      "CIBIL 700+ required",
      "Tenure up to 7 years",
    ],
    bestFor: "Buyers who need fastest approval",
  },
  {
    id: "union",
    name: "Union Bank of India",
    abbr: "UBI",
    logoBg: "#7C3AED",
    rate: 7.90,
    recommended: false,
    maxLoan: 600000,
    cibilRequired: 650,
    approvalMin: 5,
    processingFee: 0.1,
    features: [
      "Up to ₹6L loan amount",
      "5–7 days approval",
      "₹500 flat processing fee",
      "CIBIL 650+ required",
      "Tenure up to 10 years",
    ],
    bestFor: "5kW–10kW systems needing larger loans",
  },
  {
    id: "canara",
    name: "Canara Bank",
    abbr: "CAN",
    logoBg: "#065F46",
    rate: 8.25,
    recommended: false,
    maxLoan: 600000,
    cibilRequired: 650,
    approvalMin: 7,
    processingFee: 0.25,
    features: [
      "Up to ₹6L loan amount",
      "7–10 days approval",
      "0.25% processing fee",
      "CIBIL 650+ required",
      "Tenure up to 7 years",
    ],
    bestFor: "Buyers prioritising lower upfront costs",
  },
  {
    id: "kgb",
    name: "Kerala Gramin Bank",
    abbr: "KGB",
    logoBg: "#B45309",
    rate: 8.80,
    recommended: false,
    maxLoan: 400000,
    cibilRequired: 0,
    approvalMin: 5,
    processingFee: 0.5,
    features: [
      "Up to ₹4L loan amount",
      "5–7 days approval",
      "0.50% processing fee",
      "Local branch support",
      "Tenure up to 7 years",
    ],
    bestFor: "Wayanad, Idukki, Pathanamthitta, Kasaragod",
  },
  {
    id: "hdfc",
    name: "HDFC Bank",
    abbr: "HDFC",
    logoBg: "#DC2626",
    rate: 9.40,
    recommended: false,
    maxLoan: 500000,
    cibilRequired: 750,
    approvalMin: 3,
    processingFee: 1,
    features: [
      "Up to ₹5L loan amount",
      "3–5 days approval",
      "1% processing fee",
      "CIBIL 750+ required",
      "Tenure up to 5 years",
    ],
    bestFor: "Private sector, NRIs, high CIBIL buyers",
  },
];

// ─── filter dropdown ────────────────────────────────────────────────────────────
function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  options: { label: string; value: string | number }[];
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-[#757575]">{label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-white border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm text-[#111827] pr-8 focus:outline-none focus:ring-2 focus:ring-[#074A4D] cursor-pointer"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none"
        />
      </div>
    </div>
  );
}

// ─── bank card ──────────────────────────────────────────────────────────────────
function BankCard({ bank }: { bank: (typeof BANKS)[0] }) {
  return (
    <div
      className="relative flex flex-col rounded-2xl overflow-visible bg-white transition-shadow hover:shadow-md border border-[#074A4D]"
    >
      {/* Recommended badge */}
      {bank.recommended && (
        <span className="absolute -top-3 right-4 bg-[#F7BA41] text-[#123532] text-[11px] font-medium px-4 py-2  rounded-full whitespace-nowrap">
          Flarize Recommended
        </span>
      )}

      {/* Card body */}
      <div className="flex-1 p-4 sm:p-5">
        {/* Header: logo + name + rate */}
        <div className="flex items-start gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white text-[10px] font-extrabold tracking-tight"
            style={{ background: bank.logoBg }}
          >
            {bank.abbr}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-[#111827] leading-tight">
              {bank.name}
            </p>
            <p
              className="text-sm leading-tight mt-0.5 text-[#F88A22]"
            >
              {bank.rate.toFixed(2)}% p.a.
            </p>
          </div>
        </div>

        {/* Features */}
        <ul className="space-y-1.5">
          {bank.features.map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-[#444444]">
              <Check size={13} className="shrink-0 mt-0.5" />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        {/* Best-for footer */}
      <div className="bg-[#16A34A1A] rounded-lg mt-2 px-4 py-2.5">
        <div className="flex items-start gap-1.5">
          <Check size={12} className="text-[#15803D] shrink-0 mt-0.5" />
          <span className="text-xs text-[#15803D]">
            Best for: {bank.bestFor}
          </span>
        </div>
      </div>
      </div>
    </div>
  );
}

// ─── main component ─────────────────────────────────────────────────────────────
export default function BankRates() {
  const [loanFilter,  setLoanFilter]  = useState(200000);
  const [cibilFilter, setCibilFilter] = useState(690);
  const [priority,    setPriority]    = useState("speed");

  const filtered = useMemo(() => {
    let result = BANKS.filter(
      (b) => b.maxLoan >= loanFilter && b.cibilRequired <= cibilFilter
    );

    if (priority === "rate")   result = [...result].sort((a, b) => a.rate - b.rate);
    if (priority === "speed")  result = [...result].sort((a, b) => a.approvalMin - b.approvalMin);
    if (priority === "fee")    result = [...result].sort((a, b) => a.processingFee - b.processingFee);
    if (priority === "amount") result = [...result].sort((a, b) => b.maxLoan - a.maxLoan);

    // Recommended always floats to top
    return result.sort((a, b) => (b.recommended ? 1 : 0) - (a.recommended ? 1 : 0));
  }, [loanFilter, cibilFilter, priority]);

  return (
    <section
      id="bank-rates"
      className="scroll-mt-15 relative z-10 container mx-auto px-4 py-10 pb-6 md:py-20 xl:py-16 max-w-7xl flex flex-col items-center gap-8"
    >
      {/* Heading */}
      <div className="w-full text-center">
        <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-[#123532] mb-4">
          Solar Loan Rates From Top Kerala Banks
        </h2>
        <p className="text-sm md:text-xl font-normal leading-relaxed text-[#4B5563]">
          Not all solar loans are equal. Compare before you decide.
        </p>
      </div>

      {/* Filters */}
      <div className="w-full bg-[#F3F4F6] border border-[#E5E7EB] rounded-2xl p-4 sm:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <FilterSelect
            label="Loan amount you need"
            value={loanFilter}
            onChange={(v) => setLoanFilter(Number(v))}
            options={LOAN_OPTIONS}
          />
          <FilterSelect
            label="Your CIBIL score range"
            value={cibilFilter}
            onChange={(v) => setCibilFilter(Number(v))}
            options={CIBIL_OPTIONS}
          />
          <FilterSelect
            label="What matters most?"
            value={priority}
            onChange={(v) => setPriority(v)}
            options={PRIORITY_OPTIONS}
          />
        </div>
      </div>

      {/* Bank cards grid */}
      {filtered.length > 0 ? (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filtered.map((bank) => (
            <BankCard key={bank.id} bank={bank} />
          ))}
        </div>
      ) : (
        <div className="w-full text-center py-12 text-[#6B7280] text-sm">
          No banks match your current filters. Try adjusting your CIBIL range or loan amount.
        </div>
      )}

      {/* CTA */}
      <LinkingButton
        content="Get Matched to the Best Bank for My Profile"
        ButtonLink="#footer"
        ButtonBg="bg-[#F7BA41]"
        Buttontext="text-[#272218]"
        ButtonHover="hover:bg-yellow-500"
        className="!whitespace-normal text-center text-sm sm:text-base px-8"
      />
    </section>
  );
}
