"use client";
import { ChartLine, Rocket } from 'lucide-react';
import React, { useState } from 'react';


const AVG_COMMISSION = 8000;
const MIN_INSTALLATIONS = 1;
const MAX_INSTALLATIONS = 10;

const Earnings = () => {
  const [installations, setInstallations] = useState(5);
  const monthlyEarnings = installations * AVG_COMMISSION;
  const annualPotential = monthlyEarnings * 12;
  const percentage = ((installations - MIN_INSTALLATIONS) / (MAX_INSTALLATIONS - MIN_INSTALLATIONS)) * 100;


  return (
    <section className="relative z-10 container mx-auto px-4 py-10 pb-6 md:py-20 xl:py-16 max-w-7xl flex flex-col items-center h-full gap-8">
      {/* Heading */}
      <div className="w-full max-w-7xl mx-auto text-center mb-8">
        <h2 className="text-3xl xl:text-5xl font-bold text-[#123532] mb-4">
          See How Much You Could Earn This Month
        </h2>
        <p className="hidden sm:block text-[20px] text-[#4B5563]">
          Your earning potential scales directly with the number of introductions you make each month. The calculation is straightforward: every confirmed residential installation earns you a fixed commission credited to your bank account within 7-14 business days
        </p>
      </div>

      {/* Main Card */}
        <div className="w-full max-w-6xl bg-white rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.12)] px-4 md:px-20 py-7 md:py-10">
            
            <div className="flex flex-col lg:flex-row gap-13 justify-between">
            
            {/* LEFT SIDE */}
            <div className="flex-1 flex flex-col gap-4">
                
                <div>
                    <h2 className="text-2xl leading-[32px] font-semibold text-[#111827] max-w-[420px]">
                        How many successful installations can you refer per month?
                    </h2>

                    <p className="text-[#F7BA41] text-base mt-4">
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
                                background: `linear-gradient(90deg, #074A4D ${percentage}%, #F3F3F3 ${percentage}%)`
                            }}
                        />

                        <div className="flex justify-between mt-4 text-sm text-[#6B7280]">
                            <span>1</span>
                            <span>3</span>
                            <span>5</span>
                            <span>7</span>
                            <span>10</span>
                        </div>
                    </div>
                </div>

                {/* INFO BOX */}
                <div className="mt-8 bg-[#FEF3E8]  border-l-2 border-[#F88A22] rounded-xl px-5 py-4 flex items-start gap-3 max-w-full">
                <div className="text-[#F5B301] text-lg mt-[1px]">💡</div>

                <p className="text-sm leading-6 text-[#123532]">
                    Referring just 1 home per week could generate steady monthly income.
                </p>
                </div>
            </div>

            {/* RIGHT CARD */}
            <div className="w-full max-w-[460px] bg-[#074A4D] rounded-2xl px-4 py-6 text-white ">
                
                <div className="text-center">
                <p className="text-lg font-medium text-[#D1D5DB]">
                    Estimated Monthly Earnings
                </p>

                <h1 className="text-4xl md:text-6xl text-[#FEF3E8]  leading-none font-bold mt-5">
                    ₹{monthlyEarnings.toLocaleString()}
                </h1>

                <p className="text-sm text-[#D1D5DB] mt-5 leading-5">
                    Based on {installations} installations at average 5kW commission
                </p>
                </div>

                {/* STATS */}
                <div className="mt-8 space-y-5 text-sm">
                
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
                    <span className=" text-white">₹{annualPotential.toLocaleString()}</span>
                </div>
                </div>

                {/* FOOTER */}
                <div className="mt-8 flex items-center justify-center gap-2 text-[#4ADE80] text-sm">
                <span><ChartLine width={18} height={18} /></span>
                <span>Potential for growth</span>
                </div>
            </div>
            </div>

            {/* BUTTON */}
            <div className="flex justify-center mt-10">
            <button className="bg-[#F7BA41] text-base cursor-pointer  hover:bg-[#e5a51f] transition-all duration-300 text-[#000000] font-semibold px-10 md:px-20 py-4 rounded-xl shadow-[0_10px_25px_rgba(242,178,51,0.35)] flex items-center gap-3">
                <span><Rocket/></span>
                Start Earning Today
            </button>
            </div>

            {/* FOOTER TEXT */}
            <p className="text-center text-sm leading-6 text-[#757575] mt-4 mx-auto">
            Most active Flarize partners refer between 3 and 8 homes per month.
            At the standard residential commission, that translates to Rs.24,000-Rs.48,000 monthly without any capital investment, inventory, or sales pressure.
            Unlike pay-per-lead programs, you earn a fixed amount per installation not per form fill.
            This protects you from lead quality variability.
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