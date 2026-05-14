import React from 'react';

const PROBLEM_TITLE_CLASS = 'text-sm font-medium text-[#DC2626]';
const PROBLEM_DESC_CLASS = 'text-[#AC4848] text-sm';
const SOLUTION_TITLE_CLASS = 'font-medium text-sm text-[#008130]';
const SOLUTION_DESC_CLASS = 'text-[#3A724F] text-sm';
const PROBLEM_ICON = (
  <svg width="30" height="30" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#FFFFFF"/><path d="M15 9L9 15M9 9l6 6" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/></svg>
);
const SOLUTION_ICON = (
  <svg width="30" height="30" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#D1FAE5"/><path d="M8 12.5l3 3 5-5" stroke="#059669" strokeWidth="2" strokeLinecap="round"/></svg>
);

const CARDS = [
  {
    problem: {
      title: 'One Quote, Take it or Leave it',
      desc: 'Most solar companies give one quote at one price. No comparison possible. You search Facebook groups asking for reviews — because you have no way to know.',
    },
    solution: {
      title: '3 Transparent Quotes, You Compare',
      desc: 'Flarize gives you 3 detailed quotes — different panel + inverter brands at different prices. Same Flarize installation quality across all three. You always know the fair price because you’re comparing options.',
    },
  },
  {
    problem: {
      title: 'Weeks of Waiting After Payment',
      desc: 'Order materials per-customer (1–2 weeks). Ship from warehouse (3–5 days). Send installation team from central office (travel time). Total: 3–6 weeks sitting and hoping.',
    },
    solution: {
      title: 'Pre-Packed + Local Installer = Days',
      desc: 'Your system kit is already boxed. Flarize algorithm pings the nearest certified installer in your pincode — already in your area. Materials dispatched, local team installs. 3–7 days total.',
    },
  },
  {
    problem: {
      title: 'Installer Vanishes After Payment',
      desc: 'Phone switched off. No service. No accountability. 75% of solar complaints happen post-installation — and most companies aren’t around to hear them.',
    },
    solution: {
      title: 'One Brand. One Number. 25 Years',
      desc: 'Flarize owns the relationship. 3 layer support, digital dashboard, and if we can’t fix your system in 48 hours — we pay you for lost energy. No other Kerala company offers this.',
    },
  },
];

const ProblemsSolve = () => {
  return (
    <section className="relative z-10 container mx-auto px-4 py-10 pb-6 md:py-20 xl:py-16 max-w-7xl flex flex-col items-center h-full gap-8">
      {/* Heading and description */}
      <div className="w-full max-w-7xl mx-auto text-center mb-6">
        <h2 className="text-3xl xl:text-5xl font-semibold text-[#123532] mb-4">
          Real Problems Kerala Solar Buyers Face — And How Flarize Solves Each One
        </h2>
        <p className="hidden sm:block text-[20px] text-[#4B5563]">
          Based on real complaints from Kerala&apos;s largest solar community — 90,000+ members across Facebook groups, WhatsApp communities, and consumer forums.
        </p>
      </div>

      {/* Problem/Solution Cards */}
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-6">
        {CARDS.map((card, idx) => (
          <div key={idx} className="bg-[#F7F4E6] rounded-xl p-6 flex flex-col gap-4 shadow-sm">
            {/* Problem */}
            <div className="flex items-start gap-2">
              <span className="mt-1 text-red-500">{PROBLEM_ICON}</span>
              <div>
                <div className={PROBLEM_TITLE_CLASS}>{card.problem.title}</div>
                <div className={PROBLEM_DESC_CLASS}>{card.problem.desc}</div>
              </div>
            </div>
            <hr className="border-t border-[#FFFFFF]" />
            {/* Solution */}
            <div className="flex items-start gap-2">
              <span className="mt-1 text-green-500">{SOLUTION_ICON}</span>
              <div>
                <div className={SOLUTION_TITLE_CLASS}>{card.solution.title}</div>
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