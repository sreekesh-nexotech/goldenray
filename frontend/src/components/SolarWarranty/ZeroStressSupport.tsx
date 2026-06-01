import React from "react";

const services = [
  {
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M14 3v6h6M8 13h8M8 17h5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "Warranty Filing",
    description:
      "We handle all paperwork and claims directly with panel and inverter manufacturers on your behalf. No forms to fill, no manufacturer portals to navigate, no follow-up calls.",
  },
  {
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M3 9 12 3l9 6M5 9v10h14V9"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M9 19v-6M12 19v-6M15 19v-6M3 21h18"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: "KSEB Liaison",
    description:
      "Help with net metering delays, tariff revision disputes, or billing errors? Our team manages KSEB correspondence across all Kerala districts so you do not have to.",
  },
  {
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="m13 2-9 12h7l-1 8 9-12h-7l1-8Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "Surge Protection",
    description:
      "Every Flarize installation includes a site-specific lightning protection assessment before Kerala's monsoon season. We flag risks proactively — not after a fault occurs.",
  },
  {
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="m4 17 6-6 4 4 6-7"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15 8h5v5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "Transfer Support",
    description:
      "Moving to a new address in Kerala? We coordinate safe dismantling, transport, and reinstallation of your solar system — maintaining your warranty continuity throughout.",
  },
];

const ZeroStressSupport = () => {
  return (
    <section className="relative w-full bg-white py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-[#123532] mb-4">
            Zero Cost, Zero Stress Support
          </h2>
          <p className="text-sm md:text-xl font-normal leading-relaxed text-[#4B5563] max-w-3xl mx-auto">
            Free value-added services included with every Flarize installation.
          </p>
        </div>

        <div className="md:hidden flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {services.map((s) => (
            <div
              key={s.title}
              className="min-w-[85%] snap-start rounded-2xl bg-[#0E3A3A] text-white p-6 sm:p-7 flex flex-col"
            >
              <div className="mb-5 text-white">{s.icon}</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3">
                {s.title}
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed text-white/85">
                {s.description}
              </p>
            </div>
          ))}
        </div>

        <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {services.map((s) => (
            <div
              key={s.title}
              className="rounded-2xl bg-[#0E3A3A] text-white p-6 sm:p-7 flex flex-col"
            >
              <div className="mb-5 text-white">{s.icon}</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3">
                {s.title}
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed text-white/85">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ZeroStressSupport;
