export default function SubsidySteps() {
  const steps = [
    {
      number: "01",
      title: "Check Eligibility & Get Your Free Quote",
      bgColor: "#FDF6D2",
      iconUrl: "https://golden-ray.b-cdn.net/icons/wb_sunny1.png",
    },
    {
      number: "02",
      title: "We Handle All Subsidy Paperwork for You",
      bgColor: "#FBE8DA",
      iconUrl: "https://golden-ray.b-cdn.net/icons/description.png",
    },
    {
      number: "03",
      title: "We Install Your System",
      bgColor: "#ADD6D8",
      iconUrl: "https://golden-ray.b-cdn.net/icons/task_alt.png",
    },
    {
      number: "04",
      title: "Subsidy Credited to Your Bank",
      bgColor: "#FBF1BD",
      iconUrl: "https://golden-ray.b-cdn.net/icons/currency_rupee.png",
    },
  ];

  return (
    <section
      className="py-16"
      style={{
        background:
          "radial-gradient(80.96% 80.14% at 50% 8.3%, #F8F2E1 0%, rgba(255, 255, 255, 0) 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#123532] mb-3">
            Get Your Solar Subsidy in 4 Simple Step
          </h2>
          <p className="text-lg md:text-xl text-[#444444]">
            Phase-by-Phase Breakdown
          </p>
        </div>

        {/* Steps Container - Horizontal scroll on mobile, grid on desktop */}
        <div className="mt-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className="rounded-3xl p-4 md:p-10 min-h-[180px] md:min-h-[300px] flex flex-col justify-between relative overflow-hidden"
                style={{ backgroundColor: step.bgColor }}
              >
                {/* Icon Image at Top Right */}
                <img
                  src={step.iconUrl}
                  alt={`Step ${step.number} icon`}
                  className="absolute mt-2 mr-1 top-0 right-0 w-20 h-20 md:w-36 md:h-36 object-contain opacity-30"
                />

                {/* Step Number */}
                <div className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#123532] mb-3 md:mb-4">
                  {step.number}
                </div>

                {/* Step Title */}
                <h3 className="text-base md:text-xl lg:text-2xl font-semibold text-[#123532] leading-tight">
                  {step.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
