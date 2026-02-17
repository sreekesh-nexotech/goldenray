"use client";

import Image from "next/image";

interface Page9ContentProps {
  monthlyBill: number | "";
  systemPrice: number;
  emiPerMonth: number;
}

export default function Page9Content({
  monthlyBill,
  systemPrice,
  emiPerMonth,
}: Page9ContentProps) {
  const billAmount = typeof monthlyBill === "number" ? monthlyBill : 6000;
  const subsidy = 78000;
  const beforeSubsidy = systemPrice + subsidy;

  // Monthly savings range (80%–95% of bill)
  const minSavings = Math.round(billAmount * 0.8);
  const maxSavings = Math.round(billAmount * 0.95);

  // Payback period
  const avgMonthlySavings = (minSavings + maxSavings) / 2;
  const paybackYears = Math.round(systemPrice / (avgMonthlySavings * 12));

  // 25-year net savings
  const totalSavings25 = Math.round(avgMonthlySavings * 12 * 25 - systemPrice);

  // EMI net monthly
  const minNetEMI = minSavings - emiPerMonth;
  const maxNetEMI = maxSavings - emiPerMonth;

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
        <h1 className="text-[26px] font-bold text-[#123532] leading-tight italic">
          Your Investment Summary
        </h1>
        <p className="text-xs text-gray-500 my-2">
          A controlled, predictable, one-time decision
        </p>
      </div>

      {/* Investment Card */}
      <div className="mx-23 shadow-lg mb-8 pb-4 border border-gray-200 rounded-xl overflow-hidden">
        {/* Orange Header */}
        <div className="bg-[#F88A22] text-white text-center py-5">
          <p className="text-sm font-bold">
            5 kW Solar System — Recommended Package
          </p>
        </div>

        {/* Cost breakdown */}
        <div className="px-5 py-3">
          {/* System Cost */}
          <div className="flex justify-between items-center py-2">
            <span className="text-[13px] text-gray-700">
              System Cost (Pre-Subsidy)
            </span>
            <span className="text-[13px] font-semibold text-[#123532]">
              ₹{formatINR(beforeSubsidy)}
            </span>
          </div>

          {/* Subsidy */}
          <div className="flex justify-between items-center py-2">
            <span className="text-[13px] text-gray-700">
              PM Surya Ghar Subsidy
            </span>
            <span className="text-[13px] font-semibold text-[#123532]">
              – ₹{formatINR(subsidy)}
            </span>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-1"></div>

          {/* Your Investment */}
          <div className="flex justify-between items-center py-2">
            <span className="text-[14px] font-bold text-[#123532]">
              Your Investment
            </span>
            <span className="text-[14px] font-bold text-[#16a34a]">
              ₹{formatINR(systemPrice)}
            </span>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-1"></div>

          {/* Monthly Savings */}
          <div className="flex justify-between items-center py-2">
            <span className="text-[13px] text-gray-700">Monthly Savings</span>
            <span className="text-[13px] font-semibold text-[#123532]">
              ₹{formatINR(minSavings)}–{formatINR(maxSavings)}
            </span>
          </div>

          {/* Payback Period */}
          <div className="flex justify-between items-center py-2">
            <span className="text-[13px] text-gray-700">Payback Period</span>
            <span className="text-[13px] font-semibold text-[#123532]">
              ~{paybackYears} years
            </span>
          </div>

          {/* 25-Year Net Savings */}
          <div className="flex justify-between items-center py-2">
            <span className="text-[13px] text-gray-700">
              25-Year Net Savings
            </span>
            <span className="text-[13px] font-semibold text-[#123532]">
              ₹{formatINR(totalSavings25)}+
            </span>
          </div>

          {/* EMI Section */}
          <div className="bg-[#E8F5E9] rounded-lg px-4 py-3 mt-2 shadow-lg">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[12px] text-gray-700">
                EMI Option (5yr, ~9%)
              </span>
              <span className="text-[12px] font-semibold text-[#123532]">
                ~₹{formatINR(emiPerMonth)}/month
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[12px] text-gray-700">
                Net monthly during EMI
              </span>
              <span className="text-[12px] font-bold text-[#16a34a]">
                +₹{formatINR(minNetEMI)}–{formatINR(maxNetEMI)} (positive from
                Day 1)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Ready to Start Saving */}
      <div className="text-center mb-5">
        <h2 className="text-[22px] font-bold text-[#123532] italic mb-1">
          Ready to Start Saving?
        </h2>
        <p className="text-xs text-gray-500">
          Lock your installation slot today. ₹5,000 booking. Fully refundable.
          We do everything else.
        </p>
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
            Priority 10-Day Installation
          </h3>
          <p className="text-[12px] text-gray-600 mb-1">
            Fast-tracked scheduling and execution
          </p>
          <p className="text-[11px] text-[#DC2626]">
            Offer valid for bookings confirmed before {offerDate}
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
            MNRE Empanelled
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
            127+ Kerala Homes
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
            4.9★ Google Rating
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
                100% Refundable
              </p>
              <p className="text-[8px] text-gray-500">₹5,000 booking fee</p>
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
                No Obligation
              </p>
              <p className="text-[8px] text-gray-500">If roof unsuitable</p>
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
                Price Locked
              </p>
              <p className="text-[8px] text-gray-500">For 90 days only</p>
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
                Installation
              </p>
              <p className="text-[8px] text-gray-500">in 15–20 day</p>
            </div>
          </div>
        </div>
      </div>


      {/* Bottom Quote */}
      <div className="text-center mt-auto mb-2 px-8">
        <p className="text-sm italic text-[#123532] leading-relaxed">
          Most homeowners tell us the hardest part was deciding —
          <br />
          everything after that was surprisingly easy.
        </p>
      </div>
    </div>
  );
}
