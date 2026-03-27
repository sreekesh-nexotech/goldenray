"use client";

export default function HowToChoose() {
  const guides = [
    {
      number: "01.",
      title: "Heat resistance is non-negotiable",
      description:
        "Kerala rooftop temps hit 55-65°C during peak hours. A panel's temperature coefficient tells you how much output drops per degree above 25°C. The difference between -0.30%/°C and -0.40%/°C can mean lakhs in lost generation over 25 years.",
    },
    {
      number: "02.",
      title: "Efficiency decides how much roof you need",
      description:
        "A 22% efficient panel generates the same power as a 17% panel — but uses 22% less roof space. If your Kerala rooftop is compact, higher efficiency means fitting a larger system without structural compromises.",
    },
    {
      number: "03.",
      title: "Warranty depth, not just duration",
      description:
        'Every brand offers "25-year warranty." But a product warranty covering defects for 12 years is different from one covering 25 years. In Kerala\'s humid climate, build quality gets tested hard. Check both product and performance warranty terms.',
    },
    {
      number: "04.",
      title: "Brand reliability means service access.",
      description:
        "A panel is a 25-year commitment. If the manufacturer exits India or stops your model, your warranty becomes paper. Prioritize brands with local manufacturing, Indian service centers, and a track record of honoring claims.",
    },
    {
      number: "05.",
      title: "Kerala Climate Score tells the real story",
      description:
        "Standard ratings are tested at 25°C in a lab. Kerala is not a lab. Our Climate Score weights humidity resistance, monsoon durability, real-world temperature impact, and tropical degradation. It's the only score that reflects actual rooftop performance.",
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#074A4D] mb-4 sm:mb-6">
            How to Choose the Right Solar Panel in Kerala
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Most comparison tools show you specs. We show you what those specs
            actually mean for your rooftop, your bill, and your next 25 years.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="space-y-4 sm:space-y-5 md:space-y-6">
          {/* First 3 cards - equal width */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {guides.slice(0, 3).map((guide, index) => (
              <div
                key={index}
                className="bg-[#074A4D] rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-7 lg:p-8
                           transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
              >
                <div className="mb-3 sm:mb-4">
                  <span className="text-white/80 text-base sm:text-lg font-light">
                    {guide.number}
                  </span>
                </div>
                <h3 className="text-white text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4 leading-snug">
                  {guide.title}
                </h3>
                <p className="text-white/70 text-xs sm:text-sm leading-relaxed">
                  {guide.description}
                </p>
              </div>
            ))}
          </div>

          {/* Last 2 cards - wider cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
            {guides.slice(3).map((guide, index) => (
              <div
                key={index + 3}
                className="bg-[#074A4D] rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-7 lg:p-8
                           transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
              >
                <div className="mb-3 sm:mb-4">
                  <span className="text-white/80 text-base sm:text-lg font-light">
                    {guide.number}
                  </span>
                </div>
                <h3 className="text-white text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4 leading-snug">
                  {guide.title}
                </h3>
                <p className="text-white/70 text-xs sm:text-sm leading-relaxed">
                  {guide.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
