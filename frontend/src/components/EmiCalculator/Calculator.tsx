"use client";

// src/components/EmiCalculator/Calculator.tsx
//
// The public EMI calculator. Every number shown here — system prices, subsidy,
// the 90% loan, interest-rate policy, EMI and the daily amount — is computed by
// the backend from Content Studio settings (/studio/emi-calculator). This
// component holds only the customer's selections; it never does the arithmetic
// itself, which is what used to let the UI and the API disagree.

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TrendingUp, Minus, Plus, Clock, PiggyBank, Zap, Award, ArrowRight, Check } from "lucide-react";
import LinkingButton from "../ui/LinkingButton";
import {
  calculateEMI,
  getEMIConfig,
  type EMIBank,
  type EMICalculatorResponse,
  type EMIConfigResponse,
} from "@/services/emiCalculator";

function fmt(n: number) {
  return Math.round(Math.abs(n)).toLocaleString("en-IN");
}

function pct(val: number, min: number, max: number) {
  if (max <= min) return 0;
  return Math.min(100, Math.max(0, ((val - min) / (max - min)) * 100));
}

function fmtPrice(p: number) {
  if (p >= 100000) return `₹${(p / 100000).toFixed(p % 100000 === 0 ? 0 : 1)}L`;
  return `₹${Math.round(p / 1000)}k`;
}

/** The bank shown as "Best Match" — the flagged one, else the cheapest. */
function bestMatch(banks: EMIBank[]): EMIBank | null {
  if (!banks.length) return null;
  return (
    banks.find((b) => b.is_recommended) ??
    [...banks].sort((a, b) => Number(a.interest_rate) - Number(b.interest_rate))[0]
  );
}

function approvalText(bank: EMIBank): string {
  if (!bank.approval_max_days) return "";
  const range =
    bank.approval_min_days && bank.approval_min_days !== bank.approval_max_days
      ? `${bank.approval_min_days}–${bank.approval_max_days}`
      : `${bank.approval_max_days}`;
  return ` · Approval in ${range} days`;
}

export default function Calculator() {
  const [config, setConfig] = useState<EMIConfigResponse | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);

  // Customer selections. `null` overrides mean "use whatever the backend
  // computes" — that is how the loan resets to 90% when the size or the
  // subsidy toggle changes, instead of being nudged by hand.
  const [sizeId, setSizeId] = useState<number | null>(null);
  const [tenure, setTenure] = useState(5);
  const [subsidyOn, setSubsidyOn] = useState(true);
  const [loanOverride, setLoanOverride] = useState<number | null>(null);
  const [rateOverride, setRateOverride] = useState<number | null>(null);

  const [data, setData] = useState<EMICalculatorResponse | null>(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  /* ---- config: sizes, sliders bounds and the bank list ---- */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const cfg = await getEMIConfig();
        if (cancelled) return;
        setConfig(cfg);
        setSizeId(cfg.system_sizes[0]?.id ?? null);
        setTenure(cfg.settings.tenure_default_years);
      } catch (err) {
        if (cancelled) return;
        console.error("Failed to load EMI calculator config:", err);
        setConfigError("Could not load calculator settings. Please refresh.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const settings = config?.settings ?? null;
  const sizes = useMemo(() => config?.system_sizes ?? [], [config]);
  const selectedSize = useMemo(
    () => sizes.find((s) => s.id === sizeId) ?? null,
    [sizes, sizeId]
  );

  /* ---- calculation: re-run on every selection change ---- */
  // Slider drags fire continuously, so the request is debounced. A request id
  // guards against a slow earlier response landing after a newer one.
  const requestSeq = useRef(0);

  useEffect(() => {
    if (sizeId === null) return;
    const seq = ++requestSeq.current;
    const timer = setTimeout(async () => {
      setApiLoading(true);
      try {
        const response = await calculateEMI({
          size_id: sizeId,
          tenure_years: tenure,
          apply_subsidy: subsidyOn,
          ...(loanOverride !== null ? { loan_amount: loanOverride } : {}),
          ...(rateOverride !== null ? { interest_rate: rateOverride } : {}),
        });
        if (seq !== requestSeq.current) return; // superseded
        setData(response);
        setApiError(null);
      } catch (err) {
        if (seq !== requestSeq.current) return;
        console.error("Failed to calculate EMI:", err);
        setApiError(err instanceof Error ? err.message : "Failed to calculate EMI");
      } finally {
        if (seq === requestSeq.current) setApiLoading(false);
      }
    }, 220);
    return () => clearTimeout(timer);
  }, [sizeId, tenure, subsidyOn, loanOverride, rateOverride]);

  /* ---- values shown: backend result first, selection as fallback ---- */
  const emi = data?.result.emi_per_month ?? 0;
  const dailyAmount = data?.result.daily_amount ?? 0;
  const totalPaid = data?.result.total_payment ?? 0;
  const totalInterest = data?.result.total_interest ?? 0;
  const subsidyAmount = data?.subsidy.amount ?? 0;
  const systemCost = data?.system.system_cost ?? Number(selectedSize?.system_cost ?? 0);
  const upfront = data?.loan.upfront_amount ?? 0;

  // While a debounced call is in flight the slider must still track the
  // customer's thumb, so the override wins over the last server value.
  const loanAmount = loanOverride ?? data?.loan.amount ?? 0;
  const rate = rateOverride ?? data?.interest.rate ?? 0;
  const rateLocked = data?.interest.is_locked ?? false;
  const rateMin = data?.interest.min_rate ?? 0;

  const loanMin = Number(settings?.loan_amount_min ?? 50000);
  const loanMax = Number(settings?.loan_amount_max ?? 600000);
  const loanStep = Number(settings?.loan_step ?? 5000);
  const rateMax = Number(settings?.rate_max ?? 18);
  const tenureMin = settings?.tenure_min_years ?? 1;
  const tenureMax = settings?.tenure_max_years ?? 10;
  const panelLife = settings?.panel_life_years ?? 25;

  const monthlyBill = data?.system.monthly_bill_reference ?? 0;
  const monthlySavings = monthlyBill - emi;

  const breakEvenMonths = monthlyBill > 0 ? loanAmount / monthlyBill : null;
  const breakEvenYears = breakEvenMonths ? (breakEvenMonths / 12).toFixed(1) : null;
  const remainingYears = breakEvenMonths
    ? Math.max(0, panelLife - breakEvenMonths / 12)
    : panelLife;
  const savingsAfterBreakEven = monthlyBill * 12 * Math.round(remainingYears);

  // The electricity bill bar is the fixed reference for the selected system
  // size; only the EMI bar moves as the EMI changes.
  const emiBarWidth = monthlyBill > 0 ? Math.min(100, (emi / monthlyBill) * 100) : 0;

  const topBank = useMemo(() => bestMatch(config?.banks ?? []), [config]);

  /* ---- handlers ---- */
  // Changing the system size or the subsidy re-derives the loan and the rate
  // from policy rather than carrying the previous selection across.
  const handleSizeChange = useCallback((id: number) => {
    setSizeId(id);
    setLoanOverride(null);
    setRateOverride(null);
  }, []);

  const handleSubsidyToggle = useCallback(() => {
    setSubsidyOn((prev) => !prev);
    setLoanOverride(null);
  }, []);

  const nudgeLoan = (delta: number) =>
    setLoanOverride(Math.min(loanMax, Math.max(loanMin, loanAmount + delta)));

  const nudgeRate = (delta: number) =>
    setRateOverride(
      Math.min(rateMax, Math.max(rateMin, Math.round((rate + delta) * 100) / 100))
    );

  if (configError) {
    return (
      <section id="calculator" className="container mx-auto px-4 py-20 max-w-7xl text-center">
        <p className="text-base text-[#DC2626]">{configError}</p>
      </section>
    );
  }

  if (!config || !selectedSize) {
    return (
      <section id="calculator" className="container mx-auto px-4 py-20 max-w-7xl text-center">
        <p className="text-base text-[#4B5563] animate-pulse">Loading calculator…</p>
      </section>
    );
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
          subsidy to see how ₹{fmt(subsidyAmount || 78000)} government support
          reduces your EMI from day one.
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
            <div
              className="grid gap-4"
              style={{ gridTemplateColumns: `repeat(${Math.min(sizes.length, 4)}, minmax(0, 1fr))` }}
            >
              {sizes.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSizeChange(s.id)}
                  className={`flex flex-col items-center py-2 px-1 rounded-lg border-2 transition-all ${
                    sizeId === s.id
                      ? "border-[#F7BA41]"
                      : "border-[#E5E7EB] hover:border-[#F7BA41]/60"
                  }`}
                >
                  <span
                    className={`text-sm sm:text-xl font-bold ${sizeId === s.id ? "text-[#F7BA41]" : "text-[#111827]"}`}
                  >
                    {s.label}
                  </span>
                  <span
                    className={`text-[9px] sm:text-sm  ${sizeId === s.id ? "text-[#F7BA41]" : "text-[#111827]"}`}
                  >
                    {fmtPrice(s.system_cost)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Cost breakdown — makes the corrected order of operations visible */}
          <div className="rounded-lg bg-[#F9FAFB] px-4 py-3 flex flex-col gap-1.5">
            <div className="flex justify-between text-[11px] sm:text-sm">
              <span className="text-[#4B5563]">System cost</span>
              <span className="font-semibold text-[#123532]">₹{fmt(systemCost)}</span>
            </div>
            {subsidyOn && (
              <div className="flex justify-between text-[11px] sm:text-sm">
                <span className="text-[#4B5563]">Less PM Surya Ghar subsidy</span>
                <span className="font-semibold text-[#16A34A]">− ₹{fmt(subsidyAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-[11px] sm:text-sm">
              <span className="text-[#4B5563]">Your upfront ({fmt(100 - (data?.loan.percentage ?? 90))}%)</span>
              <span className="font-semibold text-[#123532]">₹{fmt(upfront)}</span>
            </div>
          </div>

          {/* Loan Amount */}
          <div className="flex flex-col gap-2">
            <p className="text-[11px] sm:text-sm font-semibold text-[#444444]">
              Loan Amount ({fmt(data?.loan.percentage ?? 90)}% financed)
            </p>
            <div className="flex items-center gap-3">
              <button onClick={() => nudgeLoan(-loanStep)} className="cursor-pointer">
                <Minus size={16} className="text-black" />
              </button>
              <span className="flex-1 text-center text-base sm:text-xl md:text-2xl font-bold text-[#123532]">
                ₹{fmt(loanAmount)}
              </span>
              <button onClick={() => nudgeLoan(loanStep)} className="cursor-pointer">
                <Plus size={16} className="text-black" />
              </button>
            </div>
            <input
              type="range"
              className="calc-slider w-full"
              min={loanMin}
              max={loanMax}
              step={loanStep}
              value={Math.min(loanMax, Math.max(loanMin, loanAmount))}
              style={{ "--progress": `${pct(loanAmount, loanMin, loanMax)}%` } as React.CSSProperties}
              onChange={(e) => setLoanOverride(Number(e.target.value))}
            />
            <div className="flex justify-between text-[11px] sm:text-sm text-[#6B7280]">
              <span>{fmtPrice(loanMin)}</span>
              <span>{fmtPrice(loanMax)}</span>
            </div>
            {loanOverride !== null && data && (
              <button
                onClick={() => setLoanOverride(null)}
                className="cursor-pointer self-start text-[10px] sm:text-xs font-semibold text-[#123532] underline"
              >
                Reset to ₹{fmt(data.loan.suggested_amount)}
              </button>
            )}
          </div>

          <hr className="border-[#F3F4F6]" />

          {/* Interest Rate */}
          <div className="flex flex-col gap-2">
            <p className="text-[11px] sm:text-sm font-semibold text-[#444444]">
              {rateLocked ? "Applicable Interest Rate" : "Interest Rate"}
            </p>
            {rateLocked ? (
              <div className="bg-[#F7F5EC] rounded-lg px-4 py-3">
                <span className="text-base sm:text-xl md:text-2xl font-bold text-[#123532]">
                  {rate.toFixed(2)}%
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button onClick={() => nudgeRate(-0.25)} className="cursor-pointer">
                  <Minus size={16} className="text-black" />
                </button>
                <span className="flex-1 text-center text-base sm:text-xl md:text-2xl font-bold text-[#123532]">
                  {rate.toFixed(2)}%
                </span>
                <button onClick={() => nudgeRate(0.25)} className="cursor-pointer">
                  <Plus size={16} className="text-black" />
                </button>
              </div>
            )}
            <input
              type="range"
              className={`calc-slider w-full ${rateLocked ? "calc-slider--locked" : ""}`}
              min={rateMin}
              max={rateMax}
              step={0.25}
              value={Math.min(rateMax, Math.max(rateMin, rate))}
              disabled={rateLocked}
              aria-label="Interest rate"
              style={{ "--progress": `${pct(rate, rateMin, rateMax)}%` } as React.CSSProperties}
              onChange={(e) => setRateOverride(Math.max(rateMin, Number(e.target.value)))}
            />
            {!rateLocked && (
              <div className="flex justify-between text-[11px] sm:text-sm text-[#6B7280]">
                <span>{rateMin}%</span>
                <span>{rateMax}%</span>
              </div>
            )}
            <div className="flex items-center justify-between gap-3">
              <span className="text-start text-[9px] sm:text-xs text-[#444444]">
                {rateLocked
                  ? `Fixed ${rate.toFixed(2)}% Flarize–SBI rate for ${selectedSize.label} systems`
                  : `Rates start at ${rateMin}% for this system size`}
              </span>
              {!rateLocked && rate > rateMin && (
                <button
                  onClick={() => setRateOverride(null)}
                  className="cursor-pointer shrink-0 text-[10px] sm:text-xs font-semibold text-[#123532] underline"
                >
                  Reset to {rateMin}%
                </button>
              )}
            </div>
          </div>

          <hr className="border-[#F3F4F6]" />

          {/* Loan Tenure */}
          <div className="flex flex-col gap-2">
            <p className="text-[11px] sm:text-sm font-semibold text-[#444444]">Loan Tenure</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setTenure((v) => Math.max(tenureMin, v - 1))}
                className="cursor-pointer"
              >
                <Minus size={16} className="text-black" />
              </button>
              <span className="flex-1 text-center text-base sm:text-xl md:text-2xl font-bold text-[#123532]">
                {tenure} {tenure === 1 ? "Year" : "Years"}
              </span>
              <button
                onClick={() => setTenure((v) => Math.min(tenureMax, v + 1))}
                className="cursor-pointer"
              >
                <Plus size={16} className="text-black" />
              </button>
            </div>
            <input
              type="range"
              className="calc-slider w-full"
              min={tenureMin}
              max={tenureMax}
              step={1}
              value={tenure}
              style={{ "--progress": `${pct(tenure, tenureMin, tenureMax)}%` } as React.CSSProperties}
              onChange={(e) => setTenure(Number(e.target.value))}
            />
            <div className="flex justify-between text-[11px] sm:text-sm text-[#6B7280]">
              <span>{tenureMin} Year</span>
              <span>{tenureMax} Years</span>
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
                    ? `₹${fmt(subsidyAmount)} `
                    : "Subsidy not applied "}
                    <span className="font-normal text-[#374151]">{subsidyOn ? "subsidy applied" : " "}</span>
                </span>
                <span className="text-xs text-[#4B5563]">
                  Deducted before the {fmt(data?.loan.percentage ?? 90)}% loan is calculated
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
          <div className="bg-[#16A34A] rounded-xl p-5 sm:p-6 text-white">
            {/* Top row: label + optional subsidy badge */}
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">Your Monthly EMI</p>
                {apiLoading && (
                  <span className="text-xs text-[#ADD6D8] animate-pulse">Calculating...</span>
                )}
              </div>
              {subsidyOn && (
                <span className="flex items-center gap-1 bg-white/20 text-white text-xs font-medium p-2 rounded-full whitespace-nowrap shrink-0">
                  <Check size={12} />
                  PM Surya Ghar Subsidy Applied
                </span>
              )}
            </div>
            {apiError && (
              <p className="text-xs text-[#FCA5A5] mb-2">{apiError}</p>
            )}

            <div className="flex items-baseline gap-2 mb-0.5">
              <span className="text-4xl sm:text-5xl font-semibold text-white">
                ₹{fmt(emi)}
              </span>
            </div>
            <p className="text-xs mb-2">
              {tenure} {tenure === 1 ? "year" : "years"} · {rate.toFixed(2)}% interest
            </p>

            {/* Daily amount — EMI ÷ 30 */}
            <div className="inline-flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1.5 mb-4">
              <span className="text-sm font-semibold">₹{fmt(dailyAmount)}/day</span>
              <span className="text-[11px] text-white/80">
                · just ₹{fmt(dailyAmount)} a day
              </span>
            </div>

            <div className=" pt-4 space-y-2">
              <div className="flex justify-between items-center text-sm font-semibold">
                <span>{subsidyOn ? "Your Loan amount after subsidy" : "Your Loan amount"}</span>
                <span className="flex items-center gap-1.5">
                  {subsidyOn && subsidyAmount > 0 && (
                    <span className="text-xs text-[#A7C4C5] line-through font-normal">
                      ₹{fmt(systemCost * ((data?.loan.percentage ?? 90) / 100))}
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
                  width: `${Math.min(100, ((breakEvenMonths ?? 0) / (panelLife * 12)) * 100)}%`,
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
                  <span className="font-bold text-[#16A34A]">
                    ₹{fmt(emi)}
                  </span>
                </div>
                <div className="w-full h-4 bg-[#F3F4F6] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#16A34A] rounded-full transition-all duration-500"
                    style={{ width: `${emiBarWidth}%` }}
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
                    className="h-full w-full bg-[#DC2626] rounded-full"
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
                {topBank?.name ?? "—"}
              </p>
              <p className="text-sm text-[#123532] mt-0.5">
                {topBank
                  ? `${Number(topBank.interest_rate).toFixed(2)}% Interest${approvalText(topBank)}`
                  : ""}
              </p>
              <a
                href="#bank-rates"
                className="cursor-pointer mt-1.5 flex items-center gap-0.5 text-sm font-semibold text-[#F88A22] hover:underline"
              >
                See All Bank Options <ArrowRight size={14} />
              </a>
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
        .calc-slider--locked {
          background: #e5e7eb;
          cursor: not-allowed;
        }
        .calc-slider--locked::-webkit-slider-thumb {
          background: #c7c9cc;
          cursor: not-allowed;
        }
        .calc-slider--locked::-moz-range-thumb {
          background: #c7c9cc;
          cursor: not-allowed;
        }
      `}</style>
    </section>
  );
}
