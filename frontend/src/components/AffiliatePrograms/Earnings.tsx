"use client";
import { ChartLine } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

const AVG_COMMISSION = 8000;
const MIN_INSTALLATIONS = 1;
const MAX_INSTALLATIONS = 10;

const Earnings = () => {
  const [installations, setInstallations] = useState(5);
  const monthlyEarnings = installations * AVG_COMMISSION;
  const annualPotential = monthlyEarnings * 12;
  const percentage =
    ((installations - MIN_INSTALLATIONS) /
      (MAX_INSTALLATIONS - MIN_INSTALLATIONS)) *
    100;

  return (
    <section className="relative z-10 container mx-auto px-4 py-10 pb-6 md:py-20 xl:py-16 max-w-7xl flex flex-col items-center h-full gap-8">
      {/* Heading */}
      <div className="w-full max-w-7xl mx-auto text-center mb-8">
        <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-[#123532] mb-4">
          See How Much You Could Earn This Month
        </h2>
        <p className="hidden sm:block text-sm md:text-xl font-normal leading-relaxed text-[#4B5563]">
          Your earning potential scales directly with the number of
          introductions you make each month. The calculation is straightforward:
          every confirmed residential installation earns you a fixed commission
          credited to your bank account within 7-14 business days
        </p>
      </div>

      {/* Main Card */}
      <div className="w-full  bg-white rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.12)] px-4 md:px-20 py-7 md:py-10">
        <div className="flex flex-col lg:flex-row gap-13 justify-between">
          {/* LEFT SIDE */}
          <div className="flex-1 flex flex-col gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-semibold leading-snug text-[#111827] max-w-[420px]">
                How many successful installations can you refer per month?
              </h2>

              <p className="text-[#F7BA41] text-base md:text-xl font-normal  leading-snug mt-4">
                Drag the slider to see your earning potential
              </p>

              {/* SLIDER */}
              <div className="mt-10">
                <input
                  type="range"
                  min={MIN_INSTALLATIONS}
                  max={MAX_INSTALLATIONS}
                  value={installations}
                  onChange={(e) => setInstallations(Number(e.target.value))}
                  className="w-full h-[10px] appearance-none rounded-full cursor-pointer slider"
                  style={{
                    background: `linear-gradient(90deg, #074A4D ${percentage}%, #F3F3F3 ${percentage}%)`,
                  }}
                />

                <div className="flex justify-between mt-4 text-xs md:text-base font-normal leading-normal text-[#6B7280]">
                  {Array.from(
                    { length: MAX_INSTALLATIONS - MIN_INSTALLATIONS + 1 },
                    (_, i) => (
                      <span key={i}>{MIN_INSTALLATIONS + i}</span>
                    ),
                  )}
                </div>
              </div>
            </div>

            {/* INFO BOX */}
            <div className="mt-8 bg-[#FEF3E8]  border-l-2 border-[#F88A22] rounded-xl px-5 py-4 flex items-start gap-3 max-w-full">
              <div className="text-[#F5B301] text-lg mt-[1px]">💡</div>

              <p className="text-xs md:text-base font-normal leading-normal text-[#123532]">
                Referring just one home a week builds a steady, predictable income — with Flarize doing all the work, and standing behind your name, after your introduction.

              </p>
            </div>
          </div>

          {/* RIGHT CARD */}
          <div className="w-full lg:max-w-[460px] bg-[#074A4D] rounded-2xl px-4 py-6 text-white ">
            <div className="text-center">
              <p className="text-base md:text-xl font-normal md:font-semibold leading-snug text-[#D1D5DB]">
                Estimated Monthly Earnings
              </p>

              <h2 className="text-4xl md:text-7xl text-[#FEF3E8] leading-tight font-semibold mt-5">
                ₹{monthlyEarnings.toLocaleString()}
              </h2>

              <p className="text-xs md:text-base font-normal leading-normal text-[#D1D5DB] mt-5">
                Based on {installations} installations at average 5kW commission
              </p>
            </div>

            {/* STATS */}
            <div className="mt-8 space-y-5 text-xs md:text-base font-normal leading-normal">
              <div className="flex items-center justify-between">
                <span className="text-[#B2B2B2]">Installations</span>
                <span className=" text-white">{installations}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#B2B2B2]">Avg. commission</span>
                <span className="text-white">₹8,000</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#B2B2B2]">Annual potential</span>
                <span className=" text-white">
                  ₹{annualPotential.toLocaleString()}
                </span>
              </div>
            </div>

            {/* FOOTER */}
            <div className="mt-8 flex items-center justify-center gap-2 text-[#4ADE80] text-xs md:text-base font-normal leading-normal">
              <span>
                <ChartLine width={18} height={18} />
              </span>
              <span>Potential for growth</span>
            </div>
          </div>
        </div>

        {/* BUTTON */}
        <div className="flex  justify-center mt-10">
          <Link
            href="#form"
            className="bg-[#F7BA41] w-full lg:w-fit text-base md:text-xl font-semibold leading-snug cursor-pointer hover:bg-[#e5a51f] transition-all duration-300 text-[#000000] px-10 md:px-20 py-4 rounded-xl shadow-[0_10px_25px_rgba(242,178,51,0.35)] flex items-center justify-center gap-3"
          >
            
            Apply as Partner
          </Link>
        </div>

        {/* FOOTER TEXT */}
        <p className="hidden lg:block text-center text-xs md:text-base font-normal leading-normal text-[#757575] mt-4 mx-auto">
          Unlike pay-per-lead programs, you earn a fixed amount per completed installation, not per form fill — so lead-quality swings never cut your payout, and a deal that stalls is Flarize&apos;s problem to finish, not yours.
        </p>
      </div>

      <style>
        {`
        .slider {
        -webkit-appearance: none;
        appearance: none;
        height: 10px;
        border-radius: 999px;
        outline: none;
        transition: background 0.3s ease;
        }

        /* CHROME / SAFARI */
        .slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;

        width: 20px;
        height: 20px;
        border-radius: 999px;

        background: #045457;

        cursor: pointer;

        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
        transition: transform 0.2s ease;
        }

        .slider::-webkit-slider-thumb:hover {
        transform: scale(1.08);
        }

        /* FIREFOX */
        .slider::-moz-range-thumb {
        width: 20px;
        height: 20px;
        border-radius: 999px;

        background: #045457;
        border: 3px solid white;

        cursor: pointer;

        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
        } `}
      </style>
    </section>
  );
};

export default Earnings;
