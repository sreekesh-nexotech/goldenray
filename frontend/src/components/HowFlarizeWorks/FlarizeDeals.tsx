import React from "react";

const iconClass = "flex flex-col items-center justify-center text-center gap-2";

const steps = [
  {
    label: "Homeowner",
    sub: "One simple contact",
    icon: "https://golden-ray.b-cdn.net/icons/fluent-color_home-16.png",
    alt: "Homeowner",
    variant: "outer",
  },
  {
    label: "Flarize",
    sub: "We handle it end-to-end",
    icon: "https://golden-ray.b-cdn.net/icons/fevi.png",
    alt: "Flarize",
    variant: "center",
  },
  {
    label: "Certified installers",
    sub: "Verified by Flarize",
    icon: "https://golden-ray.b-cdn.net/icons/noto_man-construction-worker.png",
    alt: "Certified installers",
    variant: "outer",
  },
];

const leftPoints = [
  "A certified installer we picked and checked",
  "BIS-certified panels and inverter",
  "Service after install, for the life of the system",
];

const rightPoints = [
  "KSEB net metering application and approval",
  "Your ₹78,000 PM Surya Ghar subsidy paperwork",
  "One number to call if anything goes wrong",
];

const Check = () => (
  <span className="mt-1 flex-shrink-0 text-[#074A4D]">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 13l4 4L19 7"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </span>
);

const FlarizeDeals = () => {
  return (
    <section className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-6 md:py-20 xl:py-16 flex flex-col items-center h-full gap-8">
      {/* Heading and description */}
      <div className="w-full max-w-7xl mx-auto text-center mb-4">
        <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-[#123532] mb-4">
          
        </h2>
        <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-[#123532] mb-4 md:whitespace-nowrap">
            You Deal with Flarize. We Deal with Everyone Else.
        </h2>
        <p className="font-normal  text-sm md:text-lg leading-relaxed text-[#4B5563]">
          Dealing with panels, installation, service, and net metering through
          different parties gets confusing — <br className="hidden md:block"/> especially  when something goes
          wrong.
        </p>
      </div>

      {/* Icons and flow */}
      <div className="flex flex-row items-start justify-center gap-4 sm:gap-10 w-full max-w-3xl mb-4">
        {steps.map((step, index) => (
          <React.Fragment key={step.label}>
            <div className={iconClass}>
              <div
                className={`w-20 h-20 sm:w-28 sm:h-28 rounded-full flex items-center justify-center mb-2 ${
                  step.variant === "center"
                    ? "bg-[#123532] border-4 border-[#F7BA41]"
                    : "bg-[#FCF3E0]"
                }`}
              >
                <img
                  src={step.icon}
                  alt={step.alt}
                  className={
                    step.variant === "center"
                      ? "w-10 h-10 sm:w-12 sm:h-12 object-contain"
                      : "w-9 h-9 sm:w-11 sm:h-11 object-contain"
                  }
                />
              </div>
              <div className="text-base md:text-lg font-medium leading-snug text-[#123532]">
                {step.label}
              </div>
              <div className="text-[10px] md:text-xs font-normal leading-normal text-[#757575]">
                {step.sub}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className="flex items-center self-center pt-6 sm:pt-10 text-[#9CA3AF]">
                <svg width="32" height="24" viewBox="0 0 32 24" fill="none">
                  <path
                    d="M2 12h26m0 0l-8-8m8 8l-8 8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Highlighted box */}
      <div className="w-full bg-[#EFB44A] rounded-2xl p-6 md:p-10 flex flex-col gap-6">
        <div className="text-[#123532] text-sm md:text-lg font-normal leading-relaxed">
          You have one point of contact — Flarize — from your first roof visit to
          your 25th year of power. Behind the scenes, we handle everything:
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <ul className="list-none space-y-4 text-[#123532] font-semibold text-sm md:text-lg leading-snug">
            {leftPoints.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <Check />
                {point}
              </li>
            ))}
          </ul>
          <ul className="list-none space-y-4 text-[#123532] font-semibold text-sm md:text-lg leading-snug">
            {rightPoints.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <Check />
                {point}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-lg p-4 md:p-5 text-[#123532] text-sm md:text-base font-normal leading-snug border-l-4 border-[#074A4D]">
          &quot;You never deal with installers or suppliers yourself. Flarize is
          your single point of contact for the full 25-year life of your solar
          system — and we stay responsible the whole time.&quot;
        </div>
      </div>
    </section>
  );
};

export default FlarizeDeals;
