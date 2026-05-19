"use client";

import React, { useState, useMemo } from "react";
import { TrendingUp, ChevronRight } from "lucide-react";
import LinkingButton from "../ui/LinkingButton";

const SUBSIDY = 78000;
const PANEL_LIFE = 25;

const SYSTEM_SIZES = [
  { label: "3kW", displayPrice: 80000, loanDefault: 107000, monthlyBill: 3000 },
  { label: "7kW", displayPrice: 280000, loanDefault: 280000, monthlyBill: 7000 },
  { label: "5kW", displayPrice: 150000, loanDefault: 150000, monthlyBill: 5000 },
  { label: "10kW", displayPrice: 500000, loanDefault: 422000, monthlyBill: 10000 },
];

const LOAN_MIN = 50000;
const LOAN_MAX = 600000;
const RATE_MIN = 5.65;
const RATE_MAX = 18;
const TENURE_MIN = 1;
const TENURE_MAX = 10;

function calcEMI(principal: number, annualRate: number, tenureYears: number) {
  if (principal <= 0 || tenureYears <= 0) return 0;
  const r = annualRate / 100 / 12;
  const n = tenureYears * 12;
  if (r === 0) return principal / n;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

function fmt(n: number) {
  return Math.round(Math.abs(n)).toLocaleString("en-IN");
}

function pct(val: number, min: number, max: number) {
  return Math.min(100, Math.max(0, ((val - min) / (max - min)) * 100));
}

function fmtPrice(p: number) {
  if (p >= 100000) return `₹${(p / 100000).toFixed(p % 100000 === 0 ? 0 : 1)}L`;
  return `₹${p / 1000}k`;
}

export default function Calculator() {
  const [sizeIdx, setSizeIdx] = useState(0);
  const [loanAmount, setLoanAmount] = useState(107000);
  const [rate, setRate] = useState(7);
  const [tenure, setTenure] = useState(5);
  const [subsidyOn, setSubsidyOn] = useState(true);

  const { monthlyBill } = SYSTEM_SIZES[sizeIdx];

  const emi = useMemo(() => calcEMI(loanAmount, rate, tenure), [loanAmount, rate, tenure]);
  const totalPaid = emi * tenure * 12;
  const totalInterest = Math.max(0, totalPaid - loanAmount);

  const breakEvenMonths = monthlyBill > 0 ? loanAmount / monthlyBill : null;
  const breakEvenYears = breakEvenMonths ? (breakEvenMonths / 12).toFixed(1) : null;
  const remainingYears = breakEvenMonths
    ? Math.max(0, PANEL_LIFE - breakEvenMonths / 12)
    : PANEL_LIFE;
  const savingsAfterBreakEven = monthlyBill * 12 * Math.round(remainingYears);

  const monthlySavings = monthlyBill - emi;
  const sbiEmi = useMemo(() => calcEMI(loanAmount, 5.65, tenure), [loanAmount, tenure]);

  const maxBar = Math.max(emi, monthlyBill) * 1.05;

  function handleSizeChange(i: number) {
    setSizeIdx(i);
    const base = SYSTEM_SIZES[i].loanDefault;
    setLoanAmount(subsidyOn ? base : Math.min(LOAN_MAX, base + SUBSIDY));
  }

  function handleSubsidyToggle() {
    setSubsidyOn((prev) => {
      if (!prev) {
        setLoanAmount((a) => Math.max(LOAN_MIN, a - SUBSIDY));
      } else {
        setLoanAmount((a) => Math.min(LOAN_MAX, a + SUBSIDY));
      }
      return !prev;
    });
  }

  return (
    <section
      id="calculator"
      className="scroll-mt-15 relative z-10 container mx-auto px-4 py-10 pb-6 md:py-20 xl:py-16 max-w-7xl flex flex-col items-center gap-8"
    >
      {/* Heading */}
      <div className="w-full text-center">
        <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-[#123532] mb-4">
          Calculate Your Exact Solar EMI
        </h2>
        <p className="text-sm md:text-xl font-normal leading-relaxed text-[#4B5563]">
          Adjust system size, tenure, and rate. Toggle the PM Surya Ghar
          subsidy to see how ₹78,000 government support reduces your EMI from
          day one.
        </p>
      </div>

      {/* Two-column grid */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

        {/* ── LEFT: Your Requirements ── */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 sm:p-7 flex flex-col gap-5">
          <h3 className="text-xl font-bold text-[#111827]">Your Requirements</h3>

          {/* System Size */}
          <div>
            <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-3">
              System Size
            </p>
            <div className="grid grid-cols-4 gap-2">
              {SYSTEM_SIZES.map((s, i) => (
                <button
                  key={s.label}
                  onClick={() => handleSizeChange(i)}
                  className={`flex flex-col items-center py-2 px-1 rounded-xl border-2 transition-all ${
                    sizeIdx === i
                      ? "border-[#F7BA41] bg-[#FFFBEB]"
                      : "border-[#E5E7EB] bg-white hover:border-[#F7BA41]/60"
                  }`}
                >
                  <span
                    className={`text-sm font-bold ${sizeIdx === i ? "text-[#92400E]" : "text-[#374151]"}`}
                  >
                    {s.label}
                  </span>
                  <span
                    className={`text-[10px] font-medium ${sizeIdx === i ? "text-[#B45309]" : "text-[#6B7280]"}`}
                  >
                    {fmtPrice(s.displayPrice)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <hr className="border-[#F3F4F6]" />

          {/* Loan Amount */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-[#374151]">Loan Amount</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  setLoanAmount((v) => Math.max(LOAN_MIN, v - 5000))
                }
                className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full border border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6] font-bold transition"
              >
                —
              </button>
              <span className="flex-1 text-center text-base font-bold text-[#111827]">
                ₹{fmt(loanAmount)}
              </span>
              <button
                onClick={() =>
                  setLoanAmount((v) => Math.min(LOAN_MAX, v + 5000))
                }
                className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full border border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6] font-bold transition"
              >
                +
              </button>
            </div>
            <input
              type="range"
              className="calc-slider w-full"
              min={LOAN_MIN}
              max={LOAN_MAX}
              step={5000}
              value={loanAmount}
              style={
                {
                  "--progress": `${pct(loanAmount, LOAN_MIN, LOAN_MAX)}%`,
                } as React.CSSProperties
              }
              onChange={(e) => setLoanAmount(Number(e.target.value))}
            />
            <div className="flex justify-between text-xs text-[#9CA3AF]">
              <span>₹50k</span>
              <span>₹6L</span>
            </div>
          </div>

          <hr className="border-[#F3F4F6]" />

          {/* Interest Rate */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-[#374151]">Interest Rate</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  setRate((v) =>
                    Math.max(RATE_MIN, Math.round((v - 0.25) * 100) / 100)
                  )
                }
                className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full border border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6] font-bold transition"
              >
                —
              </button>
              <span className="flex-1 text-center text-base font-bold text-[#111827]">
                {rate.toFixed(2)}%
              </span>
              <button
                onClick={() =>
                  setRate((v) =>
                    Math.min(RATE_MAX, Math.round((v + 0.25) * 100) / 100)
                  )
                }
                className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full border border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6] font-bold transition"
              >
                +
              </button>
            </div>
            <input
              type="range"
              className="calc-slider w-full"
              min={RATE_MIN}
              max={RATE_MAX}
              step={0.25}
              value={rate}
              style={
                {
                  "--progress": `${pct(rate, RATE_MIN, RATE_MAX)}%`,
                } as React.CSSProperties
              }
              onChange={(e) => setRate(Number(e.target.value))}
            />
            <div className="flex justify-between text-xs text-[#9CA3AF]">
              <span>{RATE_MIN}%</span>
              <span className="flex-1 text-center italic text-[#6B7280]">
                best Kerala banks offer 7–9%
              </span>
              <span>{RATE_MAX}%</span>
            </div>
          </div>

          <hr className="border-[#F3F4F6]" />

          {/* Loan Tenure */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-[#374151]">Loan Tenure</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setTenure((v) => Math.max(TENURE_MIN, v - 1))}
                className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full border border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6] font-bold transition"
              >
                —
              </button>
              <span className="flex-1 text-center text-base font-bold text-[#111827]">
                {tenure} {tenure === 1 ? "Year" : "Years"}
              </span>
              <button
                onClick={() => setTenure((v) => Math.min(TENURE_MAX, v + 1))}
                className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full border border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6] font-bold transition"
              >
                +
              </button>
            </div>
            <input
              type="range"
              className="calc-slider w-full"
              min={TENURE_MIN}
              max={TENURE_MAX}
              step={1}
              value={tenure}
              style={
                {
                  "--progress": `${pct(tenure, TENURE_MIN, TENURE_MAX)}%`,
                } as React.CSSProperties
              }
              onChange={(e) => setTenure(Number(e.target.value))}
            />
            <div className="flex justify-between text-xs text-[#9CA3AF]">
              <span>1 Year</span>
              <span className="flex-1 text-center italic text-[#6B7280]">
                Longer Tenure = lower EMI
              </span>
              <span>{TENURE_MAX} Years</span>
            </div>
          </div>

          <hr className="border-[#F3F4F6]" />

          {/* Subsidy Toggle */}
          <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-[#1D4ED8]">
                  Apply PM Surya Ghar Subsidy
                </span>
                <span
                  className={`text-xs font-medium transition-colors ${subsidyOn ? "text-[#16A34A]" : "text-[#9CA3AF]"}`}
                >
                  {subsidyOn
                    ? `₹${fmt(SUBSIDY)} subsidy applied`
                    : "Subsidy not applied"}
                </span>
                <span className="text-xs text-[#6B7280]">
                  Subsidy saves up to ₹{fmt(SUBSIDY)}
                </span>
              </div>
              <button
                onClick={handleSubsidyToggle}
                className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none shrink-0 mt-0.5 ${
                  subsidyOn ? "bg-[#16A34A]" : "bg-[#D1D5DB]"
                }`}
                aria-label="Toggle PM Surya Ghar subsidy"
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${
                    subsidyOn ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Your Results ── */}
        <div className="flex flex-col gap-4">

          {/* Monthly EMI */}
          <div className="bg-[#074A4D] rounded-2xl p-5 sm:p-6 text-white">
            <p className="text-sm text-[#A7C4C5] mb-1">Your Monthly EMI</p>
            <div className="flex items-baseline gap-2 mb-0.5">
              <span className="text-4xl sm:text-5xl font-bold">
                ₹{fmt(emi)}
              </span>
            </div>
            <p className="text-xs text-[#A7C4C5] mb-4">
              {tenure} {tenure === 1 ? "year" : "years"} · {rate.toFixed(2)}%
              interest
            </p>
            <div className="border-t border-[#0D6B6F] pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#A7C4C5]">Your Loan amount</span>
                <span className="font-semibold">₹{fmt(loanAmount)} Total</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#A7C4C5]">Total Interest</span>
                <span className="font-semibold">₹{fmt(totalInterest)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#A7C4C5]">Total you pay</span>
                <span className="font-semibold">₹{fmt(totalPaid)}</span>
              </div>
            </div>
          </div>

          {/* When you are in profit */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-[#374151]" />
              <p className="text-sm font-semibold text-[#374151]">
                When you are in profit
              </p>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D1D5DB] shrink-0" />
                  <span className="text-xs text-[#374151]">
                    You start making money at
                  </span>
                </div>
                <span className="text-xs font-bold text-[#111827]">
                  {breakEvenYears ? `${breakEvenYears} years` : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D1D5DB] shrink-0" />
                  <span className="text-xs text-[#374151]">
                    What you save over {Math.round(remainingYears)} years
                  </span>
                </div>
                <span className="text-xs font-bold text-[#F59E0B]">
                  ₹{fmt(savingsAfterBreakEven)}
                </span>
              </div>
            </div>
            <div className="w-full h-3 bg-[#F3F4F6] rounded-full overflow-hidden mb-2">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, ((breakEvenMonths ?? 0) / (PANEL_LIFE * 12)) * 100)}%`,
                  background: "linear-gradient(to right, #F59E0B, #16A34A)",
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-[#9CA3AF]">
              <span>Loan Paid</span>
              <span>Profit</span>
            </div>
          </div>

          {/* EMI vs Electricity Bill */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 sm:p-6">
            <p className="text-sm font-semibold text-[#374151] mb-4">
              EMI vs Electricity Bill
            </p>
            <div className="space-y-3 mb-3">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[#374151]">Solar EMI</span>
                  <span className="font-semibold text-[#16A34A]">
                    ₹{fmt(emi)}
                  </span>
                </div>
                <div className="w-full h-4 bg-[#F3F4F6] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#16A34A] rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (emi / maxBar) * 100)}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[#374151]">Electricity Bill</span>
                  <span className="font-semibold text-[#F59E0B]">
                    ₹{fmt(monthlyBill)}
                  </span>
                </div>
                <div className="w-full h-4 bg-[#F3F4F6] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#F59E0B] rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (monthlyBill / maxBar) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${monthlySavings > 0 ? "bg-[#16A34A]" : "bg-[#F59E0B]"}`}
              />
              <span
                className={monthlySavings > 0 ? "text-[#16A34A]" : "text-[#F59E0B]"}
              >
                {monthlySavings > 0
                  ? "You start saving immediately!"
                  : "Reduce rate or extend tenure to save vs bill"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        <div className="w-full bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl px-5 py-4 flex flex-col sm:flex-row items-center gap-4 sm:justify-between">
            <div className="flex flex-col items-center sm:items-start">
            <span className="text-xs text-[#6B7280]">
                Estimated Monthly Savings
            </span>
            <span
                className={`text-2xl font-bold ${monthlySavings >= 0 ? "text-[#16A34A]" : "text-[#F59E0B]"}`}
            >
                {monthlySavings >= 0 ? "+" : "-"}₹{fmt(monthlySavings)}/mo
            </span>
            </div>
        </div>

                  {/* Best Match For You */}
          <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-2xl p-4 sm:p-5 flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-[#FEF3C7] flex items-center justify-center shrink-0 mt-0.5 text-lg">
              🏦
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-[#92400E] font-semibold uppercase tracking-wide mb-0.5">
                Best Match For You
              </p>
              <p className="text-sm font-bold text-[#111827]">
                State Bank of India
              </p>
              <p className="text-xs text-[#6B7280] mt-0.5">
                {rate <= 5.65
                  ? `5.65% Interest · Approval in 5–7 days`
                  : `Switch to SBI 5.65% — save ₹${fmt(emi - sbiEmi)}/mo`}
              </p>
              <button className="mt-1.5 flex items-center gap-0.5 text-xs font-semibold text-[#F59E0B] hover:underline">
                See All Bank Options <ChevronRight size={12} />
              </button>
            </div>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl items-center justify-center">
            <LinkingButton
                content="Compare Bank Rates"
                ButtonLink="#"
                ButtonBorder="border border-[#074A4D]"
                ButtonBg="bg-transparent"
                Buttontext="text-[#074A4D]"
                ButtonHover="hover:bg-[#eeeeee]"
                className="flex-1 sm:flex-none !whitespace-normal sm:!whitespace-nowrap text-center text-xs sm:text-sm"
            />
            <LinkingButton
                content="Book Now"
                ButtonLink="#footer"
                ButtonBg="bg-[#F7BA41]"
                Buttontext="text-[#272218]"
                ButtonHover="hover:bg-yellow-500"
                className="flex-1 sm:flex-none !whitespace-normal sm:!whitespace-nowrap text-center text-xs sm:text-sm"
            />
          </div>

      <style jsx global>{`
        .calc-slider {
          -webkit-appearance: none;
          appearance: none;
          height: 6px;
          border-radius: 9999px;
          background: linear-gradient(
            to right,
            #f7ba41 0%,
            #f7ba41 var(--progress, 50%),
            #e5e7eb var(--progress, 50%),
            #e5e7eb 100%
          );
          outline: none;
          cursor: pointer;
        }
        .calc-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 9999px;
          background: #f7ba41;
          border: 2px solid #074a4d;
          cursor: pointer;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
        }
        .calc-slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 9999px;
          background: #f7ba41;
          border: 2px solid #074a4d;
          cursor: pointer;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </section>
  );
}
