"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp,  Minus, Plus, Clock, PiggyBank,  Zap,  Award, ArrowRight, Check } from "lucide-react";
import LinkingButton from "../ui/LinkingButton";
import { calculateEMI, EMICalculatorResponse } from "@/services/emiCalculator";

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
  const [apiData, setApiData] = useState<EMICalculatorResponse | null>(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const { monthlyBill } = SYSTEM_SIZES[sizeIdx];

  // Fetch EMI calculation from API
  useEffect(() => {
    const fetchEMIData = async () => {
      setApiLoading(true);
      setApiError(null);
      try {
        const systemSize = SYSTEM_SIZES[sizeIdx];
        const response = await calculateEMI({
          power_capacity: parseFloat(systemSize.label.replace('kW', '')),
          property_type: 'Residential',
          tenure_years: tenure,
          interest_rate: rate,
          principal: loanAmount,
          apply_subsidy: subsidyOn,
        });
        setApiData(response);
      } catch (error) {
        console.error('Failed to fetch EMI calculation:', error);
        setApiError(error instanceof Error ? error.message : 'Failed to calculate EMI');
      } finally {
        setApiLoading(false);
      }
    };

    fetchEMIData();
  }, [sizeIdx, loanAmount, rate, tenure, subsidyOn]);

  const emi = apiData?.emi_per_month ?? 0;
  const totalPaid = apiData?.total_payment ?? 0;
  const totalInterest = apiData?.total_interest ?? 0;

  const breakEvenMonths = monthlyBill > 0 ? loanAmount / monthlyBill : null;
  const breakEvenYears = breakEvenMonths ? (breakEvenMonths / 12).toFixed(1) : null;
  const remainingYears = breakEvenMonths
    ? Math.max(0, PANEL_LIFE - breakEvenMonths / 12)
    : PANEL_LIFE;
  const savingsAfterBreakEven = monthlyBill * 12 * Math.round(remainingYears);

  const monthlySavings = monthlyBill - emi;

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
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">

        {/* ── LEFT: Your Requirements ── */}
        <div className="bg-white border border-[#F3F4F6] rounded-xl p-5 sm:p-7 flex flex-col gap-5 h-full">
          <h3 className="text-base sm:text-lg md:text-2xl font-semibold text-[#074A4D]">Your Requirements</h3>

          {/* System Size */}
          <div>
            <p className="text-[11px] sm:text-sm font-semibold text-[#444444]  tracking-wide mb-3">
              System Size
            </p>
            <div className="grid grid-cols-4 gap-4">
              {SYSTEM_SIZES.map((s, i) => (
                <button
                  key={s.label}
                  onClick={() => handleSizeChange(i)}
                  className={`flex flex-col items-center py-2 px-1 rounded-lg border-2 transition-all ${
                    sizeIdx === i
                      ? "border-[#F7BA41]"
                      : "border-[#E5E7EB] hover:border-[#F7BA41]/60"
                  }`}
                >
                  <span
                    className={`text-sm sm:text-xl font-bold ${sizeIdx === i ? "text-[#F7BA41]" : "text-[#111827]"}`}
                  >
                    {s.label}
                  </span>
                  <span
                    className={`text-[9px] sm:text-sm  ${sizeIdx === i ? "text-[#F7BA41]" : "text-[#111827]"}`}
                  >
                    {fmtPrice(s.displayPrice)}
                  </span>
                </button>
              ))}
            </div>
          </div>


          {/* Loan Amount */}
          <div className="flex flex-col gap-2">
            <p className="text-[11px] sm:text-sm font-semibold text-[#444444]">Loan Amount</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  setLoanAmount((v) => Math.max(LOAN_MIN, v - 5000))
                }
                className="cursor-pointer"
              >
                <Minus size={16} className="text-black" />
              </button>
              <span className="flex-1 text-center text-base sm:text-xl md:text-2xl font-bold text-[#123532]">
                ₹{fmt(loanAmount)}
              </span>
              <button
                onClick={() =>
                  setLoanAmount((v) => Math.min(LOAN_MAX, v + 5000))
                }
                className="cursor-pointer"
              >
                <Plus size={16} className="text-black" />
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
            <div className="flex justify-between text-[11px] sm:text-sm text-[#6B7280]">
              <span>₹50k</span>
              <span>₹6L</span>
            </div>
          </div>

          <hr className="border-[#F3F4F6]" />

          {/* Interest Rate */}
          <div className="flex flex-col gap-2">
            <p className="text-[11px] sm:text-sm font-semibold text-[#444444]">Interest Rate</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  setRate((v) =>
                    Math.max(RATE_MIN, Math.round((v - 0.25) * 100) / 100)
                  )
                }
                className="cursor-pointer"
              >
                  <Minus size={16} className="text-black" />
              </button>
              <span className="flex-1 text-center text-base sm:text-xl md:text-2xl font-bold text-[#123532]">
                {rate.toFixed(2)}%
              </span>
              <button
                onClick={() =>
                  setRate((v) =>
                    Math.min(RATE_MAX, Math.round((v + 0.25) * 100) / 100)
                  )
                }
                className="cursor-pointer"
              >
                <Plus size={16} className="text-black" />
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
            <div className="flex justify-between text-[11px] sm:text-sm text-[#6B7280]">
              <span>{RATE_MIN}%</span>
              <span>{RATE_MAX}%</span>
            </div>
            <span className="flex-1 text-start text-[9px] sm:text-xs text-[#444444]">
                Most Kerala banks offer 7–9%
              </span>
          </div>

          <hr className="border-[#F3F4F6]" />

          {/* Loan Tenure */}
          <div className="flex flex-col gap-2">
            <p className="text-[11px] sm:text-sm font-semibold text-[#444444]">Loan Tenure</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setTenure((v) => Math.max(TENURE_MIN, v - 1))}
                className="cursor-pointer"
              >
                <Minus size={16} className="text-black" />
              </button>
              <span className="flex-1 text-center text-base sm:text-xl md:text-2xl font-bold text-[#123532]">
                {tenure} {tenure === 1 ? "Year" : "Years"}
              </span>
              <button
                onClick={() => setTenure((v) => Math.min(TENURE_MAX, v + 1))}
                className="cursor-pointer"
              >
                <Plus size={16} className="text-black" />
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
            <div className="flex justify-between text-[11px] sm:text-sm text-[#6B7280]">
              <span>1 Year</span>
              <span>{TENURE_MAX} Years</span>
            </div>
            <span className="flex-1 text-start text-[9px] sm:text-xs text-[#444444]">
                Longer Tenure = lower EMI
              </span>
          </div>

          {/* Subsidy Toggle */}
          <div className="bg-[#F3F4F6] border border-[#F3F4F6] rounded-2xl p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-[#111827]">
                  Apply PM Surya Ghar Subsidy
                </span>
                <span
                  className={`text-[9px] sm:text-xs transition-colors ${subsidyOn ? "font-bold text-[#F7BA41]" : "text-[#374151]"}`}
                >
                  {subsidyOn
                    ? `₹${fmt(SUBSIDY)} `
                    : "Subsidy not applied "} 
                    <span className="font-normal text-[#374151]">{subsidyOn ? "subsidy applied" : " "}</span>
                </span>
                <span className="text-xs text-[#4B5563]">
                  Subsidy saves up to ₹{fmt(SUBSIDY)}
                </span>
              </div>
              <button
                onClick={handleSubsidyToggle}
                className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none shrink-0 mt-0.5 ${
                  subsidyOn ? "bg-[#F7BA41]" : "bg-[#757575]"
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
       <div className="flex flex-col gap-5 pt-5 sm:pt-7 h-full">
            <h3 className="text-base sm:text-lg md:text-2xl font-semibold text-[#074A4D]">Your Results</h3>
          {/* Monthly EMI */}
          <div className="bg-[#074A4D] rounded-xl p-5 sm:p-6 text-white">
            {/* Top row: label + optional subsidy badge */}
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">Your Monthly EMI</p>
                {apiLoading && (
                  <span className="text-xs text-[#ADD6D8] animate-pulse">Calculating...</span>
                )}
              </div>
              {subsidyOn && (
                <span className="flex items-center gap-1 bg-[#16A34A] text-white text-xs font-medium p-2 rounded-full whitespace-nowrap shrink-0">
                  <Check size={12} />
                  PM Surya Ghar Subsidy Applied
                </span>
              )}
            </div>
            {apiError && (
              <p className="text-xs text-[#FCA5A5] mb-2">Note: Using estimated calculation</p>
            )}

            <div className="flex items-baseline gap-2 mb-0.5">
              <span className="text-4xl sm:text-5xl font-semibold text-[#F7BA41]">
                ₹{fmt(emi)}
              </span>
            </div>
            <p className="text-xs mb-4">
              {tenure} {tenure === 1 ? "year" : "years"} · {rate.toFixed(2)}% interest
            </p>

            <div className=" pt-4 space-y-2">
              <div className="flex justify-between items-center text-sm font-semibold">
                <span>{subsidyOn ? "Your Loan amount after subsidy" : "Your Loan amount"}</span>
                <span className="flex items-center gap-1.5">
                  {subsidyOn && (
                    <span className="text-xs text-[#A7C4C5] line-through font-normal">
                      ₹{fmt(loanAmount + SUBSIDY)}
                    </span>
                  )}
                  <span className="text-base">₹{fmt(loanAmount)}</span>
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium">Total Interest</span>
                <span className="font-semibold">₹{fmt(totalInterest)}</span>
              </div>
              <div className="flex justify-between text-sm text-[#E5E7EB]">
                <span className="font-medium">Total you pay</span>
                <span className="font-semibold">₹{fmt(totalPaid)}</span>
              </div>
            </div>
          </div>

          {/* When you are in profit */}
          <div className="bg-white border border-[#F3F4F6] rounded-2xl p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-[#074A4D]" />
              <p className="text-base sm:text-xl font-semibold text-[#074A4D]">
                When you are in profit
              </p>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-[#123532]" />
                  <span className="text-sm text-[#123532]">
                    You start making money at
                  </span>
                </div>
                <span className="text-base font-bold text-[#123532]">
                  {breakEvenYears ? `${breakEvenYears} years` : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PiggyBank size={14} className="text-[#123532]" />
                  <span className="text-sm text-[#123532]">
                    What you save over {Math.round(remainingYears)} years
                  </span>
                </div>
                <span className="text-lg font-bold text-[#F7BA41]">
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
            <div className="flex justify-between text-xs text-[#444444]">
              <span>Loan Paid</span>
              <span className="font-semibold">Profit</span>
            </div>
          </div>

          {/* EMI vs Electricity Bill */}
          <div className="bg-white">
            <p className="text-xl font-semibold text-[#074A4D] mb-4">
              EMI vs Electricity Bill
            </p>
            <div className="space-y-3 mb-3">
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-[#123532]">Solar EMI</span>
                  <span className="font-bold text-[#38C76C]">
                    ₹{fmt(emi)}
                  </span>
                </div>
                <div className="w-full h-4 bg-[#F3F4F6] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#074A4D] rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (emi / maxBar) * 100)}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-[#123532]">Electricity Bill</span>
                  <span className="font-bold text-[#DC2626]">
                    ₹{fmt(monthlyBill)}
                  </span>
                </div>
                <div className="w-full h-4 bg-[#F3F4F6] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#074A4D] rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (monthlyBill / maxBar) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
            <div className={`flex mt-4 items-center gap-1.5 text-xs ${monthlySavings > 0 ? "bg-[#16A34A1A]" : "bg-[#F59E0B1A]"} rounded-full px-3 py-2 w-max`}>
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
        <div className="w-full bg-[#ADD6D880] border border-[#ADD6D8] rounded-2xl p-5 flex flex-col items-start gap-4 ">
            <Zap size={30} className="text-[#ADD6D8]" fill="#ADD6D8" />
            <div className="flex flex-col items-start">
              <span className="text-sm text-[#074A4D]">
                  Estimated Monthly Savings
              </span>
              <span
                  className="text-3xl font-bold text-[#074A4D]"
              >
                  {monthlySavings >= 0 ? "+" : "-"}₹{fmt(monthlySavings)}/mo
              </span>
            </div>
        </div>

                  {/* Best Match For You */}
          <div className="flex-1 bg-[#FBF1BD80] border border-[#FBF1BD80] rounded-2xl p-4 sm:p-5 flex flex-col items-start gap-3">
            <div className="flex items-center">
              <Award size={24} className="text-[#123532]" />
              <p className="text-sm text-[#123532] font-medium uppercase tracking-wide mb-0.5">
                Best Match For You
              </p>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xl font-bold text-[#123532]">
                State Bank of India
              </p>
              <p className="text-sm text-[#123532] mt-0.5">
                {rate.toFixed(2)}% Interest · Approval in 5–7 days
              </p>
              <button className="cursor-pointer mt-1.5 flex items-center gap-0.5 text-sm font-semibold text-[#F88A22] hover:underline">
                See All Bank Options <ArrowRight size={14} />
              </button>
            </div>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl items-center justify-center">
            <LinkingButton
                content="Compare Bank Rates"
                ButtonLink="#bank-rates"
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
          cursor: pointer;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
        }
        .calc-slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 9999px;
          background: #f7ba41;
          cursor: pointer;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </section>
  );
}
