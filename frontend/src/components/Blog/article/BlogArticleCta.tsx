import Link from "next/link";

const CTA_CARDS = [
  {
    icon: (
      <svg
        className="w-6 h-6 text-[#ED8723]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    title: "Check Subsidy Eligibility",
    description: "Find out which government subsidies you qualify for.",
    cta: "Check Eligibility",
    href: "/subsidy",
    bg: "bg-amber-50",
  },
  {
    icon: (
      <svg
        className="w-6 h-6 text-[#ED8723]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    ),
    title: "Estimate Your Savings",
    description: "Get a personalized solar savings estimate for your home.",
    cta: "Calculate Savings",
    href: "/advanced-calculator",
    bg: "bg-blue-50",
  },
];

export default function BlogArticleCta() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-2 mb-10">
      {CTA_CARDS.map((card, i) => (
        <div
          key={card.title}
          className={`flex-1 rounded-2xl p-5 sm:p-6 flex flex-col gap-3 ${card.bg} border border-transparent ${i === 0 ? "order-1 sm:order-none" : "order-2 sm:order-none"}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0">
              {card.icon}
            </div>
            <h3 className="text-sm font-bold text-[#123532]">{card.title}</h3>
          </div>
          <p className="text-xs text-[#555555] leading-relaxed">
            {card.description}
          </p>
          <Link
            href={card.href}
            className="inline-flex items-center gap-1.5 mt-auto text-sm font-semibold text-[#123532] hover:text-[#ED8723] transition-colors duration-200"
          >
            {card.cta}
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      ))}
    </div>
  );
}
