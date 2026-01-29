export default function SubsidySteps() {
  const steps = [
    {
      number: "01",
      title: "Check Eligibility & Get Your Free Quote",
      bgColor: "#FDF6D2",
      circleBgColor: "#EFE9C8",
      numberColor: "#9E9467",
    },
    {
      number: "02",
      title: "We Handle All Paperwork for You",
      bgColor: "#FBE8DA",
      circleBgColor: "#EDD9C8",
      numberColor: "#957A67",
    },
    {
      number: "03",
      title: "We Install Your System",
      bgColor: "#D0F1F3",
      circleBgColor: "#C5E8EA",
      numberColor: "#43686A",
    },
    {
      number: "04",
      title: "Subsidy Credited to Your Bank",
      bgColor: "#DEF5DE",
      circleBgColor: "#D0E8D0",
      numberColor: "#778F71",
    },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#123532] mb-2 sm:mb-3">
            Get Your Solar Subsidy in 4 Simple Step
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-[#666666]">
            Phase-by-Phase Breakdown
          </p>
        </div>

        {/* Steps Container */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-10 lg:p-12 flex flex-col items-center justify-start text-center transition-transform hover:scale-105"
              style={{
                backgroundColor: step.bgColor,
                minHeight: "240px",
              }}
            >
              {/* Circular Badge with Number */}
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full flex items-center justify-center mb-4 sm:mb-6 md:mb-6 lg:mb-8 flex-shrink-0 mt-4 sm:mt-0"
                style={{ backgroundColor: step.circleBgColor }}
              >
                <span
                  className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold"
                  style={{ color: step.numberColor }}
                >
                  {step.number}
                </span>
              </div>

              {/* Step Title */}
              <h3 className="text-sm sm:text-lg md:text-xl lg:text-2xl font-semibold text-[#123532] leading-tight px-1 sm:px-2">
                {step.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
