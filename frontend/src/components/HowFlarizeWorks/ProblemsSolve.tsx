import React from "react";

const PROBLEM_TITLE_CLASS =
  "text-xs md:text-sm font-semibold leading-snug text-[#D14343]";
const PROBLEM_DESC_CLASS = "text-[#AC4848] text-xs font-normal leading-relaxed";
const SOLUTION_TITLE_CLASS =
  "text-xs md:text-sm font-semibold leading-snug text-[#138A4B]";
const SOLUTION_DESC_CLASS =
  "text-[#3A724F] text-xs font-normal leading-relaxed";
const PROBLEM_ICON = (
  <svg width="36" height="36" fill="none" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="12" fill="#FFFFFF" />
    <path
      d="M15 9L9 15M9 9l6 6"
      stroke="#E24A4A"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
  </svg>
);
const SOLUTION_ICON = (
  <svg width="36" height="36" fill="none" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="12" fill="#FFFFFF" />
    <path
      d="M8 12.5l3 3 5-5"
      stroke="#1A9B5A"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
  </svg>
);

const CARDS = [
  {
    problem: {
      title: "One Quote, Take it or Leave it",
      desc: "Hard to know if the price is fair or the system is right for your home.",
    },
    solution: {
      title: "3 Transparent Quotes, You Compare",
      desc: "Three checked choices — different brands and budgets, same guarantee. You can see what's fair.",
    },
  },
  {
    problem: {
      title: "Weeks of Waiting After Payment",
      desc: "Many installers order parts only after you pay, so everything drags.",
    },
    solution: {
      title: "Installation in Days, Not Weeks",
      desc: "Pre-packed kits and a local team. Payment follows real progress, so no one is paid for unfinished work.",
    },
  },
  {
    problem: {
      title: "Support Ends After Installation",
      desc: "When something fails later, homeowners struggle to get anyone to help.",
    },
    solution: {
      title: "One Brand. Long-Term Support.",
      desc: "You deal with Flarize for 25 years — monitoring, service, and a written guarantee. One number, the whole time.",
    },
  },
];

const ProblemsSolve = () => {
  return (
    <section className="relative z-10 container mx-auto px-4 py-10 pb-6 md:py-20 xl:py-16 max-w-7xl flex flex-col items-center h-full gap-8">
      {/* Heading and description */}
      <div className="w-full max-w-7xl mx-auto text-center mb-6">
        <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-[#123532] mb-4">
          Real Problems Kerala Solar Buyers Face — And How Flarize Solves Each
          One
        </h2>
        <p className="hidden text-center sm:block text-sm md:text-lg font-normal leading-relaxed text-[#4B5563]">
          Based on real complaints from Kerala&apos;s largest solar community —
          90,000+ members across Facebook groups,
          <br />
          WhatsApp communities, and consumer forums.
        </p>
      </div>

      {/* Problem/Solution Cards */}
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-6">
        {CARDS.map((card, idx) => (
          <div
            key={idx}
            className="bg-[#F8F2E1] rounded-2xl p-7 md:p-8 flex flex-col gap-5 border border-[#EFE7D7]"
          >
            {/* Problem */}
            <div className="flex items-start gap-3">
              <span className="mt-1">{PROBLEM_ICON}</span>
              <div>
                <div className={PROBLEM_TITLE_CLASS}>{card.problem.title}</div>
                <div className={PROBLEM_DESC_CLASS}>{card.problem.desc}</div>
              </div>
            </div>
            <hr className="border-t border-[#E7DEC9]" />
            {/* Solution */}
            <div className="flex items-start gap-3">
              <span className="mt-1">{SOLUTION_ICON}</span>
              <div>
                <div className={SOLUTION_TITLE_CLASS}>
                  {card.solution.title}
                </div>
                <div className={SOLUTION_DESC_CLASS}>{card.solution.desc}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProblemsSolve;
