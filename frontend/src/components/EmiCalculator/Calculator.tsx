"use client";

// src/components/EmiCalculator/Calculator.tsx
//
// The public EMI calculator. Every number shown here — system price, down
// payment, subsidy, the loan amount they leave, interest-rate policy, EMI
// and the daily amount — is computed by the backend from Content Studio
// settings (/studio/emi-calculator). This component holds only the
// customer's selections; it never does the arithmetic itself, which is what
// used to let the UI and the API disagree.

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Minus, Plus, Zap, Award, ArrowRight, Check, Lightbulb } from "lucide-react";
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

/** Whole percents stay whole; quick-adds land on fractions, shown to 1dp. */
function fmtPct(p: number) {
  return Number.isInteger(p) ? String(p) : p.toFixed(1).replace(/\.0$/, "");
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

  // Customer selections. `null` price/down-payment overrides mean "use the
  // policy default" — that is how they reset when the size changes, instead
  // of carrying the previous selection across.
  const [sizeId, setSizeId] = useState<number | null>(null);
  const [tenure, setTenure] = useState(5);
  const [priceOverride, setPriceOverride] = useState<number | null>(null);
  const [downPaymentOverride, setDownPaymentOverride] = useState<number | null>(null);
  const [subsidyOn, setSubsidyOn] = useState(true);

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
          ...(priceOverride !== null ? { system_cost: priceOverride } : {}),
          ...(downPaymentOverride !== null
            ? { down_payment_percent: downPaymentOverride }
            : {}),
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
  }, [sizeId, tenure, priceOverride, downPaymentOverride, subsidyOn]);

  /* ---- values shown: backend result first, selection as fallback ---- */
  const emi = data?.result.emi_per_month ?? 0;
  const dailyAmount = data?.result.daily_amount ?? 0;
  const totalPaid = data?.result.total_payment ?? 0;
  const totalInterest = data?.result.total_interest ?? 0;
  const subsidyAmount = data?.subsidy.amount ?? 0;

  // While a debounced call is in flight the slider must still track the
  // customer's thumb, so the override wins over the last server value.
  const systemCost =
    priceOverride ?? data?.system.system_cost ?? Number(selectedSize?.system_cost ?? 0);
  const loanAmount = data?.loan.amount ?? 0;
  const rate = data?.interest.rate ?? 0;
  const rateBasis = data?.interest.basis_amount ?? 0;

  const priceMin = Number(
    data?.system.price_min ?? selectedSize?.price_min ?? selectedSize?.system_cost ?? 0
  );
  const priceMax = Number(
    data?.system.price_max ?? selectedSize?.price_max ?? selectedSize?.system_cost ?? 0
  );
  const priceStep = Number(settings?.price_step ?? 5000);

  const downPaymentAmount = data?.down_payment.amount ?? 0;
  const dpMin = data?.down_payment.min_percent ?? Number(settings?.down_payment_min_percent ?? 10);
  const dpMax = data?.down_payment.max_percent ?? Number(settings?.down_payment_max_percent ?? 90);
  const dpStep = data?.down_payment.step_percent ?? Number(settings?.down_payment_step_percent ?? 5);
  // While a debounced call is in flight the slider must still track the
  // customer's thumb, so the override wins over the last server value.
  const downPaymentPercent = downPaymentOverride ?? data?.down_payment.percent ?? dpMin;
  const dpMinAmount = data?.down_payment.min_amount ?? (systemCost * dpMin) / 100;
  const dpMaxAmount = data?.down_payment.max_amount ?? (systemCost * dpMax) / 100;
  const quickAdds = data?.down_payment.quick_add_amounts ?? settings?.down_payment_quick_adds ?? [];
  const unlock = data?.interest.unlock ?? null;

  const tenureMin = settings?.tenure_min_years ?? 1;
  const tenureMax = settings?.tenure_max_years ?? 10;
  const monthlyBill = data?.system.monthly_bill_reference ?? 0;
  const monthlySavings = monthlyBill - emi;

  // The electricity bill bar is the fixed reference for the selected system
  // size; only the EMI bar moves as the EMI changes.
  const emiBarWidth = monthlyBill > 0 ? Math.min(100, (emi / monthlyBill) * 100) : 0;

  const topBank = useMemo(() => bestMatch(config?.banks ?? []), [config]);

  /* ---- handlers ---- */
  // Changing the system size re-derives the price, down payment and rate
  // from policy rather than carrying the previous selection across.
  const handleSizeChange = useCallback((id: number) => {
    setSizeId(id);
    setPriceOverride(null);
    setDownPaymentOverride(null);
  }, []);

  const nudgePrice = (delta: number) =>
    setPriceOverride(Math.min(priceMax, Math.max(priceMin, systemCost + delta)));

  const setDownPaymentPercent = (percent: number) =>
    setDownPaymentOverride(Math.min(dpMax, Math.max(dpMin, Math.round(percent * 100) / 100)));

  const nudgeDownPayment = (delta: number) =>
    setDownPaymentPercent(downPaymentPercent + delta);

  // Quick-add chips work in rupees; the API takes a % of the system price.
  const addDownPayment = (rupees: number) =>
    setDownPaymentPercent(((downPaymentAmount + rupees) / systemCost) * 100);

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
          Pick your system size, adjust the price, down payment and tenure.
          Toggle the ₹{fmt(subsidyAmount || 78000)} PM Surya Ghar subsidy to
          see how it reduces your EMI.
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
                  className={`flex flex-col items-center py-3 sm:py-4 px-1 rounded-lg border-2 transition-all ${
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
                </button>
              ))}
            </div>
          </div>

          {/* System Price */}
          <div className="flex flex-col gap-2">
            <p className="text-[11px] sm:text-sm font-semibold text-[#444444]">
              System Price
            </p>
            <div className="flex items-center gap-3">
              <button onClick={() => nudgePrice(-priceStep)} className="cursor-pointer">
                <Minus size={16} className="text-black" />
              </button>
              <span className="flex-1 text-center text-base sm:text-xl md:text-2xl font-bold text-[#123532]">
                ₹{fmt(systemCost)}
              </span>
              <button onClick={() => nudgePrice(priceStep)} className="cursor-pointer">
                <Plus size={16} className="text-black" />
              </button>
            </div>
            <input
              type="range"
              className="calc-slider w-full"
              min={priceMin}
              max={priceMax}
              step={priceStep}
              value={Math.min(priceMax, Math.max(priceMin, systemCost))}
              style={{ "--progress": `${pct(systemCost, priceMin, priceMax)}%` } as React.CSSProperties}
              onChange={(e) => setPriceOverride(Number(e.target.value))}
            />
            <div className="flex justify-between text-[11px] sm:text-sm text-[#6B7280]">
              <span>{fmtPrice(priceMin)}</span>
              <span>{fmtPrice(priceMax)}</span>
            </div>
            {priceOverride !== null && selectedSize && (
              <button
                onClick={() => setPriceOverride(null)}
                className="cursor-pointer self-start text-[10px] sm:text-xs font-semibold text-[#123532] underline"
              >
                Reset to ₹{fmt(Number(selectedSize.system_cost))}
              </button>
            )}
          </div>

          {/* Down Payment */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] sm:text-sm font-semibold text-[#444444]">Down Payment</p>
              <span className="text-[10px] sm:text-xs text-[#6B7280]">
                Min {fmtPct(dpMin)}% · ₹{fmt(dpMinAmount)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => nudgeDownPayment(-dpStep)} className="cursor-pointer">
                <Minus size={16} className="text-black" />
              </button>
              <span className="flex-1 text-center text-base sm:text-xl md:text-2xl font-bold text-[#123532]">
                ₹{fmt(downPaymentAmount)}
              </span>
              <button onClick={() => nudgeDownPayment(dpStep)} className="cursor-pointer">
                <Plus size={16} className="text-black" />
              </button>
            </div>
            <p className="text-center text-[10px] sm:text-xs text-[#6B7280] -mt-1">
              {fmtPct(downPaymentPercent)}% of system price
            </p>
            {/* Quick-add chips land on fractional percents, so the slider can't snap to a step. */}
            <input
              type="range"
              className="calc-slider w-full"
              min={dpMin}
              max={dpMax}
              step={0.01}
              value={Math.min(dpMax, Math.max(dpMin, downPaymentPercent))}
              style={{ "--progress": `${pct(downPaymentPercent, dpMin, dpMax)}%` } as React.CSSProperties}
              onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
            />
            <div className="flex justify-between text-[11px] sm:text-sm text-[#6B7280]">
              <span>₹{fmt(dpMinAmount)} ({fmtPct(dpMin)}%)</span>
              <span>₹{fmt(dpMaxAmount)} ({fmtPct(dpMax)}%)</span>
            </div>
            {downPaymentOverride !== null && (
              <button
                onClick={() => setDownPaymentOverride(null)}
                className="cursor-pointer self-start text-[10px] sm:text-xs font-semibold text-[#123532] underline"
              >
                Reset to {fmtPct(dpMin)}%
              </button>
            )}

            {/* Quick add — fixed chips plus the exact amount that unlocks the cheaper rate */}
            {(quickAdds.length > 0 || unlock) && (
              <div className="flex flex-col gap-2 mt-1">
                <p className="text-[11px] sm:text-sm font-semibold text-[#444444]">Quick add</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    ...quickAdds.map((amt) => ({ amt, isUnlock: false })),
                    ...(unlock ? [{ amt: unlock.extra_down_payment, isUnlock: true }] : []),
                  ]
                    .sort((a, b) => a.amt - b.amt)
                    .map(({ amt, isUnlock }) => {
                      const disabled = downPaymentAmount + amt > dpMaxAmount + 0.5;
                      return (
                        <button
                          key={`${amt}-${isUnlock}`}
                          onClick={() => addDownPayment(amt)}
                          disabled={disabled}
                          className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs sm:text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                            isUnlock
                              ? "border-[#F7BA41] bg-[#FBF1BD80] text-[#123532]"
                              : "border-[#E5E7EB] text-[#123532] hover:border-[#F7BA41]/60"
                          }`}
                        >
                          + ₹{fmt(amt)}
                        </button>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Rate hint — tells the customer what more upfront buys them */}
            <div className="flex items-start gap-2.5 mt-1 rounded-xl bg-[#16A34A1A] border border-[#16A34A33] px-4 py-3">
              <Lightbulb size={16} className="shrink-0 mt-0.5 text-[#F7BA41]" fill="#F7BA41" />
              <p className="text-xs sm:text-sm text-[#123532] leading-relaxed">
                Your current interest rate is <strong>{rate.toFixed(2)}%</strong>.
                {unlock ? (
                  <>
                    {" "}Add <strong>₹{fmt(unlock.extra_down_payment)}</strong> more to unlock{" "}
                    <strong>{unlock.rate.toFixed(2)}%</strong> interest.
                  </>
                ) : (
                  <> That&apos;s the lowest rate available.</>
                )}
              </p>
            </div>

            {/* With/Without Subsidy toggle */}
            <div className="flex items-center justify-between gap-4 mt-2 bg-[#F3F4F6] border border-[#F3F4F6] rounded-2xl p-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-[#111827]">
                  {subsidyOn ? "With Subsidy" : "Without Subsidy"}
                </span>
                <span className="text-[9px] sm:text-xs text-[#4B5563]">
                  {subsidyOn
                    ? `₹${fmt(subsidyAmount || 78000)} PM Surya Ghar subsidy deducted too`
                    : "Loan is based on price minus down payment only"}
                </span>
              </div>
              <button
                onClick={() => setSubsidyOn((prev) => !prev)}
                className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none shrink-0 ${
                  subsidyOn ? "bg-[#F7BA41]" : "bg-[#757575]"
                }`}
                aria-label="Toggle With/Without Subsidy"
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${
                    subsidyOn ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          <hr className="border-[#F3F4F6]" />

          {/* Interest Rate — determined by the loan amount, not adjustable */}
          <div className="flex flex-col gap-2">
            <p className="text-[11px] sm:text-sm font-semibold text-[#444444]">
              Applicable Interest Rate
            </p>
            <div className="bg-[#F7F5EC] rounded-lg px-4 py-3">
              <span className="text-base sm:text-xl md:text-2xl font-bold text-[#123532]">
                {rate.toFixed(2)}%
              </span>
            </div>
            <span className="text-start text-[9px] sm:text-xs text-[#444444]">
              Your system price after down payment is ₹{fmt(rateBasis)}, so the
              applicable rate is {rate.toFixed(2)}%. The subsidy reduces your EMI
              but does not change the rate band.
            </span>
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
            <div className="inline-flex items-center gap-1 bg-white/20 text-white text-xs sm:text-sm font-medium px-3 py-2 rounded-full whitespace-nowrap mb-4">
              ₹{fmt(dailyAmount)}/day · just ₹{fmt(dailyAmount)} a day
            </div>

            {/* Calculation breakdown — system price down to the loan amount */}
            <div className="pt-4 space-y-2 border-t border-white/20">
              <div className="flex justify-between text-sm">
                <span className="font-medium">System price</span>
                <span className="font-semibold">₹{fmt(systemCost)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium">Down payment ({fmtPct(downPaymentPercent)}%)</span>
                <span className="font-semibold">− ₹{fmt(downPaymentAmount)}</span>
              </div>
              {subsidyOn && (
                <div className="flex justify-between text-sm">
                  <span className="font-medium">PM Surya Ghar subsidy</span>
                  <span className="font-semibold">− ₹{fmt(subsidyAmount)}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-sm font-semibold border-t border-white/20 pt-2">
                <span>Loan amount</span>
                <span className="text-base">₹{fmt(loanAmount)}</span>
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
      `}</style>
    </section>
  );
}
