"use client";

import { useEffect, useState } from "react";
import LinkingButton from "../ui/LinkingButton";

// End of FY 2026-27, when the current PM Surya Ghar subsidy window closes (IST).
const SCHEME_DEADLINE = new Date("2027-03-31T23:59:59+05:30");
const SCHEME_DEADLINE_LABEL = "31 March 2027";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getTimeLeft(): TimeLeft {
  const remaining = Math.max(0, SCHEME_DEADLINE.getTime() - Date.now());
  const totalSeconds = Math.floor(remaining / 1000);

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

export default function SubsidyDeadline() {
  // Left null on the server so the markup can't disagree with the client clock.
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setTimeLeft(getTimeLeft());
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  const units = [
    { label: "Days", value: timeLeft?.days },
    { label: "Hours", value: timeLeft?.hours },
    { label: "Minutes", value: timeLeft?.minutes },
    { label: "Secs", value: timeLeft?.seconds },
  ];

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 pb-12 sm:pb-14 lg:pb-16">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl lg:rounded-3xl bg-[#074A4D] p-6 sm:p-8 md:p-10 lg:p-12">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 lg:gap-12">
            {/* Copy */}
            <div className="lg:max-w-xl">
              <p className="text-xs sm:text-sm font-normal text-[#CFDEDD]">
                Scheme closes on{" "}
                <span className="font-semibold text-[#F7BA41]">
                  {SCHEME_DEADLINE_LABEL}
                </span>
              </p>

              <h2 className="mt-2 text-xl sm:text-2xl md:text-3xl font-semibold leading-tight text-white">
                PM Surya Ghar — 2026-27 Subsidy
              </h2>

              <p className="mt-4 text-sm md:text-base leading-relaxed text-[#CFDEDD]">
                Subsidy budgets are released in phases and processed on a
                first-registered basis once your DISCOM&apos;s current batch
                opens.
              </p>
              <p className="mt-3 text-sm md:text-base leading-relaxed text-[#CFDEDD]">
                Subsidy amounts and timelines are governed by PM Surya Ghar
                policy and subject to change. Registering early secures your
                place in the current processing batch — it does not guarantee
                approval.
              </p>
            </div>

            {/* Countdown + CTA */}
            <div className="w-full lg:w-auto lg:shrink-0">
              <div
                className="grid grid-cols-4 gap-2 sm:gap-3"
                role="timer"
                aria-label={`Time remaining until the scheme closes on ${SCHEME_DEADLINE_LABEL}`}
              >
                {units.map(({ label, value }) => (
                  <div
                    key={label}
                    className="rounded-xl bg-[#F7F7F5] px-3 py-3 sm:px-5 sm:py-4 text-center lg:min-w-[76px]"
                  >
                    <p className="text-xl sm:text-2xl md:text-3xl font-bold leading-none text-[#F7BA41] tabular-nums">
                      {value ?? "--"}
                    </p>
                    <p className="mt-1.5 text-[11px] sm:text-sm font-normal text-[#123532]">
                      {label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex justify-center lg:justify-end">
                <LinkingButton
                  content="Register My Interest Now"
                  ButtonLink="#footer"
                  ButtonBg="bg-white"
                  Buttontext="text-[#123532]"
                  ButtonHover="hover:bg-[#eeeeee]"
                  className="w-full sm:w-auto text-sm md:text-base"
                />
              </div>
            </div>
          </div>

          <p className="mt-8 text-[10px] sm:text-xs leading-relaxed text-[#8FAAA9]">
            Source: pmsuryaghar.gov.in · figures published by the Ministry of
            New and Renewable Energy and updated on the official portal. Flarize
            is not a government agency.
          </p>
        </div>
      </div>
    </section>
  );
}
