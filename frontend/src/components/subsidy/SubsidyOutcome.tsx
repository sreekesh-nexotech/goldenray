"use client";

import Link from "next/link";
import { Check, Info, ListChecks, ReceiptText, RotateCcw } from "lucide-react";
import { formatRupees, type SubsidyEstimate } from "./eligibility";

interface SubsidyOutcomeProps {
  estimate: SubsidyEstimate;
  /** Reopens the four-question check with a clean slate. */
  onRestart: () => void;
}

/** Site-wide lead form at the bottom of the page. */
const LEAD_FORM_ANCHOR = "#footer";
/** The "how much subsidy can you get" explainer further down this page. */
const SUBSIDY_INFO_ANCHOR = "#subsidy-amounts";

function CardFooterLinks() {
  return (
    <div className="mt-8 border-t border-[#EDEDED] pt-5 text-center text-xs sm:text-[13px]">
      <span className="text-[#8A8A8A]">
        Need help understanding your subsidy?{" "}
      </span>
      <Link
        href={SUBSIDY_INFO_ANCHOR}
        className="font-semibold text-[#123532] underline-offset-2 hover:underline"
      >
        Read more about subsidy
      </Link>
    </div>
  );
}

function RestartButton({ onRestart }: { onRestart: () => void }) {
  return (
    <button
      type="button"
      onClick={onRestart}
      className="inline-flex cursor-pointer items-center gap-2 text-sm text-[#8A8A8A] transition-colors hover:text-[#123532]"
    >
      <RotateCcw className="h-4 w-4" aria-hidden="true" />
      Check Another Estimate
    </button>
  );
}

export default function SubsidyOutcome({
  estimate,
  onRestart,
}: SubsidyOutcomeProps) {
  return (
    <section
      id="subsidy-result"
      className="w-full scroll-mt-24 px-4 pb-6 pt-2 sm:px-6 lg:px-8"
    >
      {/* Layered shadow: a tight contact shadow over a wide soft one, so the
          card lifts off the page instead of just looking blurred. */}
      <div className="mx-auto max-w-5xl rounded-3xl bg-white p-6 shadow-[0_2px_6px_rgba(18,53,50,0.06),0_10px_24px_rgba(18,53,50,0.10),0_30px_80px_rgba(18,53,50,0.16)] ring-1 ring-black/5 sm:p-10 lg:p-12">
        {estimate.eligible ? (
          <>
            <div className="text-center">
              <span className="inline-flex items-center rounded-full bg-[#DDEFE3] px-3 py-1 text-[11px] font-bold text-[#0E7A55]">
                🎉 Congratulations!
              </span>
              <h2 className="mt-4 text-2xl font-bold leading-snug text-[#123532] sm:text-3xl">
                Good News! You May Be Eligible for a Solar Subsidy
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-xs text-[#8A8A8A] sm:text-sm">
                Based on the information you provided, your home appears to meet
                the basic eligibility criteria for the subsidy.
              </p>
            </div>

            <div className="relative mt-8 overflow-hidden rounded-2xl bg-[#3B8A4E] px-6 py-8 text-center text-white">
              <ReceiptText
                className="pointer-events-none absolute right-6 top-1/2 hidden h-20 w-20 -translate-y-1/2 text-white/15 sm:block"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/80">
                Estimated Subsidy
              </p>
              <p className="mt-2 text-4xl font-bold sm:text-5xl">
                {formatRupees(estimate.subsidy)}
              </p>
              <p className="mt-2 text-[11px] text-white/80 sm:text-xs">
                Based on an estimated solar system {estimate.systemKw} kW
              </p>
            </div>

            <div className="mt-8 flex items-center gap-2">
              <ListChecks
                className="h-4 w-4 text-[#ED8723]"
                aria-hidden="true"
              />
              <h3 className="text-[12px] font-bold text-[#123532]">
                Why you may be eligible
              </h3>
            </div>

            <ul className="mt-4 grid gap-5 sm:grid-cols-3">
              {estimate.reasons.map(({ title, detail }) => (
                <li key={title} className="flex items-start gap-2.5">
                  <span
                    className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#DDEFE3]"
                    aria-hidden="true"
                  >
                    <Check className="h-2.5 w-2.5 text-[#0E7A55]" strokeWidth={4} />
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold leading-tight text-[#123532]">
                      {title}
                    </p>
                    <p className="mt-1 text-[11px] leading-snug text-[#9AA3A2]">
                      {detail}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex gap-3 rounded-xl border border-[#F2DFB4] bg-[#FFF9EF] px-4 py-3">
              <Info
                className="mt-0.5 h-4 w-4 shrink-0 text-[#ED8723]"
                aria-hidden="true"
              />
              <p className="text-[11px] leading-relaxed text-[#8A8A8A] sm:text-xs">
                <span className="font-semibold text-[#123532]">
                  Please note:
                </span>{" "}
                This is an initial eligibility estimate. Final eligibility and
                subsidy amount are subject to official verification and sanction
                by relevant government authorities and discoms.
              </p>
            </div>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
              <Link
                href={LEAD_FORM_ANCHOR}
                className="btn bg-[#F7BA41] text-[#272218] hover:bg-[#e5a934]"
              >
                Get My Free Solar Quote
              </Link>
              <RestartButton onRestart={onRestart} />
            </div>
          </>
        ) : (
          <>
            <div className="text-center">
              <span className="inline-flex items-center rounded-full bg-[#FDE7EA] px-3 py-1 text-[11px] font-bold text-[#C0344A]">
                Subsidy Not Available
              </span>
              <h2 className="mt-4 text-2xl font-bold leading-snug text-[#123532] sm:text-3xl">
                You Can Still Go Solar Without the Subsidy
              </h2>
            </div>

            <div className="mt-6 rounded-2xl bg-[#DDEFE3] px-6 py-5 text-center text-xs font-medium leading-relaxed text-[#123532] sm:text-[13px]">
              <p>
                Your selected system may not qualify for the government subsidy,
                but that doesn&apos;t mean solar isn&apos;t an option.
              </p>
              <p>
                You can still install a solar system without claiming the
                subsidy.
              </p>
            </div>

            <p className="mt-7 text-center text-base font-bold text-[#123532] sm:text-lg">
              No Subsidy? No Problem.
            </p>
            <p className="mx-auto mt-2 max-w-2xl text-center text-xs leading-relaxed text-[#8A8A8A] sm:text-[13px]">
              Your current selection may not qualify for the government subsidy.
              You can still install solar and enjoy lower electricity bills
              without claiming the subsidy.{" "}
              <span className="font-semibold text-[#123532]">
                Want to know what&apos;s possible for your home?
              </span>
            </p>

            <div className="mt-7 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
              <Link
                href={LEAD_FORM_ANCHOR}
                className="btn bg-[#F7BA41] text-[#272218] hover:bg-[#e5a934]"
              >
                Talk to Our Team
              </Link>
              <RestartButton onRestart={onRestart} />
            </div>
          </>
        )}

        <CardFooterLinks />
      </div>
    </section>
  );
}
