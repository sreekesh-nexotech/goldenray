"use client";

// src/components/EmiCalculator/BankRates.tsx
//
// The bank comparison table. Rows come from the EMI calculator config API and
// are managed in the Content Studio (/studio/emi-calculator → Bank Comparison),
// so adding a lender or changing a rate needs no code change.

import React, { useEffect, useMemo, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import LinkingButton from "../ui/LinkingButton";
import { getEMIConfig, type EMIBank } from "@/services/emiCalculator";

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

/* -------------------------------------------------------------------------- */
/*  Derived display helpers                                                    */
/* -------------------------------------------------------------------------- */

/** Cards fall back to generated bullets when the admin left `features` empty. */
function bulletsFor(bank: EMIBank): string[] {
  if (bank.features.length) return bank.features;

  const lines: string[] = [];
  if (Number(bank.max_loan) > 0) {
    lines.push(`Up to ₹${(Number(bank.max_loan) / 100000).toFixed(0)}L loan amount`);
  }
  if (bank.approval_max_days) {
    const range =
      bank.approval_min_days && bank.approval_min_days !== bank.approval_max_days
        ? `${bank.approval_min_days}–${bank.approval_max_days}`
        : `${bank.approval_max_days}`;
    lines.push(`${range} days approval`);
  }
  lines.push(feeLabel(bank));
  if (bank.cibil_required) lines.push(`CIBIL ${bank.cibil_required}+ required`);
  if (bank.max_tenure_years) lines.push(`Tenure up to ${bank.max_tenure_years} years`);
  if (bank.upfront_requirement) lines.push(bank.upfront_requirement);
  if (bank.eligibility) lines.push(bank.eligibility);
  return lines;
}

function feeLabel(bank: EMIBank): string {
  if (bank.processing_fee_note) return `${bank.processing_fee_note} processing fee`;
  const pctFee = Number(bank.processing_fee_percent);
  return pctFee > 0 ? `${pctFee}% processing fee` : "Zero processing fee";
}

// ─── bank card ──────────────────────────────────────────────────────────────────
function BankCard({ bank }: { bank: EMIBank }) {
  return (
    <div
      className="relative flex flex-col rounded-2xl overflow-visible bg-white transition-shadow hover:shadow-md border border-[#074A4D]"
    >
      {/* Recommended badge */}
      {bank.is_recommended && (
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
            style={{ background: bank.logo_bg }}
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
              {Number(bank.interest_rate).toFixed(2)}% p.a.
            </p>
          </div>
        </div>

        {/* Features */}
        <ul className="space-y-1.5">
          {bulletsFor(bank).map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-[#444444]">
              <Check size={13} className="shrink-0 mt-0.5" />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        {/* Best-for footer */}
      {bank.best_for && (
        <div className="bg-[#16A34A1A] rounded-lg mt-2 px-4 py-2.5">
          <div className="flex items-start gap-1.5">
            <Check size={12} className="text-[#15803D] shrink-0 mt-0.5" />
            <span className="text-xs text-[#15803D]">
              Best for: {bank.best_for}
            </span>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

// ─── main component ─────────────────────────────────────────────────────────────
export default function BankRates() {
  const [banks, setBanks] = useState<EMIBank[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [loanFilter,  setLoanFilter]  = useState(200000);
  const [cibilFilter, setCibilFilter] = useState(690);
  const [priority,    setPriority]    = useState("speed");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const cfg = await getEMIConfig();
        if (!cancelled) setBanks(cfg.banks);
      } catch (err) {
        if (cancelled) return;
        console.error("Failed to load bank comparison data:", err);
        setLoadError("Could not load bank rates. Please refresh.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    let result = banks.filter(
      (b) => Number(b.max_loan) >= loanFilter && b.cibil_required <= cibilFilter
    );

    if (priority === "rate")
      result = [...result].sort((a, b) => Number(a.interest_rate) - Number(b.interest_rate));
    if (priority === "speed")
      result = [...result].sort((a, b) => a.approval_min_days - b.approval_min_days);
    if (priority === "fee")
      result = [...result].sort(
        (a, b) => Number(a.processing_fee_percent) - Number(b.processing_fee_percent)
      );
    if (priority === "amount")
      result = [...result].sort((a, b) => Number(b.max_loan) - Number(a.max_loan));

    // Recommended always floats to top
    return result.sort((a, b) => (b.is_recommended ? 1 : 0) - (a.is_recommended ? 1 : 0));
  }, [banks, loanFilter, cibilFilter, priority]);

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
      {loading ? (
        <div className="w-full text-center py-12 text-[#6B7280] text-sm animate-pulse">
          Loading bank rates…
        </div>
      ) : loadError ? (
        <div className="w-full text-center py-12 text-[#DC2626] text-sm">{loadError}</div>
      ) : filtered.length > 0 ? (
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
