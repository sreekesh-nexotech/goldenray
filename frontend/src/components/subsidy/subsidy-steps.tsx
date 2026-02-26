export default function SubsidySteps() {
  const steps = [
    {
      number: "01",
      title: "Check Eligibility & Get Your Free Quote",
      description:
        "Use our free calculator or call us. We check your roof, electricity bill, and local KSEB rules to give you a personalised quote within 24 hours.",
      bgColor: "#FDF6D2",
      circleBgColor: "#EFE9C8",
      numberColor: "#9E9467",
    },
    {
      number: "02",
      title: "We Handle All Paperwork for You",
      description:
        "We take care of PM Surya Ghar portal registration, KSEB net meter application, bank loan documentation, and all government approvals. You don\u2019t visit any office.",
      bgColor: "#FBE8DA",
      circleBgColor: "#EDD9C8",
      numberColor: "#957A67",
    },
    {
      number: "03",
      title: "We Install Your System",
      description:
        "Our certified team installs your rooftop solar system in 2\u20133 days with Tier-1 panels and a 25-year performance warranty. Zero disruption to your daily life.",
      bgColor: "#D0F1F3",
      circleBgColor: "#C5E8EA",
      numberColor: "#43686A",
    },
    {
      number: "04",
      title: "Subsidy Credited to Your Bank",
      description:
        "After KSEB inspection and net meter installation, the government credits up to \u20B978,000 directly to your bank account within 45\u201360 days.",
      bgColor: "#DEF5DE",
      circleBgColor: "#D0E8D0",
      numberColor: "#778F71",
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-18 lg:py-20 xl:py-24 2xl:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
        {/* Heading */}
        <div className="text-center mb-8 sm:mb-12 md:mb-14 lg:mb-16 xl:mb-18 2xl:mb-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl 2xl:text-5xl font-bold text-[#123532] mb-2 sm:mb-3 lg:mb-4 xl:mb-4 2xl:mb-5">
            Get Your Solar Subsidy in 4 Simple Steps
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-xl xl:text-2xl 2xl:text-2xl text-[#666666]">
            Phase-by-Phase Breakdown — From Site Visit to Bank Credit
          </p>
        </div>

        {/* Steps Container */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-6 xl:gap-8 2xl:gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="rounded-2xl sm:rounded-3xl lg:rounded-3xl xl:rounded-4xl 2xl:rounded-4xl p-4 sm:p-8 md:p-6 lg:p-8 xl:p-10 2xl:p-12 flex flex-col items-center justify-start text-center transition-transform hover:scale-105"
              style={{
                backgroundColor: step.bgColor,
                minHeight: "240px",
              }}
            >
              {/* Circular Badge with Number */}
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 xl:w-28 xl:h-28 2xl:w-32 2xl:h-32 rounded-full flex items-center justify-center mb-4 sm:mb-6 md:mb-6 lg:mb-8 xl:mb-8 2xl:mb-10 flex-shrink-0 mt-4 sm:mt-0"
                style={{ backgroundColor: step.circleBgColor }}
              >
                <span
                  className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-6xl 2xl:text-7xl font-semibold"
                  style={{ color: step.numberColor }}
                >
                  {step.number}
                </span>
              </div>

              {/* Step Title */}
              <h3 className="text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-2xl 2xl:text-2xl font-semibold text-[#123532] leading-tight px-1 sm:px-2">
                {step.title}
              </h3>

              {/* Step Description */}
              {step.description && (
                <p className="text-xs sm:text-sm md:text-base lg:text-base xl:text-base 2xl:text-lg text-[#666666] leading-relaxed px-1 sm:px-2 mt-2 sm:mt-3 lg:mt-4 xl:mt-4 2xl:mt-5">
                  {step.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
