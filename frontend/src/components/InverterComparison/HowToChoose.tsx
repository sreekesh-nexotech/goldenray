"use client";

export default function HowToChoose() {
  const guides = [
    {
      number: "01.",
      title: "Efficiency matters — but context matters more",
      description:
        "A 98% efficient inverter vs a 97.5% one means ~1.5% more energy captured daily. Over 25 years, that's real money. But if the 98% model costs 3x more, the ROI math changes. Compare total system cost, not just inverter efficiency.",
    },
    {
      number: "02.",
      title: "IP rating is critical in Kerala",
      description:
        "IP65 means dust-tight + water jets. IP66 adds heavier projection. Kerala's monsoons, humidity above 80%, and coastal salt air demand at least IP65 — preferably IP66 or higher for outdoor installation.",
    },
    {
      number: "03.",
      title: "Warranty = inverter replacement cost",
      description:
        "Inverters are the most likely component to fail in a 25-year solar system. A 5-year warranty means you'll consider replacing 1-2 inverters. A 15-year warranty covers most of the system's productive life. Factor replacement cost into your system's total investment calculation.",
    },
    {
      number: "04.",
      title: "Grid compatibility with KSEB",
      description:
        "Kerala's KSEB grid has voltage fluctuations, especially in rural districts. Your inverter needs a wide operating voltage range and anti-islanding protection. All inverters on this page are KSEB grid-compatible, but some handle fluctuations better than others.",
    },
    {
      number: "05.",
      title: "Monitoring isn't optional — it's essential",
      description:
        "If your inverter goes down and you don't know for 3 months, that's 3 months of lost generation and money. Every inverter here offers app-based monitoring. Enphase and SolarEdge offer panel-level monitoring; Sungrow and GoodWe offer system-level via cloud platforms.",
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#074A4D] mb-4 sm:mb-6">
            How to Choose the Right Solar Inverter in Kerala
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
            The inverter is the brain of your solar system. A bad choice here
            will cost you more than a bad panel choice.
          </p>
        </div>

        <div className="overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible snap-x snap-mandatory scrollbar-hide">
          <div className="flex gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-6 sm:gap-4 lg:gap-6 lg:justify-items-stretch">
            {guides.map((guide, index) => (
              <div
                key={index}
                className={`w-[88vw] max-w-[320px] sm:w-auto lg:max-w-none flex-shrink-0 sm:flex-shrink snap-start ${
                  index < 3 ? "lg:col-span-2" : "lg:col-span-3"
                }`}
              >
                <div className="bg-[#074A4D] rounded-2xl p-4 sm:p-5 md:p-6 lg:p-6 h-full transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
                  <div className="mb-3 sm:mb-4">
                    <span className="text-white/80 text-base sm:text-lg font-light">
                      {guide.number}
                    </span>
                  </div>
                  <h3 className="text-white text-base sm:text-lg md:text-lg font-semibold mb-3 sm:mb-4 leading-snug">
                    {guide.title}
                  </h3>
                  <p className="text-white/70 text-xs sm:text-sm leading-relaxed">
                    {guide.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
