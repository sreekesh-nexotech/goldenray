"use client";

import Image from "next/image";
import { useQuotationStrings } from "./i18n/QuotationLanguageContext";
import { fill } from "./i18n/quotationStrings";
import { quotationPricing } from "./subsidy";

interface Page11ContentProps {
  monthlyBill: number | "";
  systemPrice: number;
  emiPerMonth: number;
  /** PM Surya Ghar subsidy applicable to this customer; 0 for Non-DCR. */
  subsidy: number;
}

export default function Page11Content({
  monthlyBill,
  systemPrice,
  emiPerMonth,
  subsidy,
}: Page11ContentProps) {
  const { page11: t } = useQuotationStrings();
  const billAmount = typeof monthlyBill === "number" ? monthlyBill : 6000;

  // Without the subsidy the customer carries the full system cost, so every
  // figure below — investment, payback, savings, EMI — works off the net cost.
  const {
    grossCost,
    netCost,
    emiPerMonth: emi,
  } = quotationPricing(systemPrice, emiPerMonth, subsidy);
  const hasSubsidy = subsidy > 0;

  // Monthly savings range (80%–95% of bill)
  const minSavings = Math.round(billAmount * 0.8);
  const maxSavings = Math.round(billAmount * 0.95);

  // Payback period
  const avgMonthlySavings = (minSavings + maxSavings) / 2;
  const paybackYears = Math.round(netCost / (avgMonthlySavings * 12));

  // 25-year net savings
  const totalSavings25 = Math.round(avgMonthlySavings * 12 * 25 - netCost);

  // EMI net monthly
  const minNetEMI = minSavings - emi;
  const maxNetEMI = maxSavings - emi;

  // Offer date — current date
  const now = new Date();
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const offerDate = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;

  const formatINR = (val: number) => val.toLocaleString("en-IN");

  return (
    <div className="flex flex-col h-full">
      {/* Title */}
      <div className="text-center mt-3 mb-2">
        <h1 className="text-[26px] font-bold text-[#123532] leading-tight">
          {t.title}
        </h1>
        <p className="text-xs text-gray-500 my-2">{t.subtitle}</p>
      </div>

      {/* Investment Card */}
      <div className="mx-23 shadow-lg mb-8 pb-4 border border-gray-200 rounded-xl overflow-hidden">
        {/* Orange Header */}
        <div className="bg-[#F88A22] text-white text-center py-5">
          <p className="text-sm font-bold">{t.packageHeader}</p>
        </div>

        {/* Cost breakdown */}
        <div className="px-5 py-3">
          {/* Cost breakdown — only meaningful when a subsidy applies */}
          {hasSubsidy && (
            <>
              {/* System Cost */}
              <div className="flex justify-between items-center py-2">
                <span className="text-[13px] text-gray-700">
                  {t.systemCostPreSubsidy}
                </span>
                <span className="text-[13px] font-semibold text-[#123532]">
                  ₹{formatINR(grossCost)}
                </span>
              </div>

              {/* Subsidy */}
              <div className="flex justify-between items-center py-2">
                <span className="text-[13px] text-gray-700">
                  {t.pmSuryaGharSubsidy}
                </span>
                <span className="text-[13px] font-semibold text-[#123532]">
                  – ₹{formatINR(subsidy)}
                </span>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 my-1"></div>
            </>
          )}

          {/* Your Investment */}
          <div className="flex justify-between items-center py-2">
            <span className="text-[14px] font-bold text-[#123532]">
              {t.yourInvestment}
            </span>
            <span className="text-[14px] font-bold text-[#16a34a]">
              ₹{formatINR(netCost)}
            </span>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-1"></div>

          {/* Monthly Savings */}
          <div className="flex justify-between items-center py-2">
            <span className="text-[13px] text-gray-700">
              {t.monthlySavings}
            </span>
            <span className="text-[13px] font-semibold text-[#123532]">
              ₹{formatINR(minSavings)}–{formatINR(maxSavings)}
            </span>
          </div>

          {/* Payback Period */}
          <div className="flex justify-between items-center py-2">
            <span className="text-[13px] text-gray-700">{t.paybackPeriod}</span>
            <span className="text-[13px] font-semibold text-[#123532]">
              {fill(t.paybackValue, { years: paybackYears })}
            </span>
          </div>

          {/* 25-Year Net Savings */}
          <div className="flex justify-between items-center py-2">
            <span className="text-[13px] text-gray-700">{t.netSavings25}</span>
            <span className="text-[13px] font-semibold text-[#123532]">
              ₹{formatINR(totalSavings25)}+
            </span>
          </div>

          {/* EMI Section */}
          <div className="bg-[#E8F5E9] rounded-lg px-4 py-3 mt-2 shadow-lg">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[12px] text-gray-700">{t.emiOption}</span>
              <span className="text-[12px] font-semibold text-[#123532]">
                {fill(t.emiValue, { amount: formatINR(emi) })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[12px] text-gray-700">
                {t.netMonthlyDuringEmi}
              </span>
              <span className="text-[12px] font-bold text-[#16a34a]">
                {/* The "positive from Day 1" claim only holds while the EMI
                    stays below the monthly saving. */}
                {fill(
                  minNetEMI > 0 ? t.netMonthlyValue : t.netMonthlyValuePlain,
                  {
                    min: formatINR(minNetEMI),
                    max: formatINR(maxNetEMI),
                  },
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Ready to Start Saving */}
      <div className="text-center mb-5">
        <h2 className="text-[22px] font-bold text-[#123532] italic mb-1">
          {t.readyTitle}
        </h2>
        <p className="text-xs text-gray-500">{t.readySubtitle}</p>
      </div>

      {/* Special Offer - Priority Installation */}
      <div className="mx-6 mb-8 border border-[#F88A22] rounded-xl p-3 flex items-center gap-4 bg-[#F2F2F7]">
        <div className="flex-shrink-0 ml-5">
          <Image
            src="https://golden-ray.b-cdn.net/icons/37.png"
            alt="Special Offer"
            width={150}
            height={150}
            className="object-contain"
          />
        </div>
        <div>
          <h3 className="text-[18px] font-bold text-[#123532] mb-0.5">
            {t.priorityTitle}
          </h3>
          <p className="text-[12px] text-gray-600 mb-1">{t.prioritySubtitle}</p>
          <p className="text-[11px] text-[#DC2626]">
            {fill(t.offerValid, { date: offerDate })}
          </p>
        </div>
      </div>

      {/* Trust Badges Row */}
      <div className="flex items-end justify-center gap-10 mb-8 px-6">
        {/* MNRE */}
        <div className="flex flex-col items-center">
          <Image
            src="https://golden-ray.b-cdn.net/icons/image%2074.png"
            alt="MNRE Empanelled"
            width={60}
            height={60}
            className="object-contain mb-3"
          />
          <span className="text-[13px] text-[#123532] tracking-[0.15em] uppercase">
            {t.badgeMnre}
          </span>
        </div>

        <div className=" text-xl font-light">|</div>

        {/* 127+ Kerala Homes */}
        <div className="flex flex-col items-center">
          <Image
            src="https://golden-ray.b-cdn.net/icons/image%2075.png"
            alt="127+ Kerala Homes"
            width={60}
            height={60}
            className="object-contain mb-3"
          />
          <span className="text-[13px] text-[#123532] tracking-[0.15em] uppercase">
            {t.badgeHomes}
          </span>
        </div>

        <div className=" text-xl font-light">|</div>

        {/* 4.9 Google Rating */}
        <div className="flex flex-col items-center">
          <Image
            src="https://golden-ray.b-cdn.net/icons/image%2076.png"
            alt="4.9 Google Rating"
            width={80}
            height={80}
            className="object-contain mb-3"
          />
          <span className="text-[13px]  text-[#123532] tracking-[0.15em] uppercase">
            {t.badgeRating}
          </span>
        </div>
      </div>

      {/* Bottom Guarantees Row */}
      <div className="mx-20 mb-1 rounded-xl py-5 px-4">
        <div className="flex items-center justify-between">
          {/* 100% Refundable */}
          <div className="flex items-center gap-1">
            <Image
              src="https://golden-ray.b-cdn.net/icons/Vector%20(8).png"
              alt="Refundable"
              width={20}
              height={20}
              className="object-contain"
            />
            <div>
              <p className="text-xs font-bold text-[#123532]">
                {t.guaranteeRefundable}
              </p>
              <p className="text-[8px] text-gray-500">
                {t.guaranteeRefundableSub}
              </p>
            </div>
          </div>

          {/* No Obligation */}
          <div className="flex items-center gap-2">
            <Image
              src="https://golden-ray.b-cdn.net/icons/Vector%20(9).png"
              alt="No Obligation"
              width={30}
              height={30}
              className="object-contain"
            />
            <div>
              <p className="text-xs font-bold text-[#123532]">
                {t.guaranteeNoObligation}
              </p>
              <p className="text-[8px] text-gray-500">
                {t.guaranteeNoObligationSub}
              </p>
            </div>
          </div>

          {/* Price Locked */}
          <div className="flex items-center gap-2">
            <Image
              src="https://golden-ray.b-cdn.net/icons/Vector%20(10).png"
              alt="Price Locked"
              width={20}
              height={20}
              className="object-contain"
            />
            <div>
              <p className="text-xs font-bold text-[#123532]">
                {t.guaranteePriceLocked}
              </p>
              <p className="text-[8px] text-gray-500">
                {t.guaranteePriceLockedSub}
              </p>
            </div>
          </div>

          {/* Installation */}
          <div className="flex items-center gap-2">
            <Image
              src="https://golden-ray.b-cdn.net/icons/Vector%20(11).png"
              alt="Installation"
              width={20}
              height={20}
              className="object-contain"
            />
            <div>
              <p className="text-xs font-bold text-[#123532]">
                {t.guaranteeInstallation}
              </p>
              <p className="text-[8px] text-gray-500">
                {t.guaranteeInstallationSub}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Quote */}
      <div className="text-center mt-auto mb-2 px-8">
        <p className="text-sm italic text-[#123532] leading-relaxed">
          {t.closingQuoteLine1}
          <br />
          {t.closingQuoteLine2}
        </p>
      </div>
    </div>
  );
}
