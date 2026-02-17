"use client";

import Image from "next/image";

interface Page2ContentProps {
  monthlyBill: number | "";
}

export default function Page2Content({ monthlyBill }: Page2ContentProps) {
  const billAmount = typeof monthlyBill === "number" ? monthlyBill : 6000;

  // Calculate dynamic values based on monthly bill
  const yearlyBill = billAmount * 12;
  const totalPaidIn25Years = Math.round((yearlyBill * 25) / 100000); // in lakhs
  const totalSavings = Math.round(totalPaidIn25Years * 0.65 * 100000); // Approximate 65% savings
  const formattedSavings = totalSavings.toLocaleString("en-IN");

  // Get current month name
  const currentMonth = new Date().toLocaleString("default", { month: "long" });

  return (
    <>
      {/* Progress Bar */}
      <div className="px-13 mt-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-[#123532]">
            Your Journey to Energy Freedom
          </span>
          <span className="text-sm font-medium text-[#16a34a]">
            40% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
          <div
            className="h-2.5 rounded-full"
            style={{
              width: "40%",
              background: "linear-gradient(to right, #10b981, #16a34a)",
            }}
          />
        </div>
      </div>

      {/* Main Headline */}
      <div className="text-center mb-6 px-4">
        <h1 className="text-4xl font-bold leading-tight mb-4 mt-4">
          <span className="text-[#1a1a1a]">Stop Paying </span>
          <span className="text-[#FF9500]">
            ₹{billAmount.toLocaleString("en-IN")}
          </span>
          <br />
          <span className="text-[#1a1a1a]">Every Month to KSEB</span>
        </h1>
        <p className="text-base text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Your personalised solar proposal. One payment. 25+ years of free
          electricity. We handle everything — paperwork, approvals,
          installation.
        </p>
      </div>

      {/* Three Badges */}
      <div className="flex justify-center gap-13 mb-5 mt-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center">
            <Image
              src="/Vector.png"
              alt="Subsidy"
              width={25}
              height={25}
              className="object-contain"
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#FF9500]">
              ₹78,000 Subsidy
            </p>
            <p className="text-[10px] text-gray-500">
              PM Surya Ghar – guaranteed
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center">
            <Image
              src="/Vector.png"
              alt="Homes"
              width={25}
              height={25}
              className="object-contain"
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#123532]">300+ Homes</p>
            <p className="text-[10px] text-gray-500">Installed in Kerala</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center">
            <Image
              src="/Vector.png"
              alt="MNRE"
              width={25}
              height={25}
              className="object-contain"
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#123532]">
              MNRE Empanelled
            </p>
            <p className="text-[10px] text-gray-500">Government certified</p>
          </div>
        </div>
      </div>

      {/* Horizontal Divider */}
      <div className="w-full border-t border-gray-300 my-4 px-4"></div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3 mb-2 bg-[#FFF8E9] px-4">
        <div className=" rounded-lg p-3">
          <p className="text-3xl font-bold text-[#FF9500] mb-1">8+</p>
          <p className="text-xs text-[#1a1a1a] leading-tight">
            Years Operating in Kerala
          </p>
        </div>
        <div className=" rounded-lg p-3">
          <p className="text-3xl font-bold text-[#FF9500] mb-1">300+</p>
          <p className="text-xs text-[#1a1a1a] leading-tight">
            Trusted Customers
            <br />
            since 2018
          </p>
        </div>
        <div className=" rounded-lg p-3">
          <p className="text-3xl font-bold text-[#FF9500] mb-1">₹5,000+</p>
          <p className="text-xs text-[#1a1a1a] leading-tight">
            saved every month by our
            <br />
            customers
          </p>
        </div>
      </div>

      {/* Comparison Cards */}
      <div className="grid grid-cols-2 gap-15 my-5 px-4 relative">
        {/* Without Solar */}
        <div className="border-2 border-red-300 rounded-lg p-3 bg-[#FEF2F2]">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">✕</span>
            </div>
            <span className="text-sm font-semibold text-red-600">
              Without Solar
            </span>
          </div>

          <div className="mb-2">
            <div className="flex items-center gap-1 ">
              <span className="text-red-500 text-lg">↘</span>
              <span className="text-2xl font-bold text-red-600">
                ₹{billAmount.toLocaleString("en-IN")}/month
              </span>
            </div>
            <span className="text-xs text-red-500 ml-7">
              forever increasing
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-start gap-1">
              <span className="text-red-500 text-sm">💸</span>
              <span className="text-gray-700">
                <span className="text-red-600 font-medium">
                  ₹{totalPaidIn25Years}+ lakh
                </span>{" "}
                paid to KSEB in 25 years
              </span>
            </div>
            <div className="flex items-start gap-1">
              <span className="text-red-500 text-sm">📈</span>
              <span className="text-gray-700">
                Bill increases{" "}
                <span className="text-red-600 font-medium">8-12% yearly</span>
              </span>
            </div>
            <div className="flex items-start gap-1">
              <span className="text-red-500 text-sm">⏳</span>
              <span className="text-gray-700">No ownership, no control</span>
            </div>
          </div>
        </div>

        {/* Arrow between cards */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="bg-white p-2.5   border-gray-300">
            <svg
              className="w-6 h-6 text-gray-800"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* With Solar */}
        <div className="border-2 border-green-500 rounded-lg p-3 bg-[#F0FDF4]">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">✓</span>
            </div>
            <span className="text-sm font-semibold text-green-700">
              With Solar
            </span>
          </div>

          <div className="mb-2">
            <div className="flex items-center gap-2">
              <span className="text-green-600 text-lg">⚡</span>
              <span className="text-2xl font-bold text-green-700">
                ₹300-800/month
              </span>
            </div>
            <span className="text-xs text-green-600 ml-7">fixed low bill</span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-start gap-1">
              <span className="text-green-600 text-sm">🐷</span>
              <span className="text-gray-700">
                <span className="text-green-700 font-medium">
                  ₹{Math.round(totalPaidIn25Years * 0.65)} lakh
                </span>{" "}
                saved over 25 years
              </span>
            </div>
            <div className="flex items-start gap-1">
              <span className="text-green-600 text-sm">🛡</span>
              <span className="text-gray-700">
                Protected from{" "}
                <span className="text-green-700 font-medium">tariff hikes</span>
              </span>
            </div>
            <div className="flex items-start gap-1">
              <span className="text-green-600 text-sm">⚡</span>
              <span className="text-gray-700">
                Own your power,{" "}
                <span className="text-green-700 font-medium">
                  25+ year warranty
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Savings Potential Section */}
      <div className="bg-[#123532] rounded-lg p-4 mt-5 mb-7 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-green-300 mb-1">
            Your Lifetime Savings Potential
          </p>
          <p className="text-3xl font-bold text-white mb-1">
            ₹{formattedSavings}
          </p>
          <p className="text-xs text-gray-400">Total savings over 25 years</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 mb-1">
            System pays for itself in
          </p>
          <p className="text-3xl font-bold text-[#FF9500]">~3 Years</p>
          <p className="text-xs text-yellow-400">
            Every month you wait, KSEB takes another ₹
            {billAmount.toLocaleString("en-IN")} from you.
          </p>
        </div>
      </div>

      {/* Bottom Guarantees Row */}
      <div className="mx-20 mb-4 rounded-xl py-5 px-4">
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

      {/* Installation Note */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          📅 Our team installs 15-20 systems/month. Book now for{" "}
          <span className="font-medium">{currentMonth}</span> installation.
        </p>
      </div>
    </>
  );
}
