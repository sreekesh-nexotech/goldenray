import { Check, Landmark } from "lucide-react";
import LinkingButton from "../ui/LinkingButton";

const benefits = [
  {
    title: "Flexible EMI Options",
    desc: "Choose from 12 to 60 months repayment terms with zero down-payment options.",
  },
  {
    title: "Government Subsidy Integration",
    desc: "We help you secure up to ₹78,000 via PM Surya Ghar Muft Bijli Yojana directly to your bank account.",
  },
  {
    title: "Payback Period of ~5 Years",
    desc: "A home using 250+ units a month typically recovers the cost in 3–5 years. After that, the system keeps producing — for 20+ more years. Check your own numbers in the savings calculator.",
  },
];

const LoanApprovalCard = () => (
  <div className="w-full rounded-3xl bg-white p-5 shadow-[0_12px_40px_rgba(18,53,50,0.08)] md:p-7">
    <div className="flex items-center justify-between gap-3">
      <h3 className="text-lg md:text-xl font-bold text-[#123532]">
        Quick Loan Approval
      </h3>
      <span className="shrink-0 rounded-full bg-[#DCFCE7] px-3 py-1 text-[11px] md:text-xs font-medium text-[#008130]">
        Paperless Process
      </span>
    </div>

    {/* Approved application row — the bars stand in for the applicant's
        details, so they are decorative only. */}
    <div className="mt-5 flex items-center gap-4 rounded-2xl bg-[#F3F4F6] px-4 py-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#074A4D]">
        <Landmark
          className="h-5 w-5 text-white"
          strokeWidth={2}
          aria-hidden="true"
        />
      </span>
      <span aria-hidden="true" className="flex flex-1 flex-col gap-2">
        <span className="block h-2 w-full rounded-full bg-[#D9DBDE]" />
        <span className="block h-2 w-2/3 rounded-full bg-[#D9DBDE]" />
      </span>
      <Check
        className="h-5 w-5 shrink-0 text-[#008130]"
        strokeWidth={3}
        aria-hidden="true"
      />
    </div>

    <div className="mt-4 rounded-2xl border border-dashed border-[#D9DBDE] px-4 py-5 text-center">
      <p className="text-xs md:text-sm text-[#757575]">
        Low interest rates specifically for green energy
      </p>
      <p className="mt-2">
        <span className="text-3xl md:text-4xl font-bold text-[#123532]">
          5.75%
        </span>{" "}
        <span className="text-sm md:text-base font-medium text-[#9CA3AF]">
          Fixed p.a.
        </span>
      </p>
    </div>

    <div className="mt-5 flex flex-col gap-4 border-t border-[#B2B2B233] pt-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-[11px] md:text-xs font-medium uppercase tracking-wide text-[#9CA3AF]">
          Example EMI
        </p>
        <p className="mt-1 text-xl md:text-2xl font-bold text-[#123532]">
          ≈ ₹2,330/mo
        </p>
        <p className="mt-1 text-[10px] md:text-[11px] uppercase tracking-wide text-[#9CA3AF]">
          3kW after subsidy (₹1.17 lakh, 5 years at 7.15%)
        </p>
      </div>

      <LinkingButton
        content="Check My EMI"
        ButtonLink="/emi-calculator"
        ButtonBg="bg-[#F7BA41]"
        Buttontext="text-[#272218]"
        ButtonHover="hover:bg-yellow-500"
        className="w-full justify-center px-8 py-3 sm:w-auto"
      />
    </div>
  </div>
);

const FinancingYourFuture = () => {
  return (
    <div className="relative w-full bg-gradient-to-b from-[#FDF7E9] to-white">
      <section className="relative z-10 container mx-auto px-4 py-10 md:py-16 max-w-7xl">
        {/* Card sits left of the copy on desktop and below it on phones */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-14">
          <div className="order-2 w-full lg:order-1 lg:w-1/2">
            <LoanApprovalCard />
          </div>

          <div className="order-1 w-full lg:order-2 lg:w-1/2">
            <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-[#123532]">
              Financing Your Future,
              <br />
              Made Simple
            </h2>
            <p className="mt-4 text-sm md:text-base leading-relaxed text-[#757575]">
              We believe every Kerala home deserves solar. Our financing partners
              offer customized plans to ensure your monthly savings are higher
              than your EMIs.
            </p>

            <ul className="mt-6 flex flex-col gap-5">
              {benefits.map(({ title, desc }) => (
                <li key={title} className="flex items-start gap-3">
                  <Check
                    className="mt-0.5 h-5 w-5 shrink-0 text-[#008130]"
                    strokeWidth={3}
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="text-base md:text-lg font-bold leading-snug text-[#123532]">
                      {title}
                    </h3>
                    <p className="mt-1 text-xs md:text-sm font-normal leading-relaxed text-[#5B7A6E]">
                      {desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FinancingYourFuture;
