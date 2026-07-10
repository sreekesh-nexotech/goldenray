"use client";

import { useState } from "react";

// ─── Reward model ─────────────────────────────────────────────────────────────
const MIN_FAMILIES = 5;
const MAX_FAMILIES = 10;
const REFERRAL_RATE = 1000; // ₹ per family
const COORDINATOR_BONUS = 4500; // flat ₹, only when coordinating

const inr = (n: number) => n.toLocaleString("en-IN");

const CalculateRewards = () => {
  const [families, setFamilies] = useState(7);
  const [coordinating, setCoordinating] = useState(true);

  const referralEarning = families * REFERRAL_RATE;
  const coordinatorBonus = coordinating ? COORDINATOR_BONUS : 0;
  const total = referralEarning + coordinatorBonus;

  // Filled portion of the slider track (green → grey).
  const pct =
    ((families - MIN_FAMILIES) / (MAX_FAMILIES - MIN_FAMILIES)) * 100;

  const ticks = Array.from(
    { length: MAX_FAMILIES - MIN_FAMILIES + 1 },
    (_, i) => MIN_FAMILIES + i,
  );

  return (
    <section className="relative py-12 sm:py-14 md:py-16 lg:py-20 xl:py-24 2xl:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <h2 className="text-[#123532] text-4xl md:text-5xl font-semibold leading-tight text-center mb-8 sm:mb-10 md:mb-12">
          Calculate your group rewards
        </h2>

        {/* Calculator card */}
        <div className="rounded-3xl bg-white p-6 sm:p-8 md:p-10 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.18)] ring-1 ring-black/5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* ── Left: controls ── */}
            <div className="flex flex-col">
              <h3 className="text-[#123532] text-xl md:text-2xl font-semibold mb-6">
                Families in your group
              </h3>

              {/* Slider */}
              <input
                type="range"
                min={MIN_FAMILIES}
                max={MAX_FAMILIES}
                step={1}
                value={families}
                onChange={(e) => setFamilies(Number(e.target.value))}
                aria-label="Families in your group"
                className="gr-range w-full"
                style={{
                  background: `linear-gradient(to right, #16A34A ${pct}%, #E5E7EB ${pct}%)`,
                }}
              />

              {/* Tick labels */}
              <div className="mt-3 flex justify-between text-xs sm:text-sm text-[#6B7280]">
                {ticks.map((t) => (
                  <span key={t}>
                    {t === MIN_FAMILIES
                      ? `${t}(Min)`
                      : t === MAX_FAMILIES
                        ? `${t}(Max)`
                        : t}
                  </span>
                ))}
              </div>

              {/* Coordinating toggle */}
              <div className="mt-7 flex items-center justify-between gap-4 rounded-2xl bg-[#F3F4F6] px-5 py-4">
                <div>
                  <div className="text-[#123532] text-base md:text-lg font-semibold">
                    I&apos;m coordinating this group
                  </div>
                  <div className="text-[#6B7280] text-xs sm:text-sm mt-0.5">
                    Organising the group, gathering families, liaising with
                    Flarize
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={coordinating}
                  aria-label="I'm coordinating this group"
                  onClick={() => setCoordinating((v) => !v)}
                  className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200 ${
                    coordinating ? "bg-[#F7BA41]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
                      coordinating ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Disclaimer */}
              <p className="mt-6 text-[#9CA3AF] hidden sm:block sm:text-sm leading-relaxed">
                Estimates only, based on Flarize&apos;s group purchase referral
                program. Final payout is confirmed once the group&apos;s solar
                installations are completed. Per-family referral rate is fixed
                regardless of group size — bigger groups simply mean more
                referrals. The ₹10,000/family discount is a group purchase saving
                for each household, separate from your referral earnings.
              </p>
            </div>

            {/* ── Right: results ── */}
            <div className="flex flex-col gap-4">
              {/* Total earning */}
              <div className="rounded-2xl bg-[#16A34A] px-6 py-6 text-center text-white">
                <div className="text-sm md:text-base font-medium text-white/90">
                  Your total earning
                </div>
                <div className="mt-1 text-4xl md:text-5xl font-bold tracking-tight">
                  ₹ {inr(total)}
                </div>
              </div>

              {/* Stat cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-[#CDEAD8] bg-[#EAF7EF] px-4 py-4 text-center">
                  <div className="text-[#6B7280] text-xs sm:text-sm">
                    Referral earning
                  </div>
                  <div className="mt-1 text-[#123532] text-lg md:text-xl font-semibold">
                    ₹{inr(referralEarning)}
                  </div>
                </div>
                <div className="rounded-2xl border border-[#CDEAD8] bg-[#EAF7EF] px-4 py-4 text-center">
                  <div className="text-[#6B7280] text-xs sm:text-sm">
                    Coordinator bonus
                  </div>
                  <div className="mt-1 text-[#123532] text-lg md:text-xl font-semibold">
                    ₹{inr(coordinatorBonus)}
                  </div>
                </div>
              </div>

              {/* Breakdown */}
              <div className="rounded-2xl bg-[#F3F4F6] px-5 py-5">
                <div className="flex items-center justify-between gap-4 text-sm md:text-base text-[#4B5563]">
                  <span>
                    {families} families × ₹{inr(REFERRAL_RATE)} referral rate
                  </span>
                  <span className="font-medium text-[#123532]">
                    ₹{inr(referralEarning)}
                  </span>
                </div>
                {coordinating && (
                  <div className="mt-3 flex items-center justify-between gap-4 text-sm md:text-base text-[#4B5563]">
                    <span>Coordinator bonus (flat)</span>
                    <span className="font-medium text-[#123532]">
                      ₹{inr(coordinatorBonus)}
                    </span>
                  </div>
                )}
                <div className="mt-3 flex items-center justify-between gap-4 border-t border-[#E5E7EB] pt-3 text-sm md:text-base font-semibold text-[#123532]">
                  <span>Your total earnings</span>
                  <span>₹{inr(total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              className="rounded-lg bg-[#F7BA41] px-16 py-3.5 text-base font-semibold text-[#123532] transition-colors hover:bg-yellow-500"
            >
              Start your group
            </button>
          </div>
          {/* Disclaimer */}
              <p className="mt-6 text-[#9CA3AF] block sm:hidden text-xs leading-relaxed">
                Estimates only, based on Flarize&apos;s group purchase referral
                program. Final payout is confirmed once the group&apos;s solar
                installations are completed. Per-family referral rate is fixed
                regardless of group size — bigger groups simply mean more
                referrals. The ₹10,000/family discount is a group purchase saving
                for each household, separate from your referral earnings.
              </p>
        </div>
      </div>

      <style jsx>{`
        .gr-range {
          -webkit-appearance: none;
          appearance: none;
          height: 6px;
          border-radius: 9999px;
          outline: none;
          cursor: pointer;
        }
        .gr-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 9999px;
          background: #16a34a;
          border: 3px solid #ffffff;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
          cursor: pointer;
        }
        .gr-range::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 9999px;
          background: #16a34a;
          border: 3px solid #ffffff;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
          cursor: pointer;
        }
      `}</style>
    </section>
  );
};

export default CalculateRewards;
